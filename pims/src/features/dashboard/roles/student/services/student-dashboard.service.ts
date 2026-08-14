import api from "@/api/api";

export type ProjectMilestone = "completed" | "not completed" | "not submitted" | "pending" | "submitted";

export type StudentDashboardData = {
	stats: {
		totalProjects: number;
		totalProposals: number;
		pendingItems: number;
		nextDeadline: number | null;
	};
	projectProgress?: Array<{
		id: string;
		name: string;
		slug: string;
		supervisorName: string;
		midReport: ProjectMilestone;
		midSeminar: ProjectMilestone;
		finalReport: ProjectMilestone;
		finalSeminar: ProjectMilestone;
	}>;
	supervisor?: {
		id: string;
		name: string;
		email: string;
		department?: string;
		phone?: string;
	} | null;
};

export async function getStudentDashboardData(): Promise<StudentDashboardData> {
	const res = await api.get("/dashboard");
	// Unwrap ApiResponse trait: { success, message, data: X, status }
	return res.data?.data ?? res.data;
}
