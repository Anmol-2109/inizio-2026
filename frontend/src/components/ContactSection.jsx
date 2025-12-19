import "./ContactSection.css";

const ICON_EMAIL =
  "https://www.figma.com/api/mcp/asset/3dee0be9-b877-413b-8428-69148bc3efdd";
const ICON_PHONE =
  "https://www.figma.com/api/mcp/asset/1ab1aefe-478f-4767-b6fa-f628ea20d7ed";
const ICON_LOCATION =
  "https://www.figma.com/api/mcp/asset/480a371a-b12b-4230-b289-ecddbf00bccf";
const CAMPUS_IMG =
  "https://www.figma.com/api/mcp/asset/11a31d7f-0fd4-4943-8557-452422d62fa7";

export default function ContactSection() {
  return (
    <section className="contact">
      <div className="contact__inner">
        <div className="contact__content">
          <div className="contact__title-block">
            <p className="contact__title">Contact us</p>
            <p className="contact__subtitle">
              Your journey starts with a conversation - reach out!
            </p>
          </div>

          <div className="contact__details">
            <div className="contact__item">
              <div className="contact__icon">
                <img src={ICON_EMAIL} alt="" loading="lazy" />
              </div>
              <div className="contact__item-text">
                <p className="contact__item-label">Email</p>
                <a
                  className="contact__item-link"
                  href="mailto:ecell@iiitg.ac.in"
                >
                  ecell@iiitg.ac.in
                </a>
              </div>
            </div>

            <div className="contact__item">
              <div className="contact__icon">
                <img src={ICON_PHONE} alt="" loading="lazy" />
              </div>
              <div className="contact__item-text">
                <p className="contact__item-label">Phone</p>
                <div className="contact__item-multi">
                  <a className="contact__item-link" href="tel:+919530590415">
                    +91-953 059 0415
                  </a>
                  <a className="contact__item-link" href="tel:+918882896275">
                    +91 888 289 6275
                  </a>
                </div>
              </div>
            </div>

            <div className="contact__item">
              <div className="contact__icon">
                <img src={ICON_LOCATION} alt="" loading="lazy" />
              </div>
              <div className="contact__item-text">
                <p className="contact__item-label">Office</p>
                <div className="contact__item-address">
                  <p>Bongora, Guwahati - 781015</p>
                  <p>Assam, INDIA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="contact__image-wrapper">
          <img
            src={CAMPUS_IMG}
            alt="College campus building"
            className="contact__image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}


