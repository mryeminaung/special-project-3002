import { IconArrowLeft } from "@tabler/icons-react";
import { Link } from "react-router";

export default function NotFound() {
	return (
		<div className="bg-transparent bg-center bg-cover flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
			<div className="max-w-2xl w-full p-8 md:p-12 rounded-xl bg-transparent backdrop-blur-sm text-center text-neutral-800">
				<div className="space-y-6 flex flex-col items-center justify-center">
					<img src="/404.svg" alt="404" className="w-100 h-100 object-cover" />
					<p className="text-lg text-neutral-600">
						It seems like the page you're looking for does not exist or might
						have been removed.
					</p>
					<Link
						to="/"
						className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-800 text-[13px] hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg">
						<IconArrowLeft />
						Back To Home
					</Link>
				</div>
			</div>
		</div>
	);
}
