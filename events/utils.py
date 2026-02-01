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


import gspread
from google.oauth2.service_account import Credentials
from django.conf import settings
import os
import json

import re

def safe_sheet_name(name: str) -> str:
    name = re.sub(r"[\\/?*[\]]", "", name)
    return name[:90]

def get_or_create_event_worksheet(spreadsheet, event_name, headers):
    safe_name = safe_sheet_name(event_name)

    try:
        worksheet = spreadsheet.worksheet(safe_name)
        return worksheet, False
    except Exception:
        worksheet = spreadsheet.add_worksheet(
            title=safe_name,
            rows="1000",
            cols=str(len(headers))
        )
        worksheet.append_row(headers)
        return worksheet, True



import gspread
from google.oauth2.service_account import Credentials
from django.conf import settings
import os
import json


def get_spreadsheet():
    scope = ["https://www.googleapis.com/auth/spreadsheets"]

    # -------------------------------
    # 1️⃣ Load credentials
    # -------------------------------
    if os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON"):
        # 🚀 Railway / Production
        creds_info = json.loads(os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON"))
        creds = Credentials.from_service_account_info(
            creds_info, scopes=scope
        )
    else:
        # 🧪 Localhost
        creds = Credentials.from_service_account_file(
            os.path.join(settings.BASE_DIR, "google_credentials.json"),
            scopes=scope
        )

    client = gspread.authorize(creds)

    # -------------------------------
    # 2️⃣ Open spreadsheet by ID
    # -------------------------------
    spreadsheet_id = os.getenv("GOOGLE_SPREADSHEET_ID")
    if not spreadsheet_id:
        raise RuntimeError("GOOGLE_SPREADSHEET_ID is not set")

    return client.open_by_key(spreadsheet_id)
