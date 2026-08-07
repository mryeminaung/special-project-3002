import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { IconCheck, IconX, IconEye, IconMinus } from "@tabler/icons-react";
import { Link } from "react-router";

interface ProjectProgress {
	id: string;
	name: string;
	slug: string;
	supervisorName: string;
	midReport: "completed" | "not completed" | "not submitted";
	midSeminar: "completed" | "not completed" | "not submitted";
	finalReport: "completed" | "not completed" | "not submitted";
	finalSeminar: "completed" | "not completed" | "not submitted";
}

const defaultProjects: ProjectProgress[] = [
	{
		id: "PRJ-001",
		name: "LMS System Development",
		slug: "lms-system",
		supervisorName: "Dr. Sandar Min",
		midReport: "completed",
		midSeminar: "completed",
		finalReport: "not submitted",
		finalSeminar: "not submitted",
	},
	{
		id: "PRJ-002",
		name: "Mobile App for Campus Navigation",
		slug: "campus-nav",
		supervisorName: "Dr. Kyaw Swar Lin",
		midReport: "completed",
		midSeminar: "not completed",
		finalReport: "not submitted",
		finalSeminar: "not submitted",
	},
	{
		id: "PRJ-003",
		name: "AI Attendance System",
		slug: "ai-attendance",
		supervisorName: "Dr. Nyein Nyein Oo",
		midReport: "not completed",
		midSeminar: "not submitted",
		finalReport: "not submitted",
		finalSeminar: "not submitted",
	},
	{
		id: "PRJ-004",
		name: "Library Book Management",
		slug: "library-system",
		supervisorName: "Dr. Aung Zaw Myo",
		midReport: "completed",
		midSeminar: "completed",
		finalReport: "completed",
		finalSeminar: "completed",
	},
	{
		id: "PRJ-005",
		name: "Smart Parking System",
		slug: "smart-parking",
		supervisorName: "Dr. Thein Aung",
		midReport: "completed",
		midSeminar: "completed",
		finalReport: "completed",
		finalSeminar: "not submitted",
	},
	{
		id: "PRJ-006",
		name: "E-Learning Platform",
		slug: "e-learning",
		supervisorName: "Dr. Myint Myint Aye",
		midReport: "not completed",
		midSeminar: "not submitted",
		finalReport: "not submitted",
		finalSeminar: "not submitted",
	},
];

function StatusIndicator({ status }: { status: string }) {
	switch (status) {
		case "completed":
			return (
				<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
					<IconCheck size={14} strokeWidth={3} />
				</span>
			);
		case "not completed":
			return (
				<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400">
					<IconX size={14} strokeWidth={3} />
				</span>
			);
		default:
			return (
				<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-gray-400 dark:bg-gray-800 dark:text-gray-500">
					<IconMinus size={14} strokeWidth={3} />
				</span>
			);
	}
}

export default function ProjectProgressTable({
	projects,
}: {
	projects?: ProjectProgress[];
}) {
	const data = projects || defaultProjects;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between pb-4">
				<CardTitle className="text-sm font-semibold text-foreground">
					Project Progress
				</CardTitle>
				<Link to="/projects">
					<Button variant="ghost" size="sm" className="text-xs text-muted-foreground hover:text-foreground">
						View All →
					</Button>
				</Link>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className="text-xs font-medium text-muted-foreground">
								Project Title
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground hidden md:table-cell">
								Supervisor
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground text-center">
								Mid Report
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground text-center">
								Mid Seminar
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground text-center">
								Final Report
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground text-center">
								Final Seminar
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground text-right">
								View
							</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((project) => (
							<TableRow
								key={project.id}
								className="border-b border-border/30 last:border-0">
								<TableCell>
									<div>
										<p className="font-medium text-foreground text-sm">
											{project.name}
										</p>
										<p className="text-xs text-muted-foreground md:hidden">
											{project.supervisorName}
										</p>
									</div>
								</TableCell>
								<TableCell className="text-sm text-muted-foreground hidden md:table-cell">
									{project.supervisorName}
								</TableCell>
								<TableCell className="text-center">
									<StatusIndicator status={project.midReport} />
								</TableCell>
								<TableCell className="text-center">
									<StatusIndicator status={project.midSeminar} />
								</TableCell>
								<TableCell className="text-center">
									<StatusIndicator status={project.finalReport} />
								</TableCell>
								<TableCell className="text-center">
									<StatusIndicator status={project.finalSeminar} />
								</TableCell>
								<TableCell className="text-right">
									<Link to={`/projects/${project.slug}/detail`}>
										<Button
											size="sm"
											className="bg-violet-600 hover:bg-violet-700 text-white h-8 px-3 text-xs">
											<IconEye size={14} className="mr-1" />
											View
										</Button>
									</Link>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
