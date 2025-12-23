<?php

use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\dashboard\DashboardController;
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
    });

    Route::controller(ProjectProposalController::class)->group(function () {
        Route::post("/proposals/create", 'store');
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

Route::get("ranks", function () {
    $ranksWithCount = Rank::offset(2)->withCount('faculties')->get();
    $rankLoadCount = Rank::find(3)->loadCount('faculties');
    return $ranksWithCount;
});

Route::post("project-proposals/submission", function () {
    return Role::findByName('IC');
});

Route::get('/faculties', function (Request $request) {
    $adminUsers = User::where('is_student', false)->take(3)->get();
    $facultyUsers = User::where('is_student', false)->offset(3)->take(100)->get();
    return [
        'admin' => $adminUsers,
        'faculties' => $facultyUsers
    ];
});

Route::get('/info', function (Request $request) {
    $adminUsers = User::where('is_student', false)->take(3)->with([])->get();

    $facultyUsers = User::where('is_student', false)->offset(3)->take(100)->with(['faculty.department', 'faculty.rank'])->get();

    return UserResource::collection(User::with(['student', 'faculty'])->get());
});
