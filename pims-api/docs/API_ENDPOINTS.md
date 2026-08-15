# PIMS API Endpoints

> Base URL: `/api/v1`
> Authentication: Sanctum Bearer Token (`Authorization: Bearer <token>`)
> All endpoints except login require `auth:sanctum` middleware.

---

## Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/login` | Authenticate user, returns user data + Sanctum token |
| POST | `/auth/logout` | Revoke current access token |
| POST | `/auth/logout-all` | Revoke all tokens for the authenticated user |

---

## Profile

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/profile` | Get authenticated user's profile with student/faculty relations |
| PATCH | `/update-profile` | Update phone number and address |
| POST | `/reset-password` | Change password after verifying current password |

---

## Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Returns role-specific dashboard data (IC, Admin, Faculty/Supervisor, Student) |

---

## Announcements

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/announcements` | List announcements (filterable by `?audience=`) |
| GET | `/announcements/{announcement}` | Show a single announcement |
| POST | `/announcements` | Create an announcement *(policy-gated)* |
| PATCH | `/announcements/{announcement}` | Update an announcement *(policy-gated)* |
| DELETE | `/announcements/{announcement}` | Delete an announcement *(policy-gated)* |

---

## Proposals

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/proposals` | Paginated list of all proposals |
| POST | `/proposals` | Create a new proposal (student or faculty type) |
| GET | `/proposals/me` | List proposals belonging to the authenticated student |
| GET | `/proposals/browse` | List proposals available for a supervisor to browse |
| GET | `/proposals/faculties` | List faculty proposals with joined count |
| GET | `/proposals/{slug}` | Show proposal detail |
| DELETE | `/proposals/{slug}` | Delete a proposal *(policy-gated)* |
| POST | `/proposals/{slug}/join` | Faculty joins a faculty-type proposal |
| POST | `/proposals/{slug}/applications/{student:id}/accept` | Supervisor accepts a student applicant |
| POST | `/proposals/{slug}/applications/{student:id}/reject` | Supervisor rejects a student applicant |
| POST | `/proposals/{slug}/approve` | IC approves a proposal *(policy-gated)* |
| POST | `/proposals/{slug}/reject` | IC rejects a proposal *(policy-gated)* |

---

## Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/projects` | List all projects |
| GET | `/assigned-projects` | List projects assigned to the authenticated user |
| GET | `/projects/me` | List projects for the authenticated student |
| GET | `/projects/{slug}` | Show project detail (auto-updates milestone status) |
| PATCH | `/projects/{slug}/seminar-deadlines` | Update mid/final seminar deadlines *(policy-gated)* |
| PATCH | `/projects/{slug}/seminar-status` | Update mid/final seminar completion status *(policy-gated)* |
| PATCH | `/projects/{slug}/report-status` | Update mid/final report submission status *(policy-gated)* |

---

## Project Events

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/project-events` | List all project events |
| POST | `/project-events` | Create a project event *(policy-gated)* |
| PUT/PATCH | `/project-events/{projectEvent}` | Update a project event *(policy-gated)* |
| DELETE | `/project-events/{projectEvent}` | Delete a project event *(policy-gated)* |
| POST | `/project-events/{projectEvent}/toggle-active` | Toggle active/inactive status *(policy-gated)* |

---

## Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/comments` | List all comments *(policy-gated)* |
| GET | `/comments/{proposal:id}` | List comments for a specific proposal |
| POST | `/comments` | Create a comment on a proposal |
| PATCH | `/comments/{proposal:id}/{comment}` | Update a specific comment |
| DELETE | `/comments/{comment}` | Delete a comment *(policy-gated)* |

---

## Project Areas

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/project-areas` | List all project areas |
| GET | `/project-areas/{slug}` | Show a project area by slug |
| POST | `/project-areas` | Create a project area *(policy-gated)* |
| PATCH | `/project-areas/{slug}` | Update a project area *(policy-gated)* |
| DELETE | `/project-areas/{slug}` | Delete a project area *(policy-gated)* |

---

## Faculties

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/faculties` | List all faculties |
| GET | `/faculties/{faculty}/detail` | Faculty detail: profile, active projects, past projects |
| GET | `/faculties-for-proposal` | List faculty with workload counts and max capacity (for proposal creation) |

---

## Supervisors

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/supervisors` | List all supervisors |
| GET | `/supervisors/{supervisor:id}/detail` | Supervisor detail: profile, active projects, past projects |

---

## Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/students-for-proposal` | List students available for a proposal (scoped to authenticated user) |

---

## File Uploads

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/upload-profile-picture` | Upload an image as the user's avatar |
| DELETE | `/delete-profile-picture` | Delete the user's avatar |
| POST | `/upload-to-s3` | Upload a proposal document (PDF/DOC/DOCX, max 10MB) |
| POST | `/upload-report` | Upload a mid/final report file for a project (PDF/DOC/DOCX, max 10MB) |
| POST | `/delete-report` | Delete a mid or final report for a project |

---

## Admin — Departments

> All department routes require `role:admin` middleware.

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/admin/departments` | List all departments |
| POST | `/admin/departments` | Create a department |
| GET | `/admin/departments/{department}` | Show a single department |
| PUT/PATCH | `/admin/departments/{department}` | Update a department |
| DELETE | `/admin/departments/{department}` | Delete a department |

---

## Summary

| Category | Count |
|----------|-------|
| Authentication | 3 |
| Profile | 3 |
| Dashboard | 1 |
| Announcements | 5 |
| Proposals | 12 |
| Projects | 7 |
| Project Events | 5 |
| Comments | 5 |
| Project Areas | 5 |
| Faculties | 3 |
| Supervisors | 2 |
| Users | 1 |
| File Uploads | 5 |
| Admin (Departments) | 5 |
| **Total** | **~62** |

### Notes

- All routes are prefixed with `/api/v1`.
- All routes except `/auth/login` require `auth:sanctum` middleware.
- Department routes additionally require `role:admin` middleware.
- Many controllers use Laravel Policies (Gate) for authorization on store/update/delete operations.
- Specialized API Resources are used for different contexts (e.g., `ProposalTableResource` for lists vs `StudentProposalResource`/`FacultyProposalResource` for detail views).
