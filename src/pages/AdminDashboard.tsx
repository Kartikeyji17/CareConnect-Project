import React, { useEffect, useState } from "react";
import { db } from "../pages/firebase";
import "../styles/admindashboard.css";
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  deleteDoc,
  serverTimestamp,
} from "firebase/firestore";
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

// --- Types ---
type User = {
  id: string;
  name: string;
  email: string;
  type: "user" | "hospital" | "donor" | "admin";
  status: "active" | "banned";
};

type Hospital = {
  id: string;
  name: string;
  location: string;
  beds: number;
  blood: number;
  oxygen: number;
  medicines: number;
  status: "active" | "pending" | "deactivated";
};

type Request = {
  id: string;
  userName: string;
  hospitalName: string;
  blood: number;
  oxygen: number;
  beds: number;
  medicines: number;
  status: "Pending" | "Approved" | "Rejected" | "Fulfilled";
};

type Announcement = {
  id: string;
  message: string;
  createdAt?: { seconds: number; nanoseconds: number };
};

type Traffic = { id: string; date: string; visitors: number };

export default function AdminDashboard(): React.JSX.Element {
  const [users, setUsers] = useState<User[]>([]);
  const [hospitals, setHospitals] = useState<Hospital[]>([]);
  const [requests, setRequests] = useState<Request[]>([]);
  const [traffic, setTraffic] = useState<Traffic[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [showAllRequests, setShowAllRequests] = useState(false);

  // --- Firestore listeners ---
  useEffect(() => {
    const unsubUsers = onSnapshot(collection(db, "users"), (snapshot) =>
      setUsers(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<User, "id">),
        }))
      )
    );

    const unsubHospitals = onSnapshot(collection(db, "hospitals"), (snapshot) =>
      setHospitals(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Hospital, "id">),
        }))
      )
    );

    const unsubRequests = onSnapshot(collection(db, "requests"), (snapshot) =>
      setRequests(
        snapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id,
            userName: data.userName || "Unknown",
            hospitalName: data.hospitalName || "Unknown",
            blood: data.blood || 0,
            oxygen: data.oxygen || 0,
            beds: data.beds || 0,
            medicines: data.medicines || 0,
            status: data.status || "Pending",
          } as Request;
        })
      )
    );

    const unsubTraffic = onSnapshot(collection(db, "traffic"), (snapshot) =>
      setTraffic(
        snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as Omit<Traffic, "id">),
        }))
      )
    );

    const unsubAnnouncements = onSnapshot(
      collection(db, "announcements"),
      (snapshot) =>
        setAnnouncements(
          snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<Announcement, "id">),
          }))
        )
    );

    return () => {
      unsubUsers();
      unsubHospitals();
      unsubRequests();
      unsubTraffic();
      unsubAnnouncements();
    };
  }, []);

  // --- Actions ---
  const updateRequestStatus = async (id: string, status: Request["status"]) => {
    try {
      await updateDoc(doc(db, "requests", id), { status });
    } catch (err) {
      console.error("Error updating request:", err);
    }
  };

  const addAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    try {
      // 1. Add announcement to announcements collection
      const docRef = await addDoc(collection(db, "announcements"), {
        message: newAnnouncement,
        createdAt: serverTimestamp(),
      });

      console.log("Announcement added:", {
        id: docRef.id,
        message: newAnnouncement,
      });

      // 2. Send as notification to all users
      users.forEach(async (user) => {
        await addDoc(collection(db, "notifications"), {
          userId: user.id,
          type: "notification",
          summary: newAnnouncement,
          createdAt: serverTimestamp(),
          read: false, // unread by default
        });
        console.log(`Sent notification to ${user.name} (${user.email})`);
      });

      // 3. Clear input
      setNewAnnouncement("");
    } catch (err) {
      console.error("Error adding announcement:", err);
    }
  };

  const deleteAnnouncement = async (id: string) => {
    try {
      await deleteDoc(doc(db, "announcements", id));
    } catch (err) {
      console.error(err);
    }
  };

  // --- Delete Hospital ---
  const deleteHospital = async (id: string) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this hospital? This action is permanent!"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "hospitals", id));
      console.log(`Hospital ${id} deleted successfully.`);
    } catch (err) {
      console.error("Error deleting hospital:", err);
    }
  };

  // --- Derived Metrics ---
  const totalVisitors = traffic.reduce((a, t) => a + (t.visitors || 0), 0);
  const fulfilledRequests =
    requests.length > 0
      ? Math.round(
          (requests.filter((r) => r.status === "Fulfilled").length /
            requests.length) *
            100
        )
      : 0;

  // Count active users (real-time)
  const activeUsersCount = users.filter((u) => u.status === "active").length;

  // --- Prepare chart data for Requests by Type ---
  const totalResources = requests.reduce(
    (acc, r) => {
      acc.blood += r.blood || 0;
      acc.oxygen += r.oxygen || 0;
      acc.beds += r.beds || 0;
      acc.medicines += r.medicines || 0;
      return acc;
    },
    { blood: 0, oxygen: 0, beds: 0, medicines: 0 }
  );

  const requestChartData = [
    { name: "Blood", quantity: totalResources.blood },
    { name: "Oxygen", quantity: totalResources.oxygen },
    { name: "Beds", quantity: totalResources.beds },
    { name: "Medicines", quantity: totalResources.medicines },
  ];

  // --- Render ---
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Overview Cards */}
      <div className="cards-grid">
        <div className="card card-blue">
          <h4>Total Users</h4>
          <p>{users.length}</p>
        </div>
        <div className="card card-green">
          <h4>Total Hospitals</h4>
          <p>{hospitals.length}</p>
        </div>
        <div className="card card-yellow">
          <h4>Total Requests</h4>
          <p>{requests.length}</p>
        </div>
        <div className="card card-red">
          <h4>Total Visitors</h4>
          <p>{totalVisitors}</p>
        </div>
        <div className="card card-purple">
          <h4>Fulfilled</h4>
          <p>{fulfilledRequests}</p>
        </div>
        <div className="card card-orange">
          <h4>Active Users</h4>
          <p>{activeUsersCount}</p>
        </div>
      </div>

      {/* Requests Table */}
      <h3 style={{ color: "black", fontSize: "25px" }}>Requests</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>User</th>
            <th>Hospital</th>
            <th>Blood</th>
            <th>Oxygen</th>
            <th>Beds</th>
            <th>Medicines</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {(showAllRequests ? requests : requests.slice(0, 5)).map((r) => (
            <tr key={r.id}>
              <td>{r.userName}</td>
              <td>{r.hospitalName}</td>
              <td>{r.blood}</td>
              <td>{r.oxygen}</td>
              <td>{r.beds}</td>
              <td>{r.medicines}</td>
              <td>{r.status}</td>
              <td>
                {r.status === "Pending" && (
                  <>
                    <button
                      className="btn btn-approve"
                      onClick={() => updateRequestStatus(r.id, "Approved")}
                    >
                      Approve
                    </button>
                    <button
                      className="btn btn-reject"
                      onClick={() => updateRequestStatus(r.id, "Rejected")}
                    >
                      Reject
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {requests.length > 5 && (
        <button
          className="btn btn-secondary"
          onClick={() => setShowAllRequests(!showAllRequests)}
        >
          {showAllRequests ? "Show Less" : "See More"}
        </button>
      )}

      {/* Hospitals Table */}
      <h3 style={{ color: "black", fontSize: "25px" }}>Registered Hospitals</h3>
      <table className="dashboard-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Location</th>
            <th>Blood</th>
            <th>Oxygen</th>
            <th>Beds</th>
            <th>Medicines</th>
            <th>Status</th>
            <th>Actions</th> {/* NEW */}
          </tr>
        </thead>
        <tbody>
          {hospitals.map((h) => (
            <tr key={h.id}>
              <td>{h.name}</td>
              <td>{h.location}</td>
              <td>{h.blood}</td>
              <td>{h.oxygen}</td>
              <td>{h.beds}</td>
              <td>{h.medicines}</td>
              <td>{h.status}</td>
              <td>
                <button
                  className="btn btn-danger"
                  onClick={() => deleteHospital(h.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Analytics */}
      <h3 style={{ color: "black", fontSize: "25px" }}>Analytics</h3>
      <div className="charts-grid">
        <div className="chart-card">
          <h4 style={{ color: "black", fontSize: "15px" }}>
            Requests by Resource
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={requestChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="quantity" fill="#42a5f5" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4 style={{ color: "black", fontSize: "15px" }}>
            Hospital Resources
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hospitals}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="beds" fill="#43a047" />
              <Bar dataKey="blood" fill="#fbc02d" />
              <Bar dataKey="oxygen" fill="#e53935" />
              <Bar dataKey="medicines" fill="#8e24aa" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h4 style={{ color: "black", fontSize: "15px" }}>
            Site Visitors Over Time
          </h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={traffic}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="visitors"
                stroke="#00acc1"
                fill="#80deea"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Announcements */}
      <h3>Announcements</h3>
      <div className="announcement-section">
        <input
          type="text"
          value={newAnnouncement}
          placeholder="Write a new announcement..."
          onChange={(e) => setNewAnnouncement(e.target.value)}
        />
        <button className="btn btn-primary" onClick={addAnnouncement}>
          Post
        </button>
      </div>

      <ul className="announcement-list">
        {announcements
          .sort(
            (a, b) => (b.createdAt?.seconds || 0) - (a.createdAt?.seconds || 0)
          )
          .map((a) => (
            <li key={a.id} className="announcement-item">
              <div>
                <p>{a.message}</p>
                <small>
                  {a.createdAt
                    ? new Date(a.createdAt.seconds * 1000).toLocaleString()
                    : "Just now"}
                </small>
                <button
                  style={{ marginLeft: "20px" }}
                  className="btn btn-danger"
                  onClick={() => deleteAnnouncement(a.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
}
