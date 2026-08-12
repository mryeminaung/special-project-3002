import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { PROPOSAL_STATUS_COLORS } from "@/constants/badge-colors";
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

export default function ProposalCard({ proposal }: ProposalCardProps) {
	if (!proposal) return null;

	return (
		<Link to={`/proposals/student/${proposal.slug}/detail`}>
			<Card className="flex flex-col justify-between border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
				<CardHeader>
					<div className="flex items-start justify-between gap-x-3">
						<CardTitle className="text-lg font-semibold line-clamp-1">
							{proposal.title}
						</CardTitle>
						<Badge
							className={cn(PROPOSAL_STATUS_COLORS[proposal.status], "mt-1 capitalize")}>
							{proposal.status}
						</Badge>
					</div>
					<p className="flex items-center gap-x-1.5 text-sm">
						<CalendarIcon className="h-4 w-4" />
						Submitted at {proposal.submittedAt}
					</p>
				</CardHeader>
				<CardContent className="text-sm">
					<CardDescription className="text-black line-clamp-2">
						{proposal.description}
					</CardDescription>
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
