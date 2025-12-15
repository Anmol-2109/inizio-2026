import useAuthStore from "../store/useAuthStore";
import api from "../api/apiClient";
import { Link } from "react-router-dom";

export default function Home() {
  const { access, refresh, logout, isStaff } = useAuthStore();

  const handleLogout = async () => {
    try {
      // Backend expects refresh token in request body
      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
      // Always call logout to clear local state, even if API call fails
      logout();
      // Redirect to login page
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout error:", error);
      // Still logout locally even if API call fails
    logout();
      window.location.href = "/login";
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>IE Cell Home</h1>
      
      {access ? (
        <>
          <div style={{ marginBottom: 20 }}>
            <button onClick={handleLogout} style={{ padding: "10px 20px", backgroundColor: "#dc3545", color: "white", border: "none", borderRadius: 4 }}>
              Logout
            </button>
          </div>

          {/* Admin Section - Only show for staff users */}
          {isStaff && (
            <div style={{ marginTop: 30, padding: 20, border: "2px solid #007bff", borderRadius: 8, backgroundColor: "#f0f8ff" }}>
              <h2 style={{ marginTop: 0, color: "#007bff" }}>Admin Panel</h2>
              <p style={{ color: "#666", marginBottom: 20 }}>Manage events and system settings</p>
              
              <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                <Link to="/admin/events">
                  <button style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                    Manage Events
                  </button>
                </Link>
                <Link to="/admin/events/create">
                  <button style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                    Create New Event
                  </button>
                </Link>
              </div>
            </div>
          )}

          {/* Regular User Section */}
          <div style={{ marginTop: 20 }}>
            <Link to="/profile">
              <button style={{ padding: "10px 20px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: 4, cursor: "pointer", marginRight: 10 }}>
                My Profile
              </button>
            </Link>
            <Link to="/events">
              <button style={{ padding: "10px 20px", backgroundColor: "#17a2b8", color: "white", border: "none", borderRadius: 4, cursor: "pointer", marginRight: 10 }}>
                View Events
              </button>
            </Link>
            <Link to="/events/notifications">
              <button style={{ padding: "10px 20px", backgroundColor: "#6c757d", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
                Notifications
              </button>
            </Link>
          </div>
        </>
      ) : (
        <div>
          <Link to="/login">
            <button style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer", marginRight: 10 }}>
              Login
            </button>
          </Link>
          <Link to="/register">
            <button style={{ padding: "10px 20px", backgroundColor: "#28a745", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
              Register
            </button>
          </Link>
        </div>
      )}
    </div>
  );
}
