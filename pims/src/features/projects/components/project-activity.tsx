import { cn } from "@/lib/utils";
import { formatDateTime } from "@/lib/date";
import { projectStatusColor } from "@/constants/badge-colors";
import { updateReportStatus, updateSeminarStatus } from "../services/project.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { IconCheck, IconClock, IconDownload, IconFileText, IconLoader2 } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

type ProjectActivityProps = {
	project?: {
		midReportUrl?: string | null;
		finalReportUrl?: string | null;
		mid_report_url?: string | null;
		final_report_url?: string | null;
		midSeminarDeadline?: string | null;
		finalSeminarDeadline?: string | null;
		mid_seminar_deadline?: string | null;
		final_seminar_deadline?: string | null;
		progressStatus?: ProgressStatus;
		midReport?: string;
		finalReport?: string;
		midSeminar?: string;
		finalSeminar?: string;
		file?: string | null;
	};
	isIC?: boolean;
	projectSlug?: string;
};

type ProgressStatus = {
	midReport?: boolean;
	finalReport?: boolean;
	midSeminar?: boolean;
	finalSeminar?: boolean;
};

type ActivityItem = {
	id: number;
	title: string;
	completed: boolean;
	detail: string;
	fileUrl?: string | null;
	reportType?: "mid" | "final";
	seminarType?: "mid" | "final";
};

type ResourceItem = {
	name: string;
	url: string;
};

function getFileNameFromUrl(url: string): string {
	try {
		const decodedPath = decodeURIComponent(url.split("?")[0]);
		return decodedPath.split("/").pop() || "Resource";
	} catch {
		return "Resource";
	}
}

export default function ProjectActivity({ project, isIC, projectSlug }: ProjectActivityProps) {
	const queryClient = useQueryClient();

	const midReportUrl = project?.midReportUrl ?? project?.mid_report_url;
	const finalReportUrl = project?.finalReportUrl ?? project?.final_report_url;
	const midSeminarDeadline = project?.midSeminarDeadline ?? project?.mid_seminar_deadline;
	const finalSeminarDeadline = project?.finalSeminarDeadline ?? project?.final_seminar_deadline;

	const ps = project?.progressStatus;
	const midReportCompleted = ps?.midReport ?? project?.midReport === "submitted";
	const finalReportCompleted = ps?.finalReport ?? project?.finalReport === "submitted";
	const midSeminarCompleted = ps?.midSeminar ?? project?.midSeminar === "completed";
	const finalSeminarCompleted = ps?.finalSeminar ?? project?.finalSeminar === "completed";

	const reportMutation = useMutation({
		mutationFn: ({ type, status }: { type: "mid" | "final"; status: "submitted" | "not submitted" }) =>
			updateReportStatus(projectSlug!, type, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projectDetail", projectSlug] });
		},
		onError: () => toast.error("Failed to update report status."),
	});

	const seminarMutation = useMutation({
		mutationFn: ({ type, status }: { type: "mid" | "final"; status: "completed" | "not completed" }) =>
			updateSeminarStatus(projectSlug!, type, status),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["projectDetail", projectSlug] });
		},
		onError: () => toast.error("Failed to update seminar status."),
	});

	const activities: ActivityItem[] = [
		{
			id: 1,
			title: "Midterm Report",
			completed: !!midReportCompleted,
			detail: `Deadline: ${formatDateTime(midSeminarDeadline)}`,
			fileUrl: midReportUrl,
			reportType: "mid",
		},
		{
			id: 2,
			title: "Midterm Seminar",
			completed: !!midSeminarCompleted,
			detail: `Deadline: ${formatDateTime(midSeminarDeadline)}`,
			seminarType: "mid",
		},
		{
			id: 3,
			title: "Final Report",
			completed: !!finalReportCompleted,
			detail: `Deadline: ${formatDateTime(finalSeminarDeadline)}`,
			fileUrl: finalReportUrl,
			reportType: "final",
		},
		{
			id: 4,
			title: "Final Seminar",
			completed: !!finalSeminarCompleted,
			detail: `Deadline: ${formatDateTime(finalSeminarDeadline)}`,
			seminarType: "final",
		},
	];

	const resources: ResourceItem[] = [
		{ name: "Proposal Document", url: project?.file || "" },
		{ name: "Midterm Report", url: midReportUrl || "" },
		{ name: "Final Report", url: finalReportUrl || "" },
	].filter((r) => Boolean(r.url));

	function handleToggle(item: ActivityItem) {
		if (!projectSlug) return;
		if (item.reportType) {
			reportMutation.mutate({
				type: item.reportType,
				status: item.completed ? "not submitted" : "submitted",
			});
		} else if (item.seminarType) {
			seminarMutation.mutate({
				type: item.seminarType,
				status: item.completed ? "not completed" : "completed",
			});
		}
	}

	const isMutating = reportMutation.isPending || seminarMutation.isPending;

	return (
		<div className="space-y-6">
			<div>
				<p className="text-sm font-semibold mb-0.5">Project Activities</p>
				<p className="text-xs text-muted-foreground">Track progress and key milestones.</p>
			</div>

			<div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
				{/* Timeline stepper */}
				<div className="lg:col-span-3">
					<ol className="relative">
						{activities.map((item, i) => {
							const isLast = i === activities.length - 1;
							return (
								<li key={item.id} className="relative flex gap-4 pb-8 last:pb-0">
									{!isLast && (
										<div className="absolute left-[15px] top-8 bottom-0 w-px bg-border" />
									)}

									{/* Step dot */}
									<div
										className={cn(
											"relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
											item.completed
												? "border-primary-600 bg-primary-600 text-white"
												: "border-border bg-background text-muted-foreground",
										)}>
										{item.completed ? (
											<IconCheck size={14} stroke={3} />
										) : (
											<IconClock size={14} stroke={2} />
										)}
									</div>

									{/* Content */}
									<div className="flex-1 min-w-0 pt-0.5">
										<div className="flex flex-wrap items-center justify-between gap-2 mb-1">
											<p className={cn("text-sm font-semibold", !item.completed && "text-muted-foreground")}>
												{item.title}
											</p>
											<div className="flex items-center gap-2">
												<span
													className={cn(
														"text-xs font-medium px-2 py-0.5 rounded-full border capitalize",
														projectStatusColor(item.completed ? "completed" : "pending"),
													)}>
													{item.completed ? "Completed" : "Pending"}
												</span>
												{isIC && projectSlug && (
													<Button
														size="sm"
														variant="outline"
														disabled={isMutating}
														onClick={() => handleToggle(item)}
														className="h-6 px-2 text-xs">
														{isMutating ? (
															<IconLoader2 size={12} className="animate-spin" />
														) : item.completed ? (
															"Mark Pending"
														) : (
															"Mark Done"
														)}
													</Button>
												)}
											</div>
										</div>
										<p className="text-xs text-muted-foreground mb-1">{item.detail}</p>
										{/* File download row (shown when file exists) */}
										{item.fileUrl && (
											<a
												href={item.fileUrl}
												target="_blank"
												rel="noopener noreferrer"
												className="inline-flex items-center gap-1.5 text-xs text-primary-600 hover:text-primary-700 font-medium mt-1">
												<IconDownload size={13} />
												{getFileNameFromUrl(item.fileUrl)}
											</a>
										)}
										{item.reportType && !item.fileUrl && (
											<p className="text-xs text-muted-foreground/60 mt-1 italic">No report uploaded</p>
										)}
									</div>
								</li>
							);
						})}
					</ol>
				</div>

				{/* Resources */}
				<div className="lg:col-span-2">
					<div className="flex items-center gap-2 mb-4">
						<IconFileText size={15} className="text-muted-foreground" />
						<p className="text-sm font-semibold">Resources</p>
					</div>
					{resources.length === 0 ? (
						<p className="text-sm text-muted-foreground">No resources available yet.</p>
					) : (
						<div className="space-y-2">
							{resources.map((resource) => (
								<div
									key={resource.url}
									className="flex items-center justify-between gap-3 rounded-lg bg-muted/40 px-4 py-3">
									<div className="min-w-0">
										<p className="text-xs text-muted-foreground mb-0.5">{resource.name}</p>
										<p className="text-sm font-medium truncate">
											{getFileNameFromUrl(resource.url)}
										</p>
									</div>
									<a
										href={resource.url}
										target="_blank"
										rel="noopener noreferrer"
										className="shrink-0">
										<Button size="sm" variant="outline" className="gap-1.5 h-8 text-xs">
											<IconDownload size={13} />
											Download
										</Button>
									</a>
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
