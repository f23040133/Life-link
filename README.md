# LifeLink - Digital Blood Donation Platform

LifeLink is a premium, AI-powered web application designed to bridge the gap between blood donors, hospitals, and medical specialists. It utilizes a modern tech stack to provide a seamless, interactive, and life-saving user experience.

## 🚀 Technology Stack

### Frontend (Implemented)
- **Framework:** React.js (v18+)
- **Language:** TypeScript
- **Styling:** Tailwind CSS (Glassmorphism Design System)
- **Icons:** Lucide React
- **Build Tool:** Vite
- **AI Integration:** Google Gemini API (`gemini-2.5-flash`) via `@google/genai`

### Backend (Architecture Specification)
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (NoSQL)
- **Authentication:** JWT (JSON Web Tokens)
- **Real-Time Engine:** Socket.io

---

## 💾 Database Schema Design (MongoDB)

The backend is designed around the following collections:

### 1. `Users` Collection
Stores donor, hospital, and admin profiles.
```json
{
  "_id": "ObjectId",
  "name": "String",
  "email": "String",
  "password_hash": "String",
  "role": "Enum('DONOR', 'HOSPITAL', 'ADMIN')",
  "bloodType": "String (Optional)",
  "location": "String",
  "stats": {
    "totalDonations": "Number",
    "livesSaved": "Number"
  }
}
```

### 2. `Centers` Collection
Stores locations of blood donation camps and hospitals.
```json
{
  "_id": "ObjectId",
  "name": "String",
  "address": "String",
  "coordinates": { "lat": "Number", "lng": "Number" },
  "operatingHours": "String"
}
```

### 3. `Appointments` Collection
Manages doctor bookings and donation slots.
```json
{
  "_id": "ObjectId",
  "userId": "ObjectId (Ref: Users)",
  "doctorId": "ObjectId (Ref: Users)",
  "date": "Date",
  "status": "Enum('PENDING', 'CONFIRMED', 'COMPLETED')"
}
```

---

## 🔌 API Endpoints (RESTful)

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate user and return JWT
- `GET /api/auth/me` - Get current user profile

### Blood Donation
- `GET /api/centers` - List all donation centers based on location
- `POST /api/appointments/book` - Schedule a donation or doctor visit
- `GET /api/donors/search` - (Hospital Only) Filter donors by Blood Type & Location

### AI Assistant
- `POST /api/chat/message` - Proxy endpoint for Gemini API interactions

---

## ✨ Key Features

1.  **Role-Based Access Control:** Distinct dashboards for Donors, Hospitals, and Admins.
2.  **AI Health Assistant:** Integrated Gemini AI for real-time health queries and eligibility checks.
3.  **Smart Search:** Hospitals can filter donors by blood type and location (Nanjing District support).
4.  **Doctor Booking:** Integrated appointment system for Hematologists and GPs.
5.  **Dark Mode:** Fully responsive dark/light theme switching.
6.  **Gamification:** Donors earn badges and track "Lives Saved".

## 📦 Setup & Installation

1.  Clone the repository.
2.  Install dependencies: `npm install`
3.  Set up Environment Variables:
    - Create a `.env` file.
    - Add `API_KEY=your_google_gemini_key`
4.  Run the development server: `npm run dev`
