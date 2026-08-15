import TableRowSkeleton from "@/components/table-row-skeleton";
import TablePagination from "@/components/table-pagination";
import { formatDate } from "@/lib/date";
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
import { projectStatusColor } from "@/constants/badge-colors";
import type { ProjectData } from "@/types";
import { Search, ShieldCheckIcon } from "lucide-react";
import { useMemo, useState } from "react";

export default function ProjectsTable({
	projects,
	isLoading = false,
}: {
	projects: ProjectData[];
	isLoading?: boolean;
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const filteredProjects = useMemo(() => {
		const q = searchTerm.toLowerCase();
		return projects.filter((project) => {
			const matchesSearch =
				!q ||
				project.title?.toLowerCase().includes(q) ||
				project.supervisor?.name?.toLowerCase().includes(q) ||
				project.leader?.name?.toLowerCase().includes(q);
			const matchesStatus = statusFilter === "all" || project.status === statusFilter;
			const matchesType = typeFilter === "all" || project.type === typeFilter;
			return matchesSearch && matchesStatus && matchesType;
		});
	}, [projects, searchTerm, statusFilter, typeFilter]);

	const paginatedProjects = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredProjects.slice(start, start + itemsPerPage);
	}, [filteredProjects, currentPage]);

	const totalPages = Math.ceil(filteredProjects.length / itemsPerPage);

	return (
		<div className="space-y-4 mt-5">
			{/* Search and Filters */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Search */}
				<div className="relative flex-1 min-w-48">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
					<Input
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
							setCurrentPage(1);
						}}
						placeholder="Search by name, supervisor, or leader…"
						className="pl-9 h-9 text-sm"
					/>
				</div>

				{/* Status */}
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="active">Active</SelectItem>
						<SelectItem value="completed">Completed</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
					</SelectContent>
				</Select>

				{/* Type */}
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
			<div className="rounded-lg border border-border">
				<Table className="rounded-lg">
					<TableHeader>
						<TableRow className="bg-muted">
							<TableHead>Project Name</TableHead>
							<TableHead>Supervisor</TableHead>
							<TableHead>Project Leader</TableHead>
							<TableHead>Project Members</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Approved On</TableHead>
							<TableHead className="w-24">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRowSkeleton
								rows={8}
								cells={["h-4 w-48", "h-4 w-32", "h-4 w-28", "h-5 w-36", "h-5 w-16 rounded-full", "h-4 w-24", "mx-auto h-8 w-16 rounded-md"]}
							/>
						) : paginatedProjects.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={7}
									className="text-center py-10">
									No projects match your filters.
								</TableCell>
							</TableRow>
						) : (
							paginatedProjects.map((project) => (
										<TableRow
											key={project.id}
											className="px-3">
											<TableCell className="font-semibold text-sm">
												{(project.title?.length ?? 0) > 50
													? project.title!.substring(0, 50) + "…"
													: (project.title ?? "—")}
											</TableCell>
											<TableCell>
												{project.supervisor ? (
													<div className="flex items-center gap-2">
														<ShieldCheckIcon className="h-4 w-4 text-primary-700" />
														<span className="text-sm">{project.supervisor.name}</span>
													</div>
												) : (
													<span className="text-sm text-muted-foreground">—</span>
												)}
											</TableCell>
											<TableCell className="text-sm">{project.leader?.name ?? "—"}</TableCell>
											<TableCell>
												<div className="flex flex-wrap gap-1 text-muted-foreground">
													{(project.members ?? []).slice(0, 2).map((member) => (
														<Badge
															key={member.id}
															variant="secondary">
															{member.name}
														</Badge>
													))}
													{(project.members?.length ?? 0) > 2 && (
														<Badge variant="secondary">
															+{(project.members?.length ?? 0) - 2}
														</Badge>
													)}
												</div>
											</TableCell>
											<TableCell>
												<Badge
													className={cn(
														projectStatusColor(project.status),
														"px-3 font-mono rounded-md capitalize",
													)}>
													{project.status}
												</Badge>
											</TableCell>
											<TableCell className="text-sm text-muted-foreground">{formatDate(project.approvedAt)}</TableCell>
											<TableCell className="border">
												<ViewDetail url={`/projects/${project?.slug}/detail`} />
											</TableCell>
										</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>

			{/* Pagination */}
			<TablePagination
				currentPage={currentPage}
				lastPage={totalPages}
				total={filteredProjects.length}
				perPage={itemsPerPage}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
