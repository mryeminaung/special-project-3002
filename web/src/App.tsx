import DashboardPage from "@/pages/dashboard/dashboard";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/auth/Login";
import ProtectedRoute from "./pages/ProtectedRoute";
import NotFoundPage from "./pages/NotFound";
import PermissionMatrix from "./pages/permissions/page";
import ProjectsPage from "./pages/projects/page";
import SettingsPage from "./pages/settings/page";
import SupervisorsPage from "./pages/supervisors/page";
import TeamsPage from "./pages/teams/page";

const routes = [
	{
		path: "/",
		Component: ProtectedRoute,
		children: [
			{
				path: "dashboard",
				Component: DashboardPage,
			},
			{
				path: "/supervisors",
				Component: SupervisorsPage,
			},
			{
				path: "/projects",
				Component: ProjectsPage,
			},
			{
				path: "/teams",
				Component: TeamsPage,
			},
			{
				path: "/settings",
				Component: SettingsPage,
			},
		],
	},
	{
		path: "/login",
		Component: LoginPage,
	},
	{
		path: "/permissions",
		Component: PermissionMatrix,
	},
	{
		path: "*",
		Component: NotFoundPage,
	},
];

let router = createBrowserRouter(routes);

export default function App() {
	return <RouterProvider router={router} />;
}
