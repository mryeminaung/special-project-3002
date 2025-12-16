export default function GradientWrapper({ children }: any) {
	return (
		<div className="bg-linear-to-b from-cherry-pie-900 via-white/10 to-white/5 p-1 rounded-2xl">
			{children}
		</div>
	);
}
