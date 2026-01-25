# 🚀 IKGPTU-CONNECT: The "Uni-Verse" Event Portal

**Live Demo:** [uni-verse-99.vercel.app](https://uni-verse-99.vercel.app/)

A high-performance, full-stack event management and student engagement platform built for **IKG Punjab Technical University**. This portal bridges the gap between students and department coordinators with a "Glassmorphism" UI and a robust PostgreSQL backbone.

---

## ⚡ Key Features

- **Dynamic Event Universe**: Real-time event fetching from Supabase PostgreSQL.
- **AI-Powered Support**: Native AI Chatbot to handle student queries about event rules and dates.
- **The "Legacy Vault"**: A high-performance masonry gallery showcasing the university's rich event history.
- **Admin Command Center**: Role-based access for coordinators to manage events, image uploads, and participant lists.
- **Departmental Ecosystem**: Specialized views for **CSE, NCC, NSS, MBA, and ECE**.

---

## 🛠️ The Tech Stack

### Frontend (The Visuals)
* **React.js & Vite**: Optimized for speed and modern developer experience.
* **Tailwind CSS**: A custom "Ultra-Dark" glassmorphism theme with tactile UI elements.
* **Framer Motion**: Smooth entry animations and staggered list transitions.

### Backend (The Brains)
* **Node.js & Express**: Scalable API architecture.
* **PostgreSQL**: Relational database for structured event and registration data.
* **PGBouncer (Session Pooling)**: Crucial IPv4-to-IPv6 bridge for cloud database connectivity.

### Infrastructure & DevOps
* **Vercel**: Frontend hosting on the edge network.
* **Render**: Automated CI/CD for the backend API.
* **Supabase**: Managed database with custom Row Level Security (RLS) policies.
* **Cloudinary**: High-speed CDN for optimized student/event imagery.

---

## 🧩 Architectural Challenges Solved

This project successfully tackled several industry-standard deployment hurdles:

1.  **IPv4/IPv6 Networking**: Built a reliable bridge between IPv4-only hosting (Render) and IPv6-only database infrastructure (Supabase) using **Session Pooling**.
2.  **Encrypted Handshakes**: Configured strict SSL handshakes (`rejectUnauthorized: false`) for secure cross-platform data flow.
3.  **Authentication Sync**: Solved complex "Tenant not found" and URI-encoding issues related to PostgreSQL connection strings.
4.  **Security Policies**: Implemented RLS (Row Level Security) to allow public interactions while protecting sensitive coordinator data.

---

## 🚀 Installation & Local Development

1. **Clone the repository**
   ```bash
   git clone [https://github.com/](https://github.com/)[YOUR_USERNAME]/ikgptu-connect.git
