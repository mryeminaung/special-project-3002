const TestGradientBorder = () => {
	return (
		<div className="min-h-screen bg-white flex items-center justify-center p-4">
			<div className="relative p-1 rounded-xl shadow bg-linear-to-b from-blue-500 via-white/50 to-white/10 w-full max-w-md">
				<div className="bg-white rounded-lg shadow-inner w-full h-full p-8">
					<h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
						Login
					</h1>

					<form>
						<div className="mb-4">
							<label
								htmlFor="email"
								className="block text-gray-700 text-sm font-medium mb-2">
								Email Address
							</label>
							<input
								type="email"
								id="email"
								name="email"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
								placeholder="Enter your email"
								required
							/>
						</div>

						<div className="mb-6">
							<label
								htmlFor="password"
								className="block text-gray-700 text-sm font-medium mb-2">
								Password
							</label>
							<input
								type="password"
								id="password"
								name="password"
								className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
								placeholder="Enter your password"
								required
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-200">
							Sign In
						</button>
					</form>

					<div className="mt-6 text-center">
						<p className="text-sm text-gray-600">
							Don't have an account?{" "}
							<a
								href="#"
								className="text-blue-600 hover:text-blue-800 font-medium">
								Sign up
							</a>
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default TestGradientBorder;
