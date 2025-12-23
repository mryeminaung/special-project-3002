import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { SectionCards } from "@/pages/dashboard/components/section-cards";
import { IconDownload } from "@tabler/icons-react";
import { useEffect } from "react";

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

export default function AdminDashboard() {
	useHeaderInitializer("MIIT| IC Dashboard", "Dashboard");

	useEffect(() => {});

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
						className="hover:cursor-pointer bg-cherry-pie-950 hover:bg-cherry-pie-950/80 hover:text-white text-white"
						onClick={() => alert("Downloading...")}
						variant={"outline"}>
						<IconDownload />
						<span>Export</span>
					</Button>
				</div>
				<h2 className="text-center text-3xl my-5 font-bold">Coming Soon!</h2>
				{/* <ChartContainer
					config={chartConfig}
					className="h-[350px] hidden w-full">
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
							{chartData.map((index) => (
								<Cell
									key={`cell-${index}`}
									fill={"#eeeff"}
								/>
							))}
						</Bar>
					</BarChart>
				</ChartContainer> */}
			</Card>
		</RootLayout>
	);
}
