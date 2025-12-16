import { Link } from "react-router";

export default function NotFound() {
	return (
		<div className="bg-[url(/main-bg.jpg)] bg-center bg-cover flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
			<div className="max-w-[580px] w-full p-8 md:p-12 rounded-xl bg-white/80 shadow-lg backdrop-blur-sm text-center text-gray-800">
				<div className="space-y-6">
					<h1 className="text-8xl md:text-9xl font-extrabold text-cherry-pie-900 leading-none tracking-tight">
						404
					</h1>
					<h2 className="text-3xl font-bold">Page Not Found</h2>
					<p className="text-lg text-gray-600">
						We apologize, but the page you were looking for doesn't exist. It
						might have been moved or deleted.
					</p>
					<Link
						to="/"
						className="inline-block px-8 py-3 bg-cherry-pie-900 hover:bg-cherry-pie-800 text-white font-semibold rounded-lg shadow-lg ">
						Go to Homepage
					</Link>
				</div>
			</div>
		</div>
	);
}
