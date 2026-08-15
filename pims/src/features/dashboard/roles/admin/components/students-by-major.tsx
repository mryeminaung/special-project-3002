import { Badge } from "@/components/ui/badge";

const BAR_COLORS = [
	"bg-blue-500",
	"bg-amber-500",
	"bg-emerald-500",
	"bg-violet-500",
	"bg-rose-500",
	"bg-teal-500",
];

export default function StudentsByMajor({
	data,
}: {
	data: { major: string; total: number }[];
}) {
	if (!data?.length) return null;

	const max = Math.max(...data.map((d) => d.total));

	return (
		<div className="rounded-xl border bg-card p-5">
			<h3 className="text-sm font-semibold mb-4">Students by Major</h3>
			<div className="space-y-3">
				{data.map((item, i) => (
					<div key={item.major} className="space-y-1.5">
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium">{item.major}</span>
							<Badge variant="outline" className="text-xs font-mono">
								{item.total}
							</Badge>
						</div>
						<div className="h-2 rounded-full bg-muted overflow-hidden">
							<div
								className={`h-full rounded-full ${BAR_COLORS[i % BAR_COLORS.length]} transition-all duration-500`}
								style={{ width: `${max > 0 ? (item.total / max) * 100 : 0}%` }}
							/>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}
