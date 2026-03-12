import BrowseProposalsPage from "@/pages/proposals/faculties/browse-proposals";
import CreateFacultyProposal from "@/pages/proposals/faculties/create-faculty-proposal";
import ProjectsProposalPage from "@/pages/proposals/page";
import ProposalDetailPage from "@/pages/proposals/proposal-detail";
import CreateProposalPage from "@/pages/proposals/students/create-proposal";
import EditProposalPage from "@/pages/proposals/students/edit-proposal";
import MyProposasPage from "@/pages/proposals/students/my-proposals";

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
		path: "/project-proposals/:slug/detail",
		Component: ProposalDetailPage,
	},
];
