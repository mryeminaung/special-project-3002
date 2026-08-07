import api from "@/api/api";

export interface StudentDashboardData {
	stats: {
		totalProjects: number;
		totalProposals: number;
		pendingItems: number;
		nextDeadline: number;
	};
	projectProgress: {
		id: string;
		name: string;
		slug: string;
		supervisorName: string;
		midReport: "completed" | "not completed" | "not submitted";
		midSeminar: "completed" | "not completed" | "not submitted";
		finalReport: "completed" | "not completed" | "not submitted";
		finalSeminar: "completed" | "not completed" | "not submitted";
	}[];
	upcomingDeadlines: {
		id: number;
		title: string;
		date: string;
		type: "proposal" | "seminar" | "report" | "defense";
	}[];
	supervisor: {
		id: string;
		name: string;
		email: string;
		department: string;
		phone?: string;
	};
	recentActivities: {
		id: number;
		icon: string;
		description: string;
		timestamp: string;
		type: "proposal" | "project" | "system";
	}[];
	notifications: {
		id: number;
		message: string;
		timestamp: string;
		read: boolean;
		type: "info" | "warning" | "success";
	}[];
}

const defaultProgress = [
	{
		id: "PRJ-001",
		name: "AI Attendance System",
		slug: "ai-attendance",
		supervisorName: "Dr. Nyein Nyein Oo",
		midReport: "completed" as const,
		midSeminar: "completed" as const,
		finalReport: "not submitted" as const,
		finalSeminar: "not submitted" as const,
	},
];

const defaultDeadlines = [
	{
		id: 1,
		title: "Mid-term Report Submission",
		date: "2026-08-01",
		type: "report" as const,
	},
	{
		id: 2,
		title: "Mid-Seminar Presentation",
		date: "2026-08-15",
		type: "seminar" as const,
	},
	{
		id: 3,
		title: "Final Report Submission",
		date: "2026-09-30",
		type: "report" as const,
	},
	{
		id: 4,
		title: "Final Defense",
		date: "2026-10-15",
		type: "defense" as const,
	},
];

const defaultActivities = [
	{
		id: 1,
		icon: "FileText",
		description: 'Proposal "AI Attendance System" submitted for review',
		timestamp: "2 days ago",
		type: "proposal" as const,
	},
	{
		id: 2,
		icon: "CheckCircle",
		description: "Mid-report marked as completed by supervisor",
		timestamp: "5 days ago",
		type: "project" as const,
	},
	{
		id: 3,
		icon: "CheckCircle",
		description: 'Project "AI Attendance System" approved',
		timestamp: "1 week ago",
		type: "project" as const,
	},
	{
		id: 4,
		icon: "FileText",
		description: "Supervisor feedback received on proposal",
		timestamp: "1 week ago",
		type: "system" as const,
	},
];

const defaultNotifications = [
	{
		id: 1,
		message: "Your supervisor has submitted feedback on your mid-report",
		timestamp: "1 hour ago",
		read: false,
		type: "info" as const,
	},
	{
		id: 2,
		message: "Mid-term report deadline is approaching in 7 days",
		timestamp: "1 day ago",
		read: false,
		type: "warning" as const,
	},
	{
		id: 3,
		message: "Final defense schedule published — check deadlines",
		timestamp: "3 days ago",
		read: true,
		type: "info" as const,
	},
];

export const defaultStudentData: StudentDashboardData = {
	stats: {
		totalProjects: 1,
		totalProposals: 3,
		pendingItems: 3,
		nextDeadline: 8,
	},
	projectProgress: defaultProgress,
	upcomingDeadlines: defaultDeadlines,
	supervisor: {
		id: "SUP-001",
		name: "Dr. Nyein Nyein Oo",
		email: "nyeinnyeinoo@miit.edu.mm",
		department: "Computer Science",
		phone: "+95 9 123 456 789",
	},
	recentActivities: defaultActivities,
	notifications: defaultNotifications,
};

export async function getStudentDashboardData(): Promise<StudentDashboardData> {
	const res = await api.get("/dashboard");
	return res.data;
}
