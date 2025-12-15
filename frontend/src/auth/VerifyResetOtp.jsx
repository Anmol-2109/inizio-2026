import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/apiClient";

export default function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [params] = useSearchParams();
  const email = params.get("email");
  const navigate = useNavigate();

  const verify = async () => {
    if (!email) {
      setError("Email is required. Please try forgot password again.");
      setTimeout(() => navigate("/forgot-password"), 2000);
      return;
    }
    
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Backend expects 'code' not 'otp'
      const res = await api.post("/auth/verify-reset-otp/", { email, code: otp });
      // Backend returns reset_token which should be used for password reset
      if (res.data.reset_token) {
        navigate(`/reset-password?email=${encodeURIComponent(email)}&token=${res.data.reset_token}`);
      } else {
        navigate(`/reset-password?email=${encodeURIComponent(email)}`);
      }
    } catch (error) {
      console.error("Reset OTP verification error:", error);
      setError(
        error.response?.data?.detail || 
        error.response?.data?.error || 
        "Invalid OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: "0 auto", padding: 20 }}>
      <h2>Verify Reset OTP</h2>
      
      {email && (
        <p style={{ color: "#666", marginBottom: 20 }}>
          Enter the 6-digit OTP sent to: <strong>{email}</strong>
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

      <div style={{ marginBottom: 15 }}>
        <input 
          type="text"
          placeholder="Enter 6-digit OTP" 
          value={otp}
          onChange={e=>setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
          maxLength={6}
          style={{ width: "100%", padding: 8, fontSize: "18px", letterSpacing: "4px", textAlign: "center" }}
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === "Enter" && !loading && otp.length === 6) {
              verify();
            }
          }}
        />
      </div>

      <button 
        onClick={verify} 
        disabled={loading || otp.length !== 6}
        style={{ 
          width: "100%", 
          padding: 10, 
          marginBottom: 10,
          backgroundColor: (loading || otp.length !== 6) ? "#ccc" : "#007bff",
          color: "white",
          border: "none",
          borderRadius: 4,
          cursor: (loading || otp.length !== 6) ? "not-allowed" : "pointer"
        }}
      >
        {loading ? "Verifying..." : "Verify OTP"}
      </button>

      <div style={{ textAlign: "center", marginTop: 15 }}>
        <Link 
          to={`/forgot-password`}
          style={{ 
            color: "#007bff", 
            textDecoration: "none",
            fontSize: "14px"
          }}
        >
          Resend OTP
        </Link>
      </div>
    </div>
  );
}


