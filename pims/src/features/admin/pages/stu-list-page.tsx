import {
	getAdminStudents,
	getStudentFilters,
	type AdminStudent,
} from "../services/admin.service";
import Heading from "@/components/heading";
import TablePagination from "@/components/table-pagination";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { getInitials } from "@/lib/utils";
import {
	IconFileSpreadsheet,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";

const STATUS_STYLES: Record<string, string> = {
	Active: "text-emerald-700 bg-emerald-50 border-emerald-200",
	Graduated: "text-blue-700 bg-blue-50 border-blue-200",
	"On Leave": "text-amber-700 bg-amber-50 border-amber-200",
};

function StudentTableSkeleton() {
	return Array.from({ length: 8 }).map((_, i) => (
		<TableRow key={i}>
			<TableCell>
				<div className="flex items-center gap-3">
					<Skeleton className="h-8 w-8 rounded-full" />
					<div className="space-y-1.5">
						<Skeleton className="h-3.5 w-36" />
						<Skeleton className="h-3 w-44" />
					</div>
				</div>
			</TableCell>
			<TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
			<TableCell><Skeleton className="h-5 w-12" /></TableCell>
			<TableCell><Skeleton className="h-5 w-24" /></TableCell>
			<TableCell><Skeleton className="h-5 w-20" /></TableCell>
			<TableCell><Skeleton className="h-5 w-16 rounded-full" /></TableCell>
		</TableRow>
	));
}

export default function StuListPage() {
	useHeaderInitializer("MIIT | Students", "Students");

	const [search, setSearch] = useState("");
	const [selectedMajor, setSelectedMajor] = useState<string>("all");
	const [selectedBatch, setSelectedBatch] = useState<string>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const itemsPerPage = 10;

	const { data: filterOptions } = useQuery({
		queryKey: ["student-filters"],
		queryFn: getStudentFilters,
	});

	const { data: allStudents = [], isLoading } = useQuery({
		queryKey: ["admin-students"],
		queryFn: getAdminStudents,
	});

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return allStudents.filter((s) => {
			const matchesSearch =
				!q ||
				s.name.toLowerCase().includes(q) ||
				s.email.toLowerCase().includes(q) ||
				(s.phone_number ?? "").toLowerCase().includes(q);
			const matchesMajor = selectedMajor === "all" || s.major_name === selectedMajor;
			const matchesBatch = selectedBatch === "all" || s.batch === selectedBatch;
			return matchesSearch && matchesMajor && matchesBatch;
		});
	}, [allStudents, search, selectedMajor, selectedBatch]);

	const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
	const students = useMemo(() => {
		const start = (currentPage - 1) * itemsPerPage;
		return filtered.slice(start, start + itemsPerPage);
	}, [filtered, currentPage]);

	const hasActiveFilters = selectedMajor !== "all" || selectedBatch !== "all" || search.length > 0;

	const resetPage = () => setCurrentPage(1);

	const clearFilters = () => {
		setSearch("");
		setSelectedMajor("all");
		setSelectedBatch("all");
		resetPage();
	};

	return (
		<>
			<div className="flex items-start justify-between mb-6">
				<Heading
					title="Students"
					description="Browse and manage registered students."
				/>
				<Button className="gap-2 bg-primary-600 hover:bg-primary-600/90 text-white shrink-0 mt-1">
					<IconFileSpreadsheet size={16} /> Import from Excel
				</Button>
			</div>

			{/* Filters */}
			<div className="mb-4 flex flex-wrap items-center gap-3">
				<div className="relative flex-1 min-w-[200px] max-w-sm">
					<IconSearch
						size={15}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
					/>
					<Input
						placeholder="Search name, email, phone…"
						value={search}
						onChange={(e) => { setSearch(e.target.value); resetPage(); }}
						className="pl-9"
					/>
				</div>

				<Select value={selectedMajor} onValueChange={(v) => { setSelectedMajor(v); resetPage(); }}>
					<SelectTrigger className="w-[160px]">
						<SelectValue placeholder="All Majors" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Majors</SelectItem>
						{filterOptions?.majors.map((major) => (
							<SelectItem key={major} value={major}>
								{major}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				<Select value={selectedBatch} onValueChange={(v) => { setSelectedBatch(v); resetPage(); }}>
					<SelectTrigger className="w-[140px]">
						<SelectValue placeholder="All Batches" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Batches</SelectItem>
						{filterOptions?.batches.map((batch) => (
							<SelectItem key={batch} value={batch}>
								Batch {batch}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="gap-1 text-muted-foreground"
					>
						<IconX size={14} /> Clear
					</Button>
				)}
			</div>

			<div className="rounded-xl border bg-card overflow-hidden">
				<Table>
					<TableHeader className="bg-muted/40">
						<TableRow>
							<TableHead className="font-semibold">Student</TableHead>
							<TableHead className="font-semibold">Major</TableHead>
							<TableHead className="font-semibold">Batch</TableHead>
							<TableHead className="font-semibold">Phone</TableHead>
							<TableHead className="font-semibold">GPA</TableHead>
							<TableHead className="font-semibold">Status</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							<StudentTableSkeleton />
						) : !students.length ? (
							<TableRow>
								<TableCell colSpan={6} className="py-16 text-center text-muted-foreground text-sm">
									{hasActiveFilters
										? "No students match your filters."
										: "No students found."}
								</TableCell>
							</TableRow>
						) : (
							students.map((student) => (
								<TableRow key={student.id} className="hover:bg-muted/20 transition-colors">
									<TableCell>
										<div className="flex items-center gap-3">
											<Avatar className="h-8 w-8 shrink-0">
												<AvatarImage src={student.avatar_url ?? undefined} />
												<AvatarFallback className="bg-primary-50 text-primary-700 text-xs font-semibold">
													{getInitials(student.name)}
												</AvatarFallback>
											</Avatar>
											<div>
												<p className="text-sm font-medium leading-none">{student.name}</p>
												<p className="text-xs text-muted-foreground mt-0.5 font-mono">{student.email}</p>
											</div>
										</div>
									</TableCell>
									<TableCell>
										{student.major_name ? (
											<Badge variant="outline" className="font-medium text-xs bg-slate-50 text-slate-700 border-slate-200">
												{student.major_name}
											</Badge>
										) : (
											<span className="text-sm text-muted-foreground">—</span>
										)}
									</TableCell>
									<TableCell>
										{student.batch ? (
											<span className="text-sm font-medium">{student.batch}</span>
										) : (
											<span className="text-sm text-muted-foreground">—</span>
										)}
									</TableCell>
									<TableCell>
										{student.phone_number ? (
											<span className="text-sm font-mono">{student.phone_number}</span>
										) : (
											<span className="text-sm text-muted-foreground">—</span>
										)}
									</TableCell>
									<TableCell>
										{student.gpa ? (
											<span className="text-sm font-medium">{student.gpa}</span>
										) : (
											<span className="text-sm text-muted-foreground">—</span>
										)}
									</TableCell>
									<TableCell>
										<Badge
											variant="outline"
											className={`font-medium text-xs ${STATUS_STYLES[student.graduation_status] ?? "bg-slate-50 text-slate-700 border-slate-200"}`}
										>
											{student.graduation_status}
										</Badge>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			<div className="mt-4">
				<TablePagination
					currentPage={currentPage}
					lastPage={totalPages}
					total={filtered.length}
					perPage={itemsPerPage}
					onPageChange={setCurrentPage}
				/>
			</div>
		</>
	);
}
