import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { useRoleCheck } from "@/lib/utils";
import UnAuthorized from "../UnAuthorized";

export default function ProjectsProposalPage() {
	useHeaderInitializer("MIIT| Proposals", "Project Proposals");

	if (!useRoleCheck("IC")) return <UnAuthorized />;

	return <RootLayout>proposal-lists</RootLayout>;
}
