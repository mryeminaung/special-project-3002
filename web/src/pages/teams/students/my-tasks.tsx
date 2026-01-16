import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import TaskCard from "../components/task-card";

export default function MyTasksPage() {
	useHeaderInitializer("MIIT | My Tasks", "My Tasks");

	return (
		<div className="flex flex-col mx-auto max-w-7xl gap-3 px-4">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
					My Tasks
				</h1>
				<p className="text-sm text-neutral-500">
					View and manage all your assigned tasks across different projects.
				</p>
			</div>{" "}
			<Tabs
				defaultValue="in-progress"
				className="w-full">
				<TabsList className="grid w-full grid-cols-3">
					<TabsTrigger value="in-progress">In Progress</TabsTrigger>
					<TabsTrigger value="completed">Completed</TabsTrigger>
					<TabsTrigger value="pending">Pending</TabsTrigger>
				</TabsList>
				<TabsContent value="in-progress">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
						<TaskCard
							task={{
								id: "1",
								title: "Develop User Authentication Module",
								description:
									"Implement secure user registration, login, and session management.",
								dueDate: "2024-05-10",
								status: "in-progress",
								priority: "high",
								project: "AuthentiChain",
							}}
						/>
						<TaskCard
							task={{
								id: "2",
								title: "Design Database Schema",
								description:
									"Create ER diagrams and define tables for project data.",
								dueDate: "2024-05-05",
								status: "in-progress",
								priority: "medium",
								project: "VisionPass",
							}}
						/>
					</div>
				</TabsContent>
				<TabsContent value="completed">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
						<TaskCard
							task={{
								id: "3",
								title: "Set up Project Environment",
								description:
									"Configure development tools, repositories, and initial project structure.",
								dueDate: "2024-04-20",
								status: "completed",
								priority: "high",
								project: "TrustCircle",
							}}
						/>
						<TaskCard
							task={{
								id: "4",
								title: "Research Blockchain Technologies",
								description:
									"Explore different blockchain platforms and their suitability for academic certificates.",
								dueDate: "2024-04-15",
								status: "completed",
								priority: "medium",
								project: "AuthentiChain",
							}}
						/>
					</div>
				</TabsContent>
				<TabsContent value="pending">
					<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
						<TaskCard
							task={{
								id: "5",
								title: "Write API Documentation",
								description:
									"Document all API endpoints, request/response formats, and authentication methods.",
								dueDate: "2024-05-25",
								status: "pending",
								priority: "low",
								project: "AuthentiChain",
							}}
						/>
						<TaskCard
							task={{
								id: "6",
								title: "Implement Payment Gateway Integration",
								description:
									"Integrate a third-party payment gateway for micro-lending transactions.",
								dueDate: "2024-06-01",
								status: "pending",
								priority: "high",
								project: "TrustCircle",
							}}
						/>
					</div>
				</TabsContent>
			</Tabs>
		</div>
	);
}
