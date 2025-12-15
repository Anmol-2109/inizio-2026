import { useState } from "react";
import api from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/auth/forgot-password/", { email });
      setSuccess(true);
      // Navigate after a short delay to show success message
      setTimeout(() => {
        navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
      }, 1500);
    } catch (error) {
      console.error("Forgot password error:", error);
      setError(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        "Failed to send OTP. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Forgot Password</h2>
      <p style={{ color: "#666", marginBottom: 20 }}>
        Enter your email address and we'll send you an OTP to reset your password.
      </p>

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
          OTP sent successfully! Redirecting...
        </div>
      )}

      <div style={{ marginBottom: 15 }}>
        <input 
          type="email"
          placeholder="Enter your email" 
          value={email}
          onChange={e=>setEmail(e.target.value)}
          style={{ width: "100%", padding: 8 }}
          disabled={loading || success}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !loading && !success) {
              submit();
            }
          }}
        />
      </div>

      <button 
        onClick={submit} 
        disabled={loading || success}
        style={{ 
          width: "100%", 
          padding: 10, 
          marginBottom: 10,
          backgroundColor: (loading || success) ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: (loading || success) ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Sending OTP..." : success ? "OTP Sent!" : "Send OTP"}
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
