from django.urls import path
from .views import RegisterView, VerifyOTPView, LoginView , ProfileView ,LogoutView , ResendOTPView , ForgotPasswordView,VerifyResetOTPView,ResetPasswordView





urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('verify-otp/', VerifyOTPView.as_view(), name='verify-otp'),
    path('login/', LoginView.as_view(), name='login'),
    path('profile/', ProfileView.as_view(), name='profile'),
    path("logout/", LogoutView.as_view(), name="logout"),
    path("resend-otp/", ResendOTPView.as_view()),
    path("forgot-password/", ForgotPasswordView.as_view(), name="forgot-password"),
    path("verify-reset-otp/", VerifyResetOTPView.as_view(), name="verify-reset-otp"),
    path("reset-password/", ResetPasswordView.as_view(), name="reset-password"),



]
