import PropTypes from "prop-types";
import "./HeaderBlock.css";

import image from "../assets/Header_images/header.jpeg"

// const DEFAULT_HEADER_BG = img
  

/**
 * Reusable header/hero block styled after the provided Figma header.
 * All textual and link content is passed in via props for easy reuse.
 */
export default function HeaderBlock({
  logoText = "INIZIO",
  navLinks = [],
  headline = "INIZIO 2026",
  subheadline = "EXPLODE YOUR IDEAS INTO REALITY",
  intro = "IIITG's E-Summit, A launchpad for entrepreneurs, tech enthusiasts, and visionaries. Connect, innovate, and take your startup journey to the next level",
  primaryLabel = "Events",
  primaryHref = "#events",
  secondaryLabel = "About",
  secondaryHref = "#about",
  backgroundImage = image,
  backgroundAlt = "Founders collaborating around a table with a glowing bulb",
  showTopActions = false,
}) {
  const bgSource = backgroundImage;

  return (
    <header className="header-block">
      <div
        className="header-block__bg"
        style={{
          backgroundImage: `linear-gradient(0deg, rgba(4,30,40,0.8), rgba(4,30,40,0.8)), url(${bgSource})`,
        }}
        aria-label={backgroundAlt}
      />

      <div className="header-block__inner">
        {(navLinks?.length > 0 || showTopActions) && (
          <div className="header-block__top">
            <div className="header-block__logo">{logoText}</div>

            {navLinks?.length > 0 && (
              <nav className="header-block__nav" aria-label="Header navigation">
                {navLinks.map(({ label, href }) => (
                  <a key={label} className="header-block__nav-link" href={href || "#"}>
                    {label}
                  </a>
                ))}
              </nav>
            )}

            {showTopActions && (
              <div className="header-block__actions">
                {primaryLabel ? (
                  <a className="header-block__btn header-block__btn--primary" href={primaryHref}>
                    {primaryLabel}
                  </a>
                ) : null}
                {secondaryLabel ? (
                  <a className="header-block__btn header-block__btn--ghost" href={secondaryHref}>
                    {secondaryLabel}
                  </a>
                ) : null}
              </div>
            )}
          </div>
        )}

        <div className="header-block__content">
          <p className="header-block__kicker">{headline}</p>
          <h1 className="header-block__title">{subheadline}</h1>
          <p className="header-block__intro">{intro}</p>
          <div className="header-block__cta">
            {primaryLabel ? (
              <a className="header-block__btn header-block__btn--primary" href={primaryHref}>
                {primaryLabel}
              </a>
            ) : null}
            {secondaryLabel ? (
              <a className="header-block__btn header-block__btn--ghost" href={secondaryHref}>
                {secondaryLabel}
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}

HeaderBlock.propTypes = {
  logoText: PropTypes.string,
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      href: PropTypes.string,
    })
  ),
  headline: PropTypes.string,
  subheadline: PropTypes.string,
  intro: PropTypes.string,
  primaryLabel: PropTypes.string,
  primaryHref: PropTypes.string,
  secondaryLabel: PropTypes.string,
  secondaryHref: PropTypes.string,
  backgroundImage: PropTypes.string,
  backgroundAlt: PropTypes.string,
  showTopActions: PropTypes.bool,
};

