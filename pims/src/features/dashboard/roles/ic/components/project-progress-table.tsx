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
import { Badge } from "@/components/ui/badge";
import { IconCheck, IconX } from "@tabler/icons-react";
import { Link } from "react-router";
import ViewDetail from "@/components/view-detail";

interface ProjectProgress {
	id: string;
	name: string;
	slug: string;
	supervisorName: string;
	midReport: string;
	midSeminar: string;
	finalReport: string;
	finalSeminar: string;
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

const MILESTONES = ["midReport", "midSeminar", "finalReport", "finalSeminar"] as const;
const MILESTONE_LABELS: Record<string, string> = {
	midReport: "Mid Report",
	midSeminar: "Mid Seminar",
	finalReport: "Final Report",
	finalSeminar: "Final Seminar",
};

function isDone(status: string) {
	return status === "completed" || status === "submitted";
}

function MilestoneIcon({ status }: { status: string }) {
	if (isDone(status)) {
		return (
			<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
				<IconCheck size={13} strokeWidth={3} />
			</span>
		);
	}
	return (
		<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950 dark:text-red-400">
			<IconX size={13} strokeWidth={3} />
		</span>
	);
}

function ProgressChip({ done, total }: { done: number; total: number }) {
	const pct = Math.round((done / total) * 100);
	const isComplete = done === total;
	const isNotStarted = done === 0;

	let chipClass = "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-400 dark:border-amber-800";
	if (isComplete) chipClass = "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-400 dark:border-emerald-800";
	if (isNotStarted) chipClass = "bg-muted text-muted-foreground border-border";

	const label = isComplete ? "Complete" : isNotStarted ? "Not Started" : "In Progress";

	return (
		<div className="flex items-center gap-2">
			<div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
				<div
					className={`h-full rounded-full transition-all duration-500 ${isComplete ? "bg-emerald-500" : "bg-amber-400"}`}
					style={{ width: `${pct}%` }}
				/>
			</div>
			<Badge variant="outline" className={`text-[10px] px-1.5 py-0 font-medium ${chipClass}`}>
				{label}
			</Badge>
		</div>
	);
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
				<div>
					<CardTitle className="text-sm font-semibold text-foreground">
						Project Progress
					</CardTitle>
					<p className="text-xs text-muted-foreground mt-0.5">
						Milestone completion across active projects
					</p>
				</div>
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
							<TableHead className="text-xs font-medium text-muted-foreground pl-6">
								Project
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground hidden lg:table-cell">
								Supervisor
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground text-center" colSpan={2}>
								Mid
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground text-center" colSpan={2}>
								Final
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground">
								Progress
							</TableHead>
							<TableHead className="text-xs font-medium text-muted-foreground text-right pr-6">
								View
							</TableHead>
						</TableRow>
						<TableRow className="border-b border-border/30 hover:bg-transparent">
							<TableHead className="pl-6 py-1" />
							<TableHead className="hidden lg:table-cell py-1" />
							{MILESTONES.map((m) => (
								<TableHead key={m} className="text-[10px] font-normal text-muted-foreground/70 text-center py-1">
									{MILESTONE_LABELS[m].split(" ")[1]}
								</TableHead>
							))}
							<TableHead className="py-1" />
							<TableHead className="pr-6 py-1" />
						</TableRow>
					</TableHeader>
					<TableBody>
						{data.map((project) => {
							const doneCount = MILESTONES.filter((m) => isDone(project[m])).length;
							return (
								<TableRow
									key={project.id}
									className="border-b border-border/30 last:border-0 hover:bg-muted/30">
									<TableCell className="pl-6 max-w-[180px]">
										<p className="font-medium text-foreground text-sm truncate" title={project.name}>
											{project.name}
										</p>
										<p className="text-xs text-muted-foreground lg:hidden truncate">
											{project.supervisorName}
										</p>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground hidden lg:table-cell">
										{project.supervisorName}
									</TableCell>
									<TableCell className="text-center">
										<MilestoneIcon status={project.midReport} />
									</TableCell>
									<TableCell className="text-center">
										<MilestoneIcon status={project.midSeminar} />
									</TableCell>
									<TableCell className="text-center">
										<MilestoneIcon status={project.finalReport} />
									</TableCell>
									<TableCell className="text-center">
										<MilestoneIcon status={project.finalSeminar} />
									</TableCell>
									<TableCell>
										<ProgressChip done={doneCount} total={MILESTONES.length} />
									</TableCell>
									<TableCell className="text-right pr-6">
										<ViewDetail url={`/projects/${project.slug}/detail`} />
									</TableCell>
								</TableRow>
							);
						})}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
