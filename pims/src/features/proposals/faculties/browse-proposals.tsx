import api from "@/api/api";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { useCurrentPage } from "@/hooks/use-current-page";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import Pagination from "../components/pagination";
import ProposalsTable from "../components/proposals-table";

export default function BrowseProposalsPage() {
	useHeaderInitializer(PAGE_META.browseProposals.title, PAGE_META.browseProposals.subtitle);
	const currentPage = useCurrentPage();

	const fetchBrowseProposals = async () => {
		const endpoint =
			currentPage > 1
				? `/proposals/browse?page=${currentPage}`
				: "/proposals/browse";
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
				title={HEADINGS.browseProposals.title}
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
