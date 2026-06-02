import { useParams } from "react-router";

import { Card, CardContent } from "@/components/ui/card";

import { CalendarIcon } from "@heroicons/react/24/outline";

import { Loader2 } from "lucide-react";

import api from "@/api/api";

import DescriptionCard from "@/components/description-card";
import NavigateTo from "@/components/navigate-to";
import PageWrapper from "@/components/page-wrapper";
import ProposalDocument from "@/components/proposal-document";
import StatusCard from "@/components/status-card";
import SubmitterCard from "@/components/submitter-card";
import SupervisorCard from "@/components/supervisor-card";
import TeamMembers from "@/components/team-members";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import ReportStatus from "../components/report-status";
import SeminarCard from "../components/seminar-card";
import SeminarDeadline from "../components/seminar-deadline";
import { UploadReport } from "../components/upload-report";

export default function StudentProjectDetailPage() {
	const { slug } = useParams();
	const { isStudent, isSupervisor } = useRoleChecker();

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
					<div className="space-y-2">
						<h1 className="text-2xl font-bold ">{project.title}</h1>
						<span className="flex items-center gap-1.5 text-sm">
							<CalendarIcon className="h-4 w-4" />
							Started on {project.startedAt}
						</span>
						<div className="mt-2 flex flex-wrap items-center gap-5 text-sm">
							<StatusCard
								label="Proposal Status:"
								status={project.status}
							/>
							<StatusCard
								label="Applied Type:"
								status={project.type}
							/>
							<StatusCard
								label="Project Type:"
								status={project.projectType}
							/>
						</div>
					</div>
				</CardContent>
			</Card>

			<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
				<div className="space-y-4 lg:col-span-2">
					<DescriptionCard
						label="Project"
						description={project.description}
					/>

					<ProposalDocument
						submittedAt={project.submittedAt}
						file={project.file}
					/>

					{/* seminar deadline */}
					{isSupervisor && (
						<SeminarDeadline
							slug={project.slug}
							midSeminarDeadline={project.midSeminarDeadline}
							finalSeminarDeadline={project.finalSeminarDeadline}
							progressStatus={project.progressStatus}
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
					<SupervisorCard
						label="Supervisor"
						name={project.supervisor.name}
						email={project.supervisor.email}
					/>

					{/* submiiter */}
					<div className="space-y-6">
						<SubmitterCard
							label="Submitted By"
							name={project.submittedBy.name}
							email={project.submittedBy.email}
						/>

						{/* members */}
						<TeamMembers
							label="Team Members"
							members={project?.members}
						/>

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
