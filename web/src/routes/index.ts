import LoginPage from '@/pages/auth/login';
import DashboardPage from '@/pages/dashboard/dashboard';
import BrowseProposalsPage from '@/pages/faculties/browse-proposals';
import FacultiesPage from '@/pages/faculties/page';
import NotFoundPage from '@/pages/NotFound';
import PermissionMatrix from '@/pages/permissions/page';
import ProjectsPage from '@/pages/projects/page';
import CreateProposalPage from '@/pages/proposals/create-proposal';
import EditProposalPage from '@/pages/proposals/edit-proposal';
import ProjectsProposalPage from '@/pages/proposals/page';
import ProposalDetailPage from '@/pages/proposals/proposal-detail';
import MyProposalsPage from '@/pages/proposals/students/my-proposals';
import ProtectedRoute from '@/pages/ProtectedRoute';
import SettingsPage from '@/pages/settings/page';
import SupervisorsPage from '@/pages/supervisors/page';
import SupervisorDetailPage from '@/pages/supervisors/supervisor-detail';
import TeamsPage from '@/pages/teams/page';

export const routes = [
  {
    path: '/',
    Component: ProtectedRoute,
    children: [
      {
        path: 'dashboard',
        Component: DashboardPage,
      },
      {
        path: '/faculties',
        Component: FacultiesPage,
      },
      {
        path: '/project-proposals/create',
        Component: CreateProposalPage,
      },
      {
        path: '/project-proposals/submission',
        Component: ProjectsProposalPage,
      },
      {
        path: '/project-proposals/my-proposal',
        Component: MyProposalsPage,
      },
      {
        path: '/project-proposals/my-proposal/:id/edit',
        Component: EditProposalPage,
      },
      {
        path: '/project-proposals/my',
        Component: BrowseProposalsPage,
      },
      {
        path: '/project-proposals/detail/:slug',
        Component: ProposalDetailPage,
      },
      {
        path: '/supervisors',
        Component: SupervisorsPage,
      },
      {
        path: '/supervisors/detail/:id',
        Component: SupervisorDetailPage,
      },
      {
        path: '/projects',
        Component: ProjectsPage,
      },
      {
        path: '/teams',
        Component: TeamsPage,
      },
      {
        path: '/settings',
        Component: SettingsPage,
      },
    ],
  },
  {
    path: '/login',
    Component: LoginPage,
  },
  {
    path: '/permissions',
    Component: PermissionMatrix,
  },
  {
    path: '*',
    Component: NotFoundPage,
  },
];
