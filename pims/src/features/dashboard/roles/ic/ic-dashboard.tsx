import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import ChartsSection from "./components/charts-section";
import ProjectProgressTable from "./components/project-progress-table";
import StatCards from "./components/stat-cards";
import RecentActivities from "./components/widgets/recent-activities";
import SupervisorWorkload from "./components/widgets/supervisor-workload";
import UpcomingDeadlines from "./components/widgets/upcoming-deadlines";
import { getICDashboardData } from "./services/ic-dashboard.service";

export default function ICDashboard() {
	useHeaderInitializer(PAGE_META.icDashboard.title, PAGE_META.icDashboard.subtitle);

	const { data: dashboardData } = useQuery({
		queryKey: ["icDashboardData"],
		queryFn: getICDashboardData,
	});

	return (
		<>
			{/* Page Header */}
			<div className="mb-6">
				<Heading
					title={HEADINGS.icDashboard.title}
					description={HEADINGS.icDashboard.description}
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

			{/* Widgets Grid */}
			<div className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<RecentActivities activities={dashboardData?.recentActivities} />
				<UpcomingDeadlines deadlines={dashboardData?.upcomingDeadlines} />
			</div>

			{/* Supervisor Workload — full width */}
			<div className="mb-6">
				<SupervisorWorkload workload={dashboardData?.supervisorWorkload} />
			</div>
		</>
	);
}
