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

export default function ProjectsProposalPage() {
	useHeaderInitializer(
		PAGE_META.proposals.title,
		PAGE_META.proposals.subtitle,
	);
	const { page } = usePagination();

	const { data: proposals, isFetching } = useQuery({
		queryKey: ["proposals", page],
		queryFn: () => getProposals(page),
		refetchOnWindowFocus: false,
		staleTime: 30_000,
	});

	const { isIC } = useRoleChecker();
	if (!isIC) return <UnAuthorized />;

	return (
		<>
			<Heading
				title={HEADINGS.proposals.title}
				description="Browse and manage project proposals with team assignments and
				supervisors."
			/>
			<div className="space-y-4 mt-5">
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
