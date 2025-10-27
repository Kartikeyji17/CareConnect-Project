import React from 'react'
import { Link } from "react-router-dom";

export default function ServicesPage(): React.JSX.Element {
  return (
    <div>
      <section className="services-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive emergency medical resources at your fingertips</p>
        </div>
      </section>

      <section className="main-services">
        <div className="container">
          <div className="services-grid">
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-tint"></i>
              </div>
              <h3>Blood Donation & Supply</h3>
              <p>
                Connect with blood donors and blood banks for emergency
                transfusions and donations.
              </p>
              <a className="btn btn-outline">Learn More</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-pills"></i>
              </div>
              <h3>Emergency Medications</h3>
              <p>
                Find critical medications and prescriptions during emergencies
                when regular pharmacies are unavailable.
              </p>
              <a className="btn btn-outline">Learn More</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-wind"></i>
              </div>
              <h3>Oxygen Supply</h3>
              <p>
                Locate oxygen cylinders, concentrators, and suppliers for
                respiratory emergencies.
              </p>
              <a className="btn btn-outline">Learn More</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-stethoscope"></i>
              </div>
              <h3>Symptom Checker</h3>
              <p>
                Identify potential medical conditions based on symptoms and get
                guidance on next steps.
              </p>
              <a className="btn btn-outline">Learn More</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-ambulance"></i>
              </div>
              <h3>Emergency Transport</h3>
              <p>
                Request ambulance services and emergency medical transportation
                to hospitals.
              </p>
              <a className="btn btn-outline">Learn More</a>
            </div>
            <div className="service-card">
              <div className="service-icon">
                <i className="fas fa-user-md"></i>
              </div>
              <h3>Medical Consultations</h3>
              <p>
                Connect with healthcare professionals for urgent medical advice
                and consultations.
              </p>
              <a className="btn btn-outline">Learn More</a>
            </div>
          </div>
        </div>
      </section>

      <section className="get-started">
        <div className="container">
          <h2>Ready to Access Emergency Medical Resources?</h2>
          <p>
            Join CareConnect today and gain access to our comprehensive range of
            emergency medical services.
          </p>
          <div className="get-started-buttons">
            <Link to="/login" className="btn btn-primary">
              Create an Account
            </Link>
            <Link to="/requests" className="btn btn-emergency">
              Request Emergency Help
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}


