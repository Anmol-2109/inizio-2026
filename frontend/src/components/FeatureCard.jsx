import PropTypes from "prop-types";
import "./FeatureCard.css";

/**
 * Reusable feature card based on the Figma design.
 * All text and image content are passed via props so the card is fully reusable.
 */
export default function FeatureCard({
  tag = "Learn",
  title = "Workshops that teach real skills",
  description = "Explore",
  ctaLabel = "Explore",
  onClick,
  href,
  imageUrl,
  imageAlt = "",
}) {
  const Tag = href ? "a" : "button";
  const hasAction = Boolean(onClick || href);

  return (
    <article className="feature-card">
      <div className="feature-card__content">
        <div className="feature-card__top">
          {tag && <p className="feature-card__tag">{tag}</p>}

          <div className="feature-card__text">
            {title && <h3 className="feature-card__title">{title}</h3>}
            {description && (
              <p className="feature-card__description">{description}</p>
            )}
          </div>
        </div>

        {hasAction && (
          <div className="feature-card__actions">
            <Tag
              className="feature-card__cta"
              href={href}
              onClick={onClick}
              type={href ? undefined : "button"}
            >
              <span>{ctaLabel}</span>
              <span className="feature-card__cta-icon" aria-hidden="true">
                →
              </span>
            </Tag>
          </div>
        )}
      </div>

      {imageUrl && (
        <div className="feature-card__image-wrapper">
          <img
            src={imageUrl}
            alt={imageAlt}
            className="feature-card__image"
            loading="lazy"
          />
          <div className="feature-card__image-gradient" aria-hidden="true" />
        </div>
      )}
    </article>
  );
}

FeatureCard.propTypes = {
  tag: PropTypes.string,
  title: PropTypes.string,
  description: PropTypes.string,
  ctaLabel: PropTypes.string,
  onClick: PropTypes.func,
  href: PropTypes.string,
  imageUrl: PropTypes.string,
  imageAlt: PropTypes.string,
};


