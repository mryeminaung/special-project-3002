import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { HasRole } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Calendar, Loader2, Presentation, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type SeminarCardProps = {
	slug: string;
	midSeminarDeadline?: string | null;
	finalSeminarDeadline?: string | null;
	progressStatus?: {
		midSeminar?: boolean;
		finalSeminar?: boolean;
	};
};

type SeminarStatusValue = "not completed" | "completed";

function formatDisplayDateTime(value?: string | null): string {
	if (!value) return "Not scheduled";
	const date = new Date(value);

	if (Number.isNaN(date.getTime())) return "Not scheduled";

	return date.toLocaleString(undefined, {
		month: "short",
		day: "numeric",
		year: "numeric",
		hour: "numeric",
		minute: "2-digit",
		hour12: true,
	});
}

export default function SeminarCard({
	slug,
	midSeminarDeadline,
	finalSeminarDeadline,
	progressStatus,
}: SeminarCardProps) {
	const isSupervisor = HasRole("Supervisor");
	const queryClient = useQueryClient();
	const [savingType, setSavingType] = useState<"mid" | "final" | null>(null);

	const getInitialStatus = (isNotCompleted?: boolean): SeminarStatusValue => {
		if (typeof isNotCompleted === "boolean") {
			return isNotCompleted ? "not completed" : "completed";
		}

		return "not completed";
	};

	const [midSeminarStatus, setMidSeminarStatus] = useState<SeminarStatusValue>(
		getInitialStatus(progressStatus?.midSeminar),
	);
	const [finalSeminarStatus, setFinalSeminarStatus] =
		useState<SeminarStatusValue>(
			getInitialStatus(progressStatus?.finalSeminar),
		);

	useEffect(() => {
		setMidSeminarStatus(getInitialStatus(progressStatus?.midSeminar));
		setFinalSeminarStatus(getInitialStatus(progressStatus?.finalSeminar));
	}, [progressStatus?.finalSeminar, progressStatus?.midSeminar]);

	const saveSeminarStatus = async (
		type: "mid" | "final",
		status: SeminarStatusValue,
	) => {
		try {
			setSavingType(type);
			await api.patch(`/projects/${slug}/seminar-status`, {
				type,
				status,
			});

			await queryClient.invalidateQueries({
				queryKey: ["projectDetail", slug],
			});

			toast.success(
				`${type === "mid" ? "Mid-term" : "Final"} seminar status updated.`,
			);
		} catch (error: any) {
			const message =
				error?.response?.data?.message || "Failed to update seminar status.";
			toast.error(message);
		} finally {
			setSavingType(null);
		}
	};

	return (
		<Card className="border-gray-200 shadow-sm">
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-sm font-bold uppercase tracking-widest">
					<Presentation className="size-5 stroke-2 text-primary-600" />
					Project Seminars
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div>
					<p className="font-semibold">Mid-term Seminar</p>
					<div className="mt-1 flex items-center gap-x-2">
						<Calendar className="size-3 stroke-2 text-primary-600" />
						<p className="flex items-center gap-1.5 text-sm">
							{formatDisplayDateTime(midSeminarDeadline)}
						</p>
					</div>

					{isSupervisor && (
						<div className="mt-3 flex items-center gap-2">
							<Select
								value={midSeminarStatus}
								onValueChange={(value) =>
									setMidSeminarStatus(value as SeminarStatusValue)
								}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Seminar status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="not completed">Not completed</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectContent>
							</Select>
							<Button
								onClick={() => void saveSeminarStatus("mid", midSeminarStatus)}
								disabled={savingType === "mid"}
								className="gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500">
								{savingType === "mid" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)}
								{savingType === "mid" ? "Saving" : "Save"}
							</Button>
						</div>
					)}
				</div>

				<div>
					<p className="font-semibold">Final Seminar</p>
					<div className="mt-1 flex items-center gap-x-2">
						<Calendar className="size-3 stroke-2 text-primary-600" />
						<p className="flex items-center gap-1.5 text-sm">
							{formatDisplayDateTime(finalSeminarDeadline)}
						</p>
					</div>

					{isSupervisor && (
						<div className="mt-3 flex items-center gap-2">
							<Select
								value={finalSeminarStatus}
								onValueChange={(value) =>
									setFinalSeminarStatus(value as SeminarStatusValue)
								}>
								<SelectTrigger className="w-full">
									<SelectValue placeholder="Seminar status" />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="not completed">Not completed</SelectItem>
									<SelectItem value="completed">Completed</SelectItem>
								</SelectContent>
							</Select>
							<Button
								onClick={() =>
									void saveSeminarStatus("final", finalSeminarStatus)
								}
								disabled={savingType === "final"}
								className="gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500">
								{savingType === "final" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : (
									<Save className="h-4 w-4" />
								)}
								{savingType === "final" ? "Saving" : "Save"}
							</Button>
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
