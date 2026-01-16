import LoginPage from "@/pages/auth/login";
import DashboardPage from "@/pages/dashboard/dashboard";
import FacultiesPage from "@/pages/faculties/page";
import NotFoundPage from "@/pages/NotFound";
import PermissionMatrix from "@/pages/permissions/page";
import ProjectsPage from "@/pages/projects/page";
import BrowseProposalsPage from "@/pages/proposals/faculties/browse-proposals";
import ProjectsProposalPage from "@/pages/proposals/page";
import ProposalDetailPage from "@/pages/proposals/proposal-detail";
import CreateProposalPage from "@/pages/proposals/students/create-proposal";
import EditProposalPage from "@/pages/proposals/students/edit-proposal";
import MyProposasPage from "@/pages/proposals/students/my-proposals";
import ProtectedRoute from "@/pages/ProtectedRoute";
import SettingsPage from "@/pages/settings/page";
import SupervisorsPage from "@/pages/supervisors/page";
import SupervisorDetailPage from "@/pages/supervisors/supervisor-detail";
import TeamsPage from "@/pages/teams/page";
import MyTasksPage from "@/pages/teams/students/my-tasks";
import MyTeams from "@/pages/teams/students/my-teams";

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
				path: "/faculties",
				Component: FacultiesPage,
			},
			{
				path: "/project-proposals/create",
				Component: CreateProposalPage,
			},
			{
				path: "/project-proposals",
				Component: ProjectsProposalPage,
			},
			{
				path: "/project-proposals/my-proposals",
				Component: MyProposasPage,
			},
			{
				path: "/project-proposals/my-proposal/:id/edit",
				Component: EditProposalPage,
			},
			{
				path: "/project-proposals/my",
				Component: BrowseProposalsPage,
			},
			{
				path: "/project-proposals/:slug/detail",
				Component: ProposalDetailPage,
			},
			{
				path: "/supervisors",
				Component: SupervisorsPage,
			},
			{
				path: "/supervisors/:id/detail",
				Component: SupervisorDetailPage,
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
				path: "/teams/my-teams",
				Component: MyTeams,
			},
			{
				path: "/my-tasks",
				Component: MyTasksPage,
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
