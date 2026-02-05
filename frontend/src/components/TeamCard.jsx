
import "./TeamCard.css";

/**
 * Reusable team member card.
 * Pass all member‑specific details as props so you can reuse this
 * component across different team sections.
 */
export default function TeamMemberCard({
  name,
  image,
  role,
  department,
  year,
  linkedinUrl,
}) {
  const hasSecondaryLine = department || year;
  const secondaryLine = [department, year].filter(Boolean).join(" • ");

  return (
    <div className="tm-card">
      <div className="tm-avatar-wrapper">
        <img src={image} alt={name} className="tm-avatar" />
      </div>

      <div className="tm-content">
        {name && <h3 className="tm-name">{name}</h3>}
        {role && <p className="tm-role">{role}</p>}
        {hasSecondaryLine && <p className="tm-meta">{secondaryLine}</p>}
      </div>

      {linkedinUrl && (
        <a
          href={linkedinUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="tm-link"
        >
          <span className="tm-link-icon">in</span>
          <span className="tm-link-text">View LinkedIn</span>
        </a>
      )}
    </div>
  );
}