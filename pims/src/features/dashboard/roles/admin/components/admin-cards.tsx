import {
	IconCalendarEvent,
	IconChevronRight,
	IconLayersLinked,
	IconUsersGroup,
	IconSchool,
	IconBuilding,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";

export function AdminCards({
	stats,
}: {
	stats: {
		totalStudents: number;
		totalFaculties: number;
		totalDepartments: number;
		totalProjectAreas: number;
		totalEvents: number;
		activeEvents: number;
	};
}) {
	const navigate = useNavigate();

	const cards = [
		{
			label: "Students",
			count: stats.totalStudents ?? 0,
			Icon: IconSchool,
			iconClass: "bg-blue-100 text-blue-600 dark:bg-blue-950 dark:text-blue-400",
			href: "/admin/students",
		},
		{
			label: "Faculties",
			count: stats.totalFaculties ?? 0,
			Icon: IconUsersGroup,
			iconClass: "bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400",
			href: "/admin/faculties",
		},
		{
			label: "Departments",
			count: stats.totalDepartments ?? 0,
			Icon: IconBuilding,
			iconClass: "bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400",
			href: "/admin/departments",
		},
		{
			label: "Project Areas",
			count: stats.totalProjectAreas ?? 0,
			Icon: IconLayersLinked,
			iconClass: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400",
			href: "/admin/project-areas",
		},
		{
			label: "Events",
			count: stats.totalEvents ?? 0,
			Icon: IconCalendarEvent,
			iconClass: "bg-violet-100 text-violet-600 dark:bg-violet-950 dark:text-violet-400",
			href: "/admin/events",
		},
		{
			label: "Active Events",
			count: stats.activeEvents ?? 0,
			Icon: IconCalendarEvent,
			iconClass: "bg-teal-100 text-teal-600 dark:bg-teal-950 dark:text-teal-400",
			href: "/admin/events",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
			{cards.map(({ label, count, Icon, iconClass, href }) => (
				<button
					key={label}
					onClick={() => navigate(href)}
					className="group rounded-xl border bg-card p-5 text-left hover:shadow-md transition-all duration-200 hover:border-border/80"
				>
					<div className="flex items-center justify-between">
						<div className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconClass}`}>
							<Icon size={20} />
						</div>
						<IconChevronRight
							size={16}
							className="text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all duration-150"
						/>
					</div>
					<p className="mt-4 text-3xl font-bold font-mono tabular-nums">
						{count}
					</p>
					<p className="mt-1 text-sm text-muted-foreground">{label}</p>
				</button>
			))}
		</div>
	);
}
