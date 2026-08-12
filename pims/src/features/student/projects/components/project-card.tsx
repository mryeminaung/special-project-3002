import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { cn, PROJECT_STATUS_COLOR } from "@/lib/utils";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { CalendarIcon, Users } from "lucide-react";
import { Link } from "react-router";

type ProjectCardProps = {
	project?: {
		id: string;
		title: string;
		slug: string;
		description: string;
		status: "under_review" | "completed" | "active";
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

	return (
		<Link to={`/projects/student/${project.slug}/detail`}>
			<Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
				{/* Project Title and Status */}
				<CardContent>
					<div className="flex items-start justify-between">
						<CardTitle className="line-clamp-1 text-lg font-semibold  mr-2">
							{project.title}
						</CardTitle>
						<Badge
							className={cn(
								PROJECT_STATUS_COLOR(project.status),
								"font-mono capitalize px-3 rounded-md",
							)}>
							{project.status}
						</Badge>
					</div>
					<span className="flex items-center text-sm gap-1.5">
						<CalendarIcon className="h-4 w-4" />
						Started at {project.startedAt}
					</span>
					<p className="line-clamp-2 mt-2 text-sm">{project.description}</p>
				</CardContent>

				<CardContent className="space-y-2">
					{/* project Supervisor */}
					<div className="flex text-sm gap-x-2 items-center">
						<ShieldCheckIcon className="h-5 w-5 text-primary-600" />
						<p className="flex flex-row gap-x-2">
							<span>Supervisor . </span>
							<span>{project.supervisor.name}</span>
						</p>
					</div>

					{/* project Members */}
					<div className="space-y-2">
						<div className="flex items-start gap-x-3 text-sm">
							<Users className="w-4 h-4 text-primary-600" />

							<div className="flex flex-col gap-1">
								<p className="flex items-center gap-x-3">
									<span>{project.membersCount} Members</span>
								</p>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
