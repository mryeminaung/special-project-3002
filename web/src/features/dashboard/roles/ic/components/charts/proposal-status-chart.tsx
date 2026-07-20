import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const defaultData = [
	{ name: "Pending", value: 12, color: "#f59e0b" },
	{ name: "Approved", value: 34, color: "#22c55e" },
	{ name: "Rejected", value: 8, color: "#ef4444" },
	{ name: "Under Review", value: 6, color: "#3b82f6" },
];

function CustomTooltip({ active, payload }: any) {
	if (active && payload && payload.length) {
		const data = payload[0];
		return (
			<div className="rounded-lg border bg-white p-3 shadow-md dark:bg-gray-800">
				<p className="font-medium text-foreground">{data.name}</p>
				<p className="text-sm text-muted-foreground">
					{data.value} proposals ({((data.value / defaultData.reduce((s, d) => s + d.value, 0)) * 100).toFixed(1)}%)
				</p>
			</div>
		);
	}
	return null;
}

export default function ProposalStatusChart({
	data,
}: {
	data?: { name: string; value: number; color: string }[];
}) {
	const chartData = data || defaultData;
	const total = chartData.reduce((sum, item) => sum + item.value, 0);

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-semibold text-foreground">
					Proposal Status
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="flex items-center gap-6">
					<div className="h-48 w-48 flex-shrink-0">
						<ResponsiveContainer width="100%" height="100%">
							<PieChart>
								<Pie
									data={chartData}
									cx="50%"
									cy="50%"
									innerRadius={50}
									outerRadius={80}
									paddingAngle={3}
									dataKey="value"
									strokeWidth={0}>
									{chartData.map((entry, index) => (
										<Cell key={`cell-${index}`} fill={entry.color} />
									))}
								</Pie>
								<Tooltip content={<CustomTooltip />} />
							</PieChart>
						</ResponsiveContainer>
					</div>
					<div className="flex flex-col gap-3">
						{chartData.map((item) => (
							<div key={item.name} className="flex items-center gap-2">
								<div
									className="h-3 w-3 rounded-full"
									style={{ backgroundColor: item.color }}
								/>
								<span className="text-sm text-muted-foreground">
									{item.name}
								</span>
								<span className="ml-auto text-sm font-semibold text-foreground">
									{item.value}
								</span>
								<span className="text-xs text-muted-foreground">
									({((item.value / total) * 100).toFixed(0)}%)
								</span>
							</div>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
