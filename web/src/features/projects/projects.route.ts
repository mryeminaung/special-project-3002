import ProjectsPage from "@/features/projects/projects-page";
import AssignedProjects from "./faculties/pages/assigned-projects";
import FacultyProjectDetailPage from "./faculties/pages/faculty-project-detail";
import ProjectDetailPage from "./project-detail";
import MyProjects from "./students/pages/my-projects";
import StudentProjectDetailPage from "./students/pages/student-project-detail";

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
		path: "/projects/student/:slug/detail",
		Component: StudentProjectDetailPage,
	},
	{
		path: "/projects/faculty/:slug/detail",
		Component: FacultyProjectDetailPage,
	},
	{
		path: "/projects/me",
		Component: MyProjects,
	},
];
