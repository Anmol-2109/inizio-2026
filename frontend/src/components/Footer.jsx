import { useLocation } from "react-router-dom";
import "./Footer.css";
import { FaInstagram, FaLinkedinIn } from "react-icons/fa";
import IIITg_logo from "../assets/logo/IIITG-logo.png"
import IIC_logo from "../assets/logo/IIC-IIITG-logo.png"
import IECell_logo from "../assets/logo/IE-Cell-logo.png"
const HIDE_PATHS = new Set([
  "/register",
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/verify-reset-otp",
  "/reset-password",
]);



const LINK_GROUPS = [
  {
    label: "Primary",
    links: [
      { label: "Home", href: "/" },
      { label: "About", href: "/about" },
      { label: "Events", href: "/events" },
      { label: "Team", href: "/team" },
    ],
  },
  {
    label: "Secondary",
    links: [
      { label: "Login", href: "/login" },
      { label: "Register", href: "/register" },
      { label: "Dashboard", href: "/" },
      { label: "IIIT Guwahati", href: "https://www.iiitg.ac.in/" },
    ],
  },
];

export default function Footer() {
  const location = useLocation();
  const hideFooter = HIDE_PATHS.has(location.pathname);

  if (hideFooter) return null;

  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__left">
          <div className="footer__logo">
            <a href="https://www.iiitg.ac.in/" target="_blank" rel="noreferrer">
                <img src={IIITg_logo} alt="IIITG Logo" />
           </a>
            <a href="https://www.iiitg.ac.in/" target="_blank" rel="noreferrer">
                <img src={IECell_logo} alt="IIITG Logo" />
           </a>
            <a href="https://www.iiitg.ac.in/" target="_blank" rel="noreferrer">
                <img src={IIC_logo} alt="IIITG Logo" />
           </a>
          </div>
          <div className="footer__copy">
            <p>Get the latest news on innovation, entrepreneurship programs, and upcoming events delivered to your inbox.</p>
            <p>Innovation & Entrepreneurship Cell, College Campus</p>
          </div>
          <div className="footer__reach">
            <p className="footer__reach-label">Reach</p>
            <a className="footer__reach-link" href="mailto:ecell@iiitg.ac.in">
              ecell@iiitg.ac.in
            </a>
          </div>
          <div className="footer__social">

            <a
              href="https://www.instagram.com/inizio.iiitguwahati/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
            >
              <FaInstagram />
            </a>

            <a
              href="https://www.linkedin.com/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
            >
              <FaLinkedinIn />
            </a>
          </div>

        </div>

        <div className="footer__links">
          {LINK_GROUPS.map((group) => (
            <div key={group.label} className="footer__link-column">
              {group.links.map((link) => (
                <a key={link.label} className="footer__link" href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer__divider" aria-hidden />
    </footer>
  );
}
