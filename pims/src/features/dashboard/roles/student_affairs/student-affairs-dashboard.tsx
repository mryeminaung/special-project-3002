import { getSADashboard } from "@/features/student-affairs/services/sa.service";
import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { PAGE_META } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { cn } from "@/lib/utils";
import { proposalStatusColor } from "@/constants/badge-colors";
import {
	IconFileDescription,
	IconListDetails,
	IconSchool,
	IconUserStar,
	IconCircleCheck,
	IconClockHour4,
	IconDownload,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

type SADashboardData = {
	stats: {
		totalStudents: number;
		totalProposals: number;
		totalProjects: number;
		totalSupervisors: number;
		activeProjects: number;
		pendingProposals: number;
	};
	byMajor: { major: string; total: number }[];
	proposalsByStatus: Record<string, number>;
	projectsByStatus: Record<string, number>;
	recentProposals: {
		id: number;
		title: string;
		slug: string;
		status: string;
		type: string;
		supervisor: string | null;
		submittedAt: string | null;
		documentUrl: string | null;
	}[];
};

const STAT_CARDS = [
	{
		key: "totalStudents" as const,
		label: "Total Students",
		icon: IconSchool,
		color: "text-sky-600 dark:text-sky-400",
		bg: "bg-sky-50 dark:bg-sky-950/30 border-sky-200 dark:border-sky-800",
	},
	{
		key: "totalProposals" as const,
		label: "Total Proposals",
		icon: IconFileDescription,
		color: "text-violet-600 dark:text-violet-400",
		bg: "bg-violet-50 dark:bg-violet-950/30 border-violet-200 dark:border-violet-800",
	},
	{
		key: "totalProjects" as const,
		label: "Total Projects",
		icon: IconListDetails,
		color: "text-emerald-600 dark:text-emerald-400",
		bg: "bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800",
	},
	{
		key: "totalSupervisors" as const,
		label: "Supervisors",
		icon: IconUserStar,
		color: "text-amber-600 dark:text-amber-400",
		bg: "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800",
	},
];

function StatSkeleton() {
	return (
		<div className="rounded-xl border bg-card px-5 py-4 animate-pulse">
			<div className="h-3 w-24 bg-muted rounded mb-3" />
			<div className="h-8 w-16 bg-muted rounded" />
		</div>
	);
}

function StatusBar({ label, value, total, color }: { label: string; value: number; total: number; color: string }) {
	const pct = total > 0 ? Math.round((value / total) * 100) : 0;
	return (
		<div className="space-y-1">
			<div className="flex items-center justify-between text-xs">
				<span className="text-muted-foreground capitalize">{label}</span>
				<span className="font-medium tabular-nums">{value} <span className="text-muted-foreground font-normal">({pct}%)</span></span>
			</div>
			<div className="h-2 rounded-full bg-muted overflow-hidden">
				<div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
			</div>
		</div>
	);
}

export default function StudentAffairsDashboard() {
	useHeaderInitializer(PAGE_META.studentAffairsDashboard.title, PAGE_META.studentAffairsDashboard.subtitle);

	const { data, isLoading } = useQuery<SADashboardData>({
		queryKey: ["sa-dashboard"],
		queryFn: getSADashboard,
		staleTime: 60_000,
	});

	const stats = data?.stats;
	const proposalsByStatus = data?.proposalsByStatus ?? {};
	const projectsByStatus  = data?.projectsByStatus  ?? {};
	const byMajor           = data?.byMajor           ?? [];
	const recentProposals   = data?.recentProposals    ?? [];

	const totalProposals = Object.values(proposalsByStatus).reduce((a, b) => a + b, 0);
	const totalProjects  = Object.values(projectsByStatus).reduce((a, b) => a + b, 0);

	return (
		<>
			<Heading
				title="Student Affairs Dashboard"
				description="Overview of students, proposals, and project progress."
			/>

			{/* Stat cards */}
			<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
				{isLoading
					? Array.from({ length: 4 }).map((_, i) => <StatSkeleton key={i} />)
					: STAT_CARDS.map(({ key, label, icon: Icon, color, bg }) => (
						<div key={key} className={cn("rounded-xl border px-5 py-4", bg)}>
							<div className="flex items-center justify-between mb-2">
								<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
								<Icon size={16} className={color} />
							</div>
							<p className={cn("text-3xl font-bold tabular-nums", color)}>
								{stats?.[key] ?? 0}
							</p>
						</div>
					))}
			</div>

			{/* Middle row: proposal status + project status + majors */}
			<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
				{/* Proposal breakdown */}
				<div className="rounded-xl border bg-card px-5 py-4">
					<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Proposals by Status</p>
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}
						</div>
					) : (
						<div className="space-y-3">
							<StatusBar label="Pending"  value={proposalsByStatus["pending"]  ?? 0} total={totalProposals} color="bg-amber-400" />
							<StatusBar label="Approved" value={proposalsByStatus["approved"] ?? 0} total={totalProposals} color="bg-emerald-500" />
							<StatusBar label="Rejected" value={proposalsByStatus["rejected"] ?? 0} total={totalProposals} color="bg-red-400" />
						</div>
					)}
				</div>

				{/* Project breakdown */}
				<div className="rounded-xl border bg-card px-5 py-4">
					<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Projects by Status</p>
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}
						</div>
					) : (
						<div className="space-y-3">
							<StatusBar label="Active"       value={projectsByStatus["active"]       ?? 0} total={totalProjects} color="bg-sky-500" />
							<StatusBar label="Under Review" value={projectsByStatus["under review"] ?? 0} total={totalProjects} color="bg-amber-400" />
							<StatusBar label="Completed"    value={projectsByStatus["completed"]    ?? 0} total={totalProjects} color="bg-emerald-500" />
						</div>
					)}
				</div>

				{/* Students by major */}
				<div className="rounded-xl border bg-card px-5 py-4">
					<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">Students by Major</p>
					{isLoading ? (
						<div className="space-y-3">
							{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-6 bg-muted rounded animate-pulse" />)}
						</div>
					) : byMajor.length === 0 ? (
						<p className="text-sm text-muted-foreground">No data.</p>
					) : (
						<div className="space-y-3">
							{byMajor.map((m) => (
								<StatusBar
									key={m.major}
									label={m.major}
									value={m.total}
									total={stats?.totalStudents ?? 1}
									color="bg-violet-400"
								/>
							))}
						</div>
					)}
				</div>
			</div>

			{/* Recent proposals */}
			<div className="rounded-xl border bg-card overflow-hidden">
				<div className="px-5 py-3 border-b bg-muted/40 flex items-center justify-between">
					<p className="text-sm font-semibold">Recent Proposals</p>
					<span className="text-xs text-muted-foreground">Last 5</span>
				</div>
				<div className="divide-y divide-border">
					{isLoading ? (
						Array.from({ length: 5 }).map((_, i) => (
							<div key={i} className="px-5 py-3 flex items-center gap-3">
								<div className="h-4 w-48 bg-muted rounded animate-pulse" />
								<div className="h-4 w-16 bg-muted rounded animate-pulse ml-auto" />
							</div>
						))
					) : recentProposals.length === 0 ? (
						<div className="px-5 py-8 text-center text-sm text-muted-foreground">No proposals yet.</div>
					) : (
						recentProposals.map((p) => (
							<div key={p.id} className="px-5 py-3 flex items-center gap-3">
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium truncate">{p.title}</p>
									<div className="flex items-center gap-2 mt-0.5">
										{p.supervisor && (
											<span className="text-xs text-muted-foreground">{p.supervisor}</span>
										)}
										{p.submittedAt && (
											<span className="text-xs text-muted-foreground">· {p.submittedAt}</span>
										)}
									</div>
								</div>
								<div className="flex items-center gap-2 shrink-0">
									<Badge
										variant="outline"
										className={cn("capitalize text-xs font-medium", proposalStatusColor(p.status))}
									>
										{p.status === "approved" ? (
											<><IconCircleCheck size={10} className="mr-1" />{p.status}</>
										) : p.status === "pending" ? (
											<><IconClockHour4 size={10} className="mr-1" />{p.status}</>
										) : p.status}
									</Badge>
									{p.documentUrl && (
										<Button size="sm" variant="ghost" className="h-6 w-6 p-0" asChild>
											<a href={p.documentUrl} target="_blank" rel="noreferrer" title="Download proposal">
												<IconDownload size={13} />
											</a>
										</Button>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</div>
		</>
	);
}
