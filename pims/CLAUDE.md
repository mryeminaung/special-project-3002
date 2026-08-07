# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

MIIT Special Project Management System — a full-stack web app for managing academic project proposals, supervisor assignments, and project tracking. The `web/` directory is the React SPA frontend; the backend is a Laravel PHP API at `backend/`.

## Development Commands

```bash
cd web
npm run dev          # Dev server at localhost:3000 (proxies API to localhost:8000)
npm run build        # tsc -b && vite build
npm run lint         # ESLint
```

No test runner is configured. No single-test command exists.

## Architecture

**Stack:** React 19, TypeScript, Vite, Tailwind CSS 4, Zustand, React Router 7, React Hook Form + Zod, TanStack Table, Axios, shadcn/ui (Radix primitives).

**Path alias:** `@/` maps to `src/`.

### Feature-Based Organization

`src/features/` contains domain modules: `admin`, `announcements`, `auth`, `dashboard`, `events`, `faculties`, `projects`, `proposals`, `settings`, `supervisors`. Each feature typically has:
- A route file (e.g. `projects.route.ts`) exporting a routes array
- An `index.ts` barrel that re-exports routes (and optionally components)
- `pages/` for page-level components, `components/` for feature-specific UI, `services/` for API logic

Feature routes are spread into the main `src/routes/index.ts` route tree under the `ProtectedRoute` guard.

### Role-Based Rendering

Five roles: `admin`, `ic`, `supervisor`, `faculty`, `student`, `student-affairs`. Role checking uses `HasRole(role)` from `src/lib/utils.ts` (synchronous, reads from Zustand auth store) and `useRoleChecker()` hook which returns booleans (`isStudent`, `isAdmin`, `isIC`, `isSupervisor`, `isFaculty`).

`DashboardPage` switches on role to render the correct dashboard variant. `AppSidebar` builds navigation items from `NAV_ITEMS` in `src/constants/navigation.ts`, filtered by role.

### State Management

Zustand stores in `src/stores/`:
- `use-auth-store` — persisted (`localStorage`, key `spms-auth`), holds `authUser` and `token`
- `use-event-store` — event enrollment state, API calls for project events
- `use-site-header-store` — current page title/subtitle for the site header
- `use-theme-store` — dark mode toggle

### API Layer

`src/api/api.ts` — Axios instance with base URL `http://localhost:8000/api/v1`. Request interceptor attaches Bearer token. Response interceptor catches 401 and redirects to login. The backend runs at port 8000; the Vite dev server proxies `/api` requests.

### Page Pattern

Every page follows this structure:
1. Call `useHeaderInitializer(PAGE_META.xxx.title, PAGE_META.xxx.subtitle)` to set the browser tab title and site header text.
2. Render inside `<PageWrapper>` (a `max-w-7xl` container).
3. Use `<Heading title={...} description={...} />` for the page title.
4. Page titles/subtitles are centralized in `src/constants/navigation.ts` (`PAGE_META`, `HEADINGS`, `NAV_ITEMS`).

### Layouts

- `AuthLayout` — sidebar + header shell, used by `ProtectedRoute`
- `GuestLayout` / `SettingsLayout` — alternate layouts for specific sections

### Route Structure

`src/routes/index.ts` is the single route tree. It wraps protected routes under `ProtectedRoute` (checks auth token, redirects to `/auth/login` if missing, redirects `/` to `/dashboard`). Feature routes are spread as children of the protected layout.

## Conventions

- Use `cn()` (clsx + tailwind-merge) for conditional class merging.
- Icons come from `@tabler/icons-react` (primary) and `lucide-react` (secondary).
- Forms use `react-hook-form` with `zod` schemas via `@hookform/resolvers`.
- Use `date-fns` for date formatting.
- Notifications via `sonner` or `react-hot-toast`.
- Dark mode support via `next-themes` / `use-theme` hook.
- Event types: `special`, `capstone`, `master-thesis` — stored in `src/features/events/events.type.ts`.
