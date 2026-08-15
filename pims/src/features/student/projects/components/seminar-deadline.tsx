import { updateSeminarDeadlines } from "../services/student-project.service";
import { toInputDateTime } from "@/lib/date";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClient } from "@tanstack/react-query";
import { Loader2, Save } from "lucide-react";
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
	const canEditMidDeadline = !isMidSeminarCompleted;
	const canEditFinalDeadline = isMidSeminarCompleted;

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
		<Card className="border-gray-200 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg font-medium">
					Set Seminar Deadlines
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-5">
					<div className="space-y-2">
						<label
							htmlFor="mid-seminar-deadline"
							className="text-sm font-medium text-foreground">
							Mid-term seminar deadline
						</label>
						<input
							id="mid-seminar-deadline"
							type="datetime-local"
							value={midDeadline}
							onChange={(event) => setMidDeadline(event.target.value)}
							disabled={!canEditMidDeadline || isSaving}
							className="border-input bg-background mt-2 w-full rounded-md border px-3 py-2 text-sm"
						/>
						{!canEditMidDeadline && (
							<p className="text-xs text-muted-foreground">
								Mid-term seminar is completed, so this deadline is locked.
							</p>
						)}
					</div>

					<div className="space-y-2">
						<label
							htmlFor="final-seminar-deadline"
							className="text-sm font-medium  text-foreground">
							Final seminar deadline
						</label>
						<input
							id="final-seminar-deadline"
							type="datetime-local"
							value={finalDeadline}
							onChange={(event) => setFinalDeadline(event.target.value)}
							disabled={!canEditFinalDeadline || isSaving}
							className="border-input bg-background mt-2 w-full rounded-md border px-3 py-2 text-sm"
						/>
						{!canEditFinalDeadline && (
							<p className="text-xs text-muted-foreground">
								Complete mid-term seminar first to set this deadline.
							</p>
						)}
					</div>
				</div>

				<button
					type="button"
					onClick={() => void saveSeminarDeadlines()}
					disabled={isSaving}
					className="bg-primary-600 text-white hover:bg-primary-500 inline-flex w-full items-center justify-center gap-2 rounded-md px-3 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-70">
					{isSaving ? (
						<Loader2 className="h-4 w-4 animate-spin" />
					) : (
						<Save className="h-4 w-4" />
					)}
					{isSaving ? "Saving..." : "Save deadlines"}
				</button>
			</CardContent>
		</Card>
	);
}
