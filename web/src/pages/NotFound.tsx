import { Link } from "react-router";

export default function NotFound() {
	return (
		<div className="bg-transparent bg-center bg-cover flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
			<div className="max-w-[580px] w-full p-8 md:p-12 rounded-xl bg-transparent backdrop-blur-sm text-center text-neutral-800">
				<div className="space-y-6">
					<h1 className="text-8xl md:text-9xl font-semibold leading-none tracking-tight">
						404
					</h1>
					<h2 className="text-3xl font-bold">Oops! Page Not Found!</h2>
					<p className="text-lg text-neutral-600">
						It seems like the page you're looking for does not exist or might
						have been removed.
					</p>
					<Link
						to="/"
						className="inline-block px-8 py-2.5 bg-primary-900 text-[13px] hover:bg-primary-800 text-white font-semibold rounded-lg shadow-lg">
						Back To Home
					</Link>
				</div>
			</div>
		</div>
	);
}
