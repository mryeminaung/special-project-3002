import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	IconFileText,
	IconCalendarEvent,
	IconClipboardCheck,
	IconMicrophone,
} from "@tabler/icons-react";
import { formatShortDate } from "@/lib/date";
import type { DeadlineItem } from "../../types";

function futureDate(daysFromNow: number): string {
	const d = new Date();
	d.setDate(d.getDate() + daysFromNow);
	return d.toISOString().slice(0, 10);
}

const defaultDeadlines: DeadlineItem[] = [
	{ id: "1-mid",   title: "Project Alpha — Mid Seminar",   date: futureDate(4),  type: "seminar" },
	{ id: "2-mid",   title: "Project Beta — Mid Seminar",    date: futureDate(9),  type: "seminar" },
	{ id: "3-final", title: "Project Gamma — Final Seminar", date: futureDate(12), type: "defense" },
	{ id: "4-final", title: "Project Delta — Final Seminar", date: futureDate(18), type: "defense" },
	{ id: "5-mid",   title: "Project Epsilon — Mid Seminar", date: futureDate(25), type: "seminar" },
];

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
	report: IconClipboardCheck,
	proposal: IconFileText,
	defense: IconMicrophone,
	seminar: IconCalendarEvent,
};

const urgencyColors: Record<string, string> = {
	urgent: "bg-red-50 border-l-red-500 text-red-700 dark:bg-red-950 dark:text-red-400",
	moderate: "bg-amber-50 border-l-amber-500 text-amber-700 dark:bg-amber-950 dark:text-amber-400",
	safe: "bg-emerald-50 border-l-emerald-500 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400",
};

const badgeColors: Record<string, string> = {
	report: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
	proposal: "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400",
	defense: "bg-violet-100 text-violet-700 dark:bg-violet-950 dark:text-violet-400",
	seminar: "bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-400",
};

function getUrgency(dateStr: string): "urgent" | "moderate" | "safe" {
	const days = Math.ceil(
		(new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
	);
	if (days <= 7) return "urgent";
	if (days <= 14) return "moderate";
	return "safe";
}

export default function UpcomingDeadlines({
	deadlines,
}: {
	deadlines?: DeadlineItem[];
}) {
	const data = deadlines || defaultDeadlines;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-semibold text-foreground">
					Upcoming Deadlines
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 px-5 pb-5">
				<div className="space-y-2.5 max-h-72 overflow-y-auto">
					{data.map((deadline) => {
						const IconComponent = iconMap[deadline.type] || IconCalendarEvent;
						const urgency = getUrgency(deadline.date);
						return (
							<div
								key={deadline.id}
								className={`flex items-center gap-3 rounded-lg border-l-4 p-3 ${urgencyColors[urgency]}`}>
								<div className="flex-shrink-0">
									<IconComponent size={18} />
								</div>
								<div className="min-w-0 flex-1">
									<p className="text-sm font-medium text-foreground truncate">
										{deadline.title}
									</p>
									<p className="text-xs text-muted-foreground">
										{formatShortDate(deadline.date)}
									</p>
								</div>
								<Badge
									variant="secondary"
									className={`text-xs flex-shrink-0 ${badgeColors[deadline.type]}`}>
									{deadline.type}
								</Badge>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
