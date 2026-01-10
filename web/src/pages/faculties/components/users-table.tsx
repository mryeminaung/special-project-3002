import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
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
import type { UsersData } from "@/types";
import { Loader2 } from "lucide-react";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import {
	Briefcase,
	ClipboardList,
	MoreHorizontal,
	Plus,
	Search,
	Settings2,
	Shield,
	Users,
	X,
} from "lucide-react";
import type React from "react";
import { useMemo, useState } from "react";
import Loading from "@/components/loading";

const ROLE_ICONS: Record<string, React.ReactNode> = {
	IC: <Briefcase className="h-4 w-4" />,
	"Student Affairs": <ClipboardList className="h-4 w-4" />,
	Faculty: <Users className="h-4 w-4" />,
	Supervisor: <Shield className="h-4 w-4" />,
};

export default function UsersTable({
	facultyData,
}: {
	facultyData: UsersData[];
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
	const [selectedRanks, setSelectedRanks] = useState<Set<string>>(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set(["name", "email", "role", "rank", "status", "department"]),
	);
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const itemsPerPage = 10;

	const allRoles = ["IC", "Student Affairs", "Faculty", "Supervisor"];
	const allRanks = [
		"Rector",
		"Pro-Rector",
		"Professor",
		"Associate Professor",
		"Lecturer",
		"Assistant Lecturer",
		"Tutor",
	];

	const roleCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		allRoles.forEach((role) => {
			counts[role] = 0;
		});
		facultyData.forEach((user) => {
			counts[user.role] = (counts[user.role] ?? 0) + 1;
		});
		return counts;
	}, [facultyData]);

	const rankCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		allRanks.forEach((rank) => {
			counts[rank] = 0;
		});
		facultyData.forEach((user) => {
			counts[user?.rank] = (counts[user?.rank] ?? 0) + 1;
		});
		return counts;
	}, [facultyData]);

	const filteredUsers = useMemo(() => {
		const filtered = facultyData.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());
			const matchesRole =
				selectedRoles.size === 0 ? true : selectedRoles.has(user.role);
			const matchesRank =
				selectedRanks.size === 0 ? true : selectedRanks.has(user.rank);
			return matchesSearch && matchesRole && matchesRank;
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
	}, [
		facultyData,
		searchTerm,
		selectedRoles,
		selectedRanks,
		sortColumn,
		sortDirection,
	]);

	const paginatedUsers = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredUsers.slice(start, start + itemsPerPage);
	}, [filteredUsers, currentPage]);

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

	const handleRoleToggle = (role: string) => {
		const newRoles = new Set(selectedRoles);
		if (newRoles.has(role)) {
			newRoles.delete(role);
		} else {
			newRoles.add(role);
		}
		setSelectedRoles(newRoles);
	};

	const handleRankToggle = (rank: string) => {
		const newRanks = new Set(selectedRanks);
		if (newRanks.has(rank)) {
			newRanks.delete(rank);
		} else {
			newRanks.add(rank);
		}
		setSelectedRanks(newRanks);
	};

	const handleResetRoles = () => {
		setSelectedRoles(new Set());
	};

	const handleResetRanks = () => {
		setSelectedRanks(new Set());
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
			{facultyData.length === 0 ? (
				<Loading message="faculties data" />
			) : (
				<div className="space-y-4 mt-5">
					{/* Search and Filters */}
					<div className="flex flex-col gap-4">
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
							{/* Role Filter Button */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="gap-2 bg-transparent">
										<Plus className="h-4 w-4" />
										<span>Role</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="w-56">
									<DropdownMenuLabel>Filter by Role</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<div className="p-2">
										{allRoles.map((role) => (
											<div
												key={role}
												onClick={() => handleRoleToggle(role)}
												className="flex items-center gap-2 py-2 cursor-pointer hover:bg-muted rounded px-2">
												<div className="flex items-center justify-center">
													{ROLE_ICONS[role]}
												</div>
												<span className="flex-1 text-sm">{role}</span>
												<span className="text-xs text-muted-foreground">
													{roleCounts[role]}
												</span>
											</div>
										))}
									</div>
								</DropdownMenuContent>
							</DropdownMenu>

							{/* Rank Filter Button */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="gap-2 bg-transparent">
										<Plus className="h-4 w-4" />
										<span>Rank</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="w-56">
									<DropdownMenuLabel>Filter by Rank</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<div className="p-2">
										{allRanks.map((rank) => (
											<div
												key={rank}
												onClick={() => handleRankToggle(rank)}
												className="flex items-center gap-2 py-2 cursor-pointer hover:bg-muted rounded px-2">
												<Checkbox
													checked={selectedRanks.has(rank)}
												/>
												<span className="flex-1 text-sm">{rank}</span>
												<span className="text-xs text-muted-foreground">
													{rankCounts[rank]}
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

						<div className="flex flex-wrap items-center gap-3 pt-2 border-t border-border">
							{/* Combined selected filters and controls */}
							<div className="flex flex-wrap items-center gap-2">
								{/* Count badge for selected filters */}
								{(selectedRoles.size > 0 || selectedRanks.size > 0) && (
									<span className="text-sm text-muted-foreground ">
										{selectedRoles.size + selectedRanks.size} selected
									</span>
								)}

								{/* Selected role pills */}
								{Array.from(selectedRoles).map((role) => (
									<button
										key={role}
										onClick={() => handleRoleToggle(role)}
										className="bg-primary-950 px-2 rounded-full text-white hover:underline text-[12px]">
										{role}
									</button>
								))}

								{/* Selected rank pills */}
								{Array.from(selectedRanks).map((rank) => (
									<button
										key={rank}
										onClick={() => handleRankToggle(rank)}
										className="bg-primary-950 px-2 rounded-full text-white hover:underline text-[12px]">
										{rank}
									</button>
								))}

								{/* Reset and Close buttons */}
								{(selectedRoles.size > 0 || selectedRanks.size > 0) && (
									<>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												handleResetRoles();
												handleResetRanks();
											}}
											className="h-auto py-0 px-0 text-sm text-muted-foreground hover:text-foreground">
											Reset
										</Button>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => {
												handleResetRoles();
												handleResetRanks();
											}}
											className="h-auto py-0 px-0 text-muted-foreground hover:text-foreground">
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
									{/* <TableHead className="w-12">Actions</TableHead> */}
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedUsers.length === 0 ? (
									<TableRow className="">
										<TableCell
											colSpan={Object.keys(visibleColumns).length + 2}
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
									paginatedUsers.map((user) => (
										<TableRow
											key={user.id}
											className="px-3">
											{visibleColumns.has("name") && (
												<TableCell>{user.name}</TableCell>
											)}
											{visibleColumns.has("email") && (
												<TableCell className="text-muted-foreground">
													{user.email}
												</TableCell>
											)}
											{visibleColumns.has("role") && (
												<TableCell>
													<div className="flex items-center gap-2">
														{ROLE_ICONS[user.role]}
														<span className="text-sm">{user.role}</span>
													</div>
												</TableCell>
											)}
											{visibleColumns.has("rank") && (
												<TableCell>{user.rank}</TableCell>
											)}
											{visibleColumns.has("status") && (
												<TableCell>
													<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200">
														{user.status}
													</span>
												</TableCell>
											)}
											{visibleColumns.has("department") && (
												<TableCell>{user.departmentName}</TableCell>
											)}
											<TableCell className="hidden">
												<DropdownMenu>
													<DropdownMenuTrigger asChild>
														<Button
															variant="ghost"
															size="icon"
															className="h-8 w-8">
															<MoreHorizontal className="h-4 w-4" />
														</Button>
													</DropdownMenuTrigger>
													<DropdownMenuContent align="end">
														<DropdownMenuItem>Edit</DropdownMenuItem>
														<DropdownMenuItem>Delete</DropdownMenuItem>
													</DropdownMenuContent>
												</DropdownMenu>
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
