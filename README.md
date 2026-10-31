# TaskFlow – Full-Stack Task Management Application

TaskFlow is a full-stack task management application designed to help users organise, manage and track their daily tasks.

The application allows users to create accounts, securely log in, manage personal tasks and monitor their productivity through an interactive dashboard.

## Features

### Authentication
- User registration and login.
- Password hashing using bcryptjs.
- JWT-based authentication.
- Protected API routes.

### Task Management
- Create, view, edit and delete tasks.
- Mark tasks as completed or pending.
- Assign low, medium or high priority.
- Add task descriptions and due dates.
- Identify overdue tasks.
- Filter tasks by status.

### Dashboard
- View all personal tasks.
- Track total, pending and completed tasks.
- Manage tasks through an interactive dashboard.
- Responsive interface.

### Security
- Passwords are hashed before storage.
- Protected routes require valid authentication tokens.
- Users can only access their own tasks.
- Input validation and error handling.
- Environment variables used for sensitive configuration.

## Technology Stack

| Frontend | Backend | Database |
|---|---|---|
| React 19 | Node.js | MongoDB |
| Vite | Express 5 | Mongoose |

Additional technologies:
- JavaScript
- JWT (JSON Web Tokens)
- bcryptjs
- CORS
- dotenv
- Nodemon
- ESLint
- Postman

## Project Structure

```text
task-manager-app/
│
├── client/
│   ├── public/
│   └── src/
│       ├── assets/
│       ├── App.jsx
│       ├── App.css
│       ├── Dashboard.jsx
│       ├── Dashboard.css
│       ├── api.js
│       ├── index.css
│       └── main.jsx
│
├── server/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── taskController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Task.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── taskRoutes.js
│   ├── tests/
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## Getting Started

### Prerequisites

Make sure you have the following installed:

- Node.js
- npm
- MongoDB Atlas account or a local MongoDB instance
- Git

### 1. Clone the repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd task-manager-app
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Configure backend environment variables

Create a `.env` file inside the `server` directory.

Add the following variables:

```env
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secure_random_secret
```

Replace the placeholder values with your own configuration. Never commit your actual `.env` file.

### 4. Start the backend

From the `server` directory, run:

```bash
npm run dev
```

The backend should run at:

`http://localhost:3000`

### 5. Install frontend dependencies

Open another terminal and navigate to the frontend:

```bash
cd client
npm install
```

Create a `.env.local` file inside the `client` directory:

```env
VITE_API_URL=http://localhost:3000
```

### 6. Start the frontend

```bash
npm run dev
```

Open the local URL displayed by Vite, normally:

`http://localhost:5173`

## API Overview

All task endpoints require a valid JWT Bearer token.

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/tasks` | Get the authenticated user's tasks |
| POST | `/api/tasks` | Create a task |
| GET | `/api/tasks/:id` | Get a specific task |
| PATCH | `/api/tasks/:id` | Update a task |
| DELETE | `/api/tasks/:id` | Delete a task |
| GET | `/api/health` | Check API status |

## Security and Data Protection

- Passwords are hashed using bcryptjs.
- JWT authentication protects task routes.
- Task ownership is enforced at the API level.
- Environment variables are excluded from version control.
- Invalid input and unauthorised requests are handled by the API.

## Future Improvements

- Password reset functionality.
- Task search and sorting.
- Improved dashboard analytics.
- Automated backend tests.
- Deployment and production configuration.

## Author

Developed as a full-stack portfolio project to demonstrate practical skills in frontend development, backend development, REST APIs, database integration and authentication.
