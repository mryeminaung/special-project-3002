import api from "@/api/api";
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
import { IconLoader2, IconPaperclip, IconTrash, IconUpload } from "@tabler/icons-react";
import { type ReactNode, useState, useEffect, useRef } from "react";
import { toast } from "sonner";
import type { EventType } from "../events.type";

type EventConfigValues = {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
	formatUrl?: string | null;
};

type EventSelectionModalProps = {
	eventType: EventType;
	eventTitle: string;
	mode?: "create" | "edit";
	initialValues?: EventConfigValues;
	children: ReactNode;
};

async function uploadFormatFile(file: File): Promise<string> {
	const formData = new FormData();
	formData.append("file", file);
	const res = await api.post("/upload-proposal-format", formData, {
		headers: { "Content-Type": "multipart/form-data" },
	});
	return res.data?.data?.url as string;
}

function getFileName(url: string) {
	try {
		return decodeURIComponent(url.split("?")[0]).split("/").pop() ?? "format-document";
	} catch {
		return "format-document";
	}
}

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
	const [formatUrl, setFormatUrl] = useState<string | null>(null);
	const [isUploading, setIsUploading] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const fileInputRef = useRef<HTMLInputElement>(null);

	useEffect(() => {
		if (open && mode === "edit" && initialValues) {
			setTitle(initialValues.title);
			setDescription(initialValues.description);
			setStartDate(initialValues.startDate?.split("T")[0] ?? "");
			setEndDate(initialValues.endDate?.split("T")[0] ?? "");
			setFormatUrl(initialValues.formatUrl ?? null);
		}
	}, [open, mode, initialValues]);

	const canSave =
		title.trim().length > 0 &&
		startDate.length > 0 &&
		endDate.length > 0 &&
		!isSaving &&
		!isUploading;

	function resetForm() {
		setTitle("");
		setDescription("");
		setStartDate("");
		setEndDate("");
		setFormatUrl(null);
	}

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);
		if (!nextOpen) resetForm();
	}

	async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
		const file = e.target.files?.[0];
		if (!file) return;
		try {
			setIsUploading(true);
			const url = await uploadFormatFile(file);
			setFormatUrl(url);
			toast.success("Format document uploaded.");
		} catch {
			toast.error("Failed to upload format document.");
		} finally {
			setIsUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
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
				formatUrl,
			};

			if (mode === "edit") {
				await updateProjectEvent(eventType, config);
				toast.success("Event details updated.");
			} else {
				await createProjectEvent(eventType, config);
				toast.success("Enrollment opened.");
			}

			setOpen(false);
			resetForm();
		} catch (error: any) {
			toast.error(
				error?.response?.data?.message ??
					(mode === "edit" ? "Failed to update event." : "Failed to open enrollment."),
			);
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
						{mode === "edit" ? "Edit" : "Open"} — {eventTitle} Enrollment
					</DialogTitle>
				</DialogHeader>

				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor={`ev-title-${eventType}`}>
							Title <span className="text-destructive">*</span>
						</Label>
						<Input
							id={`ev-title-${eventType}`}
							placeholder="e.g. Special Project 2025 – Batch 14"
							value={title}
							onChange={(e) => setTitle(e.target.value)}
							disabled={isSaving}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor={`ev-desc-${eventType}`}>Description</Label>
						<Textarea
							id={`ev-desc-${eventType}`}
							placeholder="Instructions or notes for students…"
							className="min-h-24 resize-none"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							disabled={isSaving}
						/>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="grid gap-2">
							<Label htmlFor={`ev-start-${eventType}`}>
								Start Date <span className="text-destructive">*</span>
							</Label>
							<Input
								id={`ev-start-${eventType}`}
								type="date"
								value={startDate}
								min={new Date().toISOString().split("T")[0]}
								onChange={(e) => setStartDate(e.target.value)}
								disabled={isSaving}
							/>
						</div>
						<div className="grid gap-2">
							<Label htmlFor={`ev-end-${eventType}`}>
								End Date <span className="text-destructive">*</span>
							</Label>
							<Input
								id={`ev-end-${eventType}`}
								type="date"
								value={endDate}
								min={startDate || undefined}
								onChange={(e) => setEndDate(e.target.value)}
								disabled={isSaving}
							/>
						</div>
					</div>

					{/* Proposal format upload */}
					<div className="grid gap-2">
						<Label>Proposal Format <span className="text-xs text-muted-foreground font-normal">(optional)</span></Label>
						{formatUrl ? (
							<div className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2">
								<IconPaperclip size={14} className="text-primary-600 shrink-0" />
								<a
									href={`http://localhost:8000/${formatUrl}`}
									target="_blank"
									rel="noopener noreferrer"
									className="flex-1 text-xs text-primary-600 hover:underline truncate">
									{getFileName(formatUrl)}
								</a>
								<button
									type="button"
									onClick={() => setFormatUrl(null)}
									className="text-muted-foreground hover:text-destructive shrink-0">
									<IconTrash size={13} />
								</button>
							</div>
						) : (
							<button
								type="button"
								onClick={() => fileInputRef.current?.click()}
								disabled={isUploading || isSaving}
								className="flex items-center gap-2 rounded-lg border border-dashed px-3 py-2.5 text-xs text-muted-foreground hover:border-primary-400 hover:text-primary-600 transition-colors disabled:opacity-50">
								{isUploading ? (
									<IconLoader2 size={14} className="animate-spin" />
								) : (
									<IconUpload size={14} />
								)}
								{isUploading ? "Uploading…" : "Upload PDF / DOC / DOCX"}
							</button>
						)}
						<input
							ref={fileInputRef}
							type="file"
							accept=".pdf,.doc,.docx"
							className="hidden"
							onChange={handleFileChange}
						/>
					</div>
				</div>

				<DialogFooter>
					<DialogClose asChild>
						<Button type="button" variant="outline" disabled={isSaving || isUploading}>
							Cancel
						</Button>
					</DialogClose>
					<Button
						type="button"
						onClick={handleSave}
						disabled={!canSave}
						className="bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-50">
						{isSaving && <IconLoader2 size={14} className="animate-spin mr-1" />}
						{isSaving ? "Saving…" : mode === "edit" ? "Update" : "Open Enrollment"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
