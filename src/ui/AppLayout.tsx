import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { auth, db } from "../pages/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AppLayout(): React.JSX.Element {
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<
    "user" | "hospital" | "admin" | null
  >(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribeAuth = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // If it's the hardcoded admin
        if (auth.currentUser?.email === "admin@careconnect.com") {
          setUserName("Admin");
          setRole("admin");
          return;
        }

        // Quick hospital check by email
        if (auth.currentUser?.email?.includes("hospital")) {
          setUserName(user.email?.split("@")[0] || "Hospital");
          setRole("hospital");
          return;
        }

        // Otherwise check Firestore user record
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = docSnap.data();
          setUserName(data.name || user.email?.split("@")[0] || "User");
          setRole(data.type || "user");
        } else {
          setUserName(user.email?.split("@")[0] || "User");
          setRole("user");
        }
      } else {
        setUserName(null);
        setRole(null);
      }
    });

    return () => unsubscribeAuth();
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    window.location.href = "/";
  };

  return (
    <div>
      <header>
        <div className="container">
          <div className="logo">
            <i className="fas fa-heartbeat"></i>
            <h1>CareConnect</h1>
          </div>

          <nav>
            <ul className="nav-links">
              <li>
                <NavLink to="/" end>
                  Home
                </NavLink>
              </li>

              {role === "user" && (
                <li>
                  <NavLink to="/user-dashboard">User Dashboard</NavLink>
                </li>
              )}

              {!role && (
                <li>
                  <NavLink to="/hospitals">Find Hospitals</NavLink>
                </li>
              )}

              {role === "hospital" && (
                <li>
                  <NavLink to="/hospital-dashboard">Dashboard</NavLink>
                </li>
              )}

              {role === "admin" && (
                <li>
                  <NavLink to="/admin-dashboard">Admin Dashboard</NavLink>
                </li>
              )}

              <li>
                <NavLink to="/services">Services</NavLink>
              </li>
              <li>
                <NavLink to="/about">About</NavLink>
              </li>
              <li>
                <NavLink to="/contact">Contact</NavLink>
              </li>
            </ul>

            <div className="nav-buttons">
              {userName ? (
                <>
                  <span className="welcome-text">Welcome, {userName}</span>
                  <button className="btn btn-outline" onClick={handleLogout}>
                    Logout
                  </button>
                </>
              ) : (
                <NavLink to="/login" className="btn btn-outline">
                  Log In
                </NavLink>
              )}
              <button className="btn btn-primary">Emergency Help</button>
            </div>

            {/* Mobile Hamburger */}
            <div
              className="menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="fas fa-bars"></i>
            </div>
          </nav>
        </div>

        {/* ✅ Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-menu">
            <ul>
              <li>
                <NavLink to="/" onClick={() => setMobileMenuOpen(false)}>
                  Home
                </NavLink>
              </li>

              {role === "user" && (
                <li>
                  <NavLink
                    to="/user-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    User Dashboard
                  </NavLink>
                </li>
              )}

              {!role && (
                <li>
                  <NavLink
                    to="/hospitals"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Find Hospitals
                  </NavLink>
                </li>
              )}

              {role === "hospital" && (
                <li>
                  <NavLink
                    to="/hospital-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </NavLink>
                </li>
              )}

              {role === "admin" && (
                <li>
                  <NavLink
                    to="/admin-dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Admin Dashboard
                  </NavLink>
                </li>
              )}

              <li>
                <NavLink
                  to="/services"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" onClick={() => setMobileMenuOpen(false)}>
                  About
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" onClick={() => setMobileMenuOpen(false)}>
                  Contact
                </NavLink>
              </li>
            </ul>

            <div className="mobile-buttons">
              {userName ? (
                <>
                  <span className="welcome-text">Welcome, {userName}</span>
                  <button
                    className="btn btn-outline"
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <NavLink
                  to="/login"
                  className="btn btn-outline"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Log In
                </NavLink>
              )}
              <button className="btn btn-primary">Emergency Help</button>
            </div>
          </div>
        )}
      </header>

      <main>
        <Outlet />
      </main>

      <footer>
        <div className="container">
          <div className="footer-content">
            <div className="footer-logo">
              <i className="fas fa-heartbeat"></i>
              <h2>CareConnect</h2>
              <p>Connecting lives in critical times</p>
            </div>
            <div className="footer-links">
              <div className="footer-column">
                <h3>Services</h3>
                <ul>
                  <li>
                    <a>Blood Donation</a>
                  </li>
                  <li>
                    <a>Medicine Supply</a>
                  </li>
                  <li>
                    <a>Oxygen Supply</a>
                  </li>
                </ul>
              </div>
              <div className="footer-column">
                <h3>Company</h3>
                <ul>
                  <li>
                    <Link to="/about">About Us</Link>
                  </li>
                  <li>
                    <Link to="/contact">Contact</Link>
                  </li>
                  <li>
                    <a>Privacy Policy</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>
              © {new Date().getFullYear()} CareConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
