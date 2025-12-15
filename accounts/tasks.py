from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import ResetPasswordToken
# @shared_task
# def send_otp_email(email, subject, message):
#     send_mail(
#         subject,
#         message,
#         settings.DEFAULT_FROM_EMAIL,
#         [email],
#         fail_silently=False,
#     )


from celery import shared_task
from django.core.mail import send_mail

@shared_task
def send_otp_email(email, subject, message):
    # 🔥 Console logging (This is what you want)
    print("\n========== OTP LOG ==========")
    print(f"📩 Email To: {email}")
    print(f"📝 Subject: {subject}")

    # Extract only digits as OTP (nice clean display)
    otp = ''.join(filter(str.isdigit, message))
    print(f"🔐 OTP Code: {otp}")
    print("=============================\n")

    # Still uses console backend → shows full email format also
    send_mail(subject, message, None, [email], fail_silently=False)

    return "OTP Sent to Console"




from celery import shared_task
from django.utils import timezone
from .models import EmailOTP

@shared_task
def cleanup_expired_otps():
    expired = EmailOTP.objects.filter(expires_at__lt=timezone.now())
    count = expired.count()
    expired.delete()
    print(f"[OTP CLEANER] Deleted expired OTPs: {count}")


@shared_task
def cleanup_reset_tokens():
    from django.utils import timezone
    deleted_count, _ = ResetPasswordToken.objects.filter(
        expires_at__lt=timezone.now()  # expired
    ).delete()

    print(f"[TOKEN CLEANER] Deleted expired tokens: {deleted_count}")