import { useState, useEffect } from "react";
import api from "../api/apiClient";
import { useParams, Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function EventDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { access } = useAuthStore();
  const [event, setEvent] = useState(null);
  const [userTeamId, setUserTeamId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchEvent();
  }, [id, access]);

  useEffect(() => {
    if (access && event?.is_registered) {
      fetchUserTeam();
    }
  }, [event, access]);

  const fetchEvent = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/events/${id}/`);
     
      setEvent(res.data);
      
      // Backend now returns team_id in the response if user is registered
      if (res.data.team_id) {
        
        const teamIdStr = res.data.team_id.toString();
        setUserTeamId(teamIdStr);
        
        // Also store in localStorage for future reference
        localStorage.setItem(`team_${id}`, teamIdStr);
        const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
        teamsMap[id] = teamIdStr;
        localStorage.setItem("user_teams", JSON.stringify(teamsMap));
      } else if (res.data.is_registered && access) {
       
        // Fallback: try to get from localStorage if backend doesn't return it
        fetchUserTeam();
      }
    } catch (error) {
      
      setError(error.response?.data?.detail || "Failed to load event");
    } finally {
      setLoading(false);
    }
  };

  const fetchUserTeam = async () => {
    if (!access) return;
    
    try {
      // Check localStorage for stored team ID (try multiple keys)
      let storedTeamId = localStorage.getItem(`team_${id}`);
      
      // Also check the teams map
      if (!storedTeamId) {
        const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
        storedTeamId = teamsMap[id] || teamsMap[event?.id];
      }
      
      if (storedTeamId) {
       
        setUserTeamId(storedTeamId);
        return;
      }

      
    } catch (error) {
      
    }
  };

  const handleRegisterClick = () => {
    if (!access) {
      navigate("/login");
    } else {
      navigate(`/events/${id}/register`);
    }
  };

  const handleViewTeamClick = async () => {
    if (!access) {
      navigate("/login");
      return;
    }

   

    // Try to get team ID from multiple sources
    // Priority: 1. From event response (team_id), 2. From state, 3. From localStorage
    let teamId = event?.team_id || userTeamId || localStorage.getItem(`team_${id}`);
    
    
    // Also check the teams map
    if (!teamId) {
      const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
      teamId = teamsMap[id] || teamsMap[event?.id];

    }

    if (teamId) {
      
      navigate(`/events/team/${teamId}`);
    } else {
      // If we still don't have team ID, refresh the event to get it from backend
     
      console.log("Full event data:", event);
      
      // Try refreshing the event data to get team_id from backend
      try {
        
        const res = await api.get(`/events/${id}/`);
        
        if (res.data.team_id) {
          console.log("✅ Got team ID after refresh:", res.data.team_id);
          setEvent(res.data);
          setUserTeamId(res.data.team_id.toString());
          navigate(`/events/team/${res.data.team_id}`);
        } else {
          console.error("❌ Still no team_id in response after refresh");
          alert("Team ID not found. Please refresh the page or use the team link from your invitation email.");
        }
      } catch (error) {
        console.error("Error refreshing event:", error);
        alert("Could not find your team. Please refresh the page or use the team link from your invitation email.");
      }
    }
  };

  if (loading) return <div style={{ padding: 20 }}>Loading event...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;
  if (!event) return <div style={{ padding: 20 }}>Event not found</div>;

  // Check if registration should be disabled
  const now = new Date();
  const eventEndTime = new Date(event.end_time);
  const registrationCloseTime = new Date(event.registration_close);
  
  // Registration is disabled if:
  // 1. Event has already ended (end_time < now)
  // 2. OR registration close time has passed (registration_close < now)
  const isRegistrationDisabled = eventEndTime < now || registrationCloseTime < now;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto" }}>
      <div
  style={{
    width: "100%",
    height: "320px",
    backgroundImage: `linear-gradient(
      rgba(0,0,0,0.45),
      rgba(0,0,0,0.45)
    ), url(${event?.image_url || ""})`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    borderRadius: "12px",
    display: "flex",
    alignItems: "flex-end",
    padding: "24px",
    color: "#fff",
    marginBottom: "24px",
  }}
>
</div>


      <h2>{event.name}</h2>
      <p><strong>Intro:</strong> {event.intro}</p>
      <p><strong>Description:</strong> {event.description}</p>

      {/* Event Info Fields - Right after Description */}
      {event.info_fields && event.info_fields.length > 0 && (
        <div style={{ marginTop: "24px" }}>
          {event.info_fields
            .filter((field) => {
              // Filter out null, undefined, empty string, empty array, empty object
              if (!field.value) return false;
              if (typeof field.value === "string" && field.value.trim() === "") return false;
              if (Array.isArray(field.value) && field.value.length === 0) return false;
              if (typeof field.value === "object" && Object.keys(field.value).length === 0) return false;
              return true;
            })
            .map((field, index) => (
              <div key={field.key || index} style={{ marginBottom: "20px" }}>
                <h3 style={{ fontWeight: "bold", marginBottom: "8px" }}>
                  {field.label}
                </h3>
                
                {field.field_type === "url" && field.value && (
                  <p>
                    <a
                      href={field.value}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        color: "#007bff",
                        textDecoration: "underline",
                        wordBreak: "break-all",
                      }}
                    >
                      {field.value}
                    </a>
                  </p>
                )}
                
                {field.field_type === "json" && field.value && (
                  <ul style={{ marginLeft: "20px" }}>
                    {Array.isArray(field.value) ? (
                      field.value.map((item, idx) => (
                        <li key={idx}>{typeof item === "object" ? JSON.stringify(item) : String(item)}</li>
                      ))
                    ) : typeof field.value === "object" ? (
                      Object.entries(field.value).map(([key, val], idx) => (
                        <li key={idx}>
                          <strong>{key}:</strong> {typeof val === "object" ? JSON.stringify(val) : String(val)}
                        </li>
                      ))
                    ) : (
                      <li>{String(field.value)}</li>
                    )}
                  </ul>
                )}
                
                {(field.field_type === "text" || field.field_type === "description") && field.value && (
                  <p style={{ whiteSpace: "pre-wrap" }}>{field.value}</p>
                )}
              </div>
            ))}
        </div>
      )}

      {/* <p><strong>Location:</strong> {event.location || "TBA"}</p>
      <p><strong>Start Time:</strong> {new Date(event.start_time).toLocaleString()}</p>
      <p><strong>Registration Open:</strong> {new Date(event.registration_open).toLocaleString()}</p>
      <p><strong>Registration Close:</strong> {new Date(event.registration_close).toLocaleString()}</p>
      <p><strong>Team Size:</strong> {event.min_team_size} - {event.max_team_size} members</p> */}

      <h3>Rules</h3>

      {Array.isArray(event.rules) && event.rules.length > 0 ? (
        <ul>
          {event.rules.map((rule, index) => (
            <li key={index}>{rule}</li>
          ))}
        </ul>
      ) : (
        <p>No rules available.</p>
      )}
      
      {event.is_registered && (
        <p style={{ color: "green", marginTop: 10 }}>
          ✓ You are registered for this event
        </p>
      )}
      
      {isRegistrationDisabled && !event.is_registered && (
        <p style={{ color: "red", marginTop: 10, fontWeight: "bold" }}>
          ⚠️ Registration is done through other way As mentioned above
        </p>
      )}
      
      <div style={{ marginTop: 20 }}>
        {event.is_registered ? (
          <button
            onClick={handleViewTeamClick}
            style={{
              padding: "10px 20px",
              backgroundColor: "#28a745",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer"
            }}
          >
            View Team
          </button>
        ) : (
          access && (
            <button
              onClick={handleRegisterClick}
              disabled={isRegistrationDisabled}
              style={{
                padding: "10px 20px",
                backgroundColor: isRegistrationDisabled ? "#6c757d" : "#007bff",
                color: "white",
                border: "none",
                borderRadius: 4,
                cursor: isRegistrationDisabled ? "not-allowed" : "pointer",
                opacity: isRegistrationDisabled ? 0.6 : 1
              }}
            >
              {isRegistrationDisabled ? "Registration not by here" : "Register Team"}
            </button>
          )
        )}
        {!access && !event.is_registered && (
          <p style={{ color: "#666" }}>
            <Link to="/login">Login</Link> to register for this event
          </p>
        )}
      </div>
    </div>
  );
}


// import { useState, useEffect } from "react";
// import api from "../api/apiClient";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/useAuthStore";
// import "./eventDetail.css";

// export default function EventDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { access } = useAuthStore();
//   const [event, setEvent] = useState(null);
//   const [userTeamId, setUserTeamId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchEvent();
//   }, [id, access]);

//   useEffect(() => {
//     if (access && event?.is_registered) {
//       fetchUserTeam();
//     }
//   }, [event, access]);

//   const fetchEvent = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/events/${id}/`);
//       console.log("Event detail response:", res.data);
//       setEvent(res.data);
      
//       // Backend now returns team_id in the response if user is registered
//       if (res.data.team_id) {
//         console.log("✅ Team ID from backend:", res.data.team_id);
//         const teamIdStr = res.data.team_id.toString();
//         setUserTeamId(teamIdStr);
        
//         // Also store in localStorage for future reference
//         localStorage.setItem(`team_${id}`, teamIdStr);
//         const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
//         teamsMap[id] = teamIdStr;
//         localStorage.setItem("user_teams", JSON.stringify(teamsMap));
//       } else if (res.data.is_registered && access) {
//         console.log("⚠️ User is registered but team_id not in response. Checking localStorage...");
//         // Fallback: try to get from localStorage if backend doesn't return it
//         fetchUserTeam();
//       }
//     } catch (error) {
//       console.error("Error fetching event:", error);
//       setError(error.response?.data?.detail || "Failed to load event");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserTeam = async () => {
//     if (!access) return;
    
//     try {
//       // Check localStorage for stored team ID (try multiple keys)
//       let storedTeamId = localStorage.getItem(`team_${id}`);
      
//       // Also check the teams map
//       if (!storedTeamId) {
//         const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
//         storedTeamId = teamsMap[id] || teamsMap[event?.id];
//       }
      
//       if (storedTeamId) {
//         console.log("Found team ID from localStorage:", storedTeamId);
//         setUserTeamId(storedTeamId);
//         return;
//       }

//       console.log("Team ID not found in localStorage for event:", id);
//     } catch (error) {
//       console.error("Error fetching team:", error);
//     }
//   };

//   const handleRegisterClick = () => {
//     if (!access) {
//       navigate("/login");
//     } else {
//       navigate(`/events/${id}/register`);
//     }
//   };

//   const handleViewTeamClick = async () => {
//     if (!access) {
//       navigate("/login");
//       return;
//     }

//     console.log("View Team clicked. Event data:", event);
//     console.log("User team ID from state:", userTeamId);

//     // Try to get team ID from multiple sources
//     // Priority: 1. From event response (team_id), 2. From state, 3. From localStorage
//     let teamId = event?.team_id || userTeamId || localStorage.getItem(`team_${id}`);
    
//     console.log("Team ID from event.team_id:", event?.team_id);
//     console.log("Team ID from userTeamId:", userTeamId);
//     console.log("Team ID from localStorage:", localStorage.getItem(`team_${id}`));
    
//     // Also check the teams map
//     if (!teamId) {
//       const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
//       teamId = teamsMap[id] || teamsMap[event?.id];
//       console.log("Team ID from teamsMap:", teamId);
//     }

//     if (teamId) {
//       console.log("✅ Found team ID, navigating to:", `/events/team/${teamId}`);
//       navigate(`/events/team/${teamId}`);
//     } else {
//       // If we still don't have team ID, refresh the event to get it from backend
//       console.error("❌ Team ID not found. Event ID:", id, "User registered:", event?.is_registered);
//       console.log("Full event data:", event);
      
//       // Try refreshing the event data to get team_id from backend
//       try {
//         console.log("Refreshing event to get team_id...");
//         const res = await api.get(`/events/${id}/`);
//         console.log("Refreshed event response:", res.data);
//         if (res.data.team_id) {
//           console.log("✅ Got team ID after refresh:", res.data.team_id);
//           setEvent(res.data);
//           setUserTeamId(res.data.team_id.toString());
//           navigate(`/events/team/${res.data.team_id}`);
//         } else {
//           console.error("❌ Still no team_id in response after refresh");
//           alert("Team ID not found. Please refresh the page or use the team link from your invitation email.");
//         }
//       } catch (error) {
//         console.error("Error refreshing event:", error);
//         alert("Could not find your team. Please refresh the page or use the team link from your invitation email.");
//       }
//     }
//   };

//   // Helper function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "TBA";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   // Helper function to format time
//   const formatTime = (dateString) => {
//     if (!dateString) return "TBA";
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   if (loading) {
//     return (
//       <div className="event-detail-container">
//         <div className="loading-state">Loading event...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="event-detail-container">
//         <div className="error-state">Error: {error}</div>
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <div className="event-detail-container">
//         <div className="error-state">Event not found</div>
//       </div>
//     );
//   }

//   // Check if registration should be disabled
//   const now = new Date();
//   const eventEndTime = new Date(event.end_time);
//   const registrationCloseTime = new Date(event.registration_close);
  
//   // Registration is disabled if:
//   // 1. Event has already ended (end_time < now)
//   // 2. OR registration close time has passed (registration_close < now)
//   const isRegistrationDisabled = eventEndTime < now || registrationCloseTime < now;

//   // Check if registration dates/times are in the past (for red color)
//   const regCloseDate = new Date(event.registration_close);
//   const isRegClosed = regCloseDate < now;

//   return (
//     <div className="event-detail-wrapper">
//       {/* Hero Section */}
//       <div 
//         className="hero-section"
//         style={{
//           backgroundImage: event.image 
//             ? `linear-gradient(rgba(4, 30, 40, 0.8), rgba(4, 30, 40, 0.8)), url(${event.image})`
//             : undefined
//         }}
//       >
//         <div className="hero-overlay"></div>
//         <div className="hero-content">
//           <div className="hero-text-content">
//             <h1 className="event-name">{event.name || "Event Name"}</h1>
//             <p className="event-intro">{event.intro || "Event intro"}</p>
//           </div>
//           <div className="hero-actions">
//             {event.is_registered ? (
//               <button
//                 onClick={handleViewTeamClick}
//                 className="btn btn-primary btn-register"
//               >
//                 View Team
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={handleRegisterClick}
//                   disabled={isRegistrationDisabled}
//                   className={`btn btn-primary btn-register ${isRegistrationDisabled ? 'disabled' : ''}`}
//                 >
//                   {isRegistrationDisabled ? "Registration Closed" : "Register"}
//                 </button>
//                 <button
//                   onClick={() => window.scrollTo({ top: document.querySelector('.event-details-card').offsetTop - 100, behavior: 'smooth' })}
//                   className="btn btn-secondary"
//                 >
//                   Learn more
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main Content Section */}
//       <div className="main-content-section">
//         {/* Event Details Card */}
//         <div className="event-details-card">
//           <div className="event-details-badge">Event Details</div>
//           <div className="event-details-content">
//             <div className="details-column">
//               <div className="detail-item">
//                 <span className="detail-label">Event Date :</span>
//                 <span className="detail-value">{formatDate(event.start_time)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Event Start time :</span>
//                 <span className="detail-value">{formatTime(event.start_time)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Event End Time :</span>
//                 <span className="detail-value">{formatTime(event.end_time)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Location :</span>
//                 <span className="detail-value">{event.location || "TBA"}</span>
//               </div>
//             </div>
//             <div className="details-column">
//               <div className="detail-item">
//                 <span className="detail-label">Registration Open Date :</span>
//                 <span className="detail-value">{formatDate(event.registration_open)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Registration Open Time :</span>
//                 <span className="detail-value">{formatTime(event.registration_open)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className={`detail-label ${isRegClosed ? 'past-date' : ''}`}>
//                   Registration Close Date :
//                 </span>
//                 <span className={`detail-value ${isRegClosed ? 'past-date' : ''}`}>
//                   {formatDate(event.registration_close)}
//                 </span>
//               </div>
//               <div className="detail-item">
//                 <span className={`detail-label ${isRegClosed ? 'past-date' : ''}`}>
//                   Registration Close Time :
//                 </span>
//                 <span className={`detail-value ${isRegClosed ? 'past-date' : ''}`}>
//                   {formatTime(event.registration_close)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Event Description Section */}
//         <div className="description-section">
//           <h2 className="section-title">Event Description</h2>
//           <div className="description-content">
//             {event.description || "No description available."}
//           </div>
//         </div>

//         {/* Rules Section */}
//         {Array.isArray(event.rules) && event.rules.length > 0 && (
//           <div className="rules-section">
//             <h2 className="section-title">Rules</h2>
//             <div className="rules-content">
//               <ul className="rules-list">
//                 {event.rules.map((rule, index) => (
//                   <li key={index}>{rule}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Registration Status Messages */}
//         {event.is_registered && (
//           <div className="status-message registered">
//             ✓ You are registered for this event
//           </div>
//         )}
        
//         {isRegistrationDisabled && !event.is_registered && (
//           <div className="status-message closed">
//             ⚠️ Registration is closed for this event
//           </div>
//         )}

//         {/* Bottom Register Button */}
//         {!event.is_registered && (
//           <div className="bottom-actions">
//             {access ? (
//               <button
//                 onClick={handleRegisterClick}
//                 disabled={isRegistrationDisabled}
//                 className={`btn-bottom-register ${isRegistrationDisabled ? 'disabled' : ''}`}
//               >
//                 REGISTER
//               </button>
//             ) : (
//               <div className="login-prompt">
//                 <Link to="/login" className="login-link">Login</Link> to register for this event
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }


// import { useState, useEffect } from "react";
// import api from "../api/apiClient";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import useAuthStore from "../store/useAuthStore";
// import "./eventDetail.css";

// export default function EventDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { access } = useAuthStore();
//   const [event, setEvent] = useState(null);
//   const [userTeamId, setUserTeamId] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");

//   useEffect(() => {
//     fetchEvent();
//   }, [id, access]);

//   useEffect(() => {
//     if (access && event?.is_registered) {
//       fetchUserTeam();
//     }
//   }, [event, access]);

//   const fetchEvent = async () => {
//     try {
//       setLoading(true);
//       const res = await api.get(`/events/${id}/`);
//       console.log("Event detail response:", res.data);
//       setEvent(res.data);
      
//       // Backend now returns team_id in the response if user is registered
//       if (res.data.team_id) {
//         console.log("✅ Team ID from backend:", res.data.team_id);
//         const teamIdStr = res.data.team_id.toString();
//         setUserTeamId(teamIdStr);
        
//         // Also store in localStorage for future reference
//         localStorage.setItem(`team_${id}`, teamIdStr);
//         const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
//         teamsMap[id] = teamIdStr;
//         localStorage.setItem("user_teams", JSON.stringify(teamsMap));
//       } else if (res.data.is_registered && access) {
//         console.log("⚠️ User is registered but team_id not in response. Checking localStorage...");
//         // Fallback: try to get from localStorage if backend doesn't return it
//         fetchUserTeam();
//       }
//     } catch (error) {
//       console.error("Error fetching event:", error);
//       setError(error.response?.data?.detail || "Failed to load event");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchUserTeam = async () => {
//     if (!access) return;
    
//     try {
//       // Check localStorage for stored team ID (try multiple keys)
//       let storedTeamId = localStorage.getItem(`team_${id}`);
      
//       // Also check the teams map
//       if (!storedTeamId) {
//         const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
//         storedTeamId = teamsMap[id] || teamsMap[event?.id];
//       }
      
//       if (storedTeamId) {
//         console.log("Found team ID from localStorage:", storedTeamId);
//         setUserTeamId(storedTeamId);
//         return;
//       }

//       console.log("Team ID not found in localStorage for event:", id);
//     } catch (error) {
//       console.error("Error fetching team:", error);
//     }
//   };

//   const handleRegisterClick = () => {
//     if (!access) {
//       navigate("/login");
//     } else {
//       navigate(`/events/${id}/register`);
//     }
//   };

//   const handleViewTeamClick = async () => {
//     if (!access) {
//       navigate("/login");
//       return;
//     }

//     console.log("View Team clicked. Event data:", event);
//     console.log("User team ID from state:", userTeamId);

//     // Try to get team ID from multiple sources
//     // Priority: 1. From event response (team_id), 2. From state, 3. From localStorage
//     let teamId = event?.team_id || userTeamId || localStorage.getItem(`team_${id}`);
    
//     console.log("Team ID from event.team_id:", event?.team_id);
//     console.log("Team ID from userTeamId:", userTeamId);
//     console.log("Team ID from localStorage:", localStorage.getItem(`team_${id}`));
    
//     // Also check the teams map
//     if (!teamId) {
//       const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
//       teamId = teamsMap[id] || teamsMap[event?.id];
//       console.log("Team ID from teamsMap:", teamId);
//     }

//     if (teamId) {
//       console.log("✅ Found team ID, navigating to:", `/events/team/${teamId}`);
//       navigate(`/events/team/${teamId}`);
//     } else {
//       // If we still don't have team ID, refresh the event to get it from backend
//       console.error("❌ Team ID not found. Event ID:", id, "User registered:", event?.is_registered);
//       console.log("Full event data:", event);
      
//       // Try refreshing the event data to get team_id from backend
//       try {
//         console.log("Refreshing event to get team_id...");
//         const res = await api.get(`/events/${id}/`);
//         console.log("Refreshed event response:", res.data);
//         if (res.data.team_id) {
//           console.log("✅ Got team ID after refresh:", res.data.team_id);
//           setEvent(res.data);
//           setUserTeamId(res.data.team_id.toString());
//           navigate(`/events/team/${res.data.team_id}`);
//         } else {
//           console.error("❌ Still no team_id in response after refresh");
//           alert("Team ID not found. Please refresh the page or use the team link from your invitation email.");
//         }
//       } catch (error) {
//         console.error("Error refreshing event:", error);
//         alert("Could not find your team. Please refresh the page or use the team link from your invitation email.");
//       }
//     }
//   };

//   // Helper function to format date
//   const formatDate = (dateString) => {
//     if (!dateString) return "TBA";
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-US', { 
//       year: 'numeric', 
//       month: 'long', 
//       day: 'numeric' 
//     });
//   };

//   // Helper function to format time
//   const formatTime = (dateString) => {
//     if (!dateString) return "TBA";
//     const date = new Date(dateString);
//     return date.toLocaleTimeString('en-US', { 
//       hour: '2-digit', 
//       minute: '2-digit',
//       hour12: true 
//     });
//   };

//   if (loading) {
//     return (
//       <div className="event-detail-container">
//         <div className="loading-state">Loading event...</div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="event-detail-container">
//         <div className="error-state">Error: {error}</div>
//       </div>
//     );
//   }

//   if (!event) {
//     return (
//       <div className="event-detail-container">
//         <div className="error-state">Event not found</div>
//       </div>
//     );
//   }

//   // Check if registration should be disabled
//   const now = new Date();
//   const eventEndTime = new Date(event.end_time);
//   const registrationCloseTime = new Date(event.registration_close);
  
//   // Registration is disabled if:
//   // 1. Event has already ended (end_time < now)
//   // 2. OR registration close time has passed (registration_close < now)
//   const isRegistrationDisabled = eventEndTime < now || registrationCloseTime < now;

//   // Check if registration dates/times are in the past (for red color)
//   const regCloseDate = new Date(event.registration_close);
//   const isRegClosed = regCloseDate < now;

//   return (
//     <div className="event-detail-wrapper">
//       {/* Hero Section */}
//       <div 
//         className="hero-section"
//         style={{
//           backgroundImage: event.image 
//             ? `linear-gradient(rgba(4, 30, 40, 0.3), rgba(4, 30, 40, 0.3)), url(${event.image})`
//             : undefined
//         }}
//       >
//         <div className="hero-overlay"></div>
//         <div className="hero-content">
//           <div className="hero-text-content">
//             <h1 className="event-name">{event.name || "Event Name"}</h1>
//             <p className="event-intro">{event.intro || "Event intro"}</p>
//           </div>
//           <div className="hero-actions">
//             {event.is_registered ? (
//               <button
//                 onClick={handleViewTeamClick}
//                 className="btn btn-primary btn-register"
//               >
//                 View Team
//               </button>
//             ) : (
//               <>
//                 <button
//                   onClick={handleRegisterClick}
//                   disabled={isRegistrationDisabled}
//                   className={`btn btn-primary btn-register ${isRegistrationDisabled ? 'disabled' : ''}`}
//                 >
//                   {isRegistrationDisabled ? "Registration Closed" : "Register"}
//                 </button>
//                 <button
//                   onClick={() => window.scrollTo({ top: document.querySelector('.event-details-card').offsetTop - 100, behavior: 'smooth' })}
//                   className="btn btn-secondary"
//                 >
//                   Learn more
//                 </button>
//               </>
//             )}
//           </div>
//         </div>
//       </div>

//       {/* Main Content Section */}
//       <div className="main-content-section">
//         {/* Event Details Card */}
//         <div className="event-details-card">
//           <div className="event-details-badge">Event Details</div>
//           <div className="event-details-content">
//             <div className="details-column">
//               <div className="detail-item">
//                 <span className="detail-label">Event Date :</span>
//                 <span className="detail-value">{formatDate(event.start_time)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Event Start time :</span>
//                 <span className="detail-value">{formatTime(event.start_time)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Event End Time :</span>
//                 <span className="detail-value">{formatTime(event.end_time)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Location :</span>
//                 <span className="detail-value">{event.location || "TBA"}</span>
//               </div>
//             </div>
//             <div className="details-column">
//               <div className="detail-item">
//                 <span className="detail-label">Registration Open Date :</span>
//                 <span className="detail-value">{formatDate(event.registration_open)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className="detail-label">Registration Open Time :</span>
//                 <span className="detail-value">{formatTime(event.registration_open)}</span>
//               </div>
//               <div className="detail-item">
//                 <span className={`detail-label ${isRegClosed ? 'past-date' : ''}`}>
//                   Registration Close Date :
//                 </span>
//                 <span className={`detail-value ${isRegClosed ? 'past-date' : ''}`}>
//                   {formatDate(event.registration_close)}
//                 </span>
//               </div>
//               <div className="detail-item">
//                 <span className={`detail-label ${isRegClosed ? 'past-date' : ''}`}>
//                   Registration Close Time :
//                 </span>
//                 <span className={`detail-value ${isRegClosed ? 'past-date' : ''}`}>
//                   {formatTime(event.registration_close)}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Event Description Section */}
//         <div className="description-section">
//           <h2 className="section-title">Event Description</h2>
//           <div className="description-content">
//             {event.description || "No description available."}
//           </div>
//         </div>

//         {/* Rules Section */}
//         {Array.isArray(event.rules) && event.rules.length > 0 && (
//           <div className="rules-section">
//             <h2 className="section-title">Rules</h2>
//             <div className="rules-content">
//               <ul className="rules-list">
//                 {event.rules.map((rule, index) => (
//                   <li key={index}>{rule}</li>
//                 ))}
//               </ul>
//             </div>
//           </div>
//         )}

//         {/* Registration Status Messages */}
//         {event.is_registered && (
//           <div className="status-message registered">
//             ✓ You are registered for this event
//           </div>
//         )}
        
//         {isRegistrationDisabled && !event.is_registered && (
//           <div className="status-message closed">
//             ⚠️ Registration is closed for this event
//           </div>
//         )}

//         {/* Bottom Register Button */}
//         {!event.is_registered && (
//           <div className="bottom-actions">
//             {access ? (
//               <button
//                 onClick={handleRegisterClick}
//                 disabled={isRegistrationDisabled}
//                 className={`btn-bottom-register ${isRegistrationDisabled ? 'disabled' : ''}`}
//               >
//                 REGISTER
//               </button>
//             ) : (
//               <div className="login-prompt">
//                 <Link to="/login" className="login-link">Login</Link> to register for this event
//               </div>
//             )}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }