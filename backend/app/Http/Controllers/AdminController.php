<?php
namespace App\Http\Controllers;

use App\Models\Department;
use App\Models\ProjectArea;
use App\Models\ProjectEvent;
use App\Models\User;

class AdminController extends Controller
{
    /**
     * Get all scheduled events for the management system.
     */
    public function getEvents()
    {
        // Using your ProjectEvent model if that is the specific name
        return response()->json(ProjectEvent::latest()->get());
    }

    /**
     * Get project categories/areas (e.g., IoT, Web, AI).
     */
    public function getProjectAreas()
    {
        return response()->json(ProjectArea::orderBy('name')->get());
    }

    /**
     * Get all registered students.
     */
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

    /**
     * Get all faculty members and supervisors.
     */
    public function getFaculties()
    {
        // Fetches both Faculty and Supervisor roles
        $faculties = User::whereHas('roles', function ($q) {
            $q->whereIn('name', ['Faculty', 'Supervisor']);
        })->latest()->get();

        return response()->json($faculties);
    }

    /**
     * Get department listings for MIIT.
     */
    public function getDepartments()
    {
        return response()->json(
            Department::select('id', 'name', 'description')->get()
        );
    }
}
