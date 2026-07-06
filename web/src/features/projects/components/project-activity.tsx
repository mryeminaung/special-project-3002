import Heading from "@/components/heading";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { cn, PROJECT_STATUS_COLOR } from "@/lib/utils";
import {
	IconCheck,
	IconClock,
	IconDownload,
	IconFileText,
} from "@tabler/icons-react";

type ProgressStatus = {
	midReport?: boolean;
	finalReport?: boolean;
	midSeminar?: boolean;
	finalSeminar?: boolean;
};

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
		mid_report?: string;
		final_report?: string;
		mid_seminar?: string;
		final_seminar?: string;
		file?: string | null;
	};
};

type ActivityItem = {
	id: number;
	title: string;
	status: "completed" | "pending";
	detail: string;
};

type ResourceItem = {
	name: string;
	url: string;
};

function formatDisplayDate(value?: string | null): string {
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

function getFileNameFromUrl(url: string): string {
	try {
		const decodedPath = decodeURIComponent(url.split("?")[0]);
		return decodedPath.split("/").pop() || "Resource";
	} catch {
		return "Resource";
	}
}

function ActivityCard({ activity }: { activity: ActivityItem }) {
	const isCompleted = activity.status === "completed";

	return (
		<div className="flex items-center gap-x-3">
			<div
				className={`h-12 w-12 rounded-xl flex items-center justify-center ${
					isCompleted
						? "bg-primary-50 dark:bg-primary-500/10 text-primary-600"
						: "bg-neutral-100 dark:bg-neutral-800 text-neutral-400"
				}`}>
				{isCompleted ? (
					<IconCheck
						size={24}
						stroke={3}
					/>
				) : (
					<IconClock
						size={24}
						stroke={2}
					/>
				)}
			</div>
			<div className="flex-1">
				<div className="flex justify-between items-center">
					<h3
						className={`font-bold text-base ${isCompleted ? "text-neutral-800 dark:text-neutral-200" : "text-neutral-500"}`}>
						{activity.title}
					</h3>
					<Badge
						className={cn(
							PROJECT_STATUS_COLOR(activity.status),
							"font-mono capitalize px-3 rounded-md",
						)}>
						{activity.status}
					</Badge>
				</div>
				<p className="text-xs text-muted-foreground mt-1">{activity.detail}</p>
			</div>
		</div>
	);
}

export default function ProjectActivity({ project }: ProjectActivityProps) {
	const midReportUrl = project?.midReportUrl ?? project?.mid_report_url;
	const finalReportUrl = project?.finalReportUrl ?? project?.final_report_url;
	const midSeminarDeadline =
		project?.midSeminarDeadline ?? project?.mid_seminar_deadline;
	const finalSeminarDeadline =
		project?.finalSeminarDeadline ?? project?.final_seminar_deadline;

	const midReportCompleted =
		typeof project?.progressStatus?.midReport === "boolean"
			? !project.progressStatus.midReport
			: project?.mid_report === "submitted";
	const finalReportCompleted =
		typeof project?.progressStatus?.finalReport === "boolean"
			? !project.progressStatus.finalReport
			: project?.final_report === "submitted";
	const midSeminarCompleted =
		typeof project?.progressStatus?.midSeminar === "boolean"
			? !project.progressStatus.midSeminar
			: project?.mid_seminar === "completed";
	const finalSeminarCompleted =
		typeof project?.progressStatus?.finalSeminar === "boolean"
			? !project.progressStatus.finalSeminar
			: project?.final_seminar === "completed";

	const activities: ActivityItem[] = [
		{
			id: 1,
			title: "Midterm Report",
			status: midReportCompleted ? "completed" : "pending",
			detail: midReportUrl
				? getFileNameFromUrl(midReportUrl)
				: "No report uploaded",
		},
		{
			id: 2,
			title: "Midterm Seminar",
			status: midSeminarCompleted ? "completed" : "pending",
			detail: `Deadline: ${formatDisplayDate(midSeminarDeadline)}`,
		},
		{
			id: 3,
			title: "Final Report",
			status: finalReportCompleted ? "completed" : "pending",
			detail: finalReportUrl
				? getFileNameFromUrl(finalReportUrl)
				: "No report uploaded",
		},
		{
			id: 4,
			title: "Final Seminar",
			status: finalSeminarCompleted ? "completed" : "pending",
			detail: `Deadline: ${formatDisplayDate(finalSeminarDeadline)}`,
		},
	];

	const resources: ResourceItem[] = [
		{ name: "Proposal Document", url: project?.file || "" },
		{ name: "Midterm Report", url: midReportUrl || "" },
		{ name: "Final Report", url: finalReportUrl || "" },
	].filter((resource) => Boolean(resource.url));

	return (
		<div className="my-3 space-y-3">
			<Heading
				variant="sm"
				title="Project Activities"
				description="Track the progress and key milestones of your project."
			/>

			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
				<div className="lg:col-span-1 space-y-10">
					<Card className="flex flex-col gap-4 p-5 rounded-lg dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
						{activities.map((activity, index) => {
							return (
								<div key={activity.id}>
									<ActivityCard activity={activity} />
									{index !== activities.length - 1 && <Separator />}
								</div>
							);
						})}
					</Card>
				</div>

				<div className="lg:col-span-2 dark:bg-neutral-900 rounded-lg p-8 border border-neutral-200 dark:border-neutral-800">
					<h4 className="font-bold text-lg mb-6 flex items-center gap-2">
						<IconFileText className="text-primary-500" /> Resources
					</h4>
					{resources.length === 0 ? (
						<p className="text-sm text-muted-foreground">
							No resources available yet.
						</p>
					) : (
						<div className="space-y-5">
							{resources.map((resource, index) => (
								<div key={resource.url}>
									<a
										href={resource.url}
										target="_blank"
										rel="noopener noreferrer"
										className="flex items-center gap-x-3 justify-between group">
										<div className="flex flex-col gap-1">
											<span className="text-xs text-muted-foreground">
												{resource.name}
											</span>
											<span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-primary-500 transition-colors">
												{getFileNameFromUrl(resource.url)}
											</span>
										</div>
										<IconDownload className="text-neutral-300 h-5 w-5 group-hover:text-primary-500" />
									</a>
									{index !== resources.length - 1 && <Separator />}
								</div>
							))}
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
