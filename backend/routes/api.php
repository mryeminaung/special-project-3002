<?php

use App\Http\Controllers\auth\AuthController;
use App\Http\Resources\UserResource;
use App\Models\Student;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
});

Route::post("project-proposals/submission", function () {
    $students = User::where('is_student', true)->offset(104)->with('roles')->get();
    return UserResource::collection($students);
    return request()->all();
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
