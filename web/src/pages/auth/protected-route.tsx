import AuthLayout from "@/layouts/auth-layout";
import { useAuthStore } from "@/stores/use-auth-store";
import { Navigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
	const token = useAuthStore((state) => state.token);

	const location = useLocation();

	if (!token)
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: location }}
			/>
		);

	if (location.pathname === "/" && token)
		return (
			<Navigate
				to="/dashboard"
				replace
			/>
		);

	return (
		<AuthLayout>
			<Outlet />
		</AuthLayout>
	);
}
