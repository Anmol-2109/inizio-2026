// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
// importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

// firebase.initializeApp({
//   apiKey: "...",
//   authDomain: "...",
//   projectId: "...",
//   messagingSenderId: "...",
//   appId: "..."
// });

// const messaging = firebase.messaging();

// messaging.onBackgroundMessage(function(payload) {
//   const title = payload.notification.title;
//   const options = {
//     body: payload.notification.body,
//     data: payload.data,   // contains event_id
//   };

//   self.registration.showNotification(title, options);
// });

// self.addEventListener("notificationclick", function(event) {
//   event.notification.close();
//   const eventId = event.notification.data?.event_id;

//   if (eventId) {
//     event.waitUntil(
//       clients.openWindow(`/events/${eventId}`)
//     );
//   }
// });

importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/9.23.0/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  messagingSenderId: "...",
  appId: "..."
});

const messaging = firebase.messaging();

// 🔔 DATA-ONLY background message
messaging.onBackgroundMessage(function (payload) {
  console.log("🔥 BG MESSAGE:", payload);

  const title = payload.data?.title || "New Event";
  const body = payload.data?.body || "";
  const eventId = payload.data?.event_id;

  const options = {
    body,
    data: { event_id: eventId },
  };

  self.registration.showNotification(title, options);
});

// 🖱️ CLICK HANDLER (will ALWAYS fire now)
self.addEventListener("notificationclick", function (event) {
  console.log("notification clicked");
  event.notification.close();

  const eventId = event.notification?.data?.event_id;
  if (!eventId) return;

  const url = `${self.location.origin}/events/${eventId}`;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if ("focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        return clients.openWindow(url);
      })
  );
});
