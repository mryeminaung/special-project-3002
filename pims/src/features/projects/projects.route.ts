import ProjectsPage from "@/features/projects/projects-page";
import ProjectDetailPage from "./project-detail";
import ExaminersPage from "./pages/examiners-page";

export const projectsRoutes = [
	{ path: "/projects",              Component: ProjectsPage },
	{ path: "/examiners",             Component: ExaminersPage },
	{ path: "/projects/:slug/detail", Component: ProjectDetailPage },
];
