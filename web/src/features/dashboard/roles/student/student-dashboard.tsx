import PageWrapper from "@/components/common/page-wrapper";
import { PAGE_META } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useAuthStore } from "@/stores/use-auth-store";
import { useQuery } from "@tanstack/react-query";
import LatestNotifications from "./components/latest-notifications";
import ProjectProgress from "./components/project-progress";
import QuickActions from "./components/quick-actions";
import RecentActivities from "./components/recent-activities";
import { StudentCards } from "./components/student-card";
import SupervisorInfo from "./components/supervisor-info";
import UpcomingDeadlines from "./components/upcoming-deadlines";
import {
	defaultStudentData,
	getStudentDashboardData,
} from "./services/student-dashboard.service";

export default function StudentDashboard() {
	useHeaderInitializer(PAGE_META.studentDashboard.title, PAGE_META.studentDashboard.subtitle);
	const authUser = useAuthStore((state) => state.authUser);

	const { data: dashboardData } = useQuery({
		queryKey: ["studentDashboardData"],
		queryFn: getStudentDashboardData,
	});

	const data = {
		...defaultStudentData,
		...dashboardData,
		stats: { ...defaultStudentData.stats, ...(dashboardData?.stats ?? {}) },
	};

	return (
		<PageWrapper>
			<div className="mb-6">
				<Heading
					title={`Welcome Back, ${authUser.name}!`}
					description="Track your projects, proposals, and keep up with deadlines."
				/>
			</div>

			{/* Stat Cards */}
			<div className="mb-6">
				<StudentCards stats={data.stats} />
			</div>

			{/* Project Progress + Upcoming Deadlines */}
			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<ProjectProgress projects={data.projectProgress} />
				<UpcomingDeadlines deadlines={data.upcomingDeadlines} />
			</div>

			{/* Supervisor Card */}
			<div className="mb-6">
				<SupervisorInfo supervisor={data.supervisor} />
			</div>

			{/* Quick Actions */}
			<div className="mb-6">
				<Heading
					title="Quick Actions"
					description="Common tasks and shortcuts"
				/>
				<div className="mt-4">
					<QuickActions />
				</div>
			</div>

			{/* Recent Activities + Notifications */}
			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<RecentActivities activities={data.recentActivities} />
				<LatestNotifications notifications={data.notifications} />
			</div>
		</PageWrapper>
	);
}
