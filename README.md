# 🚀 IKGPTU-CONNECT: The "Uni-Verse" Event Portal

A high-performance, full-stack event management and student engagement platform built for **IKG Punjab Technical University**. Designed with a "Glassmorphism" UI aesthetic and a robust server-side architecture.



---

## ⚡ Features

- **Dynamic Event Universe**: Real-time event fetching from Supabase PostgreSQL.
- **AI-Powered Support**: Integrated Chatbot for instant query resolution.
- **The "Legacy Vault"**: A high-performance masonry gallery for past event memories.
- **Admin Command Center**: Role-based access to manage events, images, and applications.
- **Departmental Logic**: Filtered views for CSE, NCC, NSS, MBA, and ECE.

---

## 🛠️ The Tech Stack

### Frontend (The Visuals)
* **React.js & Vite**: For lightning-fast development and optimized builds.
* **Tailwind CSS**: Custom "Ultra-Dark" theme with glassmorphism effects.
* **Framer Motion**: Smooth animations and staggered list transitions.
* **Lucide React**: For clean, minimalist iconography.

### Backend (The Brains)
* **Node.js & Express**: Handling complex routing and middleware.
* **PostgreSQL**: Relational data management for events and student registrations.
* **PGBouncer (Session Pooling)**: Optimized IPv4-to-IPv6 bridge for high-concurrency database connections.

### Infrastructure & DevOps
* **Supabase**: Managed Database & Storage buckets with custom RLS (Row Level Security) policies.
* **Render**: Automated CI/CD for the backend server.
* **Vercel**: Edge-network hosting for the frontend.
* **Cloudinary**: Image optimization and CDN delivery.

---

## 🧩 Architectural Challenges Solved

This project was a masterclass in modern deployment hurdles. We successfully navigated:

1.  **The IPv6 Barrier**: Bridging the gap between IPv4-only hosting (Render) and IPv6-only databases (Supabase) using specialized **Session Poolers**.
2.  **CORS & SSL Encryption**: Implementing `rejectUnauthorized: false` for secure, encrypted database handshakes across different cloud providers.
3.  **URL Encoding**: Managing complex connection strings with special characters via URI encoding.
4.  **RLS Policies**: Crafting custom SQL policies to allow public uploads while maintaining database integrity.

---

## 🚀 Getting Started

1. **Clone the Repo**
   ```bash
   git clone [https://github.com/](https://github.com/)[YOUR_USERNAME]/ikgptu-connect.git
