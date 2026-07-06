import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Download, FileText, Loader2, Save } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

type ReportStatusValue = "not submitted" | "submitted";

type ReportStatusProps = {
	slug: string;
	midReportUrl?: string | null;
	finalReportUrl?: string | null;
	progressStatus?: {
		midReport?: boolean;
		finalReport?: boolean;
	};
};

type ReportSectionProps = {
	label: string;
	status: ReportStatusValue;
	onStatusChange: (value: ReportStatusValue) => void;
	onSaveStatus: () => Promise<void>;
	isSaving: boolean;
	documentUrl?: string | null;
	description: string;
};

function getFileNameFromUrl(url: string) {
	try {
		const decodedPath = decodeURIComponent(url.split("?")[0]);
		return decodedPath.split("/").pop() || "Uploaded report";
	} catch {
		return "Uploaded report";
	}
}

function ReportSection({
	label,
	status,
	onStatusChange,
	onSaveStatus,
	isSaving,
	documentUrl,
}: ReportSectionProps) {
	const hasDocument = Boolean(documentUrl);
	const fileName = documentUrl
		? getFileNameFromUrl(documentUrl)
		: "No document uploaded yet";
	const statusLabel = status === "submitted" ? "Submitted" : "Not submitted";
	const statusClassName =
		status === "submitted"
			? "border-emerald-200 bg-emerald-50 text-emerald-700"
			: "border-amber-200 bg-amber-50 text-amber-700";

	return (
		<Card className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
			<div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
				<p className="block text-lg font-semibold text-foreground">
					{label}
					<span
						className={cn(
							"inline-flex ml-3 w-fit rounded-full border px-3 py-1 text-xs font-semibold",
							statusClassName,
						)}>
						{statusLabel}
					</span>
				</p>

				<div className="flex w-full flex-col gap-2 sm:w-auto sm:min-w-52">
					<div className="flex items-center gap-3">
						<Button
							onClick={() => void onSaveStatus()}
							disabled={hasDocument ? false : true}
							className="w-full sm:w-fit gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500 hover:cursor-pointer">
							{isSaving ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Save className="h-4 w-4" />
							)}
							{isSaving ? "Saving" : "Save"}
						</Button>
						<Select
							value={status}
							onValueChange={(value) =>
								onStatusChange(value as ReportStatusValue)
							}>
							<SelectTrigger
								className="w-full sm:w-52"
								disabled={hasDocument ? false : true}>
								<SelectValue placeholder="Select status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="not submitted">Not submitted</SelectItem>
								<SelectItem value="submitted">Submitted</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
			</div>

			<div className="mt-4 flex flex-col gap-3 rounded-xl border border-dashed border-gray-200 bg-muted/30 p-4 sm:flex-row sm:items-center sm:justify-between">
				<div className="flex min-w-0 items-center gap-3">
					<div className="rounded-lg bg-primary-100 p-3">
						<FileText className="size-5 text-primary-600" />
					</div>
					<div className="min-w-0">
						<p className="truncate text-sm font-medium text-foreground">
							{fileName}
						</p>
						<p className="text-xs text-muted-foreground">
							{hasDocument
								? "Download the submitted report file"
								: "Add a document before downloading"}
						</p>
					</div>
				</div>

				{hasDocument ? (
					<Button
						asChild
						className="w-full gap-2 bg-primary-600 font-semibold text-white hover:bg-primary-500 sm:w-fit">
						<a
							href={documentUrl ?? undefined}
							target="_blank"
							rel="noopener noreferrer"
							download>
							<Download className="h-4 w-4" />
							Download
						</a>
					</Button>
				) : (
					<Button
						disabled
						className="w-full gap-2 sm:w-fit">
						<Download className="h-4 w-4" />
						Download
					</Button>
				)}
			</div>
		</Card>
	);
}

export default function ReportStatus({
	slug,
	midReportUrl,
	finalReportUrl,
	progressStatus,
}: ReportStatusProps) {
	const queryClient = useQueryClient();
	const getInitialStatus = (
		isNotSubmitted?: boolean,
		hasDocument?: boolean,
	): ReportStatusValue => {
		if (typeof isNotSubmitted === "boolean") {
			return isNotSubmitted ? "not submitted" : "submitted";
		}

		return hasDocument ? "submitted" : "not submitted";
	};

	const [midStatus, setMidStatus] = useState<ReportStatusValue>(
		getInitialStatus(progressStatus?.midReport, Boolean(midReportUrl)),
	);
	const [finalStatus, setFinalStatus] = useState<ReportStatusValue>(
		getInitialStatus(progressStatus?.finalReport, Boolean(finalReportUrl)),
	);
	const [savingType, setSavingType] = useState<"mid" | "final" | null>(null);

	const saveStatus = async (
		type: "mid" | "final",
		status: ReportStatusValue,
	) => {
		try {
			setSavingType(type);
			await api.patch(`/projects/${slug}/report-status`, {
				type,
				status,
			});

			await queryClient.invalidateQueries({
				queryKey: ["projectDetail", slug],
			});
			toast.success(
				`${type === "mid" ? "Mid-term" : "Final"} report status updated.`,
			);
		} catch (error: any) {
			const message =
				error?.response?.data?.message || "Failed to update report status.";
			toast.error(message);
		} finally {
			setSavingType(null);
		}
	};

	useEffect(() => {
		setMidStatus(
			getInitialStatus(progressStatus?.midReport, Boolean(midReportUrl)),
		);
		setFinalStatus(
			getInitialStatus(progressStatus?.finalReport, Boolean(finalReportUrl)),
		);
	}, [
		finalReportUrl,
		midReportUrl,
		progressStatus?.finalReport,
		progressStatus?.midReport,
	]);

	return (
		<>
			<ReportSection
				label="Mid-term Report"
				description="Track the mid-term report submission and download the document below."
				status={midStatus}
				onStatusChange={setMidStatus}
				onSaveStatus={() => saveStatus("mid", midStatus)}
				isSaving={savingType === "mid"}
				documentUrl={midReportUrl}
			/>
			<ReportSection
				label="Final Report"
				description="Track the final report submission and download the document below."
				status={finalStatus}
				onStatusChange={setFinalStatus}
				onSaveStatus={() => saveStatus("final", finalStatus)}
				isSaving={savingType === "final"}
				documentUrl={finalReportUrl}
			/>
		</>
	);
}
