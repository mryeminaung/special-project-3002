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

function ActivityCard({ activity }: any) {
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
			</div>
		</div>
	);
}

export default function ProjectActivity() {
	const activities = [
		{
			id: 1,
			title: "Midterm Report",
			date: "12 Jan 2026",
			status: "completed",
		},
		{
			id: 2,
			title: "Midterm Seminar",
			date: "15 Jan 2026",
			status: "completed",
		},
		{
			id: 3,
			title: "Final Report",
			date: "20 Jan 2026",
			status: "completed",
		},
		{
			id: 4,
			title: "Final Seminar",
			date: "05 Feb 2026",
			status: "pending",
		},
	];

	return (
		<div>
			<div className="flex items-center justify-between mb-3">
				<h3 className="text-lg font-bold text-neutral-900 dark:text-white">
					Project Activities
				</h3>
			</div>
			<div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
				<div className="lg:col-span-1 space-y-10">
					<Card className="flex flex-col gap-4 p-5 rounded-lg dark:bg-neutral-900 border border-neutral-200/60 dark:border-neutral-800">
						{activities.map((activity, index) => (
							<>
								<ActivityCard
									key={activity.id}
									activity={activity}
								/>
								{index !== activities.length - 1 && <Separator />}
							</>
						))}
					</Card>
				</div>

				<div className="lg:col-span-2 dark:bg-neutral-900 rounded-lg p-8 border border-neutral-200 dark:border-neutral-800">
					<h4 className="font-bold text-lg mb-6 flex items-center gap-2">
						<IconFileText className="text-primary-500" /> Resources
					</h4>
					<div className="space-y-5">
						{[
							"ProjectProposal.pdf",
							"MidTermReport.docx",
							"MidTermPPT.pptx",
							"MidTermReport_V2.pdf",
						].map((file, index) => (
							<>
								<div
									key={file}
									className="flex items-center gap-x-3 justify-between group cursor-pointer">
									<span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400 group-hover:text-primary-500 transition-colors">
										{file}
									</span>
									<IconDownload className="text-neutral-300 h-5 w-5 group-hover:text-primary-500" />
								</div>
								{index !== activities.length - 1 && <Separator />}
							</>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
