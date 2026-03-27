import { useAuthStore } from "@/stores/use-auth-store";
import type React from "react";
import { Navigate } from "react-router";

export default function GuestLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const token = useAuthStore((state) => state.token);

	return (
		<>
			{!token ? (
				<div className="bg-[url(/main-bg.jpg)] min-h-svh bg-center bg-cover">
					{children}
				</div>
			) : (
				<Navigate to={"/dashboard"} />
			)}
		</>
	);
}
