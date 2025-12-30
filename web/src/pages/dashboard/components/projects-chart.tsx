import {
	ChartContainer,
	ChartTooltip,
	ChartTooltipContent,
} from "@/components/ui/chart";
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

export default function ProjectsChart() {
	return (
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
					{chartData.map((index) => (
						<Cell
							key={`cell-${index}`}
							fill={"#eeeff"}
						/>
					))}
				</Bar>
			</BarChart>
		</ChartContainer>
	);
}
