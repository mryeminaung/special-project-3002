import {
	IconFileDescription,
	IconListDetails,
	IconUsersGroup,
} from "@tabler/icons-react";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ShieldCheckIcon } from "lucide-react";
import { useNavigate } from "react-router";

export function IcCards({
	dashboardData,
}: {
	dashboardData: {
		noOfProposals: number;
		noOfProjects: number;
		noOfSupervisors: number;
		noOfFaculties: number;
	};
}) {
	const navigate = useNavigate();

	const sectionCardData = [
		{
			title: dashboardData.noOfProjects ?? 0,
			cardIcon: IconListDetails,
			description: "Total Projects",
			pageUrl: "/projects",
		},
		{
			title: dashboardData.noOfProposals ?? 0,
			cardIcon: IconFileDescription,
			description: "Total Proposals",
			pageUrl: "/project-proposals",
		},
		{
			title: dashboardData.noOfSupervisors ?? 0,
			cardIcon: ShieldCheckIcon,
			description: "Total Supervisors",
			pageUrl: "/supervisors",
		},
		{
			title: dashboardData.noOfFaculties ?? 0,
			cardIcon: IconUsersGroup,
			description: "Total Faculties",
			pageUrl: "/faculties",
		},
	];

	return (
		<div className="grid grid-cols-1 gap-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
			{sectionCardData.length > 0 &&
				sectionCardData.map((card) => (
					<Card
						onClick={() => navigate(card.pageUrl)}
						key={card.description}
						className="@container/card hover:cursor-pointer ">
						<CardHeader>
							<CardDescription className="font-medium text-base text-black dark:text-neutral-100 flex items-center justify-between">
								{card.description}
								{card.cardIcon && <card.cardIcon size={20} />}
							</CardDescription>
							<CardTitle className="mt-3 text-2xl font-mono font-medium tabular-nums @[250px]/card:text-3xl">
								{card.title}
							</CardTitle>
						</CardHeader>
					</Card>
				))}
		</div>
	);
}
