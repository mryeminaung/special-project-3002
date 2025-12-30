export default function GradientWrapper({ children }: any) {
	return (
		<div className="bg-linear-to-b from-primary-800 via-white/10 to-white/5 p-1 rounded-[26px]">
			{children}
		</div>
	);
}
