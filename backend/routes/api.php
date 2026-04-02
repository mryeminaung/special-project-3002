<?php

use App\Http\Controllers\AnnouncementController;
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ProjectAreaController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectEventController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\SupervisorController;
use App\Http\Controllers\UserController;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login')->middleware('guest');
    Route::post('/logout', 'logout')->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {

    Route::controller(AuthController::class)->group(function () {
        Route::patch("/update-profile", 'updateProfile');
        Route::post("/reset-password", 'resetPassword');
    });

    Route::get("/dashboard", DashboardController::class);

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

    Route::controller(CommentController::class)->group(function () {
        Route::post("/comments/create", 'store');
        Route::get("/comments/{proposal:id}", 'show');
        Route::delete("/comments/{comment}", 'destroy');
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

    Route::apiResource("/announcements", AnnouncementController::class)->except(['create', 'show', 'edit', 'update']);

    Route::apiResource("/project-events", ProjectEventController::class)->except(['create', 'show', 'edit', 'update']);

    Route::post("/project-events/{projectEvent}/toggle-active", [ProjectEventController::class, 'toggleActive']);

    Route::apiResource("/project-areas", ProjectAreaController::class)->except(['create', 'show', 'edit']);
});
