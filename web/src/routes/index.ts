import AnnouncementsPage from "@/pages/announcements/page";
import LoginPage from "@/pages/auth/login";
import NotFoundPage from "@/pages/auth/not-found";
import ProtectedRoute from "@/pages/auth/protected-route";
import DashboardPage from "@/pages/dashboard/dashboard";
import EventsPage from "@/pages/events/page";
import FacultiesPage from "@/pages/faculties/page";
import SupervisorsPage from "@/pages/supervisors/page";
import SupervisorDetailPage from "@/pages/supervisors/supervisor-detail";
import { projectsRoutes } from "./projects";
import { proposalRoutes } from "./proposals";
import { settingsRoutes } from "./settings";

export const routes = [
	{
		path: "/",
		Component: ProtectedRoute,
		children: [
			{
				path: "dashboard",
				Component: DashboardPage,
			},
			{
				path: "events",
				Component: EventsPage,
			},
			{
				path: "announcements",
				Component: AnnouncementsPage,
			},
			{
				path: "/faculties",
				Component: FacultiesPage,
			},
			{
				path: "/supervisors",
				Component: SupervisorsPage,
			},
			{
				path: "/supervisors/:id/detail",
				Component: SupervisorDetailPage,
			},
			...projectsRoutes,
			...proposalRoutes,
			...settingsRoutes,
		],
	},
	{
		path: "/login",
		Component: LoginPage,
	},
	{
		path: "*",
		Component: NotFoundPage,
	},
];
