import React, { useState } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, auth } from "./firebase";
import Button from "../ui/Button";

const Emergency: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );

  // ✅ Function to get user location
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

  // 🚨 Function to send alert
  const handleEmergency = async () => {
    const confirmAlert = window.confirm(
      "Are you sure you want to send an emergency alert?"
    );
    if (!confirmAlert) return;

    setLoading(true);
    setMessage("");

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

      setMessage("🚨 Emergency alert sent successfully!");
    } catch (error: any) {
      console.error("Error sending alert:", error);
      setMessage(`❌ Failed to send alert: ${error.message || error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 p-6">
      <div className="text-center max-w-md bg-white p-6 rounded-2xl shadow-md border border-red-200">
        <h1 className="text-2xl font-bold text-red-600 mb-4">
          Emergency Alert System
        </h1>
        <p className="text-gray-700 mb-6">
          Press the button below to immediately alert nearby hospitals with your
          current location.
        </p>

        <Button
          onClick={handleEmergency}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white text-lg px-8 py-4 rounded-full shadow-lg"
        >
          {loading ? "Sending..." : "🚨 Emergency"}
        </Button>

        {message && (
          <p
            className={`mt-4 text-sm font-medium ${
              message.includes("success") ? "text-green-600" : "text-red-600"
            }`}
          >
            {message}
          </p>
        )}

        {location && (
          <div className="mt-4 text-gray-600 text-sm">
            📍 Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
          </div>
        )}
      </div>
    </div>
  );
};

export default Emergency;
