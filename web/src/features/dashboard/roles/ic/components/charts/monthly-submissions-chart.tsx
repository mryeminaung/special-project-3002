import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AreaChart,
	Area,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	CartesianGrid,
} from "recharts";

const defaultData = [
	{ month: "Jan", count: 4 },
	{ month: "Feb", count: 7 },
	{ month: "Mar", count: 5 },
	{ month: "Apr", count: 12 },
	{ month: "May", count: 9 },
	{ month: "Jun", count: 15 },
	{ month: "Jul", count: 11 },
	{ month: "Aug", count: 8 },
	{ month: "Sep", count: 14 },
	{ month: "Oct", count: 10 },
	{ month: "Nov", count: 6 },
	{ month: "Dec", count: 3 },
];

function CustomTooltip({ active, payload, label }: any) {
	if (active && payload && payload.length) {
		return (
			<div className="rounded-lg border bg-white p-3 shadow-md dark:bg-gray-800">
				<p className="font-medium text-foreground">{label}</p>
				<p className="text-sm text-muted-foreground">
					{payload[0].value} submissions
				</p>
			</div>
		);
	}
	return null;
}

export default function MonthlySubmissionsChart({
	data,
}: {
	data?: { month: string; count: number }[];
}) {
	const chartData = data || defaultData;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-semibold text-foreground">
					Monthly Proposal Submissions
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="h-52">
					<ResponsiveContainer width="100%" height="100%">
						<AreaChart
							data={chartData}
							margin={{ top: 5, right: 10, left: -10, bottom: 0 }}>
							<defs>
								<linearGradient id="submissionGradient" x1="0" y1="0" x2="0" y2="1">
									<stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
									<stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
								</linearGradient>
							</defs>
							<CartesianGrid
								strokeDasharray="3 3"
								vertical={false}
								stroke="#f0f0f0"
							/>
							<XAxis
								dataKey="month"
								tick={{ fontSize: 12, fill: "#888" }}
								axisLine={false}
								tickLine={false}
							/>
							<YAxis
								tick={{ fontSize: 12, fill: "#888" }}
								axisLine={false}
								tickLine={false}
							/>
							<Tooltip content={<CustomTooltip />} />
							<Area
								type="monotone"
								dataKey="count"
								stroke="#3b82f6"
								strokeWidth={2}
								fill="url(#submissionGradient)"
							/>
						</AreaChart>
					</ResponsiveContainer>
				</div>
			</CardContent>
		</Card>
	);
}
