import FacultiesPage from "./pages/faculties-page";
import FacultyDetailPage from "./pages/faculty-detail-page";
import CreateFacultyProposalPage from "./pages/create-faculty-proposal";
import FacultyProposalDetailPage from "./pages/faculty-proposal-detail";
import FacultiesProposalsPage from "./pages/faculties-proposals-page";
import AllProposalsPage from "../proposals/pages/all-proposals-page";
import AssignedProjects from "./projects/pages/assigned-projects";
import FacultyProjectDetailPage from "./projects/pages/faculty-project-detail";

export const facultiesRoutes = [
	{ path: "/faculties",                      Component: FacultiesPage },
	{ path: "/faculties/:id/detail",           Component: FacultyDetailPage },
	{ path: "/proposals/all",                  Component: AllProposalsPage },
	{ path: "/proposals/new/faculty",          Component: CreateFacultyProposalPage },
	{ path: "/proposals/faculty/:slug/detail", Component: FacultyProposalDetailPage },
	{ path: "/proposals/faculties",            Component: FacultiesProposalsPage },
	{ path: "/assigned-projects",              Component: AssignedProjects },
	{ path: "/projects/faculty/:slug/detail",  Component: FacultyProjectDetailPage },
];
