<?php

use App\Http\Controllers\Api\Admin\DepartmentController;
use App\Http\Controllers\Api\Admin\RankController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\Auth\AuthController;
use App\Http\Controllers\Api\CommentController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\FacultyController;
use App\Http\Controllers\Api\FileController;
use App\Http\Controllers\Api\ProjectAreaController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\ProjectEventController;
use App\Http\Controllers\Api\ProposalController;
use App\Http\Controllers\Api\SupervisorController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {

    // Auth routes
    Route::prefix('auth')->controller(AuthController::class)->group(function () {
        Route::post('/login', 'login')->middleware('guest');

        Route::middleware('auth:sanctum')->group(function () {
            Route::post('/logout', 'logout');
            Route::post('/logout-all', 'logoutAll');
            Route::get('/profile', 'showProfile');
            Route::patch('/profile', 'updateProfile');
            Route::post('/reset-password', 'resetPassword');
        });
    });

    // Protected routes
    Route::middleware('auth:sanctum')->group(function () {

        Route::get('/dashboard', DashboardController::class);

        // Announcements
        Route::controller(AnnouncementController::class)->prefix('announcements')->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::get('/{announcement}', 'show');
            Route::patch('/{announcement}', 'update');
            Route::delete('/{announcement}', 'destroy');
        });

        // Comments
        Route::controller(CommentController::class)->prefix('comments')->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::get('/{proposal:id}', 'show');
            Route::patch('/{proposal:id}/{comment}', 'update');
            Route::delete('/{comment}', 'destroy');
        });

        // Project areas
        Route::controller(ProjectAreaController::class)->prefix('project-areas')->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::get('/{projectArea:slug}', 'show');
            Route::patch('/{projectArea:slug}', 'update');
            Route::delete('/{projectArea:slug}', 'destroy');
        });

        // Project events
        Route::apiResource('project-events', ProjectEventController::class)->except(['create', 'show', 'edit']);
        Route::post('project-events/{projectEvent}/toggle-active', [ProjectEventController::class, 'toggleActive']);

        // Projects
        Route::controller(ProjectController::class)->prefix('projects')->group(function () {
            Route::get('/', 'index');
            Route::get('/me', 'studentProjects');
            Route::get('/assigned', 'assignedProjects');
            Route::get('/{project:slug}', 'show');
            Route::patch('/{project:slug}/seminar-deadlines', 'updateSeminarDeadlines');
            Route::patch('/{project:slug}/seminar-status', 'updateSeminarStatus');
            Route::patch('/{project:slug}/report-status', 'updateReportStatus');
        });

        // Proposals
        Route::controller(ProposalController::class)->prefix('proposals')->group(function () {
            Route::get('/', 'index');
            Route::post('/', 'store');
            Route::get('/me', 'myProposals');
            Route::get('/browse', 'browseProposals');
            Route::get('/faculties', 'facultyProposals');
            Route::get('/{proposal:slug}', 'show');
            Route::delete('/{proposal:slug}', 'destroy');
            Route::post('/{proposal:slug}/approve', 'approveByIC');
            Route::post('/{proposal:slug}/reject', 'rejectByIC');
            Route::post('/{proposal:slug}/join', 'joinFacultyProposal');
            Route::post('/{proposal:slug}/applications/{student:id}/accept', 'acceptApplicant');
            Route::post('/{proposal:slug}/applications/{student:id}/reject', 'rejectApplicant');
        });

        // Faculties
        Route::controller(FacultyController::class)->prefix('faculties')->group(function () {
            Route::get('/', 'index');
            Route::get('/{faculty}/detail', 'detail');
        });
        Route::get('/faculties-for-proposal', [FacultyController::class, 'getFacultiesForProposal']);

        // Supervisors
        Route::controller(SupervisorController::class)->prefix('supervisors')->group(function () {
            Route::get('/', 'index');
            Route::get('/{supervisor:id}/detail', 'show');
        });

        // Users
        Route::get('/students-for-proposal', [UserController::class, 'getStudentsForProposal']);
        Route::get('/students', [UserController::class, 'getStudents']);
        Route::get('/students/filters', [UserController::class, 'getStudentFilters']);

        // Files
        Route::controller(FileController::class)->group(function () {
            Route::post('/upload-profile-picture', 'uploadProfilePicture');
            Route::delete('/delete-profile-picture', 'deleteProfilePicture');
            Route::post('/upload-to-s3', 'uploadToS3');
            Route::post('/upload-report', 'uploadReport');
            Route::post('/delete-report', 'deleteReport');
        });

        // Admin
        Route::prefix('admin')->middleware('role:admin')->group(function () {
            Route::apiResource('departments', DepartmentController::class);
            Route::get('/departments/{id}/detail', [DepartmentController::class, 'detail']);
            Route::get('/ranks', [RankController::class, 'index']);
            Route::put('/faculties/{id}', [FacultyController::class, 'update']);
            Route::post('/faculties/{id}/reset-password', [FacultyController::class, 'resetPassword']);
        });
    });
});
