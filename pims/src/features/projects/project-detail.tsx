import { getProject, markProjectComplete } from "./services/project.service";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useCan } from "@/hooks/use-can";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { cn, getInitials } from "@/lib/utils";
import { projectAreaColor, projectStatusColor, projectTypeColor, proposalAppliedTypeColor } from "@/constants/badge-colors";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ShieldCheck, UserIcon } from "lucide-react";
import {
	IconCalendar,
	IconCalendarCheck,
	IconCheck,
	IconUserStar,
} from "@tabler/icons-react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "sonner";
import ProjectActivity from "./components/project-activity";
import GradePanel from "./components/grade-panel";

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
		<div className="flex items-center justify-between gap-3 py-2">
			<span className="text-sm text-muted-foreground">{label}</span>
			<span
				className={cn(
					"text-xs font-semibold px-2.5 py-0.5 rounded-full border",
					done
						? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
						: "bg-muted border-border text-muted-foreground",
				)}>
				{done ? "Done" : "Pending"}
			</span>
		</div>
	);
}

export default function ProjectDetailPage() {
	const navigate = useNavigate();
	const { isIC } = useRoleChecker();
	const { can } = useCan();
	const { slug } = useParams();
	const queryClient = useQueryClient();
	const [completing, setCompleting] = useState(false);

	const { data: projectDetail, isLoading } = useQuery({
		queryKey: ["projectDetail", slug],
		queryFn: () => getProject(slug!),
	});

	const project = projectDetail?.data ?? null;
	useHeaderInitializer(project?.title ?? "Project", project?.title ?? "Project");

	const examiners: { id: number; name: string; email: string }[] = project?.examiners ?? [];

	async function handleMarkComplete() {
		if (!window.confirm("Mark this project as completed? Examiner roles will be removed.")) return;
		try {
			setCompleting(true);
			await markProjectComplete(slug!);
			toast.success("Project marked as completed.");
			await queryClient.invalidateQueries({ queryKey: ["projectDetail", slug] });
		} catch (err: any) {
			toast.error(err?.response?.data?.message ?? "Failed to mark complete.");
		} finally {
			setCompleting(false);
		}
	}

	const progressStatus = project?.progressStatus ?? {};

	if (isLoading) {
		return (
			<div className="space-y-4">
				<div className="h-8 w-32 rounded-md bg-muted animate-pulse" />
				<div className="h-56 rounded-xl bg-muted animate-pulse" />
				<div className="h-40 rounded-xl bg-muted animate-pulse" />
				<div className="h-40 rounded-xl bg-muted animate-pulse" />
			</div>
		);
	}

	if (!project) return null;

	const milestones: MilestoneItem[] = [
		{ label: "Mid-term Report",  done: !!progressStatus.midReportApproved },
		{ label: "Mid-term Seminar", done: !!progressStatus.midSeminar },
		{ label: "Final Report",     done: !!progressStatus.finalReportApproved },
		{ label: "Final Seminar",    done: !!progressStatus.finalSeminar },
	];

	const doneCount = milestones.filter((m) => m.done).length;
	const members: { id: number; name: string; email: string }[] = project.members ?? [];

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
					{/* Left: badges + title + description + meta */}
					<div className="flex-1 min-w-0">
						<div className="flex flex-wrap items-center gap-2 mb-3">
							<Badge
								variant="outline"
								className={cn("capitalize font-medium", projectStatusColor(project.status))}>
								{project.status}
							</Badge>
							{project.projectType && (
								<Badge variant="outline" className={cn("font-medium", projectTypeColor(project.projectType))}>
									<span className="opacity-60 text-[10px] font-normal mr-0.5">Type ·</span>
									{PROJECT_TYPE_LABELS[project.projectType] ?? project.projectType}
								</Badge>
							)}
							<Badge variant="outline" className={cn("capitalize font-medium", proposalAppliedTypeColor(project.type))}>
								<span className="opacity-60 text-[10px] font-normal mr-0.5">By ·</span>
								{project.type}
							</Badge>
							{project.projectArea && (
								<Badge variant="outline" className={cn("font-medium", projectAreaColor())}>
									<span className="opacity-60 text-[10px] font-normal mr-0.5">Area ·</span>
									{project.projectArea}
								</Badge>
							)}
							{project.academicYear && (
								<Badge variant="outline" className="font-medium bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-800">
									<span className="opacity-60 text-[10px] font-normal mr-0.5">Year ·</span>
									{project.academicYear}
								</Badge>
							)}
						</div>

						<h1 className="text-2xl font-bold tracking-tight mb-3 leading-snug">
							{project.title}
						</h1>

						<p className="text-sm text-muted-foreground leading-relaxed mb-4">
							{project.description}
						</p>

						<div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
							{project.approvedAt && (
								<span className="flex items-center gap-1.5">
									<IconCalendarCheck size={13} />
									Approved {formatDate(project.approvedAt)}
								</span>
							)}
							{project.startedAt && (
								<span className="flex items-center gap-1.5">
									<IconCalendar size={13} />
									Started {formatDate(project.startedAt)}
								</span>
							)}
						</div>
					</div>

					{/* Right: milestone statuses */}
					<div className="shrink-0 w-full lg:w-52 lg:border-l lg:pl-6">
						<p className="text-xs text-muted-foreground uppercase tracking-widest font-semibold mb-1">
							Milestones
						</p>
						<p className="text-xs text-muted-foreground mb-3">
							{doneCount} of 4 completed
						</p>
						<div className="divide-y divide-border">
							{milestones.map((m) => (
								<MilestoneStatus key={m.label} {...m} />
							))}
						</div>
					</div>
				</div>
			</div>

			{/* Team */}
			<div className="rounded-xl border bg-card divide-y divide-border overflow-hidden">
				{/* Supervisor */}
				{project.supervisor && (
					<div className="p-4">
						<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
							Supervisor
						</p>
						<div className="flex items-center gap-3">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary-100">
								<ShieldCheck className="size-4 text-primary-600" />
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
					<p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
						Team Members
						<span className="ml-2 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-primary-100 px-1 text-[10px] font-mono text-primary-700">
							{members.length}
						</span>
					</p>
					{members.length > 0 ? (
						<div className="space-y-3">
							{members.map((member) => (
								<div key={member.id} className="flex items-center gap-3">
									<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
										<UserIcon className="size-3.5 text-muted-foreground" />
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

			{/* Examiners — read-only for IC */}
			{isIC && examiners.length > 0 && (
				<div className="rounded-xl bg-muted/40 px-5 py-4">
					<p className="text-sm font-semibold mb-0.5 flex items-center gap-1.5">
						<IconUserStar size={14} />
						Examiners
					</p>
					<p className="text-xs text-muted-foreground mb-4">Faculty members assigned to examine this project.</p>
					<div className="flex flex-wrap gap-3">
						{examiners.map((examiner) => (
							<div key={examiner.id} className="flex items-center gap-3 rounded-lg bg-background px-4 py-3">
								<Avatar className="h-8 w-8 shrink-0">
									<AvatarFallback className="bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300 text-xs font-semibold">
										{getInitials(examiner.name)}
									</AvatarFallback>
								</Avatar>
								<div>
									<p className="text-sm font-medium leading-none">{examiner.name}</p>
									<p className="text-xs text-muted-foreground mt-0.5">{examiner.email}</p>
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* Grades — read-only for IC */}
			{isIC && members.length > 0 && (
				<GradePanel projectSlug={slug!} members={members} readOnly />
			)}

			{/* Mark Complete */}
			{can("mark-project-complete") && project.status === "under review" && (
				<div className="rounded-xl border border-emerald-200 dark:border-emerald-800 bg-emerald-50 dark:bg-emerald-950/40 px-5 py-4 flex items-center justify-between gap-4">
					<div>
						<p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
							Ready to complete
						</p>
						<p className="text-xs text-emerald-600 dark:text-emerald-500 mt-0.5">
							All milestones are submitted. Mark this project as completed.
						</p>
					</div>
					<Button
						onClick={handleMarkComplete}
						disabled={completing}
						className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
						<IconCheck size={15} />
						{completing ? "Completing…" : "Mark Complete"}
					</Button>
				</div>
			)}

			{/* Activity */}
			<ProjectActivity project={project} projectSlug={slug} />
		</div>
	);
}
