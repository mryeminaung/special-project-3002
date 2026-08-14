import { Badge } from "@/components/ui/badge";

export default function StudentsByBatch({
	data,
}: {
	data: { batch: string; total: number }[];
}) {
	if (!data?.length) return null;

	const max = Math.max(...data.map((d) => d.total));

	return (
		<div className="rounded-xl border bg-card p-5">
			<h3 className="text-sm font-semibold mb-4">Students by Batch</h3>
			<div className="space-y-2.5">
				{data.map((item) => (
					<div key={item.batch} className="flex items-center gap-3">
						<span className="text-sm font-medium w-12 shrink-0">{item.batch}</span>
						<div className="flex-1 h-7 rounded-md bg-muted overflow-hidden">
							<div
								className="h-full rounded-md bg-primary-600/80 flex items-center justify-end pr-2 transition-all duration-500"
								style={{ width: `${max > 0 ? (item.total / max) * 100 : 0}%` }}
							>
								{item.total > 0 && (
									<span className="text-[11px] font-semibold text-white">{item.total}</span>
								)}
							</div>
						</div>
						<Badge variant="outline" className="text-xs font-mono w-10 justify-center">
							{item.total}
						</Badge>
					</div>
				))}
			</div>
		</div>
	);
}
