<?php

use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\dashboard\DashboardController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectProposalController;
use App\Http\Resources\ProjectProposalResource;
use App\Http\Resources\UserResource;
use App\Models\ProjectProposal;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login')->middleware('guest');
    Route::post('/logout', 'logout')->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {

    Route::controller(DashboardController::class)->group(function () {
        Route::get("/dashboard", 'index');
    });

    Route::controller(FacultyController::class)->group(function () {
        Route::get("/faculties/lists", 'showFacultiesList');
    });

    Route::controller(ProjectProposalController::class)->group(function () {
        Route::get("/proposals", 'index');
        Route::post("/proposals/create", 'store');
        Route::get("/proposals/my", 'show');
        Route::get("/proposals/{project_proposal:slug}/detail", 'detail');
        Route::delete("/proposals/{projectProposal}/delete", 'destroy');
    });

    Route::controller(ProjectController::class)->group(function () {
        Route::post("/projects", 'index');
        Route::post("/projects", 'store');
        Route::get("/projects/lists", 'showProposalsList');
    });

    Route::controller(FileController::class)->group(function () {
        Route::post("/upload-to-s3", 'uploadToS3');
        Route::post("/delete-from-s3", 'deleteFromS3');
    });

    Route::get('role-info', function () {
        $user = Auth::user();
        return new UserResource($user);
    })->middleware('role:IC');
});
