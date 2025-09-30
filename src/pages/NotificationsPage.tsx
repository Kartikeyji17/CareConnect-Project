import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  orderBy,
} from "firebase/firestore";
import "../styles/UserDashboard.css";

type Request = {
  id: string;
  summary: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt?: any;
  hospitalName?: string;
  type: "request" | "notification"; // request = user request, notification = hospital/admin broadcast
};

export default function NotificationsPage(): React.JSX.Element {
  const [notifications, setNotifications] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const notificationsRef = collection(db, "requests"); // same collection
    const q = query(
      notificationsRef,
      where("userId", "==", auth.currentUser.uid), // user's own requests
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allNotifications: Request[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Request, "id">),
        }));
        // Only show type = notification OR approved/rejected requests
        const filtered = allNotifications.filter(
          (r) => r.type === "notification" || r.status !== "Pending"
        );
        setNotifications(filtered);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching notifications:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Notifications</h2>
      {loading ? (
        <p>Loading notifications...</p>
      ) : notifications.length === 0 ? (
        <p>No notifications yet.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {notifications.map((n) => (
            <li
              key={n.id}
              style={{
                padding: 12,
                border: "1px solid #444",
                marginBottom: 8,
                borderRadius: 8,
                backgroundColor: "#161616",
                color: "#f5f5f5",
              }}
            >
              <strong
                style={{
                  color:
                    n.status === "Approved"
                      ? "#66bb6a"
                      : n.status === "Rejected"
                      ? "#e53935"
                      : "#d32f2f",
                  marginRight: 8,
                }}
              >
                {n.type === "notification" ? "Broadcast" : n.status}
              </strong>
              {n.summary} {n.hospitalName && `(Hospital: ${n.hospitalName})`}
              {n.createdAt && (
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {new Date(n.createdAt.seconds * 1000).toLocaleString()}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
