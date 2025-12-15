from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings
from .models import Event
from datetime import timedelta


@shared_task
def send_event_invite_email(email, subject, message):
    print("\n===== EVENT INVITE EMAIL SENT =====")
    print("To:", email)
    print("Subject:", subject)
    print("Message:", message)
    print("===================================\n")

    send_mail(
        subject,
        message,
        settings.DEFAULT_FROM_EMAIL,
        [email],
        fail_silently=False,
    )



from celery import shared_task
from django.utils import timezone
from .models import EventInviteToken

@shared_task
def expire_old_invites():
    now = timezone.now()
    expired_tokens = EventInviteToken.objects.filter(
        expires_at__lt=now,
        used=False
    )

    count = expired_tokens.count()
    expired_tokens.update(used=True)

    print(f"[INVITE CLEANUP] Marked expired invites as used: {count}")


from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from django.core.mail import send_mail
from django.conf import settings

from .models import Event, EventTeamMember, DeviceToken
from .firebase import send_push_notification
from .utils import notify_user


@shared_task
def send_event_push_reminders():
    print("\n[CELERY TASK] send_event_push_reminders started")
    now = timezone.now()
    events = Event.objects.filter(is_active=True)
    print(f"[CELERY TASK] Checking {events.count()} active events at {now}")

    for event in events:
        diff = event.start_time - now
        total_seconds = diff.total_seconds()
        print(f"[CELERY TASK] Event: {event.name}, Start: {event.start_time}, Time until start: {diff} ({total_seconds} seconds)")

        # Only process future events
        if total_seconds <= 0:
            print(f"[CELERY TASK] Event '{event.name}' has already started or passed, skipping")
            continue

        # 1 hour before (between 55-65 minutes to account for timing)
        if timedelta(minutes=55).total_seconds() <= total_seconds <= timedelta(hours=1, minutes=5).total_seconds():
            # Check if we already sent 1-hour reminder (you might want to add a flag to prevent duplicates)
            print(f"[CELERY TASK] ⏰ Event '{event.name}' starts in ~1 hour - sending reminders")
            _send_reminders(event, f"Event '{event.name}' starts in 1 hour!", email=True)

        # 10 minutes before (between 8-12 minutes to account for timing)
        if timedelta(minutes=8).total_seconds() <= total_seconds <= timedelta(minutes=12).total_seconds():
            print(f"[CELERY TASK] ⏰ Event '{event.name}' starts in ~10 minutes - sending reminders")
            _send_reminders(event, f"Event '{event.name}' starts in 10 minutes!", email=False)
    
    print("[CELERY TASK] send_event_push_reminders completed\n")


def _send_reminders(event, message, email=False):
    print(f"\n[_SEND_REMINDERS] Event: {event.name}, Message: {message}")
    print(f"[_SEND_REMINDERS] Reminder type: {'1-hour reminder (with email)' if email else '10-minute reminder (no email)'}")
    
    # Check if we already sent this EXACT reminder (same message) for this event
    # Note: Different messages (e.g., "New Event Announced", "starts in 1 hour", "starts in 10 minutes")
    # are treated as separate notifications and will all be sent
    from .models import Notification
    from accounts.models import User
    
    # Quick check: if ANY notification with this EXACT message exists for this event, skip entirely
    # This prevents duplicates of the SAME reminder type, but allows different reminder types
    existing_count = Notification.objects.filter(
        event=event,
        message=message
    ).count()
    
    if existing_count > 0:
        print(f"[_SEND_REMINDERS] ⚠️ This exact reminder already sent for event '{event.name}' with message '{message}' ({existing_count} notifications exist). Skipping to prevent duplicates.")
        print(f"[_SEND_REMINDERS] ✅ Other reminder types (different messages) will still work independently.")
        return
    
    # Get all active users for notifications (always send to all users)
    all_users = User.objects.filter(is_active=True)
    print(f"[_SEND_REMINDERS] Sending notifications to ALL {all_users.count()} active users for event '{event.name}'")

    # Save in-app notifications to ALL users
    # Since we checked above, we know no duplicates exist, so we can create directly
    notification_count = 0
    for user in all_users:
        try:
            notify_user(user, message, event=event)
            notification_count += 1
        except Exception as e:
            print(f"[_SEND_REMINDERS] ERROR creating notification for {user.email}: {e}")
    
    print(f"[_SEND_REMINDERS] Created {notification_count} notifications for all users\n")

    # PUSH TOKENS - send to all users with device tokens
    all_tokens = list(
        DeviceToken.objects.filter(user__in=all_users).values_list("token", flat=True)
    )
    
    if all_tokens:
        try:
            send_push_notification(
                title=event.name,
                body=message,
                tokens=all_tokens
            )
            print(f"[_SEND_REMINDERS] Sent push notification to {len(all_tokens)} devices\n")
        except Exception as e:
            print(f"[_SEND_REMINDERS] Push notification error: {e}\n")

    # EMAIL ONLY 1 HOUR BEFORE - and only to ACCEPTED members
    # Check if email was already sent by checking if notification exists for accepted members
    if email:
        accepted_members = EventTeamMember.objects.filter(
            team__event=event,
            status="ACCEPTED",
            user__isnull=False
        )
        print(f"[_SEND_REMINDERS] Checking email for {accepted_members.count()} accepted members")
        
        email_count = 0
        email_skipped = 0
        for member in accepted_members:
            # Check if notification already exists (indicates email was already sent)
            existing_notif = Notification.objects.filter(
                user=member.user,
                event=event,
                message=message
            ).first()
            
            if existing_notif:
                email_skipped += 1
                print(f"[_SEND_REMINDERS] Email skipped for {member.user.email} (notification already exists)")
                continue
            
            try:
                send_mail(
                    subject=f"[Reminder] {event.name}",
                    message=message,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[member.user.email]
                )
                email_count += 1
                print(f"[_SEND_REMINDERS] Email sent to {member.user.email}")
            except Exception as e:
                print(f"[_SEND_REMINDERS] Email error for {member.user.email}: {e}")
        
        print(f"[_SEND_REMINDERS] Email reminders: {email_count} sent, {email_skipped} skipped (duplicates)\n")


@shared_task
def cleanup_old_read_notifications():
    """
    Auto-delete task that runs at midnight once a month.
    Deletes notifications that are:
    - Already read (is_read=True)
    - Created more than 2 days ago
    """
    from .models import Notification
    
    print("\n[CLEANUP TASK] cleanup_old_read_notifications started")
    now = timezone.now()
    cutoff_date = now - timedelta(days=2)
    
    # Find notifications that are read AND older than 2 days
    old_read_notifications = Notification.objects.filter(
        is_read=True,
        created_at__lt=cutoff_date
    )
    
    count = old_read_notifications.count()
    print(f"[CLEANUP TASK] Found {count} read notifications older than 2 days (created before {cutoff_date})")
    
    if count > 0:
        old_read_notifications.delete()
        print(f"[CLEANUP TASK] ✅ Deleted {count} old read notifications")
    else:
        print(f"[CLEANUP TASK] No old read notifications to delete")
    
    print("[CLEANUP TASK] cleanup_old_read_notifications completed\n")
