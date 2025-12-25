<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\User;

class FacultyController extends Controller
{
    public function showFacultiesList()
    {
        $users = User::where('is_student', false)->with('faculty')->get();
        return UserResource::collection($users);
    }
}
