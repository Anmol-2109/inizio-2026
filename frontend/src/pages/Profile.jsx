import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/apiClient";
import useAuthStore from "../store/useAuthStore";
import Footer from "../components/Footer";
import "./Profile.css";

export default function Profile() {
  const { access } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!access) {
      navigate("/login");
      return;
    }
    fetchProfile();
  }, [access, navigate]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError("");
      const profileRes = await api.get("/auth/profile/");
      setProfile(profileRes.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err.response?.data?.detail || "Failed to load profile");
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const avatarInitial = useMemo(() => {
    const fullName = profile?.full_name || "";
    const initial = fullName.trim().charAt(0);
    return initial ? initial.toUpperCase() : "I";
  }, [profile?.full_name]);

  const renderValue = (value) =>
    value ? <span className="profile-value">{value}</span> : <span className="profile-value profile-empty">Not set</span>;

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-card">
          <p style={{ margin: 0, color: "#e5e7eb" }}>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-card" style={{ alignItems: "center" }}>
          <p style={{ color: "#fca5a5", margin: 0 }}>{error}</p>
          <div className="profile-actions">
            <Link to="/">
              <button className="profile-btn secondary">Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-card" style={{ alignItems: "center" }}>
          <p style={{ color: "#e5e7eb", margin: 0 }}>Profile not found.</p>
          <div className="profile-actions">
            <Link to="/profile/edit">
              <button className="profile-btn primary">Create Profile</button>
            </Link>
            <Link to="/">
              <button className="profile-btn secondary">Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="profile-page">
        <div className="profile-glow" />
        <div className="profile-card">
          <div className="profile-avatar" aria-label="Profile avatar">
            {avatarInitial}
          </div>
          <h2 className="profile-name">{profile.full_name || "Your Name"}</h2>

          <div className="profile-grid">
            <span className="profile-label">Email</span>
            {renderValue(profile.email)}

            {profile.college_name && (
              <>
                <span className="profile-label">College</span>
                {renderValue(profile.college_name)}
              </>
            )}

            <span className="profile-label">Phone</span>
            {renderValue(profile.phone)}
          </div>

          <div className="profile-actions">
            <Link to="/profile/edit">
              <button className="profile-btn primary">Edit Profile</button>
            </Link>
            <Link to="/">
              <button className="profile-btn secondary">Back to Home</button>
            </Link>
          </div>
        </div>
      </div>
      {/* <Footer /> */}
    </>
  );
}

