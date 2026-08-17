import TableRowSkeleton from "@/components/table-row-skeleton";
import { formatDate } from "@/lib/date";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { PROPOSAL_STATUS_COLORS, projectAreaColor, projectTypeColor, proposalAppliedTypeColor } from "@/constants/badge-colors";
import { Search } from "lucide-react";
import ViewDetail from "@/components/view-detail";
import { useMemo, useState } from "react";
import { Link } from "react-router";

export default function ProposalsTable({
	proposals,
	isLoading = false,
}: {
	proposals: any[];
	isLoading?: boolean;
}) {
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("all");
	const [projectTypeFilter, setProjectTypeFilter] = useState("all");
	const [areaFilter, setAreaFilter] = useState("all");

	const projectAreas = useMemo(() => {
		const areas = proposals.map((p) => p.projectArea).filter(Boolean);
		return Array.from(new Set(areas)) as string[];
	}, [proposals]);

	const filtered = useMemo(() => {
		const q = search.toLowerCase();
		return proposals.filter((p) => {
			const matchesSearch =
				!q ||
				p.title.toLowerCase().includes(q) ||
				(p.supervisor ?? "").toLowerCase().includes(q);
			const matchesType = typeFilter === "all" || p.type === typeFilter;
			const matchesProjectType =
				projectTypeFilter === "all" || p.projectType === projectTypeFilter;
			const matchesArea = areaFilter === "all" || p.projectArea === areaFilter;
			return matchesSearch && matchesType && matchesProjectType && matchesArea;
		});
	}, [proposals, search, typeFilter, projectTypeFilter, areaFilter]);

	return (
		<div className="space-y-4">
			{/* Filter bar */}
			<div className="flex flex-wrap items-center gap-3">
				{/* Search */}
				<div className="relative flex-1 min-w-48">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
					<Input
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						placeholder="Search by title or supervisor…"
						className="pl-9 h-9 text-sm"
					/>
				</div>

				{/* Type */}
				<Select value={typeFilter} onValueChange={setTypeFilter}>
					<SelectTrigger className="w-36">
						<SelectValue placeholder="Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
						<SelectItem value="student">Student</SelectItem>
						<SelectItem value="faculty">Faculty</SelectItem>
					</SelectContent>
				</Select>

				{/* Project type */}
				<Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
					<SelectTrigger className="w-44">
						<SelectValue placeholder="Project Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Project Types</SelectItem>
						<SelectItem value="special">Special</SelectItem>
						<SelectItem value="capstone">Capstone</SelectItem>
						<SelectItem value="master-thesis">Master / Thesis</SelectItem>
					</SelectContent>
				</Select>

				{/* Area */}
				<Select value={areaFilter} onValueChange={setAreaFilter}>
					<SelectTrigger className="w-44">
						<SelectValue placeholder="Project Area" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Areas</SelectItem>
						{projectAreas.map((area) => (
							<SelectItem key={area} value={area}>
								{area}
							</SelectItem>
						))}
					</SelectContent>
				</Select>

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
								rows={8}
								cells={["h-4 w-48", "h-5 w-24 rounded-full", "h-4 w-32", "h-4 w-16", "h-4 w-24", "h-5 w-20 rounded-full", "h-4 w-24", "mx-auto h-8 w-16 rounded-md"]}
							/>
						) : filtered.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={8}
									className="text-center text-lg py-10 font-semibold">
									No proposals match your filters.
								</TableCell>
							</TableRow>
						) : (
							filtered.map((proposal) => (
								<TableRow key={proposal.id}>
									<TableCell className="text-sm font-medium max-w-[260px]">
										<span className="block truncate" title={proposal.title}>
											{proposal.title}
										</span>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className={cn("font-normal", projectAreaColor())}>
											{proposal.projectArea}
										</Badge>
									</TableCell>
									<TableCell className="text-sm">{proposal.supervisor}</TableCell>
									<TableCell>
										<Badge variant="outline" className={cn("capitalize font-normal", proposalAppliedTypeColor(proposal.type))}>
											{proposal.type}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge variant="outline" className={cn("capitalize font-normal", projectTypeColor(proposal.projectType))}>
											{proposal.projectType}
										</Badge>
									</TableCell>
									<TableCell>
										<Badge
											className={`capitalize shadow-none border-none ${PROPOSAL_STATUS_COLORS[proposal.status] ?? ""}`}
											variant="outline">
											{proposal.status}
										</Badge>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatDate(proposal.submittedAt)}
									</TableCell>
									<TableCell className="text-center">
										<ViewDetail url={`/proposals/${proposal.type.toLowerCase()}/${proposal.slug}/detail`} />
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
