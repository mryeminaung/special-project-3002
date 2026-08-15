# PIMS API — Folder Structure

Laravel 12 backend. Pattern: **Controller → Service → Model**, with Form Requests for validation and API Resources for output shaping.

```
pims-api/
├── app/
│   ├── Enums/
│   │   ├── AnnouncementAudience.php     # who can see an announcement
│   │   ├── ProjectEventType.php         # special, capstone, master/thesis
│   │   ├── ProjectProgressStatus.php    # completed, not completed, submitted, not submitted, pending
│   │   ├── ProjectStatus.php            # active, completed, under review
│   │   └── ProjectType.php              # special, capstone, master
│   │
│   ├── Events/
│   │   └── ProposalApproved.php         # fired when IC approves a proposal
│   │
│   ├── Listeners/
│   │   └── CreateProjectFromProposal.php # proposal -> project, assigns supervisor role, syncs team
│   │
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── Controller.php
│   │   │   └── Api/
│   │   │       ├── Admin/
│   │   │       │   ├── AdminController.php
│   │   │       │   └── DepartmentController.php
│   │   │       ├── Auth/
│   │   │       │   ├── AuthController.php       # login, logout, logout-all
│   │   │       │   └── ProfileController.php    # profile, update-profile, reset-password
│   │   │       ├── AnnouncementController.php
│   │   │       ├── CommentController.php
│   │   │       ├── DashboardController.php
│   │   │       ├── FacultyController.php
│   │   │       ├── FileController.php           # S3 uploads (avatar, proposal docs, reports)
│   │   │       ├── ProjectAreaController.php
│   │   │       ├── ProjectController.php
│   │   │       ├── ProjectEventController.php
│   │   │       ├── ProposalController.php
│   │   │       ├── SupervisorController.php
│   │   │       └── UserController.php
│   │   │
│   │   ├── Requests/
│   │   │   ├── AnnouncementRequest.php
│   │   │   ├── CommentRequest.php
│   │   │   ├── DepartmentRequest.php
│   │   │   ├── ProjectAreaRequest.php
│   │   │   ├── ProjectEventStoreRequest.php
│   │   │   ├── ProposalRequest.php
│   │   │   └── auth/
│   │   │       └── LoginRequest.php
│   │   │
│   │   └── Resources/
│   │       ├── AnnouncementResource.php
│   │       ├── CommentResource.php
│   │       ├── FacultyResource.php
│   │       ├── MemberResource.php
│   │       ├── ProjectDetailResource.php
│   │       ├── ProjectEventResource.php
│   │       ├── ProjectProgressResource.php
│   │       ├── ProjectResource.php
│   │       ├── ProposalResource.php
│   │       ├── StudentResource.php
│   │       ├── SupervisorResource.php
│   │       ├── UserResource.php
│   │       ├── project/
│   │       │   ├── FacultyProjectResource.php
│   │       │   └── StudentProjectResource.php
│   │       └── proposal/
│   │           ├── BrowseFacultyResource.php
│   │           ├── FacultyProposalResource.php
│   │           ├── ProposalTableResource.php
│   │           └── StudentProposalResource.php
│   │
│   ├── Models/
│   │   ├── Announcement.php
│   │   ├── Comment.php
│   │   ├── Department.php
│   │   ├── Faculty.php
│   │   ├── Major.php
│   │   ├── Project.php
│   │   ├── ProjectArea.php
│   │   ├── ProjectEvent.php
│   │   ├── Proposal.php
│   │   ├── Rank.php
│   │   ├── Student.php
│   │   └── User.php               # Sanctum tokens, Spatie roles, morphs to Student/Faculty
│   │
│   ├── Policies/
│   │   ├── AnnouncementPolicy.php
│   │   ├── CommentPolicy.php
│   │   ├── FilePolicy.php
│   │   ├── ProjectAreaPolicy.php
│   │   ├── ProjectEventPolicy.php
│   │   ├── ProjectPolicy.php
│   │   └── ProposalPolicy.php
│   │
│   ├── Providers/
│   │   ├── AppServiceProvider.php
│   │   └── EventServiceProvider.php   # registers ProposalApproved -> CreateProjectFromProposal
│   │
│   ├── Services/                       # business logic layer
│   │   ├── AnnouncementService.php
│   │   ├── CommentService.php
│   │   ├── DashboardService.php
│   │   ├── DepartmentService.php
│   │   ├── FacultyService.php
│   │   ├── FileService.php
│   │   ├── ProjectAreaService.php
│   │   ├── ProjectEventService.php
│   │   ├── ProjectService.php
│   │   ├── ProposalService.php
│   │   ├── SupervisorService.php
│   │   └── UserService.php
│   │
│   └── Traits/
│       └── ApiResponse.php            # successResponse / errorResponse / paginatedResponse
│
├── routes/
│   └── api.php                        # all routes, prefixed v1/, wrapped in auth:sanctum (except /auth/login)
│
├── database/
│   ├── migrations/                    # 22 migrations, full schema
│   ├── seeders/                       # roles, departments, majors, ranks, faculties, students, project areas
│   └── factories/
│
├── config/
│   └── filesystems.php                # S3 config for file storage
│
├── tests/
│   ├── Feature/
│   └── Unit/
│
├── docs/
│   ├── API_ENDPOINTS.md               # full endpoint reference
│   └── FOLDER_STRUCTURE.md            # this file
│
├── bootstrap/
│   └── app.php                        # registers role:, permission:, role_or_permission: middleware aliases
│
├── public/
├── resources/
└── storage/
```

## Layer responsibilities

- **Controllers** (`Http/Controllers/Api/`) — thin, delegate to Services, return via `ApiResponse` trait.
- **Services** (`Services/`) — business logic: validation orchestration, DB transactions, event dispatching. Return arrays with `success`, `message`, optional `data`/`status`.
- **Form Requests** (`Http/Requests/`) — input validation, one per resource/action group.
- **Resources** (`Http/Resources/`) — shape Eloquent models for API output; some resources have role-specific variants (`project/`, `proposal/` subfolders).
- **Policies** (`Policies/`) — authorization gates for store/update/delete actions (e.g. only IC approves proposals, only owner deletes).
- **Models** (`Models/`) — Eloquent, RBAC via Spatie Permission (`admin`, `ic`, `supervisor`, `faculty`, `student`, `student-affairs`).
