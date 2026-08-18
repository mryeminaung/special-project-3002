import Heading from "@/components/heading";
import { HEADINGS, PAGE_META } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { usePagination } from "@/hooks/use-pagination";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import UnAuthorized from "../../components/auth/un-authorized";
import Pagination from "./components/pagination";
import ProposalsTable from "./components/proposals-table";
import { getProposals } from "./services/proposal.service";
import { getAcademicYears } from "@/features/admin/services/admin.service";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

export default function ProjectsProposalPage() {
	useHeaderInitializer(
		PAGE_META.proposals.title,
		PAGE_META.proposals.subtitle,
	);
	const { page } = usePagination();
	const [yearId, setYearId] = useState<number | undefined>(undefined);

	const { data: academicYears = [] } = useQuery({
		queryKey: ["academicYears"],
		queryFn: getAcademicYears,
		staleTime: 60_000,
	});

	const { data: proposals, isFetching } = useQuery({
		queryKey: ["proposals", page, yearId],
		queryFn: () => getProposals(page, yearId),
		refetchOnWindowFocus: false,
		staleTime: 30_000,
	});

	const { isIC } = useRoleChecker();
	if (!isIC) return <UnAuthorized />;

	return (
		<>
			<Heading
				title={HEADINGS.proposals.title}
				description="Browse and manage project proposals with team assignments and supervisors."
			/>
			<div className="flex justify-end mt-5 mb-2">
				<Select
					value={yearId ? String(yearId) : "all"}
					onValueChange={(v) => setYearId(v === "all" ? undefined : Number(v))}
				>
					<SelectTrigger className="w-40">
						<SelectValue placeholder="Academic Year" />
					</SelectTrigger>
					<SelectContent>
						<SelectItem value="all">All Years</SelectItem>
						{academicYears.map((y: any) => (
							<SelectItem key={y.id} value={String(y.id)}>
								{y.year}
							</SelectItem>
						))}
					</SelectContent>
				</Select>
			</div>
			<div className="space-y-4">
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
