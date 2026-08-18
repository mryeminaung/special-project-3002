<?php

namespace App\Http\Controllers\Api;

use App\Enums\ProjectStatus;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\User;
use App\Services\FacultyService;
use App\Services\ProposalEligibilityService;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Storage;

class FacultyController extends Controller
{
    use ApiResponse;

    public function __construct(
        private FacultyService $facultyService
    ) {}

    public function index()
    {
        return $this->successResponse('Faculties retrieved successfully.', UserResource::collection($this->facultyService->list()));
    }

    public function detail(string $id)
    {
        $data = $this->facultyService->detail((int) $id);

        return $this->successResponse(
            'Faculty detail retrieved successfully.',
            [
                'id'             => $data['user']->id,
                'name'           => $data['user']->name,
                'email'          => $data['user']->email,
                'rank'           => $data['user']->faculty?->rank?->name,
                'department'     => $data['user']->faculty?->department?->name,
                'phone'          => $data['user']->faculty?->phone_number,
                'address'        => $data['user']->faculty?->address,
                'imageUrl'       => $data['user']->avatar_url ? Storage::disk('public')->url($data['user']->avatar_url) : null,
                'activeProjects' => $data['activeProjects']->map(fn($p) => [
                    'id'       => $p->id,
                    'title'    => $p->name,
                    'students' => $p->members->count() . ' Students',
                ]),
                'pastProjects'   => $data['pastProjects']->map(fn($p) => [
                    'id'      => $p->id,
                    'title'   => $p->name,
                    'year'    => optional($p->start_date)->format('Y'),
                    'outcome' => 'Completed',
                ]),
                'examiningProjects' => $data['examiningProjects']->map(fn($p) => [
                    'id'       => $p->id,
                    'title'    => $p->name,
                    'status'   => $p->status,
                    'students' => $p->members->count() . ' Students',
                ]),
            ]
        );
    }

    public function getFacultiesForProposal()
    {
        $faculties = User::role('faculty')
            ->with('faculty.rank', 'faculty.department')
            ->withCount(['projects as workload_count' => fn($q) => $q->where('status', ProjectStatus::Active)])
            ->get();

        $data = $faculties->map(fn($user) => [
            'id'           => $user->id,
            'name'         => $user->name,
            'email'        => $user->email,
            'rank'         => $user->faculty?->rank?->name,
            'department'   => $user->faculty?->department?->name,
            'workloadCount' => $user->workload_count,
            'maxCapacity'  => ProposalEligibilityService::FACULTY_LIMIT,
        ]);

        return $this->successResponse('Faculties retrieved successfully.', $data);
    }

    public function update(string $id)
    {
        $data = request()->validate([
            'name'          => 'required|string|max:255',
            'email'         => 'required|email|max:255|unique:users,email,' . $id . ',id',
            'phone_number'  => 'nullable|string|max:20',
            'address'       => 'nullable|string',
            'department_id' => 'nullable|integer|exists:departments,id',
            'rank_id'       => 'nullable|integer|exists:ranks,id',
        ]);

        $user = $this->facultyService->update((int) $id, $data);

        return $this->successResponse(
            'Faculty updated successfully.',
            [
                'id'            => $user->id,
                'name'          => $user->name,
                'email'         => $user->email,
                'rank'          => $user->faculty?->rank?->name,
                'rank_id'       => $user->faculty?->rank_id,
                'department'    => $user->faculty?->department?->name,
                'department_id' => $user->faculty?->department_id,
                'phone'         => $user->faculty?->phone_number,
                'address'       => $user->faculty?->address,
            ]
        );
    }

    public function resetPassword(string $id)
    {
        $tempPassword = $this->facultyService->resetPassword((int) $id);

        return $this->successResponse(
            'Password reset successfully. Temporary password: ' . $tempPassword,
            ['temp_password' => $tempPassword]
        );
    }
}
