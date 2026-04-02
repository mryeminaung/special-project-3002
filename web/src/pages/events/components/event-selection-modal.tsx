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
import { useState } from "react";
import { toast } from "sonner";
import type { EventType } from "../events.type";

type EventSelectionModalProps = {
	eventType: EventType;
	eventTitle: string;
	triggerText?: string;
	triggerDisabled?: boolean;
};

export default function EventSelectionModal({
	eventType,
	eventTitle,
	triggerText,
	triggerDisabled = false,
}: EventSelectionModalProps) {
	const createProjectEvent = useEventStore((state) => state.createProjectEvent);
	const [open, setOpen] = useState(false);
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [isSaving, setIsSaving] = useState(false);

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
		if (!nextOpen) {
			resetForm();
		}
	}

	async function handleSave() {
		if (!canSave) {
			return;
		}

		try {
			setIsSaving(true);
			await createProjectEvent(eventType, {
				title: title.trim(),
				description: description.trim(),
				startDate,
				endDate,
			});
			toast.success("Project event created successfully.");
			setOpen(false);
			resetForm();
		} catch (error: any) {
			const message =
				error?.response?.data?.message ?? "Failed to create project event.";
			toast.error(message);
		} finally {
			setIsSaving(false);
		}
	}

	return (
		<Dialog
			open={open}
			onOpenChange={handleOpenChange}>
			<DialogTrigger asChild>
				<button
					type="button"
					disabled={triggerDisabled}
					className="cursor-pointer rounded-full bg-primary-600 px-5 py-2 text-sm font-medium text-white transition-all duration-200 hover:bg-primary-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary-600 disabled:hover:shadow-none">
					{triggerText ?? `Select ${eventTitle}`}
				</button>
			</DialogTrigger>

			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>{eventTitle} Event</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor={`event-title-${eventTitle}`}>Title</Label>
						<Input
							id={`event-title-${eventTitle}`}
							placeholder="Enter event title"
							value={title}
							onChange={(event) => setTitle(event.target.value)}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor={`event-detail-${eventTitle}`}>Description</Label>
						<Textarea
							id={`event-detail-${eventTitle}`}
							placeholder="Describe this event"
							className="min-h-28 resize-none border focus:border-primary-500!"
							value={description}
							onChange={(event) => setDescription(event.target.value)}
						/>
					</div>

					<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
						<div className="grid gap-2">
							<Label htmlFor={`start-date-${eventTitle}`}>Start Date</Label>
							<Input
								id={`start-date-${eventTitle}`}
								type="date"
								value={startDate}
								onChange={(event) => setStartDate(event.target.value)}
							/>
						</div>

						<div className="grid gap-2">
							<Label htmlFor={`end-date-${eventTitle}`}>End Date</Label>
							<Input
								id={`end-date-${eventTitle}`}
								type="date"
								value={endDate}
								onChange={(event) => setEndDate(event.target.value)}
								min={startDate || undefined}
							/>
						</div>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button
							type="button"
							variant="outline">
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="button"
						onClick={handleSave}
						disabled={!canSave}>
						{isSaving ? "Saving..." : "Save"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
