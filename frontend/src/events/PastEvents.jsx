import { useState, useEffect } from "react";
import api from "../api/apiClient";
import { Link } from "react-router-dom";

export default function PastEvents() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/events/past/");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching past events:", error);
      setError(error.response?.data?.detail || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Loading past events...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <h2>Past Events</h2>
      {events.length === 0 ? (
        <p>No past events</p>
      ) : (
        <div>
          {events.map((event) => (
            <div key={event.id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
              <h3>
                <Link to={`/events/${event.id}`}>{event.name}</Link>
              </h3>
              <p>{event.intro}</p>
              <p>Location: {event.location}</p>
              <p>Start: {new Date(event.start_time).toLocaleString()}</p>
              <p>End: {new Date(event.end_time).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

