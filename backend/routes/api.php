<?php

use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\CommentController;
use App\Http\Controllers\dashboard\DashboardController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProposalController;
use App\Http\Controllers\UserController;
use App\Http\Resources\ProposalResource;
use App\Models\Proposal;
use Illuminate\Support\Facades\Route;

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', 'login')->middleware('guest');
    Route::post('/logout', 'logout')->middleware('auth:sanctum');
});

Route::middleware('auth:sanctum')->group(function () {

    Route::controller(DashboardController::class)->group(function () {
        Route::get("/dashboard", 'index');
    });

    Route::controller(UserController::class)->group(function () {
        Route::get("/faculties-for-proposal", "getFacultiesForProposal");
        Route::get("/students-for-proposal", "getStudentsForProposal");
        Route::get("/faculties/lists", 'showFacultiesList');
    });

    Route::controller(ProposalController::class)->group(function () {
        Route::get("/proposals", 'index');
        Route::post("/proposals/create", 'store');
        Route::get("/proposals/my", 'show');
        Route::get("/proposals/{proposal:slug}/detail", 'detail');
        Route::delete("/proposals/{proposal}/delete", 'destroy');
        Route::post("/proposals/{proposal}/approve", 'approveByIc');
        Route::post("/proposals/{proposal}/reject", 'rejectByIc');
    });

    Route::controller(CommentController::class)->group(function () {
        Route::post("/comments/create", 'store');
        Route::get("/comments/{proposal:id}", 'show');
        Route::delete("/comments/{comment}", 'destroy');
    });

    Route::controller(ProjectController::class)->group(function () {
        Route::get("/projects", 'index');
        Route::post("/projects", 'store');
        Route::get("/projects/project:slug", 'show');
    });

    Route::controller(FileController::class)->group(function () {
        Route::post("/upload-to-s3", 'uploadToS3');
        Route::post("/delete-from-s3", 'deleteFromS3');
    });
});

Route::get("/test", function () {
    $proposal = Proposal::find(1);
    return new ProposalResource($proposal->load('members'));
});
