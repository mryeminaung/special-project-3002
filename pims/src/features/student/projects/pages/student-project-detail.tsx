import { useParams } from "react-router";

import { Card, CardContent } from "@/components/ui/card";

import { CalendarIcon } from "@heroicons/react/24/outline";


import api from "@/api/api";

import NavigateTo from "@/components/common/navigate-to";
import DescriptionCard from "@/components/description-card";
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
			<div className="space-y-4 animate-pulse">
				<div className="h-5 w-36 rounded bg-muted" />
				<div className="rounded-lg border bg-card p-5 space-y-3">
					<div className="h-6 w-2/3 rounded bg-muted" />
					<div className="h-4 w-40 rounded bg-muted" />
					<div className="flex gap-4">
						{[...Array(3)].map((_, i) => <div key={i} className="h-5 w-28 rounded bg-muted" />)}
					</div>
				</div>
				<div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
					<div className="lg:col-span-2 space-y-4">
						{[...Array(3)].map((_, i) => <div key={i} className="h-32 rounded-lg bg-muted" />)}
					</div>
					<div className="space-y-4">
						{[...Array(3)].map((_, i) => <div key={i} className="h-24 rounded-lg bg-muted" />)}
					</div>
				</div>
			</div>
		);
	}

	return (
		<>
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
		</>
	);
}
