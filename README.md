<div align="center">

<img src="https://img.icons8.com/color/96/000000/hospital-room.png" width="100" />

# 🏥 **CareConnect**
### _Smart Emergency & Hospital Resource Management Platform_

> **Saving lives through technology — bridging patients, hospitals, and emergency services in real time.**

[![Firebase](https://img.shields.io/badge/Backend-Firebase-orange?logo=firebase&logoColor=white)](https://firebase.google.com/)
[![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)](https://vercel.com/)
![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue?logo=react)
![Realtime](https://img.shields.io/badge/Realtime-Enabled-green)
![License](https://img.shields.io/badge/License-MIT-blue)

---

### 🔗 **Live Demo:** [care-connect-project.vercel.app](https://care-connect-project.vercel.app)

</div>

---

## 🧠 Introduction

In critical medical emergencies, **every second matters**.  
**CareConnect** is an intelligent healthcare network designed to **connect patients with hospitals instantly**, ensuring **no life is lost due to delay**.

It enables:
- 🚑 **Instant ambulance booking**
- 🏥 **Real-time hospital resource tracking**
- 📊 **Analytics dashboards for hospitals & admins**
- 💬 **Instant communication powered by Firebase**

CareConnect isn’t just an app — it’s a **life-saving infrastructure** built for speed, reliability, and accessibility.

---

## 🧩 Tech Stack

| Layer | Technologies |
|-------|---------------|
| 🎨 **Frontend** | React + TypeScript, Tailwind CSS |
| 🔥 **Backend / Database** | Firebase Firestore (NoSQL) |
| 🔐 **Authentication** | Firebase Auth (Email / Role-based) |
| ☁️ **Hosting** | Vercel |
| 📡 **Realtime Engine** | Firebase `onSnapshot()` listeners |
| 📊 **Visualization** | Recharts, Custom JS Components |
| ⚙️ **Version Control** | Git & GitHub |

---

## 🚀 Key Features

### 👩‍⚕️ **User Dashboard**
- 🔍 Search hospitals with live **beds**, **blood**, **oxygen**, and **ambulance** data  
- 🚨 Book emergency help instantly  
- 🧠 Track requests in real-time (status auto-updates)  
- 📜 Access complete request history  

### 🏥 **Hospital Dashboard**
- ⚙️ Manage & update live resources (beds, blood units, oxygen cylinders, ambulances)
- 🔁 Changes reflected instantly through Firestore listeners  
- 📥 Handle and respond to incoming emergency requests  

### 🧑‍💼 **Admin Dashboard**
- 📈 Get live analytics of all connected hospitals  
- 🌍 Monitor total requests, visitors, and hospital performance  
- 🧹 One-click cleanup of old notifications  
- 📊 Smart visual charts for resource and request distribution  

---

## 📊 Analytics & Insights

| Visualization | Purpose |
|----------------|----------|
| 🏥 **Hospital Resource Chart** | Displays live counts of beds, blood, oxygen, and ambulances |
| 🚑 **Request Distribution** | Shows which resources are most requested |
| 🌍 **Visitor Analytics** | Tracks live and historical traffic trends |
| 📈 **Admin Insights** | Provides hospital-wide operational overview |

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/careconnect.git
cd careconnect
2️⃣ Install Dependencies
bash
Copy code
npm install
3️⃣ Add Firebase Configuration
Create a firebase.ts (or firebaseConfig.js) file inside src/ and add:

ts
Copy code
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_KEY",
  authDomain: "YOUR_APP.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_BUCKET",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
4️⃣ Run Locally
bash
Copy code
npm run dev
Then visit http://localhost:5173/ (Vite default).

5️⃣ Deploy on Vercel
bash
Copy code
vercel --prod
🛡️ Security
🔒 Firebase Authentication for user, hospital & admin roles

🧱 Firestore Security Rules to isolate and protect data

✅ Validation Layers prevent unauthorized or duplicate requests

🧭 Roadmap
Feature	Description	Status
🤖 AI Triage System	Auto-prioritize emergency requests by severity	🔜 Planned
🗺️ Google Maps Integration	Show nearby ambulances & hospitals on map	🔜 In Progress
🔔 Push Notifications	Real-time status alerts via Firebase Cloud Messaging	⏳ Pending
💬 AI Chatbot Assistant	24/7 smart emergency help guide	🔜 Planned
📱 Mobile App (React Native)	Expand platform to Android/iOS	🚧 Upcoming

🤝 Contributing
Contributions are always welcome! 🙌

bash
Copy code
# 1. Fork the repository
# 2. Create your feature branch
git checkout -b feature/amazing-feature

# 3. Commit your changes
git commit -m 'Add amazing feature'

# 4. Push your branch
git push origin feature/amazing-feature

# 5. Open a Pull Request
Please ensure all contributions align with project goals and coding standards.

👨‍💻 Author
🧑‍💻 Kartikey
🎓 Student | 💡 AI, ML & Competitive Programming Enthusiast
🚀 Passionate about building tech that saves lives

“Every second saved in an emergency can save a life —
CareConnect is built to make those seconds count.”

<div align="center">
🩺 Built with ❤️, Code, and Care for a Healthier Tomorrow.



</div> ```