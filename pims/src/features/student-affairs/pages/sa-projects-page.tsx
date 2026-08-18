import { getSAProjects } from "../services/sa.service";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { PAGE_META } from "@/constants/navigation";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import ViewDetail from "@/components/view-detail";
import { cn } from "@/lib/utils";
import { projectStatusColor, projectTypeColor } from "@/constants/badge-colors";
import {
	IconCheck,
	IconClockHour4,
	IconListDetails,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";

type ProgressStatus = {
	midReport: boolean;
	finalReport: boolean;
	midSeminar: boolean;
	finalSeminar: boolean;
	midReportApproved: boolean;
	finalReportApproved: boolean;
};

type Project = {
	id: number;
	title: string;
	slug: string;
	status: string;
	type: string;
	projectType: string;
	supervisor: { id: number; name: string } | null;
	leader: { id: number; name: string } | null;
	progressStatus: ProgressStatus;
	academicYear: string | null;
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
	special: "Special",
	capstone: "Capstone",
	master: "Master / Thesis",
	"master/thesis": "Master / Thesis",
};

function MilestoneCell({ done, label }: { done: boolean; label: string }) {
	return (
		<div className="flex items-center gap-1" title={label}>
			{done ? (
				<IconCheck size={13} className="text-emerald-500 shrink-0" />
			) : (
				<IconClockHour4 size={13} className="text-muted-foreground/40 shrink-0" />
			)}
		</div>
	);
}

function ProgressBar({ progress }: { progress: number }) {
	const pct = Math.round(progress * 100);
	const color = pct === 100 ? "bg-emerald-500" : pct >= 50 ? "bg-amber-400" : "bg-muted-foreground/30";
	return (
		<div className="flex items-center gap-2">
			<div className="flex-1 h-1.5 rounded-full bg-muted overflow-hidden">
				<div className={cn("h-full rounded-full transition-all", color)} style={{ width: `${pct}%` }} />
			</div>
			<span className="text-[10px] text-muted-foreground tabular-nums w-7 text-right">{pct}%</span>
		</div>
	);
}

export default function SAProjectsPage() {
	useHeaderInitializer(PAGE_META.saProjects.title, PAGE_META.saProjects.subtitle);

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");

	const { data: projects = [], isLoading } = useQuery<Project[]>({
		queryKey: ["sa-projects"],
		queryFn: getSAProjects,
		staleTime: 30_000,
	});

	const filtered = useMemo(() => {
		return projects.filter((p) => {
			if (statusFilter !== "all" && p.status !== statusFilter) return false;
			if (typeFilter !== "all" && p.type !== typeFilter) return false;
			if (!search) return true;
			const q = search.toLowerCase();
			return (
				p.title.toLowerCase().includes(q) ||
				(p.supervisor?.name ?? "").toLowerCase().includes(q) ||
				(p.leader?.name ?? "").toLowerCase().includes(q)
			);
		});
	}, [projects, search, statusFilter, typeFilter]);

	const activeCount    = projects.filter((p) => p.status === "active").length;
	const completedCount = projects.filter((p) => p.status === "completed").length;
	const reviewCount    = projects.filter((p) => p.status === "under review").length;

	function getProgress(ps: ProgressStatus): number {
		const milestones = [
			ps.midReportApproved,
			ps.midSeminar,
			ps.finalReportApproved,
			ps.finalSeminar,
		];
		return milestones.filter(Boolean).length / milestones.length;
	}

	return (
		<>
			<Heading
				title="Projects"
				description="Monitor project registration, submissions, and completion status."
			/>

			{/* Stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
				{[
					{ label: "Total", value: projects.length, cls: "text-foreground" },
					{ label: "Active", value: activeCount, cls: "text-sky-600 dark:text-sky-400" },
					{ label: "Under Review", value: reviewCount, cls: "text-amber-600 dark:text-amber-400" },
					{ label: "Completed", value: completedCount, cls: "text-emerald-600 dark:text-emerald-400" },
				].map((s) => (
					<div key={s.label} className="rounded-xl border bg-card px-4 py-3">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
						<p className={cn("text-2xl font-bold", s.cls)}>{isLoading ? "—" : s.value}</p>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3 mb-4">
				<div className="relative flex-1 min-w-48 max-w-sm">
					<IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search title, supervisor, leader…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-8"
					/>
					{search && (
						<button
							type="button"
							onClick={() => setSearch("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<IconX size={14} />
						</button>
					)}
				</div>

				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="under review">Under Review</SelectItem>
						<SelectItem value="completed">Completed</SelectItem>
					</SelectContent>
				</Select>

				<Select value={typeFilter} onValueChange={setTypeFilter}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
						<SelectItem value="student">Student</SelectItem>
						<SelectItem value="faculty">Faculty</SelectItem>
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<div className="rounded-xl border bg-card overflow-hidden">
				<Table>
					<TableHeader className="bg-muted/40">
						<TableRow>
							<TableHead className="font-semibold">Project</TableHead>
							<TableHead className="font-semibold hidden md:table-cell">Supervisor</TableHead>
							<TableHead className="font-semibold hidden lg:table-cell">Status</TableHead>
							<TableHead className="font-semibold">
								<span className="hidden lg:inline">Progress</span>
								<span className="lg:hidden">Prog.</span>
							</TableHead>
							<TableHead className="font-semibold hidden lg:table-cell">Milestones</TableHead>
							<TableHead className="font-semibold w-20">Detail</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 8 }).map((_, i) => (
								<TableRow key={i}>
									{Array.from({ length: 6 }).map((_, j) => (
										<TableCell key={j}>
											<div className="h-4 rounded bg-muted animate-pulse" />
										</TableCell>
									))}
								</TableRow>
							))
						) : filtered.length === 0 ? (
							<TableRow>
								<TableCell colSpan={6} className="py-16 text-center">
									<IconListDetails size={32} className="mx-auto mb-2 text-muted-foreground/30" />
									<p className="text-sm text-muted-foreground">No projects found.</p>
								</TableCell>
							</TableRow>
						) : (
							filtered.map((project) => {
								const ps = project.progressStatus;
								const progress = getProgress(ps);
								return (
									<TableRow key={project.id}>
										<TableCell className="max-w-[220px]">
											<p className="font-medium text-sm truncate" title={project.title}>
												{project.title}
											</p>
											<div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
												<Badge
													variant="outline"
													className={cn("text-[10px] font-medium capitalize", projectTypeColor(project.projectType ?? project.type))}
												>
													{PROJECT_TYPE_LABELS[project.projectType ?? ""] ?? project.projectType ?? project.type}
												</Badge>
												{project.academicYear && (
													<span className="text-[10px] text-muted-foreground">{project.academicYear}</span>
												)}
											</div>
										</TableCell>
										<TableCell className="hidden md:table-cell text-sm text-muted-foreground">
											{project.supervisor?.name ?? "—"}
										</TableCell>
										<TableCell className="hidden lg:table-cell">
											<Badge
												variant="outline"
												className={cn("capitalize text-xs font-medium", projectStatusColor(project.status))}
											>
												{project.status}
											</Badge>
										</TableCell>
										<TableCell className="min-w-[100px]">
											<ProgressBar progress={progress} />
										</TableCell>
										<TableCell className="hidden lg:table-cell">
											<div className="grid grid-cols-4 gap-0.5 w-fit">
												<MilestoneCell done={ps.midReportApproved} label="Mid Report" />
												<MilestoneCell done={ps.midSeminar} label="Mid Seminar" />
												<MilestoneCell done={ps.finalReportApproved} label="Final Report" />
												<MilestoneCell done={ps.finalSeminar} label="Final Seminar" />
											</div>
											<p className="text-[10px] text-muted-foreground mt-0.5">MR · MS · FR · FS</p>
										</TableCell>
										<TableCell>
											<ViewDetail url={`/projects/${project.slug}/detail`} />
										</TableCell>
									</TableRow>
								);
							})
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
}
