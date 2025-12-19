import './TeamHeader.css';
 
function TeamHeader({ name, date, venue, teamSize, description, backgroundImage }) {
  return (
    <div 
      className="team-header"
      style={{ backgroundImage: `url('${backgroundImage}')` }}
    >
      <div className="team-header-content">
        <h1 className="team-header-name">{name}</h1>
        <p className="team-header-date">📅 {date}</p>
        <p className="team-header-info">
          <span className="label">Venue</span> : {venue}
        </p>
        <p className="team-header-info">
          <span className="label">Team Size</span> : {teamSize}
        </p>
      </div>
      <p className="team-header-description">{description}</p>
    </div>
  );
}
 
export default TeamHeader