<?php

namespace App\Http\Controllers\auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\auth\LoginRequest;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();
        if ($user) {
            $token = $user->createToken('authToken');
            return response()->json([
                'status' => 'Success',
                'message' => 'Login Successfully',
                'user' => $user->load('student'),
                'token' => $token->plainTextToken
            ]);
        } else {
            return "User doesn't exist!!!";
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
