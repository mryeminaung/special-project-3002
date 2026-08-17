import AcademicYearsPage from "./pages/academic-years-page";
import DepartmentDetailPage from "./pages/department-detail-page";
import DepartmentsListPage from "./pages/departments-list-page";
import FacultiesListPage from "./pages/faculties-list-page";
import ProjectAreasPage from "./pages/project-areas-page";
import StuListPage from "./pages/stu-list-page";

export const adminRoutes = [
	{
		path: "/admin/students",
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
		path: "/admin/departments/:id",
		Component: DepartmentDetailPage,
	},
	{
		path: "/admin/academic-years",
		Component: AcademicYearsPage,
	},
];
