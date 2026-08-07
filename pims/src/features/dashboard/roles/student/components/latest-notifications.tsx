import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	IconAlertTriangle,
	IconCircleCheck,
	IconInfoCircle,
} from "@tabler/icons-react";
import type { StudentDashboardData } from "../services/student-dashboard.service";

const iconMap: Record<
	string,
	React.ComponentType<{ className?: string; size?: number }>
> = {
	info: IconInfoCircle,
	warning: IconAlertTriangle,
	success: IconCircleCheck,
};

const typeColors: Record<string, string> = {
	info: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
	warning:
		"bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
	success:
		"bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
};

export default function LatestNotifications({
	notifications,
}: {
	notifications?: StudentDashboardData["notifications"];
}) {
	if (!notifications || notifications.length === 0) return null;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-semibold text-foreground">
					Notifications
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 px-5 pb-5">
				<div className="space-y-1 max-h-72 overflow-y-auto">
					{notifications.map((n) => {
						const Icon = iconMap[n.type] || IconInfoCircle;
						return (
							<div
								key={n.id}
								className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50 ${
									!n.read ? "bg-muted/30" : ""
								}`}
							>
								<div
									className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${typeColors[n.type]}`}
								>
									<Icon size={14} />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-2">
										<p
											className={`text-sm leading-snug ${!n.read ? "font-medium text-foreground" : "text-muted-foreground"}`}
										>
											{n.message}
										</p>
										{!n.read && (
											<div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
										)}
									</div>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{n.timestamp}
									</p>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
