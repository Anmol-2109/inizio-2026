import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import useAuthStore from "../store/useAuthStore";
import "./Register_team.css";

export default function EventSubmission() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { access } = useAuthStore();

  const [fields, setFields] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [responses, setResponses] = useState({});
  const [isDirty, setIsDirty] = useState(false);

  useEffect(() => {
    if (!access) {
      navigate("/login");
      return;
    }
    fetchFields();
  }, [access, event_id, navigate]);

  const fetchFields = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get(`/events/${event_id}/custom-fields/`);
      setFields(res.data || []);

      const initial = {};
      (res.data || []).forEach((f) => {
        initial[f.name] = "";
      });
      setResponses(initial);
    } catch (err) {
      setError("Failed to load submission form fields.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name, value) => {
    setResponses((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsDirty(true);
  };

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isDirty || success) return;
      e.preventDefault();
      e.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [isDirty, success]);

  const handleSubmit = async () => {
    setError("");
    setSuccess("");

    try {
      setSubmitting(true);

      await api.post(`/events/${event_id}/submit-form/`, {
        responses,
      });

      setSuccess("Submission completed successfully.");
      setIsDirty(false);

      // After submission, fetch event to get team_id and redirect to team detail
      try {
        const eventRes = await api.get(`/events/${event_id}/`);
        const teamId = eventRes.data?.team_id;
        if (teamId) {
          navigate(`/events/team/${teamId}`, { replace: true });
        } else {
          navigate(`/events/${event_id}`, { replace: true });
        }
      } catch {
        navigate(`/events/${event_id}`, { replace: true });
      }
    } catch (err) {
      const data = err.response?.data;
      if (data?.errors) {
        const firstKey = Object.keys(data.errors)[0];
        setError(data.errors[firstKey] || "Please fix the highlighted errors.");
      } else if (data?.error) {
        setError(data.error);
      } else if (typeof data === "string") {
        setError(data);
      } else {
        setError("Failed to submit form. Please try again.");
      }
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="register-page">
        <div className="loading-container">Loading submission form...</div>
      </div>
    );
  }

  return (
    <div className="register-page">
      <div className="register-form-container">
        <div className="register-form-card">
          <h2 className="form-title">Event Submission</h2>

          <div className="team-status-warning" style={{ marginBottom: "16px" }}>
            <p className="title">⚠ Submission Required</p>
            <p>
              As the team leader, you must complete this form to finish your
              event registration. You can return here later from your team
              page if needed.
            </p>
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && (
            <div className="team-status-success">
              <p className="title">✓ {success}</p>
            </div>
          )}

          {fields.length === 0 && (
            <p style={{ color: "#555", marginTop: 8 }}>
              No additional submission fields are configured for this event.
            </p>
          )}

          {fields.map((field) => (
            <div className="form-group" key={field.name}>
              <label className="form-label">
                {field.label}
                {field.required && <span style={{ color: "red" }}> *</span>}
              </label>

              {field.field_type === "textarea" ? (
                <textarea
                  className="form-input"
                  rows={4}
                  value={responses[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={submitting}
                  placeholder={`Enter ${field.label}`}
                />
              ) : (
                <input
                  className="form-input"
                  type={
                    field.field_type === "number"
                      ? "number"
                      : field.field_type === "url" || field.field_type === "file"
                      ? "text"
                      : "text"
                  }
                  value={responses[field.name] || ""}
                  onChange={(e) => handleChange(field.name, e.target.value)}
                  disabled={submitting}
                  placeholder={
                    field.field_type === "file"
                      ? "Paste file URL or reference"
                      : `Enter ${field.label}`
                  }
                />
              )}
            </div>
          ))}

          <button
            type="button"
            className="register-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </div>
      </div>
    </div>
  );
}


