import {
	IconFileDescription,
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
import { Shield } from "lucide-react";
import { useNavigate } from "react-router";

type SectionCardProps = {
	title: string;
	cardIcon?: Icon;
	description: string;
	footerTop: string;
	footerBottom: string;
	pageUrl: string;
};

export function SectionCards() {
	const navigate = useNavigate();

	/*
	<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-6 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
	*/

	const sectionCardData = [
		{
			title: "0",
			cardIcon: IconListDetails,
			description: "Total Projects",
			footerTop: "Project activity increasing this month",
			footerBottom: "Overall workload remains stable",
			pageUrl: "/projects",
		},
		{
			title: "0",
			cardIcon: IconFileDescription,
			description: "Project Proposals",
			footerTop: "Project activity increasing this month",
			footerBottom: "Overall workload remains stable",
			pageUrl: "/project-proposals",
		},
		{
			title: "0",
			cardIcon: Shield,
			description: "Supervisors",
			footerTop: "Project activity increasing this month",
			footerBottom: "Overall workload remains stable",
			pageUrl: "/supervisors",
		},
		{
			title: "0",
			cardIcon: IconTrendingUp,
			description: "Completion Rate",
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
							<CardDescription className="font-medium text-black flex items-center justify-between">
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
