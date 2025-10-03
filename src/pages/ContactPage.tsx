import React from 'react'

export default function ContactPage(): React.JSX.Element {
  return (
    <div>
      <section className="contact-hero">
        <div className="container">
          <h1>Contact Us</h1>
          <p>We're here to help with your emergency medical needs</p>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <h3>Our Location</h3>
              <p>Madan Mohan Malviya University Of Technology</p>
              <p>Gorakhpur, UP 273010</p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-phone-alt"></i>
              </div>
              <h3>Phone Numbers</h3>
              <p>
                Emergency: <a href="tel:+91800123456">+91 (800) 123-4567</a>
              </p>
              <p>
                Support: <a href="tel:+91800987654">+91 (800) 987-6543</a>
              </p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-envelope"></i>
              </div>
              <h3>Email Address</h3>
              <p>
                <a href="mailto:help@emergencyconnect.com">
                  help@emergencyconnect.com
                </a>
              </p>
              <p>
                <a href="mailto:info@emergencyconnect.com">
                  info@emergencyconnect.com
                </a>
              </p>
            </div>
            <div className="contact-card">
              <div className="contact-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h3>Working Hours</h3>
              <p>Emergency Support: 24x7</p>
              <p>Office Hours: Mon-Fri, 9am-5pm</p>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container">
          <div className="contact-container">
            <div className="contact-form-wrapper">
              <h2>Send Us a Message</h2>
              <p>Have questions or feedback? We'd love to hear from you.</p>
              <form className="contact-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">
                      Your Name <span className="required">*</span>
                    </label>
                    <input id="name" placeholder="Enter your name" required />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">
                      Email Address <span className="required">*</span>
                    </label>
                    <input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="phone">Phone Number</label>
                    <input id="phone" placeholder="Enter your phone number" />
                  </div>
                  <div className="form-group">
                    <label htmlFor="subject">
                      Subject <span className="required">*</span>
                    </label>
                    <input id="subject" placeholder="Enter subject" required />
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">
                    Message <span className="required">*</span>
                  </label>
                  <textarea
                    id="message"
                    placeholder="Enter your message"
                    rows={6}
                    required
                  />
                </div>
                <button className="btn btn-primary" type="submit">
                  Send Message
                </button>
              </form>
            </div>
            <div className="contact-map">
              <h2>Find Us</h2>
              <div className="map-container">
                <div className="map-placeholder">
                  <i className="fas fa-map-marked-alt"></i>
                  <p>Interactive Map</p>
                </div>
              </div>
              <div className="social-links">
                <h3>Connect With Us</h3>
                <div className="social-icons">
                  <a className="social-icon facebook">
                    <i className="fab fa-facebook-f"></i>
                  </a>
                  <a className="social-icon twitter">
                    <i className="fab fa-twitter"></i>
                  </a>
                  <a href="" className="social-icon instagram">
                    <i className="fab fa-instagram"></i>
                  </a>
                  <a href="https://www.linkedin.com/in/kartikey-chaturvedi-275b2a349" 
                  className="social-icon linkedin">
                    <i className="fab fa-linkedin-in"></i>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="emergency-contact">
        <div className="container">
          <div className="emergency-box">
            <div className="emergency-icon">
              <i className="fas fa-ambulance"></i>
            </div>
            <div className="emergency-content">
              <h2>Emergency Helpline</h2>
              <p>
                For immediate medical assistance, call our 24/7 emergency
                hotline
              </p>
              <a href="tel:+91800123456" className="emergency-phone">
                +91 (800) 123-4567
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}


