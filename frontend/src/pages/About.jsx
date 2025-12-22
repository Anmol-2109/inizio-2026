import React from 'react';
import './About.css';
import HeaderBlock from '../components/HeaderBlock';

import vision_image from "../assets/About_images/vision.jpg"
import mission_image from "../assets/About_images/mission.jpg"
import belief_image from "../assets/About_images/whatwebelieve.jpg"
import work_image from "../assets/About_images/how_we_work.jpg"
import drive_image from "../assets/About_images/what_drive_us.jpg"
// Placeholder images - replace with actual URLs
import CubeIcon from '../assets/About_images/cube_icon';

import event from "../assets/About_images/event.jpg"
import mentorship from "../assets/About_images/mentorship.jpg"
import support from "../assets/About_images/support.jpg"
import industry from "../assets/About_images/industry.jpg"
// 
const PLACEHOLDER_IMAGE =null

export default function About() {
  return (
    <div className="about-page">
           <HeaderBlock
              headline="ABOUT INIZIO"
              subheadline="EXPLODE YOUR IDEAS INTO REALITY"
              intro="IIITG's E-Summit, A launchpad for entrepreneurs, tech enthusiasts, and visionaries. Connect, innovate, and take your startup journey to the next level"
              backgroundImage="https://www.figma.com/api/mcp/asset/bf81de09-836c-4017-a055-be754a2f2be1"
              primaryLabel="Events"
              primaryHref="/events"
              secondaryLabel="About"
              secondaryHref="/about"
            />  
      {/* Vision Section */}
      <section className="vision-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title gold">Our vision for tomorrow</h2>
            <p className="section-description">
              We envision a college where entrepreneurial thinking becomes the norm, where students see problems as opportunities and possess the courage to act on them.
            </p>
          </div>

          <div className="vision-grid">
            {/* Main Vision Card */}
            <div className="vision-card main-card">
              <div className="card-bg" style={{ backgroundImage: `url(${vision_image})` }}></div>
              <div className="card-content">
                <span className="tagline">Purpose</span>
                <h3>Vision</h3>
                <p>Building an ecosystem where innovation thrives and student ventures create meaningful impact in society.</p>
                <div className="card-actions">
                  <button className="btn-outline">Learn</button>
                  <button className="btn-link">Arrow <span className="chevron">›</span></button>
                </div>
              </div>
            </div>

            {/* Small Cards Grid */}
            <div className="small-cards-grid">
              <div className="small-card purple-border">
                <div className="card-bg" style={{ backgroundImage: `url(${mission_image})` }}></div>
                <div className="card-content">
                  <div className="icon-placeholder"><CubeIcon size={46} color="#FFD260"/></div>
                  <h4>Mission</h4>
                  <p>We support students from idea conception through launch, providing mentorship, funding pathways, and industry connections.</p>
                  <button className="btn-link">Discover <span className="chevron">›</span></button>
                </div>
              </div>

              <div className="small-card purple-border">
                <div className="card-bg" style={{ backgroundImage: `url(${belief_image})` }}></div>
                <div className="card-content">
                  <div className="icon-placeholder"><CubeIcon size={46} color="#FFD260"/></div>
                  <h4>What we believe</h4>
                  <p>We believe entrepreneurship is learned through doing, not just studying. Our role is to create the conditions where that learning happens naturally.</p>
                  <button className="btn-link">Arrow <span className="chevron">›</span></button>
                </div>
              </div>

              <div className="small-card purple-border">
                <div className="card-bg" style={{ backgroundImage: `url(${work_image})` }}></div>
                <div className="card-content">
                  <div className="icon-placeholder"><CubeIcon size={46} color="#FFD260"/></div>
                  <h4>How we work</h4>
                  <p>We connect students with mentors, resources, and opportunities. We remove the barriers between an idea and its execution.</p>
                  <button className="btn-link">Explore <span className="chevron">›</span></button>
                </div>
              </div>

              <div className="small-card purple-border">
                <div className="card-bg" style={{ backgroundImage: `url(${drive_image})` }}></div>
                <div className="card-content">
                  <div className="icon-placeholder"><CubeIcon size={46} color="#FFD260"/></div>
                  <h4>What drives us</h4>
                  <p>Every venture we support represents a student who chose to build something real. That matters to us.</p>
                  <button className="btn-link">Discover <span className="chevron">›</span></button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do Section */}
      <section className="what-we-do-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title gold">What we do here</h2>
            <p className="section-description">
              We run workshops, competitions, and networking sessions that connect students with real problems and real solutions.
            </p>
          </div>

          <div className="services-grid">
            <div className="service-card">
              <div className="card-bg" style={{ backgroundImage: `url(${event})` }}></div>
              <div className="card-content">
                <div className="icon-placeholder"></div>
                <h3>Events</h3>
                <p>Workshops, pitch competitions, and networking events throughout the year.</p>
                <button className="btn-link">Explore <span className="chevron">›</span></button>
              </div>
            </div>

            <div className="service-card">
              <div className="card-bg" style={{ backgroundImage: `url(${mentorship})` }}></div>
              <div className="card-content">
                <div className="icon-placeholder"></div>
                <h3>Mentorship</h3>
                <p>Experienced entrepreneurs guide students from concept to execution.</p>
                <button className="btn-link">Connect <span className="chevron">›</span></button>
              </div>
            </div>

            <div className="service-card">
              <div className="card-bg" style={{ backgroundImage: `url(${support})` }}></div>
              <div className="card-content">
                <div className="icon-placeholder"></div>
                <h3>Incubation support</h3>
                <p>Resources, funding pathways, and workspace for launching ventures.</p>
                <button className="btn-link">Build <span className="chevron">›</span></button>
              </div>
            </div>

            <div className="service-card">
              <div className="card-bg" style={{ backgroundImage: `url(${industry})` }}></div>
              <div className="card-content">
                <div className="icon-placeholder"></div>
                <h3>Industry collaborations</h3>
                <p>Partnerships with companies and organizations that create real opportunities.</p>
                <button className="btn-link">Partner <span className="chevron">›</span></button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="timeline-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title gold">How we got here</h2>
            <p className="section-description">
              From our founding to today, we have built something worth building. Each milestone marks a moment when the cell grew stronger and more purposeful.
            </p>
            <div className="section-actions">
              <button className="btn-outline">Explore</button>
              <button className="btn-link">Timeline <span className="chevron">›</span></button>
            </div>
          </div>

          <div className="timeline-container">
            <div className="timeline-item">
              <div className="timeline-image" style={{ backgroundImage: `url(${PLACEHOLDER_IMAGE})` }}></div>
              <div className="timeline-progress">
                <div className="progress-line"></div>
                <div className="progress-dot"></div>
                <div className="progress-line"></div>
              </div>
              <div className="timeline-content">
                <h4>2018</h4>
                <p>The Innovation & Entrepreneurship Cell was established with a simple vision.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-image" style={{ backgroundImage: `url(${PLACEHOLDER_IMAGE})` }}></div>
              <div className="timeline-progress">
                <div className="progress-line"></div>
                <div className="progress-dot"></div>
                <div className="progress-line"></div>
              </div>
              <div className="timeline-content">
                <h4>2019</h4>
                <p>First startup incubation program launched with five student ventures.</p>
              </div>
            </div>

            <div className="timeline-item">
              <div className="timeline-image" style={{ backgroundImage: `url(${PLACEHOLDER_IMAGE})` }}></div>
              <div className="timeline-progress">
                <div className="progress-line"></div>
                <div className="progress-dot"></div>
                <div className="progress-line"></div>
              </div>
              <div className="timeline-content">
                <h4>2020</h4>
                <p>Adapted to digital mentorship and hosted virtual pitch competitions.</p>
              </div>
            </div>
          </div>

          <div className="timeline-nav">
            <button className="nav-btn">←</button>
            <button className="nav-btn">→</button>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card">
            <h2>Join our community</h2>
            <p>Be part of something that matters. Start your journey with us today.</p>
            <div className="cta-actions">
              <button className="btn-primary">Events</button>
              <button className="btn-outline light">Login</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

