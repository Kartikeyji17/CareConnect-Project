import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import {
  doc,
  onSnapshot,
  updateDoc,
  setDoc,
  collection,
  query,
  where,
  addDoc,
  getDoc,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";
import "../styles/hospitalsdashboard.css";

type Supplies = {
  blood: number;
  ambulance: number;
  oxygen: number;
  beds: number;
};
type Request = {
  id: string;
  userName: string;
  userEmail: string;
  hospitalId?: string;
  status: "Pending" | "Approved" | "Rejected";
  summary?: string;
  blood?: number;
  oxygen?: number;
  ambulance?: number;
  beds?: number;
  details?: string;
};
type HospitalProfile = {
  name: string;
  address: string;
  contact: string;
  email: string;
};
type Notification = {
  id: string;
  message: string;
  type: "warning" | "info" | "success" | "error";
  timestamp: any;
};

export default function HospitalDashboard(): React.JSX.Element {
  const [supplies, setSupplies] = useState<Supplies>({
    blood: 0,
    ambulance: 0,
    oxygen: 0,
    beds: 0,
  });
  const [requests, setRequests] = useState<Request[]>([]);
  const [profile, setProfile] = useState<HospitalProfile>({
    name: "",
    address: "",
    contact: "",
    email: "",
  });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loadingSupplies, setLoadingSupplies] = useState(true);
  const [loadingRequests, setLoadingRequests] = useState(true);
  const [showProfileEdit, setShowProfileEdit] = useState(false);
  const [newBroadcast, setNewBroadcast] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);

  const hospitalId = auth.currentUser?.uid;

  // Ensure hospital doc exists
  useEffect(() => {
    if (!hospitalId) return;
    const hospitalRef = doc(db, "hospitals", hospitalId);

    const ensureHospitalDoc = async () => {
      const snap = await getDoc(hospitalRef);
      if (!snap.exists()) {
        await setDoc(hospitalRef, {
          name: auth.currentUser?.displayName || "Unnamed Hospital",
          email: auth.currentUser?.email || "",
          address: "",
          contact: "",
          blood: 0,
          ambulance: 0,
          oxygen: 0,
          beds: 0,
        });
      }
    };
    ensureHospitalDoc();
  }, [hospitalId]);

  // Fetch Profile + Supplies
  useEffect(() => {
    if (!hospitalId) return;
    const hospitalRef = doc(db, "hospitals", hospitalId);
    const unsubscribe = onSnapshot(hospitalRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSupplies({
          blood: data.blood ?? 0,
          ambulance: data.ambulance ?? 0,
          oxygen: data.oxygen ?? 0,
          beds: data.beds ?? 0,
        });
        setProfile({
          name: data.name ?? "",
          address: data.address ?? "",
          contact: data.contact ?? "",
          email: data.email ?? "",
        });
      }
      setLoadingSupplies(false);
    });
    return () => unsubscribe();
  }, [hospitalId]);

  // Fetch Requests
  useEffect(() => {
    if (!hospitalId) return;

    const requestsRef = collection(db, "requests");
    const q = query(requestsRef, where("hospitalId", "==", hospitalId));

    const unsubscribe = onSnapshot(q, async (snap) => {
      if (snap.empty) {
        setRequests([]);
      } else {
        const reqs = await Promise.all(
          snap.docs.map(async (docSnap) => {
            const data = docSnap.data() as any;

            let userName = data.requesterName || "Unknown User";
            if (!data.requesterName && data.requesterId) {
              try {
                const userDoc = await getDoc(
                  doc(db, "users", data.requesterId)
                );
                if (userDoc.exists()) {
                  const userData = userDoc.data();
                  userName = userData.name || userData.email || userName;
                }
              } catch (err) {
                console.error("Error fetching user:", err);
              }
            }

            const items = data.items || {};
            const details: string[] = [];
            if (items.blood && items.blood > 0)
              details.push(`${items.blood} unit(s) blood`);
            if (items.oxygen && items.oxygen > 0)
              details.push(`${items.oxygen} unit(s) oxygen`);
            if (items.ambulance && items.ambulance > 0)
              details.push(`${items.ambulance} ambulance(s)`);
            if (items.beds && items.beds > 0)
              details.push(`${items.beds} bed(s)`);

            return {
              id: docSnap.id,
              userName,
              userEmail: data.requesterEmail || "Unknown Email",
              hospitalId: data.hospitalId,
              status: data.status || "Pending",
              details: details.join(", ") || "No resources specified",
            } as Request;
          })
        );

        setRequests(reqs);
      }
      setLoadingRequests(false);
    });

    return () => unsubscribe();
  }, [hospitalId]);

  // Notifications based on supplies
  useEffect(() => {
    const newNotifications: Notification[] = [];
    if (supplies.oxygen < 10)
      newNotifications.push({
        id: "oxygen-warning",
        message: "Oxygen stock below 10 cylinders!",
        type: "warning",
        timestamp: new Date(),
      });
    if (supplies.blood < 20)
      newNotifications.push({
        id: "blood-warning",
        message: "Blood units running low!",
        type: "warning",
        timestamp: new Date(),
      });
    const pendingCount = requests.filter((r) => r.status === "Pending").length;
    if (pendingCount > 0)
      newNotifications.push({
        id: "pending-requests",
        message: `${pendingCount} requests pending approval`,
        type: "info",
        timestamp: new Date(),
      });
    setNotifications(newNotifications);
  }, [supplies, requests]);

  // Update supply
  const updateSupply = async (type: keyof Supplies, delta: number) => {
    if (!hospitalId) return;
    const newValue = Math.max(0, (supplies[type] || 0) + delta);
    setSupplies({ ...supplies, [type]: newValue });
    try {
      await updateDoc(doc(db, "hospitals", hospitalId), { [type]: newValue });
    } catch (err) {
      console.error("Error updating supplies:", err);
    }
  };

  // Update request status
  const updateRequestStatus = async (
    reqId: string,
    status: Request["status"]
  ) => {
    try {
      const reqRef = doc(db, "requests", reqId);
      await updateDoc(reqRef, { status });
      setRequests((prev) =>
        prev.map((r) => (r.id === reqId ? { ...r, status } : r))
      );
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  // Broadcast to all users
  const sendBroadcast = async () => {
    if (!newBroadcast.trim() || !hospitalId) return;
    try {
      const hospitalName = profile.name || "Unnamed Hospital";

      // Fetch all users
      const usersSnap = await getDocs(collection(db, "users"));
      const users = usersSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      // Send notification to each user
      await Promise.all(
        users.map(async (user) => {
          await addDoc(collection(db, "notifications"), {
            message: newBroadcast,
            senderType: "hospital",
            senderName: hospitalName,
            userId: user.id,
            timestamp: serverTimestamp(),
            read: false,
            urgent: isUrgent,
          });
        })
      );

      // Optionally store in hospital broadcasts collection
      await addDoc(collection(db, "broadcasts"), {
        message: newBroadcast,
        senderName: hospitalName,
        timestamp: serverTimestamp(),
        urgent: isUrgent,
      });

      setNewBroadcast("");
      setIsUrgent(false);
      alert("Broadcast sent to all users successfully!");
    } catch (err) {
      console.error("Error sending broadcast:", err);
    }
  };

  // Profile update
  const updateProfile = async (updatedProfile: HospitalProfile) => {
    if (!hospitalId) return;
    setProfile(updatedProfile);
    setShowProfileEdit(false);
    try {
      await updateDoc(doc(db, "hospitals", hospitalId), updatedProfile);
    } catch (err) {
      console.error("Error updating profile:", err);
    }
  };

  return (
    <section className="hospital-dashboard">
      <div className="container">
        {/* Header */}
        <div className="dashboard-header">
          <h1>Hospital Dashboard</h1>
          <div className="hospital-profile">
            <span className="hospital-name">{profile.name}</span>
            <button
              className="btn btn-outline btn-sm"
              onClick={() => setShowProfileEdit(true)}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          {["beds", "blood", "oxygen", "ambulance"].map((key) => (
            <div className={`stat-card ${key}`} key={key}>
              <div className="stat-icon">
                {key === "beds"
                  ? "🛏️"
                  : key === "blood"
                  ? "🩸"
                  : key === "oxygen"
                  ? "💨"
                  : "💊"}
              </div>
              <div className="stat-content">
                <h3>
                  {key === "ambulance"
                    ? "Ambulance Stock"
                    : key.charAt(0).toUpperCase() + key.slice(1)}
                </h3>
                <div className="stat-number">
                  {supplies[key as keyof Supplies]}
                  {key === "ambulance" ? "%" : ""}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Supplies & Requests */}
        <div className="dashboard-grid">
          {/* Supplies */}
          <div className="supplies-card">
            <h2>Update Supplies</h2>
            {loadingSupplies ? (
              <p>Loading supplies...</p>
            ) : (
              <div className="supply-controls-grid">
                {Object.entries(supplies).map(([key, value]) => (
                  <div className="supply-control-item" key={key}>
                    <div className="supply-label">
                      <span className="supply-icon">
                        {key === "beds"
                          ? "🛏️"
                          : key === "blood"
                          ? "🩸"
                          : key === "oxygen"
                          ? "💨"
                          : "💊"}
                      </span>
                      <span className="supply-name">
                        {key === "ambulance"
                          ? "ambulance Stock"
                          : key.charAt(0).toUpperCase() + key.slice(1)}
                      </span>
                    </div>
                    <div className="supply-value">
                      <span className="current-value">
                        {value}
                        {key === "ambulance" ? "%" : ""}
                      </span>
                    </div>
                    <div className="supply-buttons">
                      <button
                        className="btn btn-outline btn-sm"
                        onClick={() => updateSupply(key as keyof Supplies, -1)}
                      >
                        -
                      </button>
                      <button
                        className="btn btn-primary btn-sm"
                        onClick={() => updateSupply(key as keyof Supplies, +1)}
                      >
                        +
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Requests */}
          <div className="requests-card">
            <h2>Requests</h2>
            {loadingRequests ? (
              <p>Loading requests...</p>
            ) : requests.length === 0 ? (
              <p>No requests yet</p>
            ) : (
              <div className="request-list">
                {requests.map((r) => (
                  <div className="request-item" key={r.id}>
                    <div className="request-info">
                      <p className="request-text">
                        <strong>{r.userName}</strong> requested: {r.details}
                      </p>
                      <span
                        className={`status-badge ${
                          r.status.toLowerCase() || "pending"
                        }`}
                      >
                        {r.status}
                      </span>
                    </div>
                    <div className="request-actions">
                      {r.status === "Pending" && (
                        <>
                          <button
                            className="btn btn-success btn-sm"
                            onClick={() =>
                              updateRequestStatus(r.id, "Approved")
                            }
                          >
                            Approve
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() =>
                              updateRequestStatus(r.id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        <div className="notifications-card">
          <h2>Notifications</h2>
          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications</p>
          ) : (
            <div className="notifications-list">
              {notifications.map((n) => (
                <div className={`notification-item ${n.type}`} key={n.id}>
                  <span className="notification-icon">
                    {n.type === "warning"
                      ? "⚠️"
                      : n.type === "info"
                      ? "ℹ️"
                      : n.type === "success"
                      ? "✅"
                      : "❌"}
                  </span>
                  <span className="notification-message">{n.message}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Broadcast */}
        <div className="broadcast-card">
          <h2>Broadcast Message</h2>
          <textarea
            className="broadcast-input"
            placeholder="Type your message..."
            value={newBroadcast}
            onChange={(e) => setNewBroadcast(e.target.value)}
          />
          <div className="broadcast-controls">
            <label className="urgent-checkbox">
              <input
                type="checkbox"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
              />
              Urgent
            </label>
            <button className="btn btn-primary" onClick={sendBroadcast}>
              Send
            </button>
          </div>
        </div>
      </div>

      {/* Profile Modal */}
      {showProfileEdit && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <div className="form-group">
              <label>Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) =>
                  setProfile({ ...profile, name: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input
                type="text"
                value={profile.address}
                onChange={(e) =>
                  setProfile({ ...profile, address: e.target.value })
                }
              />
            </div>
            <div className="form-group">
              <label>Contact</label>
              <input
                type="text"
                value={profile.contact}
                onChange={(e) =>
                  setProfile({ ...profile, contact: e.target.value })
                }
              />
            </div>
            <div className="form-actions">
              <button
                className="btn btn-outline"
                onClick={() => setShowProfileEdit(false)}
              >
                Cancel
              </button>
              <button
                className="btn btn-primary"
                onClick={() => updateProfile(profile)}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
