// import { useState, useEffect } from "react";
// import api from "../api/apiClient";
// import { Link } from "react-router-dom";

// export default function Events() {
//   const [events, setEvents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [showPast, setShowPast] = useState(false);

//   useEffect(() => {
//     fetchEvents();
//   }, [showPast]);

//   const fetchEvents = async () => {
//     try {
//       setLoading(true);
//       const endpoint = showPast ? "/events/past/" : "/events/upcoming/";
//       const res = await api.get(endpoint);
//       setEvents(res.data);
//     } catch (error) {
//       console.error("Error fetching events:", error);
//       setError(error.response?.data?.detail || "Failed to load events");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return <div style={{ padding: 20 }}>Loading events...</div>;
//   if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;

//   return (
//     <div style={{ padding: 20 }}>
//       <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
//         <h2>{showPast ? "Past Events" : "Upcoming Events"}</h2>
//         <button onClick={() => setShowPast(!showPast)}>
//           {showPast ? "Show Upcoming Events" : "Show Past Events"}
//         </button>
//       </div>

//       {events.length === 0 ? (
//         <p>No {showPast ? "past" : "upcoming"} events</p>
//       ) : (
//         <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 20 }}>
//           {events.map((event) => (
//             <Link
//               key={event.id}
//               to={`/events/${event.id}`}
//               style={{
//                 textDecoration: "none",
//                 color: "inherit",
//                 border: "1px solid #ccc",
//                 borderRadius: 8,
//                 padding: 15,
//                 display: "block",
//                 transition: "transform 0.2s",
//                 backgroundColor: "#fff"
//               }}
//               onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.02)"}
//               onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
//             >
//               <h3 style={{ marginTop: 0, color: "#007bff" }}>{event.name}</h3>
//               <p style={{ color: "#666", fontSize: "14px" }}>{event.intro}</p>
//               <p style={{ fontSize: "12px", color: "#999" }}>
//                 📍 {event.location || "TBA"}
//               </p>
//               <p style={{ fontSize: "12px", color: "#999" }}>
//                 📅 {new Date(event.start_time).toLocaleDateString()}
//               </p>
//               <p style={{ fontSize: "12px", color: "#999" }}>
//                 👥 Team: {event.min_team_size} - {event.max_team_size} members
//               </p>
//               {event.is_registered && (
//                 <p style={{ color: "green", fontSize: "12px", marginTop: 10 }}>
//                   ✓ Registered
//                 </p>
//               )}
//             </Link>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/apiClient";
import "./Events.css";
import EventCard from "../components/EventCard";

function formatDateTime(dateString) {
  if (!dateString) return "TBA";
  const date = new Date(dateString);
  return date.toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    fetchEvents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showPast]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      setError("");
      const endpoint = showPast ? "/events/past/" : "/events/upcoming/";
      const res = await api.get(endpoint);
      setEvents(res.data || []);
    } catch (err) {
      console.error("Error fetching events:", err);
      setError(
        err.response?.data?.detail ||
          err.response?.data?.error ||
          "Failed to load events"
      );
    } finally {
      setLoading(false);
    }
  };

  const scrollToEvents = () => {
    const section = document.getElementById("our-events-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div className="events-page">
      <section className="events-hero">
        <div className="events-hero-overlay" />
        <div className="events-hero-content">
          <h1 className="events-hero-title">Events that matter</h1>
          <p className="events-hero-description">
            Discover a vibrant array of events designed to ignite innovation and
            entrepreneurship. From inspiring speaker sessions and hands-on
            workshops to thrilling competitions, every activity empowers and
            pushes you forward. Stay tuned - join the action!
          </p>

          <div className="events-hero-actions">
            <button
              type="button"
              className="btn-primary"
              onClick={scrollToEvents}
            >
              Explore
            </button>
            <Link to="/about" className="btn-outline-light">
              Learn more
            </Link>
          </div>
        </div>
      </section>

      <section id="our-events-section" className="events-list-section">
        <div className="events-list-header">
          <h2 className="events-section-title">Our Events</h2>
          <p className="events-section-description">
            Discover a vibrant array of events designed to ignite innovation and
            entrepreneurship. From inspiring speaker sessions and hands-on
            workshops to thrilling competitions, every activity empowers and
            pushes you forward. Stay tuned - join the action!
          </p>
        </div>

        {loading && (
          <div className="events-status-text">Loading events...</div>
        )}

        {error && !loading && (
          <div className="events-status-text events-status-error">
            Error: {error}
          </div>
        )}

        {!loading && !error && events.length === 0 && (
          <div className="events-status-text">
            No {showPast ? "past" : "upcoming"} events.
          </div>
        )}

        <div className="events-card-list">
          {events.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              name={event.name}
              intro={event.intro || event.description || ""}
              venue={event.venue || event.location || "TBA"}
              dateTime={
                event.start_time || event.date
                  ? formatDateTime(event.start_time || event.date)
                  : "TBA"
              }
              image={event.image || event.banner}
              isRegistered={Boolean(event.is_registered)}
            />
          ))}
        </div>

        <div className="events-toggle-wrapper">
          <button
            type="button"
            className={`events-toggle-pill ${
              showPast ? "is-active" : "is-inactive"
            }`}
            onClick={() => setShowPast((prev) => !prev)}
          >
            {showPast ? "View Upcoming Events" : "Past Events"}
          </button>
        </div>
      </section>
    </div>
  );
}
