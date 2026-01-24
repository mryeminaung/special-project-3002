import { Badge } from "@/components/ui/badge"; // Assuming Badge is a UI component
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { ProjectProposal } from "@/types";
import {
	CalendarIcon,
	ShieldCheckIcon,
	UserCircleIcon,
} from "@heroicons/react/24/solid";
import { Link } from "react-router";

interface ProposalCardProps {
	proposal: ProjectProposal | null;
}

const STATUS_COLORS: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
	approved: "bg-green-100 text-green-800 border-green-200",
	rejected: "bg-red-100 text-red-800 border-red-200",
};

export default function ProposalCard({ proposal }: ProposalCardProps) {
	if (!proposal) return null;

	return (
		<Link to={`/project-proposals/${proposal.slug}/detail`}>
			<Card className="flex flex-col justify-between border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
				<CardHeader>
					<div className="flex items-start justify-between gap-x-3">
						<CardTitle className="text-lg font-semibold line-clamp-2">
							{proposal.title}
						</CardTitle>
						<Badge
							className={cn(STATUS_COLORS[proposal.status], "mt-1 capitalize")}>
							{proposal.status}
						</Badge>
					</div>
					<CardDescription className="flex items-center gap-x-1.5 text-sm text-gray-500">
						<CalendarIcon className="h-4 w-4" />
						Submitted on {proposal.submitted_at}
					</CardDescription>
				</CardHeader>
				<CardContent className="text-sm text-gray-700">
					<p className="line-clamp-2">{proposal.description}</p>
					<div className="flex items-center gap-x-2 mt-3">
						<ShieldCheckIcon className="h-5 w-5 text-primary-600" />
						<p>Supervisor . {proposal.supervisor.name}</p>
					</div>
					<div className="flex items-center gap-x-2 mt-3">
						<UserCircleIcon className="h-5 w-5 text-primary-600" />
						<p>Submitted By {proposal.submittedBy.name}</p>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
