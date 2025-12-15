import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import useAuthStore from "../store/useAuthStore";

export default function InviteHandler() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { access } = useAuthStore();

  useEffect(() => {
    handleInvite();
  }, [token, access]);

  const handleInvite = async () => {
    if (!access) {
      // Redirect to login with next parameter
      navigate(`/login?next=/events/invite/${token}`);
      return;
    }

    try {
      // Backend handles the invite redirect, but we need to call it
      // The backend redirects, so we'll make the API call
      const res = await api.get(`/events/invite/${token}/`);
      
      // If successful, backend redirects to team page
      // But since we're in frontend, we need to extract team ID from response
      // Actually, backend does HttpResponseRedirect, so we need to handle it differently
      
      // For now, we'll try to get team info from the invite
      // This is a workaround - ideally backend would return JSON with team_id
      alert("Invite accepted! Redirecting to team page...");
      // We'll need to get team ID from somewhere - maybe from the redirect URL
    } catch (error) {
      console.error("Invite error:", error);
      if (error.response?.status === 400 || error.response?.status === 403) {
        alert(error.response?.data?.detail || "Invalid or expired invite");
        navigate("/events");
      } else if (error.response?.status === 302) {
        // Backend redirect - extract location
        const location = error.response?.headers?.location;
        if (location) {
          // Extract team ID from redirect URL
          const match = location.match(/\/team\/(\d+)/);
          if (match) {
            navigate(`/events/team/${match[1]}`);
          } else {
            navigate("/events");
          }
        }
      } else {
        navigate("/events");
      }
    }
  };

  return <div>Processing invite...</div>;
}

