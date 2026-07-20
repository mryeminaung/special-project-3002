import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { SupervisorWorkloadData } from "../../types";

const defaultWorkload: SupervisorWorkloadData[] = [
	{ id: 1, name: "Dr. Sandar Min", assigned: 8, maxCapacity: 10, department: "Computer Science" },
	{ id: 2, name: "Dr. Kyaw Swar Lin", assigned: 6, maxCapacity: 10, department: "Software Engineering" },
	{ id: 3, name: "Dr. Nyein Nyein Oo", assigned: 9, maxCapacity: 10, department: "Information Technology" },
	{ id: 4, name: "Dr. Aung Zaw Myo", assigned: 4, maxCapacity: 10, department: "Computer Science" },
	{ id: 5, name: "Dr. Thein Aung", assigned: 7, maxCapacity: 10, department: "Electronics" },
	{ id: 6, name: "Dr. Myint Myint Aye", assigned: 3, maxCapacity: 10, department: "Mathematics" },
];

function getBarColor(percentage: number): string {
	if (percentage >= 90) return "bg-red-500";
	if (percentage >= 70) return "bg-amber-500";
	return "bg-emerald-500";
}

function getTextColor(percentage: number): string {
	if (percentage >= 90) return "text-red-600 dark:text-red-400";
	if (percentage >= 70) return "text-amber-600 dark:text-amber-400";
	return "text-emerald-600 dark:text-emerald-400";
}

export default function SupervisorWorkload({
	workload,
}: {
	workload?: SupervisorWorkloadData[];
}) {
	const data = workload || defaultWorkload;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-semibold text-foreground">
					Supervisor Workload
				</CardTitle>
			</CardHeader>
			<CardContent className="p-0 px-5 pb-5">
				<div className="space-y-4 max-h-72 overflow-y-auto">
					{data.map((supervisor) => {
						const percentage = Math.round(
							(supervisor.assigned / supervisor.maxCapacity) * 100
						);
						return (
							<div key={supervisor.id} className="space-y-1.5">
								<div className="flex items-center justify-between">
									<div className="min-w-0 flex-1">
										<p className="text-sm font-medium text-foreground truncate">
											{supervisor.name}
										</p>
										<p className="text-xs text-muted-foreground">
											{supervisor.department}
										</p>
									</div>
									<span className={`text-xs font-semibold ml-2 ${getTextColor(percentage)}`}>
										{supervisor.assigned}/{supervisor.maxCapacity}
									</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
									<div
										className={`h-full rounded-full transition-all duration-500 ${getBarColor(percentage)}`}
										style={{ width: `${percentage}%` }}
									/>
								</div>
							</div>
						);
					})}
				</div>
			</CardContent>
		</Card>
	);
}
