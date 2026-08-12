<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function login(array $credentials): array
    {
        if (! Auth::attempt($credentials)) {
            return ['success' => false];
        }

        $user  = Auth::user()->load(['student.major', 'faculty.rank', 'faculty.department']);
        $token = Auth::user()->createToken('authToken')->plainTextToken;

        return ['success' => true, 'user' => $user, 'token' => $token];
    }

    public function logout(User $user): void
    {
        $user->currentAccessToken()->delete();
    }

    public function logoutAll(User $user): void
    {
        $user->tokens()->delete();
    }

    public function getProfile(User $user): User
    {
        return $user->load(['student.major', 'faculty.rank', 'faculty.department']);
    }

    public function updateProfile(User $user, array $data): User
    {
        $profile = $user->faculty ?? $user->student;

        $profile?->update([
            'phone_number' => $data['phoneNo'],
            'address'      => $data['address'],
        ]);

        return $user->load(['student.major', 'faculty.rank', 'faculty.department']);
    }

    public function resetPassword(User $user, string $currentPassword, string $newPassword): array
    {
        if (! Hash::check($currentPassword, $user->password)) {
            return ['success' => false, 'message' => 'Current password is incorrect.'];
        }

        $user->password = $newPassword;
        $user->save();

        return ['success' => true];
    }
}
