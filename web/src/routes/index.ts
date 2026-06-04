import ProtectedRoute from "@/components/auth/protected-route";
import NotFoundPage from "@/components/common/not-found";

import { adminRoutes } from "@/features/admin";
import { projectsRoutes } from "@/features/projects";
import { proposalRoutes } from "@/features/proposals";
import { settingsRoutes } from "@/features/settings";

import { AnnouncementsPage } from "@/features/announcements";
import { LoginPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
import { FacultiesPage } from "@/features/faculties";
import { SupervisorsPage } from "@/features/supervisors";

import EventsPage from "@/features/events/event-page";
import SupervisorDetailPage from "@/features/supervisors/pages/supervisor-detail";

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
		path: "/auth/login",
		Component: LoginPage,
	},
	{
		path: "*",
		Component: NotFoundPage,
	},
];
