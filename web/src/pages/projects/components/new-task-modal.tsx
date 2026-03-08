import ErrorMessage from "@/components/error-message";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { z } from "zod";

type TaskStatus = "todo" | "in_progress" | "completed";
type TaskPriority = "low" | "medium" | "high";

const UNASSIGNED_STUDENT = "__UNASSIGNED__";

const STATUS_OPTIONS: Array<{ value: TaskStatus; label: string }> = [
	{ value: "todo", label: "To Do" },
	{ value: "in_progress", label: "In Progress" },
	{ value: "completed", label: "Completed" },
];

const PRIORITY_OPTIONS: Array<{ value: TaskPriority; label: string }> = [
	{ value: "low", label: "Low" },
	{ value: "medium", label: "Medium" },
	{ value: "high", label: "High" },
];

const taskSchema = z.object({
	title: z.string().trim().min(1, "Title is required"),
	description: z.string(),
	due_date: z.string().min(1, "Due date is required"),
	status: z.enum(["todo", "in_progress", "completed"]),
	assigned_to: z.union([
		z.literal(UNASSIGNED_STUDENT),
		z.string().regex(/^\d+$/, "Assigned student must be valid"),
	]),
	priority: z.enum(["low", "medium", "high"]),
});

type NewTaskForm = z.infer<typeof taskSchema>;

const defaultValues: NewTaskForm = {
	title: "",
	description: "",
	due_date: "",
	status: "todo",
	assigned_to: UNASSIGNED_STUDENT,
	priority: "medium",
};

export function NewTaskModal({
	projectId,
	members,
}: {
	projectId: number;
	members: { id: number; name: string; email: string }[];
}) {
	const [open, setOpen] = useState(false);

	const {
		register,
		control,
		handleSubmit,
		reset,
		formState: { errors, isSubmitting },
	} = useForm<NewTaskForm>({
		resolver: zodResolver(taskSchema),
		defaultValues,
	});

	const handleOpenChange = (nextOpen: boolean) => {
		setOpen(nextOpen);
		if (!nextOpen) {
			reset(defaultValues);
		}
	};

	const onSubmit = async (data: NewTaskForm) => {
		const payload = {
			title: data.title.trim(),
			description: data.description.trim() || null,
			due_date: data.due_date,
			status: data.status,
			priority: data.priority,
			assigned_to:
				data.assigned_to === UNASSIGNED_STUDENT
					? null
					: Number(data.assigned_to),
			project_id: projectId,
		};

		console.log(payload);
		// await api.post("/tasks", payload);
		// await queryClient.invalidateQueries({ queryKey: ["tasks"] });
		// reset(defaultValues);
		// setOpen(false);
	};

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<Button
					variant="outline"
					disabled={!projectId}>
					Create
				</Button>
			</DialogTrigger>
			<form onSubmit={handleSubmit(onSubmit)}>
				<DialogContent className="sm:max-w-sm">
					<DialogHeader>
						<DialogTitle>Create New Task</DialogTitle>
						<DialogDescription>
							Add a new task by providing the details below.
							<br />
							Click save when you're done.
						</DialogDescription>
					</DialogHeader>
					<FieldGroup>
						<Field>
							<Label htmlFor="task-title">Title</Label>
							<Input
								{...register("title")}
								id="task-title"
								name="title"
							/>
							{errors.title && <ErrorMessage error={errors.title.message} />}
						</Field>
						<Field>
							<Label htmlFor="task-description">Description</Label>
							<Textarea
								{...register("description")}
								id="task-description"
								name="description"
								className="min-h-24 resize-none"
							/>
							{errors.description && (
								<ErrorMessage error={errors.description.message} />
							)}
						</Field>
						<Field>
							<Label htmlFor="task-due-date">Due Date</Label>
							<Input
								{...register("due_date")}
								id="task-due-date"
								name="due_date"
								type="date"
							/>
							{errors.due_date && (
								<ErrorMessage error={errors.due_date.message} />
							)}
						</Field>
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
							<Field>
								<Label htmlFor="task-status">Status</Label>
								<Controller
									name="status"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={(value) =>
												field.onChange(value as TaskStatus)
											}>
											<SelectTrigger
												id="task-status"
												className="w-full">
												<SelectValue placeholder="Select status" />
											</SelectTrigger>
											<SelectContent>
												{STATUS_OPTIONS.map((status) => (
													<SelectItem
														key={status.value}
														value={status.value}>
														{status.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.status && (
									<ErrorMessage error={errors.status.message} />
								)}
							</Field>
							<Field>
								<Label htmlFor="task-priority">Priority</Label>
								<Controller
									name="priority"
									control={control}
									render={({ field }) => (
										<Select
											value={field.value}
											onValueChange={(value) =>
												field.onChange(value as TaskPriority)
											}>
											<SelectTrigger
												id="task-priority"
												className="w-full">
												<SelectValue placeholder="Select priority" />
											</SelectTrigger>
											<SelectContent>
												{PRIORITY_OPTIONS.map((priority) => (
													<SelectItem
														key={priority.value}
														value={priority.value}>
														{priority.label}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									)}
								/>
								{errors.priority && (
									<ErrorMessage error={errors.priority.message} />
								)}
							</Field>
						</div>
						<Field>
							<Label htmlFor="task-assigned-to">Assigned To</Label>
							<Controller
								name="assigned_to"
								control={control}
								render={({ field }) => (
									<Select
										value={field.value}
										onValueChange={field.onChange}>
										<SelectTrigger
											id="task-assigned-to"
											className="w-full">
											<SelectValue placeholder="Select student" />
										</SelectTrigger>
										<SelectContent>
											<SelectItem value={UNASSIGNED_STUDENT}>
												Select student
											</SelectItem>
											{members &&
												members.map((member) => (
													<SelectItem
														key={member.id}
														value={String(member.id)}>
														{member.name}
													</SelectItem>
												))}
										</SelectContent>
									</Select>
								)}
							/>
							{errors.assigned_to && (
								<ErrorMessage error={errors.assigned_to.message} />
							)}
						</Field>
					</FieldGroup>
					<DialogFooter>
						<DialogClose asChild>
							<Button variant="outline">Close</Button>
						</DialogClose>
						<Button
							type="submit"
							disabled={isSubmitting}>
							Save changes
						</Button>
					</DialogFooter>
				</DialogContent>
			</form>
		</Dialog>
	);
}
