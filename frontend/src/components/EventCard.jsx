import { Link } from "react-router-dom";
import "./EventCard.css";

const PLACEHOLDER_IMAGE = "";

const getMediaUrl = (image) => {
  if (!image) return PLACEHOLDER_IMAGE;
  if (image.startsWith("http://") || image.startsWith("https://")) {
    return image;
  }
  const apiBase = import.meta.env.VITE_API_BASE || "/api";
  const base = apiBase.replace(/\/api\/?$/, "");
  return `${base}${image}`;
};

export default function EventCard({
  id,
  name,
  intro,
  venue,
  dateTime,
  image,
  isRegistered,
}) {
  const cardImage = getMediaUrl(image);

  return (
    <Link to={`/events/${id}`} className="event-card">
      <div
        className="event-card-image"
        style={{ backgroundImage: `url(${cardImage})` }}
      />

      <div className="event-card-content">
        <div className="event-card-header">
          <span className="event-tag event-tag-name">{name}</span>
          <span className="event-tag event-tag-datetime">{dateTime}</span>
        </div>

        <div className="event-card-meta">
          <div className="event-venue">
            <span className="event-venue-icon">📍</span>
            <span className="event-venue-text">{venue}</span>
          </div>
        </div>

        <p className="event-card-intro">{intro}</p>

        <div className="event-card-footer">
          {isRegistered && (
            <span className="event-registered-badge">Registered</span>
          )}
        </div>
      </div>
    </Link>
  );
}


