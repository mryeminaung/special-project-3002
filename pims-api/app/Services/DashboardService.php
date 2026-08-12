<?php

namespace App\Services;

use App\Enums\ProjectStatus;
use App\Enums\ProposalStatus;
use App\Models\Project;
use App\Models\ProjectArea;
use App\Models\ProjectEvent;
use App\Models\Proposal;
use App\Models\Student;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardService
{
    // ─── IC ───────────────────────────────────────────────────────────────────

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
        ];
    }

    private function getICStats(): array
    {
        return [
            'pendingProposals'  => Proposal::where('status', ProposalStatus::Pending)->count(),
            'approvedProjects'  => Project::where('status', ProjectStatus::Active)->count(),
            'completedProjects' => Project::where('status', ProjectStatus::Completed)->count(),
            'overdueProjects'   => Project::where('end_date', '<', Carbon::now())
                ->where('status', '!=', ProjectStatus::Completed)
                ->count(),
        ];
    }

    private function getProposalStatus(): array
    {
        return Proposal::select('status', DB::raw('count(*) as value'))
            ->groupBy('status')
            ->get()
            ->map(fn($item) => [
                'name'  => ucfirst($item->status->value),
                'value' => $item->value,
                'color' => match ($item->status) {
                    ProposalStatus::Pending  => '#f59e0b',
                    ProposalStatus::Approved => '#22c55e',
                    ProposalStatus::Rejected => '#ef4444',
                    default                  => '#6b7280',
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
            ->latest()
            ->limit(20)
            ->get()
            ->map(fn($project) => [
                'id'             => $project->id,
                'name'           => $project->name,
                'slug'           => $project->slug,
                'supervisorName' => $project->supervisor?->name,
                'midReport'      => $project->mid_report,
                'midSeminar'     => $project->mid_seminar,
                'finalReport'    => $project->final_report,
                'finalSeminar'   => $project->final_seminar,
            ])
            ->toArray();
    }

    private function getRecentActivities(): array
    {
        $proposals = Proposal::latest('submitted_at')
            ->take(3)
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'icon'        => 'FileText',
                'description' => 'New proposal "' . $p->title . '" submitted',
                'timestamp'   => $p->submitted_at?->diffForHumans() ?? 'Recently',
                'type'        => 'proposal',
            ]);

        $projects = Project::latest()
            ->take(3)
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'icon'        => 'CheckCircle',
                'description' => 'Project "' . $p->name . '" created',
                'timestamp'   => $p->created_at?->diffForHumans() ?? 'Recently',
                'type'        => 'project',
            ]);

        return $proposals->concat($projects)->take(6)->values()->toArray();
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
        return User::role('faculty')
            ->with('faculty.department')
            ->withCount(['projects as assigned' => fn($q) => $q->where('status', ProjectStatus::Active)])
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

    // ─── Admin ────────────────────────────────────────────────────────────────

    public function getAdminDashboardData(): array
    {
        return [
            'noOfStudents'     => User::role('student')->count(),
            'noOfFaculties'    => User::role('faculty')->count(),
            'noOfProjectAreas' => ProjectArea::count(),
            'noOfEvents'       => ProjectEvent::count(),
        ];
    }

    // ─── Student Affairs ──────────────────────────────────────────────────────

    public function getStudentAffairsDashboardData(): array
    {
        $totalStudents = Student::count();

        $byGraduationStatus = Student::select('graduation_status', DB::raw('count(*) as total'))
            ->groupBy('graduation_status')
            ->pluck('total', 'graduation_status')
            ->toArray();

        $byMajor = Student::select('major_id', DB::raw('count(*) as total'))
            ->with('major:id,name')
            ->groupBy('major_id')
            ->get()
            ->map(fn($s) => [
                'major' => $s->major?->name ?? 'Unknown',
                'total' => $s->total,
            ])
            ->toArray();

        return [
            'totalStudents'      => $totalStudents,
            'byGraduationStatus' => $byGraduationStatus,
            'byMajor'            => $byMajor,
        ];
    }

    // ─── Faculty / Supervisor ─────────────────────────────────────────────────

    public function getFacultyDashboardData(int $userId): array
    {
        $activeProjects = Project::where('supervisor_id', $userId)
            ->where('status', ProjectStatus::Active)
            ->with('leader:id,name')
            ->get()
            ->map(fn($p) => [
                'id'          => $p->id,
                'name'        => $p->name,
                'slug'        => $p->slug,
                'leader'      => $p->leader?->name,
                'midReport'   => $p->mid_report,
                'midSeminar'  => $p->mid_seminar,
                'finalReport' => $p->final_report,
                'finalSeminar' => $p->final_seminar,
            ]);

        $upcomingDeadlines = Project::where('supervisor_id', $userId)
            ->where(
                fn($q) => $q
                    ->whereNotNull('mid_seminar_deadline')
                    ->orWhereNotNull('final_seminar_deadline')
            )
            ->get()
            ->flatMap(
                fn($p) => collect()
                    ->when($p->mid_seminar_deadline && Carbon::parse($p->mid_seminar_deadline)->isFuture(), fn($c) => $c->push([
                        'title' => $p->name . ' - Mid Seminar',
                        'date'  => $p->mid_seminar_deadline,
                    ]))
                    ->when($p->final_seminar_deadline && Carbon::parse($p->final_seminar_deadline)->isFuture(), fn($c) => $c->push([
                        'title' => $p->name . ' - Final Seminar',
                        'date'  => $p->final_seminar_deadline,
                    ]))
            )
            ->sortBy('date')
            ->values()
            ->take(5);

        return [
            'stats' => [
                'activeProjects'    => Project::where('supervisor_id', $userId)->where('status', ProjectStatus::Active)->count(),
                'pendingProposals'  => Proposal::where('supervisor_id', $userId)->where('status', ProposalStatus::Pending)->count(),
                'totalProposals'    => Proposal::where('supervisor_id', $userId)->count(),
                'completedProjects' => Project::where('supervisor_id', $userId)->where('status', ProjectStatus::Completed)->count(),
            ],
            'activeProjects'    => $activeProjects,
            'upcomingDeadlines' => $upcomingDeadlines,
        ];
    }

    // ─── Student ──────────────────────────────────────────────────────────────

    public function getStudentDashboardData(int $userId): array
    {
        $proposal = Proposal::where('student_id', $userId)
            ->with('supervisor:id,name')
            ->latest()
            ->first();

        $project = Project::where('leader_id', $userId)
            ->orWhereHas('members', fn($q) => $q->where('users.id', $userId))
            ->with('supervisor:id,name')
            ->latest()
            ->first();

        return [
            'proposal' => $proposal ? [
                'id'     => $proposal->id,
                'title'  => $proposal->title,
                'slug'   => $proposal->slug,
                'status' => $proposal->status,
                'type'   => $proposal->type,
                'supervisor' => $proposal->supervisor?->name,
            ] : null,
            'project' => $project ? [
                'id'           => $project->id,
                'name'         => $project->name,
                'slug'         => $project->slug,
                'status'       => $project->status,
                'supervisor'   => $project->supervisor?->name,
                'midReport'    => $project->mid_report,
                'midSeminar'   => $project->mid_seminar,
                'finalReport'  => $project->final_report,
                'finalSeminar' => $project->final_seminar,
            ] : null,
        ];
    }
}
