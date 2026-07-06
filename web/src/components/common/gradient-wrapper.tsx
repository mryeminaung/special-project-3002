import type React from "react";

export default function GradientWrapper({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="relative p-1 rounded-[26px] overflow-hidden">
			{/* Smooth Rotating Gradient Layer */}
			<div className="absolute inset-0 animate-rotate-slow bg-[linear-gradient(var(--angle),_var(--tw-gradient-from),_transparent,_var(--tw-gradient-to))] from-primary-700 to-primary-800" />

			{/* The Content Layer */}
			<div className="relative z-10 bg-white p-0.2 rounded-[22px]">
				{children}
			</div>

			<style jsx>{`
				/* This registration is the secret sauce for smooth angle animation */
				@property --angle {
					syntax: "<angle>";
					initial-value: 135deg;
					inherits: false;
				}

				@keyframes rotate-gradient {
					from {
						--angle: 0deg;
					}
					to {
						--angle: 360deg;
					}
				}

				.animate-rotate-slow {
					animation: rotate-gradient 4s linear infinite;
				}
			`}</style>
		</div>
	);
}
