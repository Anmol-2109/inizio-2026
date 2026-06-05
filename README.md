# INIZIO 2026 – Entrepreneurship Summit Platform

🚀 Overview

INIZIO 2026 is the official event management platform developed for the Entrepreneurship Summit (E-Summit) organized by the Innovation & Entrepreneurship Cell, IIIT Guwahati.

The platform was designed to handle large-scale event registrations, team management, notifications, submissions, and participant engagement while maintaining scalability, security, and maintainability.

Built as a full-stack application, INIZIO provides a seamless experience for participants, organizers, and administrators through a modern React frontend and a robust Django REST backend.

---

## ✨ Features

### Authentication & Security

* JWT-based Authentication
* Email OTP Verification
* OTP-based Password Recovery
* Secure Password Hashing
* Refresh Token Authentication
* Session Management
* Custom User Model

### User Management

* User Registration & Login
* Profile Completion Workflow
* College & Department Information
* Role-Based Access Control
* Admin Dashboard Access

### Event Management

* Dynamic Event Creation
* Event Details & Rules
* Event Scheduling
* Registration Windows
* Event Images & Metadata
* Dynamic Event Information Fields

### Team Registration System

* Team Creation
* Team Leader Controls
* Email-based Team Invitations
* Invitation Acceptance Workflow
* Team Size Validation
* Team Membership Tracking

### Notifications

* Real-Time In-App Notifications
* Firebase Push Notifications (FCM)
* Event Announcement Notifications
* Reminder Notifications
* Event Start Alerts

### Submission System

* Dynamic Submission Forms
* Custom Event Fields
* File & URL Submission Support
* Team-Based Submissions
* Submission Tracking

### Background Processing

* Celery Task Queue
* Redis Broker
* Asynchronous Email Delivery
* Scheduled Cleanup Jobs
* Event Reminder Scheduler

### Admin Features

* Event Management Dashboard
* Submission Monitoring
* Notification Management
* Google Sheets Export
* User Management

---

## 🏗️ System Architecture

```text
┌─────────────────────────────┐
│       React Frontend        │
│  React • Axios • Router     │
└──────────────┬──────────────┘
               │
               │ REST APIs
               ▼
┌─────────────────────────────┐
│      Django REST API        │
│ Authentication • Events     │
│ Teams • Notifications       │
└───────┬─────────┬───────────┘
        │         │
        │         │
        ▼         ▼
┌────────────┐ ┌────────────┐
│ PostgreSQL │ │   Redis    │
│ Database   │ │ Cache/Queue│
└──────┬─────┘ └──────┬─────┘
       │              │
       │              ▼
       │      ┌────────────┐
       │      │   Celery   │
       │      │ Background │
       │      │   Tasks    │
       │      └─────┬──────┘
       │            │
       ▼            ▼
┌────────────┐ ┌───────────────┐
│ Resend API │ │ Firebase FCM  │
│ OTP Emails │ │ Push Alerts   │
└────────────┘ └───────────────┘
```

### Request Flow

```text
User
 │
 ▼
React Frontend
 │
 ▼
Django REST API
 │
 ├── JWT Authentication
 │
 ├── PostgreSQL
 │
 ├── Redis Queue
 │      │
 │      ▼
 │   Celery Workers
 │      │
 │      ├── OTP Emails
 │      ├── Team Invites
 │      ├── Event Reminders
 │      └── Cleanup Tasks
 │
 └── Firebase Cloud Messaging
         │
         ▼
   Push Notifications
```
---

## 🛠️ Tech Stack

| Category                    | Technologies                                                 |
| --------------------------- | ------------------------------------------------------------ |
| **Frontend**                | React.js, JavaScript, HTML5, CSS3, Axios, React Router       |
| **Backend**                 | Django, Django REST Framework (DRF), Simple JWT              |
| **Database**                | PostgreSQL                                                   |
| **Asynchronous Processing** | Celery, Redis                                                |
| **Authentication**          | JWT Authentication, Email OTP Verification |
| **Notifications**           | Firebase Cloud Messaging (FCM), In-App Notifications         |
| **Email Services**          | Resend Email API                                             |
| **Data Export**             | Google Sheets Integration                                    |
| **Deployment**              | Railway                                                      |
| **Cloud Services**          | PostgreSQL, Redis Cloud                                      |
| **Version Control**         | Git, GitHub                                                  |

---

## 🚀 Key Engineering Components

| Component                 | Purpose                                  |
| ------------------------- | ---------------------------------------- |
| Custom User Model         | Email-based authentication system        |
| OTP Verification          | Secure account activation                |
| Password Recovery         | OTP-based password reset workflow        |
| Team Registration System  | Multi-member event registration          |
| Invitation Workflow       | Email-based team joining mechanism       |
| Event Submission Engine   | Dynamic form & submission management     |
| Notification Service      | Real-time in-app notifications           |
| Push Notification Service | Firebase Cloud Messaging integration     |
| Background Task Queue     | Celery-powered asynchronous processing   |
| Data Export System        | Google Sheets integration for organizers |
| Role-Based Access Control | User/Admin permission management         |

```
```

---

## ⚙️ Backend Setup

### Prerequisites

* Python 3.11+
* PostgreSQL
* Redis

### Clone Repository

```bash
git clone https://github.com/Anmol-2109/inizio-2026.git

cd inizio-2026
```

### Create Virtual Environment

```bash

python -m venv venv

# mac-os

source venv/bin/activate

# Windows

venv\Scripts\activate
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Configure Environment Variables

Create a `.env` file:

```env
SECRET_KEY=your_secret_key

DEBUG=True

DATABASE_URL=postgresql://user:password@localhost:5432/inizio

REDIS_URL=redis://localhost:6379

RESEND_API_KEY=your_resend_key

GOOGLE_CLIENT_ID=your_google_client_id

FIREBASE_KEY_PATH=serviceAccountKey.json

FRONTEND_BASE_URL=http://localhost:5173
```

### Apply Migrations

```bash
python manage.py migrate
```

### Create Superuser

```bash
python manage.py createsuperuser
```

### Run Backend

```bash
python manage.py runserver
```

Backend:

```text
http://127.0.0.1:8000
```

---

## ⚙️ Celery Setup

Start Redis:

```bash
redis-server
```

Run Celery Worker:

```bash
celery -A config worker --loglevel=info
```

Run Celery Beat:

```bash
celery -A config beat --loglevel=info
```

---

## 💻 Frontend Setup

Navigate to frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Run development server:

```bash
npm run dev
```

Frontend:

```text
http://localhost:5173
```

---

## 🔑 API Highlights

### Authentication

```http
POST /api/accounts/register/
POST /api/accounts/verify-otp/
POST /api/accounts/login/
POST /api/accounts/logout/
POST /api/accounts/google-login/
```

### Password Recovery

```http
POST /api/accounts/forgot-password/
POST /api/accounts/verify-reset-otp/
POST /api/accounts/reset-password/
```

### Events

```http
GET /api/events/
GET /api/events/<slug>/
POST /api/events/register/
```

### Teams

```http
POST /api/events/team/create/
POST /api/events/invite/
GET /api/events/team/<id>/
```

---


## 🤝 Contributing

Contributions are welcome.

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature/NewFeature
```

3. Commit changes

```bash
git commit -m "Add New Feature"
```

4. Push changes

```bash
git push origin feature/NewFeature
```

5. Open a Pull Request

---

## 👨‍💻 About the Developer

### [Anmol Kumar](https://github.com/Anmol-2109)

Technical Head, Innovation & Entrepreneurship Cell (I&E Cell), IIIT Guwahati

Developer of **INIZIO 2026**, the official Entrepreneurship Summit (E-Summit) platform of IIIT Guwahati.

This project was built to provide a scalable solution for event registrations, team management, notifications, submissions, and participant engagement for large-scale college events.

```
