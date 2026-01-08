import FeatureCard from "./FeatureCard";
import "./HowWeWorkSection.css";

import work_im1 from "../assets/Home_images/work_im1.png"
import work_im2 from "../assets/Home_images/work_im2.png"
import work_im3 from "../assets/Home_images/work_im3.png"
import work_im4 from "../assets/Home_images/work_im4.png"

const CARD_DATA = [
  {
    tag: "Learn",
    title: "Workshops that teach real skills",
    description: "Explore",
    imageUrl:
      work_im1,
    imageAlt: "People in a workshop setting collaborating around a table",
  },
  {
    tag: "Create",
    title: "Hackathons where ideas become products",
    description: "Compete",
    imageUrl:
      work_im2,
    imageAlt: "Hackathon participants working on laptops in a dark venue",
  },
  {
    tag: "Connect",
    title: "Mentorship from those who’ve built it",
    description: "Learn",
    imageUrl:
      work_im3,
    imageAlt: "Mentors and students networking outdoors",
  },
  {
    tag: "Build",
    title: "Networking with founders and investors",
    description: "Grow",
    imageUrl:
      work_im4,
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


