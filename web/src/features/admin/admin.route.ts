import DepartmentsListPage from "./departments-list-page";
import EventsListPage from "./events-list-page";
import FacultiesListPage from "./faculties-list-page";
import ProjectAreasPage from "./project-areas-page";
import StuListPage from "./stu-list-page";

export const adminRoutes = [
	{
		path: "/admin/events",
		Component: EventsListPage,
	},
	{
		path: "/students",
		Component: StuListPage,
	},
	{
		path: "/admin/faculties",
		Component: FacultiesListPage,
	},
	{
		path: "/admin/project-areas",
		Component: ProjectAreasPage,
	},
	{
		path: "/admin/departments",
		Component: DepartmentsListPage,
	},
	{
		path: "/students",
		Component: StuListPage,
	},
];
