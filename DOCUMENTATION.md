# Student Management Backend - Complete Documentation

> **Version:** 1.0.0  
> **Last Updated:** January 2026  
> **Tech Stack:** Node.js, Express.js, MongoDB (Mongoose), JWT Authentication

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Architecture Overview](#architecture-overview)
3. [Getting Started](#getting-started)
4. [Database Schema](#database-schema)
5. [Module Documentation](#module-documentation)
   - [User Management & Authentication](#1-user-management--authentication-module)
   - [Student Management](#2-student-management-module)
   - [Subject Management](#3-subject-management-module)
   - [Attendance Management](#4-attendance-management-module)
   - [Marks Management](#5-marks-management-module)
   - [Internal Marks Management](#6-internal-marks-management-module)
   - [Course Outcome (CO) Management](#7-course-outcome-co-management-module)
   - [CO-PO Matrix Management](#8-co-po-matrix-management-module)
   - [Attainment Management](#9-attainment-management-module)
   - [Feedback Attainment](#10-feedback-attainment-module)
6. [Authentication & Authorization](#authentication--authorization)
7. [API Quick Reference](#api-quick-reference)
8. [Business Logic Flows](#business-logic-flows)
9. [Error Handling](#error-handling)
10. [Environment Configuration](#environment-configuration)

---

## Project Overview

This is the backend system for the **College Student Management System**, designed to handle:

- **Student Information Management** - Complete student records with branch, year, semester details
- **Attendance Tracking** - Period-wise (15th/30th of month) attendance recording
- **Academic Marks Management** - CIE (Continuous Internal Evaluation), Surprise Tests, Assignments
- **Outcome-Based Education (OBE)** - CO, PO, PSO mapping and attainment calculation
- **User Authentication** - Role-based access (Admin/User) with JWT tokens

### Key Features for College Administration:
| Feature | Purpose |
|---------|---------|
| Student Data | Maintain student records across branches and sections |
| Attendance | Track bi-monthly attendance for all subjects |
| Marks Entry | Record CIE-1, CIE-2, SEE, Surprise Tests, Assignments |
| CO-PO Mapping | Map Course Outcomes to Program Outcomes (NBA/NAAC compliance) |
| Attainment | Calculate direct and indirect attainment levels |
| Feedback | Collect student feedback for indirect attainment |

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT (Frontend)                        │
└─────────────────────────────────┬───────────────────────────────┘
                                  │ HTTP Requests
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                       server.js (Express App)                    │
│  ┌─────────────┐  ┌──────────────┐  ┌────────────────────────┐  │
│  │    CORS     │  │  JSON Parser │  │      Route Handlers    │  │
│  └─────────────┘  └──────────────┘  └────────────────────────┘  │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
         ┌────────────────────────┼────────────────────────┐
         │                        │                        │
         ▼                        ▼                        ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│     Routes      │    │   Middlewares   │    │   Controllers   │
│  /api/students  │    │   auth.js       │    │  Business Logic │
│  /api/subjects  │    │  - tokenAuth    │    │                 │
│  /api/marks     │    │  - adminAuth    │    │                 │
│  /api/co        │    │                 │    │                 │
│  /api/users     │    │                 │    │                 │
│       ...       │    │                 │    │                 │
└────────┬────────┘    └─────────────────┘    └────────┬────────┘
         │                                             │
         └─────────────────────┬───────────────────────┘
                               │
                               ▼
┌─────────────────────────────────────────────────────────────────┐
│                         Models (Mongoose)                        │
│  Student │ Subject │ Marks │ Attendance │ User │ CO │ COPO     │
└─────────────────────────────────┬───────────────────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MongoDB Atlas Database                        │
└─────────────────────────────────────────────────────────────────┘
```

### Directory Structure

```
Student-management-backend/
├── server.js              # Main entry point - Express server setup
├── package.json           # Dependencies and scripts
├── config/
│   ├── db.js              # MongoDB connection configuration
│   └── index.js           # App configuration (JWT secret)
├── controllers/           # Business logic for each module
│   ├── userController.js
│   ├── studentController.js
│   ├── subjectController.js
│   ├── marksController.js
│   ├── internalMarksController.js
│   ├── CourseController.js
│   ├── attainmentController.js
│   └── feedbackAttainmentController.js
├── middlewares/
│   └── auth.js            # JWT authentication middleware
├── models/                # Mongoose schemas
│   ├── userModel.js
│   ├── studentModel.js
│   ├── subjectModel.js
│   ├── marksModel.js
│   ├── internalMarksModel.js
│   ├── attendanceModel.js
│   ├── CourseOutcomeModel.js
│   ├── COPOMatrixModel.js
│   ├── COPOAverageModel.js
│   ├── attainmentModel.js
│   └── feedbackAttainmentModel.js
└── routes/                # API route definitions
    ├── userRoutes.js
    ├── studentRoutes.js
    ├── subjectRoutes.js
    ├── marksRoutes.js
    ├── internalMarksRoutes.js
    ├── courseRoutes.js
    ├── attainmentRoutes.js
    └── feedbackAttainmentRoutes.js
```

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account or local MongoDB instance
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Student-management-backend

# Install dependencies
npm install

# Create .env file
touch .env
```

### Environment Variables

Create a `.env` file in the root directory:

```env
ATLAS_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/<database>
PORT=3000
```

### Running the Server

```bash
# Development (with auto-reload)
npx nodemon server.js

# Production
node server.js
```

Server will start at: `http://localhost:3000`

---

## Database Schema

### Entity Relationship Overview

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Student    │────<│  Attendance  │>────│   Subject    │
│              │     └──────────────┘     │              │
│  rollNo (PK) │                          │   _id (PK)   │
│  name        │     ┌──────────────┐     │   name       │
│  branch      │────<│    Marks     │>────│   branch     │
│  year        │     └──────────────┘     │   year       │
│  semester    │                          │   semester   │
│  section     │     ┌──────────────┐     │   regulation │
│  fatherName  │────<│InternalMarks │>────│   courseCode │
└──────────────┘     └──────────────┘     └──────┬───────┘
                                                 │
       ┌─────────────────────────────────────────┤
       │                                         │
       ▼                                         ▼
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│CourseOutcome │────<│ COPOMatrix   │     │  Attainment  │
│              │     │              │     │              │
│  subject     │     │  subject     │     │  subject     │
│  coNo        │     │ courseOutcome│     │  examType    │
│ courseOutcome│     │  po1-po12    │     │attainmentData│
│knowledgeLevel│     │  pso1-pso2   │     │attainmentType│
└──────────────┘     └──────────────┘     └──────────────┘
                           │
                           ▼
                     ┌──────────────┐
                     │ COPOAverage  │
                     │              │
                     │  subject     │
                     │  po1_avg-    │
                     │  po12_avg    │
                     │  pso1_avg-   │
                     │  pso2_avg    │
                     └──────────────┘
```

### Schema Definitions

#### 1. Student Schema
```javascript
{
  rollNo: String (unique, required)    // e.g., "160921733078"
  name: String (required)               // Student full name
  fatherName: String                    // Father's name
  branch: String (required)             // e.g., "CSE", "ECE", "ME"
  currentYear: Number (required)        // 1, 2, 3, or 4
  currentSemester: Number (required)    // 1-8
  section: String (required)            // e.g., "A", "B", "C"
  createdAt: Date (auto)
}
```

#### 2. Subject Schema
```javascript
{
  name: String (required)               // Subject name
  branch: String (required)             // Department
  year: Number (required)               // Academic year
  semester: Number (required)           // Semester number
  regulation: String (required)         // e.g., "R20", "R18"
  courseCode: String (required)         // e.g., "CS501"
}
```

#### 3. Attendance Schema
```javascript
{
  student: ObjectId (ref: Student)      // Student reference
  subject: ObjectId (ref: Subject)      // Subject reference
  totalClasses: Number (required)       // Total classes held
  classesAttended: Number (required)    // Classes attended
  period: String ['15th', '30th']       // Bimonthly period
  month: String (required)              // e.g., "9" for September
  year: Number (required)               // e.g., 2024
  date: Date (auto)
}
```

#### 4. Marks Schema (For Surprise Tests, Assignments)
```javascript
{
  student: ObjectId (ref: Student)
  subject: ObjectId (ref: Subject)
  examType: String (required)           // "CIE-1", "SURPRISE TEST-1", "ASSIGNMENT-1", etc.
  marks: Number (required)              // Marks obtained
  maxMarks: Number (required)           // Maximum marks
  regulation: String (required)
  year: Number (required)
  semester: Number (required)
  section: String (required)
}
```

#### 5. Internal Marks Schema (CIE Detailed Marks)
```javascript
{
  student: ObjectId (ref: Student)
  subject: ObjectId (ref: Subject)
  examType: String ['CIE-1', 'CIE-2']
  marks: {
    Q1: { a: Number, b: Number, c: Number },  // SAQ section (3 parts)
    Q2: { a: Number, b: Number },              // Long Answer Q1
    Q3: { a: Number, b: Number },              // Long Answer Q2
    Q4: { a: Number, b: Number }               // Long Answer Q3
  },
  year: Number,
  semester: Number,
  section: String
}
```

#### 6. User Schema
```javascript
{
  firstName: String (required)
  lastName: String (required)
  email: String (unique, required)      // Email validation applied
  password: String (required)           // bcrypt hashed
  active: Boolean (default: true)
  role: String (default: "User")        // "admin" or "User"
  createdDate: Date
  updatedDate: Date (auto)
}
```

#### 7. Course Outcome Schema
```javascript
{
  subject: ObjectId (ref: Subject)
  coNo: String (required)               // "CO1", "CO2", etc.
  courseOutcome: String (required)      // Description of outcome
  knowledgeLevel: String (required)     // Bloom's taxonomy level
}
```

#### 8. CO-PO Matrix Schema
```javascript
{
  subject: ObjectId (ref: Subject)
  courseOutcome: ObjectId (ref: CourseOutcome)
  po1 - po12: Number (default: 0)       // Program Outcome mappings (1-3)
  pso1, pso2: Number (default: 0)       // Program Specific Outcomes
}
```

#### 9. Attainment Schema
```javascript
{
  subject: ObjectId (ref: Subject)
  attainmentData: [{
    coNo: String,                       // "CO1", "CO2", etc.
    attainmentLevel: Number             // Attainment level (1-3)
  }],
  attainmentType: String ['direct', 'indirect', 'computedDirect', 'computedIndirect', 'computedOverall'],
  examType: String ['CIE-1', 'CIE-2', 'SEE', 'COMPUTED'],
  timestamps: true
}
```

#### 10. Feedback Attainment Schema
```javascript
{
  student: ObjectId (ref: Student)
  subject: ObjectId (ref: Subject)
  CO1 - CO5: Number [1, 2, 3]           // Student rating per CO
  timestamps: true
}
```

---

## Module Documentation

---

### 1. User Management & Authentication Module

**Base URL:** `/api/users`

**Purpose:** Handle user registration, login, and role-based access control for faculty/admin.

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    USER AUTHENTICATION FLOW                    │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   [Admin]                                                      │
│      │                                                         │
│      ▼                                                         │
│   POST /signup ──────────────────────────────────────────────► │
│   (with token)   1. Validate admin token                       │
│                  2. Hash password (bcrypt)                     │
│                  3. Create user with role                      │
│                  4. Return success                             │
│                                                                │
│   [Any User]                                                   │
│      │                                                         │
│      ▼                                                         │
│   POST /signin ──────────────────────────────────────────────► │
│                  1. Find user by email                         │
│                  2. Compare password hash                      │
│                  3. Generate JWT (24h expiry)                  │
│                  4. Return token with role                     │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| `POST` | `/signup` | ✅ Token | Admin | Create new user account |
| `POST` | `/signin` | ❌ | Any | Login and get JWT token |
| `GET` | `/all` | ✅ Token | Admin | Get all users list |
| `DELETE` | `/:userId` | ✅ Token | Admin | Delete a user |

#### Request/Response Examples

**Sign Up (Admin Only)**
```http
POST /api/users/signup
Authorization: Bearer <admin-jwt-token>
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@college.edu",
  "password": "securepassword123",
  "role": "user"
}
```

Response (201):
```json
{
  "message": "User created successfully",
  "userId": "65f8a1b2c3d4e5f6g7h8i9j0"
}
```

**Sign In**
```http
POST /api/users/signin
Content-Type: application/json

{
  "email": "john.doe@college.edu",
  "password": "securepassword123"
}
```

Response (200):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

### 2. Student Management Module

**Base URL:** `/api/students`

**Purpose:** Manage student records - create, read, update, delete student information across all branches and sections.

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                   STUDENT MANAGEMENT FLOW                      │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   CREATE STUDENT                                               │
│   POST / ────────────────────────────────────────────────────► │
│   {rollNo, name, branch, year, semester, section, fatherName}  │
│                                                                │
│   GET ALL/FILTERED STUDENTS                                    │
│   GET / ─────────────────────────────────────────────────────► │
│   GET /filtered?branch=CSE&year=3&semester=5&section=A ──────► │
│                                                                │
│   GET SINGLE STUDENT                                           │
│   GET /:rollNo ──────────────────────────────────────────────► │
│                                                                │
│   GET COMPLETE STUDENT DATA (Marks + Attendance)               │
│   GET /:rollNo/data?startDate=01/09/2024&endDate=30/11/2024 ─► │
│   Returns: Student info + Marks + Attendance within range      │
│                                                                │
│   GET STUDENT MARKS                                            │
│   GET /:rollNo/marks ────────────────────────────────────────► │
│   Returns: All test marks for the student                      │
│                                                                │
│   GET ALL MARKS FOR SEE VERIFICATION                           │
│   GET /getall/:rollNo ───────────────────────────────────────► │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create a new student |
| `GET` | `/` | Get all students |
| `GET` | `/:rollNo` | Get student by roll number |
| `GET` | `/filtered` | Get students with filters (branch, year, semester, section) |
| `GET` | `/:rollNo/data` | Get student data with marks & attendance in date range |
| `GET` | `/:rollNo/marks` | Get all marks for a student |
| `GET` | `/getall/:rollNo` | Get all subject marks for SEE verification |
| `PUT` | `/:rollNo` | Update student details |
| `DELETE` | `/:rollNo` | Delete a student |

#### Request/Response Examples

**Create Student**
```http
POST /api/students
Content-Type: application/json

{
  "rollNo": "160921733078",
  "name": "Rizwan Ahmed",
  "branch": "CSE",
  "currentYear": 3,
  "currentSemester": 5,
  "section": "A",
  "fatherName": "Ahmed Khan"
}
```

**Get Student Data with Date Range**
```http
GET /api/students/160921733078/data?startDate=01/09/2024&endDate=30/11/2024
```

Response:
```json
{
  "studentId": "65f8a1b2c3d4e5f6g7h8i9j0",
  "studentName": "Rizwan Ahmed",
  "rollNo": "160921733078",
  "year": 3,
  "semester": 5,
  "section": "A",
  "marks": [
    {
      "subjectId": "670e17ac56900e5e6a8cb396",
      "subjectName": "Database Systems",
      "examType": "CIE-1",
      "marks": 18,
      "maxMarks": 20
    }
  ],
  "attendance": [
    {
      "subjectId": "670e17ac56900e5e6a8cb396",
      "subjectName": "Database Systems",
      "period": "15th",
      "totalClasses": 15,
      "classesAttended": 13,
      "month": "9",
      "year": 2024
    }
  ]
}
```

**Get Filtered Students**
```http
GET /api/students/filtered?branch=CSE&year=3&semester=5&section=A&subjectId=670e17ac&period=15th
```

---

### 3. Subject Management Module

**Base URL:** `/api/subjects`

**Purpose:** Manage subject/course information for different branches, years, semesters, and regulations.

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    SUBJECT MANAGEMENT FLOW                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   BULK CREATE SUBJECTS                                         │
│   POST / ────────────────────────────────────────────────────► │
│   [Array of subjects] - Uses insertMany for bulk insert        │
│                                                                │
│   GET SUBJECTS BY CRITERIA                                     │
│   GET /branch/:branch/year/:year/semester/:semester ─────────► │
│   GET /branch/:branch/year/:year/semester/:semester/           │
│       regulation/:regulation ────────────────────────────────► │
│                                                                │
│   Example Usage:                                               │
│   GET /branch/CSE/year/3/semester/5 ─────────────────────────► │
│   Returns all CSE 3rd year 5th sem subjects                    │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create subjects (supports bulk insert) |
| `GET` | `/` | Get all subjects |
| `GET` | `/branch/:branch/year/:year/semester/:semester` | Get subjects by branch, year, semester |
| `GET` | `/branch/:branch/year/:year/semester/:semester/regulation/:regulation` | Get subjects with regulation filter |
| `GET` | `/:id` | Get subject by ID |
| `PUT` | `/:id` | Update subject |
| `DELETE` | `/:id` | Delete subject |

#### Request/Response Examples

**Create Subjects (Bulk)**
```http
POST /api/subjects
Content-Type: application/json

[
  {
    "name": "Database Management Systems",
    "branch": "CSE",
    "year": 3,
    "semester": 5,
    "regulation": "R20",
    "courseCode": "CS501"
  },
  {
    "name": "Operating Systems",
    "branch": "CSE",
    "year": 3,
    "semester": 5,
    "regulation": "R20",
    "courseCode": "CS502"
  }
]
```

---

### 4. Attendance Management Module

**Base URL:** `/api/students` (attendance routes are under students)

**Purpose:** Track student attendance on a bi-monthly basis (15th and 30th of each month) per subject.

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                   ATTENDANCE TRACKING FLOW                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   RECORD ATTENDANCE (Bi-monthly)                               │
│   POST /attendance ──────────────────────────────────────────► │
│   {student, subject, totalClasses, classesAttended,            │
│    period: '15th'/'30th', month, year}                         │
│                                                                │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Period Logic:                                          │  │
│   │  - '15th': Attendance recorded on 15th of month         │  │
│   │  - '30th': Attendance recorded on 30th/last day         │  │
│   │  This allows tracking attendance twice per month        │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                │
│   GET ATTENDANCE BY PERIOD                                     │
│   GET /attendance/month/:month/year/:year/period/:period ────► │
│   Example: /attendance/month/9/year/2024/period/15th           │
│                                                                │
│   GET ATTENDANCE BY STUDENT                                    │
│   GET /attendance/:rollNo ───────────────────────────────────► │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/attendance` | Create attendance record |
| `GET` | `/attendance/:rollNo` | Get attendance by student roll number |
| `GET` | `/attendance/month/:month/year/:year/period/:period` | Get attendance by period, month, year |
| `PUT` | `/attendance/:id` | Update attendance record |
| `DELETE` | `/attendance/:id` | Delete attendance record |

#### Request/Response Examples

**Create Attendance**
```http
POST /api/students/attendance
Content-Type: application/json

{
  "student": "65f8a1b2c3d4e5f6g7h8i9j0",
  "subject": "670e17ac56900e5e6a8cb396",
  "totalClasses": 15,
  "classesAttended": 13,
  "period": "15th",
  "month": "9",
  "year": 2024
}
```

---

### 5. Marks Management Module

**Base URL:** `/api/marks`

**Purpose:** Record and manage marks for various exam types including CIE, Surprise Tests, and Assignments.

#### Exam Types Supported

| Exam Type | Description | Max Marks |
|-----------|-------------|-----------|
| `CIE-1` | Continuous Internal Evaluation 1 | 20 |
| `CIE-2` | Continuous Internal Evaluation 2 | 20 |
| `SURPRISE TEST-1/2/3` | Surprise Tests | 10 |
| `ASSIGNMENT-1/2/3` | Assignments | 10 |

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                      MARKS MANAGEMENT FLOW                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   ADD/UPDATE MARKS                                             │
│   POST / ────────────────────────────────────────────────────► │
│   {student, subject, examType, marks, maxMarks,                │
│    regulation, year, semester, section}                        │
│   * Creates new if not exists, updates if exists               │
│                                                                │
│   GET MARKS BY SUBJECT & EXAM TYPE                             │
│   GET /:subject_id/:examType ────────────────────────────────► │
│                                                                │
│   GET BEST-OF-TWO AVERAGE (ST & AT)                            │
│   GET /getAvgOfBestTwo/subject/:subject_id ──────────────────► │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Business Logic:                                        │  │
│   │  1. Get all 3 Surprise Tests & 3 Assignments            │  │
│   │  2. Pick best 2 from each category                      │  │
│   │  3. Calculate average of best 2                         │  │
│   │  4. Apply custom rounding (>=9.5 → 10, else floor)      │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                │
│   GET ATTAINMENT DATA (Combined)                               │
│   GET /attainment/:subject_id/:examType ─────────────────────► │
│   Returns: Internal marks + ST/AT averages combined            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ❌ | Add or update marks |
| `GET` | `/:subject_id/:examType` | ❌ | Get marks by subject and exam type |
| `GET` | `/getAvgOfBestTwo/subject/:subject_id` | ❌ | Get average of best 2 ST & AT |
| `GET` | `/attainment/:subject_id/:examType` | ❌ | Get combined attainment data |
| `GET` | `/:year/:semester/:section/:examType` | ❌ | Get marks by class |
| `PUT` | `/:subject_id/:examType/:id` | ✅ Admin | Update specific marks entry |

#### Request/Response Examples

**Add Marks**
```http
POST /api/marks
Content-Type: application/json

{
  "student": "65f8a1b2c3d4e5f6g7h8i9j0",
  "subject": "670e17ac56900e5e6a8cb396",
  "examType": "SURPRISE TEST-1",
  "marks": 8,
  "maxMarks": 10,
  "regulation": "R20",
  "year": 3,
  "semester": 5,
  "section": "A"
}
```

**Get Average of Best Two**
```http
GET /api/marks/getAvgOfBestTwo/subject/670e17ac56900e5e6a8cb396
```

Response:
```json
[
  {
    "student": {
      "id": "65f8a1b2c3d4e5f6g7h8i9j0",
      "rollNo": "160921733078",
      "name": "Rizwan Ahmed"
    },
    "surpriseTestAverage": 9,
    "assignmentAverage": 8
  }
]
```

---

### 6. Internal Marks Management Module

**Base URL:** `/api/internalMarks`

**Purpose:** Manage detailed CIE marks with question-wise breakdown (SAQs and Long Answer Questions).

#### Question Structure

```
CIE Paper Structure:
┌─────────────────────────────────────────────────────────────┐
│  Q1 (SAQs): 3 parts (a, b, c) - Short Answer Questions      │
│  Q2: 2 parts (a, b) - Long Answer Question 1                │
│  Q3: 2 parts (a, b) - Long Answer Question 2                │
│  Q4: 2 parts (a, b) - Long Answer Question 3                │
└─────────────────────────────────────────────────────────────┘
```

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                  INTERNAL MARKS FLOW                           │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   CREATE INTERNAL MARKS                                        │
│   POST / ────────────────────────────────────────────────────► │
│   {student, subject, examType, marks: {Q1, Q2, Q3, Q4},        │
│    year, semester, section}                                    │
│                                                                │
│   GET QUESTION TOTALS                                          │
│   GET /totals/:subject_id/:examType ─────────────────────────► │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Calculation:                                           │  │
│   │  saqs = Q1.a + Q1.b + Q1.c                              │  │
│   │  Q1_total = Q2.a + Q2.b                                 │  │
│   │  Q2_total = Q3.a + Q3.b                                 │  │
│   │  Q3_total = Q4.a + Q4.b                                 │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/` | ❌ | Create internal marks entry |
| `GET` | `/` | ❌ | Get all internal marks |
| `GET` | `/:subject_id/:examType` | ❌ | Get by subject and exam type |
| `GET` | `/totals/:subject_id/:examType` | ❌ | Get question totals |
| `GET` | `/:year/:semester/:section/:examType` | ❌ | Get by class details |
| `PUT` | `/:subject_id/:examType/:id` | ✅ Admin | Update internal marks |
| `DELETE` | `/:subject_id/:examType/:id` | ❌ | Delete internal marks |

#### Request/Response Examples

**Create Internal Marks**
```http
POST /api/internalMarks
Content-Type: application/json

{
  "student": "65f8a1b2c3d4e5f6g7h8i9j0",
  "subject": "670e17ac56900e5e6a8cb396",
  "examType": "CIE-1",
  "marks": {
    "Q1": { "a": 2, "b": 2, "c": 2 },
    "Q2": { "a": 5, "b": 5 },
    "Q3": { "a": 4, "b": 5 },
    "Q4": { "a": 5, "b": 4 }
  },
  "year": 3,
  "semester": 5,
  "section": "A"
}
```

**Get Question Totals**
```http
GET /api/internalMarks/totals/670e17ac56900e5e6a8cb396/CIE-1
```

Response:
```json
[
  {
    "student": {
      "id": "65f8a1b2c3d4e5f6g7h8i9j0",
      "rollNo": "160921733078",
      "name": "Rizwan Ahmed"
    },
    "internalMarks": {
      "saqs": 6,
      "Q1": 10,
      "Q2": 9,
      "Q3": 9
    }
  }
]
```

---

### 7. Course Outcome (CO) Management Module

**Base URL:** `/api/co/course-outcomes`

**Purpose:** Define and manage Course Outcomes for each subject as per OBE (Outcome-Based Education) requirements.

#### What are Course Outcomes?

Course Outcomes (COs) are statements that describe what students are expected to know or be able to do by the end of a course. Each subject typically has 5-6 COs mapped to Bloom's Taxonomy levels.

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    COURSE OUTCOME FLOW                         │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   CREATE COURSE OUTCOME                                        │
│   POST /course-outcomes ─────────────────────────────────────► │
│   {subjectId, coNo, courseOutcome, knowledgeLevel}             │
│                                                                │
│   Example:                                                     │
│   {                                                            │
│     "subjectId": "670e17ac56900e5e6a8cb396",                   │
│     "coNo": "CO1",                                             │
│     "courseOutcome": "Understand database concepts",           │
│     "knowledgeLevel": "K2"                                     │
│   }                                                            │
│                                                                │
│   Knowledge Levels (Bloom's Taxonomy):                         │
│   K1 - Remember  │  K2 - Understand  │  K3 - Apply             │
│   K4 - Analyze   │  K5 - Evaluate    │  K6 - Create            │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/course-outcomes` | Create new Course Outcome |
| `GET` | `/course-outcomes/:subjectId` | Get all COs for a subject |
| `PATCH` | `/course-outcomes/:coId` | Update a Course Outcome |
| `DELETE` | `/course-outcome/:coId` | Delete a Course Outcome |
| `DELETE` | `/course-outcomes/:subjectId` | Delete all COs for a subject |

---

### 8. CO-PO Matrix Management Module

**Base URL:** `/api/co/copo-matrix`

**Purpose:** Map Course Outcomes to Program Outcomes and Program Specific Outcomes for NBA/NAAC accreditation requirements.

#### Understanding CO-PO Mapping

```
┌─────────────────────────────────────────────────────────────────┐
│                        CO-PO MATRIX                             │
├──────┬────┬────┬────┬────┬────┬─────────────┬──────┬──────┬─────┤
│      │PO1 │PO2 │PO3 │... │PO12│    ...      │PSO1  │PSO2  │     │
├──────┼────┼────┼────┼────┼────┼─────────────┼──────┼──────┼─────┤
│ CO1  │ 3  │ 2  │ 1  │ 0  │ 0  │    ...      │  2   │  1   │     │
│ CO2  │ 2  │ 3  │ 2  │ 1  │ 0  │    ...      │  3   │  2   │     │
│ CO3  │ 1  │ 2  │ 3  │ 2  │ 1  │    ...      │  2   │  3   │     │
│ ...  │    │    │    │    │    │    ...      │      │      │     │
├──────┼────┼────┼────┼────┼────┼─────────────┼──────┼──────┼─────┤
│ AVG  │2.0 │2.3 │2.0 │1.0 │0.3 │    ...      │ 2.3  │ 2.0  │     │
└──────┴────┴────┴────┴────┴────┴─────────────┴──────┴──────┴─────┘

Mapping Values: 0 = No correlation, 1 = Low, 2 = Medium, 3 = High
```

#### Program Outcomes (POs) - Typically 12 standard outcomes:
- PO1: Engineering knowledge
- PO2: Problem analysis
- PO3: Design/development of solutions
- PO4: Conduct investigations
- PO5: Modern tool usage
- PO6: Engineer and society
- PO7: Environment and sustainability
- PO8: Ethics
- PO9: Individual and team work
- PO10: Communication
- PO11: Project management
- PO12: Life-long learning

#### PSOs (Program Specific Outcomes): 2 outcomes specific to the department

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                     CO-PO MATRIX FLOW                          │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   1. CREATE CO-PO MAPPING                                      │
│   POST /copo-matrix ─────────────────────────────────────────► │
│   {subjectId, coId, po1-po12, pso1, pso2}                      │
│                                                                │
│   2. GET ALL MAPPINGS FOR SUBJECT                              │
│   GET /copo-matrix/:subjectId ───────────────────────────────► │
│                                                                │
│   3. CALCULATE & SAVE AVERAGES                                 │
│   POST /copo-average/:subjectId ─────────────────────────────► │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Automatically calculates:                              │  │
│   │  - Average of each PO across all COs                    │  │
│   │  - Average of each PSO across all COs                   │  │
│   │  - Stores in COPOAverage collection                     │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/copo-matrix` | Create CO-PO mapping |
| `GET` | `/copo-matrix/:subjectId` | Get all mappings for subject |
| `PATCH` | `/copo-matrix/:copoId` | Update mapping |
| `DELETE` | `/copo-matrix/:copoId` | Delete mapping |
| `DELETE` | `/copo-matrices/:subjectId` | Delete all mappings for subject |
| `POST` | `/copo-average/:subjectId` | Calculate and save averages |
| `GET` | `/copo-average/:subjectId` | Get calculated averages |
| `DELETE` | `/copo-average/:subjectId` | Delete averages |

#### Request/Response Examples

**Create CO-PO Mapping**
```http
POST /api/co/copo-matrix
Content-Type: application/json

{
  "subjectId": "670e17ac56900e5e6a8cb396",
  "coId": "672a1b2c3d4e5f6g7h8i9j0k",
  "po1": 3, "po2": 2, "po3": 1, "po4": 0, "po5": 0,
  "po6": 0, "po7": 0, "po8": 1, "po9": 2, "po10": 1,
  "po11": 1, "po12": 2,
  "pso1": 3, "pso2": 2
}
```

---

### 9. Attainment Management Module

**Base URL:** `/api/attainment`

**Purpose:** Calculate and store CO attainment levels based on student performance in various assessments.

#### Attainment Types

| Type | Description |
|------|-------------|
| `direct` | Attainment from exams (CIE, SEE) |
| `indirect` | Attainment from student feedback |
| `computedDirect` | Calculated direct attainment |
| `computedIndirect` | Calculated indirect attainment |
| `computedOverall` | Final overall attainment (80% direct + 20% indirect) |

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                    ATTAINMENT CALCULATION FLOW                 │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   STEP 1: Record Direct Attainment (from Exams)                │
│   POST / ────────────────────────────────────────────────────► │
│   {subject, attainmentData: [{coNo, attainmentLevel}],         │
│    attainmentType: 'direct', examType: 'CIE-1'}                │
│                                                                │
│   STEP 2: Record Indirect Attainment (from Feedback)           │
│   POST / ────────────────────────────────────────────────────► │
│   {subject, attainmentData: [...],                             │
│    attainmentType: 'indirect', examType: 'COMPUTED'}           │
│                                                                │
│   STEP 3: Compute Overall Attainment                           │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  Formula:                                               │  │
│   │  Overall = (Direct × 0.8) + (Indirect × 0.2)            │  │
│   │                                                         │  │
│   │  Attainment Levels:                                     │  │
│   │  Level 3: ≥60% students achieved target                 │  │
│   │  Level 2: ≥50% students achieved target                 │  │
│   │  Level 1: ≥40% students achieved target                 │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create attainment record |
| `GET` | `/` | Get all attainments |
| `GET` | `/subject/:subjectId/examType/:examType` | Get by subject and exam type |
| `GET` | `/subject/:subjectId/attainmentType/:attainmentType` | Get by attainment type |
| `PUT` | `/:id` | Update attainment by ID |
| `PUT` | `/subject/:subjectId/examType/:examType` | Update attainment levels |
| `DELETE` | `/:id` | Delete attainment |

#### Request/Response Examples

**Create Attainment**
```http
POST /api/attainment
Content-Type: application/json

{
  "subject": "670e17ac56900e5e6a8cb396",
  "attainmentData": [
    { "coNo": "CO1", "attainmentLevel": 2 },
    { "coNo": "CO2", "attainmentLevel": 3 },
    { "coNo": "CO3", "attainmentLevel": 2 },
    { "coNo": "CO4", "attainmentLevel": 1 },
    { "coNo": "CO5", "attainmentLevel": 2 }
  ],
  "attainmentType": "direct",
  "examType": "CIE-1"
}
```

---

### 10. Feedback Attainment Module

**Base URL:** `/api/feedbackattainment`

**Purpose:** Collect student feedback on Course Outcome achievement for indirect attainment calculation.

#### Feedback Rating Scale

| Rating | Meaning |
|--------|---------|
| 1 | Poor - Did not achieve the outcome |
| 2 | Moderate - Partially achieved |
| 3 | Good - Fully achieved |

#### Data Flow

```
┌────────────────────────────────────────────────────────────────┐
│                   FEEDBACK ATTAINMENT FLOW                     │
├────────────────────────────────────────────────────────────────┤
│                                                                │
│   COLLECT STUDENT FEEDBACK                                     │
│   POST / ────────────────────────────────────────────────────► │
│   {student, subject, CO1: 3, CO2: 2, CO3: 3, CO4: 2, CO5: 3}   │
│                                                                │
│   GET FEEDBACK BY SUBJECT                                      │
│   GET /subject/:id ──────────────────────────────────────────► │
│   Returns all student feedback for the subject                 │
│                                                                │
│   CALCULATE INDIRECT ATTAINMENT                                │
│   ┌─────────────────────────────────────────────────────────┐  │
│   │  For each CO:                                           │  │
│   │  1. Count students with rating 3 (Good)                 │  │
│   │  2. Calculate percentage achieving Level 3              │  │
│   │  3. Determine attainment level based on threshold       │  │
│   └─────────────────────────────────────────────────────────┘  │
│                                                                │
└────────────────────────────────────────────────────────────────┘
```

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/` | Create feedback attainment |
| `GET` | `/` | Get all feedback attainments |
| `GET` | `/:id` | Get feedback by ID |
| `GET` | `/subject/:id` | Get all feedback for a subject |
| `PUT` | `/:id` | Update feedback |
| `DELETE` | `/:id` | Delete feedback |

#### Request/Response Examples

**Create Feedback**
```http
POST /api/feedbackattainment
Content-Type: application/json

{
  "student": "65f8a1b2c3d4e5f6g7h8i9j0",
  "subject": "670e17ac56900e5e6a8cb396",
  "CO1": 3,
  "CO2": 2,
  "CO3": 3,
  "CO4": 2,
  "CO5": 3
}
```

---

## Authentication & Authorization

### JWT Token Structure

```javascript
{
  "userId": "65f8a1b2c3d4e5f6g7h8i9j0",
  "email": "user@college.edu",
  "role": "admin",  // or "user"
  "iat": 1640000000,
  "exp": 1640086400  // 24 hours
}
```

### Middleware Functions

#### 1. tokenAuth
Validates JWT token from `Authorization` header.

```javascript
// Usage in routes
router.get('/protected-route', tokenAuth, controller.method);

// Header format
Authorization: Bearer <jwt-token>
```

#### 2. adminAuth
Checks if authenticated user has admin role.

```javascript
// Usage (must be after tokenAuth)
router.post('/admin-only', tokenAuth, adminAuth, controller.method);
```

### Protected Routes Summary

| Route | Required Auth |
|-------|---------------|
| `POST /api/users/signup` | Token + Admin |
| `GET /api/users/all` | Token + Admin |
| `DELETE /api/users/:userId` | Token + Admin |
| `PUT /api/marks/:subject_id/:examType/:id` | Token + Admin |
| `PUT /api/internalMarks/:subject_id/:examType/:id` | Token + Admin |

---

## API Quick Reference

### Base URL: `http://localhost:3000/api`

| Module | Endpoint Prefix | Key Operations |
|--------|-----------------|----------------|
| Users | `/users` | signup, signin, list, delete |
| Students | `/students` | CRUD, attendance, marks retrieval |
| Subjects | `/subjects` | CRUD, filter by branch/year/sem |
| Marks | `/marks` | Add/get marks, calculate averages |
| Internal Marks | `/internalMarks` | CIE detailed marks management |
| Course Outcomes | `/co/course-outcomes` | CO CRUD operations |
| CO-PO Matrix | `/co/copo-matrix` | CO-PO mappings |
| CO-PO Average | `/co/copo-average` | Calculate PO averages |
| Attainment | `/attainment` | Direct/Indirect attainment |
| Feedback | `/feedbackattainment` | Student feedback collection |

---

## Business Logic Flows

### Complete Semester Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        SEMESTER WORKFLOW                                   │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  SETUP PHASE (Start of Semester)                                           │
│  ───────────────────────────────────────────────────────────────────────── │
│  1. Create/Update Subjects for the semester                                │
│     POST /api/subjects                                                     │
│                                                                            │
│  2. Add/Update Students                                                    │
│     POST /api/students                                                     │
│                                                                            │
│  3. Define Course Outcomes for each subject                                │
│     POST /api/co/course-outcomes                                           │
│                                                                            │
│  4. Create CO-PO Mapping Matrix                                            │
│     POST /api/co/copo-matrix                                               │
│                                                                            │
│  MID-SEMESTER ACTIVITIES                                                   │
│  ───────────────────────────────────────────────────────────────────────── │
│  5. Record Attendance (15th & 30th of each month)                          │
│     POST /api/students/attendance                                          │
│                                                                            │
│  6. Record Surprise Tests & Assignments                                    │
│     POST /api/marks                                                        │
│                                                                            │
│  7. Record CIE-1 Marks (Internal Exam 1)                                   │
│     POST /api/internalMarks                                                │
│                                                                            │
│  8. Calculate CIE-1 Attainment                                             │
│     GET /api/marks/attainment/:subject_id/CIE-1                            │
│     POST /api/attainment (type: direct, examType: CIE-1)                   │
│                                                                            │
│  9. Record CIE-2 Marks (Internal Exam 2)                                   │
│     POST /api/internalMarks                                                │
│                                                                            │
│  END-SEMESTER ACTIVITIES                                                   │
│  ───────────────────────────────────────────────────────────────────────── │
│  10. Collect Student Feedback                                              │
│      POST /api/feedbackattainment                                          │
│                                                                            │
│  11. Calculate Direct Attainment (CIE-1 + CIE-2 + SEE)                     │
│      POST /api/attainment (type: computedDirect)                           │
│                                                                            │
│  12. Calculate Indirect Attainment (from Feedback)                         │
│      POST /api/attainment (type: computedIndirect)                         │
│                                                                            │
│  13. Calculate Overall Attainment (80% Direct + 20% Indirect)              │
│      POST /api/attainment (type: computedOverall)                          │
│                                                                            │
│  14. Calculate CO-PO Average                                               │
│      POST /api/co/copo-average/:subjectId                                  │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

### Marks Calculation Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                       MARKS CALCULATION LOGIC                              │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  INTERNAL MARKS BREAKDOWN                                                  │
│  ───────────────────────────────────────────────────────────────────────── │
│                                                                            │
│  CIE (20 marks each):                                                      │
│  ├── Q1 (SAQs): a + b + c = 6 marks                                        │
│  ├── Q2 (Long): a + b = ~10 marks                                          │
│  ├── Q3 (Long): a + b = ~10 marks                                          │
│  └── Q4 (Long): a + b = ~10 marks                                          │
│                                                                            │
│  Best of 2 Calculation (ST/AT):                                            │
│  ├── Surprise Tests: Best 2 of (ST-1, ST-2, ST-3) / 2                      │
│  ├── Assignments: Best 2 of (AT-1, AT-2, AT-3) / 2                         │
│  └── Rounding: ≥9.5 → 10, else floor()                                     │
│                                                                            │
│  Total Internal = CIE-1 + CIE-2 + ST_avg + AT_avg                          │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Error Handling

### Standard Error Responses

| Status Code | Meaning | Example |
|-------------|---------|---------|
| 400 | Bad Request | Invalid input data |
| 401 | Unauthorized | Invalid/missing token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 500 | Server Error | Internal server error |

### Error Response Format

```json
{
  "message": "Error description",
  "error": "Detailed error message (in dev)"
}
```

---

## Environment Configuration

### Required Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `ATLAS_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/db` |
| `PORT` | Server port (optional) | `3000` |

### Configuration Files

**config/index.js** - Application configuration
```javascript
const config = {
  jwtSecret: "secret",  // Change in production!
};
```

**config/db.js** - Database connection
```javascript
// Connects to MongoDB Atlas using ATLAS_URI env variable
```

---

## Maintenance Notes

### Adding New Features

1. **New Model**: Create in `/models/` following existing patterns
2. **New Controller**: Create in `/controllers/` with CRUD operations
3. **New Routes**: Create in `/routes/` and register in `server.js`

### Database Indexes (Recommended)

```javascript
// Add these indexes for better performance
db.students.createIndex({ rollNo: 1 }, { unique: true });
db.subjects.createIndex({ branch: 1, year: 1, semester: 1 });
db.marks.createIndex({ student: 1, subject: 1, examType: 1 });
db.attendance.createIndex({ student: 1, subject: 1, period: 1, month: 1, year: 1 });
```

### Security Recommendations

1. **Change JWT Secret**: Update `config/index.js` with a strong secret
2. **Environment Variables**: Never commit `.env` file
3. **Password Validation**: Add password strength validation
4. **Rate Limiting**: Implement rate limiting for auth endpoints
5. **Input Validation**: Add comprehensive input validation

---

## Contact & Support

For issues or questions regarding this backend system, please contact the development team or raise an issue in the repository.

---

*Documentation generated for Student Management Backend v1.0.0*
