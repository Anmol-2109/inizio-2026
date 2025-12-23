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

// 🔹 Firebase web config (PUBLIC keys – safe)
firebase.initializeApp({
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  messagingSenderId: "...",
  appId: "..."
});

const messaging = firebase.messaging();

// 🔔 Handle background messages
messaging.onBackgroundMessage(function (payload) {
  const title = payload.notification?.title || "New Notification";

  const options = {
    body: payload.notification?.body,
    data: payload.data, // contains event_id
  };

  self.registration.showNotification(title, options);
});

// 🖱️ Handle notification click
self.addEventListener("notificationclick", function (event) {
  event.notification.close();

  const eventId = event.notification?.data?.event_id;
  if (!eventId) return;

  const url = `/events/${eventId}`;

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true })
      .then((clientList) => {
        for (const client of clientList) {
          if (client.url.includes(self.location.origin) && "focus" in client) {
            client.navigate(url);
            return client.focus();
          }
        }
        if (clients.openWindow) {
          return clients.openWindow(url);
        }
      })
  );
});
