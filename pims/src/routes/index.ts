import ProtectedRoute from "@/components/auth/protected-route";
import { AdminRoute, ICRoute, SARoute, StudentOrICOrSARoute, StudentRoute } from "@/components/auth/role-route";
import NotFoundPage from "@/components/common/not-found";

import { adminRoutes } from "@/features/admin";
import StuListPage from "@/features/admin/pages/stu-list-page";
import { saRoutes } from "@/features/student-affairs/sa.route";
import { facultiesRoutes } from "@/features/faculties";
import { projectsRoutes } from "@/features/projects";
import { proposalRoutes } from "@/features/proposals";
import { settingsRoutes } from "@/features/settings";
import { studentRoutes, studentDetailRoutes } from "@/features/student";

import { AnnouncementsPage } from "@/features/announcements";
import { LoginPage } from "@/features/auth";
import { DashboardPage } from "@/features/dashboard";
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
				path: "/supervisors/:id/detail",
				Component: SupervisorDetailPage,
			},
			{
				path: "/supervisors",
				Component: SupervisorsPage,
			},
			// Student-only routes
			{
				Component: StudentRoute,
				children: studentRoutes,
			},
			// Student + IC + Student Affairs (detail pages)
			{
				Component: StudentOrICOrSARoute,
				children: studentDetailRoutes,
			},
			...facultiesRoutes,
			// Admin-only routes
			{
				Component: AdminRoute,
				children: adminRoutes,
			},
			// IC-only routes
			{
				Component: ICRoute,
				children: [
					{ path: "/students", Component: StuListPage },
				],
			},
			...projectsRoutes,
			...proposalRoutes,
			...settingsRoutes,
			// Student Affairs routes
			{
				Component: SARoute,
				children: saRoutes,
			},
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
