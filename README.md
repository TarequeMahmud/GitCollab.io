# GitCollab — Collaborative Project & Task Management Platform

[![MIT License](https://img.shields.io/badge/license-MIT-green.svg)](./LICENSE)
[![Stack](https://img.shields.io/badge/stack-Next.js%20%7C%20Django%20%7C%20Postgres-blue.svg)]()

> **GitCollab** is a modern, full-stack multi-tenant project and task management platform focused on collaboration, role-based access control, and a clean developer experience. Originally developed as a MERN app (`CollabTask`) and preserved in `/legacy`, GitCollab has been migrated to a production-ready stack using **Next.js (TypeScript)** for the frontend and **Django + Django REST Framework** for the backend with **PostgreSQL**.

---

## 🎯 Why GitCollab

GitCollab is built to help engineering teams, product managers and contributors collaborate on projects with clear roles, task ownership, and lightweight submission workflows. It emphasizes:

- Clear separation of concerns (client / server / legacy)
- Developer-friendly DX with TypeScript & DRF
- Production-grade deployment patterns with Docker & AWS readiness
- Extensibility for integrations (email, search, WebSockets)

---

## ✨ Highlights / Core Features

- **Authentication**: JWT-based auth with role-aware guards
- **Projects**: Create, invite contributors, set roles
- **Tasks**: Create tasks, assign to users, set priority and deadlines
- **Submission System**: Users can upload files or submit text against tasks
- **Role-based Permissions**: Admin / Manager / Contributor / Viewer
- **Multi-tenant-friendly**: Projects act as isolated collaboration spaces
- **Notifications**: In-app notifications for assignments and updates
- **Legacy preservation**: Original MERN app kept in `/legacy` for reference

---

## 🧭 Tech Stack

**Frontend**
- Next.js 15 (App Router) + TypeScript
- Tailwind CSS

**Backend**
- Django 4.x + Django REST Framework
- PostgreSQL
- JWT (Simple JWT) for authentication

**Dev / Ops**
- Docker + docker-compose
- AWS-ready (RDS for Postgres, S3 for uploads, ECS/EC2 for services)

---

## 🗂 Project Layout (short)

```
.
├── client/         # Current Next.js frontend (TypeScript)
├── server/         # Current Django backend (DRF)
├── legacy/         # Archived MERN app (React + Express + MongoDB)
├── docker-compose.yml
└── README.md
```

> Below is *the full current frontend and backend folder structure* (useful for recruiters and contributors). The structure mirrors the actual repository used during development.

### Frontend (client)

```
client/
├── eslint.config.mjs
├── next.config.ts
├── package.json
├── public/
│   └── logo.png
├── src/
│   ├── app/
│   │   ├── auth/
│   │   │   └── page.tsx
│   │   ├── conversations/
│   │   │   └── page.tsx
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── notifications/
│   │   │   └── page.tsx
│   │   ├── page.tsx
│   │   ├── projects/
│   │   │   ├── create/page.tsx
│   │   │   ├── page.tsx
│   │   │   └── [projectId]/
│   │   │       └── tasks/[taskId]/page.tsx
│   │   └── tasks/page.tsx
│   ├── assets/
│   ├── components/
│   │   ├── AlertBar.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── TaskCard.tsx
│   │   └── UserTable.tsx
│   ├── contexts/
│   │   ├── AlertContext.tsx
│   │   ├── AuthContext.tsx
│   │   └── ProjectsContext.tsx
│   ├── services/fetch.ts
│   └── types/
└── tsconfig.json
```

### Backend (server)

```
server/
├── manage.py
├── gitcollab/
│   ├── settings.py
│   └── urls.py
├── accounts/
│   ├── models.py
│   └── views.py
├── projects/
│   ├── models.py
│   ├── serializers.py
│   └── views.py
└── tasks/
    ├── models.py
    ├── serializers.py
    └── views.py
```

---

## 📦 Getting Started (Developer)

> These are quickstart instructions focused on local setup. For production, see the **Deployment** section.

### Prerequisites

- Node.js >= 18
- Python >= 3.10
- PostgreSQL
- Docker (recommended)

### 1) Clone

```bash
git clone <repo-url>
cd gitcollab
```

### 2) Frontend (client)

```bash
cd client
npm install
npm run dev
```

Open: `http://localhost:3000`

### 3) Backend (server)

```bash
cd server
python -m venv .venv
source .venv/bin/activate    # macOS / Linux
.\.venv\Scripts\activate   # Windows (PowerShell)

pip install -r requirements.txt
# configure your local .env (see below)
python manage.py migrate
python manage.py createsuperuser
python manage.py runserver
```

API: `http://localhost:8000`

---

## 🔐 Environment Variables (examples)

### Backend (`server/.env`)

```
DJANGO_SECRET_KEY=
DB_NAME=
DB_USER=
DB_PASSWORD=
DB_HOST=
DB_PORT=5432
JWT_SECRET_KEY=
```

### Frontend (`client/.env`)

```
NEXT_PUBLIC_BACKEND_URL=http://localhost:8000
```

---

## 🐳 Docker (dev)

A `docker-compose.yml` at the repo root orchestrates the **client**, **server**, and **postgres** services. Example:

```bash
# start everything
docker compose up --build
```

---

## 🧪 Tests

- Backend: Django `python manage.py test` (unit & integration tests)
- Frontend: `npm run test` (if tests are present)

---

## 🛠 Code Quality & CI

- ESLint and Prettier for frontend
- Black / isort / flake8 for backend
- GitHub Actions workflow for PR checks (lint, test, build)

> Add CI workflows in `.github/workflows/` to run automated checks.

---

## 📈 Architecture & Diagrams (placeholders)

> Use the `./docs/diagrams/` directory to add visuals. The README includes placeholders so recruiters can quickly inspect visuals.

- **API Request Lifecycle** (placeholder)
  - `![API Request Lifecycle](./docs/diagrams/api-request-lifecycle.png)`

- **Entity Relationship Diagram (ERD)** (placeholder)
  - `![ERD](./docs/diagrams/erd.png)`

- **Component / Module Map** (placeholder)
  - `![Module Map](./docs/diagrams/module-map.png)`

> **Tip for recruiters**: expect to see a streamlined flow: Next.js(frontend) → DRF(API) → PostgreSQL(database) with optional S3 for static/uploads and Redis for caching or pub/sub.

---

## 🚀 Deployment (high-level)

- Build and push Docker images for `client` and `server`.
- Use AWS RDS for PostgreSQL, ECS/Fargate or EC2 for services, and S3 for uploads.
- Set environment variables in your deployment environment, wire up a load balancer, and apply HTTPS.

Detailed deployment instructions (Terraform / CloudFormation / GitHub Actions) can be added to `/docs/deployment.md`.

---

## ♻️ Legacy

The `legacy/` folder contains the older MERN stack implementation (CollabTask). It is preserved for reference, migration notes, and to show historic design decisions.

---

## 🧑‍💼 For Recruiters

**Why review GitCollab?**
- Real-world migration story (MERN → Next.js + Django) demonstrates system thinking, upgrade path planning, and backwards compatibility.
- Clear separation of concerns and deliberate tooling choices (TypeScript, Django, Postgres).
- Repository includes frontend, backend, and historical context — good to evaluate full-stack engineering abilities.

If you'd like a live demo or a walkthrough of particular features (auth flow, task-assignment lifecycle, or permission model), email: `tarequemahmud313@gmail.com` or open an issue / PR in the repo.

---

## 🙌 Contributing

Contributions are welcome. Please follow these steps:

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/my-feature`)
3. Run tests and linters
4. Submit a PR describing the changes

---

## 📜 License

MIT © 2025 — Tareque Mahmud

---

*README created to be recruiter-friendly — include diagrams under `./docs/diagrams` and a short demo script in `/docs/demo.md` to make the repo stand out.*
