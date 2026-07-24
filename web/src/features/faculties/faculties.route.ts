import FacultiesPage from "./pages/faculties-page";
import FacultyDetailPage from "./pages/faculty-detail-page";

export const facultiesRoutes = [
	{
		path: "/faculties",
		Component: FacultiesPage,
	},
	{
		path: "/faculties/:id/detail",
		Component: FacultyDetailPage,
	},
];
