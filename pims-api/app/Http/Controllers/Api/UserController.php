<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        private UserService $userService
    ) {}

    public function getStudentsForProposal()
    {
        $students = $this->userService->getStudentsForProposal(Auth::id());

        return $this->successResponse('Students retrieved successfully.', $students);
    }

    public function showFacultiesList()
    {
        $users = $this->userService->getFacultiesList();

        return $this->successResponse(
            'Faculties list retrieved successfully.',
            UserResource::collection($users)
        );
    }

    public function getStudents()
    {
        $students = $this->userService->getStudents();

        $students->transform(function ($student) {
            $student->avatar_url = $student->avatar_url
                ? Storage::disk('public')->url($student->avatar_url)
                : null;
            return $student;
        });

        return $this->successResponse('Students retrieved successfully.', $students);
    }

    public function getStudentFilters()
    {
        $filters = $this->userService->getStudentFilters();

        return $this->successResponse('Student filters retrieved successfully.', $filters);
    }
}
