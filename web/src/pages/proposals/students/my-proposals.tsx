import api from "@/api/api";
import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import ProposalCard from "./components/proposal-card";

export default function MyProposasPage() {
	useHeaderInitializer("MIIT | My Proposals", "My Proposals");

	const fetchProposals = async () => {
		const res = await api.get("/proposals/me");
		return res.data;
	};

	const { data: proposals } = useQuery({
		queryKey: ["myProposals"],
		queryFn: fetchProposals,
	});

	return (
		<PageWrapper>
			<Heading
				title="My Proposals"
				description="View and track the status of proposals you've led or joined as a
						team member."
			/>
			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
				{proposals &&
					proposals.map((proposal: any) => (
						<ProposalCard
							key={proposal.id}
							proposal={proposal}
						/>
					))}
			</div>
		</PageWrapper>
	);
}
