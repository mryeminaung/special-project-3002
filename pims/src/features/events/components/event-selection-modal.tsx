import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEventStore } from "@/stores/use-event-store";
import { type ReactNode, useState, useEffect } from "react";
import { toast } from "sonner";
import type { EventType } from "../events.type";

type EventConfigValues = {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
};

type EventSelectionModalProps = {
	eventType: EventType;
	eventTitle: string;
	mode?: "create" | "edit";
	initialValues?: EventConfigValues;
	children: ReactNode;
};

export default function EventSelectionModal({
	eventType,
	eventTitle,
	mode = "create",
	initialValues,
	children,
}: EventSelectionModalProps) {
	const createProjectEvent = useEventStore((state) => state.createProjectEvent);
	const updateProjectEvent = useEventStore((state) => state.updateProjectEvent);

	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		if (open && mode === "edit" && initialValues) {
			setTitle(initialValues.title);
			setDescription(initialValues.description);
			setStartDate(initialValues.startDate?.split("T")[0] ?? "");
			setEndDate(initialValues.endDate?.split("T")[0] ?? "");
		}
	}, [open, mode, initialValues]);

	const canSave =
		title.trim().length > 0 &&
		description.trim().length > 0 &&
		startDate.length > 0 &&
		endDate.length > 0 &&
		!isSaving;

	function resetForm() {
		setTitle("");
		setDescription("");
		setStartDate("");
		setEndDate("");
	}

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);
		if (!nextOpen) resetForm();
	}

	async function handleSave() {
		if (!canSave) return;

		try {
			setIsSaving(true);
			const config = {
				title: title.trim(),
				description: description.trim(),
				startDate,
				endDate,
			};

			if (mode === "edit") {
				await updateProjectEvent(eventType, config);
				toast.success("Event details updated successfully.");
			} else {
				await createProjectEvent(eventType, config);
				toast.success("Event details created successfully.");
			}

			setOpen(false);
			resetForm();
		} catch (error: any) {
			const message =
				error?.response?.data?.message ??
				(mode === "edit"
					? "Failed to update event details."
					: "Failed to create event details.");
			toast.error(message);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>{children}</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>
						{mode === "edit" ? "Edit" : "Create"} — {eventTitle} Event
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor={`event-title-${eventTitle}`}>Title</Label>
						<Input
							id={`event-title-${eventTitle}`}
							placeholder="Enter event title"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							className="focus:border-primary-500 focus:ring-primary-500"
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor={`event-detail-${eventTitle}`}>Description</Label>
						<Textarea
							id={`event-detail-${eventTitle}`}
							placeholder="Describe this event"
							className="min-h-28 resize-none focus:border-primary-500 focus:ring-primary-500"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor={`start-date-${eventTitle}`}>Start Date</Label>
							<Input
								id={`start-date-${eventTitle}`}
								type="date"
								value={startDate}
								onChange={(e) => setStartDate(e.target.value)}
								className="focus:border-primary-500 focus:ring-primary-500"
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor={`end-date-${eventTitle}`}>End Date</Label>
							<Input
								id={`end-date-${eventTitle}`}
								type="date"
								value={endDate}
								onChange={(e) => setEndDate(e.target.value)}
								min={startDate || undefined}
								className="focus:border-primary-500 focus:ring-primary-500"
							/>
						</div>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline">
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="button"
						onClick={handleSave}
						disabled={!canSave}
						className="bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:text-gray-500">
						{isSaving ? "Saving..." : mode === "edit" ? "Update" : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
