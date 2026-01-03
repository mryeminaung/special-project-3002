import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
	CalendarIcon,
	CodeBracketIcon,
	DocumentTextIcon,
	EnvelopeIcon,
	UserIcon,
} from "@heroicons/react/24/outline";

import { Download, Edit, Shield, Trash } from "lucide-react";

import api from "@/api/api";
import RootLayout from "@/layouts/RootLayout";
import type { ProjectProposal } from "@/types";
import { IconUsersGroup } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import CommentBox from "../components/comment-box";

export default function MyProposalsPage() {
	const navitate = useNavigate();
	const location = useLocation();
	const [proposal, setProposal] = useState<ProjectProposal | null>();

	const fetchProposalDetail = async () => {
		const res = await api.get(`/proposals/my`);
		console.log(res.data);
		// setProposal(res.data);
	};

	useEffect(() => {
		fetchProposalDetail();
	}, []);

	const getStatusColor = (status: string) => {
		switch (status) {
			case "approved":
				return "bg-green-100 text-green-800 border-green-200";
			case "rejected":
				return "bg-red-100 text-red-800 border-red-200";
			default:
				return "bg-yellow-100 text-yellow-800 border-yellow-200";
		}
	};

	const handleDelete = async (projectId: number) => {
		const res = await api.delete(`/proposals/${projectId}/delete`);
		console.log(res.data);
	};

	return (
		<RootLayout>
			<div className="min-h-screen">
				<div className="mx-auto max-w-7xl px-4">
					{!proposal ? (
						<Card className="border-gray-200 shadow-sm">
							<CardContent className="py-12 text-center">
								<p className="text-gray-500">
									No proposal data found. Please go back and select a proposal.
								</p>
							</CardContent>
						</Card>
					) : (
						<>
							<Card className="mb-6 border-gray-200 shadow-sm">
								<CardContent className="flex  flex-col">
									<div className="flex items-baseline justify-between">
										<h1 className="text-2xl font-bold text-gray-900">
											{proposal.title}
										</h1>

										{proposal.status === "pending" && (
											<div className="flex items-center gap-x-3">
												<Button
													onClick={() =>
														navitate(
															`/project-proposals/my-proposal/${proposal.id}/edit`,
														)
													}
													className="flex-1 gap-2 hover:cursor-pointer bg-yellow-300 font-semibold text-yellow-900 hover:bg-yellow-500 hover:text-white">
													<Edit className="size-4 stroke-2" />
													Edit
												</Button>
												<Button
													onClick={() => handleDelete(3)}
													className="flex-1 gap-2 hover:cursor-pointer bg-red-300 font-semibold text-red-900 hover:bg-red-500 hover:text-white">
													<Trash className="size-4 stroke-2" />
													Delete
												</Button>
											</div>
										)}
									</div>

									<div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-gray-500">
										<Badge className={getStatusColor(proposal.status)}>
											<span className="font-mono">
												{proposal.status.toUpperCase()}
											</span>
										</Badge>
										<span className="flex items-center gap-1.5">
											<CalendarIcon className="h-4 w-4" />
											Submitted on {proposal.submitted_at}
										</span>
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
										<CardContent className="space-y-3 text-gray-700">
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
											<div className="flex flex-col gap-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4 sm:flex-row sm:items-center sm:justify-between">
												<div className="flex items-center gap-4">
													<div className="rounded-lg bg-primary-100 p-3">
														<DocumentTextIcon className="size-7 text-primary-600" />
													</div>
													<div>
														<p className="font-medium text-gray-900">
															Proposal.pdf
														</p>
														<p className="text-sm text-gray-500">
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
									<CommentBox />
								</div>

								<div className="space-y-6">
									<Card className="border-gray-200 shadow-sm">
										<CardHeader>
											<CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-widest">
												<Shield className="size-5 stroke-2 text-primary-600" />
												Supervisor
											</CardTitle>
										</CardHeader>
										<CardContent>
											<p className="font-semibold">
												{proposal.supervisor.name}
											</p>
											<p className="flex items-center gap-1.5 text-sm text-gray-600">
												<EnvelopeIcon className="h-3.5 w-3.5" />
												{proposal.supervisor.email}
											</p>
										</CardContent>
									</Card>

									{/* submiiter */}
									<div className="space-y-6">
										<Card className="border-gray-200 shadow-sm">
											<CardHeader>
												<CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-widest">
													<UserIcon className="size-5 stroke-2 text-primary-600" />
													Submitted by
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-1">
												<p className="font-semibold">
													{proposal.submittedBy.name}
												</p>
												<p className="flex items-center gap-1.5 text-sm text-gray-600">
													<EnvelopeIcon className="h-3.5 w-3.5" />
													{proposal.submittedBy.email}
												</p>
											</CardContent>
										</Card>

										{/* members */}
										<Card className="border-gray-200 shadow-sm">
											<CardHeader>
												<CardTitle className="flex items-center gap-2 text-sm font-bold text-slate-600 uppercase tracking-widest">
													<IconUsersGroup className="size-5 stroke-2 text-primary-600" />
													Team Members
													<Badge className="bg-primary-500 h-5 min-w-5 rounded-full px-1 font-mono tabular-nums text-xs text-center">
														{proposal?.students.length}
													</Badge>
												</CardTitle>
											</CardHeader>
											<CardContent className="space-y-3">
												{proposal.students.map((student) => (
													<div key={student.id}>
														<p className="font-medium">{student.name}</p>
														<p className="flex items-center gap-1.5 truncate text-sm text-gray-500">
															<EnvelopeIcon className="h-3.5 w-3.5" />
															{student.email}
														</p>
													</div>
												))}
											</CardContent>
										</Card>
									</div>
								</div>
							</div>
						</>
					)}
				</div>
			</div>
		</RootLayout>
	);
}
