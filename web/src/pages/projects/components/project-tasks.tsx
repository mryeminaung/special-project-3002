import api from "@/api/api";
import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import { NewTaskModal } from "./new-task-modal";

type TaskStatus = "todo" | "in_progress" | "completed";
type TaskPriority = "low" | "medium" | "high";

type Task = {
	id: number;
	title: string;
	description: string | null;
	due_date: string;
	status: TaskStatus;
	priority: TaskPriority;
	assigned_to: number;
	project_id: number;
};

const STATUS_STYLES: Record<TaskStatus, string> = {
	todo: "bg-amber-100 text-amber-700",
	in_progress: "bg-sky-100 text-sky-700",
	completed: "bg-emerald-100 text-emerald-700",
};

const PRIORITY_STYLES: Record<TaskPriority, string> = {
	low: "bg-zinc-100 text-zinc-700",
	medium: "bg-orange-100 text-orange-700",
	high: "bg-rose-100 text-rose-700",
};

function formatDate(dateValue: string) {
	if (!dateValue) {
		return "-";
	}

	return new Date(`${dateValue}T00:00:00`).toLocaleDateString();
}

function formatStatus(status: TaskStatus) {
	return status.replace("_", " ");
}

export default function ProjectTasks({
	projectId,
	members,
}: {
	projectId: number;
	members: { id: number; name: string; email: string }[];
}) {
	const { slug } = useParams();

	const fetchProjectTasks = async () => {
		const response = await api.get(`/projects/${slug}/tasks`);
		return response.data;
	};

	const { data: projectTasks = [], isLoading: isTasksLoading } = useQuery<
		Task[]
	>({
		queryKey: ["tasks"],
		queryFn: fetchProjectTasks,
	});

	return (
		<div>
			<div className="flex items-center justify-between my-4">
				<Heading
					variant="sm"
					title="Project Tasks"
					description="List of tasks related to this project."
				/>
				<NewTaskModal
					members={members}
					projectId={projectId}
				/>
			</div>

			<div className="rounded-lg border bg-card">
				<Table>
					<TableHeader className="bg-muted/50">
						<TableRow>
							<TableHead>Title</TableHead>
							<TableHead>Description</TableHead>
							<TableHead>Due Date</TableHead>
							<TableHead>Status</TableHead>
							<TableHead>Priority</TableHead>
							<TableHead>Assigned To</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{isTasksLoading && (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center text-muted-foreground py-6">
									Loading tasks...
								</TableCell>
							</TableRow>
						)}

						{!isTasksLoading && projectTasks.length === 0 && (
							<TableRow>
								<TableCell
									colSpan={6}
									className="text-center text-muted-foreground py-6">
									No tasks found for this project.
								</TableCell>
							</TableRow>
						)}

						{!isTasksLoading &&
							projectTasks.map((task) => (
								<TableRow key={task.id}>
									<TableCell className="font-medium">{task.title}</TableCell>
									<TableCell className="max-w-70 truncate">
										{task.description || "-"}
									</TableCell>
									<TableCell>{formatDate(task.due_date)}</TableCell>
									<TableCell>
										<Badge
											className={cn(
												"capitalize border-none",
												STATUS_STYLES[task.status],
											)}>
											{formatStatus(task.status)}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge
											className={cn(
												"capitalize border-none",
												PRIORITY_STYLES[task.priority],
											)}>
											{task.priority}
										</Badge>
									</TableCell>
									<TableCell></TableCell>
								</TableRow>
							))}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
