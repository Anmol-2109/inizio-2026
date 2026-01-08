// import { useState } from "react";
// import api from "../api/apiClient";
// import { useParams, useNavigate } from "react-router-dom";

// export default function AddTeamMember() {
//   const { team_id } = useParams();
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState("");

//   const submit = async () => {
//     if (!email || !email.includes("@")) {
//       setError("Please enter a valid email address");
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.post(`/events/teams/${team_id}/add-member/`, { email });
      
//       // Store team ID for event in localStorage
//       if (res.data?.event?.id) {
//         const eventId = res.data.event.id;
//         localStorage.setItem(`team_${eventId}`, team_id.toString());
//         const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
//         teamsMap[eventId] = team_id.toString();
//         localStorage.setItem("user_teams", JSON.stringify(teamsMap));
//       }
      
//       alert("Member added successfully! Invite sent.");
//       navigate(`/events/team/${team_id}`);
//     } catch (error) {
//       console.error("Add member error:", error);
//       setError(error.response?.data?.error || "Failed to add member");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div style={{ padding: 20, maxWidth: 500, margin: "0 auto" }}>
//       <h2>Add Team Member</h2>
      
//       {error && (
//         <div style={{ color: "red", marginBottom: 10, padding: 10, backgroundColor: "#ffe6e6" }}>
//           {error}
//         </div>
//       )}

//       <div style={{ marginBottom: 15 }}>
//         <label>Email Address *</label>
//         <input
//           type="email"
//           value={email}
//           onChange={e => setEmail(e.target.value)}
//           style={{ width: "100%", padding: 8 }}
//           placeholder="member@example.com"
//           disabled={loading}
//         />
//       </div>

//       <button
//         onClick={submit}
//         disabled={loading}
//         style={{
//           width: "100%",
//           padding: 10,
//           backgroundColor: loading ? "#ccc" : "#007bff",
//           color: "white",
//           border: "none",
//           borderRadius: 4,
//           marginBottom: 10
//         }}
//       >
//         {loading ? "Adding..." : "Add Member"}
//       </button>

//       <button onClick={() => navigate(`/events/team/${team_id}`)}>
//         Cancel
//       </button>
//     </div>
//   );
// }

import { useState } from "react";
import api from "../api/apiClient";
import { useParams, useNavigate } from "react-router-dom";
import "./AddTeamMember.css";

export default function AddTeamMember() {
  const { team_id } = useParams();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post(`/events/teams/${team_id}/add-member/`, { email });
      
      // Store team ID for event in localStorage
      if (res.data?.event?.id) {
        const eventId = res.data.event.id;
        localStorage.setItem(`team_${eventId}`, team_id.toString());
        const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
        teamsMap[eventId] = team_id.toString();
        localStorage.setItem("user_teams", JSON.stringify(teamsMap));
      }
      
      alert("Member added successfully! Invite sent.");
      navigate(`/events/team/${team_id}`);
    } catch (error) {
      console.error("Add member error:", error);
      setError(error.response?.data?.error || "Failed to add member");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-member-wrapper">
      {/* Hero Section */}
      <div className="add-member-hero">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <h1 className="page-title">Add Team Member</h1>
          <p className="page-subtitle">Invite a new member to join your team</p>
        </div>
      </div>

      {/* Main Content Section */}
      <div className="add-member-main-content">
        <div className="add-member-card">
          <div className="card-badge">Team Member</div>
          
          {error && (
            <div className="error-message">
              <span className="error-icon">⚠️</span>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email" className="form-label">
              Email Address <span className="required">*</span>
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              placeholder="member@example.com"
              disabled={loading}
            />
          </div>

          <div className="form-actions">
            <button
              onClick={submit}
              disabled={loading}
              className={`btn btn-primary btn-submit ${loading ? 'loading' : ''}`}
            >
              {loading ? "Adding..." : "Add Member"}
            </button>

            <button 
              onClick={() => navigate(`/events/team/${team_id}`)}
              className="btn btn-secondary btn-cancel"
              disabled={loading}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
