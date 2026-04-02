import { useNavigate, useParams } from "react-router";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { HasRole } from "@/lib/utils";

import {
	CheckBadgeIcon,
	DocumentTextIcon,
	HandThumbDownIcon,
	HandThumbUpIcon,
} from "@heroicons/react/24/outline";

import { CalendarIcon, Loader2, TrashIcon } from "lucide-react";

import api from "@/api/api";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";

import DownloadFile from "@/components/download-file";
import NavigateTo from "@/components/navigate-to";
import StatusCard from "@/components/status-card";
import SubmitterCard from "@/components/submitter-card";
import SupervisorCard from "@/components/supervisor-card";
import TeamMembers from "@/components/team-members";
import { useAuthStore } from "@/stores/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import ApprovalModal from "../../components/approval-modal";
import CommentBox from "../../components/comment-box";
import type { ProposalDetail } from "../students.type";

export default function StudentProposalDetailPage() {
	const navigate = useNavigate();
	const { slug } = useParams();
	const isIC = HasRole("IC");
	const isStudent = HasRole("Student");
	const authUser = useAuthStore((state) => state.authUser);
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

	const handleApprove = async () => {
		setShowApprovalModal(true);
		setIsApproving(true);
		try {
			const res = await api.post(`/proposals/${proposal?.slug}/approve`);
			if (res.status === 200) {
				setIsApproving(false);
				// Modal will auto-close after showing checkmark
			}
		} catch (error) {
			setShowApprovalModal(false);
			setIsApproving(false);
			console.error("Failed to approve proposal:", error);
		}
	};

	const handleApprovalModalComplete = () => {
		setShowApprovalModal(false);
		fetchProposalDetail();
	};

	const handleReject = async () => {
		const res = await api.post(`/proposals/${proposal?.slug}/reject`);
		if (res.status === 200) {
			toast.success("Proposal Rejected!");
			fetchProposalDetail();
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
			<div className="mx-auto max-w-7xl">
				<NavigateTo
					to="/project-proposals"
					label="Back to Proposals"
				/>

				{!proposal ? (
					<div className="flex flex-col items-center justify-center py-20">
						<Loader2 className="h-8 w-8 animate-spin text-primary-600" />
						<div className="mt-3 text-sm text-muted-foreground">
							Loading proposal detail information...
						</div>
					</div>
				) : (
					<>
						<Card className="mb-4 border-gray-200 shadow-sm">
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
								{proposal.status === "pending" &&
									isStudent &&
									authUser.id === proposal?.submittedBy.id && (
										<div className="space-x-3">
											<Button
												size={"sm"}
												className="bg-yellow-300 font-semibold text-yellow-900 hover:bg-yellow-500 hover:text-white">
												<PencilSquareIcon />
												<span>Edit</span>
											</Button>
											<Button
												size={"sm"}
												className="bg-red-300 font-semibold text-red-900 hover:bg-red-500 hover:text-white">
												<TrashIcon />
												<span>Delete</span>
											</Button>
										</div>
									)}
							</CardContent>
						</Card>

						<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
							<div className="space-y-4 lg:col-span-2">
								<Card className="border-gray-200 shadow-sm">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											Proposal Description
										</CardTitle>
									</CardHeader>
									<CardContent>{proposal.description}</CardContent>
								</Card>

								<Card className="border-gray-200 shadow-sm">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											Proposal Document
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col sm:flex-row items-center justify-between gap-4 ">
											<div className="flex w-full items-center gap-4">
												<div className="rounded-lg bg-primary-100 p-3">
													<DocumentTextIcon className="size-7 text-primary-600" />
												</div>
												<div>
													<p className="font-medium ">proposal</p>
													<p className="text-sm  ">
														Submitted on {proposal.submittedAt}
													</p>
												</div>
											</div>

											<DownloadFile fileUrl={proposal.file} />
										</div>
									</CardContent>
								</Card>
								<CommentBox
									proposalStatus={proposal.status}
									proposalId={Number(proposal.id)}
								/>
							</div>

							<div className="space-y-4">
								<SupervisorCard
									label="Supervisor"
									name={proposal.supervisor.name}
									email={proposal.supervisor.email}
								/>

								{/* submiiter */}
								<div className="space-y-6">
									<SubmitterCard
										label="Submitted by"
										name={proposal.submittedBy.name}
										email={proposal.submittedBy.email}
									/>

									{/* members */}
									<TeamMembers
										label="Team Members"
										members={proposal?.members}
									/>

									{isIC && proposal.status === "pending" && (
										<Card className="border-gray-200 shadow-sm">
											<CardHeader>
												<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
													<CheckBadgeIcon className="size-5 stroke-2 text-primary-600" />
													Project Approval
												</CardTitle>
											</CardHeader>
											<CardContent className="flex flex-col-reverse sm:flex-row gap-2">
												<Button
													onClick={handleReject}
													className="flex-1 gap-2 bg-red-300 font-semibold text-red-900 hover:cursor-pointer hover:bg-red-500 hover:text-white">
													<HandThumbDownIcon className="size-4 stroke-2" />
													Reject
												</Button>
												<Button
													onClick={handleApprove}
													className="flex-1 gap-2 bg-green-300 font-semibold text-green-900 hover:cursor-pointer hover:bg-green-500 hover:text-white">
													<HandThumbUpIcon className="size-4 stroke-2" />
													Approve
												</Button>
											</CardContent>
										</Card>
									)}
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
}
