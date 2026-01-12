from rest_framework import serializers
from django.utils import timezone
from .models import User, EmailOTP ,Profile,ResetPasswordToken
from datetime import timedelta
import random
import uuid
from django.contrib.auth.hashers import make_password
import re


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=6)

    class Meta:
        model = User
        fields = ['email', 'full_name', 'password']
        extra_kwargs = {
            'email': {'validators': []}  # ⬅ VERY IMPORTANT FIX
        }

    def validate_email(self, value):
        user = User.objects.filter(email=value).first()
        if user and user.is_active:
            raise serializers.ValidationError("This email is already registered & verified.")
        return value
    
    def validate_full_name(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("Name too short.")
        if len(value) > 100:
            raise serializers.ValidationError("Name too long.")
        return value


    def create(self, validated_data):
        email = validated_data['email']
        full_name = validated_data.get('full_name', "")
        password = validated_data['password']

        existing_user = User.objects.filter(email=email).first()

        if existing_user:
            # Update existing unverified user
            existing_user.full_name = full_name
            existing_user.set_password(password)
            existing_user.save()
            user = existing_user
        else:
            # Create new unverified user
            user = User.objects.create_user(
                email=email,
                full_name=full_name,
                password=password,
                is_active=False
            )

        # Generate OTP
        otp_code = f"{random.randint(100000, 999999)}"
        expires_at = timezone.now() + timedelta(minutes=10)

        # Soft delete old OTPs
        EmailOTP.objects.filter(user=user, purpose='register', is_used=False).update(is_used=True)

        EmailOTP.objects.create(
            user=user,
            code=make_password(otp_code),
            purpose='register',
            expires_at=expires_at
        )

        # Send email
        from .tasks import send_otp_email
        subject = "Verify your email - I&E Cell"
        message = f"Your OTP is {otp_code}. It expires in 10 minutes."
        send_otp_email.delay(user.email, subject, message)

        return user


class VerifyOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get('email')
        code = attrs.get('code')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        try:
            otp = EmailOTP.objects.filter(
                user=user,
                purpose='register',
                is_used=False
            ).latest('created_at')
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP")

        if not otp.is_valid():
            raise serializers.ValidationError("OTP expired or already used")

        if not otp.verify(code):
            raise serializers.ValidationError("Invalid OTP")

        attrs['user'] = user
        attrs['otp'] = otp
        return attrs


    def save(self, **kwargs):
        user = self.validated_data['user']
        otp = self.validated_data['otp']
        user.is_active = True
        user.save()
        otp.is_used = True
        otp.save()
        return user


class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        email = attrs.get('email')
        password = attrs.get('password')

        # Get user by email (since USERNAME_FIELD is email)
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("Invalid credentials")

        # Check password manually
        if not user.check_password(password):
            raise serializers.ValidationError("Invalid credentials")

        if not user.is_active:
            raise serializers.ValidationError("Account not active. Please verify email.")

        attrs['user'] = user
        return attrs


class ProfileSerializer(serializers.ModelSerializer):
    full_name = serializers.CharField(source="user.full_name", required=True,min_length=3,max_length=100)
    email = serializers.EmailField(source="user.email", read_only=True)
    is_staff = serializers.BooleanField(source="user.is_staff", read_only=True)
    
    class Meta:
        model = Profile
        fields = ["full_name", "email", "department", "year","college_name", "phone", "is_staff"]

    def validate_full_name(self, value):
        value = value.strip()

        if not re.match(r"^[A-Za-z ]+$", value):
            raise serializers.ValidationError(
                "Name can contain only letters and spaces."
            )

        if re.search(r"(.)\1{2,}", value):
            raise serializers.ValidationError(
                "Name contains too many repeated characters."
            )

        return value

    def validate_college_name(self, value):
        value = value.strip()
        if len(value) < 3:
            raise serializers.ValidationError("College name is too short.")
        if len(value) > 150:
            raise serializers.ValidationError("College name is too long.")
        return value
    
    def validate_phone(self, value):
        value = value.strip()
        if not re.fullmatch(r"[6-9]\d{9}", value):
            raise serializers.ValidationError(
                "Phone number must be a valid 10-digit Indian number."
            )
        return value
    
    def validate_year(self, value):
       value = value.strip()

       allowed = {
        "1st year",
        "2nd year",
        "3rd year",
        "4th year",
        "5th year",
    }

       if value.lower() not in allowed:
           raise serializers.ValidationError(
            "Year must be one of: 1st Year, 2nd Year, 3rd Year, 4th Year, 5th Year."
        )

       return value
    
    def validate(self, attrs):
        """
        Global sanity check to block obvious spam patterns
        """
        full_name = attrs.get("user", {}).get("full_name", "")
        if re.search(r"(.)\1{5,}", full_name):
            raise serializers.ValidationError("Invalid name format.")

        return attrs

    def update(self, instance, validated_data):
        user_data = validated_data.pop("user", {})
        instance.user.full_name = user_data.get("full_name", instance.user.full_name)
        instance.user.is_profile_complete = True  # mark complete here
        instance.user.save()
        
        return super().update(instance, validated_data)



class ForgotPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()

    def validate(self, attrs):
        email = attrs.get('email')
        try:
            user = User.objects.get(email=email, is_active=True)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found or not verified.")
        attrs['user'] = user
        return attrs

    def save(self, **kwargs):
        user = self.validated_data['user']

        # Generate OTP
        otp_code = f"{random.randint(100000, 999999)}"
        expires_at = timezone.now() + timedelta(minutes=10)

        # Invalidate old OTP
        EmailOTP.objects.filter(
            user=user,
            purpose='reset_password',
            is_used=False
        ).update(is_used=True)

        EmailOTP.objects.create(
            user=user,
            code=make_password(otp_code),

            purpose='reset_password',
            expires_at=expires_at
        )

        from .tasks import send_otp_email
        subject = "Reset Password OTP - Inizio"
        message = f"Your OTP is {otp_code}. It expires in 10 minutes."
        send_otp_email.delay(user.email, subject, message)

        return user


class VerifyResetOTPSerializer(serializers.Serializer):
    email = serializers.EmailField()
    code = serializers.CharField(max_length=6)

    def validate(self, attrs):
        email = attrs.get('email')
        code = attrs.get('code')

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        try:
            otp = EmailOTP.objects.filter(
            user=user,
            purpose='reset_password',
            is_used=False
            ).latest('created_at')
        except EmailOTP.DoesNotExist:
            raise serializers.ValidationError("Invalid OTP")

        if not otp.is_valid():
            raise serializers.ValidationError("OTP expired or already used")

        if not otp.verify(code):
            raise serializers.ValidationError("Invalid OTP")

        attrs['user'] = user
        attrs['otp'] = otp
        return attrs


    def save(self, **kwargs):
        user = self.validated_data['user']  # <-- You forgot this
        otp = self.validated_data['otp']

    # Mark OTP as used NOW
        otp.is_used = True
        otp.save()

    # Create new reset password token entry
        reset_token = ResetPasswordToken.objects.create(
            user=user,
            token=str(uuid.uuid4()),
            expires_at=timezone.now() + timedelta(minutes=10)  # Token valid 10 min
        )

        return {
            "email": user.email,
            "reset_token": reset_token.token
        }

class ResetPasswordSerializer(serializers.Serializer):
    email = serializers.EmailField()
    reset_token = serializers.CharField()
    new_password = serializers.CharField(write_only=True, min_length=6)

    def validate(self, attrs):
        email = attrs.get("email")
        token = attrs.get("reset_token")

        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")

        try:
            token_entry = ResetPasswordToken.objects.get(
                user=user,
                token=token,
                used=False,
                expires_at__gt=timezone.now()
            )
        except ResetPasswordToken.DoesNotExist:
            raise serializers.ValidationError("Invalid or expired reset token")

        attrs["user"] = user
        attrs["token_entry"] = token_entry
        return attrs

    def save(self, **kwargs):
        user = self.validated_data["user"]
        token_entry = self.validated_data["token_entry"]
        new_password = self.validated_data["new_password"]

        # Mark token as used
        token_entry.used = True
        token_entry.save()

        # Change password
        user.set_password(new_password)
        user.save()

        # Delete old tokens to avoid reuse
        ResetPasswordToken.objects.filter(user=user, used=False).delete()

        return user


from .google_auth import verify_google_token

class GoogleLoginSerializer(serializers.Serializer):
    token = serializers.CharField()

    def validate(self, attrs):
        token = attrs.get("token")
        payload = verify_google_token(token)

        if not payload:
            raise serializers.ValidationError("Invalid Google Token")

        attrs["payload"] = payload
        return attrs

    def create(self, validated_data):
        payload = validated_data["payload"]
        email = payload["email"]
        full_name = payload.get("name", "")

        user, created = User.objects.get_or_create(email=email)

        if created:
            user.full_name = full_name
            user.is_active = True
            user.save()

        return user
