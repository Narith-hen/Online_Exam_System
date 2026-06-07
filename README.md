# Online Exam System

A TypeScript + Express.js backend API for managing online exams, quizzes, and student assessments. Built with TypeORM and MySQL.

## Tech Stack

- **Runtime:** Node.js with TypeScript
- **Framework:** Express.js
- **Database:** MySQL with TypeORM
- **Auth:** JWT (JSON Web Tokens) with bcryptjs
- **Validation:** class-validator
- **Testing:** Jest with ts-jest

## Features

- **Teacher Module:** Create, update, delete exams and questions; manage student results
- **Student Module:** Login, start quiz sessions, submit answers, view results
- **Exam Management:** Draft, publish, archive exams with configurable duration and time windows
- **Access Control:** Role-based access (teacher/student), JWT token management
- **Auto Grading:** Automatic score calculation with letter grades (A-F)
- **Session Management:** Prevents duplicate quiz attempts, tracks exam progress
- **Question Types:** Multiple choice, true/false, short answer

## Directory Structure

```
src/
├── app.ts                          # Express app setup
├── server.ts                       # Server entry point
├── data-source.ts                  # TypeORM datasource export
├── config/
│   ├── database.config.ts
│   ├── env.config.ts
│   └── jwt.config.ts
├── constants/                      # Enums (exam status, question type, roles)
├── core/                           # Domain logic, use cases, interfaces
├── database/
│   ├── migrations/
│   └── seeds/
├── modules/
│   ├── auth/                       # User entity
│   ├── dashboard/                  # Dashboard endpoints
│   ├── student/                    # Student module (routes, services, entities, dto)
│   └── teacher/                    # Teacher module (routes, services, entities, dto)
├── shared/
│   ├── interceptors/              # Error and response interceptors
│   ├── middlewares/               # Auth, logger, role middleware
│   └── utils/                     # bcrypt, jwt utilities
└── types/
```

## Data Models

- **User (Teacher):** username, email, passwordHash, role
- **Student:** fullname, class, email
- **Exam:** title, description, duration, start/end window, examCode, accessCode
- **Question:** questionText, type, options, correctAnswer, marks
- **ExamSession:** student, exam, device fingerprint, status, time tracking
- **Answer:** student response, correct flag
- **Result:** score, percentage, grade, pass/fail status

## Scripts

```bash
npm run dev          # Start dev server with nodemon
npm run build        # Compile TypeScript
npm run start        # Run production server
npm run migrate      # Run DB migrations
npm test             # Run tests
npm run test:load    # Teacher login load test
```

## Environment Variables

```
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=root
DB_PASSWORD=
DB_NAME=online_exam_system
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=1d
```

## Getting Started

1. Install dependencies: `npm install`
2. Configure `.env` with MySQL credentials
3. Run migrations: `npm run migrate`
4. Start dev server: `npm run dev`
