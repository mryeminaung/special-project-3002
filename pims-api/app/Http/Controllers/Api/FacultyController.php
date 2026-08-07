<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\UserResource;
use App\Models\Project;
use App\Models\User;
use App\Services\FacultyService;
use App\Traits\ApiResponse;

class FacultyController extends Controller
{
    use ApiResponse;

    public function __construct(
        private FacultyService $facultyService
    ) {}

    public function index()
    {
        return UserResource::collection($this->facultyService->list());
    }

    public function show(string $id) {}

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
                'imageUrl'       => $data['user']->avatar_url,
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
            ]
        );
    }

    public function getFacultiesForProposal()
    {
        $faculties = User::where('is_student', false,)
            ->whereNotIn('id', function ($query) {
                $query->select('model_id')->from('model_has_roles')
                    ->where('model_type', User::class)
                    ->whereIn('role_id', function ($q) {
                        $q->select('id')->from('roles')
                            ->whereIn('name', ['admin', 'student-affairs']);
                    });
            })
            ->with('faculty')
            ->get();

        $data = $faculties->map(fn($user) => [
            'id'             => $user->id,
            'name'           => $user->name,
            'role'           => $user->roles->pluck('name'),
            'email'          => $user->email,
            'department'     => $user->faculty?->department?->name,
            'workload_count' => Project::where('supervisor_id', $user->id)
                ->where('status', 'active')
                ->count(),
            'max_capacity'   => 5,
        ]);

        return $this->successResponse('Faculties retrieved successfully.', $data);
    }
}
