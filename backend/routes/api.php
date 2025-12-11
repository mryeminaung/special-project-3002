<?php

use App\Http\Controllers\auth\AuthController;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Spatie\Permission\Models\Role;

Route::controller(AuthController::class)->group(function () {
    Route::post('/login', [AuthController::class, 'login'])->middleware('guest');
    Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

    Route::get('auth-user', function () {
        // return 'Auth User';
        return auth()->user()->load('student');
    })->middleware('auth:sanctum');
});

Route::get('/roles', function (Request $request) {
    // return User::all();
    return Role::where('name', 'IIC')->get();

    return response()->json(
        [
            "status" => "success",
            "users" => User::all()
        ],
    );
});

Route::post('/users', function (Request $request) {
    $validatedData = $request->validate([
        'title' => 'required|string|min:3',
        'body' => 'required|string|min:3'
    ]);

    return $validatedData;
});

Route::delete('/users/{id}', function (string $id) {
    $user = User::find($id);
    if (!$user) return response()->json([
        "message" =>  "User is already deleted."
    ]);
    else {
        $user->delete();
        return response()->json([
            ["message" =>  "User is deleted."]
        ]);
    };
    // return response()->noContent();
});

Route::get('/users/{user}', function (User $user) {
    return $user;
})->middleware('auth:sanctum');
