import type { ICDashboardData } from "../types";
import ProposalStatusChart from "./charts/proposal-status-chart";
import MonthlySubmissionsChart from "./charts/monthly-submissions-chart";

export default function ChartsSection({
	data,
}: {
	data?: ICDashboardData;
}) {
	return (
		<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<ProposalStatusChart data={data?.proposalStatus} />
			<MonthlySubmissionsChart data={data?.monthlySubmissions} />
		</div>
	);
}
