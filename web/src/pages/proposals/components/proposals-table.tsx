import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import type { ProjectProposal } from "@/types";
import { IconDownload } from "@tabler/icons-react";
import { Eye, Loader2, Plus, Search, Settings2, Shield, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router";

interface Project {
	id: string;
	title: string;
	description: string;
	department: string;
	submittedBy: string;
	supervisor: string;
	students: {
		id: number;
		name: string;
		email: string;
	}[];
	status: "pending" | "approved" | "rejected";
	submitted_at: string;
}
const STATUS_COLORS: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-800",
	approved: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
};

interface ProposalsListProp {
	proposalsData: ProjectProposal[];
}

export function ProposalsList({ proposalsData }: ProposalsListProp) {
	const displayData = proposalsData;
	const [searchTerm, setSearchTerm] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	useEffect(() => {
		const id = setTimeout(() => setDebouncedSearch(searchTerm), 300);
		return () => clearTimeout(id);
	}, [searchTerm]);
	const [selectedStatuses, setSelectedStatuses] = useState<Set<string>>(
		new Set(),
	);
	const [currentPage, setCurrentPage] = useState(1);
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set([
			"title",
			"supervisor",
			"submittedBy",
			"students",
			"status",
			"submitted_at",
		]),
	);
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const itemsPerPage = 6;

	const navigate = useNavigate();

	const allStatuses = ["pending", "approved", "rejected"];


	const statusCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		const list = displayData || [];
		allStatuses.forEach((status) => {
			counts[status] = list.filter((p) => p.status === status).length;
		});
		return counts;
	}, [displayData]);

	const filteredProjects = useMemo(() => {
		const list = displayData || [];
		const filtered = list.filter((project) => {
			const q = debouncedSearch.toLowerCase();
			const matchesSearch =
				project.title.toLowerCase().includes(q) ||
				project.description.toLowerCase().includes(q) ||
				(project.supervisor?.name || "").toLowerCase().includes(q) ||
				project.students.some((s) => s.name.toLowerCase().includes(q));

			const matchesStatus =
				selectedStatuses.size === 0
					? true
					: selectedStatuses.has(project.status);
			return matchesSearch && matchesStatus;
		});

		if (sortColumn) {
			filtered.sort((a, b) => {
				let aVal: any = a[sortColumn as keyof Project];
				let bVal: any = b[sortColumn as keyof Project];
				if (typeof aVal === "string") {
					aVal = aVal.toLowerCase();
					bVal = (bVal as string).toLowerCase();
				}
				const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
				return sortDirection === "asc" ? comparison : -comparison;
			});
		}

		return filtered;
	}, [
		displayData,
		debouncedSearch,
		selectedStatuses,
		sortColumn,
		sortDirection,
	]);

	const paginatedProjects = useMemo(() => {
		const list = filteredProjects || [];
		const start = (currentPage - 1) * itemsPerPage;
		return list.slice(start, start + itemsPerPage);
	}, [filteredProjects, currentPage]);

	const totalPages = Math.ceil((filteredProjects?.length || 0) / itemsPerPage);

	const handleStatusToggle = (status: string) => {
		const newStatuses = new Set(selectedStatuses);
		if (newStatuses.has(status)) {
			newStatuses.delete(status);
		} else {
			newStatuses.add(status);
		}
		setSelectedStatuses(newStatuses);
		setCurrentPage(1);
	};

	const handleResetStatus = () => {
		setSelectedStatuses(new Set());
		setCurrentPage(1);
	};

	const handleColumnToggle = (column: string) => {
		const newColumns = new Set(visibleColumns);
		if (newColumns.has(column)) {
			newColumns.delete(column);
		} else {
			newColumns.add(column);
		}
		setVisibleColumns(newColumns);
	};

	const handleSort = (column: string) => {
		if (sortColumn === column) {
			setSortDirection(sortDirection === "asc" ? "desc" : "asc");
		} else {
			setSortColumn(column);
			setSortDirection("asc");
		}
	};

	return (
		<>
			{displayData.length === 0 ? (
				<div className="flex flex-col items-center justify-center py-20">
					<Loader2 className="h-8 w-8 animate-spin text-primary-600" />
					<div className="mt-3 text-sm text-muted-foreground">
						Loading proposals...
					</div>
				</div>
			) : (
				<div className="space-y-4">
					{/* Search and Filters */}
					<div className="flex flex-col gap-4">
						<div className="flex gap-3">
							<div className="relative flex-1 max-w-sm">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Filter projects..."
									className="pl-10"
									value={searchTerm}
									onChange={(e) => {
										setSearchTerm(e.target.value);
										setCurrentPage(1);
									}}
								/>
							</div>

							{/* Status Filter Button */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="gap-2 bg-transparent">
										<Plus className="h-4 w-4" />
										<span>Status</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="w-56">
									<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<div className="p-2">
										{allStatuses.map((status) => (
											<div
												key={status}
												onClick={() => handleStatusToggle(status)}
												className="flex items-center gap-2 py-2 cursor-pointer hover:bg-muted rounded px-2">
												<div
													className={`w-3 h-3 rounded-full ${
														status === "pending"
															? "bg-yellow-500"
															: status === "approved"
															? "bg-green-500"
															: "bg-red-500"
													}`}
												/>
												<span className="flex-1 text-sm">{status}</span>
												<span className="text-xs text-muted-foreground">
													{statusCounts[status]}
												</span>
											</div>
										))}
									</div>
								</DropdownMenuContent>
							</DropdownMenu>

							{/* View Toggle Button */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="gap-2 bg-transparent">
										<Settings2 className="h-4 w-4" />
										View
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="end"
									className="w-48">
									<DropdownMenuLabel>Toggle Columns</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("title")}
										onCheckedChange={() => handleColumnToggle("title")}>
										Title
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("students")}
										onCheckedChange={() => handleColumnToggle("students")}>
										Students
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("submittedBy")}
										onCheckedChange={() => handleColumnToggle("submittedBy")}>
										Submitted By
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("supervisor")}
										onCheckedChange={() => handleColumnToggle("supervisor")}>
										Supervisor
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("status")}
										onCheckedChange={() => handleColumnToggle("status")}>
										Status
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("submitted_at")}
										onCheckedChange={() => handleColumnToggle("submitted_at")}>
										Submitted Date
									</DropdownMenuCheckboxItem>
								</DropdownMenuContent>
							</DropdownMenu>

							<Button
								className="hover:cursor-pointer bg-primary-950 hover:bg-primary-950/80 ml-auto hover:text-white text-white"
								onClick={() => alert("Downloading...")}
								variant={"outline"}>
								<IconDownload />
								<span>Export</span>
							</Button>
						</div>

						{/* Selected Filters Display */}
						<div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
							<div className="flex flex-wrap items-center gap-2">
								{selectedStatuses.size > 0 && (
									<span className="text-sm text-muted-foreground">
										{selectedStatuses.size} selected
									</span>
								)}

								{Array.from(selectedStatuses).map((status) => (
									<button
										key={status}
										onClick={() => handleStatusToggle(status)}
										className="bg-primary-950 px-2 rounded-full text-white hover:underline text-[12px]">
										{status}
									</button>
								))}

								{selectedStatuses.size > 0 && (
									<>
										<Button
											variant="ghost"
											size="sm"
											onClick={handleResetStatus}
											className="h-auto py-0 px-0 text-sm text-muted-foreground hover:text-foreground">
											Reset
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={handleResetStatus}
											className="h-auto hidden py-0 px-0 text-muted-foreground hover:text-foreground">
											<X className="h-4 w-4" />
										</Button>
									</>
								)}
							</div>
						</div>
					</div>

					{/* Table */}
					<div className="rounded-lg border border-border">
						<Table>
							<TableHeader className="bg-muted">
								<TableRow>
									{visibleColumns.has("title") && (
										<TableHead
											className="cursor-pointer select-none hover:bg-muted"
											onClick={() => handleSort("title")}>
											Title{" "}
											{sortColumn === "title" &&
												(sortDirection === "asc" ? "↑ asc" : "↓ desc")}
										</TableHead>
									)}
									{visibleColumns.has("supervisor") && (
										<TableHead>Supervisor</TableHead>
									)}
									{visibleColumns.has("submittedBy") && (
										<TableHead>Submitted By</TableHead>
									)}
									{visibleColumns.has("students") && (
										<TableHead>Students</TableHead>
									)}
									{visibleColumns.has("submitted_at") && (
										<TableHead>Submitted At</TableHead>
									)}
									{visibleColumns.has("status") && (
										<TableHead>Status</TableHead>
									)}
									<TableHead className="w-12">Action</TableHead>
								</TableRow>
							</TableHeader>

							<TableBody>
								{displayData && paginatedProjects.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={visibleColumns.size + 1}
											className="text-center py-12">
											<div className="flex flex-col items-center gap-3">
												<Search className="h-12 w-12 text-muted-foreground opacity-50" />
												<div>
													<h3 className="font-semibold text-foreground">
														No projects found
													</h3>
													<p className="text-sm text-muted-foreground">
														Try adjusting your search or filters
													</p>
												</div>
											</div>
										</TableCell>
									</TableRow>
								) : (
									paginatedProjects.map((project) => (
										<TableRow key={project.id}>
											{visibleColumns.has("title") && (
												<TableCell>
													<div>
														<div className="font-semibold text-foreground">
															{project.title.length > 30
																? project.title.substring(0, 30) + "..."
																: project.title}
														</div>
														<div className="text-xs text-muted-foreground line-clamp-1">
															{project.description.length > 30
																? project.description.substring(0, 30) + "..."
																: project.description}
														</div>
													</div>
												</TableCell>
											)}
											{visibleColumns.has("supervisor") && (
												<TableCell className="text-sm">
													<div className="flex items-center gap-x-2">
														<Shield className="h-4 w-4 text-muted-foreground" />
														{project.supervisor.name}
													</div>
												</TableCell>
											)}
											{visibleColumns.has("submittedBy") && (
												<TableCell className="text-sm">
													{project.submittedBy.name}
												</TableCell>
											)}
											{visibleColumns.has("students") && (
												<TableCell>
													<div className="flex flex-wrap gap-1">
														{project.students.slice(0, 2).map((student) => (
															<Badge
																key={student.id}
																variant="secondary">
																{student.name}
															</Badge>
														))}
														{project.students.length > 2 && (
															<Badge variant="secondary">
																+{project.students.length - 2}
															</Badge>
														)}
													</div>
												</TableCell>
											)}

											{visibleColumns.has("submitted_at") && (
												<TableCell className="text-sm">
													{project.submitted_at}
												</TableCell>
											)}

											{visibleColumns.has("status") && (
												<TableCell className="capitalize">
													<Badge className={STATUS_COLORS[project.status]}>
														{project.status}
													</Badge>
												</TableCell>
											)}

											<TableCell className="border">
												<Button
													onClick={() =>
														navigate(
															`/project-proposals/detail/${project.id}`,
															{ state: { proposal: project } }
														)
													}
													className="bg-primary-950 hover:cursor-pointer hover:bg-primary-950/80">
													<Eye />
													<span className="text-[12px]">View</span>
												</Button>
											</TableCell>
										</TableRow>
									))
								)}
							</TableBody>
						</Table>
					</div>

					{/* Pagination */}
					{totalPages > 1 && (
						<div className="flex items-center justify-between pt-4">
							<div className="text-sm text-muted-foreground">
								Page {currentPage} of {totalPages}
							</div>
							<div className="flex gap-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
									disabled={currentPage === 1}>
									Previous
								</Button>
								<Button
									variant="outline"
									size="sm"
									onClick={() =>
										setCurrentPage(Math.min(totalPages, currentPage + 1))
									}
									disabled={currentPage === totalPages}>
									Next
								</Button>
							</div>
						</div>
					)}
				</div>
			)}
		</>
	);
}
