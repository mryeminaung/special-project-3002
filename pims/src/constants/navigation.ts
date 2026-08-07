import {
	IconCalendarEvent,
	IconDeviceTabletSearch,
	IconFileDescription,
	IconLayoutDashboard,
	IconListDetails,
	IconSend,
	IconSettings,
	IconUsersGroup,
} from "@tabler/icons-react";
import { ShieldCheckIcon } from "lucide-react";

// ─── Page Meta (useHeaderInitializer) ────────────────────────────────────────
export const PAGE_META = {
	login: { title: "MIIT | Log In to the site", subtitle: "" },
	adminDashboard: { title: "MIIT | Admin Dashboard", subtitle: "Dashboard" },
	icDashboard: { title: "MIIT | IC Dashboard", subtitle: "Dashboard" },
	facultyDashboard: {
		title: "MIIT | Supervisor Dashboard",
		subtitle: "Dashboard",
	},
	studentDashboard: {
		title: "MIIT | Student Dashboard",
		subtitle: "Dashboard",
	},
	studentAffairsDashboard: {
		title: "MIIT | Student Affairs Dashboard",
		subtitle: "Dashboard",
	},
	announcements: { title: "MIIT | Announcements", subtitle: "Announcements" },
	events: { title: "MIIT | Events", subtitle: "Events" },
	proposals: { title: "MIIT | Proposals", subtitle: "Submitted Proposals" },
	myProposals: { title: "MIIT | My Proposals", subtitle: "My Proposals" },
	browseProposals: {
		title: "MIIT | Browse Proposals",
		subtitle: "Browse Proposals",
	},
	createProposal: {
		title: "MIIT | Proposal Submission",
		subtitle: "Create New Proposal",
	},
	editProposal: {
		title: "MIIT | Proposal Editing",
		subtitle: "Edit Proposal",
	},
	projects: { title: "MIIT | Projects", subtitle: "Approved Projects" },
	myProjects: { title: "MIIT | My Projects", subtitle: "My Projects" },
	assignedProjects: {
		title: "MIIT | Assigned Projects",
		subtitle: "Assigned Projects",
	},
	faculties: { title: "MIIT | Faculties", subtitle: "Faculties List" },
	facultyDetail: {
		title: "MIIT | Faculty Detail",
		subtitle: "Faculty Detail",
	},
	supervisors: {
		title: "MIIT | Supervisors",
		subtitle: "Assigned Supervisors",
	},
	supervisorDetail: {
		title: "MIIT | Supervisor Detail",
		subtitle: "Supervisor Detail",
	},
	settings: { title: "MIIT | Settings", subtitle: "Settings" },
} as const;

// ─── Heading Content (title + description passed to <Heading />) ─────────────
export const HEADINGS = {
	// Dashboards
	adminDashboard: {
		title: "Admin Dashboard",
		description: "Overview of project management activities and statistics",
	},
	icDashboard: {
		title: "IC Dashboard",
		description: "Overview of project management activities and statistics",
	},
	facultyDashboard: {
		title: "Supervisor Dashboard",
		description:
			"Monitor project health, review student submissions, and manage your mentorship workload.",
	},
	studentDashboard: {
		title: "Welcome Back!", // NOTE: dynamic name appended at call site
		description:
			"Track your projects, proposals, and keep up with deadlines.",
	},
	studentAffairsDashboard: {
		title: "Student Affairs Dashboard",
		description: "Overview of project management activities and statistics",
	},

	// Announcements
	announcements: {
		title: "Announcements",
		// dynamic: different description for IC vs others
		descriptionIC:
			"Create and manage announcements for students and faculties.",
		descriptionDefault:
			"View the latest announcements for students and faculties.",
	},

	// Events
	events: {
		title: "Choose Event Type",
		description: "Select an event type to manage project events and deadlines.",
	},

	// Proposals
	proposals: {
		title: "Proposals",
		description:
			"Browse and manage project proposals with team assignments and supervisors.",
	},
	myProposals: {
		title: "My Proposals",
		description:
			"View and track the status of proposals you've led or joined as a team member.",
	},
	browseProposals: {
		title: "Browse Proposals",
		description:
			"Browse and manage project proposals with team assignments and supervisors.",
	},
	createProposal: {
		title: "Submit Your Proposal",
		description:
			"Complete the form below to submit your academic project proposal for review.",
	},

	// Projects
	projects: {
		title: "Projects",
		description:
			"Browse and manage project proposals with team assignments and supervisors.",
	},
	myProjects: {
		title: "Projects Workspace",
		description:
			"Oversee your active collaborations, track project status, and coordinate with supervisors.",
	},
	assignedProjects: {
		title: "Assigned Projects",
		description:
			"Overview of project teams and student proposals currently under your supervision.",
	},

	// Users
	faculties: {
		title: "Faculties",
		description:
			"Browse and manage project proposals with team assignments and supervisors.",
	},
	supervisors: {
		title: "Supervisors",
		description:
			"Browse and manage project proposals with team assignments and supervisors.",
	},

	// Settings
	settings: {
		title: "Settings",
		description: "Manage your account, security, and preferences",
	},
} as const;

// ─── Sidebar Navigation Items ────────────────────────────────────────────────
export const NAV_ITEMS = {
	admin: [
		{ title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
		{ title: "Events", url: "/admin/events", icon: IconCalendarEvent },
		{
			title: "Project Areas",
			url: "/admin/project-areas",
			icon: IconFileDescription,
		},
		{ title: "Students", url: "/students", icon: ShieldCheckIcon },
		{ title: "Faculties", url: "/admin/faculties", icon: ShieldCheckIcon },
		{
			title: "Departments",
			url: "/admin/departments",
			icon: IconListDetails,
		},
		{ title: "Settings", url: "/settings", icon: IconSettings },
	],

	ic: [
		{ title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
		{ title: "Events", url: "/events", icon: IconCalendarEvent },
		{ title: "Announcements", url: "/announcements", icon: IconSend },
		{
			title: "Project Proposals",
			url: "/proposals",
			icon: IconFileDescription,
		},
		{ title: "Supervisors", url: "/supervisors", icon: ShieldCheckIcon },
		{ title: "Projects", url: "/projects", icon: IconListDetails },
		{ title: "Faculties", url: "/faculties", icon: IconUsersGroup },
		{ title: "Students", url: "/students", icon: ShieldCheckIcon },
		{ title: "Settings", url: "/settings", icon: IconSettings },
	],

	supervisor: [
		{ title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
		{ title: "Events", url: "/events", icon: IconCalendarEvent },
		{ title: "Announcements", url: "/announcements", icon: IconSend },
		{
			title: "Browse Proposals",
			url: "/proposals/browse",
			icon: IconDeviceTabletSearch,
		},
		{
			title: "Assigned Projects",
			url: "/assigned-projects",
			icon: IconListDetails,
		},
		{ title: "Settings", url: "/settings", icon: IconSettings },
	],

	student: [
		{ title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
		{ title: "Events", url: "/events", icon: IconCalendarEvent },
		{ title: "Announcements", url: "/announcements", icon: IconSend },
		{
			title: "My Proposals",
			url: "/proposals/me",
			icon: IconFileDescription,
		},
		{ title: "My Projects", url: "/projects/me", icon: IconListDetails },
		{ title: "Settings", url: "/settings", icon: IconSettings },
	],

	studentAffairs: [
		{ title: "Dashboard", url: "/dashboard", icon: IconLayoutDashboard },
		{
			title: "Project Proposals",
			url: "/proposals",
			icon: IconFileDescription,
		},
		{ title: "Supervisors", url: "/supervisors", icon: ShieldCheckIcon },
		{ title: "Projects", url: "/projects", icon: IconListDetails },
		{ title: "Settings", url: "/settings", icon: IconSettings },
	],
} as const;
