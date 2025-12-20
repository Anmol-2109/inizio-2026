from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import RegisterSerializer, VerifyOTPSerializer, LoginSerializer,ResetPasswordSerializer,VerifyResetOTPSerializer,ForgotPasswordSerializer,GoogleLoginSerializer
from .models import Profile,User,EmailOTP
from datetime import timedelta 
from django.utils import timezone
from django.contrib.auth.hashers import make_password


import random   # <-- This is correct

# Import utility to attach pending team members
try:
    from events.utils import attach_pending_team_members
except ImportError:
    # If events app is not available, define a no-op function
    def attach_pending_team_members(user):
        pass


class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {"detail": "User created. OTP sent to email."},
            status=status.HTTP_201_CREATED
        )


class VerifyOTPView(generics.GenericAPIView):
    serializer_class = VerifyOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        # Auto-attach user to pending team memberships (fixes bug where user signs up after being invited)
        attach_pending_team_members(user)

        refresh = RefreshToken.for_user(user)
        return Response(
            {
                "detail": "Email verified successfully.",
                "access": str(refresh.access_token),
                "refresh": str(refresh),
                "profile_complete": user.is_profile_complete,
                "is_staff": user.is_staff
            },
            status=status.HTTP_200_OK
        )   


class LoginView(generics.GenericAPIView):
    serializer_class = LoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']

        # Auto-attach user to pending team memberships (fixes bug where user signs up after being invited)
        attach_pending_team_members(user)

        refresh = RefreshToken.for_user(user)
        return Response(
        {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "profile_complete": user.is_profile_complete,
            "is_staff": user.is_staff
        },
        status=status.HTTP_200_OK
)


from rest_framework.permissions import IsAuthenticated
from .serializers import ProfileSerializer

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = ProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        # Ensure profile exists, create if it doesn't
        profile, created = Profile.objects.get_or_create(user=self.request.user)
        return profile

from rest_framework.views import APIView


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()

            return Response({"detail": "Logout successful"}, status=status.HTTP_205_RESET_CONTENT)
        except Exception:
            return Response({"error": "Invalid refresh token"}, status=status.HTTP_400_BAD_REQUEST)
        


class ResendOTPView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get("email")
        if not email:
            return Response({"error": "Email required"}, status=400)

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            return Response({"error": "User not found"}, status=404)

        if user.is_active:
            return Response({"error": "Already verified"}, status=400)

        # generate new OTP
        otp_code = f"{random.randint(100000, 999999)}"
        expires_at = timezone.now() + timedelta(minutes=10)

        EmailOTP.objects.filter(
            user=user, purpose='register', is_used=False
        ).update(is_used=True)

        EmailOTP.objects.create(
            user=user,
            code=make_password(otp_code),
            purpose="register",
            expires_at=expires_at
        )

        from .tasks import send_otp_email
        subject = "Resend OTP - I&E Cell"
        message = f"Your OTP is {otp_code}"
        send_otp_email.delay(user.email, subject, message)

        return Response({"detail": "OTP resent"}, status=200)


class ForgotPasswordView(generics.GenericAPIView):
    serializer_class = ForgotPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "OTP sent to email"}, status=200)


class VerifyResetOTPView(generics.GenericAPIView):
    serializer_class = VerifyResetOTPSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.save()

        return Response({
            "detail": "OTP verified successfully.",
            "reset_token": data["reset_token"],
            "email": data["email"]
        }, status=200)

class ResetPasswordView(generics.GenericAPIView):
    serializer_class = ResetPasswordSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"detail": "Password reset successful. Please login."}, status=200)



class GoogleLoginView(generics.GenericAPIView):
    serializer_class = GoogleLoginSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()

        refresh = RefreshToken.for_user(user)

        return Response({
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "profile_complete": user.is_profile_complete,
            "email": user.email,
            "full_name": user.full_name
        }, status=200)
