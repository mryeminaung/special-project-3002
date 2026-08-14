import { browseProposals as fetchBrowseProposals } from "@/features/proposals/services/proposal.service";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { usePagination } from "@/hooks/use-pagination";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import { Pagination, ProposalsTable } from "@/features/proposals";

export default function BrowseProposalsPage() {
	useHeaderInitializer(PAGE_META.browseProposals.title, PAGE_META.browseProposals.subtitle);
	const { page } = usePagination();

	const { data: browseProposals, isFetching } = useQuery({
		queryKey: ["browseProposals", page],
		queryFn: () => fetchBrowseProposals(page),
	});

	return (
		<>
			<Heading
				title={HEADINGS.browseProposals.title}
				description="Browse and manage project proposals with team assignments and supervisors."
			/>
			<div className="space-y-4 mt-5">
				<ProposalsTable
					proposals={browseProposals?.data?.data ?? []}
					isLoading={isFetching}
				/>
				{browseProposals?.data?.meta && (
					<Pagination meta={browseProposals.data.meta} />
				)}
			</div>
		</>
	);
}
