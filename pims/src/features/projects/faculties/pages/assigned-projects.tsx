import { getAssignedProjects } from "@/features/projects/services/project.service";
import { HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useQuery } from "@tanstack/react-query";
import AssignedProjectsTable from "../components/assigned-projects-table";

export default function AssignedProjects() {
	const { data: assignedProjects, isFetching } = useQuery({
		queryKey: ["assignedProjects"],
		queryFn: getAssignedProjects,
	});

	return (
		<div className="space-y-6">
			<Heading
				title={HEADINGS.assignedProjects.title}
				description={HEADINGS.assignedProjects.description}
			/>

			<AssignedProjectsTable projects={assignedProjects ?? []} isLoading={isFetching} />
		</div>
	);
}
