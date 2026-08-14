import { cn } from "@/lib/utils";
import { proposalStatusColor } from "@/constants/badge-colors";
import { Badge } from "./ui/badge";

export default function StatusCard({
	label,
	status,
	colorFn,
}: {
	label: string;
	status: string;
	colorFn?: (status: string) => string;
}) {
	return (
		<div className="flex items-center gap-1.5 border p-2 px-3 rounded-xl">
			<p className="font-semibold">{label}</p>
			<Badge
				className={cn(
					(colorFn || proposalStatusColor)(status),
					"font-mono capitalize px-3 rounded-md",
				)}>
				{status}
			</Badge>
		</div>
	);
}
