import TablePagination from "@/components/table-pagination";
import TableRowSkeleton from "@/components/table-row-skeleton";
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
import { cn } from "@/lib/utils";
import { projectStatusColor } from "@/constants/badge-colors";
import type { SupervisorData } from "@/types";
import { Eye, Search, ShieldCheckIcon } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

export default function SupervisorsTable({
	supervisors,
	isLoading = false,
}: {
	supervisors: SupervisorData[];
	isLoading?: boolean;
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [departmentFilter, setDepartmentFilter] = useState("all");
	const [rankFilter, setRankFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const departments = useMemo(() => {
		const depts = supervisors.map((s) => s.department?.name).filter(Boolean);
		return Array.from(new Set(depts)) as string[];
	}, [supervisors]);

	const ranks = useMemo(() => {
		const r = supervisors.map((s) => s.rank?.name).filter(Boolean);
		return Array.from(new Set(r)) as string[];
	}, [supervisors]);

	const filteredUsers = useMemo(() => {
		const q = searchTerm.toLowerCase();
		return supervisors.filter((user) => {
			const matchesSearch =
				!q ||
				user.name.toLowerCase().includes(q) ||
				user.email.toLowerCase().includes(q);
			const matchesDept =
				departmentFilter === "all" || user.department?.name === departmentFilter;
			const matchesRank =
				rankFilter === "all" || user.rank?.name === rankFilter;
			return matchesSearch && matchesDept && matchesRank;
		});
	}, [supervisors, searchTerm, departmentFilter, rankFilter]);

	const paginatedSupervisor = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredUsers.slice(start, start + itemsPerPage);
	}, [filteredUsers, currentPage]);

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
								placeholder="Search by name or email…"
								className="pl-9 h-9 text-sm"
							/>
						</div>

						{/* Department */}
						<Select value={departmentFilter} onValueChange={setDepartmentFilter}>
							<SelectTrigger className="w-48">
								<SelectValue placeholder="Department" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Departments</SelectItem>
								{departments.map((dept) => (
									<SelectItem key={dept} value={dept}>
										{dept}
									</SelectItem>
								))}
							</SelectContent>
						</Select>

						{/* Rank */}
						<Select value={rankFilter} onValueChange={setRankFilter}>
							<SelectTrigger className="w-44">
								<SelectValue placeholder="Rank" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Ranks</SelectItem>
								{ranks.map((rank) => (
									<SelectItem key={rank} value={rank}>
										{rank}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>

					{/* Table */}
					<div className="rounded-lg border border-border">
						<Table>
							<TableHeader className="bg-muted">
								<TableRow>
									<TableHead>Name</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Role</TableHead>
									<TableHead>Rank</TableHead>
									<TableHead>Department</TableHead>
									<TableHead className="w-12">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									<TableRowSkeleton
										rows={8}
										cells={["h-4 w-36", "h-4 w-44", "h-4 w-24", "h-4 w-28", "h-4 w-32", "h-8 w-16 rounded-md mx-auto"]}
									/>
								) : paginatedSupervisor.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={6}
											className="text-center py-10">
											No supervisors match your filters.
										</TableCell>
									</TableRow>
								) : (
									paginatedSupervisor.map((supervisor) => (
										<TableRow
											key={supervisor.id}
											className="px-3">
											<TableCell className="font-semibold">
												{supervisor.name}
											</TableCell>
											<TableCell>{supervisor.email}</TableCell>
											<TableCell>
												<div className="flex items-center gap-2">
													<ShieldCheckIcon className="h-5 w-5 text-primary-700" />
													<span className="text-sm">{supervisor.role}</span>
												</div>
											</TableCell>
											<TableCell>{supervisor.rank?.name ?? "N/A"}</TableCell>
											<TableCell>{supervisor.department?.name ?? "N/A"}</TableCell>
											<TableCell className="border">
												<Link
													to={`/faculties/${supervisor.id}/detail`}
													className="bg-primary-800 hover:cursor-pointer hover:bg-primary-800/80 flex items-center text-white px-2 py-1.5 rounded-md gap-x-1">
													<Eye className="size-4" />
													<span className="text-[12px]">View</span>
												</Link>
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
						total={filteredUsers.length}
						perPage={itemsPerPage}
						onPageChange={setCurrentPage}
					/>
		</div>
	);
}
