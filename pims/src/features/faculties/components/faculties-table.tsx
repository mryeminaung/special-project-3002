import TablePagination from "@/components/table-pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
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
import TableRowSkeleton from "@/components/table-row-skeleton";
import { ROLE_COLORS, ROLE_LABELS } from "@/constants/badge-colors";
import { Eye, Pencil, Search, KeyRound } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";

type Faculty = {
	id: number;
	name: string;
	email: string;
	avatar_url: string | null;
	roles: string[];
	status: string;
	profile: {
		phoneNumber: string | null;
		address: string | null;
		rank: string;
		department: string;
	};
};


export default function FacultiesTable({
	facultyData,
	isLoading = false,
	onEdit,
	onResetPassword,
}: {
	facultyData: Faculty[];
	isLoading?: boolean;
	onEdit?: (faculty: Faculty) => void;
	onResetPassword?: (faculty: Faculty) => void;
}) {
	const [search, setSearch] = useState("");
	const [rankFilter, setRankFilter] = useState("all");
	const [roleFilter, setRoleFilter] = useState("all");
	const [deptFilter, setDeptFilter] = useState("all");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const ranks = useMemo(
		() => [...new Set(facultyData.map((f) => f.profile?.rank).filter(Boolean))].sort(),
		[facultyData],
	);
	const roles = useMemo(
		() => [...new Set(facultyData.flatMap((f) => f.roles))].sort(),
		[facultyData],
	);
	const depts = useMemo(
		() => [...new Set(facultyData.map((f) => f.profile?.department).filter(Boolean))].sort(),
		[facultyData],
	);

	const resetPage = () => setCurrentPage(1);

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return facultyData.filter((f) => {
			if (q && !f.name.toLowerCase().includes(q) && !f.email.toLowerCase().includes(q)) return false;
			if (rankFilter !== "all" && f.profile?.rank !== rankFilter) return false;
			if (roleFilter !== "all" && !f.roles.includes(roleFilter)) return false;
			if (deptFilter !== "all" && f.profile?.department !== deptFilter) return false;
			return true;
		});
	}, [facultyData, search, rankFilter, roleFilter, deptFilter]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
	const paginated = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filtered.slice(start, start + itemsPerPage);
	}, [filtered, currentPage]);

	return (
		<div className="space-y-4 mt-5">
			{/* Search + Filters */}
			<div className="flex flex-wrap gap-3">
				<div className="relative min-w-56 flex-1">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
					<Input
						placeholder="Search by name or email…"
						className="pl-9"
						value={search}
						onChange={(e) => { setSearch(e.target.value); resetPage(); }}
					/>
				</div>
				<Select value={rankFilter} onValueChange={(v) => { setRankFilter(v); resetPage(); }}>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Rank" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Ranks</SelectItem>
						{ranks.map((r) => (
							<SelectItem key={r} value={r}>{r}</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={roleFilter} onValueChange={(v) => { setRoleFilter(v); resetPage(); }}>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Role" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Roles</SelectItem>
						{roles.map((r) => (
							<SelectItem key={r} value={r}>{ROLE_LABELS[r] ?? r}</SelectItem>
						))}
					</SelectContent>
				</Select>
				<Select value={deptFilter} onValueChange={(v) => { setDeptFilter(v); resetPage(); }}>
					<SelectTrigger className="w-52">
						<SelectValue placeholder="Department" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Departments</SelectItem>
						{depts.map((d) => (
							<SelectItem key={d} value={d}>{d}</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* Table */}
			<div className="rounded-lg border border-border overflow-hidden">
				<Table>
					<TableHeader className="bg-muted">
						<TableRow>
							<TableHead>Name</TableHead>
							<TableHead>Rank</TableHead>
							<TableHead>Department</TableHead>
							<TableHead>Role</TableHead>
							<TableHead className="w-28 text-center">Action</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<TableRowSkeleton
								rows={5}
								cells={["h-4 w-52", "h-4 w-28", "h-4 w-32", "h-5 w-20 rounded-full", "mx-auto h-8 w-16 rounded-md"]}
							/>
						) : paginated.length === 0 ? (
							<TableRow>
								<TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
									No faculty members found.
								</TableCell>
							</TableRow>
						) : (
							paginated.map((faculty, idx) => (
								<TableRow key={faculty.id}>
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8 shrink-0">
												<AvatarImage src={faculty.avatar_url ?? undefined} />
												<AvatarFallback className="bg-primary-50 text-primary-700 text-xs font-semibold">
													{getInitials(faculty.name)}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="font-medium leading-tight">{faculty.name}</p>
												<p className="text-xs text-muted-foreground mt-0.5">{faculty.email}</p>
											</div>
										</div>
									</TableCell>
									<TableCell className="text-sm">{faculty.profile?.rank ?? "—"}</TableCell>
									<TableCell className="text-sm">{faculty.profile?.department ?? "—"}</TableCell>
									<TableCell>
										<div className="flex flex-wrap gap-1">
											{faculty.roles.map((role) => (
												<Badge
													key={role}
													variant="outline"
													className={`text-[11px] capitalize ${ROLE_COLORS[role] ?? "bg-muted text-muted-foreground"}`}>
													{ROLE_LABELS[role] ?? role}
												</Badge>
											))}
										</div>
									</TableCell>
									<TableCell className="text-center">
										<div className="flex items-center justify-center gap-1">
											<Link
												to={`/faculties/${faculty.id}/detail`}
												className="inline-flex items-center gap-1 bg-primary-600 hover:bg-primary-700 transition-colors text-white px-2 py-1.5 rounded-md">
												<Eye className="size-3.5" />
												<span className="text-[11px]">View</span>
											</Link>
											{onEdit && (
												<button
													onClick={() => onEdit(faculty)}
													className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 transition-colors text-white px-2 py-1.5 rounded-md">
													<Pencil className="size-3.5" />
													<span className="text-[11px]">Edit</span>
												</button>
											)}
											{onResetPassword && (
												<button
													onClick={() => onResetPassword(faculty)}
													className="inline-flex items-center gap-1 bg-rose-500 hover:bg-rose-600 transition-colors text-white px-2 py-1.5 rounded-md">
													<KeyRound className="size-3.5" />
												</button>
											)}
										</div>
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
				total={filtered.length}
				perPage={itemsPerPage}
				onPageChange={setCurrentPage}
			/>
		</div>
	);
}
