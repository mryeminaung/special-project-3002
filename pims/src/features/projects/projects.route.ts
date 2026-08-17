import ProjectsPage from "@/features/projects/projects-page";
import AssignedProjects from "./faculties/pages/assigned-projects";
import FacultyProjectDetailPage from "./faculties/pages/faculty-project-detail";
import ProjectDetailPage from "./project-detail";
import ExaminersPage from "./pages/examiners-page";

export const projectsRoutes = [
	{ path: "/assigned-projects",              Component: AssignedProjects },
	{ path: "/projects",                       Component: ProjectsPage },
	{ path: "/examiners",                      Component: ExaminersPage },
	{ path: "/projects/:slug/detail",          Component: ProjectDetailPage },
	{ path: "/projects/faculty/:slug/detail",  Component: FacultyProjectDetailPage },
];
