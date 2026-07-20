import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	IconFileText,
	IconAlertTriangle,
	IconCircleCheck,
	IconInfoCircle,
} from "@tabler/icons-react";
import type { NotificationItem } from "../../types";

const defaultNotifications: NotificationItem[] = [
	{
		id: 1,
		icon: "FileText",
		message: "New proposal awaiting your review",
		timestamp: "10 min ago",
		read: false,
		type: "info",
	},
	{
		id: 2,
		icon: "AlertTriangle",
		message: "3 projects are overdue",
		timestamp: "1 hour ago",
		read: false,
		type: "warning",
	},
	{
		id: 3,
		icon: "CheckCircle",
		message: "Report exported successfully",
		timestamp: "2 hours ago",
		read: true,
		type: "success",
	},
	{
		id: 4,
		icon: "UserPlus",
		message: "New faculty member registered",
		timestamp: "3 hours ago",
		read: true,
		type: "info",
	},
	{
		id: 5,
		icon: "CheckCircle",
		message: "5 proposals approved this week",
		timestamp: "5 hours ago",
		read: true,
		type: "success",
	},
];

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
	FileText: IconFileText,
	AlertTriangle: IconAlertTriangle,
	CheckCircle: IconCircleCheck,
	InfoCircle: IconInfoCircle,
	UserPlus: IconInfoCircle,
};

const typeColors: Record<string, string> = {
	info: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
	warning: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
	success: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
};

export default function LatestNotifications({
	notifications,
}: {
	notifications?: NotificationItem[];
}) {
	const data = notifications || defaultNotifications;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="flex flex-row items-center justify-between pb-3">
				<CardTitle className="text-sm font-semibold text-foreground">
					Latest Notifications
				</CardTitle>
				<Button
					variant="ghost"
					size="sm"
					className="h-7 text-xs text-muted-foreground hover:text-foreground">
					Mark all read
				</Button>
			</CardHeader>
			<CardContent className="p-0 px-5 pb-5">
				<div className="space-y-1 max-h-72 overflow-y-auto">
					{data.map((notification) => {
						const IconComponent = iconMap[notification.icon] || IconInfoCircle;
						return (
							<div
								key={notification.id}
								className={`flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted/50 ${
									!notification.read ? "bg-muted/30" : ""
								}`}>
								<div
									className={`mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg ${typeColors[notification.type]}`}>
									<IconComponent size={14} />
								</div>
								<div className="min-w-0 flex-1">
									<div className="flex items-start justify-between gap-2">
										<p className={`text-sm leading-snug ${!notification.read ? "font-medium text-foreground" : "text-muted-foreground"}`}>
											{notification.message}
										</p>
										{!notification.read && (
											<div className="mt-1.5 h-2 w-2 flex-shrink-0 rounded-full bg-blue-500" />
										)}
									</div>
									<p className="mt-0.5 text-xs text-muted-foreground">
										{notification.timestamp}
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
