export default function Loading({ message }: { message: string }) {
	return (
		<div className="flex flex-col items-center justify-start bg-background">
			<img
				src="/loading.svg"
				alt="Loading illustration"
				className="w-64 h-64 mt-12 md:w-80 md:h-80 object-contain max-w-full animate-pulse"
			/>
			<div className="-mt-8 text-base md:text-md text-neutral-600 dark:text-neutral-400 text-center a">
				Loading {message}...
			</div>
		</div>
	);
}
