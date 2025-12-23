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

messaging.onBackgroundMessage(function (payload) {
  const title = payload.data?.title || "New Event";
  const body = payload.data?.body || "";

  self.registration.showNotification(title, {
    body,
    data: { event_id: payload.data?.event_id },
  });
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();

  const eventId = event.notification?.data?.event_id;
  if (!eventId) return;

  const url = new URL(`/events/${eventId}`, self.location.origin).href;

  event.waitUntil(
    (async () => {
      const clientsArr = await clients.matchAll({
        type: "window",
        includeUncontrolled: true,
      });

      if (clientsArr.length > 0) {
        await clientsArr[0].navigate(url);
        return clientsArr[0].focus();
      }

      return clients.openWindow(url);
    })()
  );
});