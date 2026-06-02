import api from "@/api/api";
import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import UnAuthorized from "../../components/un-authorized";
import ProjectsTable from "./components/projects-table";

export default function ProjectsPage() {
	useHeaderInitializer("MIIT| Proposals", "Approved Projects");
	const { isIC } = useRoleChecker();
	const getProjects = async () => {
		const res = await api.get("/projects");
		return res.data;
	};

	const { data: projects } = useQuery({
		queryKey: ["projects"],
		queryFn: getProjects,
	});

	if (isIC) {
		return (
			<PageWrapper>
				<Heading
					title="Projects"
					description="Browse and manage project proposals with team assignments and
					supervisors."
				/>
				{projects && <ProjectsTable projects={projects} />}
			</PageWrapper>
		);
	} else {
		return <UnAuthorized />;
	}
}
