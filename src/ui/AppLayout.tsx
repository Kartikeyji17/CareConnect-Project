import React, { useEffect, useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import { auth, db } from "../pages/firebase";
import { signOut } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default function AppLayout(): React.JSX.Element {
  const [userName, setUserName] = useState<string | null>(null);
  const [role, setRole] = useState<
    "user" | "hospital" | "admin" | "donor" | null
  >(null);

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

              {/* User Dashboard for logged-in users */}
              {role === "user" && (
                <li>
                  <NavLink to="/user-dashboard">User Dashboard</NavLink>
                </li>
              )}

              {/* Non-logged-in users see Find Hospitals */}
              {!role && (
                <li>
                  <NavLink to="/hospitals">Find Hospitals</NavLink>
                </li>
              )}

              {/* Show Hospital Dashboard for hospital users */}
              {role === "hospital" && (
                <li>
                  <NavLink to="/hospital-dashboard">Dashboard</NavLink>
                </li>
              )}

              {/* Show Admin Dashboard for admin */}
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

            <div className="menu-toggle">
              <i className="fas fa-bars"></i>
            </div>
          </nav>
        </div>
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
