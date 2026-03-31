import ProjectsPage from "@/pages/projects/projects-page";
import AssignedProjects from "./faculties/pages/assigned-projects";
import FacultyProjectDetailPage from "./faculties/pages/faculty-project-detail";
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
		path: "/projects/student/:slug",
		Component: StudentProjectDetailPage,
	},
	{
		path: "/projects/faculty/:slug",
		Component: FacultyProjectDetailPage,
	},
	{
		path: "/projects/my-projects",
		Component: MyProjects,
	},
];
