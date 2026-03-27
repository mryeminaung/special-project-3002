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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useEventStore, type EventType } from "@/stores/use-event-store";
import { useRef, useState } from "react";

const ACCEPTED_DOCUMENT_EXTENSIONS = ["pdf", "doc", "docx"];
const ACCEPTED_DOCUMENT_INPUT_TYPES =
	".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document";

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
	const saveEventConfiguration = useEventStore(
		(state) => state.saveEventConfiguration,
	);
	const [open, setOpen] = useState(false);
	const [eventDetail, setEventDetail] = useState("");
	const [submissionDeadline, setSubmissionDeadline] = useState("");
	const [extraDocument, setExtraDocument] = useState<File | null>(null);
	const [documentError, setDocumentError] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const canSave =
		eventDetail.trim().length > 0 &&
		submissionDeadline.length > 0 &&
		!documentError;

	function resetForm() {
		setEventDetail("");
		setSubmissionDeadline("");
		setExtraDocument(null);
		setDocumentError(null);
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	}

	function handleDocumentChange(event: React.ChangeEvent<HTMLInputElement>) {
		const selectedFile = event.target.files?.[0] ?? null;

		if (!selectedFile) {
			setExtraDocument(null);
			setDocumentError(null);
			return;
		}

		const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
		const isAllowed =
			!!fileExtension && ACCEPTED_DOCUMENT_EXTENSIONS.includes(fileExtension);

		if (!isAllowed) {
			setExtraDocument(null);
			setDocumentError("Only PDF, DOC, and DOCX files are allowed.");
			if (fileInputRef.current) {
				fileInputRef.current.value = "";
			}
			return;
		}

		setExtraDocument(selectedFile);
		setDocumentError(null);
	}

	function handleOpenChange(nextOpen: boolean) {
		setOpen(nextOpen);
		if (!nextOpen) {
			resetForm();
		}
	}

	function handleSave() {
		if (!canSave) {
			return;
		}

		saveEventConfiguration(eventType, {
			eventDetail: eventDetail.trim(),
			submissionDeadline,
			extraDocumentName: extraDocument?.name ?? null,
		});

		setOpen(false);
		resetForm();
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
					<DialogTitle>{eventTitle} Setup</DialogTitle>
					<DialogDescription>
						Enter event detail and submission deadline.
					</DialogDescription>
				</DialogHeader>

				<div className="grid gap-4">
					<div className="grid gap-2">
						<Label htmlFor={`event-detail-${eventTitle}`}>Event Detail</Label>
						<Textarea
							id={`event-detail-${eventTitle}`}
							placeholder="Describe this event"
							className="min-h-28 resize-none"
							value={eventDetail}
							onChange={(event) => setEventDetail(event.target.value)}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor={`submission-deadline-${eventTitle}`}>
							Submission Deadline
						</Label>
						<Input
							id={`submission-deadline-${eventTitle}`}
							type="date"
							value={submissionDeadline}
							onChange={(event) => setSubmissionDeadline(event.target.value)}
						/>
					</div>

					<div className="grid gap-2">
						<Label htmlFor={`extra-document-${eventTitle}`}>
							Extra Document (Optional)
						</Label>
						<Input
							ref={fileInputRef}
							id={`extra-document-${eventTitle}`}
							type="file"
							accept={ACCEPTED_DOCUMENT_INPUT_TYPES}
							onChange={handleDocumentChange}
						/>
						<p className="text-xs text-muted-foreground">
							Accepted formats: PDF, DOC, DOCX
						</p>
						{extraDocument && (
							<p className="text-xs text-muted-foreground">
								Selected file: {extraDocument.name}
							</p>
						)}
						{documentError && (
							<p className="text-xs text-destructive">{documentError}</p>
						)}
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
						Save
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
