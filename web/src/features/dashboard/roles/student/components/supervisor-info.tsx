import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { IconMail, IconPhone, IconBuildingCommunity } from "@tabler/icons-react";
import { GraduationCap } from "lucide-react";
import type { StudentDashboardData } from "../services/student-dashboard.service";

export default function SupervisorInfo({
	supervisor,
}: {
	supervisor?: StudentDashboardData["supervisor"];
}) {
	if (!supervisor) return null;

	return (
		<Card className="rounded-xl border-0 shadow-sm">
			<CardHeader className="pb-3">
				<CardTitle className="text-sm font-semibold text-foreground">
					My Supervisor
				</CardTitle>
			</CardHeader>
			<CardContent className="p-5 pt-0">
				<div className="flex items-center gap-4 mb-4">
					<div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-100 text-primary-700 dark:bg-primary-950 dark:text-primary-400">
						<GraduationCap size={24} />
					</div>
					<div>
						<p className="font-semibold text-foreground">{supervisor.name}</p>
						<p className="text-xs text-muted-foreground">{supervisor.department}</p>
					</div>
				</div>
				<div className="space-y-2 text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<IconMail size={15} />
						<span>{supervisor.email}</span>
					</div>
					{supervisor.phone && (
						<div className="flex items-center gap-2 text-muted-foreground">
							<IconPhone size={15} />
							<span>{supervisor.phone}</span>
						</div>
					)}
					<div className="flex items-center gap-2 text-muted-foreground">
						<IconBuildingCommunity size={15} />
						<span>{supervisor.department}</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
