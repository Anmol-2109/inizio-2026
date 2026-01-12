import { useState } from "react";
import api from "../api/apiClient";
import { useNavigate, Link } from "react-router-dom";
import "./AuthShared.css";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();

  const submit = async () => {
    if (!email || !email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      await api.post("/auth/forgot-password/", { email });
      setSuccess(true);
      setTimeout(() => {
        navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`);
      }, 1200);
    } catch (error) {
      setError(
        error.response?.data?.detail ||
        error.response?.data?.error ||
        "Failed to send OTP. Please check your email and try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !loading && !success) {
      submit();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-shell">
        <div className="auth-left">
          <div className="auth-left-pattern" />
          <div className="auth-left-content">
            <div className="auth-left-kicker">RESET WITH CONFIDENCE</div>
            <h1 className="auth-left-title">INIZIO</h1>
          </div>
        </div>

        <div className="auth-right">
          <div>
            <h2 className="auth-heading">FORGOT PASSWORD</h2>
            <p className="auth-subtitle">
              Enter your email to receive an OTP and reset your password.
            </p>
          </div>

          <div className="auth-form">
            {error ? <div className="auth-error">{error}</div> : null}
            {success ? (
              <div className="auth-success">OTP sent! Redirecting...</div>
            ) : null}

            <div className="auth-field-wrapper">
              <label className="auth-field-label" htmlFor="email">
                Email Address
              </label>
              <div className="auth-input-gradient">
                <input
                  id="email"
                  type="email"
                  className="auth-input"
                  placeholder="name@college.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={loading || success}
                />
              </div>
            </div>

            <button
              className={`auth-button${loading ? " loading" : ""}`}
              onClick={submit}
              disabled={loading || success}
            >
              {loading ? "Sending OTP..." : success ? "OTP Sent!" : "Send OTP"}
            </button>

            <div className="auth-footer">
              <span>Remembered your password?</span>
              <Link className="auth-link-primary" to="/login">
                Back to Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
