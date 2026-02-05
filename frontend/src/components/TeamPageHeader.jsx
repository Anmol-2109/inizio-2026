import { useNavigate } from "react-router-dom";
import "./TeamPageHeader.css";

import TEAM_HEADER_BG from
  "../assets/Teams/TEAM  E CELL.jpeg";

/**
 * Team page header hero section
 * Text props are optional – by default it uses the Figma copy.
 */
export default function TeamPageHeader({
  title = "Meet The Team",
  description = "The Innovation & Entrepreneurship Cell brings together dedicated faculty mentors and passionate students to foster a culture of creativity, innovation, and enterprise, supporting the next generation of innovators.",
  primaryLabel = "Go to Home",
  secondaryLabel = "View Events",
  backgroundImage = TEAM_HEADER_BG,
}) {
  const navigate = useNavigate();
  const headerBackground = backgroundImage || TEAM_HEADER_BG;

  const handlePrimaryClick = () => {
    navigate("/");
  };

  const handleSecondaryClick = () => {
    navigate("/events");
  };

  return (
    <section
      className="team-header-section1"
      style={{
        backgroundImage: `linear-gradient(rgba(4, 30, 40, 0.7), rgba(4, 30, 40, 0.7)), url(${headerBackground})`,
      }}
      role="banner"
    >
      <div className="team-header-content1">
        <div className="team-header-text1">
          <h1 className="team-header-title1">{title}</h1>
          <p className="team-header-description1">{description}</p>
        </div>

        <div className="team-header-actions1">
          <button
            type="button"
            className="team-header-btn1 team-header-btn-primary1"
            onClick={handlePrimaryClick}
          >
            {primaryLabel}
          </button>
          <button
            type="button"
            className="team-header-btn1 team-header-btn-secondary1"
            onClick={handleSecondaryClick}
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </section>
  );
}