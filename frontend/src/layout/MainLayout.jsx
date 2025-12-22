import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { registerForPush } from "../utils/registerpush";

export default function MainLayout() {
  const isAuthenticated = useAuthStore((s) => !!s.access);

  useEffect(() => {
    if (isAuthenticated) {
      registerForPush();
    }
  }, [isAuthenticated]);
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
}
