import { useState } from "react";
import api from "../api/apiClient";
import useAuthStore from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [data, setData] = useState({ email:"", password:"" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore(s=>s.setAuth);
  const navigate = useNavigate();
  
  // Check for redirect parameter
  const urlParams = new URLSearchParams(window.location.search);
  const next = urlParams.get("next");

  const submit = async () => {
    if (!data.email || !data.password) {
      setError("Please enter both email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login/", data);
      setAuth({
        access: res.data.access,
        refresh: res.data.refresh,
        profileComplete: res.data.profile_complete,
        isStaff: res.data.is_staff || false
      });
      
      // Handle redirect after login
      if (next) {
        navigate(next);
      } else if (res.data.profile_complete) {
        navigate("/");
      } else {
        navigate("/complete-profile");
      }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);
      
      // Handle different error response formats from DRF
      let errorMessage = "Invalid email or password. Please try again.";
      
      if (error.response?.data) {
        const errorData = error.response.data;
        
        // DRF ValidationError can return errors in different formats:
        // 1. String message: { "detail": "message" } or just "message"
        // 2. Field errors: { "email": ["error"], "password": ["error"] }
        // 3. Non-field errors: { "non_field_errors": ["error"] }
        // 4. Array: ["error1", "error2"]
        
        if (typeof errorData === 'string') {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          errorMessage = errorData.non_field_errors[0];
        } else if (Array.isArray(errorData)) {
          errorMessage = errorData[0];
        } else if (errorData.email && Array.isArray(errorData.email)) {
          errorMessage = errorData.email[0];
        } else if (errorData.password && Array.isArray(errorData.password)) {
          errorMessage = errorData.password[0];
        } else {
          // Try to get first error message from any field
          const firstKey = Object.keys(errorData)[0];
          if (firstKey && Array.isArray(errorData[firstKey])) {
            errorMessage = errorData[firstKey][0];
          } else if (firstKey) {
            errorMessage = String(errorData[firstKey]);
          }
        }
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Login</h2>
      
      {error && (
        <div style={{ 
          color: "red", 
          marginBottom: 10, 
          padding: 10, 
          backgroundColor: "#ffe6e6",
          borderRadius: 4 
        }}>
          {error}
        </div>
      )}

      <div style={{ marginBottom: 15 }}>
        <input 
          type="email"
          placeholder="Email" 
          value={data.email}
          onChange={e=>setData({...data,email:e.target.value})}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <input 
          type="password" 
          placeholder="Password" 
          value={data.password}
          onChange={e=>setData({...data,password:e.target.value})}
          style={{ width: "100%", padding: 8 }}
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !loading) {
              submit();
            }
          }}
        />
      </div>

      <button 
        onClick={submit} 
        disabled={loading}
        style={{ 
          width: "100%", 
          padding: 10, 
          marginBottom: 10,
          backgroundColor: loading ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: loading ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Logging in..." : "Login"}
      </button>

      <div style={{ textAlign: "center", marginTop: 10 }}>
        <Link 
          to="/forgot-password" 
          style={{ 
            color: "#007bff", 
            textDecoration: "none",
            fontSize: "14px"
          }}
        >
          Forgot Password?
        </Link>
      </div>

      <div style={{ textAlign: "center", marginTop: 15 }}>
        <span style={{ fontSize: "14px" }}>Don't have an account? </span>
        <Link 
          to="/register" 
          style={{ 
            color: "#007bff", 
            textDecoration: "none",
            fontSize: "14px"
          }}
        >
          Register
        </Link>
      </div>
    </div>
  );
}
