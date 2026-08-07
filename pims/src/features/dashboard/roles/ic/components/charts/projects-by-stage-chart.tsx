import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";

const defaultData = [
	{ stage: "Proposal", count: 8, color: "#a78bfa" },
	{ stage: "Proposal Review", count: 5, color: "#f59e0b" },
	{ stage: "Development", count: 18, color: "#3b82f6" },
	{ stage: "Testing", count: 9, color: "#f97316" },
	{ stage: "Completed", count: 22, color: "#22c55e" },
];

function CustomTooltip({ active, payload }: any) {
	if (active && payload && payload.length) {
		const data = payload[0].payload;
		return (
			<div className="rounded-lg border bg-white p-3 shadow-md dark:bg-gray-800">
				<p className="font-medium text-foreground">{data.stage}</p>
				<p className="text-sm text-muted-foreground">
					{data.count} projects
				</p>
			</div>
		);
	}
	return null;
}

export default function ProjectsByStageChart({
	data,
}: {
	data?: { stage: string; count: number; color: string }[];
}) {
	const chartData = data || defaultData;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-semibold text-foreground">
					Projects by Stage
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-52">
					<ResponsiveContainer width="100%" height="100%">
						<BarChart
							data={chartData}
							layout="vertical"
							margin={{ top: 0, right: 10, left: 0, bottom: 0 }}>
							<XAxis type="number" hide />
							<YAxis
								type="category"
								dataKey="stage"
								width={110}
								tick={{ fontSize: 12, fill: "#888" }}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(0,0,0,0.04)" }} />
							<Bar
								dataKey="count"
								radius={[0, 6, 6, 0]}
								barSize={20}>
								{chartData.map((entry, index) => (
									<Cell key={`cell-${index}`} fill={entry.color} />
								))}
							</Bar>
						</BarChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
