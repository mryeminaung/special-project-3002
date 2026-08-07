# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MIIT Special Project Management System — Laravel 12 backend API. Manages academic project proposals, supervisor assignments, project tracking, announcements, and file uploads (S3). Frontend is a React SPA in `web/` that proxies to this API at `localhost:8000`.

## Development Commands

```bash
cd backend
composer install                    # Install PHP deps
php artisan serve                   # Dev server at localhost:8000
php artisan migrate                 # Run migrations
php artisan db:seed                 # Seed database
php artisan test                    # Run tests (uses SQLite in-memory)
php artisan queue:listen --tries=1  # Start queue worker
composer dev                         # All-in-one: serve + queue + vite
composer test                        # Clear config cache then test
```

## Architecture

**Stack:** Laravel 12, PHP 8.2+, Sanctum (token auth), Spatie Permission (RBAC), Maatwebsite Excel, AWS S3 for file storage.

### API Route Structure

All routes in `routes/api.php` under `v1/` prefix, wrapped in `auth:sanctum` middleware. Auth routes (`/auth/login`, `/auth/logout`) are public/guest. Admin-only routes use `role:admin` middleware alias (Spatie).

### Controller → Service → Model Pattern

Controllers are thin — they delegate to Services for business logic and return responses via the `ApiResponse` trait. Services contain the actual logic (validation, transactions, event dispatching). Request validation uses Form Requests in `Http/Requests/`.

```
Controller (uses ApiResponse trait)
  → Service (business logic)
    → Model (Eloquent)
```

### Response Format

All API responses use the `ApiResponse` trait (`successResponse`, `errorResponse`, `paginatedResponse`). Consistent shape:
```json
{ "success": true/false, "message": "...", "data": ..., "status": 200 }
```

### Roles and Permissions

Spatie Permission manages roles: `admin`, `ic`, `supervisor`, `faculty`, `student`, `student-affairs`. Middleware aliases registered in `bootstrap/app.php`: `role:`, `permission:`, `role_or_permission:`.

Policies in `app/Policies/` gate resource actions (e.g. only IC can approve/reject proposals, only owner can delete).

### Event System

`ProposalApproved` event fires when a proposal is approved. Listener `CreateProjectFromProposal` transforms the proposal into a Project, assigns `supervisor` role to the supervisor, and syncs team members. Registered in `EventServiceProvider`.

### Enums

- `ProjectType`: `special`, `capstone`, `master`
- `ProjectEventType`: `special`, `capstone`, `master/thesis` (note: different casing from ProjectType)
- `ProjectStatus`: `active`, `completed`, `under review`
- `ProjectProgressStatus`: `completed`, `not completed`, `submitted`, `not submitted`, `pending`
- `AnnouncementAudience`: controls who sees announcements

### Models

Key models: `User` (has Sanctum tokens, Spatie roles, morphs to Student/Faculty), `Proposal` (belongs to student leader or faculty, has many applications via `proposal_student` pivot with status), `Project` (created from approved proposals), `ProjectEvent` (controls enrollment windows per event type), `Announcement`, `Comment`.

### File Storage

S3 for uploads — proposal documents, profile pictures, reports. `FileController` handles uploads. Configured via `config/filesystems.php`.

### CORS

Allowed origin: `http://localhost:3000` (the Vite dev server). Credentials enabled.

## Conventions

- Models use `$fillable` for mass assignment; timestamps disabled on some models (`User`, `Project`).
- Slugs generated via `Str::slug()` for proposals, project areas, and projects.
- Services return arrays with `success`, `message`, optional `data` and `status` keys.
- Form Requests handle validation — `ProposalRequest`, `AnnouncementRequest`, `CommentRequest`, etc.
- Resources in `Http/Resources/` transform Eloquent models to API responses. Some resources have type-specific variants (e.g. `StudentProposalResource`, `FacultyProposalResource`, `BrowseFacultyResource`).
- Migrations in `database/migrations/` — 22 total covering the full schema.
- Seeders in `database/seeders/` — roles, departments, majors, ranks, faculties, students, project areas.
