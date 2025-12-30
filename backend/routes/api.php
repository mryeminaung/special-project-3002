<?php

use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\dashboard\DashboardController;
use App\Http\Controllers\FacultyController;
use App\Http\Controllers\FileController;
use App\Http\Controllers\ProjectProposalController;
use App\Http\Resources\UserResource;
use App\Models\Rank;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Spatie\Permission\Models\Role;

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
        Route::post("/proposals/create", 'store');
        // Route::get("/proposals/lists", 'showProposalsList');
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

Route::get('/test', function () {
    $users = User::where('is_student', true)->get();
    $students = $users->whereIn('id', [20, 21, 22]);
    $studentsData = [];

    foreach ($students as $student) {
        $studentsData[] = [
            'id' => $student->id,
            'name' => $student->name,
            'email' => $student->email
        ];
    }
    return $studentsData;
});
Route::get("/proposals/lists", [ProjectProposalController::class, 'showProposalsList']);

Route::get("/faculty-data", function () {
    $ranksWithCount = Rank::offset(2)->withCount('faculties')->get();
    $facultyData = [];

    foreach ($ranksWithCount as $data) {
        $facultyData[] = [
            "id" => $data->id,
            "total" => $data->faculties_count,
            "title" => $data->name,
            "description" => $data->description,
        ];
    };

    return response()->json($facultyData);
});
