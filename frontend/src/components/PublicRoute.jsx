// import { Navigate } from "react-router-dom";
// import useAuthStore from "../store/useAuthStore";

// export default function PublicRoute({ children }) {
//   const { access, profileComplete } = useAuthStore();
//   if (access && profileComplete === false) {
//     return <Navigate to="/complete-profile" />;
//   }
//   return children;
// }

import { Navigate } from "react-router-dom";
import useAuthStore from "../store/useAuthStore";

export default function PublicRoute({ children }) {
  const { access, profileComplete, isAuthReady } = useAuthStore();

  if (!isAuthReady) return null;

  if (access && profileComplete === false) {
    return <Navigate to="/complete-profile" replace />;
  }

  return children;
}
