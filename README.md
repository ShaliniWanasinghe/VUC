# 🎓 VUC — Vavuniya University Connect

A full-stack **Digital Notice Board** application built for university environments. VUC enables administrators and moderators to publish notices across categories, while students can browse, filter, and stay informed — all through a modern, responsive web interface.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Prerequisites](#-prerequisites)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [User Roles](#-user-roles)
- [Database Seeding](#-database-seeding)
- [Screenshots](#-screenshots)
- [License](#-license)

---

## ✨ Features

- **JWT Authentication** — Secure login & registration with bcrypt password hashing
- **Role-Based Access Control** — Three roles: `admin`, `moderator`, `student`
- **Notice Management** — Full CRUD operations for creating, editing, and deleting notices
- **Approval Workflow** — Notices go through a `pending → published / rejected` pipeline
- **Category Filtering** — Browse notices by categories: Academic, Sports, Clubs & Societies, Welfare, Marketplace, Lost & Found, Donations, Hostel & Accommodation
- **Pending Notices Queue** — Dedicated admin view for approving or rejecting notices
- **User Profiles** — View and manage user profile information
- **Responsive Design** — Modern UI with Tailwind CSS, Framer Motion animations, and Lucide icons
- **Toast Notifications** — Real-time feedback using React Hot Toast

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 19 | UI library |
| Vite 7 | Build tool & dev server |
| Tailwind CSS 4 | Utility-first styling |
| React Router 7 | Client-side routing |
| Axios | HTTP client |
| Framer Motion | Animations |
| Lucide React | Icon library |
| React Hot Toast | Toast notifications |

### Backend
| Technology | Purpose |
|---|---|
| Node.js + Express 4 | REST API server |
| MongoDB + Mongoose 8 | Database & ODM |
| JSON Web Tokens | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email utilities |
| dotenv | Environment config |
| CORS | Cross-origin support |

---

## 📁 Project Structure

```
VUC_project/
├── client/                     # Frontend (React + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── api/                # Axios API configuration
│   │   ├── components/         # Reusable UI components
│   │   │   ├── CreateNotice.jsx
│   │   │   ├── EditNotice.jsx
│   │   │   ├── NoticeList.jsx
│   │   │   ├── Header.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Navbar.jsx
│   │   │   ├── Layout.jsx
│   │   │   └── ProtectedRoute.jsx
│   │   ├── context/            # React context (AuthContext)
│   │   ├── pages/              # Route-level pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   ├── PendingNotices.jsx
│   │   │   └── StudentServices.jsx
│   │   ├── App.jsx             # Root component & routes
│   │   ├── main.jsx            # Entry point
│   │   └── index.css           # Global styles
│   ├── index.html
│   ├── vite.config.js
│   └── package.json
│
├── server/                     # Backend (Express + MongoDB)
│   ├── config/
│   │   └── db.js               # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js   # Login & register logic
│   │   └── noticeController.js # Notice CRUD & status updates
│   ├── middleware/
│   │   └── authMiddleware.js   # JWT auth & role checks
│   ├── models/
│   │   ├── User.js             # User schema (userId, name, email, role)
│   │   └── Notice.js           # Notice schema (title, content, category, status)
│   ├── routes/
│   │   ├── authRoutes.js       # POST /login, /register
│   │   └── noticeRoutes.js     # CRUD + status endpoints
│   ├── utils/                  # Utility helpers
│   ├── seed.js                 # Database seeding script
│   ├── server.js               # Express app entry point
│   └── package.json
│
├── .gitignore
└── README.md
```

---

## 📦 Prerequisites

- **Node.js** v18 or higher
- **npm** v9 or higher
- **MongoDB Atlas** account (or a local MongoDB instance)

---

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/VUC_project.git
cd VUC_project
```

### 2. Setup the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (see [Environment Variables](#-environment-variables)).

```bash
# Start the development server
npm run dev
```

The API server will start on **http://localhost:5000**.

### 3. Setup the Frontend

```bash
cd client
npm install
```

Create a `.env` file in the `client/` directory:

```env
VITE_API_URL=http://localhost:5000/api
```

```bash
# Start the development server
npm run dev
```

The client will start on **http://localhost:5173**.

### 4. Seed the Database (Optional)

```bash
cd server
npm run seed
```

This populates the database with sample users and notices for testing.

---

## 🔐 Environment Variables

### Server (`server/.env`)

| Variable | Description | Example |
|---|---|---|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/vuc` |
| `JWT_SECRET` | Secret key for JWT signing | `your_jwt_secret_key` |

### Client (`client/.env`)

| Variable | Description | Example |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |

---

## 📡 API Endpoints

### Authentication

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `POST` | `/api/auth/register` | Register a new user | Public |
| `POST` | `/api/auth/login` | Login & receive JWT | Public |

### Notices

| Method | Endpoint | Description | Access |
|---|---|---|---|
| `GET` | `/api/notices` | Get all notices (filtered by role) | Authenticated |
| `GET` | `/api/notices/:id` | Get a single notice | Authenticated |
| `POST` | `/api/notices` | Create a new notice | Admin, Moderator |
| `PUT` | `/api/notices/:id` | Update a notice | Admin, Moderator |
| `PATCH` | `/api/notices/:id/status` | Approve / reject a notice | Admin only |
| `DELETE` | `/api/notices/:id` | Delete a notice | Admin, Moderator |

---

## 👥 User Roles

| Role | Permissions |
|---|---|
| **Admin** | Full access — create, edit, delete, approve/reject notices, manage all content |
| **Moderator** | Create, edit, and delete notices (subject to approval workflow) |
| **Student** | View published notices only |

### User ID Format

User IDs follow the university registration pattern:

```
Year/Course/RegNo — e.g., 2021/ICT/075
```

---

## 🗂 Notice Categories

| Category |
|---|
| Academic |
| Sports |
| Clubs & Societies |
| Welfare & Student Services |
| Marketplace |
| Lost & Found |
| Donations |
| Hostel & Accommodation |

---

## 🌱 Database Seeding

Run the seed script to populate the database with test data:

```bash
cd server
npm run seed
```

This creates sample users (admin, moderator, student) and notices across various categories, useful for development and testing.

---

## 📸 Screenshots

<img width="1919" height="1039" alt="Student Dashboard" src="https://github.com/user-attachments/assets/5cf6b3bb-c0a7-4991-8c50-efb494f07aa3" />

<img width="1919" height="934" alt="admin approve" src="https://github.com/user-attachments/assets/a52f96c3-77dc-4ca0-b2e3-85e410d02d6f" /><img width="1909" height="795" alt="Screenshot 2026-02-10 124730" src="https://github.com/user-attachments/assets/52b2b1af-bc7e-49c4-9998-e1afc8a1a23c" />

<img width="1919" height="934" alt="admin approve" src="https://github.com/user-attachments/assets/88888c2d-6f69-4a25-813c-fda80fafcde2" />
<img width="1914" height="913" alt="ad dashboard" src="https://github.com/user-attachments/assets/2efc102b-cbf3-4938-b570-1a58b4c1adc8" />


---

## 📄 License

This project is licensed under the **ISC License**.


