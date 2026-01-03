import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { IconDownload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { AdminCards } from "./components/admin-cards";
import ProjectsChart from "./components/projects-chart";

export default function AdminDashboard() {
	useHeaderInitializer("MIIT| IC Dashboard", "Dashboard");

	const [dashboardData, setDashboardData] = useState<{ noOfProposals: number }>(
		{
			noOfProposals: 0,
		},
	);

	const fetchDashboardData = async () => {
		const res = await api.get("/dashboard");
		setDashboardData(res.data);
		console.log(res.data);
	};

	useEffect(() => {
		fetchDashboardData();
	}, []);

	return (
		<RootLayout>
			<div className="max-w-7xl mx-auto">
				<div className="space-y-4 mb-8 ">
					<div className="mx-6">
						<h2 className="text-2xl font-bold tracking-tight text-slate-900">
							Project Overview
						</h2>
						<p className="text-sm text-slate-500">
							Monitoring student proposals, supervisor assignments, and system
							progress.
						</p>
					</div>
					{dashboardData && (
						<AdminCards noOfProposals={dashboardData?.noOfProposals} />
					)}
				</div>

				<div className="flex flex-row items-center justify-between px-6">
					<div className="space-y-1">
						<h3 className="text-2xl font-bold tracking-tight text-slate-900">
							Projects Progress
						</h3>
						<p className="text-sm text-slate-500">
							Overview of all projects completion status
						</p>
					</div>
					<Button
						className="hover:cursor-pointer bg-cherry-pie-950 hover:bg-cherry-pie-950/80 hover:text-white text-white"
						onClick={() => alert("Downloading...")}
						variant={"outline"}>
						<IconDownload />
						<span>Export</span>
					</Button>
				</div>
				<Card className="mx-6 my-5 shadow-2xs">
					{false ? (
						<h2 className="text-center text-3xl my-5 font-bold">
							Coming Soon!
						</h2>
					) : (
						<ProjectsChart />
					)}
				</Card>
			</div>
		</RootLayout>
	);
}
