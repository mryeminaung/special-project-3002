import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { IconCheck, IconMinus, IconX } from "@tabler/icons-react";
import type { StudentDashboardData } from "../services/student-dashboard.service";

function StatusIcon({ status }: { status: string }) {
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

export default function ProjectProgress({
	projects,
}: {
	projects?: StudentDashboardData["projectProgress"];
}) {
	if (!projects || projects.length === 0) return null;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-semibold text-foreground">
					My Project Progress
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0">
				<Table>
					<TableHeader>
						<TableRow className="border-b border-border/50 hover:bg-transparent">
							<TableHead className="text-xs font-medium text-muted-foreground">
								Project
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
						</TableRow>
					</TableHeader>
					<TableBody>
						{projects.map((project) => (
							<TableRow
								key={project.id}
								className="border-b border-border/30 last:border-0"
							>
								<TableCell>
									<p className="font-medium text-foreground text-sm">
										{project.name}
									</p>
									<p className="text-xs text-muted-foreground">
										{project.supervisorName}
									</p>
								</TableCell>
								<TableCell className="text-center">
									<StatusIcon status={project.midReport} />
								</TableCell>
								<TableCell className="text-center">
									<StatusIcon status={project.midSeminar} />
								</TableCell>
								<TableCell className="text-center">
									<StatusIcon status={project.finalReport} />
								</TableCell>
								<TableCell className="text-center">
									<StatusIcon status={project.finalSeminar} />
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</CardContent>
		</Card>
	);
}
