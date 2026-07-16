<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Services\UserService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Auth;

class UserController extends Controller
{
    use ApiResponse;

    public function __construct(
        private UserService $userService
    ) {}

    public function getFacultiesForProposal()
    {
        $faculties = $this->userService->getFacultiesForProposal();

        $data = $faculties->map(fn ($user) => [
            'id'         => $user->id,
            'name'       => $user->name,
            'role'       => $user->roles->pluck('name'),
            'email'      => $user->email,
            'department' => $user->faculty?->department?->name,
        ]);

        return $this->successResponse('Faculties retrieved successfully.', $data);
    }

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
}
