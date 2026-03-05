import api from "@/api/api";
import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import type { ProjectProposal } from "@/types";
import { useEffect, useState } from "react";
import ProposalTable from "../proposals-table";

export default function BrowseProposalsPage() {
	useHeaderInitializer("MIIT | Browse Proposals", "Browse Proposals");

	const [proposals, setProposals] = useState<ProjectProposal[]>([]);

	const fetchBrowseProposals = async () => {
		try {
			const res = await api.get("/proposals/browse-proposals");
			console.log(res.data);
			setProposals(res.data);
		} catch (error) {
			console.error("Error fetching browse proposals:", error);
		}
	};

	useEffect(() => {
		fetchBrowseProposals();
	}, []);

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
