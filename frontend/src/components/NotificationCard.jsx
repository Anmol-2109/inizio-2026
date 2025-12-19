import { Link } from "react-router-dom";
import "./NotificationCard.css";

function formatDateTime(dateString) {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function NotificationCard({
  title,
  message,
  createdAt,
  isRead,
  eventId,
  accentColor,
  onMarkAsRead,
}) {
  const formattedDate = formatDateTime(createdAt);

  return (
    <div className="notification-card">
      <div
        className="notification-card-accent"
        style={{ backgroundColor: accentColor }}
      >
        <span
          className="notification-card-accent-shadow"
          style={{ backgroundColor: accentColor }}
        />
      </div>

      <div className="notification-card-body">
        <div className="notification-card-header">
          <h3 className="notification-card-title">
            {title || "Event Registered"}
          </h3>
          {formattedDate && (
            <span className="notification-card-date">{formattedDate}</span>
          )}
        </div>

        <p className="notification-card-message">{message}</p>

        <div className="notification-card-divider" />

        <div className="notification-card-footer">
          <div className="notification-card-actions">
            <button
              className={`notification-btn notification-btn-mark${
                isRead ? " is-read" : ""
              }`}
              type="button"
              onClick={isRead ? undefined : onMarkAsRead}
              disabled={isRead}
            >
              {isRead ? "Read" : "Mark as read"}
            </button>

            {eventId && (
              <Link
                to={`/events/${eventId}`}
                className="notification-btn notification-btn-view"
              >
                Show Event
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


