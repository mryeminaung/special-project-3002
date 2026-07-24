import {
	IconFileDescription,
	IconListDetails,
	IconUsersGroup,
	type Icon,
} from "@tabler/icons-react";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ShieldCheckIcon } from "lucide-react";
import { useNavigate } from "react-router";

type SectionCardProps = {
	title: string;
	cardIcon?: Icon;
	description: string;
	footerTop: string;
	footerBottom: string;
	pageUrl: string;
};

export function StudentAffairCard() {
	const navigate = useNavigate();

	const sectionCardData = [
		{
			title: 2,
			cardIcon: IconListDetails,
			description: "Total Projects",
			pageUrl: "/projects",
		},
		{
			title: 3,
			cardIcon: IconFileDescription,
			description: "Tota Proposals",
			pageUrl: "/project-proposals",
		},
		{
			title: 12,
			cardIcon: IconUsersGroup,
			description: "Active Students",
			pageUrl: "/supervisors",
		},
		{
			title: 10,
			cardIcon: ShieldCheckIcon,
			description: "Total Supervisors",
			pageUrl: "/",
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
							<CardDescription className="font-medium text-md text-black dark:text-neutral-100 flex items-center justify-between">
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
