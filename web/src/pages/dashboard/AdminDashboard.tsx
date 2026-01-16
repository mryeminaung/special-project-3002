import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { IconDownload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AdminCards } from "./components/admin-cards";
import ProjectsChart from "./components/projects-chart";

export default function AdminDashboard() {
	useHeaderInitializer("MIIT | IC Dashboard", "Dashboard");

	const [dashboardData, setDashboardData] = useState<{ noOfProposals: number }>(
		{
			noOfProposals: 0,
		},
	);

	const fetchDashboardData = async () => {
		const res = await api.get("/dashboard");
		setDashboardData(res.data);
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	return (
		<div className="max-w-7xl mx-auto">
			<div className="space-y-4 mb-8">
				{dashboardData && (
					<AdminCards noOfProposals={dashboardData?.noOfProposals} />
				)}
			</div>

			<Card className="shadow-2xs px-6">
				<div className="flex flex-row items-center justify-between">
					<div className="space-y-1">
						<h3 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-100">
							Projects Progress
						</h3>
						<p className="text-sm text-neutral-500">
							Overview of all projects completion status
						</p>
					</div>
					<Button
						className="hover:cursor-pointer bg-primary-700 hover:bg-primary-700/80 hover:text-white text-white"
						onClick={() => alert("Downloading...")}
						variant={"outline"}>
						<IconDownload />
						<span>Export</span>
					</Button>
				</div>
				{false ? (
					<h2 className="text-center text-3xl my-5 font-bold">Coming Soon!</h2>
				) : (
					<ProjectsChart />
				)}
			</Card>
		</div>
	);
}
