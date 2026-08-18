import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Cell,
} from "recharts";
import type { SupervisorWorkloadData } from "../../types";

const defaultWorkload: SupervisorWorkloadData[] = [
	{ id: 1, name: "Dr. Sandar Min", assigned: 8, maxCapacity: 10, department: "Computer Science" },
	{ id: 2, name: "Dr. Kyaw Swar Lin", assigned: 6, maxCapacity: 10, department: "Software Engineering" },
	{ id: 3, name: "Dr. Nyein Nyein Oo", assigned: 9, maxCapacity: 10, department: "Information Technology" },
	{ id: 4, name: "Dr. Aung Zaw Myo", assigned: 4, maxCapacity: 10, department: "Computer Science" },
	{ id: 5, name: "Dr. Thein Aung", assigned: 7, maxCapacity: 10, department: "Electronics" },
	{ id: 6, name: "Dr. Myint Myint Aye", assigned: 3, maxCapacity: 10, department: "Mathematics" },
];

function getBarColor(assigned: number, max: number): string {
	const pct = assigned / max;
	if (pct >= 0.9) return "#ef4444";
	if (pct >= 0.7) return "#f59e0b";
	return "#10b981";
}

function shortName(name: string): string {
	const withoutTitle = name.replace(/^(Dr\.|Prof\.|Mr\.|Ms\.)\s*/i, "");
	return withoutTitle.length > 11 ? withoutTitle.slice(0, 10) + "…" : withoutTitle;
}

interface TooltipPayload {
	name: string;
	assigned: number;
	maxCapacity: number;
	department: string;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: { payload: TooltipPayload }[] }) {
	if (!active || !payload?.length) return null;
	const d = payload[0].payload;
	return (
		<div className="rounded-lg border bg-popover px-3 py-2 shadow-md text-xs">
			<p className="font-semibold text-foreground mb-1">{d.name}</p>
			<p className="text-muted-foreground">{d.department}</p>
			<p className="mt-1 font-medium text-foreground">
				{d.assigned} / {d.maxCapacity} projects
			</p>
		</div>
	);
}

export default function SupervisorWorkload({
	workload,
}: {
	workload?: SupervisorWorkloadData[];
}) {
	const raw = (workload || defaultWorkload).slice(0, 10);

	const data = raw.map((s) => ({
		...s,
		shortName: shortName(s.name),
	}));

	const maxCapacity = data[0]?.maxCapacity ?? 10;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-2">
				<CardTitle className="text-sm font-semibold text-foreground">
					Supervisor Workload
				</CardTitle>
				<p className="text-xs text-muted-foreground">Top 10 by active projects</p>
			</CardHeader>
			<CardContent className="px-4 pb-4">
				<ResponsiveContainer width="100%" height={280}>
					<BarChart data={data} margin={{ top: 8, right: 8, bottom: 48, left: 0 }}>
						<CartesianGrid vertical={false} strokeDasharray="3 3" stroke="var(--border)" />
						<XAxis
							dataKey="shortName"
							tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
							tickLine={false}
							axisLine={false}
							interval={0}
							angle={-35}
							textAnchor="end"
						/>
						<YAxis
							domain={[0, maxCapacity]}
							tickCount={maxCapacity + 1}
							tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
							tickLine={false}
							axisLine={false}
							width={24}
						/>
						<Tooltip content={<CustomTooltip />} cursor={{ fill: "var(--muted)", opacity: 0.4 }} />
						<Bar dataKey="assigned" radius={[4, 4, 0, 0]} maxBarSize={48}>
							{data.map((entry) => (
								<Cell
									key={entry.id}
									fill={getBarColor(entry.assigned, entry.maxCapacity)}
								/>
							))}
						</Bar>
					</BarChart>
				</ResponsiveContainer>

				{/* Legend */}
				<div className="flex items-center gap-4 mt-1 justify-center">
					{[
						{ color: "bg-emerald-500", label: "< 70%" },
						{ color: "bg-amber-400", label: "70–89%" },
						{ color: "bg-red-500", label: "≥ 90%" },
					].map(({ color, label }) => (
						<div key={label} className="flex items-center gap-1.5">
							<span className={`h-2 w-3 rounded-sm ${color}`} />
							<span className="text-[10px] text-muted-foreground">{label}</span>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
