import { cn } from "@/lib/utils";

export default function PageWrapper({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<section className={cn("mx-auto max-w-7xl", className)}>{children}</section>
	);
}
