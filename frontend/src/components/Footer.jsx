import { useLocation } from "react-router-dom";
import "./Footer.css";

const HIDE_PATHS = new Set([
  "/register",
  "/login",
  "/forgot-password",
  "/verify-otp",
  "/verify-reset-otp",
  "/reset-password",
]);

const LOGO_SRC = "https://www.figma.com/api/mcp/asset/40dd26c1-5d3e-4244-88e7-af7ea081b135";
const ICON_FACEBOOK = "https://www.figma.com/api/mcp/asset/865f91d7-60ef-4d2a-8d0c-f5d5dfc83af4";
const ICON_INSTAGRAM = "https://www.figma.com/api/mcp/asset/5e842254-9820-4007-88c4-53aa8b409693";
const ICON_LINKEDIN = "https://www.figma.com/api/mcp/asset/10762538-1677-4762-9b5f-7e14f1384189";

const LINK_GROUPS = [
  {
    label: "Primary",
    links: [
      { label: "Home", href: "#" },
      { label: "About", href: "#" },
      { label: "Events", href: "#" },
      { label: "Team", href: "#" },
      { label: "Connect", href: "#" },
    ],
  },
  {
    label: "Secondary",
    links: [
      { label: "Login", href: "#" },
      { label: "Register", href: "#" },
      { label: "Dashboard", href: "#" },
      { label: "Resources", href: "#" },
      { label: "Guidelines", href: "#" },
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
            <img src={LOGO_SRC} alt="Inizio logo" loading="lazy" />
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
            <a href="#" aria-label="Facebook">
              <img src={ICON_FACEBOOK} alt="" loading="lazy" />
            </a>
            <a href="#" aria-label="Instagram">
              <img src={ICON_INSTAGRAM} alt="" loading="lazy" />
            </a>
            <a href="#" aria-label="LinkedIn">
              <img src={ICON_LINKEDIN} alt="" loading="lazy" />
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
