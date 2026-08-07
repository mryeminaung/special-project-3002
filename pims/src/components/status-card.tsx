import { cn, PROPOSAL_STATUS_COLOR } from "@/lib/utils";
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
					(colorFn || PROPOSAL_STATUS_COLOR)(status),
					"font-mono capitalize px-3 rounded-md",
				)}>
				{status}
			</Badge>
		</div>
	);
}
