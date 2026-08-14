import { getProjects } from "./services/project.service";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { useQuery } from "@tanstack/react-query";
import UnAuthorized from "../../components/auth/un-authorized";
import ProjectsTable from "./components/projects-table";

export default function ProjectsPage() {
	useHeaderInitializer(PAGE_META.projects.title, PAGE_META.projects.subtitle);
	const { isIC } = useRoleChecker();
	const { data: projects, isFetching } = useQuery({
		queryKey: ["projects"],
		queryFn: getProjects,
	});

	if (isIC) {
		return (
			<>
				<Heading
					title={HEADINGS.projects.title}
					description="Browse and manage project proposals with team assignments and
					supervisors."
				/>
				<ProjectsTable projects={projects ?? []} isLoading={isFetching} />
			</>
		);
	} else {
		return <UnAuthorized />;
	}
}
