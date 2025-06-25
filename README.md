# 🧠 SmartBrief AI – AI-Powered Content Summarization SaaS

SmartBrief AI is a production-grade SaaS platform that allows users to summarize content and documents using OpenAI's GPT models. It supports intelligent job queuing, role-based access, secure cookie-based authentication, and a scalable architecture built with the MERN stack.

---

## 🔗 Live URLs

| Service     | URL                                       |
|-------------|-------------------------------------------|
| 🔥 Frontend | [smartbrief.vercel.app](https://smartbrief.vercel.app) |
| 🚀 Backend  | [smartbrief-api](https://smartbrief-ai.onrender.com) |

---

## 🧠 Features

### ✍️ Content Summarization
- Summarize **raw text** or **uploaded files** (`.docx`, `.txt`)
- Optional custom prompts to guide the summary

### 📁 File & Buffer Handling
- Extracts content from uploaded `.docx` or `.txt` files using `mammoth` and `file-type`

### 🚦 Background Job Queue with BullMQ
- All summaries are processed asynchronously using **BullMQ** and **Redis**
- Summarization jobs are queued, processed in the background, and status is tracked by job ID
- This ensures non-blocking, scalable performance

### 📦 Redis Cache (Performance)
- Summaries are cached in Redis to avoid redundant OpenAI calls
- If a user submits the same text, cached result is returned instantly

### 👥 Role-Based Access Control (RBAC)

| Role       | Permissions |
|------------|-------------|
| **User**   | Create & manage own summaries |
| **Admin**  | Manage all summaries, recharge users, manage users |
| **Editor** | Edit/delete any user's summary |
| **Reviewer** | View all summaries (read-only) |

---

## 🧱 Tech Stack

| Layer       | Tech                                |
|-------------|-------------------------------------|
| Frontend    | React, Vite, Tailwind CSS, RTK Query |
| Backend     | Node.js, Express                    |
| Database    | MongoDB Atlas                       |
| Auth        | Cookie-based sessions (`httpOnly`)  |
| AI Model    | Gemini API                  |
| Queue       | BullMQ + Redis Cloud                |
| Cache       | Redis Cloud                         |
| Deployment  | Vercel (Frontend) + Render (Backend)|

---

## 🛠️ Installation & Development

### 🔐 Backend `.env` Example

```env
MONGO_URI=mongodb+srv://<your-cluster>
REDIS_URL=rediss://:<password>@<redis-url>
OPENAI_API_KEY=sk-...
PORT=8080
ORIGIN=https://smartbrief.vercel.app
