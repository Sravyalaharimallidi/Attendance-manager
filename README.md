# Attendance Manager - Backend API

Attendance Manager is a backend system built for tracking academic attendance and weekly timetables. It supports secure user authentication using Supabase Auth, encrypted email storage, and automatic attendance calculations using Supabase SQL functions.

This README documents the backend functionality, including REST APIs, Prisma ORM, Supabase integration, and core features like timetable and attendance management.

---

## Features

- Secure user signup, signin, signout (Supabase Auth)
- Encrypted email storage using crypto
- send emails to users everyday at 8PM to mark attendance for the subjects in the day's timetable
- Create/update/delete subjects
- Add/update/delete attendance rows
- Automatic tracking of attended and total classes via Supabase functions
- timetable creation with conflict validation
- Prisma ORM to manage PostgreSQL database
- REST APIs for all entities

---

## Tech Stack

- Node.js + Express.js
- Supabase (Auth + Database + SQL Functions)
- Prisma ORM
- Nodemailer (Email sending)
- Crypto (Encryption for email)
- REST API structure
- ThunderClient (API testing)

---

## Database Tables

| Table       | Description                                   |
|-------------|-----------------------------------------------|
| `user`      | Supabase Auth user, encrypted email stored    |
| `subject`   | Subjects created by users                     |
| `attendance`| Attendance records per subject with status    |
| `timetable` | User timetable for the week                   |

---

## Auth Endpoints

| Method | Endpoint             | Description              |
|--------|----------------------|--------------------------|
| POST   | `/api/user`          | Register a new user      |
| POST   | `/api/user/signin`   | Sign in an existing user |
| POST   | `/api/user/signout`  | Sign out user            |
| PUT    | `/api/user`          | Update email/password    |

---

## 📚 Subject Endpoints

| Method | Endpoint             | Description                         |
|--------|----------------------|-------------------------------------|
| POST   | `/api/subjects/`     | Create a new subject                |
| PUT    | `/api/subjects/`     | Update an existing subject name     |
| GET    | `/api/subjects/:id`  | Get all subjects for a user         |
| DELETE | `/api/subjects/:id`  | Delete subject by ID                |

---

## Attendance Endpoints

| Method | Endpoint               | Description                            |
|--------|------------------------|----------------------------------------|
| POST   | `/api/attendance/`     | Add new attendance row                 |
| PUT    | `/api/attendance/`     | Update an attendance row               |
| DELETE | `/api/attendance/`     | Delete an attendance row               |
| GET    | `/api/attendance/:id`  | Get all rows and stats for a subject   |

Uses Supabase SQL functions:
- `add_total_classes(subject_id)`
- `add_attended_classes(subject_id)`
- `decrease_total_classes(subject_id)`
- `decrease_attended_classes(subject_id)`

---

## Timetable Endpoints

| Method | Endpoint              | Description                      |
|--------|-----------------------|----------------------------------|
| POST   | `/api/timetable/`     | Save full timetable for user     |
| GET    | `/api/timetable/:id`  | Get timetable by user ID         |
| DELETE | `/api/timetable/:id`  | Delete timetable for a user      |

Validates overlapping time slots for each day.

---

## Folder Structure

```bash
├── controllers/
│   ├── user.controller.js
│   ├── subject.controller.js
│   ├── timetable.controller.js
│   ├── attendance.controller.js
├── routes/
│   ├── user.route.js
│   ├── subject.route.js
│   ├── timetable.route.js
│   ├── attendance.route.js
├── utils/
│   ├── mails.js
│   └── cryptoUtils.js
├── prisma/
│   ├── client.js
│   ├── schema.prisma
│   └── migrations/
├── .env
├── index.js
├── package.json
└── README.md
```

##Environment variables
SUPABASE_URL=your-supabase-url
SUPABASE_KEY=your-supabase-service-role-key
MAIL_USER=your-email@example.com
MAIL_PASS=your-app-password
CRYPTO_SECRET=your-32byte-secret-key

# Running locally
# 1. Clone the project
git clone https://github.com/your-username/attendance-manager.git
cd attendance-manager

# 2. Install dependencies
pnpm install

# 3. Create .env
cp .env.example .env
# Fill in Supabase, email, crypto

# 4. Start dev server
pnpm run dev

