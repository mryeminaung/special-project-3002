<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        if (Auth::attempt($request->validated())) {
            $token = Auth::user()->createToken('authToken')->plainTextToken;
            return response()->json([
                'user' => Auth::user()->load('student'),
                'user' => new UserResource(Auth::user()->load(['student', 'faculty'])),
                'token' => $token
            ], 200);
        } else {
            throw ValidationException::withMessages([
                'email' => [Lang::get('auth.failed')],
            ]);
        }
    }

    public function logout()
    {
        Auth::user()->currentAccessToken()->delete();

        return response()->json([
            'message' => "Logout Successfully"
        ]);
    }
}
