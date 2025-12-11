import api from "@/api/api";
import { SectionCards } from "@/components/section-cards";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { IconDownload } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import { Bar, BarChart, CartesianGrid, Cell, XAxis, YAxis } from "recharts";

type ProjectProgressData = {
	project: string;
	progress: number;
};

const getTitle = (name: string) =>
	name.slice(0, 20) + (name.length > 20 ? "..." : "");

const chartData: ProjectProgressData[] = [
	{ project: getTitle("LMS System"), progress: 84 },
	{ project: getTitle("Mobile App"), progress: 58 },
	{ project: getTitle("Image Processing"), progress: 33 },
	{ project: getTitle("Web Development"), progress: 49 },
	{ project: getTitle("Alpha Launch"), progress: 40 },
	{ project: getTitle("Beta Refactor"), progress: 68 },
	{ project: getTitle("Marketing Site"), progress: 75 },
	{ project: getTitle("API Migration"), progress: 76 },
	{ project: getTitle("Database Cleanup"), progress: 86 },
	{ project: getTitle("Alpha Launch"), progress: 40 },
];

const chartConfig = {
	progress: {
		label: "Progress Rate",
		color: "hsl(var(--chart-1))",
	},
} satisfies ChartConfig;

export default function DashboardPage() {
	useHeaderInitializer("MIIT| Dashboard", "Dashboard");
	const [users, setUsers] = useState();

	const fetchUsers = async () => {
		const res = await api.get("/users");
		console.log(res);
		setUsers(res.data);
	};

	useEffect(() => {
		// fetchUsers();
	}, []);

	const getBarColor = (progress: number): string => {
		if (progress < 50) return "#ef4444";
		if (progress >= 50 && progress < 75) return "#f59e0b";
		if (progress >= 75) return "#00ff00";
		return "#000000";
	};

	return (
		<RootLayout>
			<SectionCards />
			<Card className="mx-6 my-5 shadow-2xs">
				<div className="flex flex-row items-center justify-between px-6">
					<div className="space-y-1">
						<h3 className="text-[15px] font-semibold">Projects Progress</h3>
						<p className="text-sm text-muted-foreground">
							Overview of all projects completion status
						</p>
					</div>
					<Button
						className="hover:cursor-pointer"
						onClick={() => alert("Downloading...")}
						variant={"outline"}>
						<IconDownload />
						<span>Export</span>
					</Button>
				</div>
				<ChartContainer
					config={chartConfig}
					className="h-[350px] w-full">
					<BarChart
						accessibilityLayer
						data={chartData}
						margin={{
							top: 10,
							right: 12,
							left: 12,
							bottom: 80,
						}}>
						<CartesianGrid vertical={true} />
						<XAxis
							dataKey="project"
							tickLine={true}
							tickMargin={10}
							axisLine={false}
							angle={-45}
							textAnchor="end"
						/>
						<YAxis
							className="font-mono"
							label={{
								value: "Progress %",
								angle: -90,
								position: "insideLeft",
							}}
							domain={[0, 100]}
							tickFormatter={(value) => `${value}%`}
							tickLine={true}
							axisLine={false}
							tickMargin={8}
						/>
						<ChartTooltip
							content={<ChartTooltipContent />}
							formatter={(value) => `${value}%`}
						/>
						<Bar
							dataKey="progress"
							radius={10}>
							{chartData.map((entry, index) => (
								<Cell
									key={`cell-${index}`}
									fill={"#eeeff"}
								/>
							))}
						</Bar>
					</BarChart>
				</ChartContainer>
			</Card>
			<SectionCards />
		</RootLayout>
	);
}
