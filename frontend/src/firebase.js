// src/firebase.js
// src/firebase.js
import { initializeApp } from "firebase/app";
import { getMessaging, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const messaging = getMessaging(app);

// 🔔 FOREGROUND PUSH → show real notification
if (typeof window !== "undefined" && "Notification" in window) {
  onMessage(messaging, (payload) => {
    console.log("🔥 Foreground push received:", payload);

    const title = payload.data?.title || "New Notification";
    const body = payload.data?.body || "";

    // Use service worker to show notification (reliable)
    navigator.serviceWorker.ready.then((registration) => {
      registration.showNotification(title, {
        body,
        data: { event_id: payload.data?.event_id },
      });
    });
  });
}
