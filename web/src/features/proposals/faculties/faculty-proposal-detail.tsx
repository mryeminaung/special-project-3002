import { useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { type ProposalStatus } from "@/lib/utils";

import {
	CalendarIcon,
	CheckBadgeIcon,
	EnvelopeIcon,
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";

import { Loader2 } from "lucide-react";

import api from "@/api/api";
import { IconUsersGroup } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast, { Toaster } from "react-hot-toast";

import NavigateTo from "@/components/common/navigate-to";
import PageWrapper from "@/components/common/page-wrapper";
import DescriptionCard from "@/components/description-card";
import ProposalDocument from "@/components/proposal-document";
import StatusCard from "@/components/status-card";
import SupervisorCard from "@/components/supervisor-card";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useState } from "react";
import ApprovalModal from "../components/approval-modal";
import CommentBox from "../components/comment-box";

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
	const [showApprovalModal, setShowApprovalModal] = useState(false);
	const [isApproving, setIsApproving] = useState(false);

	const fetchProposalDetail = async () => {
		const res = await api.get(`/proposals/${slug}`);
		return res.data;
	};

	const { data: proposalDetail, isLoading } = useQuery({
		queryKey: ["proposalDetail", slug],
		queryFn: fetchProposalDetail,
	});

	const proposal: ProposalDetail = proposalDetail?.data;
	const canApproveOrRejectProposal = isIC && proposal?.status === "pending";

	const acceptApplicantMutation = useMutation({
		mutationFn: async (studentId: number) => {
			const res = await api.post(
				`/proposals/${proposal?.slug}/applications/${studentId}/accept`,
			);
			return res.data;
		},
		onSuccess: async () => {
			toast.success("Student accepted.");
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["proposalDetail", slug] }),
				queryClient.invalidateQueries({ queryKey: ["facultyProposals"] }),
			]);
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message ?? "Failed to accept student.",
			);
		},
	});

	const rejectApplicantMutation = useMutation({
		mutationFn: async (studentId: number) => {
			const res = await api.post(
				`/proposals/${proposal?.slug}/applications/${studentId}/reject`,
			);
			return res.data;
		},
		onSuccess: async () => {
			toast.success("Student rejected.");
			await Promise.all([
				queryClient.invalidateQueries({ queryKey: ["proposalDetail", slug] }),
				queryClient.invalidateQueries({ queryKey: ["facultyProposals"] }),
			]);
		},
		onError: (error: any) => {
			toast.error(
				error?.response?.data?.message ?? "Failed to reject student.",
			);
		},
	});

	const handleProposalApprove = async () => {
		setShowApprovalModal(true);
		setIsApproving(true);
		try {
			const res = await api.post(`/proposals/${proposal?.slug}/approve`);
			if (res.status === 200) {
				setIsApproving(false);
			}
		} catch (error) {
			setShowApprovalModal(false);
			setIsApproving(false);
			console.error("Failed to approve proposal:", error);
		}
	};

	const handleApprovalModalComplete = () => {
		setShowApprovalModal(false);
		queryClient.invalidateQueries({ queryKey: ["proposalDetail", slug] });
	};

	const handleProposalReject = async () => {
		const res = await api.post(`/proposals/${proposal?.slug}/reject`);
		if (res.status === 200) {
			toast.success("Proposal Rejected!");
			queryClient.invalidateQueries({ queryKey: ["proposalDetail", slug] });
		}
	};

	if (isLoading)
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<Loader2 className="h-8 w-8 animate-spin text-primary-600" />
				<div className="mt-3 text-sm text-muted-foreground">
					Loading proposal detail information...
				</div>
			</div>
		);

	return (
		<>
			<Toaster />
			<ApprovalModal
				isOpen={showApprovalModal}
				isLoading={isApproving}
				onComplete={handleApprovalModalComplete}
			/>
			<PageWrapper>
				{isSupervisor && isFaculty ? (
					<NavigateTo
						to="/project-proposals/browse"
						label="Back To Proposals"
					/>
				) : (
					<NavigateTo
						to="/project-proposals"
						label="Back To Proposals"
					/>
				)}

				{!proposal ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Loader2 className="h-8 w-8 animate-spin text-primary-600" />
						<div className="mt-3 text-sm text-muted-foreground">
							Loading proposal detail information...
						</div>
					</div>
				) : (
					<>
						<Card className="mb-6 border-gray-200 shadow-sm">
							<CardContent className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
								<div className="space-y-2">
									<h1 className="text-2xl font-bold ">
										Title: {proposal.title}
									</h1>
									<span className="flex items-center gap-1.5 text-sm">
										<CalendarIcon className="h-4 w-4" />
										Submitted on {proposal.submittedAt}
									</span>
									<div className="mt-2 flex flex-wrap items-center gap-5 text-sm">
										<StatusCard
											label="Proposal Status:"
											status={proposal.status}
										/>
										<StatusCard
											label="Applied Type:"
											status={proposal.type}
										/>
										<StatusCard
											label="Project Type:"
											status={proposal.projectType}
										/>
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
							<div className="space-y-6 lg:col-span-3">
								<DescriptionCard
									label="Proposal"
									description={proposal.description}
								/>
								<ProposalDocument
									submittedAt={proposal.submittedAt}
									file={proposal.file}
								/>
								<CommentBox
									proposalStatus={proposal.status}
									proposalId={Number(proposal.id)}
								/>
							</div>

							<div className="space-y-6 lg:col-span-2">
								<SupervisorCard
									label="Supervisor"
									name={proposal.supervisor.name}
									email={proposal.supervisor.email}
								/>

								{proposal.canViewApplicants && (
									<Card className="border-gray-200 shadow-sm">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
												<IconUsersGroup className="size-5 stroke-2 text-primary-600" />
												Applied Students
												<Badge className="h-5 min-w-5 rounded-full bg-primary-500 px-1 text-center font-mono text-xs tabular-nums">
													{proposal.appliedStudents.length}/
													{proposal.maxStudents}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											{proposal.appliedStudents.length === 0 && (
												<span className="text-sm text-muted-foreground">
													No pending student applications.
												</span>
											)}
											{proposal.appliedStudents.map((student) => {
												const isAccepting =
													acceptApplicantMutation.isPending &&
													acceptApplicantMutation.variables === student.id;
												const isRejecting =
													rejectApplicantMutation.isPending &&
													rejectApplicantMutation.variables === student.id;

												return (
													<div
														key={student.id}
														className="flex items-center justify-between">
														<div>
															<p className="font-medium">{student.name}</p>
															<p className="flex items-center gap-1.5 truncate text-sm">
																<EnvelopeIcon className="h-3.5 w-3.5" />
																{student.email}
															</p>
														</div>
														{proposal.canManageApplicants && (
															<div className="flex flex-col-reverse items-end gap-2 sm:flex-row">
																<Button
																	disabled={isAccepting || isRejecting}
																	onClick={() =>
																		rejectApplicantMutation.mutate(student.id)
																	}
																	className="flex-1 gap-2 bg-red-300 text-[12px] font-semibold text-red-900 hover:cursor-pointer hover:bg-red-500 hover:text-white">
																	<HandThumbDownIcon className="size-3 stroke-2" />
																	Reject
																</Button>
																<Button
																	disabled={isAccepting || isRejecting}
																	onClick={() =>
																		acceptApplicantMutation.mutate(student.id)
																	}
																	className="flex-1 gap-2 bg-green-300 text-[12px] font-semibold text-green-900 hover:cursor-pointer hover:bg-green-500 hover:text-white">
																	<HandThumbUpIcon className="size-3 stroke-2" />
																	Accept
																</Button>
															</div>
														)}
													</div>
												);
											})}
										</CardContent>
									</Card>
								)}

								{canApproveOrRejectProposal && (
									<Card className="border-gray-200 shadow-sm">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
												<CheckBadgeIcon className="size-5 stroke-2 text-primary-600" />
												Project Approval
											</CardTitle>
										</CardHeader>
										<CardContent className="flex flex-col-reverse gap-2 sm:flex-row">
											<Button
												onClick={handleProposalReject}
												className="flex-1 gap-2 bg-red-300 font-semibold text-red-900 hover:cursor-pointer hover:bg-red-500 hover:text-white">
												<HandThumbDownIcon className="size-4 stroke-2" />
												Reject
											</Button>
											<Button
												onClick={handleProposalApprove}
												className="flex-1 gap-2 bg-green-300 font-semibold text-green-900 hover:cursor-pointer hover:bg-green-500 hover:text-white">
												<HandThumbUpIcon className="size-4 stroke-2" />
												Approve
											</Button>
										</CardContent>
									</Card>
								)}
							</div>
						</div>
					</>
				)}
			</PageWrapper>
		</>
	);
}
