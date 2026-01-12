import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api/apiClient";
import "./Register.css";

export default function Register() {
  const [data, setData] = useState({
    full_name: "",
    email: "",
    password: "",
    confirmPassword: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
  if (
    !data.full_name.trim() ||
    !data.email.trim() ||
    !data.password ||
    !data.confirmPassword
  ) {
    setError("Please fill out all fields.");
    return;
  }

  // ✅ Full name validation
  if (data.full_name.trim().length < 3) {
    setError("Full name must be at least 3 characters.");
    return;
  }

  if (data.full_name.length > 100) {
    setError("Full name is too long.");
    return;
  }

  // ❌ Block spam patterns like aaaaaaa / 000000
  if (/(.)\1{5,}/.test(data.full_name)) {
    setError("Invalid name format.");
    return;
  }

  // Password rules
  if (data.password.length < 6) {
    setError("Password must be at least 6 characters.");
    return;
  }

  if (data.password !== data.confirmPassword) {
    setError("Passwords do not match.");
    return;
  }

  setError("");
  setLoading(true);

  try {
    await api.post("/auth/register/", {
      full_name: data.full_name.trim(),
      email: data.email.trim(),
      password: data.password
    });

    navigate(`/verify-otp?email=${encodeURIComponent(data.email)}`);
  } catch (err) {
    const message =
      err.response?.data?.detail ||
      err.response?.data?.error ||
      "Registration failed. Please try again.";
    setError(message);
  } finally {
    setLoading(false);
  }
};


  const onKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="register-page">
      <div className="register-glow" />

      <div className="register-shell">
        <div className="register-left">
          <div className="register-left-pattern" />
          <div className="register-left-content">
            <div className="register-left-kicker">JOIN THE REVOLUTION</div>
            <h1 className="register-left-title">INIZIO</h1>
          </div>
        </div>

        <div className="register-right">
          <h2 className="register-heading">CREATE ACCOUNT</h2>
          <p className="register-subtitle">
            Enter your details to register for Inizio
          </p>

          <div className="register-form">
            {error ? <div className="register-error">{error}</div> : null}

            <div className="field-wrapper full-row">
              <label className="field-label" htmlFor="name">
                Full Name
              </label>
              <div className="input-gradient">
                <input
                  id="name"
                  className="input-field"
                  placeholder="John Doe"
                  value={data.name}
                  onChange={(e) => setData({ ...data, name: e.target.value })}
                  onKeyDown={onKeyDown}
                />
              </div>
            </div>

            <div className="field-wrapper full-row">
              <label className="field-label" htmlFor="email">
                Email
              </label>
              <div className="input-gradient">
                <input
                  id="email"
                  type="email"
                  className="input-field"
                  placeholder="name@college.edu"
                  value={data.email}
                  onChange={(e) => setData({ ...data, email: e.target.value })}
                  onKeyDown={onKeyDown}
                />
              </div>
            </div>

            <div className="field-wrapper">
              <label className="field-label" htmlFor="password">
                Password
              </label>
              <div className="input-gradient">
                <input
                  id="password"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={data.password}
                  onChange={(e) =>
                    setData({ ...data, password: e.target.value })
                  }
                  onKeyDown={onKeyDown}
                />
              </div>
            </div>

            <div className="field-wrapper">
              <label className="field-label" htmlFor="confirmPassword">
                Confirm Password
              </label>
              <div className="input-gradient">
                <input
                  id="confirmPassword"
                  type="password"
                  className="input-field"
                  placeholder="••••••••"
                  value={data.confirmPassword}
                  onChange={(e) =>
                    setData({ ...data, confirmPassword: e.target.value })
                  }
                  onKeyDown={onKeyDown}
                />
              </div>
            </div>

            <div className="full-row">
              <button
                className={`register-button${loading ? " loading" : ""}`}
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Get OTP"}
              </button>
            </div>

            <div className="register-footer full-row">
              <span>Already have an account?</span>
              <Link className="login-link" to="/login">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
