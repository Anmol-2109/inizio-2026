# from celery import shared_task
# from django.core.mail import send_mail
# from django.conf import settings
# from .models import ResetPasswordToken
# # @shared_task
# # def send_otp_email(email, subject, message):
# #     send_mail(
# #         subject,
# #         message,
# #         settings.DEFAULT_FROM_EMAIL,
# #         [email],
# #         fail_silently=False,
# #     )


# from celery import shared_task
# from django.core.mail import send_mail

# @shared_task
# def send_otp_email(email, subject, message):

#     # Still uses console backend → shows full email format also
#     send_mail(
#         subject=subject,
#         message=message,
#         from_email=settings.DEFAULT_FROM_EMAIL,
#         recipient_list=[email],
#         fail_silently=False,
#     )
#     return f"OTP email sent to {email}"




# from celery import shared_task
# from django.utils import timezone
# from .models import EmailOTP

# def cleanup_expired_otps():
#     expired = EmailOTP.objects.filter(
#         expires_at__lt=timezone.now(),
#         is_used=True
#     )
#     count = expired.count()
#     expired.delete()
#     return f"Deleted expired OTPs: {count}"


# @shared_task
# def cleanup_reset_tokens():
#     deleted_count, _ = ResetPasswordToken.objects.filter(
#         expires_at__lt=timezone.now()
#     ).delete()
#     return f"Deleted reset tokens: {deleted_count}"


from celery import shared_task
from django.conf import settings
from django.utils import timezone
from .models import ResetPasswordToken, EmailOTP
import resend

# Initialize Resend
resend.api_key = settings.RESEND_API_KEY


@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={"max_retries": 3, "countdown": 5})
def send_otp_email(self, email, subject, message):
    """
    Send OTP email using Resend (Railway compatible)
    """
    resend.Emails.send({
        "from": "INIZIO <no-reply@inizio.org.in>",
        "to": [email],
        "subject": subject,
        "html": f"<p>{message}</p>",
    })
    return f"OTP email sent to {email}"


@shared_task
def cleanup_expired_otps():
    expired = EmailOTP.objects.filter(
        expires_at__lt=timezone.now(),
        is_used=True
    )
    count = expired.count()
    expired.delete()
    return f"Deleted expired OTPs: {count}"


@shared_task
def cleanup_reset_tokens():
    deleted_count, _ = ResetPasswordToken.objects.filter(
        expires_at__lt=timezone.now()
    ).delete()
    return f"Deleted reset tokens: {deleted_count}"
