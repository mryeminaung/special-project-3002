import api from "@/api/api";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { HasRole } from "@/lib/utils";
import type { ProjectProposal } from "@/types";
import { useEffect, useState } from "react";
import UnAuthorized from "../UnAuthorized";
import ProposalTable from "./proposals-table";

export default function ProjectsProposalPage() {
	useHeaderInitializer("MIIT| Proposals", "Project Proposals");

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
		<div className="mx-auto max-w-7xl">
			<h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
				Project Proposals
			</h1>
			<p className="text-sm text-neutral-500">
				Browse and manage project proposals with team assignments and
				supervisors.
			</p>
			{proposalsData && (
				<ProposalTable
					getProposalsData={getProposalsData}
					proposalData={proposalsData}
				/>
			)}
		</div>
	);
}
