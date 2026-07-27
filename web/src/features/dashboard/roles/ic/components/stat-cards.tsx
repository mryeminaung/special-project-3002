import { Card, CardContent } from "@/components/ui/card";
import {
	IconFileDescription,
	IconCircleCheck,
	IconAlertTriangle,
	IconTrendingUp,
	IconTrendingDown,
} from "@tabler/icons-react";
import { useNavigate } from "react-router";
import type { StatCardData } from "../types";

const iconMap: Record<string, React.ComponentType<{ className?: string; size?: number }>> = {
	FileDescription: IconFileDescription,
	CircleCheck: IconCircleCheck,
	AlertTriangle: IconAlertTriangle,
};

const defaultStats: StatCardData[] = [
	{
		label: "Pending Proposals",
		value: 12,
		icon: "FileDescription",
		color: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400",
		pageUrl: "/proposals",
		trend: { value: 3, direction: "up" },
	},
	{
		label: "Approved Projects",
		value: 34,
		icon: "CircleCheck",
		color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
		pageUrl: "/projects",
		trend: { value: 8, direction: "up" },
	},
	{
		label: "Completed Projects",
		value: 22,
		icon: "CircleCheck",
		color: "text-teal-600 bg-teal-50 dark:bg-teal-950 dark:text-teal-400",
		pageUrl: "/projects",
		trend: { value: 5, direction: "up" },
	},
	{
		label: "Overdue Projects",
		value: 3,
		icon: "AlertTriangle",
		color: "text-red-600 bg-red-50 dark:bg-red-950 dark:text-red-400",
		pageUrl: "/projects",
		trend: { value: 1, direction: "down" },
	},
];

export default function StatCards({
	stats,
}: {
	stats?: ICDashboardData["stats"];
}) {
	const navigate = useNavigate();

	const statValues = stats || defaultStats.reduce((acc, s) => {
		const key = s.label.replace(/\s+/g, "");
		return { ...acc, [key.charAt(0).toLowerCase() + key.slice(1)]: s.value };
	}, {} as Record<string, number>);

	const cards = defaultStats.map((card) => {
		const key = card.label.replace(/\s+/g, "");
		const valueKey = key.charAt(0).toLowerCase() + key.slice(1);
		return {
			...card,
			value: statValues[valueKey] ?? card.value,
		};
	});

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{cards.map((card) => {
				const IconComponent = iconMap[card.icon] || IconFileDescription;
				return (
					<Card
						key={card.label}
						className="group cursor-pointer rounded-xl border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
						onClick={() => navigate(card.pageUrl)}>
						<CardContent className="p-5">
							<div className="flex items-start justify-between">
								<div className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
									<IconComponent size={20} />
								</div>
								{card.trend && (
									<div
										className={`flex items-center gap-1 text-xs font-medium ${
											card.trend.direction === "up"
												? "text-emerald-600"
												: "text-red-600"
										}`}>
										{card.trend.direction === "up" ? (
											<IconTrendingUp size={14} />
										) : (
											<IconTrendingDown size={14} />
										)}
										<span>{card.trend.value}%</span>
									</div>
								)}
							</div>
							<div className="mt-4">
								<p className="text-2xl font-bold tracking-tight text-foreground">
									{card.value}
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									{card.label}
								</p>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
