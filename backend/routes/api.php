<?php

use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\Admin\AdminController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\Auth\ProfileController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\ProjectAreaController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectEventController;
use App\Http\Controllers\Api\ProposalController;
use App\Http\Controllers\Api\SupervisorController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix("v1/auth")->group(function () {
    // Authentication routes
    Route::controller(AuthController::class)->group(function () {
        Route::post('/login', 'login')->middleware('guest');
        Route::post('/logout', 'logout')->middleware('auth:sanctum');
        Route::post('/logout-all', 'logoutAll')->middleware('auth:sanctum');
    });
});

Route::prefix("v1/")->middleware('auth:sanctum')->group(function () {

    // profile routes
    Route::controller(ProfileController::class)->group(function () {
        Route::get("/profile", 'showProfile');
        Route::patch("/update-profile", 'updateProfile');
        Route::post("/reset-password", 'resetPassword');
    });

    // comment routes
    Route::controller(CommentController::class)->group(function () {
        Route::get("/comments", 'index');
        Route::get("/comments/{proposal:id}", 'show');
        Route::post("/comments", 'store');
        Route::patch("/comments/{proposal:id}/{comment}", 'update');
        Route::delete("/comments/{comment}", 'destroy');
    });

    // announcement routes
    Route::controller(AnnouncementController::class)->group(function () {
        Route::get("/announcements", 'index');
        Route::get("/announcements/{announcement}", 'show');
        Route::post("/announcements", 'store');
        Route::patch("/announcements/{announcement}", 'update');
        Route::delete("/announcements/{announcement}", 'destroy');
    });

    // project area routes
    Route::controller(ProjectAreaController::class)->group(function () {
        Route::get("/project-areas", 'index');
        Route::get("/project-areas/{projectArea:slug}", 'show');
        Route::post("/project-areas", 'store');
        Route::patch("/project-areas/{projectArea:slug}", 'update');
        Route::delete("/project-areas/{projectArea:slug}", 'destroy');
    });

    Route::get("/dashboard", DashboardController::class);

    Route::controller(AdminController::class)->group(function () {
        // 1. Events Management
        Route::get("/admin/events", "getEvents");

        // 2. Project Areas Management
        Route::get("/admin/project-areas", "getProjectAreas");

        // 3. Students Management
        Route::get("/admin/students", "getStudents");

        // 4. Faculties Management
        Route::get("/admin/faculties", "getFaculties");

        // 5. Departments Management
        Route::get("/admin/departments", "getDepartments");
    });

    Route::controller(UserController::class)->group(function () {
        Route::get("/faculties-for-proposal", "getFacultiesForProposal");
        Route::get("/students-for-proposal", "getStudentsForProposal");
        Route::get("/faculties/lists", 'showFacultiesList');
    });

    Route::controller(ProposalController::class)->group(function () {
        Route::get("/proposals", 'index');
        Route::post("/proposals", 'store');
        Route::get("/proposals/me", 'myProposals');
        Route::get("/proposals/browse", 'browseProposals');
        Route::get("/proposals/faculties", 'facultyProposals');
        Route::post("/proposals/{proposal:slug}/join", 'joinFacultyProposal');
        Route::post("/proposals/{proposal:slug}/applications/{student:id}/accept", 'acceptApplicant');
        Route::post("/proposals/{proposal:slug}/applications/{student:id}/reject", 'rejectApplicant');
        Route::get("/proposals/{proposal:slug}", 'show');
        Route::delete("/proposals/{proposal:slug}", 'destroy');
        Route::post("/proposals/{proposal:slug}/approve", 'approveByIC');
        Route::post("/proposals/{proposal:slug}/reject", 'rejectByIC');
    });

    Route::controller(SupervisorController::class)->group(function () {
        Route::get("/supervisors", 'index');
        Route::get("/supervisors/{supervisor:id}/detail", 'show');
    });

    Route::controller(ProjectController::class)->group(function () {
        Route::get("/projects", 'index');
        Route::get("/assigned-projects", 'assignedProjects');
        Route::get("/projects/me", 'studentProjects');
        Route::get("/projects/{project:slug}", 'show');
        Route::patch("/projects/{project:slug}/change-status", 'changeStatus');
        Route::patch("/projects/{project:slug}/seminar-deadlines", 'updateSeminarDeadlines');
        Route::patch("/projects/{project:slug}/seminar-status", 'updateSeminarStatus');
        Route::patch("/projects/{project:slug}/report-status", 'updateReportStatus');
    });

    Route::controller(FileController::class)->group(function () {
        // upload or delete profile document
        Route::post("/upload-profile-picture", 'uploadProfilePicture');
        Route::delete("/delete-profile-picture", 'deleteProfilePicture');

        // upload or delete proposal document
        Route::post("/upload-to-s3", 'uploadToS3');
        Route::post("/delete-from-s3", 'deleteFromS3');

        // upload or delete report
        Route::post("/upload-report", 'uploadReport');
        Route::post("/delete-report", 'deleteReport');
    });

    Route::apiResource("/project-events", ProjectEventController::class)->except(['create', 'show', 'edit', 'update']);

    Route::post("/project-events/{projectEvent}/toggle-active", [ProjectEventController::class, 'toggleActive']);
});
