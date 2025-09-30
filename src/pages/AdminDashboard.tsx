import React, { useEffect, useState } from "react";
import { db } from "../pages/firebase";
import "../styles/admindashboard.css";
import { collection, onSnapshot, doc, updateDoc, addDoc } from "firebase/firestore";
import {
  LineChart, Line, BarChart, Bar, AreaChart, Area,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

// --- Types ---
type User = { id: string; name: string; email: string; type: "user"|"hospital"|"donor"|"admin"; status: "active"|"banned" };
type Hospital = { id: string; name: string; location: string; beds: number; blood: number; oxygen: number; medicines: number; status: "active"|"pending"|"deactivated" };
type Request = { id: string; userName: string; hospitalName: string; type: "blood"|"bed"|"oxygen"|"medicine"; status: "Pending"|"Approved"|"Rejected"|"Fulfilled" };
type Announcement = { id: string; message: string };
type Traffic = { id: string; date: string; visitors: number };

// --- Sample Data ---
const sampleUsers: User[] = [
  { id: "1", name: "Alice", email: "alice@gmail.com", type: "user", status: "active" },
  { id: "2", name: "Bob", email: "bob@gmail.com", type: "donor", status: "active" },
];

const sampleHospitals: Hospital[] = [
  { id: "1", name: "City Hospital", location: "Downtown", beds: 50, blood: 20, oxygen: 10, medicines: 100, status: "active" },
  { id: "2", name: "Green Valley Clinic", location: "Uptown", beds: 30, blood: 15, oxygen: 5, medicines: 50, status: "pending" },
];

const sampleRequests: Request[] = [
  { id: "1", userName: "Alice", hospitalName: "City Hospital", type: "blood", status: "Pending" },
  { id: "2", userName: "Bob", hospitalName: "Green Valley Clinic", type: "oxygen", status: "Fulfilled" },
];

const sampleTraffic: Traffic[] = [
  { id: "1", date: "2025-09-22", visitors: 15 },
  { id: "2", date: "2025-09-23", visitors: 20 },
];

const sampleAnnouncements: Announcement[] = [
  { id: "1", message: "System maintenance at 10 PM today" },
];

export default function AdminDashboard(): React.JSX.Element {
  const [users, setUsers] = useState<User[]>(sampleUsers);
  const [hospitals, setHospitals] = useState<Hospital[]>(sampleHospitals);
  const [requests, setRequests] = useState<Request[]>(sampleRequests);
  const [traffic, setTraffic] = useState<Traffic[]>(sampleTraffic);
  const [announcements, setAnnouncements] = useState<Announcement[]>(sampleAnnouncements);
  const [newAnnouncement, setNewAnnouncement] = useState("");

  // --- Firestore listeners with merge logic ---
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "users"), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<User,"id">) }));
      setUsers(prev => [...sampleUsers.filter(s => !data.find(d => d.id === s.id)), ...data]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "hospitals"), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Hospital,"id">) }));
      setHospitals(prev => [...sampleHospitals.filter(s => !data.find(d => d.id === s.id)), ...data]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "requests"), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Request,"id">) }));
      setRequests(prev => [...sampleRequests.filter(s => !data.find(d => d.id === s.id)), ...data]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "traffic"), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Traffic,"id">) }));
      setTraffic(prev => [...sampleTraffic.filter(s => !data.find(d => d.id === s.id)), ...data]);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "announcements"), snapshot => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...(doc.data() as Omit<Announcement,"id">) }));
      setAnnouncements(prev => [...sampleAnnouncements.filter(s => !data.find(d => d.id === s.id)), ...data]);
    });
    return unsubscribe;
  }, []);

  // --- Actions ---
  const updateRequestStatus = async (id: string, status: Request["status"]) => {
    try { await updateDoc(doc(db,"requests",id), { status }); } 
    catch (err) { console.error(err); }
  };

  const addAnnouncement = async () => {
    if (!newAnnouncement.trim()) return;
    try { 
      await addDoc(collection(db,"announcements"), { message: newAnnouncement }); 
      setNewAnnouncement(""); 
    } catch (err) { console.error(err); }
  };

  // --- Render ---
  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>

      {/* Overview Cards */}
      <div className="cards-grid">
        <div className="card card-blue"><h4>Total Users</h4><p>{users.length}</p></div>
        <div className="card card-green"><h4>Total Hospitals</h4><p>{hospitals.length}</p></div>
        <div className="card card-yellow"><h4>Total Requests</h4><p>{requests.length}</p></div>
        <div className="card card-red"><h4>Visitors</h4><p>{traffic.reduce((a,t)=>a+t.visitors,0)}</p></div>
        <div className="card card-purple"><h4>Requests Fulfilled %</h4>
          <p>{requests.length ? Math.round((requests.filter(r=>r.status==="Fulfilled").length/requests.length)*100) : 0}%</p>
        </div>
        <div className="card card-teal"><h4>Active Users Online</h4><p>{Math.floor(Math.random()*10)+1}</p></div>
      </div>

      {/* Hospitals Table */}
      <h3>Hospitals</h3>
      <table className="dashboard-table">
        <thead>
          <tr><th>Name</th><th>Location</th><th>Beds</th><th>Blood</th><th>Oxygen</th><th>Medicines</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {hospitals.map(h => (
            <tr key={h.id}>
              <td>{h.name}</td><td>{h.location}</td><td>{h.beds}</td><td>{h.blood}</td><td>{h.oxygen}</td><td>{h.medicines}</td><td>{h.status}</td>
              <td>
                {h.status==="pending" && <>
                  <button className="btn btn-approve">Approve</button>
                  <button className="btn btn-reject">Reject</button>
                </>}
                {h.status==="active" && <button className="btn btn-deactivate">Deactivate</button>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Requests Table */}
      <h3>Requests</h3>
      <table className="dashboard-table">
        <thead>
          <tr><th>Patient</th><th>Hospital</th><th>Type</th><th>Status</th><th>Actions</th></tr>
        </thead>
        <tbody>
          {requests.map(r => (
            <tr key={r.id}>
              <td>{r.userName}</td><td>{r.hospitalName}</td><td>{r.type}</td><td>{r.status}</td>
              <td>
                {r.status==="Pending" && <>
                  <button className="btn btn-approve" onClick={()=>updateRequestStatus(r.id,"Approved")}>Approve</button>
                  <button className="btn btn-reject" onClick={()=>updateRequestStatus(r.id,"Rejected")}>Reject</button>
                </>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Analytics Charts */}
      <h3>Analytics</h3>
      <div className="charts-grid">
        <div className="chart-card">
          <h4>Requests Trend</h4>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={requests}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="type"/>
              <YAxis/>
              <Tooltip/>
              <Line type="monotone" dataKey="status" stroke="#1e88e5"/>
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h4>Hospital Resources</h4>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={hospitals}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="name"/>
              <YAxis/>
              <Tooltip/>
              <Bar dataKey="beds" fill="#43a047"/>
              <Bar dataKey="blood" fill="#fbc02d"/>
              <Bar dataKey="oxygen" fill="#e53935"/>
              <Bar dataKey="medicines" fill="#8e24aa"/>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="chart-card">
          <h4>Site Visitors</h4>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={traffic}>
              <CartesianGrid strokeDasharray="3 3"/>
              <XAxis dataKey="date"/>
              <YAxis/>
              <Tooltip/>
              <Area type="monotone" dataKey="visitors" stroke="#00acc1" fill="#80deea"/>
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Announcements */}
      <h3>Announcements</h3>
      <div className="announcement-section">
        <input type="text" value={newAnnouncement} placeholder="Write a new announcement..." onChange={e=>setNewAnnouncement(e.target.value)}/>
        <button className="btn btn-primary" onClick={addAnnouncement}>Post</button>
      </div>
      <ul className="announcement-list">
        {announcements.map(a => <li key={a.id}>{a.message}</li>)}
      </ul>
    </div>
  );
}
