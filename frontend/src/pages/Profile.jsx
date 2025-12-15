import { useState, useEffect } from "react";
import api from "../api/apiClient";
import useAuthStore from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

export default function Profile() {
  const { access } = useAuthStore();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [userEmail, setUserEmail] = useState("");
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
      
      // Get profile data
      const profileRes = await api.get("/auth/profile/");
      setProfile(profileRes.data);
      
      // Get user email from profile response
      if (profileRes.data.email) {
        setUserEmail(profileRes.data.email);
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setError(error.response?.data?.detail || "Failed to load profile");
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 20, textAlign: "center" }}>
        <p>Loading profile...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        <p>Error: {error}</p>
        <button onClick={() => navigate("/")}>Go Home</button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: 20 }}>
        <p>Profile not found</p>
        <Link to="/profile/edit">
          <button style={{ padding: "10px 20px", backgroundColor: "#007bff", color: "white", border: "none", borderRadius: 4, cursor: "pointer" }}>
            Create Profile
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 30 }}>
        <h2 style={{ color: "#000", margin: 0 }}>My Profile</h2>
        <Link to="/profile/edit">
          <button style={{ 
            padding: "10px 20px", 
            backgroundColor: "#007bff", 
            color: "white", 
            border: "none", 
            borderRadius: 4, 
            cursor: "pointer" 
          }}>
            Edit Profile
          </button>
        </Link>
      </div>

      <div style={{ 
        backgroundColor: "#f8f9fa", 
        padding: 20, 
        borderRadius: 8, 
        border: "1px solid #dee2e6" 
      }}>
        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 5, fontWeight: "bold" }}>
            Email
          </label>
          <p style={{ color: "#000", margin: 0, padding: "8px 12px", backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ced4da" }}>
            {userEmail || "Not available"}
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 5, fontWeight: "bold" }}>
            Full Name
          </label>
          <p style={{ color: "#000", margin: 0, padding: "8px 12px", backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ced4da" }}>
            {profile.full_name || "Not set"}
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 5, fontWeight: "bold" }}>
            Department
          </label>
          <p style={{ color: "#000", margin: 0, padding: "8px 12px", backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ced4da" }}>
            {profile.department || "Not set"}
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 5, fontWeight: "bold" }}>
            Year
          </label>
          <p style={{ color: "#000", margin: 0, padding: "8px 12px", backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ced4da" }}>
            {profile.year || "Not set"}
          </p>
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 5, fontWeight: "bold" }}>
            Phone Number
          </label>
          <p style={{ color: "#000", margin: 0, padding: "8px 12px", backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ced4da" }}>
            {profile.phone || "Not set"}
          </p>
        </div>

        {profile.is_staff !== undefined && (
          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", color: "#666", fontSize: 14, marginBottom: 5, fontWeight: "bold" }}>
              Account Type
            </label>
            <p style={{ color: "#000", margin: 0, padding: "8px 12px", backgroundColor: "#fff", borderRadius: 4, border: "1px solid #ced4da" }}>
              {profile.is_staff ? "Admin" : "Regular User"}
            </p>
          </div>
        )}
      </div>

      <div style={{ marginTop: 20 }}>
        <Link to="/">
          <button style={{ 
            padding: "10px 20px", 
            backgroundColor: "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: 4, 
            cursor: "pointer" 
          }}>
            Back to Home
          </button>
        </Link>
      </div>
    </div>
  );
}

