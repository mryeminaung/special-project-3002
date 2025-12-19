import { Link } from "react-router";

export default function UnAuthorized() {
	return (
		<div className="bg-transparent bg-center bg-cover flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
			<div className="max-w-[580px] w-full p-8 md:p-12 rounded-xl bg-transparent backdrop-blur-sm text-center text-gray-800">
				<div className="space-y-6">
					<h1 className="text-8xl md:text-9xl font-semibold leading-none tracking-tight">
						403
					</h1>
					<h2 className="text-3xl font-bold">Access Denied!</h2>
					<p className="text-lg text-gray-600">
						You don't have permission to view this page. If you believe this is
						an error, please contact your administrator.
					</p>
					<Link
						to="/"
						className="inline-block px-8 py-2.5 bg-cherry-pie-900 text-[13px] hover:bg-cherry-pie-800 text-white font-semibold rounded-lg shadow-lg">
						Back To Home
					</Link>
				</div>
			</div>
		</div>
	);
}
