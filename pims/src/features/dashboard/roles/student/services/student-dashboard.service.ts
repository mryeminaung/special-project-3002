import api from "@/api/api";

export type ProjectMilestone = "completed" | "not completed" | "not submitted" | "pending" | "submitted";

export type StudentDashboardData = {
	stats: {
		totalProposals: number;
		pendingProposals: number;
		totalProjects: number;
		upcomingDeadlines: number;
	};
	proposal: {
		id: number;
		title: string;
		slug: string;
		status: string;
		type: string;
		projectType: string;
		projectArea: string | null;
		submittedAt: string | null;
		supervisor: string | null;
	} | null;
	project: {
		id: number;
		name: string;
		slug: string;
		status: string;
		midReport: ProjectMilestone;
		midSeminar: ProjectMilestone;
		finalReport: ProjectMilestone;
		finalSeminar: ProjectMilestone;
		midReportApproved: boolean;
		finalReportApproved: boolean;
		midSeminarDeadline: string | null;
		finalSeminarDeadline: string | null;
	} | null;
	supervisor: {
		name: string;
		email: string;
		department: string | null;
	} | null;
	upcomingDeadlines: Array<{ title: string; date: string }>;
};

export async function getStudentDashboardData(): Promise<StudentDashboardData> {
	const res = await api.get("/dashboard");
	return res.data?.data ?? res.data;
}
