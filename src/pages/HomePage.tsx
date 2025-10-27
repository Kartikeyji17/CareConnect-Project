import React from 'react'
// import Button from '../ui/Button'
import { Link } from 'react-router-dom'

export default function HomePage(): React.JSX.Element {
  return (
    <div>
      <section className="hero">
        <div className="container">
          <div className="hero-content">
            <h1>Emergency Medical Resources</h1>
            <p>
              Connecting people with hospitals for emergency blood, ambulance,
              and oxygen needs
            </p>
            <div className="hero-buttons">
              <Link to="/requests" className="btn btn-emergency">
                Request Emergency Help
              </Link>
              <Link to="/hospitals" className="btn btn-outline">
                Find Hospitals
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="services">
        <div className="container">
          <h2>Emergency Services</h2>
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon blood">
                <i className="fas fa-tint"></i>
              </div>
              <h3>Blood Donation</h3>
              <p>Find blood donors or donate blood</p>
              <p className="service-description">
                Connect with nearby blood banks and hospitals for urgent blood
                requirements or register as a donor.
              </p>
              <a className="btn btn-outline">Learn More</a>
            </div>

            <div className="service-card">
              <div className="service-icon ambulance">
                <i className="fas fa-pills"></i>
              </div>
              <h3>Ambulance Supply</h3>
              <p>Emergency ambulance availability</p>
              <p className="service-description">
                Find hospitals and pharmacies with critical ambulance in stock
                for emergency situations.
              </p>
              <a className="btn btn-outline">Learn More</a>
            </div>

            <div className="service-card">
              <div className="service-icon oxygen">
                <i className="fas fa-wind"></i>
              </div>
              <h3>Oxygen Supply</h3>
              <p>Find oxygen cylinders and concentrators</p>
              <p className="service-description">
                Locate hospitals and suppliers with oxygen cylinders and
                concentrators available for emergency use.
              </p>
              <a className="btn btn-outline">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      <section className="how-it-works">
        <div className="container">
          <h2>How It Works</h2>
          <div className="steps-grid">
            <div className="step">
              <div className="step-number">1</div>
              <h3>Register</h3>
              <p>
                Create an account as a patient, donor, or hospital to access
                services.
              </p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h3>Request Resources</h3>
              <p>
                Submit your emergency requirements for blood, ambulance, or
                oxygen.
              </p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h3>Get Connected</h3>
              <p>
                We connect you with the nearest hospital or donor that can
                fulfill your needs.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container">
          <h2>Ready to Save Lives?</h2>
          <p>
            Join our network of hospitals, donors, and volunteers to help those
            in need during medical emergencies.
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="btn btn-primary">
              Register Now
            </Link>
            <Link to="/contact" className="btn btn-outline">
              Contact Us
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


