import React, { useState } from "react";
import ProfilePage from "../pages/ProfilePage";
import NotificationsPage from "../pages/NotificationsPage";
import RequestHistoryPage from "../pages/RequestsPage";
import HospitalsPage from "../pages/HospitalsPage";
import "../styles/UserDashboard.css";

export default function UserDashboard(): React.JSX.Element {
  const [activeTab, setActiveTab] = useState<
    "profile" | "notifications" | "history" | "hospitals"
  >("profile");

  return (
    <div className="page">
      {/* Horizontal Navbar */}
      <nav className="navbar">
        <div className="navbar__brand">User Dashboard</div>
        <div className="nav">
          <button
            className={activeTab === "profile" ? "active" : ""}
            onClick={() => setActiveTab("profile")}
          >
            Profile
          </button>
          <button
            className={activeTab === "notifications" ? "active" : ""}
            onClick={() => setActiveTab("notifications")}
          >
            Notifications
          </button>
          <button
            className={activeTab === "history" ? "active" : ""}
            onClick={() => setActiveTab("history")}
          >
            Request History
          </button>
          <button
            className={activeTab === "hospitals" ? "active" : ""}
            onClick={() => setActiveTab("hospitals")}
          >
            Find My Hospitals
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-content">
        {activeTab === "profile" && <ProfilePage />}
        {activeTab === "notifications" && <NotificationsPage />}
        {activeTab === "history" && <RequestHistoryPage />}
        {activeTab === "hospitals" && <HospitalsPage />}
      </div>
    </div>
  );
}
