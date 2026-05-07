# Smart-Complaint-Resolution-and-Escalation-System


> A full-stack MERN complaint management platform with role-based access control, automated escalation logic, multi-tier assignment workflows, and analytics dashboards — designed for institutional and organizational environments.

---

## Table of Contents

- [Overview](#overview)
- [The Problem It Solves](#the-problem-it-solves)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [System Architecture](#system-architecture)
- [Complaint Lifecycle](#complaint-lifecycle)
- [Role-Based Access Control](#role-based-access-control)
- [Escalation Logic](#escalation-logic)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [API Reference](#api-reference)
- [Future Enhancements](#future-enhancements)
- [License](#license)

---

## Overview

The **Smart Complaint Resolution and Escalation System** is a production-inspired, full-stack web application that digitizes and automates the end-to-end lifecycle of complaint management. Built on the MERN stack (MongoDB, Express.js, React, Node.js), the system provides distinct authenticated portals for students, staff, supervisors, and administrators — each with role-appropriate capabilities for submitting, reviewing, assigning, escalating, and resolving complaints.

The platform moves beyond simple ticket submission by implementing structured escalation pathways, supervisor assignment workflows, complaint status pipelines, internal comment threads, and summary analytics — making it a practical foundation for deploying complaint resolution infrastructure at scale within educational institutions, government offices, or enterprise environments.

---

## The Problem It Solves

Organizations that handle large volumes of user complaints typically face three recurring operational failures: complaints disappear into unmonitored inboxes, accountability is unclear when a case stalls, and there is no reliable mechanism to surface unresolved cases to higher authority.

This system addresses each of these failure points directly. Every complaint is logged with a persistent record, assigned to a responsible handler, and — if not resolved within the expected window — automatically escalated to a supervisor. Administrators maintain full oversight through a dashboard that surfaces active, pending, and escalated cases in one view. The structured role hierarchy ensures no complaint can remain invisible or abandoned without triggering an escalation event.

For institutions managing student grievances, HR complaint processes, or inter-departmental issue tracking, this system provides the structural guarantees that informal channels cannot.

---

## Key Features

### Authentication & Session Management
- JWT-based stateless authentication using `jsonwebtoken`
- Passwords hashed at rest using `bcryptjs` before storage
- Token issued on login, attached to all protected API requests via Authorization header
- Protected routes on both frontend (React) and backend (Express middleware)
- Automatic session expiration with client-side token invalidation

### Role-Based Access Control
- Four distinct user roles: **Admin**, **Supervisor**, **Staff**, and **Student**
- Each role exposes a different navigation set, dashboard view, and set of permitted actions
- Backend route-level middleware enforces role authorization independent of UI state
- Role assignment managed by administrators; users cannot self-escalate their own permissions

### Complaint Submission & Management
- Structured complaint form with category, description, and priority fields
- Unique complaint ID generated per submission for tracking reference
- Full CRUD support for complaints at appropriate permission levels
- Status transitions: `Submitted → Under Review → Assigned → In Progress → Resolved / Escalated`
- Complaint detail view with complete audit trail of status changes

### Assignment Workflow
- Administrators and supervisors can assign complaints to specific staff members
- Staff dashboards surface only complaints assigned to their account
- Assignment history tracked within the complaint document
- Reassignment supported with logged handoff context

### Escalation System
- Complaints unresolved beyond a configurable threshold automatically escalate
- Escalated complaints surface in a dedicated escalation queue for supervisors
- Escalation state transitions are logged with timestamps
- Supervisor-level resolution overrides restore complaint to normal processing pipeline

### Analytics Dashboard
- Summary statistics on complaint volume, resolution rates, and escalation frequency
- Status distribution breakdown across all active complaints
- Role-specific data views: administrators see system-wide metrics; supervisors see departmental data
- Visual charts and counters provide at-a-glance operational health indicators

### Comment and Discussion System
- Threaded comments attached to individual complaint records
- Role-aware comment visibility: internal staff notes separate from user-facing updates
- Timestamps and author attribution on all comments
- Supports collaborative resolution across multiple team members

### Responsive UI
- Mobile-first responsive layout across all views
- Clean, professional interface built with custom CSS
- Consistent design language across dashboards, forms, and detail views
- Accessible color contrast and clear typographic hierarchy

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| React 18 | Component-based SPA framework |
| Vite | Build tool and dev server |
| React Router | Client-side routing and protected route guards |
| Context API | Global auth state and user session management |
| Custom CSS | Styling, layout, and responsive design |
| Fetch API | HTTP communication with the backend REST API |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | HTTP server, middleware pipeline, REST routing |
| MongoDB | Document-oriented NoSQL database |
| Mongoose | ODM for schema definition and query abstraction |
| JSON Web Tokens (`jsonwebtoken`) | Stateless authentication token issuance and verification |
| bcryptjs | Password hashing with salt rounds before database storage |
| dotenv | Environment variable management |
| CORS | Cross-origin resource sharing configuration |

### Deployment & Infrastructure
| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend | Vercel Serverless / Render |
| Database | MongoDB Atlas (cloud) or local MongoDB |
| Version Control | Git / GitHub |

---

## System Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENT (React + Vite)               │
│                                                          │
│  ┌────────────┐  ┌─────────────┐  ┌──────────────────┐  │
│  │ Auth Pages │  │  Dashboards │  │  Complaint Views │  │
│  └────────────┘  └─────────────┘  └──────────────────┘  │
│                                                          │
│              Context API (AuthContext)                   │
│              React Router (Protected Routes)             │
└───────────────────────┬─────────────────────────────────┘
                        │ HTTPS / REST API (JSON)
                        │ Authorization: Bearer <JWT>
┌───────────────────────▼─────────────────────────────────┐
│                  BACKEND (Node.js + Express)              │
│                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐   │
│  │ Auth Routes │  │  Complaint   │  │  Analytics    │   │
│  │ /api/auth   │  │  Routes      │  │  Routes       │   │
│  └─────────────┘  │ /api/complaints│ │/api/analytics │   │
│                   └──────────────┘  └───────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │           Middleware Layer                          │ │
│  │  verifyToken → checkRole → requestHandler          │ │
│  └─────────────────────────────────────────────────────┘ │
└───────────────────────┬─────────────────────────────────┘
                        │ Mongoose ODM
┌───────────────────────▼─────────────────────────────────┐
│                  DATABASE (MongoDB)                       │
│                                                          │
│   Users Collection      Complaints Collection            │
│   Comments Collection   Assignments Collection           │
└─────────────────────────────────────────────────────────┘
```

The frontend communicates exclusively through a RESTful API layer. No server-side rendering occurs — the React SPA handles all view logic, with route protection enforced at the component level via `AuthContext`. The backend applies a two-layer guard: JWT verification confirms identity, and role-checking middleware confirms authorization before any controller logic executes.

---

## Complaint Lifecycle

```
[Student Submits Complaint]
          │
          ▼
    Status: SUBMITTED
          │
          ▼ (Admin/Supervisor reviews)
    Status: UNDER REVIEW
          │
          ├──────────────────────────────────┐
          ▼ (Assigned to Staff)              │ (SLA threshold exceeded)
    Status: ASSIGNED                         ▼
          │                          Status: ESCALATED
          ▼ (Staff begins work)              │
    Status: IN PROGRESS                      ▼ (Supervisor resolves)
          │                          Status: RESOLVED
          ▼ (Staff marks resolved)
    Status: RESOLVED
```

Each status transition is timestamped and stored in the complaint document, providing a complete audit trail. The submitting user can view their complaint's current status and history at any point through their personal dashboard.

---

## Role-Based Access Control

| Capability | Student | Staff | Supervisor | Admin |
|---|:---:|:---:|:---:|:---:|
| Submit complaint | ✓ | | | |
| View own complaints | ✓ | | | |
| View assigned complaints | | ✓ | | |
| Update complaint status | | ✓ | ✓ | ✓ |
| Assign complaint to staff | | | ✓ | ✓ |
| View escalation queue | | | ✓ | ✓ |
| Resolve escalated complaints | | | ✓ | ✓ |
| View all complaints | | | ✓ | ✓ |
| Access analytics dashboard | | | ✓ | ✓ |
| Manage user accounts | | | | ✓ |
| Configure system settings | | | | ✓ |

Role enforcement is applied at two independent layers — the frontend suppresses UI controls not permitted for a given role, and the backend independently validates role claims embedded in the JWT before executing any route handler. UI suppression alone is never treated as a security boundary.

---

## Escalation Logic

Escalation is the core differentiating feature of this system. When a complaint remains in `ASSIGNED` or `IN PROGRESS` status beyond a configurable SLA window without a resolution, the system transitions the complaint to `ESCALATED` status.

**Escalation triggers:**
- Complaint age exceeds threshold without status progression
- Manual escalation initiated by a supervisor reviewing stalled cases

**Escalation handling:**
- Escalated complaints appear in a dedicated supervisor queue, visually distinct from normal cases
- Supervisors receive a consolidated view of all active escalations across departments
- Supervisor resolves the escalation directly or reassigns to a different staff member
- All escalation events are logged with actor identity and timestamp

**Design rationale:** The escalation system ensures institutional accountability by guaranteeing that no complaint can remain stalled indefinitely without surfacing to a higher authority. This replicates the SLA breach escalation logic common to enterprise helpdesk platforms like ServiceNow and Zendesk.

---


---

## Project Structure

```
Smart-Complaint-Resolution-and-Escalation-System/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection setup
│   ├── controllers/
│   │   ├── authController.js      # Register, login, token issuance
│   │   ├── complaintController.js # Complaint CRUD, status transitions
│   │   ├── assignmentController.js# Staff assignment logic
│   │   ├── escalationController.js# Escalation state management
│   │   └── analyticsController.js # Aggregated metrics and statistics
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT verification
│   │   └── roleMiddleware.js      # Role-based authorization guard
│   ├── models/
│   │   ├── User.js                # User schema (role, credentials, profile)
│   │   ├── Complaint.js           # Complaint schema (status, category, history)
│   │   ├── Assignment.js          # Assignment relation (complaint ↔ staff)
│   │   └── Comment.js             # Comment schema (author, content, visibility)
│   ├── routes/
│   │   ├── authRoutes.js          # POST /api/auth/register, /api/auth/login
│   │   ├── complaintRoutes.js     # CRUD and status endpoints
│   │   ├── assignmentRoutes.js    # Assignment management endpoints
│   │   ├── escalationRoutes.js    # Escalation queue and resolution
│   │   └── analyticsRoutes.js     # Dashboard data endpoints
│   ├── .env                       # Environment variables (not committed)
│   ├── server.js                  # Express app entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── api/
│   │   │   └── axiosInstance.js   # Configured Axios client with auth headers
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── ProtectedRoute.jsx # Role-aware route guard component
│   │   │   ├── ComplaintCard.jsx
│   │   │   ├── StatusBadge.jsx
│   │   │   └── CommentThread.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx    # Global auth state, login/logout handlers
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx
│   │   │   ├── LoginPage.jsx
│   │   │   ├── RegisterPage.jsx
│   │   │   ├── StudentDashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   ├── SupervisorDashboard.jsx
│   │   │   ├── StaffDashboard.jsx
│   │   │   ├── ComplaintDetail.jsx
│   │   │   ├── SubmitComplaint.jsx
│   │   │   ├── EscalationQueue.jsx
│   │   │   └── AnalyticsDashboard.jsx
│   │   ├── styles/
│   │   │   └── *.css              # Component and page stylesheets
│   │   ├── App.jsx                # Route definitions
│   │   └── main.jsx               # React entry point
│   ├── vite.config.js
│   └── package.json
│
├── .gitignore
├── LICENSE
├── package.json                   # Root-level shared dependencies
└── README.md
```

---

## Getting Started

### Prerequisites

Ensure the following are installed on your machine:

- Node.js v18 or later
- npm v9 or later
- MongoDB (local instance) or a MongoDB Atlas account
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/codeslayerpdx/Smart-Complaint-Resolution-and-Escalation-System.git
cd Smart-Complaint-Resolution-and-Escalation-System
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory (see [Environment Variables](#environment-variables) below).

Start the backend server:

```bash
npm run dev      # Development with nodemon
# or
npm start        # Production
```

The API server will start on `http://localhost:5000` by default.

### 3. Frontend Setup

Open a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The React development server will start on `http://localhost:5173`.

### 4. MongoDB Setup

**Option A — Local MongoDB:**
Ensure your local MongoDB instance is running:
```bash
mongod --dbpath /your/data/path
```
Set `MONGO_URI=mongodb://localhost:27017/complaint_system` in your `.env`.

**Option B — MongoDB Atlas:**
1. Create a free cluster at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Whitelist your IP address
3. Create a database user
4. Copy the connection string into your `.env` as `MONGO_URI`

---

## Environment Variables

Create a `.env` file in the `backend/` directory with the following configuration:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/complaint_system?retryWrites=true&w=majority

# Authentication
JWT_SECRET=your_strong_random_jwt_secret_key_here
JWT_EXPIRES_IN=7d

# CORS
CLIENT_URL=http://localhost:5173

# Escalation Settings (in hours)
ESCALATION_THRESHOLD_HOURS=48
```

For production deployment, set these as environment variables in your hosting platform (Vercel, Render, Railway, etc.) — never commit `.env` files to version control.

Create a `.env` file in the `frontend/` directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
```

---

## API Reference

All protected endpoints require the `Authorization: Bearer <token>` header.

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/auth/register` | Public | Register new user with role |
| `POST` | `/api/auth/login` | Public | Authenticate and receive JWT |
| `GET` | `/api/auth/me` | Authenticated | Get current user profile |

### Complaints

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/complaints` | Student | Submit a new complaint |
| `GET` | `/api/complaints` | Admin, Supervisor | Retrieve all complaints |
| `GET` | `/api/complaints/my` | Student | Retrieve own complaints |
| `GET` | `/api/complaints/assigned` | Staff | Retrieve assigned complaints |
| `GET` | `/api/complaints/:id` | Authenticated | Get complaint by ID |
| `PATCH` | `/api/complaints/:id/status` | Staff, Supervisor, Admin | Update complaint status |
| `DELETE` | `/api/complaints/:id` | Admin | Remove a complaint record |

### Assignments

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/assignments` | Supervisor, Admin | Assign complaint to staff member |
| `GET` | `/api/assignments/:complaintId` | Supervisor, Admin | Get assignment record for complaint |
| `PATCH` | `/api/assignments/:id` | Supervisor, Admin | Reassign to different staff member |

### Escalations

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/escalations` | Supervisor, Admin | Retrieve all escalated complaints |
| `PATCH` | `/api/escalations/:id/resolve` | Supervisor, Admin | Resolve an escalated complaint |
| `POST` | `/api/escalations/:id/trigger` | Admin | Manually trigger escalation |

### Comments

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `POST` | `/api/complaints/:id/comments` | Authenticated | Add comment to complaint |
| `GET` | `/api/complaints/:id/comments` | Authenticated | Retrieve comment thread |

### Analytics

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| `GET` | `/api/analytics/summary` | Supervisor, Admin | Overall complaint statistics |
| `GET` | `/api/analytics/by-status` | Supervisor, Admin | Complaint count grouped by status |
| `GET` | `/api/analytics/by-category` | Supervisor, Admin | Complaint count grouped by category |
| `GET` | `/api/analytics/resolution-rate` | Admin | Resolution rate over time |

---

## Future Enhancements

The current implementation establishes a solid operational foundation. The following represent logical next steps toward a production-grade, enterprise-ready system:

**Real-Time Notifications**
WebSocket integration (Socket.io) to push live status updates to users when their complaint is assigned, escalated, or resolved — eliminating the need to manually refresh the dashboard.

**Email Notification Pipeline**
Nodemailer or SendGrid integration to dispatch automated emails at key lifecycle events: complaint received, assignment notification to staff, escalation alert to supervisor, and resolution confirmation to submitter.

**AI-Assisted Complaint Categorization**
Integrate a lightweight NLP classifier (via OpenAI API or a trained model) to automatically suggest complaint category and urgency level based on the submitted description text, reducing manual triage time.

**SLA Engine with Custom Thresholds**
Configurable SLA rules per complaint category or department, with automated escalation triggers based on time-in-status rather than a single global threshold. Includes SLA breach reporting in the analytics dashboard.

**File Attachment Support**
Allow users to attach supporting evidence (screenshots, documents) to complaints using Cloudinary or AWS S3 for storage, with secure signed URL access for reviewers.

**Audit Log**
An immutable, append-only log of every action taken on every complaint: who changed what status, when, and from which IP address. Critical for compliance in regulated environments.

**Advanced Analytics**
Trend analysis over rolling time windows, staff performance metrics (average resolution time per staff member), complaint heatmaps by department, and exportable PDF/CSV reports for leadership review.

**Two-Factor Authentication**
TOTP-based 2FA for administrator and supervisor accounts, reducing exposure from credential compromise.

**Multi-Tenant Architecture**
Namespace isolation per organization, enabling the platform to serve multiple institutions from a single deployment with data segregation at the database level.

---

## Database Schema Overview

### User
```
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: Enum ['student', 'staff', 'supervisor', 'admin'],
  department: String,
  createdAt: Date
}
```

### Complaint
```
{
  title: String,
  description: String,
  category: String,
  priority: Enum ['low', 'medium', 'high'],
  status: Enum ['submitted', 'under_review', 'assigned', 'in_progress', 'resolved', 'escalated'],
  submittedBy: ObjectId (ref: User),
  assignedTo: ObjectId (ref: User),
  statusHistory: [{ status, changedBy, changedAt }],
  escalatedAt: Date,
  resolvedAt: Date,
  createdAt: Date,
  updatedAt: Date
}
```

### Comment
```
{
  complaint: ObjectId (ref: Complaint),
  author: ObjectId (ref: User),
  content: String,
  isInternal: Boolean,
  createdAt: Date
}
```

---

## License

This project is licensed under the [MIT License](./LICENSE).

---

> Built with the MERN stack as a portfolio and academic capstone project demonstrating full-stack development proficiency, RESTful API design, JWT authentication patterns, role-based authorization, and structured complaint lifecycle management.
