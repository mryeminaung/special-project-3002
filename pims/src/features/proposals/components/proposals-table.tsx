import TableRowSkeleton from "@/components/table-row-skeleton";
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
import { PROPOSAL_STATUS_COLORS } from "@/constants/badge-colors";
import { Eye, Search } from "lucide-react";
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
				(p.supervisorName ?? "").toLowerCase().includes(q);
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
							<TableRowSkeleton rows={5} colSpan={8} />
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
									<TableCell className="font-medium">
										{proposal.title.length > 50
											? proposal.title.slice(0, 50) + "…"
											: proposal.title}
									</TableCell>
									<TableCell>
										<Badge variant="outline" className="bg-slate-50 font-normal">
											{proposal.projectArea}
										</Badge>
									</TableCell>
									<TableCell>{proposal.supervisorName}</TableCell>
									<TableCell className="capitalize">{proposal.type}</TableCell>
									<TableCell className="capitalize">{proposal.projectType}</TableCell>
									<TableCell>
										<Badge
											className={`capitalize shadow-none border-none ${PROPOSAL_STATUS_COLORS[proposal.status] ?? ""}`}
											variant="outline">
											{proposal.status}
										</Badge>
									</TableCell>
									<TableCell className="text-slate-500 text-[13px]">
										{proposal.submittedAt}
									</TableCell>
									<TableCell className="text-center">
										<Link
											to={`/proposals/${proposal.type.toLowerCase()}/${proposal.slug}/detail`}
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
