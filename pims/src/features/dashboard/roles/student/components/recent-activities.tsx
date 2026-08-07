import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	IconFileText,
	IconCircleCheck,
	IconAlertTriangle,
	IconSettings,
} from "@tabler/icons-react";
import type { StudentDashboardData } from "../services/student-dashboard.service";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
	FileText: IconFileText,
	CheckCircle: IconCircleCheck,
	AlertTriangle: IconAlertTriangle,
	Settings: IconSettings,
};

const typeColors: Record<string, string> = {
	proposal: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
	project: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
	system: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export default function RecentActivities({
	activities,
}: {
	activities?: StudentDashboardData["recentActivities"];
}) {
	if (!activities || activities.length === 0) return null;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-semibold text-foreground">
					Recent Activities
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 px-5 pb-5">
				<div className="relative max-h-72 overflow-y-auto">
					<div className="absolute left-[15px] top-0 bottom-0 w-px bg-border" />
					<div className="space-y-4">
						{activities.map((activity) => {
							const Icon = iconMap[activity.icon] || IconFileText;
							return (
								<div key={activity.id} className="relative flex gap-3">
									<div
										className={`relative z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${typeColors[activity.type] || typeColors.system}`}>
										<Icon size={14} />
									</div>
									<div className="min-w-0 flex-1 pt-1">
										<p className="text-sm text-foreground leading-snug">
											{activity.description}
										</p>
										<p className="mt-0.5 text-xs text-muted-foreground">
											{activity.timestamp}
										</p>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
