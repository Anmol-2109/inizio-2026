import useAuthStore from "../store/useAuthStore";
import api from "../api/apiClient";
import { Link } from "react-router-dom";
import HeaderBlock from "../components/HeaderBlock";
import StatsSection from "../components/StatsSection";
import UpcomingEventHighlight from "../components/UpcomingEventHighlight";
import HowWeWorkSection from "../components/HowWeWorkSection";
import SponsorsSection from "../components/SponsorsSection";
import ContactSection from "../components/ContactSection";
import { useNavigate } from "react-router-dom";
import img from "../assets/Header_images/header.jpeg";
import flagship_img from "../assets/Home_images/flagship.png";

export default function Home() {
  const access = useAuthStore((s) => s.access);
  const refresh = useAuthStore((s) => s.refresh);
  const logout = useAuthStore((s) => s.logout);
  const isStaff = useAuthStore((s) => s.isStaff);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
  };

  return (
    <>
      <HeaderBlock
        headline="INIZIO 2026"
        subheadline="EXPLODE YOUR IDEAS INTO REALITY"
        intro="IIITG's E-Summit, A launchpad for entrepreneurs, tech enthusiasts, and visionaries. Connect, innovate, and take your startup journey to the next level"
        primaryLabel="Events"
        primaryHref="/events"
        secondaryLabel="About"
        secondaryHref="/about"
        backgroundImage={img}
      />

      <StatsSection />

      <UpcomingEventHighlight
        title="Don't miss our flagship event"
        subtitle="The annual hackathon brings together builders, thinkers, and dreamers. Twenty Four hours. One mission. Build something that matters."
        primaryLabel="Register"
        primaryHref="/events"
        secondaryLabel="Learn more"
        secondaryHref="/events"
        imageUrl={flagship_img}
        imageAlt="Students and professionals collaborating at a futuristic hackathon event"
      />

      <HowWeWorkSection />

      <SponsorsSection />

      <div style={{ padding: 20 }}>
        <h1>IE Cell Home</h1>

        {access ? (
          <>
            <div style={{ marginBottom: 20 }}>
              <button
                onClick={handleLogout}
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#dc3545",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                }}
              >
                Logout
              </button>
            </div>

            {/* Admin Section - Only show for staff users */}
            {isStaff && (
              <div
                style={{
                  marginTop: 30,
                  padding: 20,
                  border: "2px solid #007bff",
                  borderRadius: 8,
                  backgroundColor: "#f0f8ff",
                }}
              >
                <h2 style={{ marginTop: 0, color: "#007bff" }}>Admin Panel</h2>
                <p style={{ color: "#666", marginBottom: 20 }}>Manage events and system settings</p>

                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <Link to="/admin/events">
                    <button
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#007bff",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Manage Events
                    </button>
                  </Link>
                  <Link to="/admin/events/create">
                    <button
                      style={{
                        padding: "10px 20px",
                        backgroundColor: "#28a745",
                        color: "white",
                        border: "none",
                        borderRadius: 4,
                        cursor: "pointer",
                      }}
                    >
                      Create New Event
                    </button>
                  </Link>
                </div>
              </div>
            )}

            {/* Regular User Section */}
            <div style={{ marginTop: 20 }}>
              <Link to="/profile">
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    marginRight: 10,
                  }}
                >
                  My Profile
                </button>
              </Link>
              <Link to="/events">
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#17a2b8",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                    marginRight: 10,
                  }}
                >
                  View Events
                </button>
              </Link>
              <Link to="/events/notifications">
                <button
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#6c757d",
                    color: "white",
                    border: "none",
                    borderRadius: 4,
                    cursor: "pointer",
                  }}
                >
                  Notifications
                </button>
              </Link>
            </div>
          </>
        ) : (
          <div>
            <Link to="/login">
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#007bff",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                  marginRight: 10,
                }}
              >
                Login
              </button>
            </Link>
            <Link to="/register">
              <button
                style={{
                  padding: "10px 20px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: 4,
                  cursor: "pointer",
                }}
              >
                Register
              </button>
            </Link>
          </div>
        )}
      </div>

      <ContactSection />
    </>
  );
}
