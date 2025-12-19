import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import api from "../api/apiClient";
import "./AuthShared.css";

export default function VerifyResetOtp() {
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);
  const [params] = useSearchParams();
  const email = params.get("email");
  const navigate = useNavigate();

  const verify = async () => {
    if (!email) {
      setError("Email is required. Please try forgot password again.");
      setTimeout(() => navigate("/forgot-password"), 1200);
      return;
    }
    
    if (!otp || otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/verify-reset-otp/", { email, code: otp });
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

  const resend = async () => {
    if (!email) {
      setError("Email is required. Please try forgot password again.");
      setTimeout(() => navigate("/forgot-password"), 1200);
      return;
    }

    try {
      await api.post("/auth/forgot-password/", { email });
      setResent(true);
      setTimeout(() => setResent(false), 2000);
    } catch (error) {
      console.error("Resend OTP error:", error);
      setError(error.response?.data?.error || "Failed to resend OTP. Please try again.");
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !loading && otp.length === 6) {
      verify();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-shell">
        <div className="auth-left">
          <div className="auth-left-pattern" />
          <div className="auth-left-content">
            <div className="auth-left-kicker">SECURE YOUR ACCOUNT</div>
            <h1 className="auth-left-title">INIZIO</h1>
          </div>
        </div>

        <div className="auth-right">
          <div>
            <h2 className="auth-heading">VERIFY RESET OTP</h2>
            <p className="auth-subtitle">
              Enter the 6-digit code we sent to {email || "your email"}.
            </p>
          </div>

          <div className="auth-form">
            {error ? <div className="auth-error">{error}</div> : null}
            {resent ? <div className="auth-success">OTP resent to your email</div> : null}

            <div className="auth-field-wrapper">
              <label className="auth-field-label" htmlFor="otp">
                6-digit OTP
              </label>
              <div className="auth-input-gradient">
                <input
                  id="otp"
                  className="auth-input"
                  inputMode="numeric"
                  placeholder="------"
                  maxLength={6}
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                  }
                  onKeyDown={onKeyDown}
                  disabled={loading}
                  style={{ letterSpacing: "6px", textAlign: "center" }}
                />
              </div>
            </div>

            <button
              className={`auth-button${loading ? " loading" : ""}`}
              onClick={verify}
              disabled={loading || otp.length !== 6}
            >
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <div className="auth-footer">
              <span>Need a new code?</span>
              <button
                type="button"
                className="auth-link-primary"
                style={{ background: "none", border: "none", padding: 0 }}
                onClick={resend}
                disabled={loading}
              >
                Resend OTP
              </button>
              <Link className="auth-link-primary" to="/forgot-password">
                Back
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
