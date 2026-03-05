import api from "@/api/api";
import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { HasRole } from "@/lib/utils";
import type { ProjectProposal } from "@/types";
import { useEffect, useState } from "react";
import UnAuthorized from "../auth/un-authorized";
import ProposalTable from "./proposals-table";

export default function ProjectsProposalPage() {
	useHeaderInitializer("MIIT| Proposals", "Submitted Proposals");

	const [proposalsData, setProposalsData] = useState<ProjectProposal[]>([]);
	const getProposalsData = async () => {
		const res = await api.get("/proposals");
		setProposalsData(res.data);
	};

	useEffect(() => {
		getProposalsData();
	}, []);

	if (!HasRole("IC") && !HasRole("Student Affairs")) return <UnAuthorized />;

	return (
		<PageWrapper>
			<Heading
				title="Proposals"
				description="Browse and manage project proposals with team assignments and
				supervisors."
			/>
			{proposalsData && (
				<ProposalTable
					getProposalsData={getProposalsData}
					proposalData={proposalsData}
				/>
			)}
		</PageWrapper>
	);
}
