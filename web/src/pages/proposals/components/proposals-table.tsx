import TableRowSkeleton from "@/components/table-row-skeleton";
import { Badge } from "@/components/ui/badge";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { Eye } from "lucide-react";
import { Link } from "react-router";

const STATUS_COLOR: Record<string, string> = {
	pending: "bg-yellow-100 text-yellow-800",
	approved: "bg-green-100 text-green-800",
	rejected: "bg-red-100 text-red-800",
};

export default function ProposalsTable({
	proposals,
	isLoading = false,
}: {
	proposals: any[];
	isLoading?: boolean;
}) {
	return (
		<div className="rounded-md border">
			<Table>
				<TableHeader className="bg-muted">
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Project Area</TableHead>
						<TableHead>Supervisor</TableHead>
						<TableHead>Type</TableHead>
						<TableHead>Project Type</TableHead>
						<TableHead>Status</TableHead>
						<TableHead>Submitted At</TableHead>
						<TableHead className="text-center w-12">Action</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{isLoading ? (
						<TableRowSkeleton rows={5} />
					) : proposals.length === 0 ? (
						<TableRow>
							<TableCell
								colSpan={8}
								className="text-center text-muted-foreground py-8">
								No proposals found.
							</TableCell>
						</TableRow>
					) : (
						proposals.map((proposal) => (
							<TableRow key={proposal.id}>
								<TableCell className="font-medium">
									{proposal.title.length > 30
										? proposal.title.slice(0, 50) + "..."
										: proposal.title}
								</TableCell>
								<TableCell>{proposal.projectArea}</TableCell>
								<TableCell>{proposal.supervisorName}</TableCell>
								<TableCell className="capitalize">{proposal.type}</TableCell>
								<TableCell className="capitalize">
									{proposal.projectType}
								</TableCell>
								<TableCell>
									<Badge
										className={`capitalize ${STATUS_COLOR[proposal.status] ?? ""}`}
										variant="outline">
										{proposal.status}
									</Badge>
								</TableCell>
								<TableCell>{proposal.submittedAt}</TableCell>
								<TableCell className="border text-center">
									{proposal.type === "Student" ? (
										<Link
											to={`/project-proposals/student/${proposal.slug}/detail`}
											className="bg-primary-800 hover:cursor-pointer hover:bg-primary-800/20 flex items-center text-white px-2 py-1.5 rounded-md gap-x-1">
											<Eye className="size-4" />
											<span className="text-[12px]">View</span>
										</Link>
									) : (
										<Link
											to={`/project-proposals/faculty/${proposal.slug}/detail`}
											className="bg-primary-800 hover:cursor-pointer hover:bg-primary-800/20 flex items-center text-white px-2 py-1.5 rounded-md gap-x-1">
											<Eye className="size-4" />
											<span className="text-[12px]">View</span>
										</Link>
									)}
								</TableCell>
							</TableRow>
						))
					)}
				</TableBody>
			</Table>
		</div>
	);
}
