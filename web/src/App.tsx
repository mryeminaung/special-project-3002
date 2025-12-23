import DashboardPage from "@/pages/dashboard/dashboard";
import { createBrowserRouter } from "react-router";
import { RouterProvider } from "react-router/dom";
import LoginPage from "./pages/auth/login";
import FacultiesPage from "./pages/faculties/page";
import NotFoundPage from "./pages/NotFound";
import PermissionMatrix from "./pages/permissions/page";
import ProjectsPage from "./pages/projects/page";
import CreateProposalPage from "./pages/proposals/create";
import ProjectsProposalPage from "./pages/proposals/page";
import ProtectedRoute from "./pages/ProtectedRoute";
import SettingsPage from "./pages/settings/page";
import SupervisorsPage from "./pages/supervisors/page";
import TeamsPage from "./pages/teams/page";

const routes = [
	{
		path: "/",
		Component: ProtectedRoute,
		children: [
			{
				path: "project-proposal/create",
				Component: CreateProposalPage,
			},
			{
				path: "dashboard",
				Component: DashboardPage,
			},
			{
				path: "/faculties",
				Component: FacultiesPage,
			},
			{
				path: "/project-proposals/submissions",
				Component: ProjectsProposalPage,
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
