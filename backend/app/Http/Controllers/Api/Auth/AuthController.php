<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\auth\LoginRequest;
use App\Http\Resources\UserResource;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Lang;
use Illuminate\Validation\ValidationException;
use App\Traits\ApiResponse;

class AuthController extends Controller
{
    use ApiResponse;
    public function login(LoginRequest $request)
    {
        if (Auth::attempt($request->validated())) {
            $token = Auth::user()->createToken('authToken')->plainTextToken;
            return response()->json([
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

        return $this->successResponse("Logout Successfully");
    }

    public function logoutAll()
    {
        Auth::user()->tokens()->delete();

        return $this->successResponse("Logout All Sessions Successfully");
    }
}
