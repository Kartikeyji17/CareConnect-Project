import React, { useEffect, useState } from "react";
import { db, auth } from "./firebase";
import { collection, query, where, onSnapshot } from "firebase/firestore";

type Request = {
  id: string;
  hospitalName: string;
  items: Record<string, number>;
  note?: string;
  status: "Pending" | "Approved" | "Rejected";
  createdAt?: any;
};

export default function RequestsPage(): React.JSX.Element {
  const [requests, setRequests] = useState<Request[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth.currentUser) return;

    const requestsRef = collection(db, "requests");
    const q = query(
      requestsRef,
      where("requesterId", "==", auth.currentUser.uid)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const requestList: Request[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Request, "id">),
        }));
        setRequests(requestList);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching requests:", err);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const renderSummary = (r: Request) => {
    const itemsText = Object.entries(r.items)
      .map(([key, qty]) => `${key}: ${qty}`)
      .join(", ");
    return r.note ? `${itemsText} | Note: ${r.note}` : itemsText;
  };

  return (
    <section className="requests-page page">
      <div className="container">
        <h2>My Requests</h2>
        {loading ? (
          <p>Loading requests...</p>
        ) : requests.length === 0 ? (
          <p>No requests found.</p>
        ) : (
          <div className="requests-list">
            {requests.map((r) => (
              <div key={r.id} className="request-card">
                <div>
                  <div className="hospital-name">{r.hospitalName}</div>
                  <div className="summary">{renderSummary(r)}</div>
                  {r.createdAt && (
                    <div className="created-at">
                      {new Date(r.createdAt.seconds * 1000).toLocaleString()}
                    </div>
                  )}
                </div>
                <div
                  className={`status ${
                    r.status === "Approved"
                      ? "status-approved"
                      : r.status === "Rejected"
                      ? "status-rejected"
                      : "status-pending"
                  }`}
                >
                  {r.status}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
