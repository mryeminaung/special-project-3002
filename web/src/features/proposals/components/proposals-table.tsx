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
import { Eye, Filter } from "lucide-react"; // Added Filter icon
import { useMemo, useState } from "react"; // Added hooks
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
	const [selectedArea, setSelectedArea] = useState<string>("all");

	// 1. Extract unique project areas from the proposals list
	const projectAreas = useMemo(() => {
		const areas = proposals.map((p) => p.projectArea);
		return ["all", ...new Set(areas)];
	}, [proposals]);

	// 2. Filter proposals based on selection
	const filteredProposals = useMemo(() => {
		if (selectedArea === "all") return proposals;
		return proposals.filter((p) => p.projectArea === selectedArea);
	}, [proposals, selectedArea]);

	return (
		<div className="space-y-4">
			{/* Filter UI */}
			<div className="flex items-center gap-2">
				<Filter className="size-4 text-slate-500" />
				<span className="text-sm font-medium text-slate-700">
					Filter by Area:
				</span>
				<select
					value={selectedArea}
					onChange={(e) => setSelectedArea(e.target.value)}
					className="text-sm border rounded-md px-2 py-1 bg-white outline-none focus:ring-2 focus:ring-primary-800/20">
					{projectAreas.map((area) => (
						<option
							key={area}
							value={area}>
							{area === "all" ? "All Areas" : area}
						</option>
					))}
				</select>
				<span className="text-xs text-slate-400 ml-auto">
					Showing {filteredProposals.length} items
				</span>
			</div>

			<div className="rounded-md border overflow-hidden">
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
							<TableRowSkeleton
								rows={5}
								colSpan={8}
							/> // Added colSpan fix
						) : filteredProposals.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={8}
									className="text-center text-lg py-10 font-semibold">
									No proposals found
									{selectedArea !== "all" ? ` for ${selectedArea}` : ""}.
								</TableCell>
							</TableRow>
						) : (
							filteredProposals.map((proposal) => (
								<TableRow key={proposal.id}>
									<TableCell className="font-medium">
										{proposal.title.length > 50
											? proposal.title.slice(0, 50) + "..."
											: proposal.title}
									</TableCell>
									<TableCell>
										<Badge
											variant="outline"
											className="bg-slate-50 font-normal">
											{proposal.projectArea}
										</Badge>
									</TableCell>
									<TableCell>{proposal.supervisorName}</TableCell>
									<TableCell className="capitalize">{proposal.type}</TableCell>
									<TableCell className="capitalize">
										{proposal.projectType}
									</TableCell>
									<TableCell>
										<Badge
											className={`capitalize shadow-none border-none ${STATUS_COLOR[proposal.status] ?? ""}`}
											variant="outline">
											{proposal.status}
										</Badge>
									</TableCell>
									<TableCell className="text-slate-500 text-[13px]">
										{proposal.submittedAt}
									</TableCell>
									<TableCell className="text-center">
										<Link
											to={`/project-proposals/${proposal.type.toLowerCase()}/${proposal.slug}/detail`}
											className="bg-primary-600 hover:bg-primary-700 transition-colors flex items-center justify-center text-white px-2 py-1.5 rounded-md gap-x-1">
											<Eye className="size-3.5" />
											<span className="text-[11px]">View</span>
										</Link>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>
		</div>
	);
}
