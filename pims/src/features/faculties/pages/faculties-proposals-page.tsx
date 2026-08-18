import { getFacultyProposals, joinProposal } from "@/features/proposals/services/proposal.service";
import { getAcademicYears } from "@/features/admin/services/admin.service";
import Heading from "@/components/heading";
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
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/use-auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	IconCheck,
	IconClock,
	IconLoader2,
	IconSearch,
} from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { Link } from "react-router";
import { toast } from "sonner";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { PAGE_META } from "@/constants/navigation";
import { cn } from "@/lib/utils";

const JOIN_LIMIT = 2;

type ProjectTypeFilter = "all" | "special" | "capstone" | "master-thesis";
type MajorFilter = "all" | "CSE" | "ECE";

type FacultyProposal = {
	id: number;
	title: string;
	description: string;
	slug: string;
	supervisorName: string;
	fileUrl: string;
	status: "pending" | "approved" | "rejected";
	projectType: "special" | "capstone" | "master/thesis";
	type: "faculty";
	eligibleMajors: "CSE" | "ECE" | "both";
	maxStudents: number;
	membersCount: number;
	availableSlots: number;
	isJoined: boolean;
	applicationStatus: "pending" | "accepted" | null;
};

type FacultyProposalsResponse = {
	success: boolean;
	message: string;
	data: {
		proposals: FacultyProposal[];
		joined_proposals_count: number;
	};
};

// ── Constants ──────────────────────────────────────────────────────────────

const TYPE_CONFIG = {
	special: {
		label: "Special",
		badge: "bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950 dark:text-violet-300",
		topBar: "bg-violet-500",
		avatar: "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300",
	},
	capstone: {
		label: "Capstone",
		badge: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300",
		topBar: "bg-blue-500",
		avatar: "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
	},
	"master/thesis": {
		label: "Master / Thesis",
		badge: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300",
		topBar: "bg-emerald-500",
		avatar: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
	},
} as const;

const STATUS_CONFIG = {
	approved: "bg-emerald-50 text-emerald-700 border-emerald-200",
	pending: "bg-amber-50 text-amber-700 border-amber-200",
	rejected: "bg-rose-50 text-rose-700 border-rose-200",
} as const;

// ── Skeleton ───────────────────────────────────────────────────────────────

function ProposalCardSkeleton() {
	return (
		<div className="rounded-xl border bg-card overflow-hidden animate-pulse">
			<div className="h-1 w-full bg-muted" />
			<div className="p-5 space-y-4">
				<div className="flex items-center justify-between">
					<Skeleton className="h-5 w-20 rounded-full" />
					<Skeleton className="h-5 w-16 rounded-full" />
				</div>
				<Skeleton className="h-4 w-full" />
				<div className="flex items-center gap-2.5">
					<Skeleton className="h-8 w-8 rounded-full shrink-0" />
					<div className="space-y-1.5">
						<Skeleton className="h-3.5 w-28" />
						<Skeleton className="h-3 w-16" />
					</div>
				</div>
				<div className="space-y-1.5">
					<Skeleton className="h-3 w-full" />
					<Skeleton className="h-3 w-5/6" />
					<Skeleton className="h-3 w-4/5" />
				</div>
				<div className="rounded-lg bg-muted/50 p-3 space-y-2">
					<div className="flex justify-between">
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-3 w-10" />
					</div>
					<Skeleton className="h-1 w-full rounded-full" />
					<div className="flex justify-between">
						<Skeleton className="h-4 w-16 rounded-full" />
						<Skeleton className="h-3 w-14" />
					</div>
				</div>
				<Skeleton className="h-9 w-full rounded-lg" />
			</div>
		</div>
	);
}

// ── Main Page ──────────────────────────────────────────────────────────────

export default function FacultiesProposalsPage() {
	useHeaderInitializer(PAGE_META.facultyProposals.title, PAGE_META.facultyProposals.subtitle);

	const [activeTab, setActiveTab] = useState<ProjectTypeFilter>("all");
	const [search, setSearch] = useState("");
	const [majorFilter, setMajorFilter] = useState<MajorFilter>("all");
	const [yearId, setYearId] = useState<number | undefined>(undefined);
	const queryClient = useQueryClient();
	const authUser = useAuthStore((state) => state.authUser);

	const userMajorNormalized = (authUser?.profile?.major ?? authUser?.major ?? "").toLowerCase();
	const userMajorCategory: "CSE" | "ECE" | null =
		userMajorNormalized.includes("cse") || userMajorNormalized.includes("computer science")
			? "CSE"
			: userMajorNormalized.includes("ece") ||
				  userMajorNormalized.includes("electronic") ||
				  userMajorNormalized.includes("electronics")
				? "ECE"
				: null;

	const { data: academicYears = [] } = useQuery({
		queryKey: ["academicYears"],
		queryFn: getAcademicYears,
		staleTime: 60_000,
	});

	const { data: facultyProposalsResponse, isLoading } = useQuery<FacultyProposalsResponse>({
		queryKey: ["facultyProposals", yearId],
		queryFn: () => getFacultyProposals(yearId),
		refetchOnWindowFocus: false,
		staleTime: 30_000,
	});

	const joinMutation = useMutation({
		mutationFn: (slug: string) => joinProposal(slug),
		onSuccess: async (response) => {
			toast.success(response?.message ?? "Joined proposal successfully.");
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["facultyProposals"] }),
				queryClient.invalidateQueries({ queryKey: ["myProposals"] }),
			]);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message ?? "Failed to join proposal.");
		},
	});

	const facultyProposals = facultyProposalsResponse?.data?.proposals ?? [];
	const joinedCount = facultyProposalsResponse?.data?.joined_proposals_count ?? 0;

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return facultyProposals.filter((p) => {
			const matchesType =
				activeTab === "all"
					? true
					: activeTab === "master-thesis"
						? p.projectType === "master/thesis"
						: p.projectType === activeTab;
			const matchesSearch =
				!q || p.title.toLowerCase().includes(q) || p.supervisorName.toLowerCase().includes(q);
			const matchesMajor =
				majorFilter === "all" || p.eligibleMajors === "both" || p.eligibleMajors === majorFilter;
			return matchesType && matchesSearch && matchesMajor;
		});
	}, [facultyProposals, activeTab, search, majorFilter]);

	const getButtonState = (p: FacultyProposal) => {
		const isMajorEligible = p.eligibleMajors === "both" || userMajorCategory === p.eligibleMajors;
		const hasReachedLimit = joinedCount >= JOIN_LIMIT && !p.isJoined;
		const isTeamFull = p.availableSlots === 0;
		const isJoining = joinMutation.isPending && joinMutation.variables === p.slug;
		const isDisabled = isJoining || p.isJoined || hasReachedLimit || isTeamFull || !isMajorEligible || p.status !== "approved";

		if (p.applicationStatus === "accepted")
			return { isDisabled, label: "Joined", Icon: IconCheck, variant: "joined" as const };
		if (p.applicationStatus === "pending")
			return { isDisabled, label: "Request Pending", Icon: IconClock, variant: "pending" as const };
		if (p.status !== "approved")
			return { isDisabled: true, label: "Awaiting IC Approval", Icon: null, variant: "muted" as const };
		if (hasReachedLimit)
			return { isDisabled, label: `Limit Reached (${JOIN_LIMIT}/${JOIN_LIMIT})`, Icon: null, variant: "muted" as const };
		if (isTeamFull)
			return { isDisabled, label: "Team Full", Icon: null, variant: "muted" as const };
		if (!isMajorEligible)
			return { isDisabled, label: "Not Eligible For Your Major", Icon: null, variant: "muted" as const };
		if (isJoining)
			return { isDisabled, label: "Joining...", Icon: IconLoader2, variant: "loading" as const };
		return { isDisabled: false, label: "Request to Join", Icon: null, variant: "default" as const };
	};

	const buttonClass = (variant: string) => {
		switch (variant) {
			case "joined": return "bg-emerald-600 hover:bg-emerald-600 text-white";
			case "pending": return "bg-amber-500 hover:bg-amber-500 text-white";
			case "loading": return "bg-primary-600 text-white opacity-80";
			case "muted": return "";
			default: return "bg-primary-600 hover:bg-primary-700 text-white";
		}
	};

	return (
		<>
			{/* ── Header ── */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
				<Heading
					title="Faculty Proposals"
					description="Browse and apply to approved proposals from faculty supervisors."
				/>
				<div className="flex items-center gap-2 shrink-0 self-start sm:mt-1">
					<div className="rounded-full border bg-card px-4 py-1.5 text-sm">
						Applied{" "}
						<span className={`font-bold ${joinedCount >= JOIN_LIMIT ? "text-rose-600" : "text-foreground"}`}>
							{joinedCount}/{JOIN_LIMIT}
						</span>
					</div>
					<div className="rounded-full border bg-card px-4 py-1.5 text-sm text-muted-foreground">
						{filtered.length} {filtered.length === 1 ? "result" : "results"}
					</div>
				</div>
			</div>

			{/* ── Filters ── */}
			<div className="mb-6 flex flex-wrap items-center gap-3">
				<div className="relative flex-1 min-w-56 max-w-sm">
					<IconSearch
						size={15}
						className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none"
					/>
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by title or supervisor…"
						className="pl-9"
					/>
				</div>

				<Select value={activeTab} onValueChange={(v) => setActiveTab(v as ProjectTypeFilter)}>
					<SelectTrigger className="w-44">
						<SelectValue placeholder="Project type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
						<SelectItem value="special">Special</SelectItem>
						<SelectItem value="capstone">Capstone</SelectItem>
						<SelectItem value="master-thesis">Master / Thesis</SelectItem>
					</SelectContent>
				</Select>

				<Select value={majorFilter} onValueChange={(v) => setMajorFilter(v as MajorFilter)}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Major" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Majors</SelectItem>
						<SelectItem value="CSE">CSE</SelectItem>
						<SelectItem value="ECE">ECE</SelectItem>
					</SelectContent>
				</Select>

				<Select
					value={yearId ? String(yearId) : "all"}
					onValueChange={(v) => setYearId(v === "all" ? undefined : Number(v))}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Academic Year" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Years</SelectItem>
						{(academicYears as any[]).map((y) => (
							<SelectItem key={y.id} value={String(y.id)}>
								{y.year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			{/* ── Grid ── */}
			{isLoading ? (
				<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
					{[...Array(6)].map((_, i) => <ProposalCardSkeleton key={i} />)}
				</div>
			) : filtered.length === 0 ? (
				<div className="flex flex-col items-center justify-center rounded-2xl border border-dashed py-20 text-center">
					<p className="text-sm text-muted-foreground">
						No proposals found for the selected filters.
					</p>
				</div>
			) : (
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
					{filtered.map((proposal) => {
						const { isDisabled, label, Icon: BtnIcon, variant } = getButtonState(proposal);
						const typeConfig = TYPE_CONFIG[proposal.projectType] ?? TYPE_CONFIG["special"];
						const capacityPct = Math.round((proposal.membersCount / proposal.maxStudents) * 100);
						const supervisorInitials = proposal.supervisorName
							.split(" ")
							.map((n: string) => n[0])
							.join("")
							.slice(0, 2)
							.toUpperCase();

						return (
							<div
								key={proposal.slug}
								className="flex flex-col rounded-xl border bg-card overflow-hidden hover:shadow-sm transition-shadow duration-200"
							>
								{/* Colored top accent bar */}
								<div className={cn("h-1 w-full shrink-0", typeConfig.topBar)} />

								<div className="flex flex-col gap-4 p-5 flex-1">
									{/* Badges */}
									<div className="flex items-center justify-between gap-2">
										<Badge variant="outline" className={cn("text-xs font-medium", typeConfig.badge)}>
											{typeConfig.label}
										</Badge>
										<Badge variant="outline" className={cn("text-xs capitalize", STATUS_CONFIG[proposal.status])}>
											{proposal.status}
										</Badge>
									</div>

									{/* Title */}
									<Link
										to={`/proposals/faculty/${proposal.slug}/detail`}
										className="font-semibold text-sm leading-snug line-clamp-2 -mt-1 hover:text-primary-600 transition-colors">
										{proposal.title}
									</Link>

									{/* Supervisor */}
									<div className="flex items-center gap-2.5">
										<div className={cn(
											"flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold",
											typeConfig.avatar,
										)}>
											{supervisorInitials}
										</div>
										<div>
											<p className="text-sm font-medium leading-none">{proposal.supervisorName}</p>
											<p className="text-xs text-muted-foreground mt-0.5">Supervisor</p>
										</div>
									</div>

									{/* Description */}
									<p className="text-xs text-muted-foreground leading-relaxed line-clamp-3 flex-1">
										{proposal.description}
									</p>

									{/* Capacity block */}
									<div className="rounded-lg bg-muted/50 px-3 py-2.5 space-y-2">
										<div className="flex items-center justify-between text-xs">
											<span className="text-muted-foreground">Team capacity</span>
											<span className="font-semibold tabular-nums">
												{proposal.membersCount}/{proposal.maxStudents}
											</span>
										</div>
										<div className="h-1 w-full rounded-full bg-muted overflow-hidden">
											<div
												className={cn(
													"h-full rounded-full transition-all",
													capacityPct >= 100 ? "bg-rose-500" : capacityPct >= 70 ? "bg-amber-500" : "bg-emerald-500",
												)}
												style={{ width: `${Math.min(capacityPct, 100)}%` }}
											/>
										</div>
										<div className="flex items-center justify-between text-xs text-muted-foreground">
											<span className="rounded-full bg-background border px-2 py-0.5">
												{proposal.eligibleMajors === "both" ? "CSE & ECE" : proposal.eligibleMajors}
											</span>
											{proposal.availableSlots === 0 ? (
												<span className="text-rose-500 font-medium">Team full</span>
											) : (
												<span>{proposal.availableSlots} slot{proposal.availableSlots !== 1 ? "s" : ""} left</span>
											)}
										</div>
									</div>

									{/* Application status banner */}
									{proposal.applicationStatus === "accepted" && (
										<div className="rounded-lg bg-emerald-50 dark:bg-emerald-950/30 px-3 py-2 text-xs font-medium text-emerald-700 dark:text-emerald-400 text-center">
											You joined this proposal
										</div>
									)}
									{proposal.applicationStatus === "pending" && (
										<div className="rounded-lg bg-amber-50 dark:bg-amber-950/30 px-3 py-2 text-xs font-medium text-amber-700 dark:text-amber-400 text-center">
											Application pending approval
										</div>
									)}

									{/* Action button */}
									<Button
										className={cn("h-9 w-full rounded-lg text-sm font-medium", buttonClass(variant))}
										disabled={isDisabled}
										onClick={() => joinMutation.mutate(proposal.slug)}
										variant={variant === "muted" ? "outline" : "default"}
									>
										{BtnIcon && (
											<BtnIcon
												size={14}
												className={cn("mr-1.5", variant === "loading" && "animate-spin")}
											/>
										)}
										{label}
									</Button>
								</div>
							</div>
						);
					})}
				</div>
			)}
		</>
	);
}
