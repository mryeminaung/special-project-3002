import { getSAProposals } from "../services/sa.service";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { PAGE_META } from "@/constants/navigation";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import TablePagination from "@/components/table-pagination";
import { cn } from "@/lib/utils";
import { proposalStatusColor } from "@/constants/badge-colors";
import {
	IconDownload,
	IconFileDescription,
	IconSearch,
	IconX,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

type Proposal = {
	id: number;
	title: string;
	slug: string;
	supervisor: string | null;
	projectArea: string | null;
	type: string;
	projectType: string;
	status: string;
	submittedAt: string;
	academicYear: string | null;
	documentUrl: string | null;
};

const TYPE_LABELS: Record<string, string> = {
	student: "Student",
	faculty: "Faculty",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
	special: "Special",
	capstone: "Capstone",
	master: "Master / Thesis",
	"master/thesis": "Master / Thesis",
};

export default function SAProposalsPage() {
	useHeaderInitializer(PAGE_META.saProposals.title, PAGE_META.saProposals.subtitle);

	const [page, setPage] = useState(1);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [typeFilter, setTypeFilter] = useState("all");

	const { data, isLoading } = useQuery({
		queryKey: ["sa-proposals", page],
		queryFn: () => getSAProposals(page),
		staleTime: 30_000,
	});

	const allProposals: Proposal[] = data?.data ?? [];
	const meta = data?.meta;

	const filtered = allProposals.filter((p) => {
		if (statusFilter !== "all" && p.status !== statusFilter) return false;
		if (typeFilter !== "all" && p.type !== typeFilter) return false;
		if (search) {
			const q = search.toLowerCase();
			if (
				!p.title.toLowerCase().includes(q) &&
				!(p.supervisor ?? "").toLowerCase().includes(q) &&
				!(p.projectArea ?? "").toLowerCase().includes(q)
			)
				return false;
		}
		return true;
	});

	const totalPending  = allProposals.filter((p) => p.status === "pending").length;
	const totalApproved = allProposals.filter((p) => p.status === "approved").length;
	const totalRejected = allProposals.filter((p) => p.status === "rejected").length;

	return (
		<>
			<Heading
				title="Project Proposals"
				description="Review and download submitted project proposals."
			/>

			{/* Quick stats */}
			<div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
				{[
					{ label: "Total", value: allProposals.length, color: "text-foreground" },
					{ label: "Pending", value: totalPending, color: "text-amber-600 dark:text-amber-400" },
					{ label: "Approved", value: totalApproved, color: "text-emerald-600 dark:text-emerald-400" },
					{ label: "Rejected", value: totalRejected, color: "text-red-500 dark:text-red-400" },
				].map((s) => (
					<div key={s.label} className="rounded-xl border bg-card px-4 py-3">
						<p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">{s.label}</p>
						<p className={cn("text-2xl font-bold", s.color)}>{isLoading ? "—" : s.value}</p>
					</div>
				))}
			</div>

			{/* Filters */}
			<div className="flex flex-wrap items-center gap-3 mb-4">
				<div className="relative flex-1 min-w-48 max-w-sm">
					<IconSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
					<Input
						placeholder="Search title, supervisor, area…"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-8"
					/>
					{search && (
						<button
							type="button"
							onClick={() => setSearch("")}
							className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
						>
							<IconX size={14} />
						</button>
					)}
				</div>

				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="approved">Approved</SelectItem>
						<SelectItem value="rejected">Rejected</SelectItem>
					</SelectContent>
				</Select>

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
			<div className="rounded-xl border bg-card overflow-hidden mb-4">
				<Table>
					<TableHeader className="bg-muted/40">
						<TableRow>
							<TableHead className="font-semibold">Title</TableHead>
							<TableHead className="font-semibold hidden md:table-cell">Supervisor</TableHead>
							<TableHead className="font-semibold hidden lg:table-cell">Type</TableHead>
							<TableHead className="font-semibold hidden lg:table-cell">Project Type</TableHead>
							<TableHead className="font-semibold">Status</TableHead>
							<TableHead className="font-semibold hidden md:table-cell">Submitted</TableHead>
							<TableHead className="font-semibold w-28">Document</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isLoading ? (
							Array.from({ length: 8 }).map((_, i) => (
								<TableRow key={i}>
									{Array.from({ length: 7 }).map((_, j) => (
										<TableCell key={j}>
											<div className="h-4 rounded bg-muted animate-pulse" />
										</TableCell>
									))}
								</TableRow>
							))
						) : filtered.length === 0 ? (
							<TableRow>
								<TableCell colSpan={7} className="py-16 text-center">
									<IconFileDescription size={32} className="mx-auto mb-2 text-muted-foreground/30" />
									<p className="text-sm text-muted-foreground">No proposals found.</p>
								</TableCell>
							</TableRow>
						) : (
							filtered.map((proposal) => (
								<TableRow key={proposal.id}>
									<TableCell className="max-w-[240px]">
										<p className="font-medium text-sm truncate" title={proposal.title}>
											{proposal.title}
										</p>
										{proposal.projectArea && (
											<p className="text-xs text-muted-foreground mt-0.5">{proposal.projectArea}</p>
										)}
									</TableCell>
									<TableCell className="hidden md:table-cell text-sm text-muted-foreground">
										{proposal.supervisor ?? "—"}
									</TableCell>
									<TableCell className="hidden lg:table-cell">
										<Badge variant="outline" className="text-xs font-medium capitalize">
											{TYPE_LABELS[proposal.type] ?? proposal.type}
										</Badge>
									</TableCell>
									<TableCell className="hidden lg:table-cell">
										<Badge variant="outline" className="text-xs font-medium">
											{PROJECT_TYPE_LABELS[proposal.projectType] ?? proposal.projectType}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge
											variant="outline"
											className={cn("capitalize text-xs font-medium", proposalStatusColor(proposal.status))}
										>
											{proposal.status}
										</Badge>
									</TableCell>
									<TableCell className="hidden md:table-cell text-sm text-muted-foreground">
										{proposal.submittedAt}
									</TableCell>
									<TableCell>
										{proposal.documentUrl ? (
											<Button
												size="sm"
												variant="outline"
												className="h-7 px-2 text-xs gap-1"
												asChild
											>
												<a href={proposal.documentUrl} target="_blank" rel="noreferrer">
													<IconDownload size={12} />
													Download
												</a>
											</Button>
										) : (
											<span className="text-xs text-muted-foreground">—</span>
										)}
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{meta && (
				<TablePagination
					currentPage={meta.current_page}
					lastPage={meta.last_page}
					total={meta.total}
					perPage={meta.per_page}
					onPageChange={setPage}
				/>
			)}
		</>
	);
}
