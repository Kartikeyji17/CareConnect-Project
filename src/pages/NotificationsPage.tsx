import React, { useEffect, useState } from "react";
import { auth, db } from "./firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "../styles/userdashboard.css";

type Notification = {
  id: string;
  summary?: string; // for admin messages
  message?: string; // for hospital messages
  status?: "Pending" | "Approved" | "Rejected";
  createdAt?: any;
  hospitalName?: string;
  type: "request" | "notification";
  senderType?: "admin" | "hospital";
  senderName?: string;
  read: boolean;
};

export default function NotificationsPage(): React.JSX.Element {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const notificationsRef = collection(db, "notifications");
    const q = query(
      notificationsRef,
      where("userId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allNotifications: Notification[] = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...(doc.data() as Omit<Notification, "id">),
      }));

      const sortedNotifications = allNotifications.sort((a, b) => {
        if (a.read === b.read) {
          return (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0);
        }
        return a.read ? 1 : -1; // unread first
      });

      setNotifications(sortedNotifications);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const markAsRead = async (id: string) => {
    try {
      await updateDoc(doc(db, "notifications", id), { read: true });
    } catch (err) {
      console.error(err);
    }
  };

  const clearNotifications = async (section: "admin" | "hospital") => {
    const sectionNotifications = notifications.filter((n) =>
      section === "admin"
        ? n.type === "notification" &&
          (!n.senderType || n.senderType === "admin")
        : n.senderType === "hospital"
    );

    try {
      await Promise.all(
        sectionNotifications.map((n) =>
          deleteDoc(doc(db, "notifications", n.id))
        )
      );
    } catch (err) {
      console.error("Error clearing notifications:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;
  const readCount = notifications.filter((n) => n.read).length;

  const adminNotifications = notifications.filter(
    (n) =>
      n.type === "notification" && (!n.senderType || n.senderType === "admin")
  );

  const hospitalNotifications = notifications.filter(
    (n) => n.senderType === "hospital"
  );

  return (
    <div className="notifications-page">
      <h2>Notifications</h2>
      <div style={{ marginBottom: 12 }}>
        <strong>Unread:</strong> {unreadCount} | <strong>Read:</strong>{" "}
        {readCount}
      </div>

      {loading ? (
        <p>Loading notifications...</p>
      ) : (
        <>
          {/* Admin Notifications */}
          <h3>
            Admin Notifications
            {adminNotifications.length > 0 && (
              <button
                style={{ marginLeft: 12 }}
                className="btn btn-sm btn-outline"
                onClick={() => clearNotifications("admin")}
              >
                Clear All
              </button>
            )}
          </h3>
          {adminNotifications.length === 0 ? (
            <p>No admin notifications yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {adminNotifications.map((n) => (
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
                  <strong style={{ color: "#66bb6a", marginRight: 8 }}>
                    Admin
                  </strong>
                  {n.summary}
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

          {/* Hospital Broadcasts */}
          <h3>
            Hospital Broadcasts
            {hospitalNotifications.length > 0 && (
              <button
                style={{ marginLeft: 12 }}
                className="btn btn-sm btn-outline"
                onClick={() => clearNotifications("hospital")}
              >
                Clear All
              </button>
            )}
          </h3>
          {hospitalNotifications.length === 0 ? (
            <p>No hospital messages yet.</p>
          ) : (
            <ul style={{ listStyle: "none", padding: 0 }}>
              {hospitalNotifications.map((n) => (
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
                  <strong style={{ color: "#42a5f5", marginRight: 8 }}>
                    {n.senderName || "Hospital"}
                  </strong>
                  {n.message}{" "}
                  {n.hospitalName && `(Hospital: ${n.hospitalName})`}
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
        </>
      )}
    </div>
  );
}
