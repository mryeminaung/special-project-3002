import api from "@/api/api";
import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { useCurrentPage } from "@/hooks/use-current-page";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../components/pagination";
import ProposalsTable from "../components/proposals-table";

export default function BrowseProposalsPage() {
	useHeaderInitializer("MIIT | Browse Proposals", "Browse Proposals");
	const currentPage = useCurrentPage();

	const fetchBrowseProposals = async () => {
		const endpoint =
			currentPage > 1
				? `/proposals/browse-proposals?page=${currentPage}`
				: "/proposals/browse-proposals";
		const res = await api.get(endpoint);
		return res.data;
	};

	const { data: browseProposals, isFetching } = useQuery({
		queryKey: ["browseProposals"],
		queryFn: fetchBrowseProposals,
	});

	return (
		<PageWrapper>
			<Heading
				title="Browse Proposals"
				description="Browse and manage project proposals with team assignments and
				supervisors."
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
		</PageWrapper>
	);
}
