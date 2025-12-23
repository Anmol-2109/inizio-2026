// import { getToken } from "firebase/messaging";
// import { messaging } from "../firebase";
// import api from "../api/apiClient";

// export async function registerForPush() {
//   try {
//     // Ask permission
//     const permission = await Notification.requestPermission();
//     if (permission !== "granted") {
//       console.log("🔕 Notification permission denied");
//       return;
//     }

//     // Get FCM token
//     const token = await getToken(messaging, {
//       vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
//     });

//     if (!token) {
//       console.log("⚠ No FCM token generated");
//       return;
//     }

//     // Send to backend
//     await api.post("/events/save-device-token/", { token });

//     console.log("✅ Device token saved");
//   } catch (err) {
//     console.error("Push registration failed", err);
//   }
// }

import { getToken } from "firebase/messaging";
import { messaging } from "../firebase";
import api from "../api/apiClient";

export async function registerForPush() {
  try {
    // ✅ 1. Register service worker FIRST
    let registration = null;

    if ("serviceWorker" in navigator) {
      registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw-v2.js"   // 👈 NEW SW FILE
      );
      console.log("✅ Service Worker registered:", registration);
    }

    // ✅ 2. Ask permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      console.log("🔕 Notification permission denied");
      return;
    }

    // ✅ 3. Get FCM token (bind to SW)
    const token = await getToken(messaging, {
      vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
      serviceWorkerRegistration: registration, // 👈 IMPORTANT
    });

    if (!token) {
      console.log("⚠ No FCM token generated");
      return;
    }

    // ✅ 4. Send token to backend
    await api.post("/events/save-device-token/", { token });

    console.log("✅ Device token saved");
  } catch (err) {
    console.error("❌ Push registration failed", err);
  }
}
