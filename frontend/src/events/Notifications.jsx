// import { useState, useEffect } from "react";
// import api from "../api/apiClient";
// import { Link } from "react-router-dom";

// export default function Notifications() {
//   const [notifications, setNotifications] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchNotifications();
//   }, []);

//   const fetchNotifications = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get("/events/notifications/");
//       setNotifications(res.data);
//     } catch (error) {
//       console.error("Error fetching notifications:", error);
//       setError(error.response?.data?.detail || "Failed to load notifications");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const markAsRead = async (id) => {
//     try {
//       await api.patch(`/events/notifications/${id}/read/`);
//       setNotifications(prev =>
//         prev.map(n => n.id === id ? { ...n, is_read: true } : n)
//       );
//     } catch (error) {
//       console.error("Mark read error:", error);
//       alert("Failed to mark as read");
//     }
//   };

//   if (loading) return <div style={{ padding: 20, textAlign: "center" }}>Loading notifications...</div>;
//   if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;

//   return (
//     <div style={{ padding: 20, maxWidth: 800, margin: "0 auto", color: "#000" }}>
//       <h2 style={{ color: "#000" }}>Notifications</h2>
      
//       {notifications.length === 0 ? (
//         <p style={{ color: "#666", padding: 20, textAlign: "center" }}>No notifications yet</p>
//       ) : (
//         <div>
//           {notifications.map((notif) => (
//             <div
//               key={notif.id}
//               style={{
//                 border: "1px solid #ccc",
//                 padding: 15,
//                 marginBottom: 10,
//                 backgroundColor: notif.is_read ? "#f9f9f9" : "#e3f2fd"
//               }}
//             >
//               <p style={{ color: "#000", margin: "5px 0", fontWeight: notif.is_read ? "normal" : "bold" }}>
//                 {notif.message}
//               </p>
//               <p style={{ fontSize: "12px", color: "#666", margin: "5px 0" }}>
//                 {new Date(notif.created_at).toLocaleString()}
//               </p>
//               <div style={{ marginTop: 10, display: "flex", gap: 10, alignItems: "center" }}>
//               {(notif.event || notif.event_id) && (
//                 <Link to={`/events/${notif.event_id || notif.event}`} style={{ color: "#007bff", textDecoration: "none" }}>
//                   View Event
//                 </Link>
//               )}
//                 {!notif.is_read && (
//                   <button
//                     onClick={() => markAsRead(notif.id)}
//                     style={{ 
//                       padding: "5px 15px", 
//                       backgroundColor: "#28a745", 
//                       color: "white", 
//                       border: "none", 
//                       borderRadius: 4, 
//                       cursor: "pointer" 
//                     }}
//                   >
//                     Mark as Read
//                   </button>
//                 )}
//               </div>
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import api from "../api/apiClient";
import "../events/Notification.css";
import NotificationCard from "../components/NotificationCard";

export default function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/events/notifications/");
      setNotifications(res.data || []);
    } catch (err) {
      console.error("Error fetching notifications:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to load notifications"
      );
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/events/notifications/${id}/read/`);
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error("Mark read error:", err);
      window.alert("Failed to mark as read");
    }
  };

  const accentPalette = ["#fe8e0e", "#bfbcbf", "#70e144"];

  return (
    <div className="notifications-page">
      <div className="notifications-inner">
        <header className="notifications-header">
          <h1 className="notifications-title">Notification</h1>
          <p className="notifications-subtitle">
            Stay up to date with the latest updates about your registered events
            and important announcements.
          </p>
        </header>

        {loading && (
          <div className="notifications-status">Loading notifications...</div>
        )}

        {error && !loading && (
          <div className="notifications-status error">Error: {error}</div>
        )}

        {!loading && !error && notifications.length === 0 && (
          <div className="notifications-empty">
            No notifications yet. Once you register for events, you&apos;ll see
            important updates here.
          </div>
        )}

        <div className="notifications-list">
          {notifications.map((notif, index) => (
            <NotificationCard
              key={notif.id}
              title={notif.title || notif.heading || "Event Registered"}
              message={notif.message}
              createdAt={notif.created_at}
              isRead={Boolean(notif.is_read)}
              eventId={notif.event_id || notif.event}
              accentColor={accentPalette[index % accentPalette.length]}
              onMarkAsRead={() => markAsRead(notif.id)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
