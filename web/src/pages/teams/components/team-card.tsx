import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Users } from "lucide-react";
import { Link } from "react-router";

interface TeamMember {
	id: string;
	name: string;
	avatar?: string;
	role: string;
}

interface TeamCardProps {
	team?: {
		id: string;
		name: string;
		description: string;
		status: string;
		supervisor: TeamMember;
		members: TeamMember[];
		projectCount: number;
		createdAt: string;
	};
}

const STATUS_COLORS: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-800 border-yellow-200",
	approved: "bg-green-100 text-green-800 border-green-200",
	rejected: "bg-red-100 text-red-800 border-red-200",
};

export function TeamCard({ team }: TeamCardProps) {
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase();
	};

	if (!team) return null;

	return (
		<Link to={`/teams/detail/${team.id}`}>
			<Card className="border-gray-200 shadow-sm hover:shadow-md transition-shadow duration-200">
				<CardContent>
					{/* Project Title and Status */}
					<div className="flex items-start justify-between">
						<CardTitle className="text-lg line-clamp-2">{team.name}</CardTitle>
						<Badge
							variant="secondary"
							className={cn(STATUS_COLORS[team.status], "mt-1 capitalize")}>
							{team.status}
						</Badge>
					</div>
					<CardDescription className="text-sm hidden">
						{team.description}
					</CardDescription>
				</CardContent>

				<CardContent className="space-y-2">
					{/* Team Supervisor */}
					<div className="space-y-2">
						<div className="flex flex-row gap-2 text-sm">
							<div className="flex gap-x-2 items-center">
								<ShieldCheckIcon className="h-5 w-5 text-primary-600" />

								<span>Supervisor . </span>
							</div>
							<p>{team.supervisor.name}</p>
						</div>
					</div>
					{/* Team Members */}
					<div className="space-y-2">
						<div className="flex items-center gap-x-3 text-sm">
							<Users className="w-4 h-4" />
							<p className="flex items-center gap-x-3">
								<span>Team Members</span>
								<Badge className="bg-primary-600 text-xs">
									{team.members.length}
								</Badge>
							</p>
						</div>
						<div className="flex -space-x-1 overflow-hidden">
							{team.members.slice(0, 4).map((member) => (
								<Avatar
									key={member.id}
									className="inline-block h-6 w-6 rounded-full ring-2 ring-background bg-primary-600 text-center text-white">
									<AvatarImage
										src={member.avatar}
										alt={member.name}
									/>
									<AvatarFallback className="text-xs">
										{getInitials(member.name)}
									</AvatarFallback>
								</Avatar>
							))}
						</div>
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
