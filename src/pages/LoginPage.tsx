import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getRoleFromEmail } from "../utils/getRoleFromEmail";
import { auth, db } from "./firebase";
import {
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";

export default function LoginPage(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // --- Helper to route based on role ---
  const redirectUser = (role: string) => {
    if (role === "admin") navigate("/admin-dashboard");
    else if (role === "hospital") navigate("/hospital-dashboard");
    else navigate("/user-dashboard");
  };

  // --- Google login handler ---
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      setLoading(true);
      const result = await signInWithPopup(auth, provider);

      // 🔑 Check if admin
      if (result.user.email === "admin@careconnect.com") {
        redirectUser("admin");
        return;
      }

      const userRef = doc(db, "users", result.user.uid);
      const userSnap = await getDoc(userRef);

      let role: string;

      if (!userSnap.exists()) {
        // If new user, default to "user"
        role = "user";
        await setDoc(userRef, {
          uid: result.user.uid,
          name: result.user.displayName,
          email: result.user.email,
          photoURL: result.user.photoURL,
          type: role,
        });
      } else {
        role = userSnap.data()?.type || getRoleFromEmail(result.user.email || "");
      }

      redirectUser(role);
    } catch (err) {
      console.error(err);
      alert("Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // --- Email/password login handler ---
  const handleEmailLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.currentTarget.elements.namedItem("login-email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("login-password") as HTMLInputElement).value;

    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // 🔑 Check if admin
      if (email === "admin@careconnect.com") {
        redirectUser("admin");
        return;
      }

      const userRef = doc(db, "users", userCredential.user.uid);
      const userSnap = await getDoc(userRef);

      let role: string;
      if (userSnap.exists()) {
        role = userSnap.data()?.type || getRoleFromEmail(email);
      } else {
        role = getRoleFromEmail(email); // fallback if no DB entry
      }

      redirectUser(role);
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Login failed. Check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  // --- Registration handler ---
  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const name = (e.currentTarget.elements.namedItem("register-name") as HTMLInputElement).value;
    const email = (e.currentTarget.elements.namedItem("register-email") as HTMLInputElement).value;
    const password = (e.currentTarget.elements.namedItem("register-password") as HTMLInputElement).value;
    const type = (e.currentTarget.elements.namedItem("register-type") as HTMLSelectElement).value;

    try {
      setLoading(true);
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await setDoc(doc(db, "users", userCredential.user.uid), {
        uid: userCredential.user.uid,
        name,
        email,
        type,
      });

      // 🔑 If someone registers with the admin email, force role admin
      if (email === "admin@careconnect.com") {
        redirectUser("admin");
      } else {
        redirectUser(type);
      }
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="login-section">
      <div className="container">
        <div className="login-container">
          <div className="login-image">
            <div className="image-overlay"></div>
            <div className="login-quote">
              <h2>Saving Lives Together</h2>
              <p>
                "In emergency situations, every second counts. We're here to connect you with the resources you need, when you need them most."
              </p>
            </div>
          </div>

          <div className="login-form-container">
            <div className="login-tabs">
              <button
                className={`tab-btn ${activeTab === "login" ? "active" : ""}`}
                onClick={() => setActiveTab("login")}
              >
                Login
              </button>
              <button
                className={`tab-btn ${activeTab === "register" ? "active" : ""}`}
                onClick={() => setActiveTab("register")}
              >
                Register
              </button>
            </div>

            {activeTab === "login" && (
              <div className="tab-content active" id="login-tab">
                <h2>Welcome Back</h2>
                <p>Login to access your account</p>
                <form className="auth-form" onSubmit={handleEmailLogin}>
                  <div className="form-group">
                    <label htmlFor="login-email">Email Address</label>
                    <div className="input-with-icon">
                      <i className="fas fa-envelope"></i>
                      <input
                        id="login-email"
                        name="login-email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        style={{
                          paddingLeft: '2.5rem',
                          textIndent: '0',
                          position: 'relative',
                          zIndex: 1
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="login-password">Password</label>
                    <div className="input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        id="login-password"
                        name="login-password"
                        type="password"
                        placeholder="Enter your password"
                        required
                        style={{
                          paddingLeft: '2.5rem',
                          textIndent: '0',
                          position: 'relative',
                          zIndex: 1
                        }}
                      />
                    </div>
                  </div>

                  <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                    {loading ? "Logging in..." : "Login"}
                  </button>

                  <div className="social-login">
                    <p>Or login with</p>
                    <div className="social-buttons">
                      <button
                        type="button"
                        className="social-btn google"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                      >
                        <i className="fab fa-google"></i>
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            )}

            {activeTab === "register" && (
              <div className="tab-content active" id="register-tab">
                <h2>Create Account</h2>
                <p>Join our emergency response network</p>
                <form className="auth-form" onSubmit={handleRegister}>
                  <div className="form-group">
                    <label htmlFor="register-name">Full Name</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user"></i>
                      <input
                        id="register-name"
                        name="register-name"
                        placeholder="Enter your full name"
                        required
                        style={{
                          paddingLeft: '2.5rem',
                          textIndent: '0',
                          position: 'relative',
                          zIndex: 1
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-email">Email Address</label>
                    <div className="input-with-icon">
                      <i className="fas fa-envelope"></i>
                      <input
                        id="register-email"
                        name="register-email"
                        type="email"
                        placeholder="Enter your email"
                        required
                        style={{
                          paddingLeft: '2.5rem',
                          textIndent: '0',
                          position: 'relative',
                          zIndex: 1
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-password">Password</label>
                    <div className="input-with-icon">
                      <i className="fas fa-lock"></i>
                      <input
                        id="register-password"
                        name="register-password"
                        type="password"
                        placeholder="Create a password"
                        required
                        style={{
                          paddingLeft: '2.5rem',
                          textIndent: '0',
                          position: 'relative',
                          zIndex: 1
                        }}
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-type">Register As</label>
                    <div className="input-with-icon">
                      <i className="fas fa-user-shield"></i>
                      <select 
                        id="register-type" 
                        name="register-type"
                        style={{
                          paddingLeft: '2.5rem',
                          textIndent: '0',
                          position: 'relative',
                          zIndex: 1
                        }}
                      >
                        <option value="user">User</option>
                        <option value="hospital">Hospital Representative</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </div>

                  <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
                    {loading ? "Creating account..." : "Create Account"}
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
