import "./SponsorsSection.css";

const DEFAULT_SPONSORS = [
  { name: "Title Sponsor" },
  { name: "Gold Partner" },
  { name: "Innovation Partner" },
  { name: "Community Partner" },
  { name: "Ecosystem Partner" },
  { name: "Media Partner" },
];

export default function SponsorsSection({ sponsors = DEFAULT_SPONSORS }) {
  const items = sponsors.length > 0 ? sponsors : DEFAULT_SPONSORS;

  return (
    <section className="sponsors">
      <div className="sponsors__inner">
        <div className="sponsors__header">
          <p className="sponsors__eyebrow">Partners</p>
          <h2 className="sponsors__title">Our Sponsors</h2>
        </div>

        <div className="sponsors__marquee" aria-label="Sponsor logos">
          <div className="sponsors__track">
            {[...items, ...items].map((sponsor, index) => (
              <div key={`${sponsor.name}-${index}`} className="sponsors__item">
                <span className="sponsors__badge">{sponsor.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


