import { useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { cn } from "@/lib/utils";
import { formatDate } from "@/lib/date";
import type { ProposalStatus } from "@/types/api";
import {
	proposalStatusColor,
	proposalAppliedTypeColor,
	projectTypeColor,
} from "@/constants/badge-colors";

import {
	CheckBadgeIcon,
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";
import { DocumentTextIcon } from "@heroicons/react/24/solid";

import { CalendarIcon, ShieldCheck, UserIcon } from "lucide-react";
import { IconUsersGroup } from "@tabler/icons-react";

import {
	getProposal,
	approveProposal,
	rejectProposal,
	acceptApplicant,
	rejectApplicant,
} from "@/features/proposals/services/proposal.service";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

import DownloadFile from "@/components/download-file";
import NavigateTo from "@/components/common/navigate-to";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useAuthStore } from "@/stores/use-auth-store";
import { useCallback, useState } from "react";
import { ApprovalModal, CommentBox } from "@/features/proposals";

type StudentMember = {
	id: number;
	name: string;
	email: string;
};

type ProposalDetail = {
	id: number;
	title: string;
	slug: string;
	description: string;
	file: string;
	type: string;
	projectType: string;
	projectArea?: string | null;
	status: ProposalStatus;
	submittedAt: string;
	maxStudents: number;
	supervisor: {
		id: number;
		name: string;
		email: string;
	};
	members: StudentMember[];
	appliedStudents: StudentMember[];
	canViewApplicants: boolean;
	canManageApplicants: boolean;
};

export default function FacultyProposalDetailPage() {
	const { slug } = useParams();
	const queryClient = useQueryClient();
	const { isIC, isSupervisor, isFaculty } = useRoleChecker();
	const authUser = useAuthStore((state) => state.authUser);
	const [showApprovalModal, setShowApprovalModal] = useState(false);

	const { data: proposalDetail, isLoading } = useQuery({
		queryKey: ["proposalDetail", slug],
		queryFn: () => getProposal(slug!),
	});

	const proposal: ProposalDetail = proposalDetail?.data;
	const canApproveOrRejectProposal = isIC && proposal?.status === "pending";

	const acceptApplicantMutation = useMutation({
		mutationFn: (studentId: number) => acceptApplicant(proposal?.slug, studentId),
		onSuccess: async () => {
			toast.success("Student accepted.");
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["proposalDetail", slug] }),
				queryClient.invalidateQueries({ queryKey: ["facultyProposals"] }),
			]);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message ?? "Failed to accept student.");
		},
	});

	const rejectApplicantMutation = useMutation({
		mutationFn: (studentId: number) => rejectApplicant(proposal?.slug, studentId),
		onSuccess: async () => {
			toast.success("Student rejected.");
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["proposalDetail", slug] }),
				queryClient.invalidateQueries({ queryKey: ["facultyProposals"] }),
			]);
		},
		onError: (error: any) => {
			toast.error(error?.response?.data?.message ?? "Failed to reject student.");
		},
	});

	const approveMutation = useMutation({
		mutationFn: () => approveProposal(proposal?.slug),
		onMutate: () => setShowApprovalModal(true),
		onError: (error: any) => {
			setShowApprovalModal(false);
			toast.error(error.response?.data?.message || "Failed to approve proposal.");
		},
	});

	const rejectMutation = useMutation({
		mutationFn: () => rejectProposal(proposal?.slug),
		onSuccess: () => {
			toast.success("Proposal rejected.");
			queryClient.invalidateQueries({ queryKey: ["proposalDetail", slug] });
		},
		onError: (error: any) => {
			toast.error(error.response?.data?.message || "Failed to reject proposal.");
		},
	});

	const handleApprovalModalComplete = useCallback(() => {
		setShowApprovalModal(false);
		queryClient.invalidateQueries({ queryKey: ["proposalDetail", slug] });
	}, [queryClient, slug]);

	if (isLoading) {
		return (
			<div className="space-y-6 animate-pulse">
				<div className="h-5 w-36 rounded bg-muted" />
				<div className="mt-4 space-y-3">
					<div className="h-7 w-2/3 rounded bg-muted" />
					<div className="h-4 w-40 rounded bg-muted" />
					<div className="flex gap-2">
						{[...Array(3)].map((_, i) => <div key={i} className="h-6 w-20 rounded-full bg-muted" />)}
					</div>
				</div>
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					<div className="lg:col-span-2 space-y-6">
						<div className="space-y-2">
							<div className="h-3 w-24 rounded bg-muted" />
							{[...Array(4)].map((_, i) => <div key={i} className="h-4 rounded bg-muted" />)}
							<div className="h-4 w-3/4 rounded bg-muted" />
						</div>
						<div className="h-px bg-muted" />
						<div className="h-20 rounded-xl bg-muted" />
						<div className="h-px bg-muted" />
						<div className="space-y-3">
							<div className="h-3 w-32 rounded bg-muted" />
							{[...Array(3)].map((_, i) => <div key={i} className="h-16 rounded-xl bg-muted" />)}
						</div>
					</div>
					<div className="lg:col-span-1">
						<div className="rounded-xl border bg-card divide-y overflow-hidden">
							{[...Array(3)].map((_, i) => <div key={i} className="p-4 h-20" />)}
						</div>
					</div>
				</div>
			</div>
		);
	}

	if (!proposal) return null;

	return (
		<>
			<Toaster />
			<ApprovalModal
				isOpen={showApprovalModal}
				isLoading={approveMutation.isPending}
				onComplete={handleApprovalModalComplete}
			/>

			{isSupervisor && isFaculty ? (
					<NavigateTo to="/proposals/browse" label="Back to Proposals" />
				) : (
					<NavigateTo to="/proposals" label="Back to Proposals" />
				)}

				{/* Header */}
				<div className="mt-4 mb-8">
					<h1 className="text-2xl font-bold leading-tight">{proposal.title}</h1>

					<div className="flex items-center gap-1.5 mt-2 text-sm text-muted-foreground">
						<CalendarIcon className="h-3.5 w-3.5" />
						Submitted at {formatDate(proposal.submittedAt)}
					</div>

					<div className="flex flex-wrap gap-2 mt-4">
						<Badge
							variant="outline"
							className={cn("capitalize font-medium", proposalStatusColor(proposal.status))}>
							{proposal.status}
						</Badge>
						<Badge
							variant="outline"
							className={cn("capitalize font-medium", proposalAppliedTypeColor(proposal.type as string))}>
							{proposal.type}
						</Badge>
						<Badge
							variant="outline"
							className={cn("capitalize font-medium", projectTypeColor(proposal.projectType as string))}>
							{proposal.projectType}
						</Badge>
						{proposal.projectArea && (
							<Badge variant="outline" className="font-medium bg-slate-50 dark:bg-slate-900">
								{proposal.projectArea}
							</Badge>
						)}
					</div>
				</div>

				{/* Body */}
				<div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
					{/* Main */}
					<div className="lg:col-span-2 space-y-8">
						<section>
							<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Description
							</h2>
							<p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
								{proposal.description}
							</p>
						</section>

						<hr className="border-border" />

						<section>
							<h2 className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
								Proposal Document
							</h2>
							<div className="flex items-center gap-4 rounded-xl border border-dashed p-4">
								<div className="rounded-lg bg-primary-100 p-3 shrink-0">
									<DocumentTextIcon className="size-6 text-primary-600" />
								</div>
								<div className="flex-1 min-w-0">
									<p className="text-sm font-medium">proposal.pdf</p>
									<p className="text-xs text-muted-foreground">
										Submitted at {formatDate(proposal.submittedAt)}
									</p>
								</div>
								<DownloadFile fileUrl={proposal.file} />
							</div>
						</section>

						<hr className="border-border" />

						<section>
							<CommentBox
								proposalStatus={proposal.status}
								proposalId={Number(proposal.id)}
								canComment={isIC || authUser.id === proposal.supervisor.id}
							/>
						</section>
					</div>

					{/* Sidebar */}
					<div className="lg:col-span-1">
						<div className="sticky top-24 rounded-xl border bg-card divide-y divide-border overflow-hidden">
							{/* Supervisor */}
							<div className="p-4">
								<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
									Supervisor
								</p>
								<div className="flex items-center gap-3">
									<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100">
										<ShieldCheck className="size-4 text-primary-600" />
									</div>
									<div className="min-w-0">
										<p className="text-sm font-medium truncate">
											{proposal.supervisor.name}
										</p>
										<p className="text-xs text-muted-foreground truncate">
											{proposal.supervisor.email}
										</p>
									</div>
								</div>
							</div>

							{/* Applied students */}
							{proposal.canViewApplicants && (
								<div className="p-4">
									<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
										<IconUsersGroup className="size-4 text-primary-600" />
										Applied Students
										<span className="ml-auto font-mono text-[10px] text-muted-foreground">
											{proposal.appliedStudents.length}/{proposal.maxStudents}
										</span>
									</p>

									{proposal.appliedStudents.length === 0 ? (
										<p className="text-xs text-muted-foreground italic">
											No pending applications yet.
										</p>
									) : (
										<div className="space-y-3">
											{proposal.appliedStudents.map((student) => {
												const isAccepting =
													acceptApplicantMutation.isPending &&
													acceptApplicantMutation.variables === student.id;
												const isRejecting =
													rejectApplicantMutation.isPending &&
													rejectApplicantMutation.variables === student.id;

												return (
													<div key={student.id} className="flex items-center gap-3">
														<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
															<UserIcon className="size-3.5 text-muted-foreground" />
														</div>
														<div className="flex-1 min-w-0">
															<p className="text-sm font-medium truncate">{student.name}</p>
															<p className="text-xs text-muted-foreground truncate">{student.email}</p>
														</div>
														{proposal.canManageApplicants && (
															<div className="flex gap-1 shrink-0">
																<Button
																	size="sm"
																	variant="ghost"
																	disabled={isAccepting || isRejecting}
																	onClick={() => rejectApplicantMutation.mutate(student.id)}
																	className="h-7 w-7 p-0 text-red-500 hover:bg-red-50 hover:text-red-700">
																	<HandThumbDownIcon className="size-3.5 stroke-2" />
																</Button>
																<Button
																	size="sm"
																	variant="ghost"
																	disabled={isAccepting || isRejecting}
																	onClick={() => acceptApplicantMutation.mutate(student.id)}
																	className="h-7 w-7 p-0 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700">
																	<HandThumbUpIcon className="size-3.5 stroke-2" />
																</Button>
															</div>
														)}
													</div>
												);
											})}
										</div>
									)}
								</div>
							)}

							{/* IC review */}
							{canApproveOrRejectProposal && (
								<div className="p-4">
									<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
										<CheckBadgeIcon className="size-4 text-primary-600" />
										Review
									</p>
									<div className="flex gap-2">
										<Button
											onClick={() => rejectMutation.mutate()} disabled={rejectMutation.isPending}
											variant="outline"
											size="sm"
											className="flex-1 gap-1.5 text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
											<HandThumbDownIcon className="size-3.5 stroke-2" />
											Reject
										</Button>
										<Button
											onClick={() => approveMutation.mutate()} disabled={approveMutation.isPending}
											size="sm"
											className="flex-1 gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
											<HandThumbUpIcon className="size-3.5 stroke-2" />
											Approve
										</Button>
									</div>
								</div>
							)}
						</div>
					</div>
				</div>
		</>
	);
}

