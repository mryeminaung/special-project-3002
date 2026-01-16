import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarDays, Tag } from "lucide-react";

interface Task {
	id: string;
	title: string;
	description: string;
	dueDate: string;
	status: "in-progress" | "completed" | "pending";
	priority: "high" | "medium" | "low";
	project: string;
}

interface TaskCardProps {
	task: Task;
}

const STATUS_COLORS: Record<Task["status"], string> = {
	"in-progress": "bg-blue-100 text-blue-800 border-blue-200",
	completed: "bg-green-100 text-green-800 border-green-200",
	pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
};

const PRIORITY_COLORS: Record<Task["priority"], string> = {
	high: "bg-red-100 text-red-800 border-red-200",
	medium: "bg-orange-100 text-orange-800 border-orange-200",
	low: "bg-gray-100 text-gray-800 border-gray-200",
};

export default function TaskCard({ task }: TaskCardProps) {
	return (
		<Card className="flex flex-col justify-between border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<CardTitle className="text-lg line-clamp-2">{task.title}</CardTitle>
					<Badge
						variant="secondary"
						className={cn(STATUS_COLORS[task.status], "capitalize")}>
						{task.status.replace("-", " ")}
					</Badge>
				</div>
				<CardDescription className="text-sm line-clamp-2">
					{task.description}
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-3">
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<CalendarDays className="h-4 w-4" />
					<span>Due: {task.dueDate}</span>
				</div>
				<div className="flex items-center gap-2 text-sm text-muted-foreground">
					<Tag className="h-4 w-4" />
					<span>Project: {task.project}</span>
				</div>
				<div className="flex items-center gap-2">
					<span className="text-sm text-muted-foreground">Priority:</span>
					<Badge
						variant="secondary"
						className={cn(PRIORITY_COLORS[task.priority], "capitalize")}>
						{task.priority}
					</Badge>
				</div>
				<div className="flex justify-end">
					<Badge
						variant="outline"
						className="cursor-pointer hover:bg-muted transition-colors">
						View Details
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
