import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { projectStatusColor, projectTypeColor } from "@/constants/badge-colors";
import { formatDate } from "@/lib/date";
import { IconArrowRight, IconCalendar, IconShieldCheck, IconUsers } from "@tabler/icons-react";
import { Link } from "react-router";

const STATUS_DOT: Record<string, string> = {
	active: "bg-emerald-500",
	completed: "bg-sky-500",
	"under review": "bg-violet-500",
	pending: "bg-amber-500",
};

const PROJECT_TYPE_LABELS: Record<string, string> = {
	special: "Special",
	capstone: "Capstone",
	"master/thesis": "Master / Thesis",
	master: "Master / Thesis",
};

type ProjectCardProps = {
	project?: {
		id: string;
		title: string;
		slug: string;
		description: string;
		status: string;
		projectType?: string | null;
		supervisor: {
			id: string;
			name: string;
			email: string;
		};
		membersCount: number;
		startedAt: string;
	};
};

export function ProjectCard({ project }: ProjectCardProps) {
	if (!project) return null;

	const dot = STATUS_DOT[project.status] ?? "bg-gray-400";

	return (
		<Link to={`/projects/student/${project.slug}/detail`} className="block group">
			<div className="flex flex-col gap-3.5 rounded-xl border bg-card p-5 transition-shadow duration-200 group-hover:shadow-sm">
				{/* Top: status + type badges */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 flex-wrap">
						<div className="flex items-center gap-1.5">
							<span className={cn("h-2 w-2 rounded-full shrink-0", dot)} />
							<Badge
								variant="outline"
								className={cn("text-xs font-medium capitalize", projectStatusColor(project.status))}>
								{project.status}
							</Badge>
						</div>
						{project.projectType && (
							<Badge
								variant="outline"
								className={cn("text-xs font-medium capitalize", projectTypeColor(project.projectType))}>
								{PROJECT_TYPE_LABELS[project.projectType] ?? project.projectType}
							</Badge>
						)}
					</div>
					<IconArrowRight
						size={16}
						className="text-muted-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
					/>
				</div>

				{/* Title */}
				<h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
					{project.title}
				</h3>

				{/* Description */}
				<p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
					{project.description}
				</p>

				{/* Divider */}
				<div className="border-t border-border" />

				{/* Meta row */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<IconShieldCheck size={13} className="shrink-0 text-primary-500" />
						<span className="truncate">{project.supervisor?.name ?? "—"}</span>
					</div>
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground">
							<IconUsers size={13} className="shrink-0" />
							<span>{project.membersCount} member{project.membersCount !== 1 ? "s" : ""}</span>
						</div>
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
							<IconCalendar size={12} />
							<span>{formatDate(project.startedAt)}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
