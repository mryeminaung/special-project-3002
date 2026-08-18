import SAProposalsPage from "./pages/sa-proposals-page";
import SAProjectsPage from "./pages/sa-projects-page";
import SAStudentsPage from "./pages/sa-students-page";

export const saRoutes = [
	{ path: "/sa/proposals", Component: SAProposalsPage },
	{ path: "/sa/projects",  Component: SAProjectsPage },
	{ path: "/sa/students",  Component: SAStudentsPage },
];
