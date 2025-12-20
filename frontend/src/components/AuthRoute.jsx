// import { Navigate } from "react-router-dom";
// import useAuthStore from "../store/useAuthStore";

// export default function AuthRoute({ children }) {
//   const { access } = useAuthStore();
//   if (!access) return <Navigate to="/login" />;
//   return children;
// }

import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function AuthRoute({ children }) {
  const { access, isAuthReady } = useAuthStore();

  if (!isAuthReady) return null;

  if (!access) return <Navigate to="/login" replace />;

  return children;
}
