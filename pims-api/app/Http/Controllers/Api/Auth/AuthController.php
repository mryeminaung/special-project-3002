<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\auth\LoginRequest;
use App\Http\Requests\auth\ResetPasswordRequest;
use App\Http\Requests\auth\UpdateProfileRequest;
use App\Http\Resources\UserResource;
use App\Services\AuthService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    use ApiResponse;

    public function __construct(private AuthService $authService) {}

    public function login(LoginRequest $request)
    {
        $result = $this->authService->login($request->validated());

        if (! $result['success']) {
            throw ValidationException::withMessages([
                'email' => [__('auth.failed')],
            ]);
        }

        return $this->successResponse('Login successful.', [
            'user'  => new UserResource($result['user']),
            'token' => $result['token'],
        ]);
    }

    public function logout()
    {
        $this->authService->logout(Auth::user());

        return $this->successResponse('Logout successful.');
    }

    public function logoutAll()
    {
        $this->authService->logoutAll(Auth::user());

        return $this->successResponse('All sessions logged out successfully.');
    }

    public function showProfile()
    {
        $user = $this->authService->getProfile(Auth::user());

        return $this->successResponse('Profile retrieved successfully.', new UserResource($user));
    }

    public function updateProfile(UpdateProfileRequest $request)
    {
        $user = $this->authService->updateProfile(Auth::user(), $request->validated());

        return $this->successResponse('Profile updated successfully.', new UserResource($user));
    }

    public function resetPassword(ResetPasswordRequest $request)
    {
        $result = $this->authService->resetPassword(
            Auth::user(),
            $request->input('current_password'),
            $request->input('password')
        );

        if (! $result['success']) {
            return $this->errorResponse($result['message'], 422);
        }

        return $this->successResponse('Password reset successfully.');
    }
}
