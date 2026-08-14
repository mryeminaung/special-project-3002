import type { ReactNode } from "react";

interface GradientWrapperProps {
	children: ReactNode;
	className?: string;
}

export default function GradientWrapper({ children, className = "" }: GradientWrapperProps) {
	return (
		<div className={`relative rounded-3xl p-[2px] bg-gradient-to-br from-primary-400 via-primary-600 to-primary-800 ${className}`}>
			{children}
		</div>
	);
}
