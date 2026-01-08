// import { Link, useLocation, useMatch, useNavigate } from "react-router-dom";
// import { useState } from "react";
// import useAuthStore from "../store/useAuthStore";
// import "./Navbar.css";
// import About from "../pages/About";
// const HIDE_PATHS = new Set([
//   "/register",
//   "/login",
//   "/forgot-password",
//   "/verify-otp",
//   "/verify-reset-otp",
//   "/reset-password"
// ]);

// const links = [
//   { label: "Home", to: "/" },
//   { label: "Team", to: "/events" },
//   { label: "About", to: "/about" },
//   { label: "More", to: "/events/past", isDropdownStub: true }
// ];

// export default function Navbar() {
//   const { access, logout } = useAuthStore();
//   const location = useLocation();
//   const navigate = useNavigate();
//   const hideNav = HIDE_PATHS.has(location.pathname);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   const isActive = (path) => {
//     const match = useMatch(path === "/" ? "/" : `${path}/*`);
//     return Boolean(match);
//   };

//   if (hideNav) return null;

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-inner">
//           <div className="navbar-left">
//             <button
//               className="navbar-logo-btn"
//               aria-label="Open navigation"
//               onClick={() => setIsMenuOpen(true)}
//             >
//               Inizio
//             </button>

//             <div className="nav-links" aria-label="Main navigation">
//               {links.map((item) =>
//                 item.isDropdownStub ? (
//                   <Link key={item.label} to={item.to} className="nav-more">
//                     <span>{item.label}</span>
//                     <span className="nav-caret" aria-hidden="true" />
//                   </Link>
//                 ) : (
//                   <Link
//                     key={item.label}
//                     to={item.to}
//                     className={`nav-link ${isActive(item.to) ? "active" : ""}`}
//                   >
//                     {item.label}
//                   </Link>
//                 )
//               )}
//             </div>
//           </div>

//           <div className="navbar-actions">
//             {!access ? (
//               <>
//                 <Link to="/login">
//                   <button type="button" className="btn btn-login">
//                     Login
//                   </button>
//                 </Link>
//               </>
//             ) : (
//               <button
//                 type="button"
//                 className="btn btn-register"
//                 onClick={() => {
//                   logout();
//                   navigate("/login", { replace: true });
//                 }}
//               >
//                 Logout
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {isMenuOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={() => setIsMenuOpen(false)}
//           role="presentation"
//         >
//           <div
//             className="sidebar"
//             onClick={(e) => e.stopPropagation()}
//             role="presentation"
//           >
//             <div className="sidebar-header">
//               <div className="sidebar-avatar">P</div>
//               <div className="sidebar-title">
//                 <span className="label">Profile</span>
//                 <Link to="/profile" className="value" onClick={() => setIsMenuOpen(false)}>
//                   View Profile
//                 </Link>
//               </div>
//             </div>

//             <div className="sidebar-nav" aria-label="Mobile navigation">
//               {links.map((item) => (
//                 <Link
//                   key={item.label}
//                   to={item.to}
//                   className="sidebar-link"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </div>

//             <div className="sidebar-footer">
//               {!access ? (
//                 <>
//                   <Link to="/login" onClick={() => setIsMenuOpen(false)} className="sidebar-link" style={{ padding: "10px 0" }}>
//                     Login
//                   </Link>
//                   <Link to="/register" onClick={() => setIsMenuOpen(false)} className="sidebar-link" style={{ padding: "10px 0" }}>
//                     Register
//                   </Link>
//                 </>
//               ) : (
//                 <button
//                   className="btn btn-register"
//                   style={{ width: "100%" }}
//                   onClick={() => {
//                     logout();
//                     setIsMenuOpen(false);
//                     navigate("/login", { replace: true });
//                   }}
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }

// import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
// import { useState } from "react";
// import useAuthStore from "../store/useAuthStore";
// import api from "../api/apiClient";
// import "./Navbar.css";

// const HIDE_PATHS = new Set([
//   "/register",
//   "/login",
//   "/forgot-password",
//   "/verify-otp",
//   "/verify-reset-otp",
//   "/reset-password",
// ]);

// const links = [
//   { label: "Home", to: "/" },
//   { label: "Team", to: "/events" },
//   { label: "About", to: "/about" },
//   { label: "More", to: "/events/past", isDropdownStub: true },
// ];

// export default function Navbar() {
//   // ✅ selector-based Zustand usage (prevents extra rerenders)
//   const access = useAuthStore((s) => s.access);
//   const logout = useAuthStore((s) => s.logout);

//   const location = useLocation();
//   const navigate = useNavigate();
//   const hideNav = HIDE_PATHS.has(location.pathname);
//   const [isMenuOpen, setIsMenuOpen] = useState(false);

//   // ✅ centralized logout with backend sync
//   const handleLogout = async () => {
//     try {
//       const refresh = useAuthStore.getState().refresh;
//       if (refresh) {
//         await api.post("/auth/logout/", { refresh });
//       }
//     } catch (e) {
//       console.error("Logout API error:", e);
//     } finally {
//       logout();
//       navigate("/login", { replace: true });
//     }
//   };

//   if (hideNav) return null;

//   return (
//     <>
//       <nav className="navbar">
//         <div className="navbar-inner">
//           <div className="navbar-left">
//             <button
//               className="navbar-logo-btn"
//               aria-label="Open navigation"
//               onClick={() => setIsMenuOpen(true)}
//             >
//               Inizio
//             </button>

//             {/* ✅ NavLink replaces useMatch (NO hook violations) */}
//             <div className="nav-links" aria-label="Main navigation">
//               {links.map((item) =>
//                 item.isDropdownStub ? (
//                   <NavLink key={item.label} to={item.to} className="nav-more">
//                     <span>{item.label}</span>
//                     <span className="nav-caret" aria-hidden="true" />
//                   </NavLink>
//                 ) : (
//                   <NavLink
//                     key={item.label}
//                     to={item.to}
//                     className={({ isActive }) =>
//                       `nav-link ${isActive ? "active" : ""}`
//                     }
//                   >
//                     {item.label}
//                   </NavLink>
//                 )
//               )}
//             </div>
//           </div>

//           <div className="navbar-actions">
//             {!access ? (
//               <Link to="/login">
//                 <button type="button" className="btn btn-login">
//                   Login
//                 </button>
//               </Link>
//             ) : (
//               <button
//                 type="button"
//                 className="btn btn-register"
//                 onClick={handleLogout}
//               >
//                 Logout
//               </button>
//             )}
//           </div>
//         </div>
//       </nav>

//       {isMenuOpen && (
//         <div
//           className="sidebar-overlay"
//           onClick={() => setIsMenuOpen(false)}
//           role="presentation"
//         >
//           <div
//             className="sidebar"
//             onClick={(e) => e.stopPropagation()}
//             role="presentation"
//           >
//             <div className="sidebar-header">
//               <div className="sidebar-avatar">P</div>
//               <div className="sidebar-title">
//                 <span className="label">Profile</span>
//                 <Link
//                   to="/profile"
//                   className="value"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   View Profile
//                 </Link>
//               </div>
//             </div>

//             <div className="sidebar-nav" aria-label="Mobile navigation">
//               {links.map((item) => (
//                 <Link
//                   key={item.label}
//                   to={item.to}
//                   className="sidebar-link"
//                   onClick={() => setIsMenuOpen(false)}
//                 >
//                   {item.label}
//                 </Link>
//               ))}
//             </div>

//             <div className="sidebar-footer">
//               {!access ? (
//                 <>
//                   <Link
//                     to="/login"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="sidebar-link"
//                     style={{ padding: "10px 0" }}
//                   >
//                     Login
//                   </Link>
//                   <Link
//                     to="/register"
//                     onClick={() => setIsMenuOpen(false)}
//                     className="sidebar-link"
//                     style={{ padding: "10px 0" }}
//                   >
//                     Register
//                   </Link>
//                 </>
//               ) : (
//                 <button
//                   className="btn btn-register"
//                   style={{ width: "100%" }}
//                   onClick={() => {
//                     handleLogout();
//                     setIsMenuOpen(false);
//                   }}
//                 >
//                   Logout
//                 </button>
//               )}
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }


import { Link, useLocation, useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";
import useAuthStore from "../store/useAuthStore";
import api from "../api/apiClient";
import "./Navbar.css";
import INIZIO_LOGO from "../assets/logo/INIZIO-logo.png"
import IECell_LOGO from "../assets/logo/IE-Cell-logo.png"

const HIDE_PATHS = new Set([
  "/register",
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/verify-reset-otp",
  "/reset-password",
]);

const links = [
  { label: "Home", to: "/" },
  { label: "Events", to: "/events" },
  { label: "About", to: "/about" },
  { label: "Team", to: "#"},
];

export default function Navbar() {
  // ✅ selector-based Zustand usage (prevents extra rerenders)
  const access = useAuthStore((s) => s.access);
  const logout = useAuthStore((s) => s.logout);

  const location = useLocation();
  const navigate = useNavigate();
  const hideNav = HIDE_PATHS.has(location.pathname);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // ✅ centralized logout with backend sync
  const handleLogout = async () => {
    try {
      const refresh = useAuthStore.getState().refresh;
      if (refresh) {
        await api.post("/auth/logout/", { refresh });
      }
    } catch (e) {
      console.error("Logout API error:", e);
    } finally {
      logout();
      navigate("/login", { replace: true });
    }
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
              <img 
                src={INIZIO_LOGO}
                alt="Inizio Logo" 
                className="navbar-logo-img"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
              Inizio
            </button>

            {/* ✅ NavLink replaces useMatch (NO hook violations) */}
            <div className="nav-links" aria-label="Main navigation">
              {links.map((item) =>
                item.isDropdownStub ? (
                  <NavLink key={item.label} to={item.to} className="nav-more">
                    <span>{item.label}</span>
                    <span className="nav-caret" aria-hidden="true" />
                  </NavLink>
                ) : (
                  <NavLink
                    key={item.label}
                    to={item.to}
                    className={({ isActive }) =>
                      `nav-link ${isActive ? "active" : ""}`
                    }
                  >
                    {item.label}
                  </NavLink>
                )
              )}
            </div>
          </div>


          <div className="navbar-actions">
            <button
              type="button"
              className="notification-icon-btn"
              aria-label="Notifications"
              onClick={() => navigate("/events/notifications")}
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="notification-icon"
              >
                <path
                  d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.73 21a2 2 0 0 1-3.46 0"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            {!access ? (
              <Link to="/login">
                <button type="button" className="btn btn-login">
                  Login
                </button>
              </Link>
            ) : (
              <button
                type="button"
                className="btn btn-register"
                onClick={handleLogout}
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
                <Link
                  to="/profile"
                  className="value"
                  onClick={() => setIsMenuOpen(false)}
                >
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
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="sidebar-link"
                    style={{ padding: "10px 0" }}
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setIsMenuOpen(false)}
                    className="sidebar-link"
                    style={{ padding: "10px 0" }}
                  >
                    Register
                  </Link>
                </>
              ) : (
                <button
                  className="btn btn-register"
                  style={{ width: "100%" }}
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
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