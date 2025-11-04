import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";
import { motion } from "framer-motion";
import Button from "../ui/Button";

// 🚑 Ambulance SVG Component
const AmbulanceSVG: React.FC = () => (
  <svg
    width="90"
    height="50"
    viewBox="0 0 80 40"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="5"
      y="10"
      width="50"
      height="20"
      rx="3"
      fill="#fff"
      stroke="#d32f2f"
      strokeWidth="2"
    />
    <rect
      x="55"
      y="15"
      width="20"
      height="15"
      rx="3"
      fill="#f8f8f8"
      stroke="#d32f2f"
      strokeWidth="2"
    />
    <rect x="20" y="14" width="12" height="8" fill="#1976d2" />
    <circle cx="20" cy="32" r="5" fill="#222" />
    <circle cx="60" cy="32" r="5" fill="#222" />
    <rect x="30" y="4" width="10" height="4">
      <animate
        attributeName="fill"
        values="#1976d2;#d32f2f;#1976d2"
        dur="0.6s"
        repeatCount="indefinite"
      />
    </rect>
  </svg>
);

const Emergency: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [showAmbulance, setShowAmbulance] = useState(false);

  // ✅ Get user location
  const getLocation = (): Promise<{ lat: number; lng: number }> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject("Geolocation not supported.");
      } else {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
          },
          (err) => reject(err.message)
        );
      }
    });
  };

  // 🚨 Handle Emergency Alert
  const handleEmergency = async () => {
    const confirmAlert = window.confirm(
      "Are you sure you want to send an emergency alert?"
    );
    if (!confirmAlert) return;

    setLoading(true);
    setMessage("");
    setShowAmbulance(false);

    try {
      const coords = await getLocation();
      setLocation(coords);

      const user = auth.currentUser;

      await addDoc(collection(db, "emergency_alerts"), {
        userId: user?.uid || "anonymous",
        name: user?.displayName || "Guest User",
        location: coords,
        type: "General Emergency",
        timestamp: serverTimestamp(),
        status: "pending",
      });

      // 🚑 Trigger animation + sound
      setMessage("🚨 Emergency alert sent successfully!");
      setShowAmbulance(true);
      const siren = new Audio("/siren.mp3");
      siren.play().catch(() => {});
    } catch (error: any) {
      console.error("Error sending alert:", error);
      setMessage(`❌ Failed to send alert: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="emergency-wrapper"
      style={{
        position: "relative",
        zIndex: 100,
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #ffebee, #fff)",
        overflow: "hidden",
      }}
    >
      <div
        className="emergency-card"
        style={{
          zIndex: 2,
          background: "#fff",
          borderRadius: "20px",
          boxShadow:
            "0 8px 24px rgba(211,47,47,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
          padding: "40px 32px",
          maxWidth: "500px",
          width: "90%",
          textAlign: "center",
          border: "1px solid rgba(211,47,47,0.2)",
        }}
      >
        <h1 style={{ fontSize: "28px", fontWeight: "700", color: "#d32f2f" }}>
          Emergency Alert System
        </h1>

        <p
          style={{
            color: "#333",
            margin: "16px 0 24px",
            lineHeight: "1.6",
          }}
        >
          Press the button below to immediately alert nearby hospitals with your
          current location.
        </p>

        <Button
          onClick={handleEmergency}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-full shadow-lg transition-transform hover:scale-105"
        >
          {loading ? "Sending..." : "🚨 Emergency"}
        </Button>

        {message && (
          <p
            style={{
              marginTop: "16px",
              fontWeight: 500,
              color: message.includes("success") ? "#2e7d32" : "#d32f2f",
            }}
          >
            {message}
          </p>
        )}

        {location && (
          <div style={{ marginTop: "12px", color: "#555", fontSize: "14px" }}>
            📍 Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        )}

        {/* 🚑 Animation */}
        {showAmbulance && (
          <>
            <div
              style={{
                marginTop: "32px",
                position: "relative",
                width: "100%",
                height: "160px",
                background: "linear-gradient(90deg, #ffebee 0%, #ffffff 100%)",
                borderRadius: "14px",
                overflow: "hidden",
                border: "1px solid rgba(211,47,47,0.1)",
              }}
            >
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: "55%" }}
                transition={{ duration: 4, ease: "easeInOut" }}
                style={{
                  position: "absolute",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <AmbulanceSVG />
              </motion.div>

              <div
                style={{
                  position: "absolute",
                  right: "24px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <div style={{ position: "relative" }}>
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      borderRadius: "50%",
                      background: "rgba(211,47,47,0.3)",
                      animation: "ping 1s infinite",
                    }}
                  />
                  <div
                    style={{
                      width: "18px",
                      height: "18px",
                      background: "#d32f2f",
                      borderRadius: "50%",
                      border: "2px solid #fff",
                      boxShadow: "0 0 8px rgba(211,47,47,0.5)",
                    }}
                  />
                </div>
                <span
                  style={{
                    marginTop: "8px",
                    fontSize: "12px",
                    color: "#555",
                  }}
                >
                  Your Location
                </span>
              </div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.8, 1] }}
              transition={{ delay: 4, duration: 1.2 }}
              style={{
                marginTop: "20px",
                color: "#2e7d32",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              🚑 Help is on the way!
            </motion.p>
          </>
        )}
      </div>
    </div>
  );
};

export default Emergency;
