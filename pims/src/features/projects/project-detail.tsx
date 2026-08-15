import { getProject } from "./services/project.service";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { cn, getInitials } from "@/lib/utils";
import { projectStatusColor } from "@/constants/badge-colors";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import {
	IconCalendar,
	IconCalendarCheck,
	IconUsers,
	IconUserCheck,
} from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router";
import ProjectActivity from "./components/project-activity";
import SeminarDeadline from "@/features/student/projects/components/seminar-deadline";

const PROJECT_TYPE_LABELS: Record<string, string> = {
	special: "Special",
	capstone: "Capstone",
	"master/thesis": "Master / Thesis",
	master: "Master / Thesis",
};

export default function ProjectDetailPage() {
	const navigate = useNavigate();
	const { isIC } = useRoleChecker();
	const { slug } = useParams();

	const { data: projectDetail, isLoading } = useQuery({
		queryKey: ["projectDetail", slug],
		queryFn: () => getProject(slug!),
	});

	const project = projectDetail?.data ?? null;

	const progressStatus = project?.progressStatus ?? {
		midReport: project?.midReport === "submitted",
		finalReport: project?.finalReport === "submitted",
		midSeminar: project?.midSeminar === "completed",
		finalSeminar: project?.finalSeminar === "completed",
	};

	const completedCount = Object.values(progressStatus).filter(Boolean).length;
	const progressPercent = Math.round((completedCount / 4) * 100);

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="h-8 w-32 rounded-md bg-muted animate-pulse" />
				<div className="h-48 rounded-xl bg-muted animate-pulse" />
				<div className="grid grid-cols-4 gap-4">
					{Array.from({ length: 4 }).map((_, i) => (
						<div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
					))}
				</div>
			</div>
		);
	}

	if (!project) return null;

	const infoCards = [
		{
			label: "Supervisor",
			value: project.supervisor?.name ?? "—",
			sub: project.supervisor?.email ?? null,
			icon: <IconUserCheck size={16} />,
			iconCls: "text-primary-600 bg-primary-100 dark:bg-primary-900/40",
		},
		{
			label: "Team Members",
			value: `${project.members?.length ?? project.membersCount ?? 0} students`,
			sub: null,
			icon: <IconUsers size={16} />,
			iconCls: "text-violet-600 bg-violet-100 dark:bg-violet-900/40",
		},
		{
			label: "Approved On",
			value: formatDate(project.approvedAt),
			sub: null,
			icon: <IconCalendarCheck size={16} />,
			iconCls: "text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40",
		},
		{
			label: "Started On",
			value: formatDate(project.startedAt),
			sub: null,
			icon: <IconCalendar size={16} />,
			iconCls: "text-amber-600 bg-amber-100 dark:bg-amber-900/40",
		},
	];

	return (
		<div className="space-y-6">
			{/* Back */}
			<Button
				onClick={() => navigate(-1)}
				variant="ghost"
				size="sm"
				className="gap-1.5 text-muted-foreground hover:text-foreground -ml-1">
				<ArrowLeftIcon className="h-4 w-4" />
				Back
			</Button>

			{/* Header card */}
			<div className="rounded-xl border bg-card p-6">
				<div className="flex flex-col lg:flex-row lg:items-start gap-6">
					{/* Left: badges + title + description */}
					<div className="flex-1 min-w-0">
						<div className="flex flex-wrap items-center gap-2 mb-3">
							<Badge
								variant="outline"
								className={cn("capitalize font-medium", projectStatusColor(project.status))}>
								{project.status}
							</Badge>
							{project.projectType && (
								<Badge variant="outline" className="font-medium">
									{PROJECT_TYPE_LABELS[project.projectType] ?? project.projectType}
								</Badge>
							)}
							<Badge variant="outline" className="capitalize font-medium">
								{project.type}
							</Badge>
							{project.projectArea && (
								<Badge variant="outline" className="font-medium">
									{project.projectArea}
								</Badge>
							)}
						</div>

						<h1 className="text-2xl font-bold tracking-tight mb-3 leading-snug">
							{project.title}
						</h1>

						<p className="text-sm text-muted-foreground leading-relaxed">
							{project.description}
						</p>
					</div>

					{/* Right: progress — clean, no colored bg */}
					<div className="shrink-0 w-full lg:w-48 lg:border-l lg:pl-6 flex flex-col justify-center">
						<p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">Progress</p>
						<p className="text-5xl font-black tabular-nums text-foreground leading-none mb-3">
							{progressPercent}<span className="text-2xl font-bold text-muted-foreground">%</span>
						</p>
						<div className="h-1.5 w-full bg-muted rounded-full overflow-hidden mb-2">
							<div
								className="h-full bg-primary-600 rounded-full transition-all duration-500"
								style={{ width: `${progressPercent}%` }}
							/>
						</div>
						<p className="text-xs text-muted-foreground">{completedCount} of 4 milestones done</p>
					</div>
				</div>
			</div>

			{/* IC info strip — muted bg, no heavy card borders */}
			{isIC && (
				<div className="rounded-xl bg-muted/40 px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4">
					{infoCards.map((card) => (
						<div key={card.label} className="flex items-start gap-3">
							<div className={cn("mt-0.5 shrink-0 p-2 rounded-lg", card.iconCls)}>
								{card.icon}
							</div>
							<div className="min-w-0">
								<p className="text-xs text-muted-foreground mb-0.5">{card.label}</p>
								<p className="text-sm font-semibold leading-snug truncate">{card.value}</p>
								{card.sub && (
									<p className="text-xs text-muted-foreground truncate mt-0.5">{card.sub}</p>
								)}
							</div>
						</div>
					))}
				</div>
			)}

			{/* Members — muted bg strip, no card */}
			<div className="rounded-xl bg-muted/40 px-5 py-4">
				<p className="text-sm font-semibold mb-0.5">Team Members</p>
				<p className="text-xs text-muted-foreground mb-4">Students working on this project.</p>
				<div className="flex flex-wrap gap-3">
					{(project.members?.length ?? 0) > 0 ? (
						project.members!.map((member: { id: number; name: string; email: string }) => (
							<div
								key={member.id}
								className="flex items-center gap-3 rounded-lg bg-background px-4 py-3">
								<Avatar className="h-8 w-8 shrink-0">
									<AvatarFallback className="bg-primary-100 text-primary-700 text-xs font-semibold">
										{getInitials(member.name)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-medium leading-none">{member.name}</p>
									<p className="text-xs text-muted-foreground mt-0.5">{member.email}</p>
								</div>
							</div>
						))
					) : (
						<p className="text-sm text-muted-foreground">No members listed.</p>
					)}
				</div>
			</div>

			{/* Seminar Deadlines — IC can set */}
			{isIC && (
				<SeminarDeadline
					slug={project.slug}
					midSeminarDeadline={project.midSeminarDeadline}
					finalSeminarDeadline={project.finalSeminarDeadline}
					progressStatus={progressStatus}
				/>
			)}

			{/* Activity */}
			<ProjectActivity project={project} isIC={isIC} projectSlug={slug} />
		</div>
	);
}
