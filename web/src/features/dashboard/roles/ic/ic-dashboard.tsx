import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import ChartsSection from "./components/charts-section";
import ProjectProgressTable from "./components/project-progress-table";
import QuickActions from "./components/quick-actions";
import StatCards from "./components/stat-cards";
import LatestNotifications from "./components/widgets/latest-notifications";
import RecentActivities from "./components/widgets/recent-activities";
import SupervisorWorkload from "./components/widgets/supervisor-workload";
import UpcomingDeadlines from "./components/widgets/upcoming-deadlines";
import { getICDashboardData } from "./services/ic-dashboard.service";

export default function ICDashboard() {
	useHeaderInitializer("MIIT | IC Dashboard", "Dashboard");

	const { data: dashboardData } = useQuery({
		queryKey: ["icDashboardData"],
		queryFn: getICDashboardData,
	});

	return (
		<PageWrapper>
			{/* Page Header */}
			<div className="mb-6">
				<Heading
					title="IC Dashboard"
					description="Overview of project management activities and statistics"
				/>
			</div>

			{/* KPI Stat Cards */}
			<div className="mb-6">
				<StatCards stats={dashboardData?.stats} />
			</div>

			{/* Charts Row */}
			<div className="mb-6">
				<ChartsSection data={dashboardData} />
			</div>

			{/* Project Progress Table */}
			<div className="mb-6">
				<ProjectProgressTable projects={dashboardData?.projectProgress} />
			</div>

			{/* Widgets Grid (2x2) */}
			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<RecentActivities activities={dashboardData?.recentActivities} />
				<UpcomingDeadlines deadlines={dashboardData?.upcomingDeadlines} />
				<SupervisorWorkload workload={dashboardData?.supervisorWorkload} />
				<LatestNotifications notifications={dashboardData?.notifications} />
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
		</PageWrapper>
	);
}
