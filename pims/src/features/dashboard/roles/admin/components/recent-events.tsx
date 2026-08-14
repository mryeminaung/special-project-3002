import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { IconCalendarEvent, IconArrowRight } from "@tabler/icons-react";
import { useNavigate } from "react-router";

type RecentEvent = {
	id: number;
	title: string | null;
	type: string;
	startDate: string | null;
	endDate: string | null;
	isActive: boolean;
};

export default function RecentEvents({
	events,
}: {
	events: RecentEvent[];
}) {
	const navigate = useNavigate();

	if (!events?.length) return null;

	return (
		<div className="rounded-xl border bg-card p-5">
			<div className="flex items-center justify-between mb-4">
				<h3 className="text-sm font-semibold">Recent Events</h3>
				<Button
					variant="ghost"
					size="sm"
					className="gap-1 text-xs text-muted-foreground"
					onClick={() => navigate("/admin/events")}
				>
					View all <IconArrowRight size={12} />
				</Button>
			</div>
			<div className="space-y-3">
				{events.map((event) => (
					<div key={event.id} className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400 shrink-0">
							<IconCalendarEvent size={14} />
						</div>
						<div className="flex-1 min-w-0">
							<p className="text-sm font-medium truncate">{event.title ?? event.type}</p>
							<p className="text-xs text-muted-foreground">
								{event.startDate ?? "No date"}
								{event.endDate ? ` — ${event.endDate}` : ""}
							</p>
						</div>
						<Badge
							variant="outline"
							className={`text-[11px] shrink-0 ${
								event.isActive
									? "text-emerald-700 bg-emerald-50 border-emerald-200"
									: "text-muted-foreground bg-muted"
							}`}
						>
							{event.isActive ? "Active" : "Inactive"}
						</Badge>
					</div>
				))}
			</div>
		</div>
	);
}
