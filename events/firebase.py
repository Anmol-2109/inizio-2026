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

from firebase_admin import messaging

def send_push_notification(title, body, tokens, event_id=None):
    init_firebase()

    if not firebase_admin._apps or not tokens:
        return

    data_payload = {
        "title": title,
        "body": body,
        "event_id": str(event_id),
    }

    message = messaging.MulticastMessage(
        tokens=tokens,
        data=data_payload
    )

    response = messaging.send_each_for_multicast(message)

    print(
        f"[ADMIN EVENT CREATED] Sent push notification to "
        f"{response.success_count} devices, failed: {response.failure_count}"
    )

    # 🔥 CLEANUP DEAD TOKENS
    for idx, resp in enumerate(response.responses):
        if not resp.success:
            failed_token = tokens[idx]
            error = resp.exception
            print(f"❌ Removing dead token: {failed_token[:20]}... Reason: {error}")

            from .models import DeviceToken
            DeviceToken.objects.filter(token=failed_token).delete()

    return response
