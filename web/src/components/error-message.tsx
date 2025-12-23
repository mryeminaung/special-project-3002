import { cn } from "@/lib/utils";
import { AlertCircle } from "lucide-react";

export default function ErrorMessage({
	error,
	className,
}: {
	error?: string;
	className?: string;
}) {
	return (
		<div
			className={cn("flex items-center gap-2 text-sm text-red-600", className)}>
			<AlertCircle className="h-4 w-4" />
			{error}
		</div>
	);
}
