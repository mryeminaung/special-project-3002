import FacultiesProposalsPage from "./faculties-proposals-page";
import BrowseProposalsPage from "./faculties/browse-proposals";
import CreateFacultyProposal from "./faculties/create-faculty-proposal";
import FacultyProposalDetailPage from "./faculties/faculty-proposal-detail";
import ProjectsProposalPage from "./page";
import CreateProposalPage from "./students/create-proposal";
import EditProposalPage from "./students/edit-proposal";
import MyProposasPage from "./students/my-proposals";
import StudentProposalDetailPage from "./students/student-proposal-detail";

export const proposalRoutes = [
	{
		path: "/project-proposals/create",
		Component: CreateProposalPage,
	},
	{
		path: "/project-proposals/create-faculty-proposal",
		Component: CreateFacultyProposal,
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
		path: "/project-proposals/faculties",
		Component: FacultiesProposalsPage,
	},
	{
		path: "/project-proposals/student/:slug/detail",
		Component: StudentProposalDetailPage,
	},
	{
		path: "/project-proposals/faculty/:slug/detail",
		Component: FacultyProposalDetailPage,
	},
];
