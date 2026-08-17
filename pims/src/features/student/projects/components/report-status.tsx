import { approveReport } from "@/features/projects/services/project.service";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { Check, Download, FileText, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

type ReportStatusProps = {
	slug: string;
	midReportUrl?: string | null;
	finalReportUrl?: string | null;
	progressStatus?: {
		midReport?: boolean;
		finalReport?: boolean;
		midReportApproved?: boolean;
		finalReportApproved?: boolean;
	};
};

function getFileNameFromUrl(url: string) {
	try {
		const decodedPath = decodeURIComponent(url.split("?")[0]);
		return decodedPath.split("/").pop() || "Uploaded report";
	} catch {
		return "Uploaded report";
	}
}

type ReportSectionProps = {
	label: string;
	type: "mid" | "final";
	slug: string;
	documentUrl?: string | null;
	submitted: boolean;
	approved: boolean;
};

function ReportSection({ label, type, slug, documentUrl, submitted, approved }: ReportSectionProps) {
	const queryClient = useQueryClient();
	const [approving, setApproving] = useState(false);

	async function handleApprove() {
		try {
			setApproving(true);
			await approveReport(slug, type);
			await queryClient.invalidateQueries({ queryKey: ["projectDetail", slug] });
			toast.success(`${label} approved.`);
		} catch (err: any) {
			toast.error(err?.response?.data?.message ?? "Failed to approve report.");
		} finally {
			setApproving(false);
		}
	}

	const fileName = documentUrl ? getFileNameFromUrl(documentUrl) : null;

	return (
		<div className="rounded-xl border p-4">
			<div className="flex items-start justify-between gap-3 mb-3">
				<div>
					<p className="font-semibold text-sm">{label}</p>
					<div className="flex items-center gap-2 mt-1">
						{!submitted && (
							<span className="text-xs px-2 py-0.5 rounded-full border bg-muted text-muted-foreground">
								Not submitted
							</span>
						)}
						{submitted && !approved && (
							<span className="text-xs px-2 py-0.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-300">
								Awaiting approval
							</span>
						)}
						{approved && (
							<span className="text-xs px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-300 flex items-center gap-1">
								<Check size={10} />
								Approved
							</span>
						)}
					</div>
				</div>

				{submitted && !approved && (
					<Button
						size="sm"
						onClick={handleApprove}
						disabled={approving}
						className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shrink-0">
						{approving ? <Loader2 size={13} className="animate-spin" /> : <Check size={13} />}
						{approving ? "Approving…" : "Approve"}
					</Button>
				)}
			</div>

			{documentUrl ? (
				<div className="flex items-center gap-3 rounded-lg border border-dashed p-3">
					<div className="rounded-lg bg-primary-100 dark:bg-primary-900/40 p-2 shrink-0">
						<FileText className="size-4 text-primary-600 dark:text-primary-400" />
					</div>
					<div className="flex-1 min-w-0">
						<p className="truncate text-sm font-medium">{fileName}</p>
						<p className="text-xs text-muted-foreground">Submitted by student</p>
					</div>
					<Button
						asChild
						size="sm"
						variant="outline"
						className="gap-1.5 shrink-0">
						<a href={documentUrl} target="_blank" rel="noopener noreferrer">
							<Download size={13} />
							Download
						</a>
					</Button>
				</div>
			) : (
				<div className={cn("rounded-lg border border-dashed p-3 text-center")}>
					<p className="text-sm text-muted-foreground">No report uploaded yet.</p>
				</div>
			)}
		</div>
	);
}

export default function ReportStatus({
	slug,
	midReportUrl,
	finalReportUrl,
	progressStatus,
}: ReportStatusProps) {
	return (
		<div className="rounded-xl border px-5 py-4">
			<div className="flex items-center gap-2 mb-1">
				<FileText size={14} />
				<p className="text-sm font-semibold">Student Reports</p>
			</div>
			<p className="text-xs text-muted-foreground mb-3">
				Review submitted reports and approve them.
			</p>
			<div className="space-y-4">
				<ReportSection
					label="Mid-term Report"
					type="mid"
					slug={slug}
					documentUrl={midReportUrl}
					submitted={!!progressStatus?.midReport}
					approved={!!progressStatus?.midReportApproved}
				/>
				<ReportSection
					label="Final Report"
					type="final"
					slug={slug}
					documentUrl={finalReportUrl}
					submitted={!!progressStatus?.finalReport}
					approved={!!progressStatus?.finalReportApproved}
				/>
			</div>
		</div>
	);
}
