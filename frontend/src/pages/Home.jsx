import useAuthStore from "../store/useAuthStore";
import api from "../api/apiClient";
import { Link } from "react-router-dom";
import HeaderBlock from "../components/HeaderBlock";
import StatsSection from "../components/StatsSection";
import UpcomingEventHighlight from "../components/UpcomingEventHighlight";
import HowWeWorkSection from "../components/HowWeWorkSection";
import SponsorsSection from "../components/SponsorsSection";
import ContactSection from "../components/ContactSection";
import { useNavigate } from "react-router-dom";
import img from "../assets/Header_images/header.jpeg";
import flagship_img from "../assets/Home_images/flagship.png";

export default function Home() {
  const access = useAuthStore((s) => s.access);
  const refresh = useAuthStore((s) => s.refresh);
  const logout = useAuthStore((s) => s.logout);
  const isStaff = useAuthStore((s) => s.isStaff);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
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

  return (
    <>
      <HeaderBlock
        headline="INIZIO 2026"
        subheadline="EXPLODE YOUR IDEAS INTO REALITY"
        intro="IIITG's E-Summit, A launchpad for entrepreneurs, tech enthusiasts, and visionaries. Connect, innovate, and take your startup journey to the next level"
        primaryLabel="Events"
        primaryHref="/events"
        secondaryLabel="About"
        secondaryHref="/about"
        backgroundImage={img}
      />

      <StatsSection />

      <UpcomingEventHighlight
        title="Don't miss our flagship event"
        subtitle="The annual hackathon brings together builders, thinkers, and dreamers. Twenty Four hours. One mission. Build something that matters."
        primaryLabel="Register"
        primaryHref="/events"
        secondaryLabel="Learn more"
        secondaryHref="/events"
        imageUrl={flagship_img}
        imageAlt="Students and professionals collaborating at a futuristic hackathon event"
      />

      <HowWeWorkSection />

      <SponsorsSection />

      

      <ContactSection />
    </>
  );
}
