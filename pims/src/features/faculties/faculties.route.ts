import FacultiesPage from "./pages/faculties-page";
import FacultyDetailPage from "./pages/faculty-detail-page";
import BrowseProposalsPage from "./pages/browse-proposals";
import CreateFacultyProposalPage from "./pages/create-faculty-proposal";
import FacultyProposalDetailPage from "./pages/faculty-proposal-detail";
import FacultiesProposalsPage from "./pages/faculties-proposals-page";

export const facultiesRoutes = [
	{ path: "/faculties",                      Component: FacultiesPage },
	{ path: "/faculties/:id/detail",           Component: FacultyDetailPage },
	{ path: "/proposals/browse",               Component: BrowseProposalsPage },
	{ path: "/proposals/new/faculty",          Component: CreateFacultyProposalPage },
	{ path: "/proposals/faculty/:slug/detail", Component: FacultyProposalDetailPage },
	{ path: "/proposals/faculties",            Component: FacultiesProposalsPage },
];
