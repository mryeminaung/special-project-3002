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
import type { TeamsData } from "@/types";
import { IconDownload, IconRefresh, IconUserCheck } from "@tabler/icons-react";
import { Eye, Search, Settings2 } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

export default function TeamsTable({ teamsData }: { teamsData: TeamsData[] }) {
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set(["title", "leader", "members", "status", "started_at"]),
	);
	const itemsPerPage = 10;

	const filteredTeams = useMemo(() => {
		const filtered = teamsData.filter((team) => {
			const matchesSearch =
				team.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
				team.leader?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				team.status?.toLowerCase().includes(searchTerm.toLowerCase());
			return matchesSearch;
		});

		return filtered;
	}, [teamsData, searchTerm]);

	const paginatedTeams = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredTeams.slice(start, start + itemsPerPage);
	}, [filteredTeams, currentPage]);

	const totalPages = Math.ceil(filteredTeams.length / itemsPerPage);

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
			{teamsData.length === 0 ? (
				<Loading message="teams" />
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
										checked={visibleColumns.has("leader")}
										onCheckedChange={() => handleColumnToggle("leader")}>
										Team Leader
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("members")}
										onCheckedChange={() => handleColumnToggle("members")}>
										Team Members
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("status")}
										onCheckedChange={() => handleColumnToggle("status")}>
										Status
									</DropdownMenuCheckboxItem>
									<DropdownMenuCheckboxItem
										checked={visibleColumns.has("started_at")}
										onCheckedChange={() => handleColumnToggle("started_at")}>
										Started At
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
					</div>

					<div className="pt-2 border-t border-border"></div>

					{/* Table */}
					<div className="rounded-lg border border-border">
						<Table>
							<TableHeader className="bg-muted">
								<TableRow>
									{visibleColumns.has("title") && <TableHead>Title</TableHead>}
									{visibleColumns.has("leader") && (
										<TableHead>Team Leader</TableHead>
									)}
									{visibleColumns.has("members") && (
										<TableHead>Team Members</TableHead>
									)}
									{visibleColumns.has("status") && (
										<TableHead>Status</TableHead>
									)}
									{visibleColumns.has("started_at") && (
										<TableHead>Started At</TableHead>
									)}
									<TableHead className="w-12">Action</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{paginatedTeams.length === 0 ? (
									<TableRow>
										<TableCell
											colSpan={visibleColumns.size + 1}
											className="text-center py-8">
											<div className="flex flex-col items-center gap-3">
												<Search className="h-12 w-12 text-muted-foreground opacity-50" />
												<div>
													<h3 className="font-semibold text-foreground">
														No teams found
													</h3>
													<p className="text-sm text-muted-foreground">
														Try adjusting your search or filters
													</p>
												</div>
											</div>
										</TableCell>
									</TableRow>
								) : (
									paginatedTeams.map((team) => (
										<TableRow
											key={team.id}
											className="px-3">
											{visibleColumns.has("title") && (
												<TableCell>{team?.title}</TableCell>
											)}
											{visibleColumns.has("leader") && (
												<TableCell>
													<div className="flex items-center gap-2">
														<IconUserCheck className="h-5 w-5 text-primary-700" />
														<span className="text-sm">{team.leader?.name}</span>
													</div>
												</TableCell>
											)}
											{visibleColumns.has("members") && (
												<TableCell>
													<div className="flex flex-wrap gap-1">
														{team.members.slice(0, 2).map((team) => (
															<Badge
																key={team.id}
																variant="secondary">
																{team.name}
															</Badge>
														))}
														{team.members.length > 2 && (
															<Badge variant="secondary">
																+{team.members.length - 2}
															</Badge>
														)}
													</div>
												</TableCell>
											)}
											{visibleColumns.has("status") && (
												<TableCell>
													<Badge
														className={cn(
															STATUS_COLOR(team.status),
															"px-3 font-mono rounded-md capitalize",
														)}>
														{team.status}
													</Badge>
												</TableCell>
											)}
											{visibleColumns.has("started_at") && (
												<TableCell>{team.started_at}</TableCell>
											)}
											<TableCell className="border">
												<Link
													to={`/supervisors/detail/${team.id}`}
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
