from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
import resend
resend.api_key = settings.RESEND_API_KEY

from .models import (
    Event,
    EventInviteToken,
    EventTeamMember,
    DeviceToken,
    Notification,
)
from accounts.models import User
from .firebase import send_push_notification
from .utils import notify_user


@shared_task(
    bind=True,
    autoretry_for=(Exception,),
    retry_kwargs={"max_retries": 3, "countdown": 5},
)
def send_resend_email(self, email, subject, message):
    """
    Generic Resend email sender (INIZIO account)
    """
    resend.Emails.send({
        "from": "INIZIO <no-reply@inizio.org.in>",
        "to": [email],
        "subject": subject,
        "html": f"<p>{message}</p>",
    })
# ==========================================================
# 1️⃣ INVITE EMAIL TASK (FIX 11)
# ==========================================================
import logging
logger = logging.getLogger(__name__)

@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={"max_retries": 3, "countdown": 5})
def send_event_invite_email(self, email, subject, message):
    try:
        resend.Emails.send({
            "from": "INIZIO <no-reply@inizio.org.in>",
            "to": [email],
            "subject": subject,
            "html": f"<p>{message}</p>",
        })
    except Exception as e:
        logger.error(f"Invite email failed for {email}: {e}")
        raise self.retry(exc=e)


# ==========================================================
# 2️⃣ EXPIRE OLD INVITES
# ==========================================================
@shared_task
def expire_old_invites():
    now = timezone.now()
    expired = EventInviteToken.objects.filter(
        expires_at__lt=now,
        used=False
    )
    expired.update(used=True)


# ==========================================================
# 3️⃣ MAIN ORCHESTRATOR TASK (FIX 12)
# ==========================================================
@shared_task
def send_event_push_reminders():
    """
    This task ONLY decides WHEN to send reminders.
    It does NOT send emails or notifications directly.
    """
    now = timezone.now()
    events = Event.objects.filter(is_active=True)

    for event in events:
        seconds_left = (event.start_time - now).total_seconds()

        if seconds_left <= 0:
            continue

        # ⏰ 1 hour reminder
        if 55 * 60 <= seconds_left <= 65 * 60:
            process_event_reminder.delay(
                event.id,
                f"Event '{event.name}' starts in 1 hour!",
                send_email=True
            )

        # ⏰ 10 minute reminder
        if 8 * 60 <= seconds_left <= 12 * 60:
            process_event_reminder.delay(
                event.id,
                f"Event '{event.name}' starts in 10 minutes!",
                send_email=False
            )


# ==========================================================
# 4️⃣ REMINDER PROCESSOR (PURE LOGIC)
# ==========================================================
@shared_task
def process_event_reminder(event_id, message, send_email=False):
    """
    This task performs:
    - in-app notifications
    - push notifications
    - optional email
    """
    event = Event.objects.get(id=event_id)

    # 🔐 Deduplication (CRITICAL)
    if Notification.objects.filter(event=event, message=message).exists():
        return

    users = User.objects.filter(is_active=True)

    # In-app notifications
    for user in users:
        notify_user(user, message, event=event)

    # Push notifications
    tokens = list(
        DeviceToken.objects.filter(user__in=users)
        .values_list("token", flat=True)
    )
    if tokens:
        send_push_notification(
            title=event.name,
            body=message,
            tokens=tokens,
            event_id=event.id 
        )

    # Email (only 1-hour reminder)
    if send_email:
        accepted_members = EventTeamMember.objects.filter(
            team__event=event,
            status="ACCEPTED",
            user__isnull=False
        )

        for member in accepted_members:
            send_event_reminder_email.delay(
                member.user.email,
                event.name,
                message
            )


# ==========================================================
# 5️⃣ REMINDER EMAIL TASK (SEPARATE, RETRY-SAFE)
# ==========================================================
@shared_task(bind=True, autoretry_for=(Exception,), retry_kwargs={"max_retries": 3})
def send_event_reminder_email(self, email, event_name, message):
    subject = f"[Reminder] {event_name}"
    send_resend_email.delay(email, subject, message)


# ==========================================================
# 6️⃣ CLEANUP READ NOTIFICATIONS
# ==========================================================
@shared_task
def cleanup_old_read_notifications():
    cutoff = timezone.now() - timedelta(days=2)
    Notification.objects.filter(
        is_read=True,
        created_at__lt=cutoff
    ).delete()
