import api from "@/api/api";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import ProposalCard from "../components/proposal-card";

export default function MyProposasPage() {
	useHeaderInitializer(PAGE_META.myProposals.title, PAGE_META.myProposals.subtitle);

	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("all");
	const [projectTypeFilter, setProjectTypeFilter] = useState("all");

	const fetchProposals = async () => {
		const res = await api.get("/proposals/me");
		return res.data;
	};

	const { data: myProposals, isLoading } = useQuery({
		queryKey: ["myProposals"],
		queryFn: fetchProposals,
	});

	const proposals = myProposals?.data || [];

	const filteredProposals = proposals.filter((proposal: any) => {
		const matchesSearch =
			search === "" ||
			proposal.title.toLowerCase().includes(search.toLowerCase()) ||
			proposal.description.toLowerCase().includes(search.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || proposal.status === statusFilter;

		const matchesProjectType =
			projectTypeFilter === "all" ||
			proposal.project_type?.toLowerCase() === projectTypeFilter;

		return matchesSearch && matchesStatus && matchesProjectType;
	});

	const hasActiveFilters =
		search !== "" || statusFilter !== "all" || projectTypeFilter !== "all";

	const clearFilters = () => {
		setSearch("");
		setStatusFilter("all");
		setProjectTypeFilter("all");
	};

	return (
		<PageWrapper>
			<Heading
				title={HEADINGS.myProposals.title}
				description="View and track the status of proposals you've led or joined as a
						team member."
			/>

			{/* Filters */}
			<div className="flex flex-col gap-3 mt-5 sm:flex-row sm:items-center">
				<div className="relative flex-1">
					<MagnifyingGlassIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
					<Input
						placeholder="Search by title or description..."
						value={search}
						onChange={(e) => setSearch(e.target.value)}
						className="pl-9"
					/>
				</div>
				<Select value={statusFilter} onValueChange={setStatusFilter}>
					<SelectTrigger className="w-full sm:w-40">
						<SelectValue placeholder="Status" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Status</SelectItem>
						<SelectItem value="pending">Pending</SelectItem>
						<SelectItem value="approved">Approved</SelectItem>
						<SelectItem value="rejected">Rejected</SelectItem>
					</SelectContent>
				</Select>
				<Select value={projectTypeFilter} onValueChange={setProjectTypeFilter}>
					<SelectTrigger className="w-full sm:w-44">
						<SelectValue placeholder="Project Type" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Types</SelectItem>
						<SelectItem value="special">Special</SelectItem>
						<SelectItem value="capstone">Capstone</SelectItem>
						<SelectItem value="master">Master</SelectItem>
					</SelectContent>
				</Select>
				{hasActiveFilters && (
					<Button
						variant="ghost"
						size="sm"
						onClick={clearFilters}
						className="gap-1 text-gray-500">
						<XMarkIcon className="h-4 w-4" />
						Clear
					</Button>
				)}
			</div>

			{/* Results */}
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
				{filteredProposals.length > 0 ? (
					filteredProposals.map((proposal: any) => (
						<ProposalCard
							key={proposal.id}
							proposal={proposal}
						/>
					))
				) : (
					<div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
						<p className="text-gray-500">
							{hasActiveFilters
								? "No proposals match your filters."
								: "You haven't created any proposals yet."}
						</p>
						{hasActiveFilters && (
							<Button
								variant="link"
								onClick={clearFilters}
								className="mt-2">
								Clear filters
							</Button>
						)}
					</div>
				)}
			</div>
		</PageWrapper>
	);
}
