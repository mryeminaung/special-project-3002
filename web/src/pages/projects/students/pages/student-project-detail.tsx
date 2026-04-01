import { useParams } from "react-router";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { cn, HasRole, PROJECT_STATUS_COLOR } from "@/lib/utils";

import {
	CalendarIcon,
	EnvelopeIcon,
	UserIcon,
} from "@heroicons/react/24/outline";

import { Download, FileText, Loader2, ShieldCheck } from "lucide-react";

import api from "@/api/api";
import { IconUsersGroup } from "@tabler/icons-react";

import NavigateTo from "@/components/navigate-to";
import PageWrapper from "@/components/page-wrapper";
import { useQuery } from "@tanstack/react-query";
import ReportStatus from "../components/report-status";
import SeminarCard from "../components/seminar-card";
import SeminarDeadline from "../components/seminar-deadline";
import { UploadReport } from "../components/upload-report";

export default function StudentProjectDetailPage() {
	const { slug } = useParams();
	const isStudent = HasRole("Student");
	const isSupervisor = HasRole("Supervisor");

	const fetchProjectDetail = async () => {
		const res = await api.get(`/projects/${slug}`);
		return res.data;
	};

	const { data: projectDetail, isLoading } = useQuery({
		queryKey: ["projectDetail", slug],
		queryFn: fetchProjectDetail,
	});
	const project = projectDetail?.data;

	if (isLoading) {
		return (
			<div className="flex flex-col items-center justify-center py-20">
				<Loader2 className="h-8 w-8 animate-spin text-primary-600" />
				<div className="mt-3 text-sm text-muted-foreground">
					Loading project detail information...
				</div>
			</div>
		);
	}

	return (
		<PageWrapper>
			<NavigateTo
				to={"/assigned-projects"}
				label="Back to projects"
			/>

			<Card className="mb-4 border-gray-200 shadow-sm">
				<CardContent className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
					<div>
						<h1 className="text-2xl font-bold ">{project.title}</h1>
						<div className="mt-2 flex flex-wrap items-center gap-3 text-sm">
							<Badge className={cn("font-mono capitalize px-3 rounded-md")}>
								{project.status}
							</Badge>
							<Badge
								className={cn(
									PROJECT_STATUS_COLOR(project.status),
									"font-mono capitalize px-3 rounded-md",
								)}>
								{project.type}
							</Badge>
							<Badge className={cn("font-mono capitalize px-3 rounded-md")}>
								{project.projectType}
							</Badge>
							<span className="flex items-center gap-1.5">
								<CalendarIcon className="h-4 w-4" />
								Started on {project.startedAt}
							</span>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<Card className="border-gray-200 shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg">
								Project Description
							</CardTitle>
						</CardHeader>
						<CardContent>{project.description}</CardContent>
					</Card>

					<Card className="border-gray-200 shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-lg">
								Project Document
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
								<div className="flex w-full items-center gap-4">
									<div className="rounded-lg bg-primary-100 p-3">
										<FileText className="size-5 text-primary-600" />
									</div>
									<div>
										<p className="font-medium ">proposal</p>
										<p className="text-sm  ">0.5 MB</p>
									</div>
								</div>

								<Button
									asChild
									className="w-full sm:w-fit gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500 hover:cursor-pointer">
									<a
										href={project.file}
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

					{/* seminar deadline */}
					{isSupervisor && (
						<SeminarDeadline
							slug={project.slug}
							midSeminarDeadline={project.midSeminarDeadline}
							finalSeminarDeadline={project.finalSeminarDeadline}
						/>
					)}

					{isStudent && (
						<>
							<UploadReport
								progressStatus={project.progressStatus}
								slug={project.slug}
								midReportUrl={project.midReportUrl}
								finalReportUrl={project.finalReportUrl}
								label="Mid-term Report"
								type="mid"
							/>

							<UploadReport
								progressStatus={project.progressStatus}
								slug={project.slug}
								midReportUrl={project.midReportUrl}
								finalReportUrl={project.finalReportUrl}
								label="Final Report"
								type="final"
							/>
						</>
					)}

					{isSupervisor && (
						<ReportStatus
							slug={project.slug}
							progressStatus={project.progressStatus}
							midReportUrl={project.midReportUrl}
							finalReportUrl={project.finalReportUrl}
						/>
					)}
				</div>

				<div className="space-y-4">
					<Card className="border-gray-200 shadow-sm">
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
								<ShieldCheck className="size-5 stroke-2 text-primary-600" />
								Supervisor
							</CardTitle>
						</CardHeader>
						<CardContent>
							<p className="font-semibold">{project.supervisor.name}</p>
							<p className="flex items-center gap-1.5 text-sm">
								<EnvelopeIcon className="h-3.5 w-3.5" />
								{project.supervisor.email}
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
								<p className="font-semibold">{project.submittedBy.name}</p>
								<p className="flex items-center gap-1.5 text-sm">
									<EnvelopeIcon className="h-3.5 w-3.5" />
									{project.submittedBy.email}
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
										{project?.members.length}
									</Badge>
								</CardTitle>
							</CardHeader>
							<CardContent className="space-y-3">
								{project.members.map((student: any) => (
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

						{/* seminar deadline */}
						<SeminarCard
							slug={project.slug}
							midSeminarDeadline={project.midSeminarDeadline}
							finalSeminarDeadline={project.finalSeminarDeadline}
							progressStatus={project.progressStatus}
						/>
					</div>
				</div>
			</div>
		</PageWrapper>
	);
}
