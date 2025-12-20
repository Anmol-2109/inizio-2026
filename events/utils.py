from .models import Notification, EventTeamMember
import logging


def notify_user(user, message, event=None):
    """
    Create an in-app notification for a user (only if it doesn't already exist).
    
    This function ensures:
    - Each user gets exactly ONE notification per message type per event
    - Different messages (e.g., "New Event", "1 hour", "10 minutes") are separate notifications
    - Prevents duplicates when Celery task runs multiple times within the time window
    """
    # Check if notification with same message and event already exists for this user
    # This prevents duplicate notifications when Celery task runs multiple times
    existing = Notification.objects.filter(
        user=user,
        message=message,
        event=event
    ).first()
    
    if existing:
        print(f"[NOTIFICATION SKIPPED] User: {user.email}, Message: '{message}' already exists (ID: {existing.id})")
        return existing
    
    # Create new notification only if it doesn't exist
    notification = Notification.objects.create(
        user=user,
        message=message,
        event=event
    )
    print(f"[NOTIFICATION CREATED] User: {user.email}, Message: '{message}', Event: {event.name if event else 'None'}, ID: {notification.id}")
    return notification


def attach_pending_team_members(user):
    """
    Link EventTeamMember rows created by email
    to the actual User after signup/login.
    This fixes the bug where users who sign up after being invited
    can't see their team memberships.
    """
    EventTeamMember.objects.filter(
        user__isnull=True,
        email__iexact=user.email,
        status__in=["PENDING", "ACCEPTED"]
    ).update(user=user)
