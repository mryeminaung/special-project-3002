<?php
namespace App\Http\Controllers;

use App\Http\Resources\UserResource;
use App\Models\Proposal;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class UserController extends Controller
{
    public function getFacultiesForProposal()
    {
        $users = User::select('id', 'name', 'email')
            ->where('is_student', false)
            ->whereHas('roles', function ($query) {
                $query->where('name', 'Faculty');
            })
            ->orderBy('id', 'asc')
            ->offset(4)
            ->get();

        // Map to include department name
        $faculties = $users->map(function ($user) {
            return [
                'id'         => $user->id,
                'name'       => $user->name,
                'role'       => $user->roles->pluck('name'),
                'email'      => $user->email,
                'department' => $user->faculty->department ? $user->faculty->department->name : null,
            ];
        });

        return response()->json($faculties);
    }

    public function getStudentsForProposal()
    {
        $currentUserId = Auth::id();

        $students = User::select('id', 'name', 'email')
            ->where('is_student', true)
            ->whereHas('roles', fn($q) => $q->where('name', 'Student'))
            ->where('id', '!=', $currentUserId)
            ->whereNotIn('id', Proposal::whereNotNull('student_id')->select('student_id'))
            ->whereNotIn('id', DB::table('proposal_student')->select('user_id'))
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($students);
    }

    public function showFacultiesList()
    {
        // Fetch users who are NOT students and do NOT have the Student Affairs role
        $users = User::where('is_student', false)
            ->whereDoesntHave('roles', function ($query) {
                $query->whereIn('name', ['Student Affairs', 'Admin']);
            })
            ->with('faculty')
            ->orderBy('id', 'asc')
            ->get();

        return UserResource::collection($users);
    }
}
