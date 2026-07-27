import {
	IconCircleCheck,
	IconClockPause,
	IconFolderCheck,
	IconUsers,
} from "@tabler/icons-react";

import {
	Card,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { DashboardCard } from "@/types/student";
import { useNavigate } from "react-router";

type FacultyCardProps = {
	assignedProjects: number;
	projectMembers: number;
	pendingProposals: number;
	completionRate: number;
};

export function FacultyCards({ data }: { data: FacultyCardProps }) {
	const navigate = useNavigate();

	const sectionCardData: DashboardCard<React.ElementType>[] = [
		{
			title: "Assigned Projects",
			cardIcon: IconFolderCheck,
			count: data.assignedProjects ?? 0,
			pageUrl: "/assigned-projects",
		},
		{
			title: "Project Members",
			cardIcon: IconUsers,
			count: data.projectMembers ?? 0,
			pageUrl: "/proposals/browse",
		},
		{
			title: "Pending Proposals",
			cardIcon: IconClockPause,
			count: data.pendingProposals ?? 0,
			pageUrl: "/proposals/faculties",
		},
		{
			title: "Completion Rate",
			cardIcon: IconCircleCheck,
			count:  100 + "%",
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
