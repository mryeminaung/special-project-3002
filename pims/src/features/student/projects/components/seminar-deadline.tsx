import { updateSeminarDeadlines } from "../services/student-project.service";
import { toInputDateTime, formatDateTime } from "@/lib/date";
import { useCan } from "@/hooks/use-can";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SeminarCardProps = {
	slug: string;
	midSeminarDeadline?: string | null;
	finalSeminarDeadline?: string | null;
	progressStatus?: {
		midSeminar?: boolean;
	};
};

export default function SeminarDeadline({
	slug,
	midSeminarDeadline,
	finalSeminarDeadline,
	progressStatus,
}: SeminarCardProps) {
	const { can } = useCan();
	const queryClient = useQueryClient();
	const [isSaving, setIsSaving] = useState(false);
	const [midDeadline, setMidDeadline] = useState(
		toInputDateTime(midSeminarDeadline),
	);
	const [finalDeadline, setFinalDeadline] = useState(
		toInputDateTime(finalSeminarDeadline),
	);

	useEffect(() => {
		setMidDeadline(toInputDateTime(midSeminarDeadline));
		setFinalDeadline(toInputDateTime(finalSeminarDeadline));
	}, [finalSeminarDeadline, midSeminarDeadline]);

	const isMidSeminarCompleted = !!progressStatus?.midSeminar;
	const isFinalSeminarCompleted = !!progressStatus?.finalSeminar;
	const canEditMidDeadline = !isMidSeminarCompleted;
	const canEditFinalDeadline = isMidSeminarCompleted && !isFinalSeminarCompleted;

	const saveSeminarDeadlines = async () => {
		if (!midDeadline) {
			toast.error("Please select a mid-term seminar deadline.");
			return;
		}

		if (canEditFinalDeadline && !finalDeadline) {
			toast.error("Please select a final seminar deadline.");
			return;
		}

		if (!canEditFinalDeadline && finalDeadline) {
			toast.error(
				"Final seminar deadline can be set only after mid-term seminar is completed.",
			);
			return;
		}

		const payload: {
			midSeminarDeadline?: string;
			finalSeminarDeadline?: string;
		} = {};

		if (canEditMidDeadline) {
			payload.midSeminarDeadline = midDeadline;
		}

		if (canEditFinalDeadline && finalDeadline) {
			payload.finalSeminarDeadline = finalDeadline;
		}

		if (!payload.midSeminarDeadline && !payload.finalSeminarDeadline) {
			toast.error("No deadline change is allowed in the current state.");
			return;
		}

		try {
			setIsSaving(true);
			await updateSeminarDeadlines(slug, payload);

			await queryClient.invalidateQueries({
				queryKey: ["projectDetail", slug],
			});

			toast.success("Seminar deadlines updated successfully.");
		} catch (error: any) {
			const message =
				error?.response?.data?.message || "Failed to update seminar deadlines.";
			toast.error(message);
		} finally {
			setIsSaving(false);
		}
	};

	return (
		<div className="rounded-xl border px-5 py-4">
			<div className="flex items-center gap-2 mb-1">
				<Calendar size={14} />
				<p className="text-sm font-semibold">Seminar Deadlines</p>
			</div>

			{can('set-seminar-deadlines') ? (
				<>
					<p className="text-xs text-muted-foreground mb-3">
						Set deadlines for mid-term and final seminars.
					</p>

					<div className="space-y-4">
						<div className="space-y-1.5">
							<label
								htmlFor="mid-seminar-deadline"
								className="text-xs font-medium text-muted-foreground">
								Mid-term seminar
							</label>
							<input
								id="mid-seminar-deadline"
								type="datetime-local"
								value={midDeadline}
								onChange={(event) => setMidDeadline(event.target.value)}
								disabled={!canEditMidDeadline || isSaving}
								className="border-input bg-background w-full rounded-md border px-3 py-1.5 text-sm"
							/>
							{!canEditMidDeadline && (
								<p className="text-xs text-muted-foreground">
									Locked - seminar completed
								</p>
							)}
						</div>

						<div className="space-y-1.5">
							<label
								htmlFor="final-seminar-deadline"
								className="text-xs font-medium text-muted-foreground">
								Final seminar
							</label>
							<input
								id="final-seminar-deadline"
								type="datetime-local"
								value={finalDeadline}
								onChange={(event) => setFinalDeadline(event.target.value)}
								disabled={!canEditFinalDeadline || isSaving}
								className="border-input bg-background w-full rounded-md border px-3 py-1.5 text-sm"
							/>
							{!canEditFinalDeadline && (
								<p className="text-xs text-muted-foreground">
									{isFinalSeminarCompleted ? "Locked - seminar completed" : "Complete mid-term first"}
								</p>
							)}
						</div>
					</div>

					<button
						type="button"
						onClick={() => void saveSeminarDeadlines()}
						disabled={isSaving}
						className="bg-primary-600 text-white hover:bg-primary-500 mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-70">
						{isSaving ? (
							<Loader2 className="h-3.5 w-3.5 animate-spin" />
						) : (
							<Save className="h-3.5 w-3.5" />
						)}
						{isSaving ? "Saving..." : "Save deadlines"}
					</button>
				</>
			) : (
				<>
					<p className="text-xs text-muted-foreground mb-3">
						Assigned deadlines for seminars.
					</p>

					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground">Mid-term seminar</p>
								<p className="text-sm">{midSeminarDeadline ? formatDateTime(midSeminarDeadline) : "Not set"}</p>
							</div>
							{isMidSeminarCompleted ? (
								<span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
									Completed
								</span>
							) : (
								<span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
									Pending
								</span>
							)}
						</div>

						<div className="flex items-center justify-between">
							<div>
								<p className="text-xs font-medium text-muted-foreground">Final seminar</p>
								<p className="text-sm">{finalSeminarDeadline ? formatDateTime(finalSeminarDeadline) : "Not set"}</p>
							</div>
							{isFinalSeminarCompleted ? (
								<span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
									Completed
								</span>
							) : (
								<span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
									Pending
								</span>
							)}
						</div>
					</div>
				</>
			)}
		</div>
	);
}
