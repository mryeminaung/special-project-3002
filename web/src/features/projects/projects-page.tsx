import api from "@/api/api";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import UnAuthorized from "../../components/auth/un-authorized";
import ProjectsTable from "./components/projects-table";

export default function ProjectsPage() {
	useHeaderInitializer(PAGE_META.projects.title, PAGE_META.projects.subtitle);
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
					title={HEADINGS.projects.title}
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
