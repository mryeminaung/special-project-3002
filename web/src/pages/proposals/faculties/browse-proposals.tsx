import api from "@/api/api";
import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import ProposalTable from "../proposals-table";

export default function BrowseProposalsPage() {
	useHeaderInitializer("MIIT | Browse Proposals", "Browse Proposals");

	const fetchBrowseProposals = async () => {
			const res = await api.get("/proposals/browse-proposals");
			return (res.data);
	
	};

	const { data: proposals } = useQuery({
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
			{proposals && (
				<ProposalTable
					getProposalsData={fetchBrowseProposals}
					proposalData={proposals}
				/>
			)}
		</PageWrapper>
	);
}
