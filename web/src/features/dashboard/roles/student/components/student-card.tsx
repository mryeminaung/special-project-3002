import { Card, CardContent } from "@/components/ui/card";
import {
	IconListCheck,
	IconListDetails,
	IconTrendingUp,
	IconTrendingDown,
} from "@tabler/icons-react";
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router";

const cards = [
	{
		title: "Total Projects",
		icon: IconListDetails,
		color: "text-violet-600 bg-violet-50 dark:bg-violet-950 dark:text-violet-400",
		key: "totalProjects",
		url: "/projects/my-projects",
		trend: { value: 1, direction: "up" as const },
	},
	{
		title: "Total Proposals",
		icon: BarChart3,
		color: "text-blue-600 bg-blue-50 dark:bg-blue-950 dark:text-blue-400",
		key: "totalProposals",
		url: "/proposals/me",
		trend: { value: 2, direction: "up" as const },
	},
	{
		title: "Pending Items",
		icon: IconListCheck,
		color: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400",
		key: "pendingItems",
		url: "/projects/my-projects",
		trend: { value: 0, direction: "up" as const },
	},
	{
		title: "Next Deadline",
		icon: IconTrendingUp,
		color: "text-amber-600 bg-amber-50 dark:bg-amber-950 dark:text-amber-400",
		key: "nextDeadline",
		url: "#",
		suffix: "d",
		trend: { value: 0, direction: "down" as const },
	},
];

type Stats = {
	totalProjects: number;
	totalProposals: number;
	pendingItems: number;
	nextDeadline: number;
};

export function StudentCards({ stats }: { stats: Stats }) {
	const navigate = useNavigate();

	return (
		<div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
			{cards.map((card) => {
				const Icon = card.icon;
				const value = stats[card.key as keyof Stats];
				return (
					<Card
						key={card.key}
						className="group cursor-pointer rounded-xl border-0 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
						onClick={() => navigate(card.url)}>
						<CardContent className="p-5">
							<div className="flex items-start justify-between">
								<div
									className={`flex h-10 w-10 items-center justify-center rounded-lg ${card.color}`}>
									<Icon size={20} />
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
									{value}{card.suffix || ""}
								</p>
								<p className="mt-1 text-sm text-muted-foreground">
									{card.title}
								</p>
							</div>
						</CardContent>
					</Card>
				);
			})}
		</div>
	);
}
