import FacultiesProposalsPage from "./faculties-proposals-page";
import BrowseProposalsPage from "./faculties/browse-proposals";
import CreateFacultyProposalPage from "./faculties/create-faculty-proposal";
import FacultyProposalDetailPage from "./faculties/faculty-proposal-detail";
import ProjectsProposalPage from "./proposals-page";
import CreateStudentProposalPage from "./students/pages/create-student-proposal";
import EditProposalPage from "./students/pages/edit-proposal";
import MyProposasPage from "./students/pages/my-proposals";
import StudentProposalDetailPage from "./students/pages/student-proposal-detail";

export const proposalRoutes = [
	// Base path for proposals
	{
		path: "/proposals",
		Component: ProjectsProposalPage,
	},
	// Student proposal routes
	{
		path: "/proposals/new/student",
		Component: CreateStudentProposalPage,
	},
	// Faculty proposal routes
	{
		path: "/proposals/new/faculty",
		Component: CreateFacultyProposalPage,
	},
	// Student proposals
	{
		path: "/proposals/me",
		Component: MyProposasPage,
	},
	{
		path: "/proposals/me/:id/edit",
		Component: EditProposalPage,
	},
	// Faculty proposals
	{
		path: "/proposals/browse",
		Component: BrowseProposalsPage,
	},
	{
		path: "/proposals/faculties",
		Component: FacultiesProposalsPage,
	},
	// Proposal details for students and faculty
	{
		path: "/proposals/student/:slug/detail",
		Component: StudentProposalDetailPage,
	},
	{
		path: "/proposals/faculty/:slug/detail",
		Component: FacultyProposalDetailPage,
	},
];
