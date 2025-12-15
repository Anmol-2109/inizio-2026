import { useState, useEffect } from "react";
import api from "../api/apiClient";
import { useParams, useNavigate } from "react-router-dom";

export default function AdminEventUpdate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    intro: "",
    description: "",
    location: "",
    start_time: "",
    end_time: "",
    registration_open: "",
    registration_close: "",
    min_team_size: 1,
    max_team_size: 1
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id]);

  const fetchEvent = async () => {
    try {
      setFetching(true);
      const res = await api.get(`/admin/events/${id}/`);
      const event = res.data;
      
      // Format datetime for input fields
      setFormData({
        name: event.name || "",
        slug: event.slug || "",
        intro: event.intro || "",
        description: event.description || "",
        location: event.location || "",
        start_time: event.start_time ? event.start_time.slice(0, 16) : "",
        end_time: event.end_time ? event.end_time.slice(0, 16) : "",
        registration_open: event.registration_open ? event.registration_open.slice(0, 16) : "",
        registration_close: event.registration_close ? event.registration_close.slice(0, 16) : "",
        min_team_size: event.min_team_size || 1,
        max_team_size: event.max_team_size || 1
      });
    } catch (error) {
      console.error("Error fetching event:", error);
      setError(error.response?.data?.detail || "Failed to load event");
    } finally {
      setFetching(false);
    }
  };

  const submit = async () => {
    if (!formData.name || !formData.description) {
      setError("Name and description are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.put(`/admin/events/${id}/`, formData);
      alert("Event updated successfully!");
      navigate("/admin/events");
    } catch (error) {
      console.error("Update event error:", error);
      const errorData = error.response?.data;
      if (typeof errorData === 'string') {
        setError(errorData);
      } else if (errorData?.detail) {
        setError(errorData.detail);
      } else {
        setError("Failed to update event. Please check your input.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) return <div>Loading event...</div>;

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>Update Event</h2>
      
      {error && (
        <div style={{ color: "red", marginBottom: 10, padding: 10, backgroundColor: "#ffe6e6" }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 15 }}>
        <label>Name *</label>
        <input
          type="text"
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Slug</label>
        <input
          type="text"
          value={formData.slug}
          onChange={e => setFormData({ ...formData, slug: e.target.value })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Intro</label>
        <input
          type="text"
          value={formData.intro}
          onChange={e => setFormData({ ...formData, intro: e.target.value })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Description *</label>
        <textarea
          value={formData.description}
          onChange={e => setFormData({ ...formData, description: e.target.value })}
          style={{ width: "100%", padding: 8, minHeight: 100 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Location</label>
        <input
          type="text"
          value={formData.location}
          onChange={e => setFormData({ ...formData, location: e.target.value })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Start Time *</label>
        <input
          type="datetime-local"
          value={formData.start_time}
          onChange={e => setFormData({ ...formData, start_time: e.target.value })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>End Time *</label>
        <input
          type="datetime-local"
          value={formData.end_time}
          onChange={e => setFormData({ ...formData, end_time: e.target.value })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Registration Open</label>
        <input
          type="datetime-local"
          value={formData.registration_open}
          onChange={e => setFormData({ ...formData, registration_open: e.target.value })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Registration Close</label>
        <input
          type="datetime-local"
          value={formData.registration_close}
          onChange={e => setFormData({ ...formData, registration_close: e.target.value })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Min Team Size</label>
        <input
          type="number"
          value={formData.min_team_size}
          onChange={e => setFormData({ ...formData, min_team_size: parseInt(e.target.value) || 1 })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
          min="1"
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label>Max Team Size</label>
        <input
          type="number"
          value={formData.max_team_size}
          onChange={e => setFormData({ ...formData, max_team_size: parseInt(e.target.value) || 1 })}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
          min="1"
        />
      </div>

      <button
        onClick={submit}
        disabled={loading}
        style={{
          width: "100%",
          padding: 10,
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          marginBottom: 10
        }}
      >
        {loading ? "Updating..." : "Update Event"}
      </button>

      <button onClick={() => navigate("/admin/events")}>
        Cancel
      </button>
    </div>
  );
}

