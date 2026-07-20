import api from "@/api/api";
import type {
	ActivityItem,
	DeadlineItem,
	ICDashboardData,
	MonthlySubmissionData,
	NotificationItem,
	ProjectProgressItem,
	ProposalStatusData,
	SupervisorWorkloadData,
} from "../types";

// Mock data used when API is unavailable
const mockProposalStatus: ProposalStatusData[] = [
	{ name: "Pending", value: 12, color: "#f59e0b" },
	{ name: "Approved", value: 34, color: "#22c55e" },
	{ name: "Rejected", value: 8, color: "#ef4444" },
	{ name: "Under Review", value: 6, color: "#3b82f6" },
];

const mockMonthlySubmissions: MonthlySubmissionData[] = [
	{ month: "Jan", count: 4 },
	{ month: "Feb", count: 7 },
	{ month: "Mar", count: 5 },
	{ month: "Apr", count: 12 },
	{ month: "May", count: 9 },
	{ month: "Jun", count: 15 },
	{ month: "Jul", count: 11 },
	{ month: "Aug", count: 8 },
	{ month: "Sep", count: 14 },
	{ month: "Oct", count: 10 },
	{ month: "Nov", count: 6 },
	{ month: "Dec", count: 3 },
];

const mockProjectProgress: ProjectProgressItem[] = [
	{
		id: 1,
		name: "LMS System Development",
		slug: "lms-system",
		supervisorName: "Dr. Sandar Min",
		midReport: "completed",
		midSeminar: "completed",
		finalReport: "not submitted",
		finalSeminar: "not submitted",
	},
	{
		id: 2,
		name: "Mobile App for Campus Navigation",
		slug: "campus-nav",
		supervisorName: "Dr. Kyaw Swar Lin",
		midReport: "completed",
		midSeminar: "not completed",
		finalReport: "not submitted",
		finalSeminar: "not submitted",
	},
	{
		id: 3,
		name: "AI Attendance System",
		slug: "ai-attendance",
		supervisorName: "Dr. Nyein Nyein Oo",
		midReport: "not completed",
		midSeminar: "not submitted",
		finalReport: "not submitted",
		finalSeminar: "not submitted",
	},
	{
		id: 4,
		name: "Library Book Management",
		slug: "library-system",
		supervisorName: "Dr. Aung Zaw Myo",
		midReport: "completed",
		midSeminar: "completed",
		finalReport: "completed",
		finalSeminar: "completed",
	},
	{
		id: 5,
		name: "Smart Parking System",
		slug: "smart-parking",
		supervisorName: "Dr. Thein Aung",
		midReport: "completed",
		midSeminar: "completed",
		finalReport: "completed",
		finalSeminar: "not submitted",
	},
];

const mockActivities: ActivityItem[] = [
	{
		id: 1,
		icon: "FileText",
		description:
			'New proposal "AI Attendance System" submitted by Aung Myo Thu',
		timestamp: "2 hours ago",
		type: "proposal",
	},
	{
		id: 2,
		icon: "CheckCircle",
		description: 'Project "LMS System" stage moved to Testing',
		timestamp: "4 hours ago",
		type: "project",
	},
	{
		id: 3,
		icon: "UserPlus",
		description: "15 new students registered for Fall 2024",
		timestamp: "6 hours ago",
		type: "student",
	},
	{
		id: 4,
		icon: "AlertTriangle",
		description: 'Project "Mobile App Dev" is overdue by 3 days',
		timestamp: "8 hours ago",
		type: "project",
	},
	{
		id: 5,
		icon: "Settings",
		description: "System backup completed successfully",
		timestamp: "12 hours ago",
		type: "system",
	},
	{
		id: 6,
		icon: "FileText",
		description: 'Proposal "Campus Nav App" approved by IC committee',
		timestamp: "1 day ago",
		type: "proposal",
	},
];

const mockDeadlines: DeadlineItem[] = [
	{
		id: 1,
		title: "Mid-term Report Submission",
		date: "2024-07-25",
		type: "report",
	},
	{
		id: 2,
		title: "Final Proposal Review - Batch 12",
		date: "2024-07-28",
		type: "proposal",
	},
	{
		id: 3,
		title: "Capstone Project Defense",
		date: "2024-08-05",
		type: "defense",
	},
	{
		id: 4,
		title: "Mid-Seminar Presentation",
		date: "2024-08-10",
		type: "seminar",
	},
	{
		id: 5,
		title: "Faculty Evaluation Deadline",
		date: "2024-08-15",
		type: "report",
	},
];

const mockSupervisorWorkload: SupervisorWorkloadData[] = [
	{
		id: 1,
		name: "Dr. Sandar Min",
		assigned: 8,
		maxCapacity: 10,
		department: "Computer Science",
	},
	{
		id: 2,
		name: "Dr. Kyaw Swar Lin",
		assigned: 6,
		maxCapacity: 10,
		department: "Software Engineering",
	},
	{
		id: 3,
		name: "Dr. Nyein Nyein Oo",
		assigned: 9,
		maxCapacity: 10,
		department: "Information Technology",
	},
	{
		id: 4,
		name: "Dr. Aung Zaw Myo",
		assigned: 4,
		maxCapacity: 10,
		department: "Computer Science",
	},
	{
		id: 5,
		name: "Dr. Thein Aung",
		assigned: 7,
		maxCapacity: 10,
		department: "Electronics",
	},
	{
		id: 6,
		name: "Dr. Myint Myint Aye",
		assigned: 3,
		maxCapacity: 10,
		department: "Mathematics",
	},
];

const mockNotifications: NotificationItem[] = [
	{
		id: 1,
		icon: "FileText",
		message: "New proposal awaiting your review",
		timestamp: "10 min ago",
		read: false,
		type: "info",
	},
	{
		id: 2,
		icon: "AlertTriangle",
		message: "3 projects are overdue",
		timestamp: "1 hour ago",
		read: false,
		type: "warning",
	},
	{
		id: 3,
		icon: "CheckCircle",
		message: "Report exported successfully",
		timestamp: "2 hours ago",
		read: true,
		type: "success",
	},
	{
		id: 4,
		icon: "UserPlus",
		message: "New faculty member registered",
		timestamp: "3 hours ago",
		read: true,
		type: "info",
	},
	{
		id: 5,
		icon: "CheckCircle",
		message: "5 proposals approved this week",
		timestamp: "5 hours ago",
		read: true,
		type: "success",
	},
];

export async function getICDashboardData(): Promise<ICDashboardData> {
	try {
		const res = await api.get("/dashboard");
		console.log("IC Dashboard Data:", res); // Log the response data for debugging
		return res.data.data;
	} catch {
		// Return mock data when API is unavailable
		return {
			stats: {
				pendingProposals: 12,
				approvedProjects: 34,
				completedProjects: 22,
				overdueProjects: 3,
			},
			proposalStatus: mockProposalStatus,
			monthlySubmissions: mockMonthlySubmissions,
			projectProgress: mockProjectProgress,
			recentActivities: mockActivities,
			upcomingDeadlines: mockDeadlines,
			supervisorWorkload: mockSupervisorWorkload,
			notifications: mockNotifications,
		};
	}
}
