<?php

namespace App\Services;

use App\Http\Resources\ProjectProgressResource;
use App\Models\Project;
use App\Models\ProjectArea;
use App\Models\ProjectEvent;
use App\Models\Proposal;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    public function getICDashboardData(): array
    {
        return [
            'stats'              => $this->getICStats(),
            'proposalStatus'     => $this->getProposalStatus(),
            'monthlySubmissions' => $this->getMonthlySubmissions(),
            'projectProgress'    => $this->getProjectProgress(),
            'recentActivities'   => $this->getRecentActivities(),
            'upcomingDeadlines'  => $this->getUpcomingDeadlines(),
            'supervisorWorkload' => $this->getSupervisorWorkload(),
            'notifications'      => $this->getNotifications(),
        ];
    }

    private function getICStats(): array
    {
        return [
            'pendingProposals'  => Proposal::where('status', 'pending')->count(),
            'approvedProjects'  => Project::where('status', 'active')->count(),
            'completedProjects' => Project::where('status', 'completed')->count(),
            'overdueProjects'   => Project::where('end_date', '<', Carbon::now())
                ->where('status', '!=', 'completed')
                ->count(),
        ];
    }

    private function getProposalStatus(): array
    {
        return Proposal::select('status', DB::raw('count(*) as value'))
            ->groupBy('status')
            ->get()
            ->map(fn($item) => [
                'name'  => ucfirst($item->status),
                'value' => $item->value,
                'color' => match ($item->status) {
                    'pending'      => '#f59e0b',
                    'approved'     => '#22c55e',
                    'rejected'     => '#ef4444',
                    'under_review' => '#3b82f6',
                    default        => '#6b7280',
                },
            ])
            ->toArray();
    }

    private function getMonthlySubmissions(): array
    {
        return Proposal::whereYear('created_at', Carbon::now()->year)
            ->selectRaw("EXTRACT(MONTH FROM created_at) as month_num, TO_CHAR(created_at, 'Mon') as month, count(*) as count")
            ->groupBy('month_num', 'month')
            ->orderBy('month_num')
            ->get()
            ->map(fn($item) => [
                'month' => $item->month,
                'count' => (int) $item->count,
            ])
            ->toArray();
    }

    private function getProjectProgress(): array
    {
        return Project::with('supervisor:id,name')
            ->get()
            ->map(fn($project) => [
                'id'             => $project->id,
                'name'           => $project->name,
                'slug'           => $project->slug,
                'supervisorName' => $project->supervisor?->name,
                'midReport'      => $project->mid_report ?? 'not submitted',
                'midSeminar'     => $project->mid_seminar ?? 'not submitted',
                'finalReport'    => $project->final_report ?? 'not submitted',
                'finalSeminar'   => $project->final_seminar ?? 'not submitted',
            ])
            ->toArray();
    }

    private function getRecentActivities(): array
    {
        $proposals = Proposal::latest('submitted_at')->take(3)->get()->map(fn($p) => [
            'id'          => $p->id,
            'icon'        => 'FileText',
            'description' => 'New proposal "' . $p->title . '" submitted',
            'timestamp'   => $p->submitted_at?->diffForHumans() ?? 'Recently',
            'type'        => 'proposal',
        ]);

        $projects = Project::orderByDesc('id')->take(3)->get()->map(fn($p) => [
            'id'          => $p->id,
            'icon'        => 'CheckCircle',
            'description' => 'Project "' . $p->name . '" updated',
            'timestamp'   => 'Recently',
            'type'        => 'project',
        ]);

        return $proposals->concat($projects)->take(6)->toArray();
    }

    private function getUpcomingDeadlines(): array
    {
        return Project::whereNotNull('mid_seminar_deadline')
            ->orWhereNotNull('final_seminar_deadline')
            ->get()
            ->flatMap(
                fn($p) => collect()
                    ->when($p->mid_seminar_deadline, fn($c) => $c->push([
                        'id'    => $p->id . '-mid',
                        'title' => $p->name . ' - Mid Seminar',
                        'date'  => $p->mid_seminar_deadline,
                        'type'  => 'seminar',
                    ]))
                    ->when($p->final_seminar_deadline, fn($c) => $c->push([
                        'id'    => $p->id . '-final',
                        'title' => $p->name . ' - Final Seminar',
                        'date'  => $p->final_seminar_deadline,
                        'type'  => 'seminar',
                    ]))
            )
            ->filter(fn($d) => Carbon::parse($d['date'])->isFuture())
            ->sortBy('date')
            ->values()
            ->take(5)
            ->toArray();
    }

    private function getSupervisorWorkload(): array
    {
        return User::where('is_student', false)
            ->withCount(['projects as assigned' => fn($q) => $q->where('status', 'active')])
            ->get()
            ->map(fn($user) => [
                'id'          => $user->id,
                'name'        => $user->name,
                'assigned'    => $user->assigned ?? 0,
                'maxCapacity' => 10,
                'department'  => $user->faculty?->department?->name ?? 'N/A',
            ])
            ->toArray();
    }

    private function getNotifications(): array
    {
        return [];
    }

    public function getFacultyDashboardData(int $userId): array
    {
        $assignedProjects = Project::where('supervisor_id', $userId)->count();
        $pendingProposals = Proposal::where('status', 'pending')
            ->where('supervisor_id', $userId)
            ->count();
        $totalProposals = Proposal::where('supervisor_id', $userId)->count();

        return [
            'assignedProjects' => $assignedProjects,
            'pendingProposals' => $pendingProposals,
            'totalProposals'   => $totalProposals,
        ];
    }

    public function getAdminDashboardData(): array
    {
        $noOfFaculties    = User::where('is_student', false)->count();
        $noOfStudents     = User::where('is_student', true)->count();
        $noOfProjectAreas = ProjectArea::count();
        $noOfEvents       = ProjectEvent::count();

        return [
            'noOfStudents'     => $noOfStudents,
            'noOfFaculties'    => $noOfFaculties,
            'noOfProjectAreas' => $noOfProjectAreas,
            'noOfEvents'       => $noOfEvents,
        ];
    }

    public function getStudentDashboardData(int $userId): array
    {
        $noOfProposals = Proposal::where('student_id', $userId)->count();
        $noOfProjects = Project::where('leader_id', $userId)->count();

        return [
            'noOfProposals' => $noOfProposals,
            'noOfProjects'  => $noOfProjects,
        ];
    }
}
