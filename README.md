# DevPulse

A RESTful issue tracking API built with Express, TypeScript, PostgreSQL, JWT authentication, and role-based access control.

---

## Live URL

[https://next-level-assignment-02-ten.vercel.app/](https://next-level-assignment-02-ten.vercel.app/)

---

## Features

* User registration and login with encrypted passwords
* JWT-based authentication
* Role-based authorization (`contributor`, `maintainer`)
* Create, read, update, and delete issues
* Public issue listing and issue details
* Filtering by type and status
* Sorting by newest or oldest issues
* Contributor ownership validation for updates
* Maintainer-only deletion and status control
* Centralized error handling
* Consistent API response structure

---

## Tech Stack

* Node.js
* Express.js
* TypeScript
* PostgreSQL
* node-postgres (`pg`)
* JSON Web Token (`jsonwebtoken`)
* bcrypt
* dotenv
* tsx
* tsup
* Vercel

---

## Setup Steps

1. Clone the repository

```bash
git clone https://github.com/AJAmran/next-level-assignment-02.git
cd leve-2-assignment-02
```

2. Install dependencies

```bash
npm install
```

3. Create `.env` file

```env
PORT=5000
CONNECTION_STRING=your_postgresql_connection_string
JWT_SECRET_KEY=your_jwt_secret
BCRYPT_SALT_ROUNDS=12
JWT_EXPIRES_IN=1d
NODE_ENV=development
```

4. Run development server

```bash
npm run dev
```

5. Build project

```bash
npm run build
```

6. Start production server

```bash
npm start
```

---

## API Endpoints

### Root

| Method | Endpoint | Access | Description                  |
| ------ | -------- | ------ | ---------------------------- |
| GET    | `/`      | Public | Health check / welcome route |

---

### Authentication

| Method | Endpoint           | Access | Description             |
| ------ | ------------------ | ------ | ----------------------- |
| POST   | `/api/auth/signup` | Public | Register new user       |
| POST   | `/api/auth/login`  | Public | Login and get JWT token |

#### Signup Body

```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword",
  "role": "contributor"
}
```

#### Login Body

```json
{
  "email": "john@example.com",
  "password": "securePassword"
}
```

---

### Issues

| Method | Endpoint          | Access                  | Description     |
| ------ | ----------------- | ----------------------- | --------------- |
| GET    | `/api/issues`     | Public                  | Get all issues  |
| GET    | `/api/issues/:id` | Public                  | Get issue by ID |
| POST   | `/api/issues`     | Contributor, Maintainer | Create issue    |
| PATCH  | `/api/issues/:id` | Contributor, Maintainer | Update issue    |
| DELETE | `/api/issues/:id` | Maintainer only         | Delete issue    |

---

### Query Parameters

| Parameter | Values                      | Description           |
| --------- | --------------------------- | --------------------- |
| sort      | newest, oldest              | Sort by creation date |
| type      | bug, feature_request        | Filter by type        |
| status    | open, in_progress, resolved | Filter by status      |

Example:

```http
GET /api/issues?sort=newest&type=bug&status=open
```

---

### Authorization

```http
Authorization: <access_token>
```

---

## Database Schema Summary

### users

| Column     | Type         | Constraints                                     |
| ---------- | ------------ | ----------------------------------------------- |
| id         | SERIAL       | Primary key                                     |
| name       | VARCHAR(255) | Required                                        |
| email      | VARCHAR(255) | Unique, required                                |
| password   | VARCHAR(255) | Hashed, required                                |
| role       | VARCHAR(20)  | contributor / maintainer (default: contributor) |
| created_at | TIMESTAMP    | Default now                                     |
| updated_at | TIMESTAMP    | Default now                                     |

---

### issues

| Column      | Type         | Constraints                   |
| ----------- | ------------ | ----------------------------- |
| id          | SERIAL       | Primary key                   |
| title       | VARCHAR(150) | Required                      |
| description | TEXT         | Min 20 chars                  |
| type        | VARCHAR(50)  | bug / feature_request         |
| status      | VARCHAR(50)  | open / in_progress / resolved |
| reporter_id | INT          | Foreign key (users)           |
| created_at  | TIMESTAMP    | Default now                   |
| updated_at  | TIMESTAMP    | Default now                   |

---

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start development server |
| `npm run build` | Build project            |
| `npm start`     | Run production server    |

---