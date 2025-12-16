import { useAuthStore } from "@/stores/useAuthStore";
import { Navigate, Outlet, useLocation } from "react-router";

export default function ProtectedRoute() {
	const authToken = useAuthStore((state) => state.authToken);

	const location = useLocation();

	if (!authToken)
		return (
			<Navigate
				to="/login"
				replace
				state={{ from: location }}
			/>
		);

	if (location.pathname === "/" && authToken)
		return (
			<Navigate
				to="/dashboard"
				replace
			/>
		);

	return <Outlet />;
}
