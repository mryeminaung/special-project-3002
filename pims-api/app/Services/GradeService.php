<?php

namespace App\Services;

use App\Models\Grade;
use App\Models\Project;
use App\Models\User;

class GradeService
{
    public function list(Project $project): array
    {
        $grades = $project->grades()
            ->with('student:id,name,email', 'examiner:id,name,email')
            ->get();

        // Group by student for a cleaner response
        $grouped = $grades->groupBy('student_id')->map(function ($studentGrades) {
            $first = $studentGrades->first();
            return [
                'student' => [
                    'id'    => $first->student->id,
                    'name'  => $first->student->name,
                    'email' => $first->student->email,
                ],
                'grades' => $studentGrades->map(fn ($g) => [
                    'id'       => $g->id,
                    'grade'    => $g->grade,
                    'remarks'  => $g->remarks,
                    'type'     => $g->type,
                    'examiner' => [
                        'id'   => $g->examiner->id,
                        'name' => $g->examiner->name,
                    ],
                    'updatedAt' => $g->updated_at,
                ])->values(),
            ];
        })->values();

        return $grouped->toArray();
    }

    public function give(Project $project, array $data, User $examiner): array
    {
        // IC can grade any project; assigned examiners can grade their own projects
        $isIC = $examiner->hasRole('ic');
        if (! $isIC && ! $project->examiners()->where('user_id', $examiner->id)->exists()) {
            return ['success' => false, 'message' => 'You are not an examiner for this project.', 'status' => 403];
        }

        $grade = Grade::updateOrCreate(
            [
                'project_id'  => $project->id,
                'student_id'  => $data['student_id'],
                'examiner_id' => $examiner->id,
                'type'        => $data['type'],
            ],
            [
                'grade'   => $data['grade'],
                'remarks' => $data['remarks'] ?? null,
            ]
        );

        $grade->load('student:id,name,email', 'examiner:id,name,email');

        return ['success' => true, 'message' => 'Grade saved.', 'data' => $grade];
    }

    public function update(Grade $grade, array $data): array
    {
        $grade->update([
            'grade'   => $data['grade'],
            'remarks' => $data['remarks'] ?? $grade->remarks,
        ]);

        return ['success' => true, 'message' => 'Grade updated.', 'data' => $grade->fresh()];
    }
}
