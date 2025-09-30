import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import { doc, getDoc, setDoc } from "firebase/firestore";
import "../styles/profilepage.css";

export default function ProfilePage(): React.JSX.Element {
  const user = auth.currentUser;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profile, setProfile] = useState({
    name: "",
    email: user?.email || "",
    phone: "",
  });

  // Fetch profile on mount
  useEffect(() => {
    if (!user) return;

    const fetchProfile = async () => {
      try {
        const userRef = doc(db, "users", user.uid);
        const snap = await getDoc(userRef);

        if (snap.exists()) {
          setProfile((prev) => ({
            ...prev,
            ...(snap.data() as typeof profile),
          }));
        }
      } catch (err) {
        console.error("Error fetching profile:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    if (!user) {
      alert("No user logged in!");
      return;
    }
    setSaving(true);

    try {
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, profile, { merge: true });
      alert("✅ Profile updated successfully!");
    } catch (err) {
      console.error("Error saving profile:", err);
      alert("❌ Error saving profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="loading">Loading profile...</p>;

  return (
    <div className="profile-page">
      <div className="container">
        <h1 className="title">My Profile</h1>
        <p className="section-description">
          Manage your personal information here.
        </p>

        <form className="profile-form" onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              name="name"
              id="name"
              value={profile.name}
              onChange={handleChange}
              placeholder="Enter your name"
            />
          </div>

          <div className="form-group">
            <label>Email (read-only)</label>
            <input value={profile.email} disabled />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              name="phone"
              id="phone"
              value={profile.phone}
              onChange={handleChange}
              placeholder="Enter your phone number"
            />
          </div>

          <button
            type="button"
            className="btn btn-primary"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}
