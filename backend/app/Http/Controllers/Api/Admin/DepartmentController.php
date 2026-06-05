<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\DepartmentRequest;
use App\Models\Department;
use App\Traits\ApiResponse;

class DepartmentController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $departments = Department::all();

        return $this->successResponse("Departments retrieved successfully", $departments);
    }

    public function store(DepartmentRequest $request)
    {
        $department = Department::create($request->all());

        return $this->successResponse('Department created successfully', $department);
    }

    public function show(Department $department)
    {
        return $this->successResponse('Department retrieved successfully', $department);
    }

    public function update(DepartmentRequest $request, Department $department)
    {
        $department->update($request->all());

        return $this->successResponse('Department updated successfully', $department);
    }

    public function destroy(Department $department)
    {
        $department->delete();

        return $this->successResponse('Department deleted successfully', null, 204);
    }
}
