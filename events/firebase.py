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

    key_path = getattr(settings, "FIREBASE_KEY_PATH", None)

    if not key_path or not os.path.exists(key_path):
        print("⚠ Firebase disabled (serviceAccountKey.json not found)")
        return

    cred = credentials.Certificate(key_path)
    firebase_admin.initialize_app(cred)
    _firebase_initialized = True


def send_push_notification(title, body, tokens):
    init_firebase()

    if not firebase_admin._apps:
        print("⚠ Push skipped (Firebase not initialized)")
        return

    message = messaging.MulticastMessage(
        notification=messaging.Notification(title=title, body=body),
        tokens=tokens
    )
    return messaging.send_multicast(message)
