import { IconTrendingUp } from "@tabler/icons-react";

import {
	Card,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useNavigate } from "react-router";

export function SectionCards() {
	const navigate = useNavigate();
	const sectionCardData = [
		{
			title: "30",
			description: "Total Projects",
			footerTop: "Project activity increasing this month",
			footerBottom: "Overall workload remains stable",
			pageUrl: "/projects",
		},
		{
			title: "15",
			description: "Supervisors",
			footerTop: "Supervisor availability dropped this cycle",
			footerBottom: "Resource allocation requires review",
			pageUrl: "/supervisors",
		},
		{
			title: "30",
			description: "Teams",
			footerTop: "Team engagement remains strong",
			footerBottom: "Collaboration levels improving",
			pageUrl: "/teams",
		},
		{
			title: "70%",
			description: "Projects Completion Rate",
			footerTop: "Performance metrics show steady progress",
			footerBottom: "Quality targets are being met",
			pageUrl: "/dashboard"
		},
	];

	return (
		<div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-6 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			{sectionCardData.map((card) => (
				<Card
					onClick={() => navigate(card.pageUrl)}
					key={card.description}
					className="@container/card hover:scale-[1.05] transition-transform hover:cursor-pointer">
					<CardHeader>
						<CardDescription>{card.description}</CardDescription>
						<CardTitle className="text-2xl font-mono font-semibold tabular-nums @[250px]/card:text-3xl">
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
