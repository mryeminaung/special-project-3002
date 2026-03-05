import api from "@/api/api";
import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import type { ProjectProposal } from "@/types";
import { useEffect, useState } from "react";
import ProposalCard from "./components/proposal-card";

export default function MyProposasPage() {
	useHeaderInitializer("MIIT | My Proposals", "My Proposals");

	const [proposals, setProposals] = useState<ProjectProposal[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchProposals = async () => {
		try {
			const res = await api.get("/proposals/my-proposals");
			setProposals(res.data);
		} catch (error) {
			console.error("Error fetching proposals:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		fetchProposals();
	}, []);

	if (loading) {
		return (
			<PageWrapper>
				<Heading
					title="My Proposals"
					description="View and track the status of proposals you've led or joined as a
						team member."
				/>
				<div className="mt-5">
					<p>Loading proposals...</p>
				</div>
			</PageWrapper>
		);
	}

	return (
		<PageWrapper>
			<Heading
				title="My Proposals"
				description="View and track the status of proposals you've led or joined as a
						team member."
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
				{proposals.map((proposal) => (
					<ProposalCard
						key={proposal.id}
						proposal={proposal}
					/>
				))}
			</div>
		</PageWrapper>
	);
}
