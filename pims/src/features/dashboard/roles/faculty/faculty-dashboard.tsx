import { getDashboardData } from "../../services/dashboard.service";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import ViewDetail from "@/components/view-detail";
import {
	IconCalendar,
	IconCheck,
	IconClockHour4,
	IconFolder,
	IconFolderCheck,
	IconListDetails,
	IconSend,
	IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router";

type ActiveProject = {
	id: number;
	name: string;
	slug: string;
	leader: string | null;
	midReport: string;
	midSeminar: string;
	finalReport: string;
	finalSeminar: string;
};

type Deadline = {
	title: string;
	date: string;
};

type FacultyDashboardData = {
	stats: {
		activeProjects: number;
		completedProjects: number;
		pendingProposals: number;
		totalProposals: number;
	};
	activeProjects: ActiveProject[];
	upcomingDeadlines: Deadline[];
};

function StatCard({
	label,
	value,
	icon: Icon,
	colorClass,
	bgClass,
	onClick,
}: {
	label: string;
	value: number;
	icon: React.ElementType;
	colorClass: string;
	bgClass: string;
	onClick?: () => void;
}) {
	return (
		<button
			type="button"
			onClick={onClick}
			className={cn(
				"rounded-xl border px-5 py-4 text-left transition-all hover:shadow-sm w-full",
				bgClass,
			)}
		>
			<div className="flex items-center justify-between mb-2">
				<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
				<Icon size={16} className={colorClass} />
			</div>
			<p className={cn("text-3xl font-bold tabular-nums", colorClass)}>{value}</p>
		</button>
	);
}

function MilestoneIcon({ done }: { done: boolean }) {
	return done ? (
		<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/40">
			<IconCheck size={11} className="text-emerald-600 dark:text-emerald-400" />
		</span>
	) : (
		<span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-muted">
			<IconX size={11} className="text-muted-foreground/40" />
		</span>
	);
}

function ProgressChip({ done, total }: { done: number; total: number }) {
	const pct = Math.round((done / total) * 100);
	const color =
		pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-muted-foreground/30";
	return (
		<div className="flex items-center gap-2 min-w-[80px]">
			<div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
				<div className={cn("h-full rounded-full", color)} style={{ width: `${pct}%` }} />
			</div>
			<span className="text-[10px] text-muted-foreground tabular-nums">{done}/{total}</span>
		</div>
	);
}

function ProjectSkeleton() {
	return Array.from({ length: 3 }).map((_, i) => (
		<div key={i} className="flex items-center gap-4 px-4 py-3 border-b last:border-0 animate-pulse">
			<div className="flex-1 space-y-1.5">
				<div className="h-3.5 w-48 bg-muted rounded" />
				<div className="h-3 w-28 bg-muted rounded" />
			</div>
			<div className="flex gap-1.5">
				{Array.from({ length: 4 }).map((_, j) => (
					<div key={j} className="h-5 w-5 rounded-full bg-muted" />
				))}
			</div>
		</div>
	));
}

export default function FacultyDashboard() {
	useHeaderInitializer(PAGE_META.facultyDashboard.title, PAGE_META.facultyDashboard.subtitle);
	const navigate = useNavigate();
	const { isSupervisor } = useRoleChecker();

	const { data, isLoading } = useQuery<FacultyDashboardData>({
		queryKey: ["FacultyDashboardData"],
		queryFn: getDashboardData,
		staleTime: 60_000,
	});

	const stats           = data?.stats;
	const activeProjects  = data?.activeProjects  ?? [];
	const upcomingDeadlines = data?.upcomingDeadlines ?? [];

	return (
		<div className="space-y-6">
			<Heading
				title={HEADINGS.facultyDashboard.title}
				description={HEADINGS.facultyDashboard.description}
			/>

			{/* Stat cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
				<StatCard
					label="Active Projects"
					value={stats?.activeProjects ?? 0}
					icon={IconFolder}
					colorClass="text-sky-600 dark:text-sky-400"
					bgClass="bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800"
					onClick={() => navigate("/assigned-projects")}
				/>
				<StatCard
					label="Completed"
					value={stats?.completedProjects ?? 0}
					icon={IconFolderCheck}
					colorClass="text-emerald-600 dark:text-emerald-400"
					bgClass="bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800"
					onClick={() => navigate("/assigned-projects")}
				/>
				<StatCard
					label="Pending Proposals"
					value={stats?.pendingProposals ?? 0}
					icon={IconClockHour4}
					colorClass="text-amber-600 dark:text-amber-400"
					bgClass="bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
					onClick={() => navigate("/proposals/all")}
				/>
				<StatCard
					label="Total Proposals"
					value={stats?.totalProposals ?? 0}
					icon={IconSend}
					colorClass="text-violet-600 dark:text-violet-400"
					bgClass="bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800"
					onClick={() => navigate("/proposals/all")}
				/>
			</div>

			{/* Main content row */}
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

				{/* Active projects table — takes 2/3 */}
				<div className="lg:col-span-2 rounded-xl border bg-card overflow-hidden">
					<div className="px-5 py-3 border-b bg-muted/40 flex items-center justify-between">
						<p className="text-sm font-semibold flex items-center gap-1.5">
							<IconListDetails size={14} className="text-muted-foreground" />
							Active Projects
						</p>
						<button
							type="button"
							onClick={() => navigate("/assigned-projects")}
							className="text-xs text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
						>
							View all
						</button>
					</div>

					{/* Column labels */}
					<div className="grid grid-cols-[1fr_auto_auto] gap-4 px-4 py-2 border-b bg-muted/20">
						<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">Project</span>
						<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground text-center w-28">Milestones</span>
						<span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground w-20">Progress</span>
					</div>

					<div className="divide-y divide-border">
						{isLoading ? (
							<ProjectSkeleton />
						) : activeProjects.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-12 text-center">
								<IconFolder size={32} className="mb-2 text-muted-foreground/30" />
								<p className="text-sm text-muted-foreground">No active projects.</p>
							</div>
						) : (
							activeProjects.map((project) => {
								const milestones = [
									{ label: "Mid Report",    done: project.midReport   === "submitted" },
									{ label: "Mid Seminar",   done: project.midSeminar  === "completed" },
									{ label: "Final Report",  done: project.finalReport === "submitted" },
									{ label: "Final Seminar", done: project.finalSeminar === "completed" },
								];
								const doneCount = milestones.filter((m) => m.done).length;

								return (
									<div
										key={project.id}
										className="grid grid-cols-[1fr_auto_auto] gap-4 items-center px-4 py-3 hover:bg-muted/20 transition-colors"
									>
										<div className="min-w-0">
											<p className="text-sm font-medium truncate" title={project.name}>
												{project.name}
											</p>
											{project.leader && (
												<p className="text-xs text-muted-foreground mt-0.5">
													Leader: {project.leader}
												</p>
											)}
										</div>

										<div className="flex items-center gap-1 w-28 justify-center">
											{milestones.map((m) => (
												<span key={m.label} title={m.label}>
													<MilestoneIcon done={m.done} />
												</span>
											))}
										</div>

										<div className="w-20 flex items-center gap-2">
											<ProgressChip done={doneCount} total={4} />
											<ViewDetail url={`/projects/faculty/${project.slug}/detail`} />
										</div>
									</div>
								);
							})
						)}
					</div>

					{/* Milestone legend */}
					<div className="px-4 py-2 border-t bg-muted/20 flex items-center gap-4 text-[10px] text-muted-foreground">
						<span>MR = Mid Report</span>
						<span>MS = Mid Seminar</span>
						<span>FR = Final Report</span>
						<span>FS = Final Seminar</span>
					</div>
				</div>

				{/* Upcoming deadlines — 1/3 */}
				<div className="rounded-xl border bg-card overflow-hidden">
					<div className="px-5 py-3 border-b bg-muted/40">
						<p className="text-sm font-semibold flex items-center gap-1.5">
							<IconCalendar size={14} className="text-muted-foreground" />
							Upcoming Deadlines
						</p>
					</div>

					<div className="divide-y divide-border">
						{isLoading ? (
							Array.from({ length: 4 }).map((_, i) => (
								<div key={i} className="px-4 py-3 space-y-1.5 animate-pulse">
									<div className="h-3.5 w-40 bg-muted rounded" />
									<div className="h-3 w-24 bg-muted rounded" />
								</div>
							))
						) : upcomingDeadlines.length === 0 ? (
							<div className="flex flex-col items-center justify-center py-10 text-center">
								<IconCalendar size={28} className="mb-2 text-muted-foreground/30" />
								<p className="text-sm text-muted-foreground">No upcoming deadlines.</p>
							</div>
						) : (
							upcomingDeadlines.map((d, i) => (
								<div key={i} className="px-4 py-3">
									<p className="text-sm font-medium leading-snug">{d.title}</p>
									<div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
										<IconCalendar size={11} />
										{formatDate(d.date)}
									</div>
								</div>
							))
						)}
					</div>
				</div>
			</div>

			{/* Supervisor-only hint */}
			{isSupervisor && activeProjects.length > 0 && (
				<p className="text-xs text-muted-foreground text-right">
					Milestone icons: hover each icon to see what it represents.
				</p>
			)}
		</div>
	);
}
