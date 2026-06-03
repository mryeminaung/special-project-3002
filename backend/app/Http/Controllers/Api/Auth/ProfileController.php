<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Traits\ApiResponse;

class ProfileController extends Controller
{
    use ApiResponse;
    
    public function updateProfile(Request $request)
    {
        $data = $request->validate([
            'phoneNo' => 'required|string|max:20',
            'address' => 'required|string|max:255',
        ]);

        $user = Auth::user();

        // Check user roles
        if ($user->hasRole('Faculty') || $user->hasRole('IC') || $user->hasRole('Supervisor') || $user->hasRole("Student Affairs")) {
            // Update faculty info
            $faculty = $user->faculty;

            if ($faculty) {
                $faculty->update([
                    'phone_number' => $data["phoneNo"],
                    'address' => $data["address"],
                ]);
            }
        } else {
            // Update student info
            $student = $user->student;

            if ($student) {
                $student->update([
                    'phone_number' => $data['phoneNo'],
                    'address' => $data['address'],
                ]);
            }
        }

        return response()->json([
            'user' => new UserResource(Auth::user()->load(['student', 'faculty'])),
            'token' => $request->bearerToken()
        ], 200);
    }

    public function resetPassword(Request $request)
    {
        $user = Auth::user();

        // Check if current_password matches the authenticated user's password
        if (!Hash::check($request->input('current_password'), $user->password)) {
            return response()->json([
                'errors' => [
                    "current_password" => 'Current password is incorrect.'
                ]
            ], 422);
        } else {
            // Update the user's password
            $user->password = bcrypt($request->input('password'));
            $user->save();

            return response()->json([
                'user' => new UserResource(Auth::user()->load(['student', 'faculty'])),
                'token' => $request->bearerToken()
            ], 200);
        }
    }

}
