<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    use ApiResponse;

    public function showProfile()
    {
        $user = Auth::user()->load(['student', 'faculty']);

        return $this->successResponse(
            'Profile retrieved successfully.',
            new UserResource($user)
        );
    }

    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'phoneNo' => 'required|string|max:20',
            'address' => 'required|string|max:255',
        ]);

        $user = Auth::user();

        if ($user->hasRole('Faculty') || $user->hasRole('IC') || $user->hasRole('Supervisor') || $user->hasRole('Student Affairs')) {
            $faculty = $user->faculty;

            if ($faculty) {
                $faculty->update([
                    'phone_number' => $data['phoneNo'],
                    'address'      => $data['address'],
                ]);
            }
        } else {
            $student = $user->student;

            if ($student) {
                $student->update([
                    'phone_number' => $data['phoneNo'],
                    'address'      => $data['address'],
                ]);
            }
        }

        return $this->successResponse(
            'Profile updated successfully.',
            new UserResource(Auth::user()->load(['student', 'faculty']))
        );
    }

    public function resetPassword(Request $request)
    {
        $request->validate([
            'current_password' => 'required',
            'password'         => 'required|string|min:8|confirmed',
        ]);

        $user = Auth::user();

        if (! Hash::check($request->input('current_password'), $user->password)) {
            return $this->errorResponse('Current password is incorrect.', 422);
        }

        $user->password = bcrypt($request->input('password'));
        $user->save();

        return $this->successResponse(
            'Password reset successfully.',
            new UserResource(Auth::user()->load(['student', 'faculty']))
        );
    }
}
