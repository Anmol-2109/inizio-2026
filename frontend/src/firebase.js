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

// 🔔 TEST FIRST: ALERT ONLY
if (typeof window !== "undefined") {
  onMessage(messaging, (payload) => {
    alert("🔥 FOREGROUND MESSAGE RECEIVED");
    console.log("PAYLOAD:", payload);
  });
}
