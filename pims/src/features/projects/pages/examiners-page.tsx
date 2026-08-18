import { getProjects } from "../services/project.service";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { PAGE_META } from "@/constants/navigation";
import UnAuthorized from "@/components/auth/un-authorized";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
import { cn, getInitials } from "@/lib/utils";
import { projectStatusColor, projectTypeColor } from "@/constants/badge-colors";
import ViewDetail from "@/components/view-detail";
import { IconSearch, IconX, IconUserStar } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState, useMemo } from "react";

type Examiner = { id: number; name: string; email: string };
type Project = {
	id: number;
	slug: string;
	title: string;
	status: string;
	type: string;
	examiners?: Examiner[];
};

type AssignmentFilter = "all" | "assigned" | "missing";

const MAX_EXAMINERS = 3;

const ASSIGNMENT_TABS: { value: AssignmentFilter; label: string }[] = [
	{ value: "all", label: "All" },
	{ value: "assigned", label: "Assigned" },
	{ value: "missing", label: "Missing" },
];

export default function ExaminersPage() {
	useHeaderInitializer(PAGE_META.examiners.title, PAGE_META.examiners.subtitle);

	const { isIC } = useRoleChecker();
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [assignmentFilter, setAssignmentFilter] = useState<AssignmentFilter>("all");

	const { data: projects = [], isLoading } = useQuery<Project[]>({
		queryKey: ["projects"],
		queryFn: getProjects,
		enabled: isIC,
	});

	const filtered = useMemo(() => {
		return projects.filter((p) => {
			if (statusFilter !== "all" && p.status !== statusFilter) return false;

			const hasExaminers = (p.examiners?.length ?? 0) > 0;
			const isMissing = !hasExaminers && p.status !== "completed";
			if (assignmentFilter === "assigned" && !hasExaminers) return false;
			if (assignmentFilter === "missing" && !isMissing) return false;

			if (!search) return true;
			const q = search.toLowerCase();
			if (p.title.toLowerCase().includes(q)) return true;
			if ((p.examiners ?? []).some((e) => e.name.toLowerCase().includes(q))) return true;
			return false;
		});
	}, [projects, search, statusFilter, assignmentFilter]);

	if (!isIC) return <UnAuthorized />;

	const withExaminers = projects.filter((p) => (p.examiners?.length ?? 0) > 0).length;
	const withoutExaminers = projects.filter(
		(p) => (p.examiners?.length ?? 0) === 0 && p.status !== "completed",
	).length;

	return (
		<>
			<Heading
				title="Examiners"
				description="Projects and their assigned examiners."
			/>

			{/* Stat cards */}
			<div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
				<div className="rounded-xl border bg-card px-5 py-4">
					<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
						Total Projects
					</p>
					<p className="text-2xl font-bold text-foreground">{projects.length}</p>
				</div>
				<div className="rounded-xl border bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 px-5 py-4">
					<p className="text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-1">
						With Examiners
					</p>
					<p className="text-2xl font-bold text-emerald-700 dark:text-emerald-300">{withExaminers}</p>
				</div>
				<div
					className={cn(
						"rounded-xl border px-5 py-4",
						withoutExaminers > 0
							? "bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800"
							: "bg-card",
					)}
				>
					<p
						className={cn(
							"text-xs font-semibold uppercase tracking-wider mb-1",
							withoutExaminers > 0
								? "text-amber-600 dark:text-amber-400"
								: "text-muted-foreground",
						)}
					>
						Missing Examiners
					</p>
					<p
						className={cn(
							"text-2xl font-bold",
							withoutExaminers > 0
								? "text-amber-700 dark:text-amber-300"
								: "text-foreground",
						)}
					>
						{withoutExaminers}
					</p>
				</div>
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3 mb-4">
				<div className="relative flex-1 min-w-48 max-w-sm">
					<IconSearch
						size={14}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search by project or examiner name…"
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
			</div>

			{/* Assignment filter tabs */}
			<div className="flex items-center gap-1 mb-6 border-b border-border">
				{ASSIGNMENT_TABS.map((tab) => (
					<button
						key={tab.value}
						type="button"
						onClick={() => setAssignmentFilter(tab.value)}
						className={cn(
							"px-4 py-2 text-sm font-medium border-b-2 -mb-px transition-colors",
							assignmentFilter === tab.value
								? "border-foreground text-foreground"
								: "border-transparent text-muted-foreground hover:text-foreground",
						)}
					>
						{tab.label}
						{tab.value === "missing" && withoutExaminers > 0 && (
							<span className="ml-1.5 inline-flex items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-400 text-[10px] font-bold w-4 h-4">
								{withoutExaminers}
							</span>
						)}
					</button>
				))}
			</div>

			{/* Table */}
			{isLoading ? (
				<div className="space-y-2">
					{Array.from({ length: 6 }).map((_, i) => (
						<div key={i} className="h-14 rounded-lg bg-muted animate-pulse" />
					))}
				</div>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-xl border border-dashed py-16 text-center">
					<IconUserStar size={36} className="mb-3 text-muted-foreground/30" />
					<p className="text-sm font-medium text-muted-foreground">No projects found.</p>
				</div>
			) : (
				<div className="rounded-lg border border-border">
					<Table>
						<TableHeader>
							<TableRow className="bg-muted">
								<TableHead>Project</TableHead>
								<TableHead className="hidden md:table-cell">Status</TableHead>
								<TableHead>Examiners</TableHead>
								<TableHead className="w-24">Action</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{filtered.map((project) => {
								const examiners = project.examiners ?? [];
								return (
									<TableRow key={project.id}>
										<TableCell className="max-w-[260px]">
											<p className="font-medium truncate" title={project.title}>
												{project.title}
											</p>
											<Badge
												variant="outline"
												className={cn(
													"mt-1 text-[10px] font-medium capitalize",
													projectTypeColor(project.type),
												)}
											>
												{project.type}
											</Badge>
										</TableCell>
										<TableCell className="hidden md:table-cell">
											<Badge
												variant="outline"
												className={cn(
													"capitalize text-xs font-medium",
													projectStatusColor(project.status),
												)}
											>
												{project.status}
											</Badge>
										</TableCell>
										<TableCell>
											{examiners.length > 0 ? (
												<div className="flex flex-col gap-1.5">
													<div className="flex items-center gap-2 flex-wrap">
														{examiners.map((e) => (
															<div key={e.id} className="flex items-center gap-1.5">
																<Avatar className="h-6 w-6 shrink-0">
																	<AvatarFallback className="bg-violet-100 dark:bg-violet-900/40 text-violet-700 dark:text-violet-300 text-[10px] font-semibold">
																		{getInitials(e.name)}
																	</AvatarFallback>
																</Avatar>
																<span className="text-xs text-muted-foreground">{e.name}</span>
															</div>
														))}
													</div>
													<p className="text-[10px] text-muted-foreground/60">
														{examiners.length} / {MAX_EXAMINERS} assigned
													</p>
												</div>
											) : project.status === "completed" ? (
												<span className="text-xs text-muted-foreground">—</span>
											) : (
												<Badge
													variant="outline"
													className="text-xs font-medium bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800"
												>
													Not assigned
												</Badge>
											)}
										</TableCell>
										<TableCell>
											<ViewDetail url={`/projects/${project.slug}/detail`} />
										</TableCell>
									</TableRow>
								);
							})}
						</TableBody>
					</Table>
				</div>
			)}
		</>
	);
}
