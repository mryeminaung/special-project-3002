import { adminRoutes } from "@/pages/admin/admin.route";
import AnnouncementsPage from "@/pages/announcements/announcements-page";
import LoginPage from "@/pages/auth/login";
import NotFoundPage from "@/pages/auth/not-found";
import ProtectedRoute from "@/pages/auth/protected-route";
import DashboardPage from "@/pages/dashboard/dashboard";
import EventsPage from "@/pages/events/event-page";
import FacultiesPage from "@/pages/faculties/page";
import { projectsRoutes } from "@/pages/projects/projects.route";
import { proposalRoutes } from "@/pages/proposals/proposals.route";
import { settingsRoutes } from "@/pages/settings/settings.route";
import SupervisorsPage from "@/pages/supervisors/page";
import SupervisorDetailPage from "@/pages/supervisors/supervisor-detail";

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
			...adminRoutes,
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
