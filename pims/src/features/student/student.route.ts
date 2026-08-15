import CreateStudentProposalPage from "./proposals/pages/create-student-proposal";
import EditProposalPage from "./proposals/pages/edit-proposal";
import MyProposalsPage from "./proposals/pages/my-proposals";
import StudentProposalDetailPage from "./proposals/pages/student-proposal-detail";
import MyProjects from "./projects/pages/my-projects";
import StudentProjectDetailPage from "./projects/pages/student-project-detail";

export const studentRoutes = [
	{ path: "/proposals/new/student", Component: CreateStudentProposalPage },
	{ path: "/proposals/me",          Component: MyProposalsPage },
	{ path: "/proposals/me/:id/edit", Component: EditProposalPage },
	{ path: "/projects/me",           Component: MyProjects },
];

export const studentDetailRoutes = [
	{ path: "/proposals/student/:slug/detail", Component: StudentProposalDetailPage },
	{ path: "/projects/student/:slug/detail",  Component: StudentProjectDetailPage },
];
