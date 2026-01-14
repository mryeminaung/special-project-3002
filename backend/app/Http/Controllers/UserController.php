<?php

namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    public function getFacultiesForProposal()
    {
        $faculties = User::select('id', 'name')
            ->where('is_student', false)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'Faculty');
            })
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($faculties);
    }

    public function getStudentsForProposal()
    {
        // Get all student IDs that are already in a team
        $assignedStudentIds = Proposal::pluck('members')->flatten()->unique()->toArray();

        // Query users who are students, have the role, and ARE NOT in the assigned list
        $students = User::select('id', 'name')
            ->where('is_student', true)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'Student');
            })
            ->where('id', '!=', Auth::id())
            // Filter out students already in other teams
            ->whereNotIn('id', $assignedStudentIds)
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($students);
    }

    public function showFacultiesList()
    {
        $users = User::where('is_student', false)->with('faculty')->get();
        return UserResource::collection($users);
    }
}
