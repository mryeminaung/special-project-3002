import { PAGE_META } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useAuthStore } from "@/stores/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import {
	IconCalendar,
	IconCheck,
	IconChevronRight,
	IconClockHour4,
	IconFolder,
	IconMailFilled,
	IconSchool,
	IconSend,
	IconUser,
	IconX,
} from "@tabler/icons-react";
import {
	getStudentDashboardData,
	type StudentDashboardData,
} from "./services/student-dashboard.service";

// ── Helpers ────────────────────────────────────────────────────────────────

const PROPOSAL_STATUS_COLOR: Record<string, string> = {
	pending: "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/40 dark:text-amber-300 dark:border-amber-800",
	approved: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
	rejected: "bg-red-100 text-red-700 border-red-200 dark:bg-red-900/40 dark:text-red-300 dark:border-red-800",
};

const PROJECT_STATUS_COLOR: Record<string, string> = {
	active: "bg-sky-100 text-sky-700 border-sky-200 dark:bg-sky-900/40 dark:text-sky-300 dark:border-sky-800",
	completed: "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/40 dark:text-emerald-300 dark:border-emerald-800",
	"under review": "bg-violet-100 text-violet-700 border-violet-200 dark:bg-violet-900/40 dark:text-violet-300 dark:border-violet-800",
};

function capitalize(s: string) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}

// ── Sub-components ─────────────────────────────────────────────────────────

function MilestoneStep({
	label,
	sublabel,
	done,
	index,
	total,
}: {
	label: string;
	sublabel: string;
	done: boolean;
	index: number;
	total: number;
}) {
	const isLast = index === total - 1;
	return (
		<div className="flex gap-3">
			{/* Track */}
			<div className="flex flex-col items-center">
				<div
					className={cn(
						"flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
						done
							? "border-emerald-500 bg-emerald-500 dark:border-emerald-400 dark:bg-emerald-400"
							: "border-muted-foreground/25 bg-card",
					)}
				>
					{done ? (
						<IconCheck size={14} className="text-white dark:text-emerald-950" strokeWidth={3} />
					) : (
						<span className="text-[10px] font-bold text-muted-foreground">{index + 1}</span>
					)}
				</div>
				{!isLast && (
					<div
						className={cn(
							"mt-1 w-0.5 flex-1 min-h-[20px]",
							done ? "bg-emerald-400" : "bg-border",
						)}
					/>
				)}
			</div>

			{/* Content */}
			<div className="pb-5 pt-0.5 min-w-0 flex-1">
				<p className={cn("text-sm font-medium", done ? "text-foreground" : "text-muted-foreground")}>
					{label}
				</p>
				<p className="text-xs text-muted-foreground mt-0.5">{sublabel}</p>
			</div>
		</div>
	);
}

// ── Stat cards ─────────────────────────────────────────────────────────────

function StatCards({
	stats,
	navigate,
}: {
	stats: StudentDashboardData["stats"];
	navigate: (path: string) => void;
}) {
	const cards = [
		{
			label: "My Proposals",
			value: stats.totalProposals,
			icon: IconSend,
			color: "text-amber-600 dark:text-amber-400",
			bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
			onClick: () => navigate("/my-proposals"),
		},
		{
			label: "Pending Review",
			value: stats.pendingProposals,
			icon: IconClockHour4,
			color: "text-violet-600 dark:text-violet-400",
			bg: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800",
			onClick: () => navigate("/my-proposals"),
		},
		{
			label: "My Projects",
			value: stats.totalProjects,
			icon: IconFolder,
			color: "text-sky-600 dark:text-sky-400",
			bg: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800",
			onClick: () => navigate("/my-projects"),
		},
		{
			label: "Upcoming Deadlines",
			value: stats.upcomingDeadlines,
			icon: IconCalendar,
			color: "text-emerald-600 dark:text-emerald-400",
			bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
			onClick: undefined,
		},
	];

	return (
		<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
			{cards.map(({ label, value, icon: Icon, color, bg, onClick }) => (
				<button
					key={label}
					type="button"
					onClick={onClick}
					disabled={!onClick}
					className={cn(
						"rounded-xl border px-5 py-4 text-left w-full",
						onClick && "hover:shadow-sm transition-all cursor-pointer",
						!onClick && "cursor-default",
						bg,
					)}
				>
					<div className="flex items-center justify-between mb-2">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
						<Icon size={16} className={color} />
					</div>
					<p className={cn("text-3xl font-bold tabular-nums", color)}>{value}</p>
				</button>
			))}
		</div>
	);
}

function SkeletonBlock({ className }: { className?: string }) {
	return <div className={cn("animate-pulse rounded bg-muted", className)} />;
}

function DashboardSkeleton() {
	return (
		<div className="space-y-6">
			<div className="rounded-2xl border bg-card p-6 space-y-2">
				<SkeletonBlock className="h-6 w-48" />
				<SkeletonBlock className="h-4 w-64" />
			</div>
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				{Array.from({ length: 4 }).map((_, i) => (
					<SkeletonBlock key={i} className="h-24 rounded-xl" />
				))}
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
				<div className="lg:col-span-2">
					<SkeletonBlock className="h-64 rounded-xl" />
				</div>
				<div className="space-y-4">
					<SkeletonBlock className="h-32 rounded-xl" />
					<SkeletonBlock className="h-24 rounded-xl" />
				</div>
			</div>
		</div>
	);
}

// ── Summary cards ──────────────────────────────────────────────────────────

function SummaryCards({ data, navigate }: { data: StudentDashboardData; navigate: (path: string) => void }) {
	const { proposal, project } = data;
	const cards = [];

	if (proposal) {
		cards.push(
			<button
				key="proposal"
				type="button"
				onClick={() => navigate(`/my-proposals`)}
				className="group w-full rounded-xl border bg-card px-5 py-4 text-left hover:shadow-sm hover:border-primary/30 transition-all"
			>
				<div className="flex items-start justify-between mb-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-100 dark:bg-amber-900/40">
						<IconSend size={17} className="text-amber-600 dark:text-amber-300" />
					</div>
					<IconChevronRight
						size={15}
						className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
					/>
				</div>
				<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
					My Proposal
				</p>
				<p className="text-sm font-semibold leading-snug line-clamp-1">{proposal.title}</p>
				<div className="mt-2 flex items-center gap-2">
					<span
						className={cn(
							"inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
							PROPOSAL_STATUS_COLOR[proposal.status] ?? "bg-muted text-muted-foreground border-border",
						)}
					>
						{capitalize(proposal.status)}
					</span>
					{proposal.submittedAt && (
						<span className="text-[11px] text-muted-foreground">
							{formatDate(proposal.submittedAt)}
						</span>
					)}
				</div>
			</button>,
		);
	}

	if (project) {
		const milestones = [
			project.midReport === "submitted",
			project.midSeminar === "completed",
			project.finalReport === "submitted",
			project.finalSeminar === "completed",
		];
		const doneCount = milestones.filter(Boolean).length;

		cards.push(
			<button
				key="project"
				type="button"
				onClick={() => navigate(`/my-projects`)}
				className="group w-full rounded-xl border bg-card px-5 py-4 text-left hover:shadow-sm hover:border-primary/30 transition-all"
			>
				<div className="flex items-start justify-between mb-3">
					<div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-100 dark:bg-sky-900/40">
						<IconFolder size={17} className="text-sky-600 dark:text-sky-300" />
					</div>
					<IconChevronRight
						size={15}
						className="text-muted-foreground group-hover:translate-x-0.5 transition-transform"
					/>
				</div>
				<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
					Active Project
				</p>
				<p className="text-sm font-semibold leading-snug line-clamp-1">{project.name}</p>
				<div className="mt-2 flex items-center gap-3">
					<span
						className={cn(
							"inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize",
							PROJECT_STATUS_COLOR[project.status] ?? "bg-muted text-muted-foreground border-border",
						)}
					>
						{capitalize(project.status)}
					</span>
					<div className="flex items-center gap-1.5 flex-1 min-w-0">
						<div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
							<div
								className={cn(
									"h-full rounded-full",
									doneCount === 4 ? "bg-emerald-500" : doneCount >= 2 ? "bg-amber-400" : "bg-sky-400",
								)}
								style={{ width: `${(doneCount / 4) * 100}%` }}
							/>
						</div>
						<span className="text-[11px] text-muted-foreground tabular-nums shrink-0">
							{doneCount}/4
						</span>
					</div>
				</div>
			</button>,
		);
	}

	if (cards.length === 0) return null;

	return (
		<div className={cn("grid gap-4", cards.length === 1 ? "grid-cols-1 max-w-sm" : "grid-cols-1 sm:grid-cols-2")}>
			{cards}
		</div>
	);
}

// ── Milestones timeline ────────────────────────────────────────────────────

function MilestonesSection({ project }: { project: NonNullable<StudentDashboardData["project"]> }) {
	const steps = [
		{
			label: "Mid-term Report",
			sublabel: project.midReport === "submitted" ? "Submitted" : "Not submitted yet",
			done: project.midReport === "submitted",
		},
		{
			label: "Mid-term Seminar",
			sublabel: project.midSeminar === "completed" ? "Completed" : "Not completed yet",
			done: project.midSeminar === "completed",
		},
		{
			label: "Final Report",
			sublabel: project.finalReport === "submitted" ? "Submitted" : "Not submitted yet",
			done: project.finalReport === "submitted",
		},
		{
			label: "Final Seminar",
			sublabel: project.finalSeminar === "completed" ? "Completed" : "Not completed yet",
			done: project.finalSeminar === "completed",
		},
	];

	const doneCount = steps.filter((s) => s.done).length;

	return (
		<div className="rounded-xl border bg-card overflow-hidden">
			<div className="px-5 py-3.5 border-b bg-muted/40 flex items-center justify-between">
				<p className="text-sm font-semibold">Project Milestones</p>
				<span className="text-xs text-muted-foreground">
					{doneCount} of {steps.length} done
				</span>
			</div>
			<div className="p-5">
				{steps.map((step, i) => (
					<MilestoneStep
						key={step.label}
						{...step}
						index={i}
						total={steps.length}
					/>
				))}
			</div>
		</div>
	);
}

// ── Proposal status section ─────────────────────────────────────────────────

function ProposalStatusSection({ proposal }: { proposal: NonNullable<StudentDashboardData["proposal"]> }) {
	const statusIcons: Record<string, React.ReactNode> = {
		pending: <IconClockHour4 size={18} className="text-amber-600 dark:text-amber-400" />,
		approved: <IconCheck size={18} className="text-emerald-600 dark:text-emerald-400" strokeWidth={3} />,
		rejected: <IconX size={18} className="text-red-600 dark:text-red-400" strokeWidth={3} />,
	};

	const statusDescriptions: Record<string, string> = {
		pending: "Your proposal is under review by the IC. You'll be notified once a decision is made.",
		approved: "Your proposal has been approved and converted to an active project.",
		rejected: "Your proposal was not approved. You may submit a revised proposal.",
	};

	return (
		<div className="rounded-xl border bg-card overflow-hidden">
			<div className="px-5 py-3.5 border-b bg-muted/40">
				<p className="text-sm font-semibold">Proposal Status</p>
			</div>
			<div className="p-5 space-y-4">
				<div className="flex items-start gap-3">
					<div
						className={cn(
							"flex h-9 w-9 shrink-0 items-center justify-center rounded-full border-2",
							proposal.status === "approved"
								? "border-emerald-500 bg-emerald-50 dark:bg-emerald-900/30"
								: proposal.status === "rejected"
									? "border-red-400 bg-red-50 dark:bg-red-900/30"
									: "border-amber-400 bg-amber-50 dark:bg-amber-900/30",
						)}
					>
						{statusIcons[proposal.status] ?? <IconClockHour4 size={18} className="text-muted-foreground" />}
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold line-clamp-2">{proposal.title}</p>
						<p className="text-xs text-muted-foreground mt-0.5">
							{statusDescriptions[proposal.status] ?? "Status unknown"}
						</p>
					</div>
				</div>

				<div className="divide-y divide-border rounded-lg border bg-muted/30 text-sm">
					{[
						{ label: "Type", value: capitalize(proposal.type) },
						{ label: "Project Type", value: capitalize(proposal.projectType) },
						proposal.projectArea && { label: "Area", value: proposal.projectArea },
						proposal.supervisor && { label: "Supervisor", value: proposal.supervisor },
						proposal.submittedAt && { label: "Submitted", value: formatDate(proposal.submittedAt) },
					]
						.filter(Boolean)
						.map((row) => {
							const r = row as { label: string; value: string };
							return (
								<div key={r.label} className="flex items-center gap-3 px-3 py-2">
									<span className="text-xs text-muted-foreground w-24 shrink-0">{r.label}</span>
									<span className="text-xs font-medium">{r.value}</span>
								</div>
							);
						})}
				</div>
			</div>
		</div>
	);
}

// ── Supervisor card ─────────────────────────────────────────────────────────

function SupervisorCard({ supervisor }: { supervisor: StudentDashboardData["supervisor"] }) {
	if (!supervisor) {
		return (
			<div className="rounded-xl border bg-card p-5 flex flex-col items-center justify-center gap-2 text-center min-h-[100px]">
				<IconUser size={22} className="text-muted-foreground/30" />
				<p className="text-xs text-muted-foreground">No supervisor assigned yet.</p>
			</div>
		);
	}

	return (
		<div className="rounded-xl border bg-card overflow-hidden">
			<div className="px-5 py-3.5 border-b bg-muted/40">
				<p className="text-sm font-semibold">Supervisor</p>
			</div>
			<div className="p-5 space-y-3">
				<div className="flex items-center gap-3">
					<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-100 dark:bg-violet-900/40">
						<IconUser size={18} className="text-violet-600 dark:text-violet-300" />
					</div>
					<div className="min-w-0">
						<p className="text-sm font-semibold truncate">{supervisor.name}</p>
						{supervisor.department && (
							<p className="text-xs text-muted-foreground truncate">{supervisor.department}</p>
						)}
					</div>
				</div>
				<a
					href={`mailto:${supervisor.email}`}
					className="flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
				>
					<IconMailFilled size={13} />
					{supervisor.email}
				</a>
			</div>
		</div>
	);
}

// ── Deadlines card ─────────────────────────────────────────────────────────

function DeadlinesCard({ deadlines }: { deadlines: StudentDashboardData["upcomingDeadlines"] }) {
	if (deadlines.length === 0) return null;

	return (
		<div className="rounded-xl border bg-card overflow-hidden">
			<div className="px-5 py-3.5 border-b bg-muted/40 flex items-center gap-1.5">
				<IconCalendar size={14} className="text-muted-foreground" />
				<p className="text-sm font-semibold">Upcoming Deadlines</p>
			</div>
			<div className="divide-y divide-border">
				{deadlines.map((d, i) => (
					<div key={i} className="flex items-start gap-3 px-5 py-3">
						<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30 mt-0.5">
							<IconCalendar size={13} className="text-red-600 dark:text-red-400" />
						</div>
						<div>
							<p className="text-sm font-medium leading-snug">{d.title}</p>
							<p className="text-xs text-muted-foreground mt-0.5">{formatDate(d.date)}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

// ── Main component ─────────────────────────────────────────────────────────

export default function StudentDashboard() {
	useHeaderInitializer(PAGE_META.studentDashboard.title, PAGE_META.studentDashboard.subtitle);
	const navigate = useNavigate();
	const authUser = useAuthStore((state) => state.authUser);

	const { data, isLoading } = useQuery({
		queryKey: ["studentDashboardData"],
		queryFn: getStudentDashboardData,
		staleTime: 60_000,
	});

	const firstName = authUser?.name ?? "Student";
	const hasDetail = !!(data?.proposal || data?.project);

	if (isLoading) return <DashboardSkeleton />;

	return (
		<div className="space-y-6">
			{/* Welcome banner */}
			<div className="rounded-2xl border bg-card px-6 py-5 flex items-center justify-between gap-4">
				<div>
					<h1 className="text-xl font-bold tracking-tight">
						Welcome back, {firstName}!
					</h1>
					<p className="text-sm text-muted-foreground mt-0.5">
						Here's a summary of your academic progress.
					</p>
				</div>
				<div className="hidden sm:flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
					<IconSchool size={22} className="text-primary" />
				</div>
			</div>

			{/* Stat cards — always shown */}
			{data?.stats && <StatCards stats={data.stats} navigate={navigate} />}

			{/* Detail section — only when there's something to show */}
			{hasDetail && (
				<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
					{/* Left — milestones or proposal status */}
					<div className="lg:col-span-2">
						{data?.project ? (
							<MilestonesSection project={data.project} />
						) : data?.proposal ? (
							<ProposalStatusSection proposal={data.proposal} />
						) : null}
					</div>

					{/* Right — supervisor + deadlines */}
					<div className="space-y-4">
						<SupervisorCard supervisor={data?.supervisor ?? null} />
						{data && data.upcomingDeadlines.length > 0 && (
							<DeadlinesCard deadlines={data.upcomingDeadlines} />
						)}
					</div>
				</div>
			)}
		</div>
	);
}
