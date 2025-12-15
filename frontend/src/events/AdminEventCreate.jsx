import { useState } from "react";
import api from "../api/apiClient";
import { useNavigate } from "react-router-dom";

export default function AdminEventCreate() {
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
  const [error, setError] = useState("");

  const submit = async () => {
    if (!formData.name || !formData.description) {
      setError("Name and description are required");
      return;
    }

    if (!formData.start_time || !formData.end_time) {
      setError("Start time and end time are required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare data - convert datetime-local format to ISO string for backend
      const submitData = {
        name: formData.name,
        description: formData.description,
        // Convert datetime-local to ISO format (backend expects ISO datetime strings)
        start_time: new Date(formData.start_time).toISOString(),
        end_time: new Date(formData.end_time).toISOString(),
        min_team_size: formData.min_team_size || 1,
        max_team_size: formData.max_team_size || 1,
      };
      
      // Add optional fields only if they have values
      if (formData.slug && formData.slug.trim()) {
        submitData.slug = formData.slug.trim();
      }
      if (formData.intro && formData.intro.trim()) {
        submitData.intro = formData.intro.trim();
      }
      if (formData.location && formData.location.trim()) {
        submitData.location = formData.location.trim();
      }
      if (formData.registration_open) {
        submitData.registration_open = new Date(formData.registration_open).toISOString();
      }
      if (formData.registration_close) {
        submitData.registration_close = new Date(formData.registration_close).toISOString();
      }

      console.log("Submitting event data:", submitData);
      const res = await api.post("/admin/events/", submitData);
      console.log("Event created successfully:", res.data);
      alert("Event created successfully!");
      navigate(`/admin/events/${res.data.id}`);
    } catch (error) {
      console.error("Create event error:", error);
      console.error("Error response:", error.response);
      
      const errorData = error.response?.data;
      
      // Handle different error formats
      if (error.response?.status === 403) {
        setError("You don't have permission to create events. Please ensure you are logged in as an admin.");
      } else if (error.response?.status === 401) {
        setError("Authentication failed. Please login again.");
      } else if (typeof errorData === 'string') {
        setError(errorData);
      } else if (errorData?.detail) {
        setError(errorData.detail);
      } else if (errorData && typeof errorData === 'object') {
        // Handle field-specific errors
        const fieldErrors = Object.entries(errorData)
          .map(([field, errors]) => `${field}: ${Array.isArray(errors) ? errors.join(', ') : errors}`)
          .join('\n');
        setError(fieldErrors || "Failed to create event. Please check your input.");
      } else {
        setError("Failed to create event. Please check your input.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>Create New Event</h2>
      
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
        {loading ? "Creating..." : "Create Event"}
      </button>

      <button onClick={() => navigate("/admin/events")}>
        Cancel
      </button>
    </div>
  );
}

