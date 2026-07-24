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
import { cn, PROJECT_STATUS_COLOR } from "@/lib/utils";
import type { UsersData } from "@/types";
import { IconDownload } from "@tabler/icons-react";
import {
	Eye,
	Search,
	Settings2,
	Users,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

export default function FacultiesTable({
	facultyData,
}: {
	facultyData: UsersData[];
}) {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set(["name", "email", "rank", "status", "department"]),
	);
	const itemsPerPage = 10;

	const allRanks = [
		"Rector",
		"Pro-Rector",
		"Professor",
		"Associate Professor",
		"Lecturer",
		"Assistant Lecturer",
		"Tutor",
	];

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
		return facultyData.filter((user) => {
			const matchesSearch =
				user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				user.email.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesSearch;
		});
	}, [
		facultyData,
		searchTerm,
	]);

	const paginatedUsers = useMemo(() => {
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

	return (
		<>
			{facultyData.length === 0 ? (
				<Loading message="faculties" />
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

							{/* Rank Dropdown Display */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button
										variant="outline"
										className="gap-2 bg-transparent">
										<Users className="h-4 w-4" />
										<span>Rank</span>
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent
									align="start"
									className="w-56">
									<DropdownMenuLabel>Ranks</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<div className="p-2">
										{allRanks.filter(rank => (rankCounts[rank] ?? 0) > 0).map((rank) => (
											<div
												key={rank}
												className="flex items-center gap-2 py-2 rounded px-2">
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
									onClick={() => alert("Downloading...")}
									variant={"outline"}>
									<IconDownload />
									<span>Export</span>
								</Button>
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
										<TableHead>Email</TableHead>
									)}
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
								{paginatedUsers.length === 0 ? (
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
									paginatedUsers.map((user) => (
										<TableRow
											key={user.id}
											className="px-3">
											{visibleColumns.has("name") && (
												<TableCell>{user.name}</TableCell>
											)}
											{visibleColumns.has("email") && (
												<TableCell>{user.email}</TableCell>
											)}
											{visibleColumns.has("rank") && (
												<TableCell>{user.rank}</TableCell>
											)}
											{visibleColumns.has("status") && (
												<TableCell>
													<Badge
														className={cn(
															PROJECT_STATUS_COLOR("active"),
															"px-3 font-mono rounded-md capitalize",
														)}>
														{user.status}
													</Badge>
												</TableCell>
											)}
											{visibleColumns.has("department") && (
												<TableCell>{user.departmentName}</TableCell>
											)}
											<TableCell className="border">
												<Link
													to={`/faculties/${user.id}/detail`}
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
									const startPage = Math.max(
										1,
										Math.min(
											currentPage - 2,
											totalPages - Math.min(5, totalPages),
										),
									);
									const pageNum = startPage + i;
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
