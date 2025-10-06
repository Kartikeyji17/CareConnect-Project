import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
} from "firebase/firestore";
import "../styles/userdashboard.css";

type Notification = {
  id: string;
  summary: string;
  status?: "Pending" | "Approved" | "Rejected";
  createdAt?: any;
  hospitalName?: string;
  type: "request" | "notification";
  read: boolean;
};

export default function NotificationsPage(): React.JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const notificationsRef = collection(db, "notifications");

    // Only filter by userId; no orderBy
    const q = query(
      notificationsRef,
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const allNotifications: Notification[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Notification, "id">),
        }));

        // Sort unread first, newest first
        const sortedNotifications = allNotifications.sort((a, b) => {
          if (a.read === b.read) {
            return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
          }
          return a.read ? 1 : -1; // unread first
        });

        setNotifications(sortedNotifications);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching notifications:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
      console.log(`Notification ${id} marked as read`);
    } catch (err) {
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      <div style={{ marginBottom: 12 }}>
        <strong>Unread:</strong> {unreadCount} | <strong>Read:</strong>{" "}
        {readCount}
      </div>

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
                backgroundColor: n.read ? "#1e1e1e" : "#333",
                color: "#f5f5f5",
                cursor: "pointer",
              }}
              onClick={() => !n.read && markAsRead(n.id)}
            >
              <strong
                style={{
                  color:
                    n.type === "notification"
                      ? "#66bb6a" // green for admin notifications
                      : n.status === "Approved"
                      ? "#66bb6a"
                      : n.status === "Rejected"
                      ? "#e53935"
                      : "#d32f2f",
                  marginRight: 8,
                }}
              >
                {n.type === "notification" ? "Admin" : n.status}
              </strong>
              {n.summary} {n.hospitalName && `(Hospital: ${n.hospitalName})`}
              {n.createdAt && (
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  {new Date(
                    (n.createdAt?.seconds || 0) * 1000
                  ).toLocaleString()}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
