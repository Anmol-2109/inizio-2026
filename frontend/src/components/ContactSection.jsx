import "./ContactSection.css";
import { MdEmail, MdPhone, MdLocationOn } from "react-icons/md";

import contact_img from "../assets/Home_images/contact.png"

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
                <MdEmail className="contact__icon-svg" />
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
                <MdPhone className="contact__icon-svg" />

              </div>
              <div className="contact__item-text">
                <p className="contact__item-label">Phone</p>
                <div className="contact__item-multi">
                  <a className="contact__item-link" href="tel:+918018685525">
                    +91 8018685525
                  </a>
                  <a className="contact__item-link" href="tel:+917631648529">
                    +91 7631648529
                  </a>
                </div>
              </div>
            </div>

            <div className="contact__item">
              <div className="contact__icon">
                <MdLocationOn className="contact__icon-svg" />

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
            src={contact_img}
            alt="College campus building"
            className="contact__image"
            loading="lazy"
          />
        </div>
      </div>
    </section>
  );
}


