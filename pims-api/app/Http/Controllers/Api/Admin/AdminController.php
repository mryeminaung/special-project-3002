<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Department;
use App\Models\ProjectArea;
use App\Models\ProjectEvent;
use App\Models\User;
use App\Traits\ApiResponse;

class AdminController extends Controller
{
    use ApiResponse;

    public function getEvents()
    {
        return $this->successResponse(
            'Events retrieved successfully.',
            ProjectEvent::latest()->get()
        );
    }

    public function getProjectAreas()
    {
        return $this->successResponse(
            'Project areas retrieved successfully.',
            ProjectArea::orderBy('name')->get()
        );
    }

    public function getStudents()
    {
        $students = User::role('student')
            ->orderBy('name')
            ->get();

        return $this->successResponse('Students retrieved successfully.', $students);
    }

    public function getFaculties()
    {
        $faculties = User::role(['faculty', 'supervisor'])->latest()->get();

        return $this->successResponse('Faculties retrieved successfully.', $faculties);
    }

    public function getDepartments()
    {
        return $this->successResponse(
            'Departments retrieved successfully.',
            Department::select('id', 'name', 'description')->get()
        );
    }
}
