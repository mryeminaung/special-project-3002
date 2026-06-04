<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\ProjectArea;
use App\Models\ProjectEvent;
use App\Models\User;

class AdminController extends Controller
{
    public function getEvents()
    {
        // Using your ProjectEvent model if that is the specific name
        return response()->json(ProjectEvent::latest()->get());
    }

    public function getProjectAreas()
    {
        return response()->json(ProjectArea::orderBy('name')->get());
    }


    public function getStudents()
    {
        $students = User::where('is_student', true)
            ->leftJoin('majors', 'users.major_id', '=', 'majors.id')
            ->select([
                'users.name',
                'users.email',
                'majors.name as major_name', // Aliased for clarity
            ])
            ->orderBy('users.name')
            ->get();

        return response()->json($students);
    }

    public function getFaculties()
    {
        // Fetches both Faculty and Supervisor roles
        $faculties = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['Faculty', 'Supervisor']);
        })->latest()->get();

        return response()->json($faculties);
    }

    public function getDepartments()
    {
        return response()->json(
            Department::select('id', 'name', 'description')->get()
        );
    }
}
