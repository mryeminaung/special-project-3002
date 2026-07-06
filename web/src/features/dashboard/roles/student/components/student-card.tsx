import {
	IconListCheck,
	IconListDetails,
	IconTrendingUp,
} from "@tabler/icons-react";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DashboardCard } from "@/types/student";
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router";

type StudentCardProps = {
	completionRate: number;
	noOfProjects: number;
	noOfProposals: number;
	noOfTasks: number;
};

export function StudentCards({ data }: { data: StudentCardProps }) {
	const navigate = useNavigate();

	const sectionCardData: DashboardCard<React.ElementType>[] = [
		{
			title: "Total Projects",
			cardIcon: IconListDetails,
			count: data.noOfProjects,
			pageUrl: "/projects/my-projects",
		},
		{
			title: "Total Proposals",
			cardIcon: BarChart3,
			count: data.noOfProposals,
			pageUrl: "/project-proposals/my-proposals",
		},
		{
			title: "My Tasks",
			cardIcon: IconListCheck,
			count: data.noOfTasks,
			pageUrl: "/my-tasks",
		},
		{
			title: "Tasks Completion Rate",
			cardIcon: IconTrendingUp,
			count: data.completionRate + "%",
			pageUrl: "/my-tasks",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			{sectionCardData.length > 0 &&
				sectionCardData.map((card, idx) => (
					<Card
						onClick={() => navigate(card.pageUrl)}
						key={idx}
						className="@container/card hover:cursor-pointer">
						<CardHeader>
							<CardDescription className="font-medium text-base text-black dark:text-neutral-100 flex items-center justify-between">
								{card.title}
								{card.cardIcon && <card.cardIcon size={20} />}
							</CardDescription>
							<CardTitle className="mt-3 text-2xl font-mono font-semibold tabular-nums @[250px]/card:text-3xl">
								{card.count}
							</CardTitle>
						</CardHeader>
					</Card>
				))}
		</div>
	);
}
