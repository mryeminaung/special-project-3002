import AssignedProjects from "@/pages/projects/faculties/assigned-projects";
import ProjectsPage from "@/pages/projects/page";
import ProjectDetailPage from "@/pages/projects/project-detail";
import MyProjects from "@/pages/projects/students/my-projects";

export const projectsRoutes = [
	{
		path: "/assigned-projects",
		Component: AssignedProjects,
	},
	{
		path: "/projects",
		Component: ProjectsPage,
	},
	{
		path: "/projects/:slug/detail",
		Component: ProjectDetailPage,
	},
	{
		path: "/projects/my-projects",
		Component: MyProjects,
	},
];
