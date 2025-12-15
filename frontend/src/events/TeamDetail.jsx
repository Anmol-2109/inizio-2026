import { useState, useEffect } from "react";
import api from "../api/apiClient";
import { useParams, useNavigate, Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function TeamDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { access } = useAuthStore();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    if (!access) {
      navigate("/login");
    } else {
      fetchTeam();
    }
  }, [id, access, navigate]);

  useEffect(() => {
    if (access && team) {
      fetchUserEmail();
    }
  }, [access, team]);

  const fetchTeam = async () => {
    try {
      setLoading(true);
      console.log("Fetching team with ID:", id);
      const res = await api.get(`/events/team/${id}/`);
      console.log("Team data received:", res.data);
      setTeam(res.data);
      
      // Store team ID for this event in localStorage for future reference
      if (res.data?.event?.id) {
        const eventId = res.data.event.id;
        localStorage.setItem(`team_${eventId}`, id.toString());
        const teamsMap = JSON.parse(localStorage.getItem("user_teams") || "{}");
        teamsMap[eventId] = id.toString();
        localStorage.setItem("user_teams", JSON.stringify(teamsMap));
      }
    } catch (error) {
      console.error("Error fetching team:", error);
      console.error("Error response:", error.response);
      setError(error.response?.data?.detail || error.response?.data?.error || "Failed to load team");
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    try {
      const res = await api.post(`/events/teams/${id}/accept/`);
      setTeam(res.data);
      alert("Team membership accepted!");
    } catch (error) {
      console.error("Accept error:", error);
      alert(error.response?.data?.error || "Failed to accept");
    }
  };

  const handleLeave = async () => {
    if (!window.confirm("Are you sure you want to leave this team?")) return;
    
    try {
      await api.delete(`/events/teams/${id}/leave/`);
      alert("You have left the team successfully");
      // Redirect to events page after successful leave
      navigate("/events", { replace: true });
    } catch (error) {
      console.error("Leave error:", error);
      alert(error.response?.data?.error || error.response?.data?.detail || "Failed to leave team");
    }
  };

  const handleRemoveMember = async (memberId) => {
    if (!window.confirm("Are you sure you want to remove this member?")) return;
    
    try {
      const res = await api.delete(`/events/teams/${id}/remove-member/${memberId}/`);
      setTeam(res.data);
      alert("Member removed successfully");
    } catch (error) {
      console.error("Remove member error:", error);
      alert(error.response?.data?.error || "Failed to remove member");
    }
  };

  const fetchUserEmail = async () => {
    try {
      // Get user profile to get email
      const res = await api.get("/auth/profile/");
      // Profile serializer returns full_name, department, year, phone
      // We need to get email from user - but profile doesn't include it
      // For now, we'll match members by checking if user is authenticated
      // The backend team detail should indicate which member is current user
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  if (loading) return <div style={{ padding: 20, color: "#000" }}>Loading team...</div>;
  if (error) return <div style={{ padding: 20, color: "red" }}>Error: {error}</div>;
  if (!team) return <div style={{ padding: 20, color: "#000" }}>Team not found</div>;

  // Find current member - backend now includes is_current_user flag
  const currentMember = team.members.find(m => m.is_current_user === true);
  const pendingMember = team.members.find(m => m.status === "PENDING" && m.is_current_user);
  const acceptedMembers = team.members.filter(m => m.status === "ACCEPTED");
  const isLeader = currentMember?.is_leader || false;
  
  // Count only active members (exclude LEFT members)
  const activeMembers = team.members.filter(m => m.status !== "LEFT");
  const activeMembersCount = activeMembers.length;
  const acceptedCount = acceptedMembers.length;
  
  // Check if team is below minimum size
  const isBelowMinimum = acceptedCount < team.event.min_team_size;

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "0 auto", color: "#000" }}>
      <h2 style={{ color: "#000" }}>Team: {team.team_name}</h2>
      <p style={{ color: "#000" }}><strong>Event:</strong> {team.event.name}</p>
      <p style={{ color: "#000" }}>
        <strong>Team Status:</strong> {team.is_active ? (
          <span style={{ color: "#28a745", fontWeight: "bold" }}>Active</span>
        ) : (
          <span style={{ color: "#dc3545", fontWeight: "bold" }}>Inactive</span>
        )}
        {" "}({acceptedCount} accepted / {team.event.min_team_size} minimum required)
      </p>

      <h3 style={{ color: "#000" }}>Members ({activeMembersCount} / {team.event.max_team_size})</h3>
      
      {/* Warning if team is below minimum size */}
      {isBelowMinimum && (
        <div style={{ 
          padding: 15, 
          marginBottom: 15, 
          backgroundColor: "#fff3cd", 
          border: "2px solid #ffc107",
          borderRadius: 4
        }}>
          <p style={{ color: "#856404", margin: 0, fontWeight: "bold" }}>
            ⚠️ Team Status: Inactive
          </p>
          <p style={{ color: "#856404", margin: "5px 0 0 0" }}>
            Your team has {acceptedCount} accepted member(s), but needs at least {team.event.min_team_size} member(s) to be active.
            {isLeader && " Please add more members to activate your team."}
          </p>
        </div>
      )}
      
      {/* Success message if team is active */}
      {!isBelowMinimum && team.is_active && (
        <div style={{ 
          padding: 15, 
          marginBottom: 15, 
          backgroundColor: "#d4edda", 
          border: "2px solid #28a745",
          borderRadius: 4
        }}>
          <p style={{ color: "#155724", margin: 0, fontWeight: "bold" }}>
            ✓ Team Status: Active
          </p>
          <p style={{ color: "#155724", margin: "5px 0 0 0" }}>
            Your team has {acceptedCount} accepted member(s) and meets the minimum requirement of {team.event.min_team_size} member(s).
          </p>
        </div>
      )}
      <div>
        {activeMembers.map((member) => (
          <div 
            key={member.id} 
            style={{ 
              border: "1px solid #ccc", 
              padding: 10, 
              marginBottom: 5,
              backgroundColor: member.status === "ACCEPTED" ? "#e6ffe6" : member.status === "PENDING" ? "#fff3cd" : "#ffe6e6"
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ color: "#000", margin: "5px 0" }}><strong>Email:</strong> {member.email}</p>
                <p style={{ color: "#000", margin: "5px 0" }}><strong>Status:</strong> {member.status}</p>
                {member.is_leader && <p style={{ color: "green", margin: 0 }}>✓ Leader</p>}
              </div>
              {isLeader && !member.is_leader && member.status !== "LEFT" && (
                <button
                  onClick={() => handleRemoveMember(member.id)}
                  style={{ padding: "5px 10px", backgroundColor: "red", color: "white", border: "none", borderRadius: 4 }}
                >
                  Remove
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Show accept button if current user has pending invitation */}
      {currentMember && currentMember.status === "PENDING" && access && (
        <button 
          onClick={handleAccept} 
          style={{ 
            marginTop: 10, 
            padding: "10px 20px", 
            backgroundColor: "#28a745", 
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
            marginRight: 10
          }}
        >
          Accept Team Invitation
        </button>
      )}

      {/* Show leave button for non-leader accepted members only */}
      {currentMember && !currentMember.is_leader && currentMember.status === "ACCEPTED" && (
        <button 
          onClick={handleLeave} 
          style={{ 
            marginTop: 10, 
            padding: "10px 20px", 
            backgroundColor: "red", 
            color: "white",
            border: "none",
            borderRadius: 4,
            cursor: "pointer"
          }}
        >
          Leave Team
        </button>
      )}

      {/* Leader management options */}
      {isLeader && (
        <div style={{ marginTop: 20 }}>
          <h3 style={{ color: "#000" }}>Team Management</h3>
          {activeMembersCount < team.event.max_team_size && (
            <Link to={`/events/teams/${id}/add-member`}>
              <button style={{ marginRight: 10, padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                Add Member
              </button>
            </Link>
          )}
          {activeMembersCount >= team.event.max_team_size && (
            <p style={{ color: "#000" }}>Team is full (Max: {team.event.max_team_size} members)</p>
          )}
        </div>
      )}
    </div>
  );
}

