import "./StatsSection.css";
import { useEffect, useRef, useState } from "react";

const STATS = [
  { value: 24, label: "Events conducted" },
  { value: 39, label: "Speakers" },
  { value: 5000, label: "Students reached" },
];

function useCountUp(target, durationMs = 1600) {
  const [value, setValue] = useState(0);
  const frameRef = useRef(null);
  const startedRef = useRef(false);

  const start = () => {
    if (startedRef.current) return;
    startedRef.current = true;

    const startTime = performance.now();

    const step = (now) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / durationMs, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out
      const current = Math.round(target * eased);
      setValue(current);

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(step);
      }
    };

    frameRef.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return [value, start];
}

function StatItem({ value, label }) {
  const ref = useRef(null);
  const [displayValue, start] = useCountUp(value);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") {
      // Fallback: just show final value
      start();
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            start();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [start]);

  return (
    <div ref={ref} className="stats-section__stat">
      <p className="stats-section__value" aria-label={value.toLocaleString()}>
        {displayValue.toLocaleString()}
      </p>
      <p className="stats-section__label">{label}</p>
    </div>
  );
}

export default function StatsSection() {
  return (
    <section className="stats-section" aria-labelledby="stats-section-heading">
      <div className="stats-section__inner">
        <div className="stats-section__top">
          <div className="stats-section__heading">
            <h2 id="stats-section-heading" className="stats-section__title">
              What we&apos;ve built so far
            </h2>
          </div>
          <div className="stats-section__content">
            <p className="stats-section__description">
              The I &amp; E cell has grown into a hub where ideas meet action. These
              numbers tell the story of students who dared to dream and the
              community that backed them.
            </p>
            <div className="stats-section__actions">
              <a href="/events" className="stats-section__btn stats-section__btn--primary">
                Explore
              </a>
              <button
                type="button"
                className="stats-section__btn stats-section__btn--ghost"
              >
                Details
                <span className="stats-section__btn--ghost-icon" aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>

        <div className="stats-section__bottom">
          {STATS.map((stat) => (
            <StatItem key={stat.label} value={stat.value} label={stat.label} />
          ))}
        </div>
      </div>
    </section>
  );
}


