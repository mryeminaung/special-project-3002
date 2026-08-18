import Heading from "@/components/heading";
import { HEADINGS, PAGE_META } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { usePagination } from "@/hooks/use-pagination";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import UnAuthorized from "../../../components/auth/un-authorized";
import Pagination from "../components/pagination";
import ProposalsTable from "../components/proposals-table";
import { getAllProposals } from "../services/proposal.service";
import { Button } from "@/components/ui/button";
import { getAcademicYears } from "@/features/admin/services/admin.service";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";

export default function AllProposalsPage() {
	useHeaderInitializer(PAGE_META.allProposals.title, PAGE_META.allProposals.subtitle);
	const { page } = usePagination();
	const { isIC, isSupervisor, isFaculty } = useRoleChecker();
	const [mine, setMine] = useState(false);
	const [yearId, setYearId] = useState<number | undefined>(undefined);

	const canView = isIC || isSupervisor || isFaculty;

	const { data: years } = useQuery({
		queryKey: ["academicYears"],
		queryFn: getAcademicYears,
		staleTime: 60_000,
	});

	const { data: proposals, isFetching } = useQuery({
		queryKey: ["allProposals", page, mine, yearId],
		queryFn: () => getAllProposals(page, mine, yearId),
		enabled: canView,
		refetchOnWindowFocus: false,
		staleTime: 30_000,
	});

	if (!canView) return <UnAuthorized />;

	return (
		<>
			<div className="flex items-start justify-between gap-4">
				<Heading
					title={HEADINGS.allProposals.title}
					description={HEADINGS.allProposals.description}
				/>
				{(isFaculty || isSupervisor) && !isIC && (
					<div className="flex shrink-0 gap-2 pt-1">
						<Button
							size="sm"
							variant={!mine ? "default" : "outline"}
							onClick={() => setMine(false)}
							className={!mine ? "bg-primary-600 hover:bg-primary-700 text-white" : ""}>
							All
						</Button>
						<Button
							size="sm"
							variant={mine ? "default" : "outline"}
							onClick={() => setMine(true)}
							className={mine ? "bg-primary-600 hover:bg-primary-700 text-white" : ""}>
							Mine
						</Button>
					</div>
				)}
			</div>

			{/* Filters */}
			<div className="flex items-center gap-3 mt-4">
				<Select
					value={yearId ? String(yearId) : "all"}
					onValueChange={(v) => setYearId(v === "all" ? undefined : Number(v))}>
					<SelectTrigger className="w-48 h-8 text-xs">
						<SelectValue placeholder="All academic years" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All academic years</SelectItem>
						{years?.map((y) => (
							<SelectItem key={y.id} value={String(y.id)}>
								{y.label ?? y.year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>

			<div className="space-y-4 mt-4">
				<ProposalsTable
					proposals={proposals?.data?.data ?? []}
					isLoading={isFetching}
				/>
				{proposals?.data?.meta && proposals.data.meta.total > 0 && (
					<Pagination meta={proposals.data.meta} />
				)}
			</div>
		</>
	);
}
