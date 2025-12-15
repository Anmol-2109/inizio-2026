import { useState, useEffect } from "react";
import api from "../api/apiClient";
import useAuthStore from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

export default function CompleteProfile() {
  const { access, refresh, setAuth } = useAuthStore();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: "",
    department: "CSE",
    year: "",
    phone: ""
  });
  const [loading, setLoading] = useState(false);

  // Fetch existing profile data if available
  useEffect(() => {
    const fetchProfile = async () => {
      if (!access) return;
      
      try {
        const res = await api.get("/auth/profile/");
        if (res.data) {
          setFormData({
            full_name: res.data.full_name || "",
            department: res.data.department || "CSE",
            year: res.data.year || "",
            phone: res.data.phone || ""
          });
          
          // Update is_staff in auth store if profile returns it
          if (res.data.is_staff !== undefined) {
            const { setAuth, access: currentAccess, refresh, profileComplete } = useAuthStore.getState();
            setAuth({
              access: currentAccess,
              refresh,
              profileComplete,
              isStaff: res.data.is_staff
            });
          }
        }
      } catch (error) {
        // Profile might not exist yet, that's okay
        console.log("Profile not found, will create new one");
      }
    };
    
    fetchProfile();
  }, [access]);

  const submit = async () => {
    try {
      // Ensure we have a token before making the request
      if (!access) {
        console.error("No access token found. Please login again.");
        navigate("/login");
        return;
      }

      // Validate required fields
      if (!formData.full_name || formData.full_name.trim() === "") {
        alert("Full name is required");
        return;
      }

      setLoading(true);
      
      // Backend expects: full_name, department, year, phone
      const res = await api.put("/auth/profile/", {
        full_name: formData.full_name,
        department: formData.department,
        year: formData.year,
        phone: formData.phone
      });
      
      // Preserve is_staff from current state
      const { isStaff } = useAuthStore.getState();
      setAuth({ access, refresh, profileComplete: true, isStaff: isStaff || false });
      navigate("/profile");
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = error.response?.data?.full_name?.[0] || 
                          error.response?.data?.detail || 
                          error.response?.data?.error || 
                          "Failed to update profile. Please try again.";
      alert(errorMessage);
      
      // If 401, redirect to login
      if (error.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 500, margin: "0 auto", padding: 20 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ margin: 0 }}>Edit Profile</h2>
        <Link to="/profile">
          <button style={{ 
            padding: "8px 16px", 
            backgroundColor: "#6c757d", 
            color: "white", 
            border: "none", 
            borderRadius: 4, 
            cursor: "pointer" 
          }}>
            Cancel
          </button>
        </Link>
      </div>
      
      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Full Name *</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={formData.full_name}
          onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
          style={{ width: "100%", padding: 8 }}
          required
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Department *</label>
        <select
          value={formData.department}
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          style={{ width: "100%", padding: 8 }}
        >
          <option value="CSE">Computer Science & Engineering</option>
          <option value="ECE">Electronics & Communication Engineering</option>
          <option value="Mathematics">Mathematics</option>
        </select>
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Year</label>
        <input
          type="text"
          placeholder="e.g., 1st Year, 2nd Year"
          value={formData.year}
          onChange={(e) => setFormData({ ...formData, year: e.target.value })}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <label style={{ display: "block", marginBottom: 5 }}>Phone</label>
        <input
          type="tel"
          placeholder="Enter your phone number"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          style={{ width: "100%", padding: 8 }}
        />
      </div>

      <button 
        onClick={submit} 
        disabled={loading}
        style={{ 
          width: "100%", 
          padding: 10, 
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
}
