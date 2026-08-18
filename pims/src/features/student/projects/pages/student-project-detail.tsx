import { useParams, useNavigate } from "react-router";
import GradePanel from "@/features/projects/components/grade-panel";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ShieldCheck, UserIcon } from "lucide-react";
import {
	IconCalendar,
	IconCalendarCheck,
} from "@tabler/icons-react";
import { getStudentProject } from "../services/student-project.service";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import { cn } from "@/lib/utils";
import { projectAreaColor, projectStatusColor, projectTypeColor, proposalAppliedTypeColor } from "@/constants/badge-colors";
import { UploadReport } from "../components/upload-report";
import SeminarCard from "../components/seminar-card";
import ReportStatus from "../components/report-status";
import SeminarDeadline from "../components/seminar-deadline";

const PROJECT_TYPE_LABELS: Record<string, string> = {
	special: "Special",
	capstone: "Capstone",
	"master/thesis": "Master / Thesis",
	master: "Master / Thesis",
};

type MilestoneItem = {
	label: string;
	done: boolean;
};

function MilestoneStatus({ label, done }: MilestoneItem) {
	return (
		<div className="flex items-center justify-between gap-3 py-1.5">
			<span className="text-xs text-muted-foreground">{label}</span>
			<span
				className={cn(
					"text-[10px] font-medium px-2 py-0.5 rounded-full",
					done
						? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300"
						: "bg-muted text-muted-foreground",
				)}>
				{done ? "Done" : "Pending"}
			</span>
		</div>
	);
}

export default function StudentProjectDetailPage() {
	const { slug } = useParams();
	const navigate = useNavigate();
	const { isStudent, isSupervisor } = useRoleChecker();

	const { data: projectDetail, isLoading } = useQuery({
		queryKey: ["projectDetail", slug],
		queryFn: () => getStudentProject(slug!),
	});

	const project = projectDetail?.data;
	useHeaderInitializer(project?.title ?? "Project", project?.title ?? "Project");

	const progressStatus = project?.progressStatus ?? {};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="h-8 w-32 rounded-md bg-muted animate-pulse" />
				<div className="h-40 rounded-xl bg-muted animate-pulse" />
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					{Array.from({ length: 2 }).map((_, i) => (
						<div key={i} className="h-48 rounded-xl bg-muted animate-pulse" />
					))}
				</div>
			</div>
		);
	}

	if (!project) return null;

	const milestones: MilestoneItem[] = [
		{ label: "Mid-term Report",  done: !!progressStatus.midReport },
		{ label: "Mid-term Seminar", done: !!progressStatus.midSeminar },
		{ label: "Final Report",     done: !!progressStatus.finalReport },
		{ label: "Final Seminar",    done: !!progressStatus.finalSeminar },
	];

	const doneCount = milestones.filter((m) => m.done).length;
	const members: { id: number; name: string; email: string }[] = project.members ?? [];

	return (
		<div className="space-y-4">
			{/* Back */}
			<Button
				onClick={() => navigate(-1)}
				variant="ghost"
				size="sm"
				className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1">
				<ArrowLeftIcon className="h-4 w-4" />
				Back
			</Button>

			{/* Header */}
			<div className="rounded-xl border bg-card p-5">
				<div className="flex flex-col lg:flex-row lg:items-start gap-5">
					{/* Left: badges + title + description + meta */}
					<div className="flex-1 min-w-0">
						<div className="flex flex-wrap items-center gap-2 mb-2">
							<Badge
								variant="outline"
								className={cn("capitalize font-medium", projectStatusColor(project.status))}>
								{project.status}
							</Badge>
							{project.projectType && (
								<Badge variant="outline" className={cn("font-medium", projectTypeColor(project.projectType))}>
									{PROJECT_TYPE_LABELS[project.projectType] ?? project.projectType}
								</Badge>
							)}
							<Badge variant="outline" className={cn("capitalize font-medium", proposalAppliedTypeColor(project.type))}>
								{project.type}
							</Badge>
							{project.projectArea && (
								<Badge variant="outline" className={cn("font-medium", projectAreaColor())}>
									{project.projectArea}
								</Badge>
							)}
							{project.academicYear && (
								<Badge variant="outline" className="font-medium bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800">
									{project.academicYear}
								</Badge>
							)}
						</div>

						<h1 className="text-xl font-bold tracking-tight mb-2 leading-snug">
							{project.title}
						</h1>

						<div className="flex flex-wrap gap-4 text-xs text-muted-foreground mb-3">
							{project.approvedAt && (
								<span className="flex items-center gap-1.5">
									<IconCalendarCheck size={12} />
									Approved {formatDate(project.approvedAt)}
								</span>
							)}
							{project.startedAt && (
								<span className="flex items-center gap-1.5">
									<IconCalendar size={12} />
									Started {formatDate(project.startedAt)}
								</span>
							)}
						</div>

						<p className="text-sm text-muted-foreground leading-relaxed">
							{project.description}
						</p>
					</div>

					{/* Right: milestone statuses */}
					<div className="shrink-0 w-full lg:w-48 lg:border-l lg:pl-5">
						<p className="text-[10px] text-muted-foreground uppercase tracking-widest font-semibold mb-2">
							Progress · {doneCount}/4
						</p>
						<div className="space-y-0.5">
							{milestones.map((m) => (
								<MilestoneStatus key={m.label} {...m} />
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Team + Seminar Deadlines */}
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
				{/* Team */}
				<div className="rounded-xl border bg-card divide-y divide-border overflow-hidden">
					{/* Supervisor */}
					{project.supervisor && (
						<div className="p-4">
							<p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
								Supervisor
							</p>
							<div className="flex items-center gap-3">
								<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100">
									<ShieldCheck className="size-3.5 text-primary-600" />
								</div>
								<div className="min-w-0">
									<p className="text-sm font-medium truncate">{project.supervisor.name}</p>
									<p className="text-xs text-muted-foreground truncate">{project.supervisor.email}</p>
								</div>
							</div>
						</div>
					)}

					{/* Members */}
					<div className="p-4">
						<p className="mb-2.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
							Team Members
							<span className="ml-1.5 inline-flex h-3.5 min-w-3.5 items-center justify-center rounded-full bg-primary-100 px-1 text-[9px] font-mono text-primary-700">
								{members.length}
							</span>
						</p>
						{members.length > 0 ? (
							<div className="space-y-2.5">
								{members.map((member) => (
									<div key={member.id} className="flex items-center gap-3">
										<div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted">
											<UserIcon className="size-3 text-muted-foreground" />
										</div>
										<div className="min-w-0">
											<p className="text-sm font-medium truncate">{member.name}</p>
											<p className="text-xs text-muted-foreground truncate">{member.email}</p>
										</div>
									</div>
								))}
							</div>
						) : (
							<p className="text-sm text-muted-foreground">No members listed.</p>
						)}
					</div>
				</div>

				{/* Seminar Deadlines */}
				<SeminarDeadline
					slug={project.slug}
					midSeminarDeadline={project.midSeminarDeadline}
					finalSeminarDeadline={project.finalSeminarDeadline}
					progressStatus={project.progressStatus}
				/>
			</div>

			{/* Report uploads — student only */}
			{isStudent && (
				<div className="rounded-xl border bg-card p-4">
					<p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-3">
						Upload Reports
					</p>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<UploadReport
							progressStatus={project.progressStatus}
							slug={project.slug}
							reportUrl={project.midReportUrl}
							label="Mid-term Report"
							type="mid"
						/>
						<UploadReport
							progressStatus={project.progressStatus}
							slug={project.slug}
							reportUrl={project.finalReportUrl}
							label="Final Report"
							type="final"
						/>
					</div>
				</div>
			)}

			{/* Reports + Seminar Status */}
			{isSupervisor && (
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
					<ReportStatus
						slug={project.slug}
						progressStatus={project.progressStatus}
						midReportUrl={project.midReportUrl}
						finalReportUrl={project.finalReportUrl}
					/>

					<SeminarCard
						slug={project.slug}
						midSeminarDeadline={project.midSeminarDeadline}
						finalSeminarDeadline={project.finalSeminarDeadline}
						progressStatus={project.progressStatus}
					/>
				</div>
			)}

			{/* Grades — student can view their own grades */}
			{isStudent && members.length > 0 && (
				<GradePanel projectSlug={project.slug} members={members} />
			)}
		</div>
	);
}
