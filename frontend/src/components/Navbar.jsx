import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import "./Navbar.css";
import About from "../pages/About";
const HIDE_PATHS = new Set([
  "/register",
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/verify-reset-otp",
  "/reset-password"
]);

const links = [
  { label: "Home", to: "/" },
  { label: "Team", to: "/events" },
  { label: "About", to: "/about" },
  { label: "More", to: "/events/past", isDropdownStub: true }
];

export default function Navbar() {
  const { access, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const hideNav = HIDE_PATHS.has(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const isActive = (path) => {
    const match = useMatch(path === "/" ? "/" : `${path}/*`);
    return Boolean(match);
  };

  if (hideNav) return null;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="navbar-left">
            <button
              className="navbar-logo-btn"
              aria-label="Open navigation"
              onClick={() => setIsMenuOpen(true)}
            >
              Inizio
            </button>

            <div className="nav-links" aria-label="Main navigation">
              {links.map((item) =>
                item.isDropdownStub ? (
                  <Link key={item.label} to={item.to} className="nav-more">
                    <span>{item.label}</span>
                    <span className="nav-caret" aria-hidden="true" />
                  </Link>
                ) : (
                  <Link
                    key={item.label}
                    to={item.to}
                    className={`nav-link ${isActive(item.to) ? "active" : ""}`}
                  >
                    {item.label}
                  </Link>
                )
              )}
            </div>
          </div>

          <div className="navbar-actions">
            {!access ? (
              <>
                <Link to="/login">
                  <button type="button" className="btn btn-login">
                    Login
                  </button>
                </Link>
              </>
            ) : (
              <button
                type="button"
                className="btn btn-register"
                onClick={() => {
                  logout();
                  navigate("/login", { replace: true });
                }}
              >
                Logout
              </button>
            )}
          </div>
        </div>
      </nav>

      {isMenuOpen && (
        <div
          className="sidebar-overlay"
          onClick={() => setIsMenuOpen(false)}
          role="presentation"
        >
          <div
            className="sidebar"
            onClick={(e) => e.stopPropagation()}
            role="presentation"
          >
            <div className="sidebar-header">
              <div className="sidebar-avatar">P</div>
              <div className="sidebar-title">
                <span className="label">Profile</span>
                <Link to="/profile" className="value" onClick={() => setIsMenuOpen(false)}>
                  View Profile
                </Link>
              </div>
            </div>

            <div className="sidebar-nav" aria-label="Mobile navigation">
              {links.map((item) => (
                <Link
                  key={item.label}
                  to={item.to}
                  className="sidebar-link"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </div>

            <div className="sidebar-footer">
              {!access ? (
                <>
                  <Link to="/login" onClick={() => setIsMenuOpen(false)} className="sidebar-link" style={{ padding: "10px 0" }}>
                    Login
                  </Link>
                  <Link to="/register" onClick={() => setIsMenuOpen(false)} className="sidebar-link" style={{ padding: "10px 0" }}>
                    Register
                  </Link>
                </>
              ) : (
                <button
                  className="btn btn-register"
                  style={{ width: "100%" }}
                  onClick={() => {
                    logout();
                    setIsMenuOpen(false);
                    navigate("/login", { replace: true });
                  }}
                >
                  Logout
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
