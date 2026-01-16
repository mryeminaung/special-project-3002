import { useNavigate, useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn, HasRole, STATUS_COLOR } from "@/lib/utils";

import {
	ArrowLeftIcon,
	CalendarIcon,
	CheckBadgeIcon,
	CodeBracketIcon,
	DocumentTextIcon,
	EnvelopeIcon,
	HandThumbDownIcon,
	HandThumbUpIcon,
	UserIcon,
} from "@heroicons/react/24/outline";

import { Download, Loader2, ShieldCheck } from "lucide-react";

import api from "@/api/api";
import type { ProjectProposal } from "@/types";
import { IconUsersGroup } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import ApprovalModal from "./components/approval-modal";
import CommentBox from "./components/comment-box";

export default function ProposalDetail() {
	const navigate = useNavigate();
	const { slug } = useParams();
	const isIC = HasRole("IC");
	const [proposal, setProposal] = useState<ProjectProposal | null>();
	const [loading, setLoading] = useState(true);
	const [showApprovalModal, setShowApprovalModal] = useState(false);
	const [isApproving, setIsApproving] = useState(false);

	const fetchProposalDetail = async () => {
		setLoading(true);
		try {
			const res = await api.get(`/proposals/${slug}/detail`);
			if (res.status === 200) {
				setLoading(false);
				setProposal(res.data);
			} else if (res.status === 404) {
				setLoading(false);
				setProposal(null);
			}
		} catch (err) {
			console.error("Error fetching proposal:", err);
			setProposal(null);
		}
	};

	useEffect(() => {
		fetchProposalDetail();
	}, [slug]);

	const handleApprove = async () => {
		setShowApprovalModal(true);
		setIsApproving(true);
		try {
			const res = await api.post(`/proposals/${proposal?.id}/approve`);
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
		const res = await api.post(`/proposals/${proposal?.id}/reject`);
		if (res.status === 200) {
			fetchProposalDetail();
		}
	};

	if (loading)
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
			<ApprovalModal
				isOpen={showApprovalModal}
				isLoading={isApproving}
				onComplete={handleApprovalModalComplete}
			/>
			<div className="mx-auto max-w-7xl">
				<Button
					onClick={() => navigate(-1)}
					variant="ghost"
					className="mb-4 flex bg-primary-600 hover:bg-primary-500 text-white hover:cursor-pointer hover:text-white items-center gap-2">
					<ArrowLeftIcon className="h-4 w-4" />
					Back to Proposals
				</Button>

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
							<CardContent className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
								<div>
									<h1 className="text-2xl font-bold ">{proposal.title}</h1>
									<div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
										<Badge
											className={cn(
												STATUS_COLOR(proposal.status),
												"font-mono capitalize px-3 rounded-md",
											)}>
											{proposal.status}
										</Badge>
										<span className="flex items-center gap-1.5">
											<CalendarIcon className="h-4 w-4" />
											Submitted on {proposal.submitted_at}
										</span>
									</div>
								</div>
							</CardContent>
						</Card>

						<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
							<div className="space-y-6 lg:col-span-2">
								<Card className="border-gray-200 shadow-sm">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<CodeBracketIcon className="size-5 stroke-2 text-primary-600" />
											Project Description
										</CardTitle>
									</CardHeader>
									<CardContent className="space-y-3">
										{proposal.description.split("\n").map((line, i) => (
											<p key={i}>{line}</p>
										))}
									</CardContent>
								</Card>

								<Card className="border-gray-200 shadow-sm">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-lg">
											<DocumentTextIcon className="size-5 stroke-2 text-primary-600" />
											Proposal Document
										</CardTitle>
									</CardHeader>
									<CardContent>
										<div className="flex flex-col gap-4 rounded-lg border border-dashed border-gray-300  p-4 sm:flex-row sm:items-center sm:justify-between">
											<div className="flex items-center gap-4">
												<div className="rounded-lg bg-primary-100 p-3">
													<DocumentTextIcon className="size-7 text-primary-600" />
												</div>
												<div>
													<p className="font-medium ">Proposal.pdf</p>
													<p className="text-sm  ">
														Submitted on {proposal.submitted_at}
													</p>
												</div>
											</div>

											<Button
												asChild
												className="gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500">
												<a
													href={proposal.file}
													target="_blank"
													rel="noopener noreferrer"
													download>
													<Download className="h-4 w-4" />
													Download
												</a>
											</Button>
										</div>
									</CardContent>
								</Card>
								<CommentBox
									proposalStatus={proposal.status}
									proposalId={Number(proposal.id)}
								/>
							</div>

							<div className="space-y-6">
								<Card className="border-gray-200 shadow-sm">
									<CardHeader>
										<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
											<ShieldCheck className="size-5 stroke-2 text-primary-600" />
											Supervisor
										</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="font-semibold">{proposal.supervisor.name}</p>
										<p className="flex items-center gap-1.5 text-sm">
											<EnvelopeIcon className="h-3.5 w-3.5" />
											{proposal.supervisor.email}
										</p>
									</CardContent>
								</Card>

								{/* submiiter */}
								<div className="space-y-6">
									<Card className="border-gray-200 shadow-sm">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
												<UserIcon className="size-5 stroke-2 text-primary-600" />
												Submitted by
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-1">
											<p className="font-semibold">
												{proposal.submittedBy.name}
											</p>
											<p className="flex items-center gap-1.5 text-sm">
												<EnvelopeIcon className="h-3.5 w-3.5" />
												{proposal.submittedBy.email}
											</p>
										</CardContent>
									</Card>

									{/* members */}
									<Card className="border-gray-200 shadow-sm">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
												<IconUsersGroup className="size-5 stroke-2 text-primary-600" />
												Team Members
												<Badge className="bg-primary-500 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs text-center">
													{proposal?.members.length}
												</Badge>
											</CardTitle>
										</CardHeader>
										<CardContent className="space-y-3">
											{proposal.members.map((student) => (
												<div key={student.id}>
													<p className="font-medium">{student.name}</p>
													<p className="flex items-center gap-1.5 truncate text-sm  ">
														<EnvelopeIcon className="h-3.5 w-3.5" />
														{student.email}
													</p>
												</div>
											))}
										</CardContent>
									</Card>

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
