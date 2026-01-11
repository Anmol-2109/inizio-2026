// import { useState, useEffect } from "react";
// import api from "../api/apiClient";
// import { useParams, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/useAuthStore";

// export default function RegisterTeam() {
//   const { event_id } = useParams();
//   const navigate = useNavigate();
//   const { access } = useAuthStore();
//   const [event, setEvent] = useState(null);
//   const [formData, setFormData] = useState({
//     team_name: "",
//     leader_email: "",
//     members: [""]
//   });
//   const [loading, setLoading] = useState(false);
//   const [fetching, setFetching] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     if (!access) {
//       navigate("/login");
//     } else {
//       fetchEvent();
//       // Get user email from profile or auth store
//       // For now, we'll let user enter it, but it should be pre-filled
//     }
//   }, [access, navigate, event_id]);

//   const fetchEvent = async () => {
//     try {
//       setFetching(true);
//       const res = await api.get(`/events/${event_id}/`);
//       setEvent(res.data);
      
//       // Initialize members array based on min_team_size
//       // Leader counts as 1 member, so:
//       // - If min_size = 1: need 0 additional members (just leader) = solo team
//       // - If min_size = 3: need 2 additional members (leader + 2 others)
//       // - If min_size = 5: need 4 additional members (leader + 4 others)
//       const minSize = res.data.min_team_size || 1;
//       const initialMemberCount = Math.max(minSize - 1, 0); // Number of member fields needed (excluding leader)
      
//       setFormData(prev => ({
//         ...prev,
//         members: Array(initialMemberCount).fill("") // Create array with required number of member input fields
//       }));
//     } catch (error) {
//       console.error("Error fetching event:", error);
//       setError("Failed to load event details");
//     } finally {
//       setFetching(false);
//     }
//   };

//   const addMember = () => {
//     if (!event) return;
    
//     // Maximum members = max_team_size - 1 (since leader counts as 1)
//     const maxMembers = event.max_team_size - 1;
    
//     if (formData.members.length >= maxMembers) {
//       setError(`Maximum team size is ${event.max_team_size} members (including leader)`);
//       return;
//     }
    
//     setFormData(prev => ({
//       ...prev,
//       members: [...prev.members, ""]
//     }));
//   };

//   const removeMember = (index) => {
//     setFormData(prev => ({
//       ...prev,
//       members: prev.members.filter((_, i) => i !== index)
//     }));
//   };

//   const updateMember = (index, value) => {
//     setFormData(prev => ({
//       ...prev,
//       members: prev.members.map((m, i) => i === index ? value : m)
//     }));
//   };

//   const submit = async () => {
//     if (!formData.team_name || !formData.leader_email) {
//       setError("Team name and leader email are required");
//       return;
//     }

//     if (!event) {
//       setError("Event details not loaded");
//       return;
//     }

//     // Combine leader and members
//     const allMembers = [formData.leader_email, ...formData.members.filter(m => m.trim() !== "")];
//     const uniqueMembers = [...new Set(allMembers.map(m => m.toLowerCase().trim()))];

//     // Validation: Leader must be in members list
//     if (!uniqueMembers.includes(formData.leader_email.toLowerCase().trim())) {
//       setError("Leader email must be included in team members");
//       return;
//     }

//     // Validation: Total members (leader + others) must be >= min_team_size
//     if (uniqueMembers.length < event.min_team_size) {
//       setError(`Team must have at least ${event.min_team_size} members (including leader)`);
//       return;
//     }

//     // Validation: Total members must be <= max_team_size
//     if (uniqueMembers.length > event.max_team_size) {
//       setError(`Team cannot have more than ${event.max_team_size} members`);
//       return;
//     }

//     setLoading(true);
//     setError("");

//     try {
//       const res = await api.post(`/events/${event_id}/register/`, {
//         team_name: formData.team_name,
//         leader_email: formData.leader_email,
//         members: uniqueMembers
//       });
      
//       console.log("Registration response:", res.data);
      
//       // Get team ID from response - backend returns TeamDetailSerializer which has 'id' field
//       const teamId = res.data?.id;
      
//       if (!teamId) {
//         console.error("Team ID not found in response:", res.data);
//         alert("Team registered but could not get team ID. Please check your teams.");
//         navigate(`/events/${event_id}`);
//         return;
//       }
      
//       // Store team ID for easy navigation (use both event_id and event.id as keys)
//       localStorage.setItem(`team_${event_id}`, teamId.toString());
//       if (event?.id) {
//         localStorage.setItem(`team_${event.id}`, teamId.toString());
//       }
      
//       // Also store in a general teams map
//       const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
//       teamsMap[event_id] = teamId.toString();
//       if (event?.id) {
//         teamsMap[event.id] = teamId.toString();
//       }
//       localStorage.setItem("user_teams", JSON.stringify(teamsMap));
      
//       console.log("Stored team ID:", teamId, "for event:", event_id);
//       console.log("Navigating to team:", `/events/team/${teamId}`);
      
//       // Navigate to team detail page - use navigate for SPA navigation
//       navigate(`/events/team/${teamId}`, { replace: true });
//     } catch (error) {
//       console.error("Register team error:", error);
//       const errorData = error.response?.data;
//       if (typeof errorData === 'string') {
//         setError(errorData);
//       } else if (errorData?.detail) {
//         setError(errorData.detail);
//       } else if (errorData?.error) {
//         setError(errorData.error);
//       } else if (errorData?.leader_email) {
//         setError(Array.isArray(errorData.leader_email) ? errorData.leader_email[0] : errorData.leader_email);
//       } else if (errorData?.members) {
//         setError(Array.isArray(errorData.members) ? errorData.members[0] : errorData.members);
//       } else {
//         setError("Failed to register team. Please check your input.");
//       }
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (fetching) return <div style={{ padding: 20 }}>Loading event details...</div>;

//   return (
//     <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
//       <h2>Register Team for Event</h2>
      
//       {event && (
//         <div style={{ marginBottom: 20, padding: 10, backgroundColor: "#f0f0f0", borderRadius: 4 }}>
//           <p><strong>Event:</strong> {event.name}</p>
//           <p><strong>Team Size:</strong> Minimum {event.min_team_size} members, Maximum {event.max_team_size} members</p>
//           <p style={{ fontSize: "12px", color: "#666" }}>
//             Note: Leader counts as one member. Total members (leader + others) must be between {event.min_team_size} and {event.max_team_size}.
//           </p>
//         </div>
//       )}
      
//       {error && (
//         <div style={{ color: "red", marginBottom: 10, padding: 10, backgroundColor: "#ffe6e6", borderRadius: 4 }}>
//           {error}
//         </div>
//       )}

//       <div style={{ marginBottom: 15 }}>
//         <label>Team Name *</label>
//         <input
//           type="text"
//           value={formData.team_name}
//           onChange={e => setFormData({ ...formData, team_name: e.target.value })}
//           style={{ width: "100%", padding: 8 }}
//           disabled={loading}
//           placeholder="Enter team name"
//         />
//       </div>

//       <div style={{ marginBottom: 15 }}>
//         <label>Leader Email * (Your email - must be logged in user)</label>
//         <input
//           type="email"
//           value={formData.leader_email}
//           onChange={e => setFormData({ ...formData, leader_email: e.target.value })}
//           style={{ width: "100%", padding: 8 }}
//           disabled={loading}
//           placeholder="your.email@example.com"
//         />
//       </div>

//       <div style={{ marginBottom: 15 }}>
//         <label>Team Members (emails) *</label>
//         <p style={{ fontSize: "12px", color: "#666", marginBottom: 5 }}>
//           {event && (
//             <>
//               Add team member emails. Leader counts as 1 member.
//               <br />
//               Required: {event.min_team_size} member(s) total (leader + {Math.max(event.min_team_size - 1, 0)} other member(s))
//               <br />
//               Maximum: {event.max_team_size} member(s) total (leader + {event.max_team_size - 1} other member(s))
//             </>
//           )}
//         </p>
//         {formData.members.length === 0 && event && event.min_team_size === 1 && (
//           <p style={{ fontSize: "12px", color: "#666", fontStyle: "italic" }}>
//             This event allows solo teams (just the leader). No additional members required.
//           </p>
//         )}
//         {formData.members.map((member, index) => (
//           <div key={index} style={{ display: "flex", marginBottom: 5 }}>
//             <input
//               type="email"
//               value={member}
//               onChange={e => updateMember(index, e.target.value)}
//               style={{ flex: 1, padding: 8, marginRight: 5 }}
//               placeholder={`Member ${index + 1} email`}
//               disabled={loading}
//             />
//             {/* Only allow remove if we have more than minimum required */}
//             {event && formData.members.length > Math.max(event.min_team_size - 1, 0) && (
//               <button 
//                 onClick={() => removeMember(index)} 
//                 disabled={loading}
//                 style={{ padding: "5px 10px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: 4 }}
//               >
//                 Remove
//               </button>
//             )}
//           </div>
//         ))}
//         {/* Only show "Add Member" button if min_size > 1 (team requires members) and we haven't reached max */}
//         {event && event.min_team_size > 1 && formData.members.length < (event.max_team_size - 1) && (
//           <button 
//             onClick={addMember} 
//             disabled={loading} 
//             style={{ 
//               marginTop: 5, 
//               padding: "8px 15px", 
//               backgroundColor: "#28a745", 
//               color: "white", 
//               border: "none", 
//               borderRadius: 4,
//               cursor: loading ? "not-allowed" : "pointer"
//             }}
//           >
//             + Add Member ({formData.members.length} / {event.max_team_size - 1} additional members)
//           </button>
//         )}
//         {event && formData.members.length >= (event.max_team_size - 1) && (
//           <p style={{ fontSize: "12px", color: "#999", marginTop: 5 }}>
//             Maximum team size reached ({event.max_team_size} members total: 1 leader + {event.max_team_size - 1} members)
//           </p>
//         )}
//         {event && event.min_team_size === 1 && formData.members.length === 0 && (
//           <p style={{ fontSize: "12px", color: "#666", marginTop: 5, fontStyle: "italic" }}>
//             Solo teams allowed. You can add members up to {event.max_team_size} total, or proceed with just yourself.
//           </p>
//         )}
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
//           borderRadius: 4
//         }}
//       >
//         {loading ? "Registering..." : "Register Team"}
//       </button>
//     </div>
//   );
// }



import { useState, useEffect } from "react";
import api from "../api/apiClient";
import { useParams, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";
import TeamHeader from "../components/TeamHeader";
import "./Register_team.css";
import img1 from "../assets/TeamHeader.jpg"

export default function RegisterTeam() {
  const { event_id } = useParams();
  const navigate = useNavigate();
  const { access } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [formData, setFormData] = useState({
    team_name: "",
    leader_email: "",
    members: [""]
  });
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!access) {
      navigate("/login");
    } else {
      fetchEvent();
    }
  }, [access, navigate, event_id]);

  const fetchEvent = async () => {
    try {
      setFetching(true);
      const res = await api.get(`/events/${event_id}/`);
      setEvent(res.data);
      
      const minSize = res.data.min_team_size || 1;
      const initialMemberCount = Math.max(minSize - 1, 0);
      
      setFormData(prev => ({
        ...prev,
        members: Array(initialMemberCount).fill("")
      }));
    } catch (error) {
      console.error("Error fetching event:", error);
      setError("Failed to load event details");
    } finally {
      setFetching(false);
    }
  };

  const addMember = () => {
    if (!event) return;
    
    const maxMembers = event.max_team_size - 1;
    
    if (formData.members.length >= maxMembers) {
      setError(`Maximum team size is ${event.max_team_size} members (including leader)`);
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      members: [...prev.members, ""]
    }));
  };

  const removeMember = (index) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.filter((_, i) => i !== index)
    }));
  };

  const updateMember = (index, value) => {
    setFormData(prev => ({
      ...prev,
      members: prev.members.map((m, i) => i === index ? value : m)
    }));
  };

  const submit = async () => {
    if (!formData.team_name || !formData.leader_email) {
      setError("Team name and leader email are required");
      return;
    }

    if (!event) {
      setError("Event details not loaded");
      return;
    }

    const allMembers = [formData.leader_email, ...formData.members.filter(m => m.trim() !== "")];
    const uniqueMembers = [...new Set(allMembers.map(m => m.toLowerCase().trim()))];

    if (!uniqueMembers.includes(formData.leader_email.toLowerCase().trim())) {
      setError("Leader email must be included in team members");
      return;
    }

    if (uniqueMembers.length < event.min_team_size) {
      setError(`Team must have at least ${event.min_team_size} members (including leader)`);
      return;
    }

    if (uniqueMembers.length > event.max_team_size) {
      setError(`Team cannot have more than ${event.max_team_size} members`);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post(`/events/${event_id}/register/`, {
        team_name: formData.team_name,
        leader_email: formData.leader_email,
        members: uniqueMembers
      });
      
      console.log("Registration response:", res.data);
      
      const teamId = res.data?.id;
      
      if (!teamId) {
        console.error("Team ID not found in response:", res.data);
        alert("Team registered but could not get team ID. Please check your teams.");
        navigate(`/events/${event_id}`);
        return;
      }
      
      localStorage.setItem(`team_${event_id}`, teamId.toString());
      if (event?.id) {
        localStorage.setItem(`team_${event.id}`, teamId.toString());
      }
      
      const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
      teamsMap[event_id] = teamId.toString();
      if (event?.id) {
        teamsMap[event.id] = teamId.toString();
      }
      localStorage.setItem("user_teams", JSON.stringify(teamsMap));
      
      console.log("Stored team ID:", teamId, "for event:", event_id);
      console.log("Navigating to team:", `/events/team/${teamId}`);
      
      navigate(`/events/team/${teamId}`, { replace: true });
    } catch (error) {
      console.error("Register team error:", error);
      const errorData = error.response?.data;
      if (typeof errorData === 'string') {
        setError(errorData);
      } else if (errorData?.detail) {
        setError(errorData.detail);
      } else if (errorData?.error) {
        setError(errorData.error);
      } else if (errorData?.leader_email) {
        setError(Array.isArray(errorData.leader_email) ? errorData.leader_email[0] : errorData.leader_email);
      } else if (errorData?.members) {
        setError(Array.isArray(errorData.members) ? errorData.members[0] : errorData.members);
      } else {
        setError("Failed to register team. Please check your input.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="register-page">
        <div className="loading-container">Loading event details...</div>
      </div>
    );
  }

  const minRequiredMembers = event ? Math.max(event.min_team_size - 1, 0) : 0;
  const requiredMembers = formData.members.slice(0, minRequiredMembers);
  const additionalMembers = formData.members.slice(minRequiredMembers);

  return (
    <div className="register-page">
      {/* Header Section */}
      {/* <div className="register-header">
        <TeamHeader name = {event.name} date = {'TBA'} venue = {'TBA'} teamSize={event.min_team_size+'-'+event.max_team_size} description={event.intro} backgroundImage={img1}/>
      </div> */}

      {/* Form Section */}
      <div className="register-form-container">
        <div className="register-form-card">
          <h2 className="form-title">Register Team</h2>

          {error && (
            <div className="error-message">{error}</div>
          )}

          {/* Team Name */}
          <div className="form-group">
            <label className="form-label">Team Name</label>
            <input
              type="text"
              className="form-input"
              value={formData.team_name}
              onChange={e => setFormData({ ...formData, team_name: e.target.value })}
              disabled={loading}
              placeholder="Enter team name"
            />
          </div>

          {/* Team Leader */}
          <div className="form-group">
            <label className="form-label">Team Leader</label>
            <input
              type="email"
              className="form-input"
              value={formData.leader_email}
              onChange={e => setFormData({ ...formData, leader_email: e.target.value })}
              disabled={loading}
              placeholder="Enter leader email"
            />
          </div>

          {/* Required Members Section */}
          {minRequiredMembers > 0 && (
            <div className="members-section required-section">
              <h3 className="section-title">REQUIRED MEMBERS (MIN SIZE)</h3>
              {requiredMembers.map((member, index) => (
                <div key={index} className="member-input-group">
                  <label className="form-label">Team Member {index + 2}</label>
                  <input
                    type="email"
                    className="form-input member-input"
                    value={member}
                    onChange={e => updateMember(index, e.target.value)}
                    disabled={loading}
                    placeholder={`Enter Member ${index + 2} ID/Email`}
                  />
                </div>
              ))}
            </div>
          )}

          {/* Additional Members Section */}
          {event && (
            <div className="additional-section">
              <h3 className="section-title additional-title">
                ADDITIONAL MEMBERS (MAX {event.max_team_size - 1 - minRequiredMembers})
              </h3>
              
              {additionalMembers.map((member, index) => (
                <div key={index + minRequiredMembers} className="member-input-group additional-member">
                  <label className="form-label">Team Member {index + minRequiredMembers + 2}</label>
                  <div className="member-input-wrapper">
                    <input
                      type="email"
                      className="form-input member-input"
                      value={member}
                      onChange={e => updateMember(index + minRequiredMembers, e.target.value)}
                      disabled={loading}
                      placeholder={`Enter Member ${index + minRequiredMembers + 2} ID/Email`}
                    />
                    <button 
                      type="button"
                      className="remove-btn"
                      onClick={() => removeMember(index + minRequiredMembers)}
                      disabled={loading}
                    >
                      ×
                    </button>
                  </div>
                </div>
              ))}

              {/* Add Member Button */}
              {formData.members.length < (event.max_team_size - 1) && (
                <button 
                  type="button"
                  className="add-member-btn"
                  onClick={addMember}
                  disabled={loading}
                >
                  + Add Member
                </button>
              )}
            </div>
          )}

          {/* Register Button */}
          <button
            type="button"
            className="register-btn"
            onClick={submit}
            disabled={loading}
          >
            {loading ? "Registering..." : "Register Team"}
          </button>
        </div>
      </div>
    </div>
  );
}

