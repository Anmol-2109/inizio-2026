# events/firebase.py
import os
from firebase_admin import credentials, messaging
import firebase_admin
from django.conf import settings

_firebase_initialized = False

def init_firebase():
    global _firebase_initialized
    if _firebase_initialized:
        return

    key_path = settings.FIREBASE_KEY_PATH
    if not key_path or not os.path.exists(key_path):
        print("⚠ Firebase disabled (serviceAccountKey.json not found)")
        return

    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)
    _firebase_initialized = True


from firebase_admin import messaging

from firebase_admin import messaging
import firebase_admin

def send_push_notification(title, body, tokens, event_id=None):
    init_firebase()

    if not firebase_admin._apps:
        print("⚠ Push skipped (Firebase not initialized)")
        return

    if not tokens:
        print("⚠ No FCM tokens found")
        return

    # ✅ DATA-ONLY MESSAGE
    data_payload = {
        "title": title,
        "body": body,
    }

    if event_id:
        data_payload["event_id"] = str(event_id)

    message = messaging.MulticastMessage(
        tokens=tokens,
        data=data_payload
    )

    response = messaging.send_each_for_multicast(message)

    print(
        f"[ADMIN EVENT CREATED] "
        f"Sent push notification to {response.success_count} devices, "
        f"failed: {response.failure_count}"
    )

    return response
