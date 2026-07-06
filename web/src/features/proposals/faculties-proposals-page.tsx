import api from "@/api/api";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuthStore } from "@/stores/use-auth-store";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	AppWindowIcon,
	CheckCircle2,
	Clock3,
	Loader2,
	UserRound,
	Users,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ProjectTypeFilter = "all" | "special" | "capstone" | "master-thesis";

type FacultyProposal = {
	id: number;
	title: string;
	description: string;
	slug: string;
	supervisor_name: string;
	fileUrl: string;
	status: "pending" | "approved" | "rejected";
	project_type: "special" | "capstone" | "master/thesis";
	type: "faculty";
	eligible_majors: "CSE" | "ECE" | "both";
	max_students: number;
	members_count: number;
	available_slots: number;
	is_joined: boolean;
	application_status: "pending" | "accepted" | null;
};

type FacultyProposalsResponse = {
	success: boolean;
	message: string;
	data: {
		proposals: FacultyProposal[];
		joined_proposals_count: number;
	};
};

export default function FacultiesProposalsPage() {
	const [activeTab, setActiveTab] = useState<ProjectTypeFilter>("all");
	const queryClient = useQueryClient();
	const authUser = useAuthStore((state) => state.authUser);

	const userMajorNormalized = (authUser?.major ?? "").toLowerCase();

	const userMajorCategory: "CSE" | "ECE" | null =
		userMajorNormalized.includes("cse") ||
		userMajorNormalized.includes("computer science")
			? "CSE"
			: userMajorNormalized.includes("ece") ||
				  userMajorNormalized.includes("electronic") ||
				  userMajorNormalized.includes("electronics")
				? "ECE"
				: null;

	const fetchFacultyProposals = async () => {
		const res = await api.get<FacultyProposalsResponse>("/proposals/faculties");
		return res.data;
	};

	const { data: facultyProposalsResponse, isLoading } = useQuery({
		queryKey: ["facultyProposals"],
		queryFn: fetchFacultyProposals,
		refetchOnWindowFocus: false,
		staleTime: 30_000,
	});

	const joinProposalMutation = useMutation({
		mutationFn: async (proposalSlug: string) => {
			const res = await api.post(`/proposals/${proposalSlug}/join`);
			return res.data;
		},
		onSuccess: async (response) => {
			toast.success(response?.message ?? "Joined proposal successfully.");
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["facultyProposals"] }),
				queryClient.invalidateQueries({ queryKey: ["myProposals"] }),
			]);
		},
		onError: (error: any) => {
			const message =
				error?.response?.data?.message ?? "Failed to join proposal.";
			toast.error(message);
		},
	});

	const facultyProposals = facultyProposalsResponse?.data?.proposals ?? [];
	const joinedProposalCount =
		facultyProposalsResponse?.data?.joined_proposals_count ?? 0;

	const filteredProposals = facultyProposals.filter((proposal) => {
		if (activeTab === "all") {
			return proposal.type === "faculty";
		}

		if (activeTab === "master-thesis") {
			return proposal.project_type === "master/thesis";
		}

		return proposal.project_type === activeTab;
	});

	const getButtonState = (proposal: FacultyProposal) => {
		const isMajorEligible =
			proposal.eligible_majors === "both" ||
			userMajorCategory === proposal.eligible_majors;
		const hasReachedLimit = joinedProposalCount >= 3 && !proposal.is_joined;
		const isTeamFull = proposal.available_slots === 0;
		const isJoining =
			joinProposalMutation.isPending &&
			joinProposalMutation.variables === proposal.slug;
		const isDisabled =
			isJoining ||
			proposal.is_joined ||
			hasReachedLimit ||
			isTeamFull ||
			!isMajorEligible;

		let label = "Request to Join";
		let icon: typeof CheckCircle2 | typeof Clock3 | typeof Loader2 | null =
			null;

		if (proposal.application_status === "accepted") {
			label = "Joined";
			icon = CheckCircle2;
		} else if (proposal.application_status === "pending") {
			label = "Request Pending";
			icon = Clock3;
		} else if (hasReachedLimit) {
			label = "Join Limit Reached";
			icon = Clock3;
		} else if (isTeamFull) {
			label = "Team Full";
			icon = CheckCircle2;
		} else if (!isMajorEligible) {
			label = "Not Eligible For Your Major";
		} else if (isJoining) {
			label = "Joining...";
			icon = Loader2;
		}

		return {
			isDisabled,
			label,
			icon,
			isMajorEligible,
			isTeamFull,
			hasReachedLimit,
		};
	};

	return (
		<PageWrapper>
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<div>
					<Heading title="Browse Faculty Proposals" />
					<p className="mt-2 text-sm text-muted-foreground">
						Join approved faculty proposals if your major matches and you still
						have slots available.
					</p>
				</div>

				<Tabs
					value={activeTab}
					onValueChange={(value) => setActiveTab(value as ProjectTypeFilter)}>
					<TabsList className="space-x-3 py-5">
						<TabsTrigger
							className="px-5 py-4"
							value="all">
							<AppWindowIcon />
							All
						</TabsTrigger>
						<TabsTrigger
							className="px-5 py-4"
							value="special">
							<AppWindowIcon />
							Special
						</TabsTrigger>
						<TabsTrigger
							className="px-5 py-4"
							value="capstone">
							<AppWindowIcon />
							Capstone
						</TabsTrigger>
						<TabsTrigger
							className="px-5 py-4"
							value="master-thesis">
							<AppWindowIcon />
							Master/Thesis
						</TabsTrigger>
					</TabsList>
				</Tabs>
			</div>

			<div className="mt-4 flex flex-wrap gap-3 text-sm text-muted-foreground">
				<div className="rounded-full border bg-muted/40 px-3 py-1.5">
					Joined proposals:{" "}
					<span className="font-semibold text-foreground">
						{joinedProposalCount}/3
					</span>
				</div>
				<div className="rounded-full border bg-muted/40 px-3 py-1.5">
					Loaded proposals:{" "}
					<span className="font-semibold text-foreground">
						{facultyProposals.length}
					</span>
				</div>
			</div>

			{isLoading ? (
				<div className="mt-8 flex items-center justify-center rounded-2xl border border-dashed py-16 text-sm text-muted-foreground">
					<Loader2 className="mr-2 size-4 animate-spin" />
					Loading faculty proposals...
				</div>
			) : filteredProposals.length === 0 ? (
				<div className="mt-8 rounded-2xl border border-dashed p-8 text-center text-muted-foreground">
					No faculty proposals found for the selected project type.
				</div>
			) : (
				<div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 md:grid-cols-3">
					{filteredProposals.map((proposal) => {
						const {
							isDisabled,
							label,
							icon: ButtonIcon,
						} = getButtonState(proposal);

						return (
							<Card
								key={proposal.slug}
								className="rounded-2xl border border-slate-200 bg-slate-50/70 shadow-none">
								<CardContent className="space-y-4 p-4">
									<div className="flex items-start justify-between gap-3">
										<div className="flex min-w-0 items-center gap-3">
											<div className="rounded-full bg-slate-200 p-2.5 text-blue-600">
												<UserRound className="size-5" />
											</div>
											<div className="min-w-0">
												<p className="truncate text-sm font-semibold leading-none">
													{proposal.supervisor_name}
												</p>
												<p className="text-sm text-muted-foreground">
													Supervisor
												</p>
											</div>
										</div>
										<Badge
											variant="secondary"
											className="border-0 bg-slate-200 px-2.5 py-0.5 text-[11px] capitalize text-slate-700">
											{proposal.status}
										</Badge>
									</div>

									<div>
										<h3 className="text-lg font-semibold leading-tight line-clamp-2">
											{proposal.title}
										</h3>
										<p className="mt-2 line-clamp-3 text-sm leading-relaxed text-slate-600">
											{proposal.description}
										</p>
									</div>

									<div className="rounded-xl bg-slate-200 px-4 py-3">
										<div className="flex items-center justify-between gap-3">
											<div className="flex items-center gap-2 text-slate-700">
												<Users className="size-5" />
												<span className="text-sm">Team capacity</span>
											</div>
											<div className="text-base font-semibold">
												{proposal.members_count}/{proposal.max_students}
												{proposal.available_slots === 0 && (
													<span className="ml-2 text-sm font-medium text-red-500">
														Full
													</span>
												)}
											</div>
										</div>
										<div className="mt-2 flex flex-wrap gap-2 text-[11px] text-slate-600">
											<span className="rounded-full bg-white/70 px-2.5 py-1">
												Eligible majors: {proposal.eligible_majors}
											</span>
											<span className="rounded-full bg-white/70 px-2.5 py-1">
												Slots left: {proposal.available_slots}
											</span>
											{proposal.application_status === "accepted" && (
												<span className="rounded-full bg-emerald-100 px-2.5 py-1 text-emerald-700">
													Already joined
												</span>
											)}
											{proposal.application_status === "pending" && (
												<span className="rounded-full bg-amber-100 px-2.5 py-1 text-amber-700">
													Pending approval
												</span>
											)}
										</div>
									</div>

									<Button
										className="h-10 w-full rounded-xl bg-primary-600 text-sm hover:bg-primary-700"
										disabled={isDisabled}
										onClick={() => joinProposalMutation.mutate(proposal.slug)}
										type="button"
										variant={isDisabled ? "outline" : "default"}>
										{ButtonIcon ? <ButtonIcon className="size-4" /> : null}
										{label}
									</Button>
								</CardContent>
							</Card>
						);
					})}
				</div>
			)}
		</PageWrapper>
	);
}
