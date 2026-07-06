import api from "@/api/api";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "../components/project-card";

export default function MyProjects() {
	useHeaderInitializer("MIIT | My Projects", "My Projects");

	const { data: projects, isLoading } = useQuery({
		queryKey: ["my-projects"],
		queryFn: async () => {
			const res = await api.get("/projects/me");
			return res.data;
		},
	});

	return (
		<PageWrapper>
			<Heading
				title="Projects Workspace"
				description="Oversee your active collaborations, track project status, and
					coordinate with supervisors."
			/>
			{isLoading ? (
				<p>Loading...</p>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-5">
					{projects?.data.map((project: any) => (
						<ProjectCard
							key={project.id}
							project={project}
						/>
					))}
				</div>
			)}
		</PageWrapper>
	);
}
