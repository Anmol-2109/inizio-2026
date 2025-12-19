import FeatureCard from "./FeatureCard";
import "./HowWeWorkSection.css";

const CARD_DATA = [
  {
    tag: "Learn",
    title: "Workshops that teach real skills",
    description: "Explore",
    imageUrl:
      "https://www.figma.com/api/mcp/asset/40159853-bab4-4b98-b8f2-d6441f1ba255",
    imageAlt: "People in a workshop setting collaborating around a table",
  },
  {
    tag: "Create",
    title: "Hackathons where ideas become products",
    description: "Compete",
    imageUrl:
      "https://www.figma.com/api/mcp/asset/4cf956f3-3ff1-4d16-b84b-c01a9c2d644d",
    imageAlt: "Hackathon participants working on laptops in a dark venue",
  },
  {
    tag: "Connect",
    title: "Mentorship from those who’ve built it",
    description: "Learn",
    imageUrl:
      "https://www.figma.com/api/mcp/asset/15872f3d-73fa-4eb9-a103-7940ee304361",
    imageAlt: "Mentors and students networking outdoors",
  },
  {
    tag: "Build",
    title: "Networking with founders and investors",
    description: "Grow",
    imageUrl:
      "https://www.figma.com/api/mcp/asset/4f2101e9-2401-430f-8b00-313148000e77",
    imageAlt: "Group of professionals networking at an event",
  },
];

export default function HowWeWorkSection() {
  return (
    <section className="how-we-work">
      <div className="how-we-work__inner">
        <header className="how-we-work__header">
          <h2 className="how-we-work__title">How we work</h2>
          <p className="how-we-work__subtitle">
            Hands-on learning from concept to launch
          </p>
        </header>

        <div className="how-we-work__grid">
          {CARD_DATA.map((card) => (
            <FeatureCard
              key={card.title}
              tag={card.tag}
              title={card.title}
              description={card.description}
              ctaLabel="Explore"
              href="/events"
              imageUrl={card.imageUrl}
              imageAlt={card.imageAlt}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


