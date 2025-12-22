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


def send_push_notification(title, body, tokens, event_id=None):
    init_firebase()

    if not firebase_admin._apps:
        print("⚠ Push skipped (Firebase not initialized)")
        return

    data_payload = {}
    if event_id:
        data_payload["event_id"] = str(event_id)

    message = messaging.MulticastMessage(
        notification=messaging.Notification(
            title=title,
            body=body,
        ),
        data=data_payload,   # 👈 THIS IS STEP 6
        tokens=tokens,
    )

    return messaging.send_multicast(message)