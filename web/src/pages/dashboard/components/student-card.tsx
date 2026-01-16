import {
	IconListCheck,
	IconListDetails,
	IconTrendingUp,
	type Icon,
} from "@tabler/icons-react";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { BarChart3 } from "lucide-react";
import { useNavigate } from "react-router";

type SectionCardProps = {
	title: string;
	cardIcon?: Icon;
	description: string;
	footerTop: string;
	footerBottom: string;
	pageUrl: string;
};

export function StudentCards() {
	const navigate = useNavigate();

	const sectionCardData = [
		{
			title: "2",
			cardIcon: IconListDetails,
			description: "Total Projects",
			footerTop: "Project activity increasing this month",
			footerBottom: "Overall workload remains stable",
			pageUrl: "/projects",
		},
		{
			title: "3",
			cardIcon: BarChart3,
			description: "Total Proposals",
			footerTop: "Project activity increasing this month",
			footerBottom: "Overall workload remains stable",
			pageUrl: "/project-proposals",
		},
		{
			title: "10",
			cardIcon: IconListCheck,
			description: "My Tasks",
			footerTop: "Project activity increasing this month",
			footerBottom: "Overall workload remains stable",
			pageUrl: "/supervisors",
		},
		{
			title: "59%",
			cardIcon: IconTrendingUp,
			description: "Tasks Completion Rate",
			footerTop: "Project activity increasing this month",
			footerBottom: "Overall workload remains stable",
			pageUrl: "/",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-6 px-4 lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			{sectionCardData.length > 0 &&
				sectionCardData.map((card) => (
					<Card
						onClick={() => navigate(card.pageUrl)}
						key={card.description}
						className="@container/card hover:cursor-pointer">
						<CardHeader>
							<CardDescription className="font-medium text-black dark:text-neutral-100 flex items-center justify-between">
								{card.description}
								{card.cardIcon && <card.cardIcon size={20} />}
							</CardDescription>
							<CardTitle className="mt-3 text-2xl font-mono font-semibold tabular-nums @[250px]/card:text-3xl">
								{card.title}
							</CardTitle>
						</CardHeader>
						<CardFooter className="flex-col items-start gap-1.5 text-sm">
							<div className="line-clamp-1 hidden gap-2 font-medium">
								{card.footerTop}
								<IconTrendingUp className="hidden size-4" />
							</div>
							<div className="text-muted-foreground">{card.footerBottom}</div>
						</CardFooter>
					</Card>
				))}
		</div>
	);
}
