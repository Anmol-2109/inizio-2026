import { useState, useEffect } from "react";
import api from "../api/apiClient";
import { Link } from "react-router-dom";

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetchEvents();
  }, [showPast]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const endpoint = showPast ? "/events/past/" : "/events/upcoming/";
      const res = await api.get(endpoint);
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.response?.data?.detail || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading events...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>{showPast ? "Past Events" : "Upcoming Events"}</h2>
        <button onClick={() => setShowPast(!showPast)}>
          {showPast ? "Show Upcoming Events" : "Show Past Events"}
        </button>
      </div>

      {events.length === 0 ? (
        <p>No {showPast ? "past" : "upcoming"} events</p>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
          {events.map((event) => (
            <Link
              key={event.id}
              to={`/events/${event.id}`}
              style={{
                textDecoration: "none",
                color: "inherit",
                border: "1px solid #ccc",
                borderRadius: 8,
                padding: 15,
                display: "block",
                transition: "transform 0.2s",
                backgroundColor: "#fff"
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            >
              <h3 style={{ marginTop: 0, color: "#007bff" }}>{event.name}</h3>
              <p style={{ color: "#666", fontSize: "14px" }}>{event.intro}</p>
              <p style={{ fontSize: "12px", color: "#999" }}>
                📍 {event.location || "TBA"}
              </p>
              <p style={{ fontSize: "12px", color: "#999" }}>
                📅 {new Date(event.start_time).toLocaleDateString()}
              </p>
              <p style={{ fontSize: "12px", color: "#999" }}>
                👥 Team: {event.min_team_size} - {event.max_team_size} members
              </p>
              {event.is_registered && (
                <p style={{ color: "green", fontSize: "12px", marginTop: 10 }}>
                  ✓ Registered
                </p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

