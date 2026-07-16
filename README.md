# 🎓 MIIT Special Projects Management System (SPMS)

A full-stack, role-based web application designed to streamline the Final Year Project (FYP) and academic special projects workflow for students and faculty at MIIT (Myanmar Institute of Information Technology). It provides distinct dashboards for students, supervisors, and administrative staff, centralizing task tracking, submission management, and grading.

---

## 📑 Table of Contents

- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Features](#-features)
- [Roles & Permissions](#-roles--permissions)
- [Database Schema](#-database-schema)
- [API Endpoints](#-api-endpoints)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)

---

## 🛠 Tech Stack

### Backend

| Category | Technology |
|----------|------------|
| Language | PHP 8.2+ |
| Framework | Laravel 12 |
| Authentication | Laravel Sanctum 4 (Token-based SPA auth) |
| Roles & Permissions | Spatie Laravel Permission 6 |
| API Resources | API Platform (api-platform/laravel 4) |
| File Storage | AWS S3 (league/flysystem-aws-s3-v3) |
| Excel Import/Export | Maatwebsite Excel |
| Database | PostgreSQL (default), also supports MySQL, SQLite, MariaDB, SQL Server |
| Queue & Cache | Database-driven |
| Testing | PHPUnit 11 |

### Frontend

| Category | Technology |
|----------|------------|
| Language | TypeScript 5.9 |
| Framework | React 19 |
| Build Tool | Vite 7 |
| Styling | Tailwind CSS 4 |
| Routing | React Router 7 |
| State Management | Zustand 5 (persisted to localStorage) |
| Data Fetching | TanStack React Query 5 + Axios |
| Data Tables | TanStack React Table 8 |
| Forms | React Hook Form 7 + Zod 4 |
| UI Components | Radix UI (shadcn/ui pattern) |
| Icons | Tabler Icons, Heroicons, Lucide React |
| Drag & Drop | @dnd-kit |
| Charts | Recharts |
| Animations | Motion (Framer Motion successor) |

---

## 📁 Project Structure

```
special-project-3002/
├── backend/                     # Laravel 12 API server
│   ├── app/
│   │   ├── Http/
│   │   │   ├── Controllers/     # API controllers
│   │   │   ├── Requests/        # Form request validation
│   │   │   └── Resources/       # API resources
│   │   ├── Models/              # Eloquent models
│   │   ├── Events/              # Event classes
│   │   ├── Listeners/           # Event listeners
│   │   ├── Enums/               # PHP enums
│   │   └── Traits/              # Shared traits (ApiResponse)
│   ├── config/                  # Configuration files
│   ├── database/
│   │   ├── migrations/          # Database migrations
│   │   └── seeders/             # Data seeders
│   ├── routes/
│   │   └── api.php              # API route definitions
│   └── storage/
│
├── web/                         # React 19 SPA frontend
│   ├── src/
│   │   ├── api/                 # Axios instance & interceptors
│   │   ├── components/          # Shared components
│   │   │   └── ui/              # 30 Radix/shadcn-style UI primitives
│   │   ├── hooks/               # Custom React hooks
│   │   ├── layouts/             # AuthLayout, GuestLayout, SettingsLayout
│   │   ├── lib/                 # Utilities (cn, HasRole, status helpers)
│   │   ├── pages/               # Page components (see below)
│   │   ├── routes/              # Route definitions
│   │   ├── stores/              # Zustand stores (auth, theme, events, header)
│   │   └── types/               # TypeScript interfaces
│   ├── components.json          # shadcn/ui config
│   ├── vite.config.ts
│   └── package.json
│
└── README.md
```

---

## ✨ Features

### Authentication & Authorization
- Token-based authentication via Laravel Sanctum
- Role-based dashboards and navigation
- Profile management (avatar upload to S3, password reset, personal info)

### Proposal Management
- Students can create project proposals with team members
- Browse available project areas and supervisors
- Proposal status tracking (Pending → Approved/Rejected)
- IC (Internal Committee) approval/rejection workflow
- Comments and discussions on proposals

### Project Lifecycle
- Automatic project creation upon proposal approval
- Project status tracking: Not Started → Active → Under Review → Completed
- Mid-report, mid-seminar, final-report, final-seminar tracking
- Supervisor assignment and project supervision

### Announcements
- Role-based announcement system
- Audience targeting (All, Students, Faculty, etc.)
- Create and browse announcements

### Dashboard
- **IC/Admin Dashboard**: Proposal statistics, approval rates, project overview
- **Faculty/Supervisor Dashboard**: Assigned proposals, assigned projects, workload
- **Student Dashboard**: Personal proposals, projects, progress tracking
- **Student Affairs Dashboard**: Cross-cutting view of proposals and projects

### UI/UX
- Responsive design with mobile support
- Dark/light theme toggle
- Data tables with sorting, filtering, and pagination
- Charts and analytics visualizations
- Drag-and-drop interfaces

---

## 🔐 Roles & Permissions

| Role | Description |
|------|-------------|
| **IC** | Internal Committee — can approve/reject proposals |
| **Student Affairs** | Administrative staff — manages students and projects |
| **Supervisor** | Faculty assigned to supervise projects (auto-assigned on proposal approval) |
| **Faculty** | Academic staff with general access |
| **Student** | Enrolled students who create proposals and work on projects |
| **Project Leader** | Student leading a specific project (defined but not yet auto-assigned) |

### Permissions

| Permission | Roles |
|------------|-------|
| Approve proposal | IC |
| Reject proposal | IC |
| Create proposal | Student |
| Edit proposal | Student, IC |
| Edit project | Supervisor |
| Delete project | Supervisor |
| Submit reports | Student, Supervisor |
| Create/Edit/Delete tasks | Supervisor |

---

## 🗄 Database Schema

### Core Tables

| Table | Description |
|-------|-------------|
| `users` | User accounts (students and non-students) |
| `students` | Student profiles (phone, GPA, graduation status, major) |
| `faculties` | Faculty profiles (phone, address, rank, department) |
| `departments` | Faculty departments |
| `majors` | Student majors (CSE, ECE, etc.) |
| `ranks` | Faculty academic ranks |
| `project_areas` | Research/project areas |
| `proposals` | Project proposals with status, type, and metadata |
| `projects` | Active projects (created from approved proposals) |
| `comments` | Discussion comments on proposals |
| `announcements` | System announcements with audience targeting |

### Pivot Tables

| Table | Description |
|-------|-------------|
| `proposal_student` | Team members for a proposal |
| `project_student` | Team members for a project |

---

## 🌐 API Endpoints

All endpoints are prefixed with `/api`. Most require `auth:sanctum` middleware.

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/login` | User login |
| POST | `/logout` | User logout |
| PATCH | `/update-profile` | Update profile info |
| POST | `/reset-password` | Reset password |
| POST | `/upload-profile-picture` | Upload avatar to S3 |
| DELETE | `/delete-profile-picture` | Delete avatar from S3 |

### Proposals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/proposals` | List all proposals (paginated) |
| POST | `/proposals/create` | Create a new proposal |
| GET | `/proposals/my-proposals` | Student's own proposals |
| GET | `/proposals/browse-proposals` | Supervisor's assigned proposals |
| GET | `/proposals/{slug}/detail` | Proposal detail |
| DELETE | `/proposals/{slug}/delete` | Delete proposal |
| POST | `/proposals/{slug}/approve` | IC approves proposal |
| POST | `/proposals/{slug}/reject` | IC rejects proposal |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/comments/create` | Add comment to proposal |
| GET | `/comments/{proposal_id}` | Get comments for proposal |
| DELETE | `/comments/{comment}` | Delete comment |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List all projects |
| GET | `/assigned-projects` | Supervisor's assigned projects |
| GET | `/projects/{slug}/detail` | Project detail |

### Resources

| Method | Endpoint | Description |
|--------|----------|-------------|
| CRUD | `/announcements` | Announcements management |
| CRUD | `/tasks` | Task management |
| CRUD | `/project-areas` | Project areas management |

### Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Role-specific dashboard data |
| GET | `/faculties-for-proposal` | Faculty list for proposal form |
| GET | `/students-for-proposal` | Students for team selection |
| GET | `/faculties/lists` | Faculty listing |
| GET | `/supervisors` | Supervisor listing |
| GET | `/supervisors/{id}/detail` | Supervisor detail |

---

## 🚀 Getting Started

### Prerequisites

- PHP 8.2+
- Composer
- Node.js 18+ & npm
- PostgreSQL (or your preferred database)
- AWS S3 bucket (for file uploads)

### Backend Setup

```bash
cd backend

# Install PHP dependencies
composer install

# Copy environment file
cp .env.example .env

# Generate application key
php artisan key:generate

# Configure database and S3 credentials in .env
# Run migrations and seeders
php artisan migrate:fresh --seed

# Start the development server
php artisan serve
```

### Frontend Setup

```bash
cd web

# Install dependencies
npm install

# Start the development server (runs on localhost:3000, proxies API to localhost:8000)
npm run dev
```

### Using the Dev Script

```bash
cd backend

# Run backend + queue worker + frontend concurrently
composer dev
```

---

## ⚙️ Environment Variables

### Backend (`backend/.env`)

| Variable | Description |
|----------|-------------|
| `APP_NAME` | Application name |
| `APP_URL` | Backend URL (default: `http://localhost:8000`) |
| `DB_CONNECTION` | Database driver (`pgsql` default) |
| `DB_HOST` | Database host |
| `DB_PORT` | Database port |
| `DB_DATABASE` | Database name |
| `DB_USERNAME` | Database user |
| `DB_PASSWORD` | Database password |
| `QUEUE_CONNECTION` | Queue driver (`database`) |
| `AWS_ACCESS_KEY_ID` | AWS S3 access key |
| `AWS_SECRET_ACCESS_KEY` | AWS S3 secret key |
| `AWS_DEFAULT_REGION` | AWS S3 region |
| `AWS_BUCKET` | S3 bucket name |

### Frontend (`web/.env`)

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL (default: `http://localhost:8000/api`) |

---

## 📝 License

This project is part of the MIIT academic curriculum — Special Project 3002.
