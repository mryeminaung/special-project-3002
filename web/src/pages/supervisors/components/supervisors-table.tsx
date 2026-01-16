import Loading from "@/components/loading";
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
import { cn, STATUS_COLOR } from "@/lib/utils";
import type { UsersData } from "@/types";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import { Eye, Search, Settings2, Shield } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

export default function SupervisorsTable({
	supervisorData,
}: {
	supervisorData: UsersData[];
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set(["name", "email", "role", "rank", "status", "department"]),
	);
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const itemsPerPage = 10;

	const filteredUsers = useMemo(() => {
		const filtered = supervisorData.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesSearch;
		});

		if (sortColumn) {
			filtered.sort((a, b) => {
				let aVal: any = a[sortColumn as keyof UsersData];
				let bVal: any = b[sortColumn as keyof UsersData];

				if (typeof aVal === "string") {
					aVal = aVal.toLowerCase();
					bVal = (bVal as string).toLowerCase();
				}

				const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
				return sortDirection === "asc" ? comparison : -comparison;
			});
		}

		return filtered;
	}, [supervisorData, searchTerm, sortColumn, sortDirection]);

	const paginatedSupervisor = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredUsers.slice(start, start + itemsPerPage);
	}, [filteredUsers, currentPage]);

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

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
			{supervisorData.length === 0 ? (
				<Loading message="supervisors" />
			) : (
				<div className="space-y-4 mt-5">
					{/* Search and Filters */}
					<div className="flex flex-col md:flex-row gap-4">
						<div className="flex gap-3">
							<div className="relative flex-1 max-w-sm">
								<Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
								<Input
									placeholder="Filter users..."
									className="pl-10"
									value={searchTerm}
									onChange={(e) => {
										setSearchTerm(e.target.value);
										setCurrentPage(1);
									}}
								/>
							</div>
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
										checked={visibleColumns.has("name")}
										onCheckedChange={() => handleColumnToggle("name")}>
										Name
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("email")}
										onCheckedChange={() => handleColumnToggle("email")}>
										Email
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("role")}
										onCheckedChange={() => handleColumnToggle("role")}>
										Role
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("rank")}
										onCheckedChange={() => handleColumnToggle("rank")}>
										Rank
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("status")}
										onCheckedChange={() => handleColumnToggle("status")}>
										Status
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("department")}
										onCheckedChange={() => handleColumnToggle("department")}>
										Department
									</DropdownMenuCheckboxItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</div>
						<div className="flex items-center ml-auto gap-x-3">
							<Button
								className="hover:cursor-pointer bg-primary-800 hover:bg-primary-800/80 ml-auto hover:text-white text-white"
								onClick={() => alert("Refreshing...")}
								variant={"outline"}>
								<IconRefresh />
								<span>Refresh</span>
							</Button>
							<Button
								className="hover:cursor-pointer bg-primary-800 hover:bg-primary-800/80 ml-auto hover:text-white text-white"
								onClick={() => alert("Downloading...")}
								variant={"outline"}>
								<IconDownload />
								<span>Export</span>
							</Button>
						</div>
					</div>

					<div className="pt-2 border-t border-border"></div>

					{/* Table */}
					<div className="rounded-lg border border-border">
						<Table>
							<TableHeader className="bg-muted">
								<TableRow>
									{visibleColumns.has("name") && <TableHead>Name</TableHead>}
									{visibleColumns.has("email") && (
										<TableHead
											className="cursor-pointer select-none hover:bg-muted"
											onClick={() => handleSort("email")}>
											Email{" "}
											{sortColumn === "email" &&
												(sortDirection === "asc" ? "↑" : "↓")}
										</TableHead>
									)}
									{visibleColumns.has("role") && <TableHead>Role</TableHead>}
									{visibleColumns.has("rank") && <TableHead>Rank</TableHead>}
									{visibleColumns.has("status") && (
										<TableHead>Status</TableHead>
									)}
									{visibleColumns.has("department") && (
										<TableHead>Department</TableHead>
									)}
									<TableHead className="w-12">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedSupervisor.length === 0 ? (
									<TableRow className="">
										<TableCell
											colSpan={visibleColumns.size + 1}
											className="text-center py-8">
											<div className="flex flex-col items-center gap-3">
												<Search className="h-12 w-12 text-muted-foreground opacity-50" />
												<div>
													<h3 className="font-semibold text-foreground">
														No users found
													</h3>
													<p className="text-sm text-muted-foreground">
														Try adjusting your search or filters
													</p>
												</div>
											</div>
										</TableCell>
									</TableRow>
								) : (
									paginatedSupervisor.map((supervisor) => (
										<TableRow
											key={supervisor.id}
											className="px-3">
											{visibleColumns.has("name") && (
												<TableCell>{supervisor.name}</TableCell>
											)}
											{visibleColumns.has("email") && (
												<TableCell>{supervisor.email}</TableCell>
											)}
											{visibleColumns.has("role") && (
												<TableCell>
													<div className="flex items-center gap-2">
														<Shield className="h-4 w-4 text-primary-700" />
														<span className="text-sm">{supervisor.role}</span>
													</div>
												</TableCell>
											)}
											{visibleColumns.has("rank") && (
												<TableCell>{supervisor.rank}</TableCell>
											)}
											{visibleColumns.has("status") && (
												<TableCell>
													<Badge
														className={cn(
															STATUS_COLOR("active"),
															"px-3 font-mono rounded-md capitalize",
														)}>
														{supervisor.status}
													</Badge>
												</TableCell>
											)}
											{visibleColumns.has("department") && (
												<TableCell>{supervisor.departmentName}</TableCell>
											)}
											<TableCell className="border">
												<Link
													to={`/supervisors/${supervisor.id}/detail`}
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
					<div className="flex items-center justify-between">
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
							<div className="flex gap-1">
								{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
									const pageNum = i + 1;
									return (
										<Button
											key={pageNum}
											variant={currentPage === pageNum ? "default" : "outline"}
											size="sm"
											className={cn(
												currentPage === pageNum &&
													"bg-primary-800 hover:cursor-pointer hover:bg-primary-800/80",
											)}
											onClick={() => setCurrentPage(pageNum)}>
											{pageNum}
										</Button>
									);
								})}
							</div>
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
				</div>
			)}
		</>
	);
}
