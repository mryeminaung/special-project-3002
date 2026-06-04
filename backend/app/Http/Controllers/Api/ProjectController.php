<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Enums\ProjectProgressStatus;
use App\Http\Resources\ProjectResource;
use App\Http\Resources\project\FacultyProjectResource;
use App\Http\Resources\project\StudentProjectResource;
use App\Models\Project;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ProjectController extends Controller
{
    use ApiResponse;

    public function index()
    {
        $projects = Project::with(['leader', 'supervisor', 'members'])->get();
        return ProjectResource::collection($projects);
    }

    public function studentProjects()
    {
        $authId = Auth::id();

        $projects = Project::with(['leader', 'supervisor', 'members'])
            ->where('leader_id', $authId)
            ->orWhereHas('members', function ($query) use ($authId) {
                $query->where('users.id', $authId);
            })
            ->get();

        return $this->successResponse("Success", StudentProjectResource::collection($projects));
    }

    public function assignedProjects()
    {
        $projects = Project::with(['leader', 'supervisor', 'members'])
            ->where('supervisor_id', Auth::id())
            ->get();
        return ProjectResource::collection($projects);
    }

    public function show(Project $project)
    {
        $allMilestonesCompleted =
        $project->mid_report === ProjectProgressStatus::Submitted->value
        && $project->final_report === ProjectProgressStatus::Submitted->value
        && $project->mid_seminar === ProjectProgressStatus::Completed->value
        && $project->final_seminar === ProjectProgressStatus::Completed->value;

        if ($allMilestonesCompleted && $project->status !== 'completed') {
            $project->status = 'under review';
        } else {
            $project->status = "active";
        }
        $project->save();

        if ($project->type === 'student') {
            return $this->successResponse("Success", new StudentProjectResource($project));
        }
        if ($project->type === 'faculty') {
            return $this->successResponse("Success", new FacultyProjectResource($project));
        }
    }

    public function changeStatus(Project $project)
    {

    }

    public function updateSeminarDeadlines(Request $request, Project $project)
    {
        $authUser = Auth::user();

        if ($authUser && $authUser->hasRole('Student')) {
            return $this->errorResponse('Students are not allowed to update seminar deadlines.', 403);
        }

        $validated = $request->validate([
            'midSeminarDeadline'   => ['nullable', 'date'],
            'finalSeminarDeadline' => ['nullable', 'date'],
        ]);

        $midDeadline           = $validated['midSeminarDeadline'] ?? null;
        $finalDeadline         = $validated['finalSeminarDeadline'] ?? null;
        $isMidSeminarCompleted = $project->mid_seminar === ProjectProgressStatus::Completed->value;

        if ($midDeadline === null && $finalDeadline === null) {
            return $this->errorResponse('At least one seminar deadline must be provided.', 422);
        }

        if ($isMidSeminarCompleted && $midDeadline !== null) {
            return $this->errorResponse('Mid-term seminar is completed, so mid-term deadline cannot be changed.', 422);
        }

        if (! $isMidSeminarCompleted && $finalDeadline !== null) {
            return $this->errorResponse('Final seminar deadline can be set only after mid-term seminar is completed.', 422);
        }

        if ($midDeadline !== null) {
            $project->mid_seminar_deadline = $midDeadline;
        }

        if ($finalDeadline !== null) {
            $project->final_seminar_deadline = $finalDeadline;
        }
        $project->save();

        return $this->successResponse('Seminar deadlines updated successfully.', [
            'midSeminarDeadline'   => $project->mid_seminar_deadline,
            'finalSeminarDeadline' => $project->final_seminar_deadline,
        ]);
    }

    public function updateReportStatus(Request $request, Project $project)
    {
        $authUser = Auth::user();

        if ($authUser && $authUser->hasRole('Student')) {
            return $this->errorResponse('Students are not allowed to update report status.', 403);
        }

        $validated = $request->validate([
            'type'   => ['required', 'in:mid,final'],
            'status' => ['required', 'in:not submitted,submitted'],
        ]);

        $reportField             = $validated['type'] === 'mid' ? 'mid_report' : 'final_report';
        $project->{$reportField} =
        $validated['status'] === 'submitted'
            ? ProjectProgressStatus::Submitted->value
            : ProjectProgressStatus::Not_Submitted->value;
        $project->save();

        return $this->successResponse('Report status updated successfully.', [
            'type'   => $validated['type'],
            'status' => $validated['status'],
        ]);
    }

    public function updateSeminarStatus(Request $request, Project $project)
    {
        $authUser = Auth::user();

        if ($authUser && $authUser->hasRole('Student')) {
            return $this->errorResponse('Students are not allowed to update seminar status.', 403);
        }

        $validated = $request->validate([
            'type'   => ['required', 'in:mid,final'],
            'status' => ['required', 'in:not completed,completed'],
        ]);

        if (
            $validated['type'] === 'final'
            && $project->mid_seminar !== ProjectProgressStatus::Completed->value
        ) {
            return $this->errorResponse('Final seminar status can be changed only after mid-term seminar is completed.', 422);
        }

        $seminarField             = $validated['type'] === 'mid' ? 'mid_seminar' : 'final_seminar';
        $project->{$seminarField} =
        $validated['status'] === 'completed'
            ? ProjectProgressStatus::Completed->value
            : ProjectProgressStatus::Not_Completed->value;

        $allMilestonesCompleted =
        $project->mid_report === ProjectProgressStatus::Submitted->value
        && $project->final_report === ProjectProgressStatus::Submitted->value
            && (($validated['type'] === 'mid'
                ? $project->mid_seminar
                : $validated['status']) === ProjectProgressStatus::Completed->value)
            && (($validated['type'] === 'final'
                ? $project->final_seminar
                : $validated['status']) === ProjectProgressStatus::Completed->value);

        if ($allMilestonesCompleted && $project->status !== 'completed') {
            $project->status = 'under review';
        }

        $project->save();

        return $this->successResponse('Seminar status updated successfully.', [
            'type'   => $validated['type'],
            'status' => $validated['status'],
        ]);
    }
}
