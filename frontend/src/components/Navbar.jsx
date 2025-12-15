import { Link } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function Navbar() {
  const { access } = useAuthStore();

  return (
    <nav style={{ padding: 16, borderBottom: "1px solid #ccc" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
          <h2>Inizio</h2>
        </Link>
        <div>
          {access ? (
            <Link to="/complete-profile" style={{ marginRight: 16, textDecoration: "none" }}>
              Profile
            </Link>
          ) : (
            <>
              <Link to="/login" style={{ marginRight: 16, textDecoration: "none" }}>
                Login
              </Link>
              <Link to="/register" style={{ textDecoration: "none" }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
