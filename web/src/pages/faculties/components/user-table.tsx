import type React from "react";

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
import { IconDownload } from "@tabler/icons-react";
import {
	AlertCircle,
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
import { useMemo, useState } from "react";

interface User {
	id: string;
	username: string;
	name: string;
	email: string;
	role:
		| "Instructor in-charge"
		| "Student"
		| "Student Affairs"
		| "Faculty"
		| "Supervisor";
	rank:
		| "Rector"
		| "Pro-Rector"
		| "Professor"
		| "Associate Professor"
		| "Lecturer"
		| "Assistant Lecturer"
		| "Tutor";
	status: "Active" | "Inactive";
	department: "Engineering" | "Science" | "Arts" | "Business" | "Medicine";
}

const ROLE_ICONS: Record<string, React.ReactNode> = {
	"Instructor in-charge": <Briefcase className="h-4 w-4" />,
	"Student Affairs": <ClipboardList className="h-4 w-4" />,
	Faculty: <Users className="h-4 w-4" />,
	Supervisor: <Shield className="h-4 w-4" />,
};

const MOCK_USERS: User[] = [
	{
		id: "1",
		username: "k_aung_123",
		name: "Ko Aung",
		email: "k.aung@miit.edu.mm",
		role: "Supervisor",
		rank: "Tutor",
		status: "Active",
		department: "Engineering",
	},
	{
		id: "2",
		username: "ma_thin_456",
		name: "Ma Thin",
		email: "ma.thin@miit.edu.mm",
		role: "Instructor in-charge",
		rank: "Lecturer",
		status: "Active",
		department: "Science",
	},
	{
		id: "3",
		username: "dr_smith_789",
		name: "Dr. James Smith",
		email: "j.smith@miit.edu.mm",
		role: "Faculty",
		rank: "Professor",
		status: "Active",
		department: "Business",
	},
	{
		id: "4",
		username: "su_mya_012",
		name: "Su Mya",
		email: "su.mya@miit.edu.mm",
		role: "Student Affairs",
		rank: "Assistant Lecturer",
		status: "Active",
		department: "Arts",
	},
	{
		id: "5",
		username: "prof_lee_345",
		name: "Prof. Michael Lee",
		email: "m.lee@miit.edu.mm",
		role: "Supervisor",
		rank: "Associate Professor",
		status: "Active",
		department: "Engineering",
	},
	{
		id: "6",
		username: "tun_zaw_678",
		name: "Tun Zaw",
		email: "tun.zaw@miit.edu.mm",
		role: "Supervisor",
		rank: "Tutor",
		status: "Active",
		department: "Science",
	},
	{
		id: "7",
		username: "nay_lin_901",
		name: "Nay Lin",
		email: "nay.lin@miit.edu.mm",
		role: "Faculty",
		rank: "Associate Professor",
		status: "Active",
		department: "Medicine",
	},
	{
		id: "8",
		username: "soe_thein_234",
		name: "Soe Thein",
		email: "soe.thein@miit.edu.mm",
		role: "Supervisor",
		rank: "Assistant Lecturer",
		status: "Active",
		department: "Business",
	},
	{
		id: "9",
		username: "hla_win_567",
		name: "Hla Win",
		email: "hla.win@miit.edu.mm",
		role: "Instructor in-charge",
		rank: "Pro-Rector",
		status: "Active",
		department: "Engineering",
	},
	{
		id: "10",
		username: "kyi_mon_890",
		name: "Kyi Mon",
		email: "kyi.mon@miit.edu.mm",
		role: "Supervisor",
		rank: "Rector",
		status: "Active",
		department: "Arts",
	},
	{
		id: "11",
		username: "aye_min_111",
		name: "Aye Min",
		email: "aye.min@miit.edu.mm",
		role: "Faculty",
		rank: "Lecturer",
		status: "Active",
		department: "Science",
	},
	{
		id: "12",
		username: "zaw_moe_222",
		name: "Zaw Moe",
		email: "zaw.moe@miit.edu.mm",
		role: "Instructor in-charge",
		rank: "Professor",
		status: "Active",
		department: "Medicine",
	},
	{
		id: "13",
		username: "win_naung_333",
		name: "Win Naung",
		email: "win.naung@miit.edu.mm",
		role: "Supervisor",
		rank: "Assistant Lecturer",
		status: "Active",
		department: "Business",
	},
	{
		id: "14",
		username: "thida_444",
		name: "Thida",
		email: "thida@miit.edu.mm",
		role: "Supervisor",
		rank: "Associate Professor",
		status: "Active",
		department: "Engineering",
	},
	{
		id: "15",
		username: "myint_555",
		name: "Myint",
		email: "myint@miit.edu.mm",
		role: "Student Affairs",
		rank: "Lecturer",
		status: "Active",
		department: "Arts",
	},
	{
		id: "16",
		username: "phyo_666",
		name: "Phyo",
		email: "phyo@miit.edu.mm",
		role: "Faculty",
		rank: "Professor",
		status: "Active",
		department: "Science",
	},
	{
		id: "17",
		username: "lynn_777",
		name: "Lynn",
		email: "lynn@miit.edu.mm",
		role: "Supervisor",
		rank: "Tutor",
		status: "Active",
		department: "Business",
	},
	{
		id: "18",
		username: "kaung_888",
		name: "Kaung",
		email: "kaung@miit.edu.mm",
		role: "Instructor in-charge",
		rank: "Lecturer",
		status: "Active",
		department: "Medicine",
	},
	{
		id: "19",
		username: "mina_999",
		name: "Mina",
		email: "mina@miit.edu.mm",
		role: "Faculty",
		rank: "Associate Professor",
		status: "Active",
		department: "Engineering",
	},
	{
		id: "20",
		username: "david_001",
		name: "David Chen",
		email: "david@miit.edu.mm",
		role: "Supervisor",
		rank: "Professor",
		status: "Active",
		department: "Science",
	},
	{
		id: "21",
		username: "sophia_002",
		name: "Sophia Martinez",
		email: "sophia@miit.edu.mm",
		role: "Supervisor",
		rank: "Assistant Lecturer",
		status: "Active",
		department: "Arts",
	},
	{
		id: "22",
		username: "alex_003",
		name: "Alex Johnson",
		email: "alex@miit.edu.mm",
		role: "Faculty",
		rank: "Lecturer",
		status: "Active",
		department: "Business",
	},
	{
		id: "23",
		username: "emma_004",
		name: "Emma Wilson",
		email: "emma@miit.edu.mm",
		role: "Instructor in-charge",
		rank: "Pro-Rector",
		status: "Active",
		department: "Medicine",
	},
	{
		id: "24",
		username: "james_005",
		name: "James Brown",
		email: "james@miit.edu.mm",
		role: "Student Affairs",
		rank: "Rector",
		status: "Active",
		department: "Engineering",
	},
	{
		id: "25",
		username: "lisa_006",
		name: "Lisa Anderson",
		email: "lisa@miit.edu.mm",
		role: "Supervisor",
		rank: "Tutor",
		status: "Active",
		department: "Science",
	},
];

export function UserTable() {
	const [searchTerm, setSearchTerm] = useState("");
	const [selectedRoles, setSelectedRoles] = useState<Set<string>>(new Set());
	const [selectedRanks, setSelectedRanks] = useState<Set<string>>(new Set());
	const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
	const [currentPage, setCurrentPage] = useState(1);
	const [visibleColumns, setVisibleColumns] = useState<Set<string>>(
		new Set([
			"username",
			"name",
			"email",
			"role",
			"rank",
			"status",
			"department",
		]),
	);
	const [sortColumn, setSortColumn] = useState<string | null>(null);
	const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
	const itemsPerPage = 10;

	const allRoles = [
		"Instructor in-charge",
		"Student Affairs",
		"Faculty",
		"Supervisor",
	];
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
		MOCK_USERS.forEach((user) => {
			counts[user.role]++;
		});
		return counts;
	}, []);

	const rankCounts = useMemo(() => {
		const counts: Record<string, number> = {};
		allRanks.forEach((rank) => {
			counts[rank] = 0;
		});
		MOCK_USERS.forEach((user) => {
			counts[user.rank]++;
		});
		return counts;
	}, []);

	const filteredUsers = useMemo(() => {
		const filtered = MOCK_USERS.filter((user) => {
			const matchesSearch =
				user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
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
				let aVal: any = a[sortColumn as keyof User];
				let bVal: any = b[sortColumn as keyof User];

				if (typeof aVal === "string") {
					aVal = aVal.toLowerCase();
					bVal = (bVal as string).toLowerCase();
				}

				const comparison = aVal < bVal ? -1 : aVal > bVal ? 1 : 0;
				return sortDirection === "asc" ? comparison : -comparison;
			});
		}

		return filtered;
	}, [searchTerm, selectedRoles, selectedRanks, sortColumn, sortDirection]);

	const paginatedUsers = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filteredUsers.slice(start, start + itemsPerPage);
	}, [filteredUsers, currentPage]);

	const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

	const toggleUserSelection = (userId: string) => {
		const newSelected = new Set(selectedUsers);
		if (newSelected.has(userId)) {
			newSelected.delete(userId);
		} else {
			newSelected.add(userId);
		}
		setSelectedUsers(newSelected);
	};

	const toggleAllSelection = () => {
		if (
			selectedUsers.size === paginatedUsers.length &&
			paginatedUsers.length > 0
		) {
			setSelectedUsers(new Set());
		} else {
			setSelectedUsers(new Set(paginatedUsers.map((u) => u.id)));
		}
	};

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
		<div className="space-y-4">
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
											readOnly
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

					<Button
						className="hover:cursor-pointer bg-cherry-pie-950 hover:bg-cherry-pie-950/80 ml-auto hover:text-white text-white"
						onClick={() => alert("Downloading...")}
						variant={"outline"}>
						<IconDownload />
						<span>Export</span>
					</Button>
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
								className="bg-cherry-pie-950 px-2 rounded-full text-white hover:underline text-[12px]">
								{role}
							</button>
						))}

						{/* Selected rank pills */}
						{Array.from(selectedRanks).map((rank) => (
							<button
								key={rank}
								onClick={() => handleRankToggle(rank)}
								className="bg-cherry-pie-950 px-2 rounded-full text-white hover:underline text-[12px]">
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
					<TableHeader>
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
							{visibleColumns.has("status") && <TableHead>Status</TableHead>}
							{visibleColumns.has("department") && (
								<TableHead>Department</TableHead>
							)}
							<TableHead className="w-12">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{paginatedUsers.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={Object.keys(visibleColumns).length + 2}
									className="text-center py-8">
									<div className="flex flex-col items-center gap-2 text-muted-foreground">
										<AlertCircle className="h-5 w-5" />
										<span>No users found</span>
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
											<span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
												{user.status}
											</span>
										</TableCell>
									)}
									{visibleColumns.has("department") && (
										<TableCell>{user.department}</TableCell>
									)}
									<TableCell>
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
	);
}
