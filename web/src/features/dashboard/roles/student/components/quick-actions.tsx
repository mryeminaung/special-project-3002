import { IconFileCheck, IconFolderOpen, IconCalendarEvent, IconSend } from "@tabler/icons-react";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate } from "react-router";

const actions = [
	{
		title: "Submit Proposal",
		description: "Create a new project proposal",
		icon: IconFileCheck,
		color: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
		hoverColor: "hover:border-blue-200 dark:hover:border-blue-800",
		url: "/proposals/new/student",
	},
	{
		title: "My Projects",
		description: "View your project details",
		icon: IconFolderOpen,
		color: "text-violet-600 bg-violet-50 dark:bg-violet-950 dark:text-violet-400",
		hoverColor: "hover:border-violet-200 dark:hover:border-violet-800",
		url: "/projects/my-projects",
	},
	{
		title: "Events",
		description: "View upcoming events",
		icon: IconCalendarEvent,
		color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
		hoverColor: "hover:border-emerald-200 dark:hover:border-emerald-800",
		url: "/events",
	},
	{
		title: "Announcements",
		description: "Read latest announcements",
		icon: IconSend,
		color: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400",
		hoverColor: "hover:border-amber-200 dark:hover:border-amber-800",
		url: "/announcements",
	},
];

export default function QuickActions() {
	const navigate = useNavigate();

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{actions.map((action) => {
				const Icon = action.icon;
				return (
					<Card
						key={action.title}
						className={`group cursor-pointer rounded-xl border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 ${action.hoverColor}`}
						onClick={() => navigate(action.url)}>
						<CardContent className="flex items-center gap-4 p-4">
							<div
								className={`flex h-11 w-11 items-center justify-center rounded-xl ${action.color}`}>
								<Icon size={20} />
							</div>
							<div>
								<p className="text-sm font-semibold text-foreground">
									{action.title}
								</p>
								<p className="text-xs text-muted-foreground mt-0.5">
									{action.description}
								</p>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
