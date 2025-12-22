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

def send_push_notification(title, body, tokens, event_id=None):
    init_firebase()

    if not firebase_admin._apps:
        print("⚠ Push skipped (Firebase not initialized)")
        return

    if not tokens:
        print("⚠ No FCM tokens found")
        return

    data_payload = {}
    if event_id:
        data_payload["event_id"] = str(event_id)

    messages = []

    for token in tokens:
        messages.append(
            messaging.Message(
                notification=messaging.Notification(
                    title=title,
                    body=body,
                ),
                data=data_payload,
                token=token,
            )
        )

    response = messaging.send_all(messages)
    print(f"[ADMIN EVENT CREATED] Sent push notification to {response.success_count} devices")

    return response
