import PropTypes from "prop-types";
import "./UpcomingEventHighlight.css";

/**
 * Reusable flagship / upcoming event highlight section.
 * All content is driven by props so it can be updated easily.
 */
export default function UpcomingEventHighlight({
  title,
  subtitle,
  primaryLabel,
  primaryHref,
  secondaryLabel,
  secondaryHref,
  imageUrl,
  imageAlt,
}) {
  return (
    <section className="upcoming-event" aria-labelledby="upcoming-event-title">
      <div className="upcoming-event__inner">
        <header className="upcoming-event__header">
          <h2 id="upcoming-event-title" className="upcoming-event__title">
            {title}
          </h2>
          {subtitle ? (
            <p className="upcoming-event__subtitle">{subtitle}</p>
          ) : null}

          <div className="upcoming-event__actions">
            {primaryLabel && primaryHref ? (
              <a
                href={primaryHref}
                className="upcoming-event__btn upcoming-event__btn--primary"
              >
                {primaryLabel}
              </a>
            ) : null}

            {secondaryLabel && secondaryHref ? (
              <a
                href={secondaryHref}
                className="upcoming-event__btn upcoming-event__btn--ghost"
              >
                {secondaryLabel}
                <span
                  className="upcoming-event__btn-icon"
                  aria-hidden="true"
                />
              </a>
            ) : null}
          </div>
        </header>

        {imageUrl ? (
          <div className="upcoming-event__image-wrapper">
            <img
              src={imageUrl}
              alt={imageAlt || title}
              className="upcoming-event__image"
              loading="lazy"
            />
          </div>
        ) : null}
      </div>
    </section>
  );
}

UpcomingEventHighlight.propTypes = {
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  primaryLabel: PropTypes.string,
  primaryHref: PropTypes.string,
  secondaryLabel: PropTypes.string,
  secondaryHref: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
};


