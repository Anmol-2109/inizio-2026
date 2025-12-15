import { useState, useEffect } from "react";
import api from "../api/apiClient";
import { Link } from "react-router-dom";

export default function AdminEventList() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/events/");
      setEvents(res.data);
    } catch (error) {
      console.error("Error fetching events:", error);
      setError(error.response?.data?.detail || "Failed to load events");
    } finally {
      setLoading(false);
    }
  };

  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;
    
    try {
      await api.delete(`/admin/events/${id}/delete/`);
      alert("Event deleted successfully");
      fetchEvents();
    } catch (error) {
      console.error("Delete error:", error);
      alert(error.response?.data?.detail || "Failed to delete event");
    }
  };

  if (loading) return <div>Loading events...</div>;
  if (error) return <div style={{ color: "red" }}>Error: {error}</div>;

  return (
    <div style={{ padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2>Admin - Events</h2>
        <Link to="/admin/events/create">
          <button>Create New Event</button>
        </Link>
      </div>

      {events.length === 0 ? (
        <p>No events</p>
      ) : (
        <div>
          {events.map((event) => (
            <div key={event.id} style={{ border: "1px solid #ccc", padding: 15, marginBottom: 10 }}>
              <h3>{event.name}</h3>
              <p>{event.intro}</p>
              <p>Start: {new Date(event.start_time).toLocaleString()}</p>
              <p>End: {new Date(event.end_time).toLocaleString()}</p>
              <div style={{ marginTop: 10 }}>
                <Link to={`/admin/events/${event.id}`}>
                  <button style={{ marginRight: 10 }}>Edit</button>
                </Link>
                <button onClick={() => deleteEvent(event.id)} style={{ backgroundColor: "red", color: "white" }}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

