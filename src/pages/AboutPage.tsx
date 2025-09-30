import React from 'react'

export default function AboutPage(): React.JSX.Element {
  return (
    <div>
      <section className="about-hero">
        <div className="container">
          <div className="about-hero-content">
            <h1>About CareConnect</h1>
            <p>Connecting lives in critical times through innovative healthcare solutions</p>
          </div>
        </div>
      </section>

      <section className="mission-section">
        <div className="container">
          <div className="mission-content">
            <div className="mission-text">
              <h2>Our Mission</h2>
              <p className="mission-statement">To save lives by connecting individuals with critical medical resources during emergencies.</p>
              <p>At EmergencyConnect, we believe that everyone should have immediate access to life-saving resources when they need them most. Our platform bridges the gap between patients and healthcare providers, ensuring that critical resources like blood, medicine, and oxygen are available to those in need.</p>
              <p>We work tirelessly to build a network of hospitals, blood banks, and medical suppliers to create a robust emergency response system that can be accessed by anyone, anywhere, at any time.</p>
            </div>
            <div className="mission-image">
              <img src="https://images.unsplash.com/photo-1584036561566-baf8f5f1b144?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Medical professionals in a meeting" />
            </div>
          </div>
        </div>
      </section>

      <section className="story-section">
        <div className="container">
          <h2>Our Story</h2>
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2018</h3>
                <h4>The Beginning</h4>
                <p>EmergencyConnect was founded by Dr. Sarah Johnson after she witnessed firsthand the challenges of accessing critical medical resources during emergencies. The idea was born out of a personal experience when her father needed urgent blood transfusion but faced delays in finding the right blood type.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2019</h3>
                <h4>Building the Network</h4>
                <p>We began building our network by partnering with local hospitals and blood banks in major cities. Our first pilot program successfully connected over 500 patients with emergency blood supplies.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2020</h3>
                <h4>Expanding Services</h4>
                <p>During the global pandemic, we expanded our services to include oxygen and critical medicine supply. Our platform became a lifeline for thousands of patients who needed urgent medical resources.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2021</h3>
                <h4>National Expansion</h4>
                <p>CareConnect expanded to cover all major cities across the country, with over 1,000 hospital partners and 5,000 registered blood donors.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>2022</h3>
                <h4>Technology Innovation</h4>
                <p>We launched our mobile app and implemented real-time tracking of resources, making it even easier for patients to find and request emergency medical supplies.</p>
              </div>
            </div>
            <div className="timeline-item">
              <div className="timeline-dot"></div>
              <div className="timeline-content">
                <h3>Today</h3>
                <h4>Saving Lives Every Day</h4>
                <p>Today, CareConnect serves millions of users nationwide, connecting patients with life-saving resources within minutes. We continue to innovate and expand our services to fulfill our mission of saving lives.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="team-section">
        <div className="container">
          <h2>Meet Our Team</h2>
          <p className="section-description">Dedicated professionals working to make emergency healthcare accessible to all</p>
          <div className="team-grid">
            <div className="team-member">
              <div className="member-image">
                <img src="./src/images/Kartikey.jpg" alt="Kartikey Chaturvedi" />
              </div>
              <h3>Kartikey Chaturvedi</h3>
              <p className="member-role">Founder & CEO</p>
              <p className="member-bio">Emergency Medicine Specialist with over 15 years of experience. Passionate about improving emergency healthcare access.</p>
              <div className="member-social">
                <a><i className="fab fa-linkedin-in"></i></a>
                <a><i className="fab fa-twitter"></i></a>
              </div>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="./src/images/Anurag.jpg" alt="Anurag Yadav" />
              </div>
              <h3>Anurag Yadav</h3>
              <p className="member-role">Frontend Lead</p>
              <p className="member-bio">Hematologist with expertise in blood banking and transfusion medicine. Leads our medical resource verification team.</p>
              <div className="member-social">
                <a><i className="fab fa-linkedin-in"></i></a>
                <a><i className="fab fa-twitter"></i></a>
              </div>
            </div>
            <div className="team-member">
              <div className="member-image">
                <img src="./src/images/Aditya.jpg" alt="Aditya Singh Kshatri" />
              </div>
              <h3>Aditya Singh Kshatri</h3>
              <p className="member-role">Backend Manager</p>
              <p className="member-bio">Tech innovator with a background in healthcare IT. Leads the development of our platform and mobile applications.</p>
              <div className="member-social">
                <a><i className="fab fa-linkedin-in"></i></a>
                <a><i className="fab fa-github"></i></a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="values-section">
        <div className="container">
          <h2>Our Core Values</h2>
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon"><i className="fas fa-bolt"></i></div>
              <h3>Speed</h3>
              <p>We understand that in emergencies, every second counts. Our platform is designed to connect patients with resources as quickly as possible.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><i className="fas fa-shield-alt"></i></div>
              <h3>Reliability</h3>
              <p>We verify all our partners and resources to ensure that patients can rely on the information and services provided through our platform.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><i className="fas fa-hands-helping"></i></div>
              <h3>Accessibility</h3>
              <p>We believe that emergency healthcare should be accessible to everyone, regardless of location, socioeconomic status, or background.</p>
            </div>
            <div className="value-card">
              <div className="value-icon"><i className="fas fa-heart"></i></div>
              <h3>Compassion</h3>
              <p>We approach every emergency with empathy and understanding, recognizing the stress and anxiety that patients and their families experience.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="impact-section">
        <div className="container">
          <h2>Our Impact</h2>
          <div className="stats-container">
            <div className="stat-item"><div className="stat-number">500,000+</div><div className="stat-label">Lives Impacted</div></div>
            <div className="stat-item"><div className="stat-number">2,500+</div><div className="stat-label">Hospital Partners</div></div>
            <div className="stat-item"><div className="stat-number">50,000+</div><div className="stat-label">Blood Donors</div></div>
            <div className="stat-item"><div className="stat-number">15 min</div><div className="stat-label">Average Response Time</div></div>
          </div>
        </div>
      </section>

      <section className="join-section">
        <div className="container">
          <div className="join-content">
            <h2>Join Our Mission</h2>
            <p>Help us save more lives by becoming a part of EmergencyConnect. Whether you're a hospital, blood donor, or volunteer, there's a place for you in our network.</p>
            <div className="join-buttons">
              <a className="btn btn-primary">Become a Partner</a>
              <a className="btn btn-outline">Volunteer With Us</a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}


