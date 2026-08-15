import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/date";
import { proposalStatusColor } from "@/constants/badge-colors";
import { cn } from "@/lib/utils";
import type { ProjectProposal } from "@/types";
import { IconArrowRight, IconCalendar, IconShieldCheck, IconUser } from "@tabler/icons-react";
import { Link } from "react-router";

const STATUS_LEFT_BORDER: Record<string, string> = {
	pending: "border-l-amber-400",
	approved: "border-l-emerald-400",
	rejected: "border-l-rose-400",
};

const TYPE_LABELS: Record<string, string> = {
	student: "Student",
	faculty: "Faculty",
	special: "Special",
	capstone: "Capstone",
	"master/thesis": "Master / Thesis",
	master: "Master / Thesis",
};

interface ProposalCardProps {
	proposal: ProjectProposal | null;
}

export default function ProposalCard({ proposal }: ProposalCardProps) {
	if (!proposal) return null;

	const borderColor = STATUS_LEFT_BORDER[proposal.status] ?? "border-l-border";

	return (
		<Link to={`/proposals/student/${proposal.slug}/detail`} className="block group">
			<div
				className={cn(
					"flex flex-col gap-3.5 rounded-xl border border-l-4 bg-card p-5 transition-shadow duration-200 group-hover:shadow-sm",
					borderColor,
				)}>
				{/* Top row: badges + arrow */}
				<div className="flex items-center justify-between gap-2">
					<div className="flex items-center gap-2 flex-wrap">
						<Badge
							variant="outline"
							className={cn("text-xs font-medium capitalize", proposalStatusColor(proposal.status))}>
							{proposal.status}
						</Badge>
						{proposal.type && (
							<Badge variant="outline" className="text-xs font-medium capitalize text-muted-foreground">
								{TYPE_LABELS[proposal.type] ?? proposal.type}
							</Badge>
						)}
					</div>
					<IconArrowRight
						size={16}
						className="text-muted-foreground shrink-0 transition-transform duration-200 group-hover:translate-x-0.5"
					/>
				</div>

				{/* Title */}
				<h3 className="font-semibold text-sm leading-snug line-clamp-2 text-foreground">
					{proposal.title}
				</h3>

				{/* Description */}
				<p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
					{proposal.description}
				</p>

				{/* Divider */}
				<div className="border-t border-border" />

				{/* Meta row */}
				<div className="flex flex-col gap-2">
					<div className="flex items-center gap-2 text-xs text-muted-foreground">
						<IconShieldCheck size={13} className="shrink-0 text-primary-500" />
						<span className="truncate">{proposal.supervisor?.name ?? "—"}</span>
					</div>
					<div className="flex items-center justify-between gap-2">
						<div className="flex items-center gap-2 text-xs text-muted-foreground">
							<IconUser size={13} className="shrink-0" />
							<span className="truncate">{proposal.submittedBy?.name ?? "—"}</span>
						</div>
						<div className="flex items-center gap-1.5 text-xs text-muted-foreground shrink-0">
							<IconCalendar size={12} />
							<span>{formatDate(proposal.submittedAt)}</span>
						</div>
					</div>
				</div>
			</div>
		</Link>
	);
}
