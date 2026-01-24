import api from "@/api/api";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import type { ProjectProposal } from "@/types";
import { useEffect, useState } from "react";
import ProposalCard from "../components/proposal-card";

export default function MyProposasPage() {
	useHeaderInitializer("MIIT | My Proposals", "My Proposals");

	const [proposals, setProposals] = useState<ProjectProposal[]>([]);
	const [loading, setLoading] = useState(true);

	const fetchProposals = async () => {
		try {
			const res = await api.get("/proposals/my-proposals");
			console.log(res.data);
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
			<div className="mx-auto max-w-7xl">
				<div>
					<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
						My Proposals
					</h1>
					<p className="text-sm text-neutral-500">
						View and track the status of proposals you've led or joined as a
						team member.
					</p>
				</div>
				<div className="mt-5">
					<p>Loading proposals...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="mx-auto max-w-7xl">
			<div>
				<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
					My Proposals
				</h1>
				<p className="text-sm text-neutral-500">
					View and track the status of proposals you've led or joined as a team
					member.
				</p>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
				{proposals.map((proposal) => (
					<ProposalCard
						key={proposal.id}
						proposal={proposal}
					/>
				))}
			</div>
		</div>
	);
}
