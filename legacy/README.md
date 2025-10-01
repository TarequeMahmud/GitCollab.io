# CollabTask - Project Documentation

## Overview

**CollabTask** is a full-stack web application designed for collaborative project management, role-based task assignment, and real-time communication. It is built using the MERN stack (MongoDB, Express, React, Node.js) and features user authentication, role management, file submission, notification systems, and dynamic dashboards.

---

## Features 🚀

- 🔐 **User Authentication**: Secure login using Passport.js with express-session.
- 🧑‍💼 **Role-Based Access Control**: Admins, Managers, Members with specific permissions.
- 📁 **Project Management**: Create, update, and delete projects.
- ✅ **Task Management**: Assign tasks, track status, priority, and progress.
<!-- - 🔄 **Real-Time Features**: Instant updates using Socket.IO. -->
- 📎 **Submission System**: Members can submit files or written responses.
  <!-- - 🔔 **Notifications**: Inform users about project activity. -->
  <!-- - 📊 **Dashboards**: Overview using cards and charts. -->

---

## Tech Stack 🛠️

- **Frontend**: React + Vite + SCSS + Context API
- **Backend**: Node.js + Express + MongoDB + Mongoose
- **Authentication**: Passport.js (session-based)
  <!-- - **Real-time Communication**: Socket.IO -->
  <!-- - **Deployment**: Docker, Vercel (Server), Netlify (Client) -->

---

## Folder Structure 📂

### Client (Frontend)

```
Client/
├── Dockerfile
├── .dockerignore
├── .env
├── index.html
├── package.json
├── package-lock.json
├── vite.config.js
├── public/
│   └── logo.png
├── src/
│   ├── App.jsx
│   ├── main.jsx
│   ├── pages/
│   ├── components/
│   ├── hooks/
│   ├── contexts/
│   ├── layouts/
│   ├── utils/
│   ├── assets/
│   └── styles/
```

### Server (Backend)

```
Server/
├── Dockerfile
├── .dockerigore
├── .env
├── package.json
├── package-lock.json
├── vercel.json
├── app.js
├── uploads/
│   └── task_submission/
│       └── file-1740418016297.txt
├── src/
│   ├── config/
│   │   └── passportConfig.js
│   ├── middlewares/
│   │   ├── isAuthenticated.js
│   │   ├── responseMiddleware.js
│   │   └── errorHandler.js
│   ├── models/
│   │   ├── Task.js
│   │   ├── User.js
│   │   └── Project.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── assigneeRouter.js
│   │   ├── taskRoutes.js
│   │   └── index.js
│   └── utils/
```

### Root Directory

```
.
├── Client/
├── Server/
├── docker-compose.yml
├── .gitignore
├── README.md
```

---

## MongoDB Schema Highlights 🧩

### User

- `name`, `email`, `password`, `role`

### Project

- `name`, `description`, `people[] { user_id, role }`, `tasks[]`, `created_by`

### Task

- `name`, `description`, `project_id`, `assigned_to`, `status`, `priority`, `comments[]`, `submission`, `submitted_at`

---

## API Structure 🌐

### Authentication (`/authRoutes`)

- POST `/register`
- POST `/login`
- GET `/logout`

### Projects (`/projectRoutes`)

- GET `/` – List all projects
- POST `/create` – Create new project
- PUT `/add-user/:projectId` – Add user to project
- GET `/details/:projectId` – Get full project info

### Tasks (`/taskRoutes`)

- POST `/create` – Create task under a project
- PUT `/update/:taskId` – Update task
- GET `/project/:projectId` – Get all tasks for project
- GET `/user` – Get tasks assigned to current user

### Assignee (`/assigneeRouter`)

- GET `/project-users/:projectId` – Get all users in project
- DELETE `/remove/:projectId/:userId` – Remove user from project

---

## Key Design Decisions ⚙️

- **Single Source of Truth**: Tasks and users are stored in their own collections; project schema references them.
- **Dynamic UI**: State managed using React Context.
- **Security**: Sensitive data (like auth) never exposed in client; session stored securely.
- **Socket.IO Integration**: Used to reflect updates across the UI in real-time without reload.(upcoming)

---

## Notifications 🔔

- Triggered by actions: task assigned, project updated, user removed.
- Types: `info`, `warning`, `success`, `error`
- Stored in a Notification schema and rendered on NotificationPage.

---

## UI Components 🧩

- **Hero Section**: Logo, Navbar, Hero Title
- **Cards**: Projects overview with progress
- **Tables**: User roles, actions
- **Modal**: User details
- **Submission UI**: Role-specific interaction
- **Charts**: Task status distribution on Dashboard

---

## Environment Variables 🌐

To configure the application, create a `.env` file in both the `Client/` and `Server/` directories with the following variables:

### Server

```env
PORT=5000
MONGO_URI=<your-mongodb-connection-string>
SESSION_SECRET=<your-session-secret>
```

## Running the Application 🚀

### Client (Frontend)

To start the client application, navigate to the `Client/` directory and run:

```bash
npm install
npm run dev
```

This will start the React application in development mode. By default, it will be accessible at `http://localhost:5173`.

### Server (Backend)

To start the server application, navigate to the `Server/` directory and run:

```bash
npm install
npm run dev
```

This will start the Node.js server in development mode. By default, it will be accessible at `http://localhost:5000`.

Make sure to configure the `.env` files in both the `Client/` and `Server/` directories before running the application.

## Usage 🧑‍💻

1. Register/Login
2. Create a project (auto-assign as admin)
3. Add managers/members
4. Create tasks and assign them
5. Collaborate using comments and submissions
6. View activity and manage via Dashboard

---

## Future Enhancements 🌱

- 📧 Email notifications
- ⏰ Task due alerts
- 🔄 Role promotion/demotion logic
- 💬 Full chat module
- 📜 Audit logs and activity feed

---

## Author 👤

**CollabTask** – Built by Tareque Mahmud to demonstrate advanced full-stack capabilities with a focus on collaborative team management.

---

## License 📄

MIT License
