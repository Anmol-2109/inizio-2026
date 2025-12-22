import { useState } from "react";
import api from "../api/apiClient";
import useAuthStore from "../store/useAuthStore";
import { useNavigate, Link } from "react-router-dom";
import "./Login.css";
import { useSearchParams } from "react-router-dom";
import { registerForPush } from "../utils/registerForPush";



export default function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const setAuth = useAuthStore((s) => s.setAuth);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Check for redirect parameter
  // const urlParams = new URLSearchParams(window.location.search);
  // const next = urlParams.get("next");

  

  const handleSubmit = async () => {
    if (!data.email || !data.password) {
      setError("Please enter both email and password.");
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
      registerForPush();
      navigate("/", { replace: true });

      // Handle redirect after login
      // if (next) {
      //   navigate(next);
      // } else if (res.data.profile_complete) {
      //   navigate("/");
      // } else {
      //   navigate("/complete-profile");
      // }
    } catch (error) {
      console.error("Login error:", error);
      console.error("Error response:", error.response?.data);

      // Handle different error response formats from DRF
      let errorMessage = "Invalid email or password. Please try again.";

      if (error.response?.data) {
        const errorData = error.response.data;

        if (typeof errorData === "string") {
          errorMessage = errorData;
        } else if (errorData.detail) {
          errorMessage = errorData.detail;
        } else if (errorData.error) {
          errorMessage = errorData.error;
        } else if (
          errorData.non_field_errors &&
          Array.isArray(errorData.non_field_errors)
        ) {
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

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !loading) {
      handleSubmit();
    }
  };

  return (
    <div className="login-page">
      <div className="login-glow" />

      <div className="login-shell">
        <div className="login-left">
          <div className="login-left-pattern" />
          <div className="login-left-content">
            <div className="login-left-kicker">I &amp; E CELL PRESENTS</div>
            <h1 className="login-left-title">INIZIO</h1>
          </div>
        </div>

        <div className="login-right">
          <div>
            <h2 className="login-heading">WELCOME BACK</h2>
            <p className="login-subtitle">Please enter your details</p>
          </div>

          <div className="login-form">
            {error ? <div className="login-error">{error}</div> : null}

            <div className="field-wrapper">
              <label className="field-label" htmlFor="email">
                Student Email / id
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

            <div className="login-remember-row">
              <input
                id="remember"
                type="checkbox"
                className="login-checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember">Remember me</label>
              <div className="login-links">
                <Link className="login-link-primary" to="/forgot-password">
                  Forgot Password
                </Link>
              </div>
            </div>

            <button
              className={`login-button${loading ? " loading" : ""}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Log In"}
            </button>

            <div className="login-footer">
              <span>Don&apos;t have an account yet?</span>
              <Link className="login-link-primary" to="/register">
                Register Here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
