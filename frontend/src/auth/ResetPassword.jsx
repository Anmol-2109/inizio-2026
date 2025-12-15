import { useSearchParams, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/apiClient";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const email = params.get("email");
  const reset_token = params.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const reset = async () => {
    if (!email) {
      setError("Email is required. Please try forgot password again.");
      return;
    }

    if (!reset_token) {
      setError("Reset token is missing. Please verify OTP again.");
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Backend expects 'new_password' not 'password', and requires 'reset_token'
      await api.post("/auth/reset-password/", { 
        email, 
        reset_token,
        new_password: password 
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 2000);
    } catch (error) {
      console.error("Reset password error:", error);
      setError(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        "Failed to reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Reset Password</h2>
      
      {email && (
        <p style={{ color: "#666", marginBottom: 20 }}>
          Reset password for: <strong>{email}</strong>
        </p>
      )}

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

      {success && (
        <div style={{ 
          color: "green", 
          marginBottom: 10, 
          padding: 10, 
          backgroundColor: "#e6ffe6",
          borderRadius: 4 
        }}>
          Password reset successful! Redirecting to login...
        </div>
      )}

      <div style={{ marginBottom: 15 }}>
        <input 
          type="password" 
          placeholder="New Password (min 6 characters)" 
          value={password}
          onChange={e=>setPassword(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          disabled={loading || success}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !loading && !success) {
              reset();
            }
          }}
        />
      </div>

      <div style={{ marginBottom: 15 }}>
        <input 
          type="password" 
          placeholder="Confirm Password" 
          value={confirm}
          onChange={e=>setConfirm(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          disabled={loading || success}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !loading && !success) {
              reset();
            }
          }}
        />
      </div>

      <button 
        onClick={reset} 
        disabled={loading || success || !password || !confirm}
        style={{ 
          width: "100%", 
          padding: 10, 
          marginBottom: 10,
          backgroundColor: (loading || success || !password || !confirm) ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: (loading || success || !password || !confirm) ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Resetting..." : success ? "Password Reset!" : "Reset Password"}
      </button>

      <div style={{ textAlign: "center", marginTop: 15 }}>
        <Link 
          to="/login" 
          style={{ 
            color: "#007bff", 
            textDecoration: "none",
            fontSize: "14px"
          }}
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
