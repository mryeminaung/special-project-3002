import { updateSeminarStatus } from "../services/student-project.service";
import { formatDateTime } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useRoleChecker } from "@/hooks/use-role-checker";
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

export default function SeminarCard({
	slug,
	midSeminarDeadline,
	finalSeminarDeadline,
	progressStatus,
}: SeminarCardProps) {
	const { isSupervisor } = useRoleChecker();
	const queryClient = useQueryClient();
	const [savingType, setSavingType] = useState<"mid" | "final" | null>(null);

	const getInitialStatus = (isCompleted?: boolean): SeminarStatusValue => {
		if (typeof isCompleted === "boolean") {
			return isCompleted ? "completed" : "not completed";
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

	const isMidSeminarCompleted = progressStatus?.midSeminar === true;

	const saveSeminarStatus = async (
		type: "mid" | "final",
		status: SeminarStatusValue,
	) => {
		if (type === "final" && !isMidSeminarCompleted) {
			toast.error(
				"Final seminar status can be changed only after mid-term seminar is completed.",
			);
			return;
		}

		try {
			setSavingType(type);
			await updateSeminarStatus(slug, type, status);

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
					<p className="font-semibold">
						Mid-term Seminar
						<Badge className="bg-primary-600 ml-2">{midSeminarStatus}</Badge>
					</p>
					<div className="mt-1 flex items-center gap-x-2">
						<Calendar className="size-3 stroke-2 text-primary-600" />
						<p className="flex items-center gap-1.5 text-sm">
							{formatDateTime(midSeminarDeadline)}
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
					<p className="font-semibold">
						Final Seminar
						<Badge className="bg-primary-600 ml-2">{finalSeminarStatus}</Badge>
					</p>
					<div className="mt-1 flex items-center gap-x-2">
						<Calendar className="size-3 stroke-2 text-primary-600" />
						<p className="flex items-center gap-1.5 text-sm">
							{formatDateTime(finalSeminarDeadline)}
						</p>
					</div>

					{isSupervisor && (
						<>
							<div className="mt-3 flex items-center gap-2">
								<Select
									value={finalSeminarStatus}
									onValueChange={(value) =>
										setFinalSeminarStatus(value as SeminarStatusValue)
									}>
									<SelectTrigger
										className="w-full"
										disabled={!isMidSeminarCompleted || savingType === "final"}>
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
									disabled={savingType === "final" || !isMidSeminarCompleted}
									className="gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500">
									{savingType === "final" ? (
										<Loader2 className="h-4 w-4 animate-spin" />
									) : (
										<Save className="h-4 w-4" />
									)}
									{savingType === "final" ? "Saving" : "Save"}
								</Button>
							</div>
							{!isMidSeminarCompleted && (
								<p className="mt-2 text-xs text-muted-foreground">
									Complete mid-term seminar first to update final seminar
									status.
								</p>
							)}
						</>
					)}
				</div>
			</CardContent>
		</Card>
	);
}
