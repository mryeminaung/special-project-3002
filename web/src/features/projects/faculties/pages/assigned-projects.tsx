import api from "@/api/api";
import { HEADINGS } from "@/constants/navigation";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { useQuery } from "@tanstack/react-query";
import AssignedProjectsTable from "../components/assigned-projects-table";

type User = {
	id: number;
	name: string;
	email: string;
};

type ProjectData = {
	id: number;
	name: string;
	slug: string;
	description: string;
	supervisor: User;
	leader: User;
	members: User[];
	status: "active" | "completed" | "under review";
	startedAt: string;
};

export default function AssignedProjects() {
	const fetchAssignedProjects = async () => {
		const res = await api.get("/assigned-projects");
		return res.data;
	};

	const { data: assignedProjects } = useQuery({
		queryKey: ["assignedProjects"],
		queryFn: fetchAssignedProjects,
	});

	return (
		<PageWrapper className="space-y-6">
			<Heading
				title={HEADINGS.assignedProjects.title}
				description={HEADINGS.assignedProjects.description}
			/>

			{assignedProjects && (
				<AssignedProjectsTable projects={assignedProjects} />
			)}
		</PageWrapper>
	);
}
