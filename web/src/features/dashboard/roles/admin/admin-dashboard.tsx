import api from "@/api/api";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { IconDownload, IconRefresh } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import ProjectProgressTable from "../../components/project-progress-table";
import ProjectsChart from "../../components/projects-chart";
import { AdminCards } from "./components/admin-cards";

export default function AdminDashboard() {
	useHeaderInitializer("MIIT | Admin Dashboard", "Dashboard");

	const fetchDashboardData = async () => {
		const res = await api.get("/dashboard");
		return res.data;
	};

	const { data: dashboardData } = useQuery({
		queryKey: ["dashboardData"],
		queryFn: fetchDashboardData,
	});

	return (
		<PageWrapper>
			<div className="mb-5 space-y-3">
				<Heading
					title="Admin Dashboard"
					description="Overview of project management activities and statistics"
				/>
				{dashboardData && <AdminCards dashboardData={dashboardData} />}
			</div>

			<div className="mb-5 space-y-3 hidden">
				<div className="flex items-center justify-between">
					<Heading
						title="Projects Progress"
						description="Overview of all projects completion status"
					/>
					<div className="flex items-center ml-auto gap-x-3 hidden">
						<Button
							className="hover:cursor-pointer bg-primary-600 hover:bg-primary-600/80 ml-auto hover:text-white text-white"
							onClick={() => alert("Refreshing...")}
							variant={"outline"}>
							<IconRefresh />
							<span>Refresh</span>
						</Button>
						<Button
							className="hover:cursor-pointer bg-primary-600 hover:bg-primary-600/80 ml-auto hover:text-white text-white"
							onClick={() => alert("Downloading...")}
							variant={"outline"}>
							<IconDownload />
							<span>Export</span>
						</Button>
					</div>
				</div>

				{dashboardData && (
					<ProjectProgressTable projects={dashboardData.projectsProgress} />
				)}
			</div>

			<Card className="shadow-2xs px-6 mt-8 hidden">
				<div className="flex flex-row items-center justify-between">
					<Heading
						title="Projects Progress"
						description="Overview of all projects completion status"
					/>
					<Button
						className="hover:cursor-pointer bg-primary-700 hover:bg-primary-700/80 hover:text-white text-white"
						onClick={() => alert("Downloading...")}
						variant={"outline"}>
						<IconDownload />
						<span>Export</span>
					</Button>
				</div>
				{true ? (
					<h2 className="text-center text-3xl my-5 font-bold">Coming Soon!</h2>
				) : (
					<ProjectsChart />
				)}
			</Card>
		</PageWrapper>
	);
}
