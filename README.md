# 🚀 IKGPTU-CONNECT: The "UNI-verse" Event Portal

**Live Demo:** [uni-verse-99.vercel.app](https://uni-verse-99.vercel.app/)

A high-performance, full-stack event management and student engagement platform built for **IKG Punjab Technical University**. This portal bridges the gap between students and department coordinators with a "Glassmorphism" UI and a robust PostgreSQL backbone.

---

## 📸 App Preview

<p align="center">
  <img src="https://github.com/banadhruva/UNI-verse/blob/main/client/src/assets/Capture.PNG" width="800" alt="Student Portal Desktop View">
</p>

<p align="center">
  <img src="https://github.com/banadhruva/UNI-verse/blob/main/client/src/assets/Capture2.PNG" width="250" alt="Landing Page View">
  <img src="https://github.com/banadhruva/UNI-verse/blob/main/client/src/assets/Capture3.PNG" width="250" alt="AI Chatbot Interface">
  <img src="https://github.com/banadhruva/UNI-verse/blob/main/client/src/assets/Capture4.PNG" width="250" alt="Admin Dashboard">
</p>

---

## ⚡ Key Features

- **Dynamic Event Universe**: Real-time event fetching from Supabase PostgreSQL.
- **AI-Powered Support**: Native AI Chatbot to handle student queries about event rules and dates.
- **The "Legacy Vault"**: A high-performance masonry gallery showcasing the university's rich event history.
- **Admin Command Center**: Role-based access for coordinators to manage events, image uploads, and participant lists.
- **Departmental Ecosystem**: Specialized views for **CSE, NCC, NSS, MBA, and ECE**.

---

## ⚙️ System Architecture & Flow



To ensure 100% uptime and bypass IPv6 networking constraints, the system utilizes a **Transaction Pooler (PGBouncer)**. This acts as a high-speed gateway between our Render-hosted backend and the Supabase database.

---

## 🛠️ The Tech Stack

### Frontend
* **React.js & Vite**: Optimized for speed and modern developer experience.
* **Tailwind CSS**: A custom "Ultra-Dark" glassmorphism theme with tactile UI elements.
* **Framer Motion**: Smooth entry animations and staggered list transitions.

### Backend
* **Node.js & Express**: Scalable API architecture.
* **PostgreSQL**: Relational database for structured event and registration data.
* **PGBouncer**: Crucial IPv4-to-IPv6 bridge for cloud database connectivity.

### Infrastructure
* **Vercel**: Frontend hosting on the edge network.
* **Render**: Automated CI/CD for the backend API.
* **Supabase**: Managed database with custom Row Level Security (RLS) policies.
* **Cloudinary**: High-speed CDN for optimized image delivery.

---

## 🧩 Architectural Challenges Solved

- **IPv4/IPv6 Networking**: Built a reliable bridge between IPv4-only hosting (Render) and IPv6-only database infrastructure (Supabase).
- **Encrypted Handshakes**: Configured SSL handshakes (`rejectUnauthorized: false`) for secure cross-platform data flow.
- **Security Policies**: Implemented RLS (Row Level Security) to allow public interactions while protecting sensitive coordinator data.

---

## 🚀 Installation & Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/banadhruva/UNI-verse.git
2. **Setup Environment Variables : Create a .env file in the backend root:**
 ```bash
DATABASE_URL=your_supabase_pooler_connection_string
PORT=5000
```
3. **Install & Launch**
 ```bash
npm install && npm run dev
