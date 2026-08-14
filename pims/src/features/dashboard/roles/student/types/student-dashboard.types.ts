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
