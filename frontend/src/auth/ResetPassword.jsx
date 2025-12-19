import { useSearchParams, Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../api/apiClient";
import "./AuthShared.css";

export default function ResetPassword() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
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
      setTimeout(() => navigate("/forgot-password"), 1200);
      return;
    }

    if (!reset_token) {
      setError("Reset token is missing. Please verify OTP again.");
      setTimeout(() => navigate(`/verify-reset-otp?email=${encodeURIComponent(email)}`), 1200);
      return;
    }

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters long.");
      return;
    }

    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await api.post("/auth/reset-password/", { 
        email, 
        reset_token,
        new_password: password 
      });
      setSuccess(true);
      setTimeout(() => {
        window.location.href = "/login";
      }, 1600);
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

  const onKeyDown = (e) => {
    if (e.key === "Enter" && !loading && !success) {
      reset();
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow" />
      <div className="auth-shell">
        <div className="auth-left">
          <div className="auth-left-pattern" />
          <div className="auth-left-content">
            <div className="auth-left-kicker">START FRESH SECURELY</div>
            <h1 className="auth-left-title">INIZIO</h1>
          </div>
        </div>

        <div className="auth-right">
          <div>
            <h2 className="auth-heading">RESET PASSWORD</h2>
            <p className="auth-subtitle">
              Set a new password for {email || "your account"}.
            </p>
          </div>

          <div className="auth-form">
            {error ? <div className="auth-error">{error}</div> : null}
            {success ? <div className="auth-success">Password reset successful! Redirecting...</div> : null}

            <div className="auth-field-wrapper">
              <label className="auth-field-label" htmlFor="password">
                New Password
              </label>
              <div className="auth-input-gradient">
                <input
                  id="password"
                  type="password"
                  className="auth-input"
                  placeholder="At least 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={loading || success}
                />
              </div>
            </div>

            <div className="auth-field-wrapper">
              <label className="auth-field-label" htmlFor="confirm">
                Confirm Password
              </label>
              <div className="auth-input-gradient">
                <input
                  id="confirm"
                  type="password"
                  className="auth-input"
                  placeholder="Re-enter password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={onKeyDown}
                  disabled={loading || success}
                />
              </div>
            </div>

            <button
              className={`auth-button${loading ? " loading" : ""}`}
              onClick={reset}
              disabled={loading || success || !password || !confirm}
            >
              {loading ? "Resetting..." : success ? "Password Reset!" : "Reset Password"}
            </button>

            <div className="auth-footer">
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
