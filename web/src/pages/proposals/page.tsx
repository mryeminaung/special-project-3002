import api from "@/api/api";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { useRoleCheck } from "@/lib/utils";
import { useEffect, useState } from "react";
import UnAuthorized from "../UnAuthorized";
import { ProposalsList } from "./components/proposals-table";

export default function ProjectsProposalPage() {
	if (!useRoleCheck("IC")) return <UnAuthorized />;

	useHeaderInitializer("MIIT| Proposals", "Project Proposals");

	const [proposalsData, setProposalsData] = useState([]);

	const getProposalsData = async () => {
		const res = await api.get("/proposals/lists");
		console.log(res.data);
	};

	useEffect(() => {
		getProposalsData();
	}, []);

	return (
		<RootLayout>
			<div className="flex flex-col gap-5 px-6">
				<div>
					<h1 className="text-3xl font-bold text-foreground">
						Project Proposals
					</h1>
					<p className="text-muted-foreground">
						Browse and manage project proposals with team assignments and
						supervisors.
					</p>
				</div>
				<ProposalsList />
			</div>
		</RootLayout>
	);
}
