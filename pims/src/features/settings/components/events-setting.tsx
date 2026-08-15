import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EventType } from "@/features/events";
import { useEventStore } from "@/stores/use-event-store";
import { IconCalendarEvent, IconLoader2 } from "@tabler/icons-react";
import { formatDate } from "@/lib/date";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const EVENT_TYPES: { type: EventType; label: string; description: string }[] = [
	{
		type: "special",
		label: "Special Project",
		description: "Individual or group-based special project submissions",
	},
	{
		type: "capstone",
		label: "Capstone Project",
		description: "Final-year capstone project proposals",
	},
	{
		type: "master-thesis",
		label: "Master / Thesis",
		description: "Graduate-level master thesis submissions",
	},
];

type DeadlineForm = {
	title: string;
	description: string;
	startDate: string;
	endDate: string;
};

const EMPTY_FORM: DeadlineForm = {
	title: "",
	description: "",
	startDate: "",
	endDate: "",
};

export default function EventsSetting() {
	const enrollmentByEvent = useEventStore((state) => state.enrollmentByEvent);
	const eventConfigurations = useEventStore((state) => state.eventConfigurations);
	const fetchEventStatuses = useEventStore((state) => state.fetchEventStatuses);
	const isLoadingStatuses = useEventStore((state) => state.isLoadingStatuses);
	const createProjectEvent = useEventStore((state) => state.createProjectEvent);
	const toggleEnrollmentWindow = useEventStore((state) => state.toggleEnrollmentWindow);

	const [dialogType, setDialogType] = useState<EventType | null>(null);
	const [form, setForm] = useState<DeadlineForm>(EMPTY_FORM);
	const [isSaving, setIsSaving] = useState(false);

	useEffect(() => {
		void fetchEventStatuses();
	}, [fetchEventStatuses]);

	function openDialog(type: EventType) {
		const existing = eventConfigurations[type];
		setForm(
			existing
				? {
						title: existing.title,
						description: existing.description,
						startDate: existing.startDate?.split("T")[0] ?? "",
						endDate: existing.endDate?.split("T")[0] ?? "",
					}
				: EMPTY_FORM,
		);
		setDialogType(type);
	}

	function closeDialog() {
		setDialogType(null);
		setForm(EMPTY_FORM);
	}

	async function handleToggleOff(type: EventType) {
		try {
			await toggleEnrollmentWindow(type);
			toast.success(`${EVENT_TYPES.find((e) => e.type === type)?.label} enrollment closed.`);
		} catch {
			toast.error("Failed to close enrollment.");
		}
	}

	async function handleSave() {
		if (!dialogType) return;
		if (!form.title.trim() || !form.startDate || !form.endDate) {
			toast.error("Title, start date, and end date are required.");
			return;
		}

		try {
			setIsSaving(true);
			await createProjectEvent(dialogType, form);
			toast.success(`${EVENT_TYPES.find((e) => e.type === dialogType)?.label} enrollment opened.`);
			closeDialog();
		} catch (err: any) {
			toast.error(err?.response?.data?.message ?? "Failed to open enrollment.");
		} finally {
			setIsSaving(false);
		}
	}

	const activeDialog = dialogType ? EVENT_TYPES.find((e) => e.type === dialogType) : null;

	return (
		<section className="space-y-3">
			<div>
				<p className="text-sm font-semibold">Enrollment Windows</p>
				<p className="text-xs text-muted-foreground mt-0.5">
					Open or close proposal submissions for each project type. Toggling on requires setting a deadline.
				</p>
			</div>

			<div className="divide-y divide-border rounded-xl border">
				{EVENT_TYPES.map(({ type, label, description }) => {
					const isOpen = enrollmentByEvent[type];
					const config = eventConfigurations[type];

					return (
						<div key={type} className="flex items-center gap-4 px-5 py-4">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-muted">
								<IconCalendarEvent size={17} className="text-muted-foreground" />
							</div>

							<div className="flex-1 min-w-0">
								<p className="text-sm font-medium">{label}</p>
								<p className="text-xs text-muted-foreground truncate">
									{isOpen && config
										? `Open · ${formatDate(config.startDate)} → ${formatDate(config.endDate)}`
										: description}
								</p>
							</div>

							<div className="flex items-center gap-2 shrink-0">
								{isOpen && (
									<span className="text-xs font-medium text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-0.5">
										Open
									</span>
								)}

								{/* Toggle switch */}
								<button
									type="button"
									role="switch"
									aria-checked={isOpen}
									disabled={isLoadingStatuses}
									onClick={() => (isOpen ? handleToggleOff(type) : openDialog(type))}
									className={`relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 ${
										isOpen ? "bg-primary" : "bg-muted-foreground/30"
									}`}>
									<span
										className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white shadow transition-transform ${
											isOpen ? "translate-x-5" : "translate-x-0"
										}`}
									/>
								</button>
							</div>
						</div>
					);
				})}
			</div>

			{/* Deadline dialog — shown when toggling ON */}
			<Dialog open={!!dialogType} onOpenChange={(v) => !v && closeDialog()}>
				<DialogContent className="sm:max-w-md">
					<DialogHeader>
						<DialogTitle>Open {activeDialog?.label} Enrollment</DialogTitle>
					</DialogHeader>

					<div className="space-y-4 py-1">
						<div className="space-y-1.5">
							<Label htmlFor="ev-title">
								Title <span className="text-destructive">*</span>
							</Label>
							<Input
								id="ev-title"
								placeholder="e.g. Special Project 2025 – Batch 14"
								value={form.title}
								onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
								disabled={isSaving}
							/>
						</div>

						<div className="space-y-1.5">
							<Label htmlFor="ev-desc">Description</Label>
							<Textarea
								id="ev-desc"
								placeholder="Instructions or notes for students…"
								rows={3}
								value={form.description}
								onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
								disabled={isSaving}
								className="resize-none"
							/>
						</div>

						<div className="grid grid-cols-2 gap-3">
							<div className="space-y-1.5">
								<Label htmlFor="ev-start">
									Start Date <span className="text-destructive">*</span>
								</Label>
								<Input
									id="ev-start"
									type="date"
									value={form.startDate}
									min={new Date().toISOString().split("T")[0]}
									onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
									disabled={isSaving}
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="ev-end">
									End Date <span className="text-destructive">*</span>
								</Label>
								<Input
									id="ev-end"
									type="date"
									value={form.endDate}
									min={form.startDate || undefined}
									onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
									disabled={isSaving}
								/>
							</div>
						</div>
					</div>

					<DialogFooter>
						<Button variant="outline" onClick={closeDialog} disabled={isSaving}>
							Cancel
						</Button>
						<Button
							onClick={handleSave}
							disabled={isSaving}
							className="bg-primary-600 hover:bg-primary-600/90 text-white gap-2">
							{isSaving && <IconLoader2 size={14} className="animate-spin" />}
							{isSaving ? "Opening…" : "Open Enrollment"}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</section>
	);
}
