<div align="center">

# 🏥 **CareConnect**
### _Smart Emergency & Hospital Resource Management System_

> **Connecting lives, hospitals, and emergency services — instantly.**

![Firebase](https://img.shields.io/badge/Firebase-orange?logo=firebase&logoColor=white)
![Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?logo=vercel)
![JavaScript](https://img.shields.io/badge/Frontend-JavaScript-yellow?logo=javascript)
![Realtime](https://img.shields.io/badge/Realtime-Enabled-green)
![License](https://img.shields.io/badge/License-MIT-blue)

</div>

---

## 🌟 Overview

In medical emergencies, every second counts.  
**CareConnect** bridges the gap between **patients and hospitals** by providing a **real-time network** for emergency help.  

It offers:
- 🚑 **Ambulance booking**
- 🏥 **Live hospital resource tracking**
- 📊 **Admin dashboards with analytics**
- 💬 **Instant updates powered by Firebase**

CareConnect ensures that **no time is wasted when lives are on the line.**

---

## ⚙️ Tech Stack

| Category | Technologies |
|-----------|--------------|
| 💻 Frontend | React + TypeScript, CSS / Tailwind |
| 🔥 **Backend / Database** | Firebase Firestore (NoSQL) |
| ☁️ **Hosting** | Vercel |
| 📡 **Realtime Updates** | Firebase `onSnapshot()` |
| 📊 **Charts / UI** | Recharts, Custom JS Components |
| 🔐 **Auth / Security** | Firebase Authentication |
| 🧭 **Version Control** | Git & GitHub |

---

## 🚀 Features

### 👩‍⚕️ **User Dashboard**
- 🔍 Search hospitals with available **beds**, **blood**, **oxygen**, and **ambulances**  
- 🚑 Request emergency help instantly  
- 🕒 Track your previous requests  
- 🧠 See live updates as hospitals approve or fulfill requests  

### 🏥 **Hospital Dashboard**
- 📦 Manage live hospital resources:
  - Beds  
  - Blood units  
  - Oxygen cylinders  
  - Ambulance availability  
- 🔄 Syncs instantly to Firestore  
- 📨 Manage incoming user requests  

### 👨‍💼 **Admin Dashboard**
- 📈 Analyze real-time resource distribution  
- 🧾 Monitor all hospital activity  
- 🌍 Track site visitors and request stats  
- 🧹 Clear old notifications with one click  
- 🧠 Smart chart-based insights for decision-making  

---

## 🧭 System Architecture

Frontend (HTML, CSS, JS)
│
▼
Firebase Firestore ←→ Hospitals (Live Updates)
│
▼
Admin Dashboard (Realtime Analytics)

yaml
Copy code

> All dashboards are connected via **Firestore listeners**, ensuring live data without refreshes.

---

## 📊 Dashboard Insights

| Chart | Description |
|--------|--------------|
| 🏥 **Hospital Resources Chart** | Shows bed, blood, oxygen, and ambulance availability |
| 🚑 **Request Distribution Chart** | Displays how many requests are made for each resource |
| 🌍 **Visitor Analytics Chart** | Tracks total unique site visitors over time |

---

## 🔧 Setup & Installation

### 1️⃣ Clone Repository

git clone https://github.com/yourusername/careconnect.git
cd careconnect

# 2. Install dependencies
npm install

# 3. Add Firebase Configuration
# Create firebase.ts file in src/
# Copy your Firebase config here (example below)


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
3️⃣ Run Locally
bash
Copy code
npm run dev
or open index.html directly in your browser.

4️⃣ Deploy on Vercel
bash
Copy code
vercel --prod
🛡️ Security
Firebase Authentication for role-based access

Firestore security rules ensure data isolation

Validations prevent duplicate or unauthorized requests

🧩 Future Roadmap
Feature	Description
🤖 AI Triage System	Auto-prioritize requests by emergency severity
🗺️ Google Maps Integration	Track nearest available ambulances
🔔 Push Notifications	Instant request status alerts
💬 Chatbot Assistance	24/7 emergency help guidance
📱 Mobile App (React Native)	Extend CareConnect to Android/iOS

🤝 Contributing
Contributions make the community thrive! 💪
Here’s how you can help:

bash
Copy code
# 1. Fork this repo
# 2. Create your feature branch
git checkout -b feature/amazing-feature
# 3. Commit your changes
git commit -m 'Add amazing feature'
# 4. Push your branch
git push origin feature/amazing-feature
# 5. Open a Pull Request
👨‍💻 Author
🧑‍💻 Kartikey
🎓 Student | 💡 AI, ML & Competitive Programming Enthusiast
🚀 Passionate about solving real-world problems through innovation

“Every second saved in an emergency can save a life —
CareConnect is built to make those seconds count.”

