# 🚀 IKGPTU-CONNECT: The "UNI-verse" Event Portal

**Live Demo:** [uni-verse-99.vercel.app](https://uni-verse-99.vercel.app/)

A high-performance, full-stack event management and student engagement platform built for **IKG Punjab Technical University**. This portal bridges the gap between students and department coordinators with a "Glassmorphism" UI and a robust AI-driven backend.

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
- **AI-Powered RAG Chatbot**: Context-aware assistant using Retrieval-Augmented Generation to answer specific event and university queries.
- **The "Legacy Vault"**: A high-performance masonry gallery showcasing the university's rich event history.
- **Admin Command Center**: Role-based access for coordinators to manage events, image uploads, and participant lists.
- **Departmental Ecosystem**: Specialized views for **CSE, NCC, NSS, MBA, and ECE**.

---

## ⚙️ System Architecture & Flow



The system architecture is designed for scalability and intelligence:
1. **AI Pipeline**: Utilizes **RAG (Retrieval-Augmented Generation)** to feed university-specific event data into the model, ensuring the chatbot provides accurate, non-hallucinated info.
2. **Database Resilience**: To ensure 100% uptime and bypass IPv6 networking constraints, the system utilizes a **Transaction Pooler (PGBouncer)**. This acts as a high-speed gateway between our Render-hosted backend and the Supabase database.

---

## 🛠️ The Tech Stack

### 🤖 Artificial Intelligence & ML
* **RAG Framework**: For context-aware document and event data retrieval.
* **Hugging Face**: Powering the NLP models and embedding generation.
* **LangChain**: Orchestrating the flow between the user query, vector data, and the LLM.

### 🌐 Frontend
* **React.js & Vite**: Optimized for speed and modern developer experience.
* **Tailwind CSS**: A custom "Ultra-Dark" glassmorphism theme with tactile UI elements.
* **Framer Motion**: Smooth entry animations and staggered list transitions.

### ⚙️ Backend & Infrastructure
* **Node.js & Express**: Scalable API architecture handling AI and Auth routes.
* **PostgreSQL (Supabase)**: Relational database for structured event data.
* **PGBouncer**: Crucial IPv4-to-IPv6 bridge for cloud database connectivity.
* **Cloudinary**: High-speed CDN for optimized student/event imagery.

---

## 🧩 Architectural Challenges Solved

- **AI Contextualization**: Implemented a RAG pipeline to allow the chatbot to "read" the latest event PDF guidelines and schedules dynamically.
- **IPv4/IPv6 Networking**: Built a reliable bridge between IPv4-only hosting (Render) and IPv6-only database infrastructure (Supabase).
- **Security Policies**: Implemented RLS (Row Level Security) to allow public interactions while protecting sensitive coordinator data.

---

## 🚀 Installation & Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/banadhruva/UNI-verse.git
