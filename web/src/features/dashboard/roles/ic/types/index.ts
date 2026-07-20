export interface StatCardData {
	label: string;
	value: number;
	icon: string;
	trend?: {
		value: number;
		direction: "up" | "down";
	};
	color: string;
	pageUrl: string;
}

export interface ProposalStatusData {
	name: string;
	value: number;
	color: string;
}

export interface MonthlySubmissionData {
	month: string;
	count: number;
}

export interface ActivityItem {
	id: number;
	icon: string;
	description: string;
	timestamp: string;
	type: "proposal" | "project" | "student" | "system";
}

export interface DeadlineItem {
	id: number;
	title: string;
	date: string;
	type: "proposal" | "seminar" | "report" | "defense";
}

export interface SupervisorWorkloadData {
	id: number;
	name: string;
	assigned: number;
	maxCapacity: number;
	department: string;
}

export interface NotificationItem {
	id: number;
	icon: string;
	message: string;
	timestamp: string;
	read: boolean;
	type: "info" | "warning" | "success";
}

export interface ProjectProgressItem {
	id: number;
	name: string;
	slug: string;
	supervisorName: string;
	midReport: string;
	midSeminar: string;
	finalReport: string;
	finalSeminar: string;
}

export interface ICDashboardData {
	stats: {
		pendingProposals: number;
		approvedProjects: number;
		completedProjects: number;
		overdueProjects: number;
	};
	proposalStatus: ProposalStatusData[];
	monthlySubmissions: MonthlySubmissionData[];
	projectProgress: ProjectProgressItem[];
	recentActivities: ActivityItem[];
	upcomingDeadlines: DeadlineItem[];
	supervisorWorkload: SupervisorWorkloadData[];
	notifications: NotificationItem[];
}
