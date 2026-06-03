import api from "@/api/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldDescription } from "@/components/ui/field";
import { useAuthStore } from "@/stores/use-auth-store";
import { IconLogout } from "@tabler/icons-react";
import { useNavigate } from "react-router";

export default function AccountLogout() {
	const navigate = useNavigate();
	const logout = useAuthStore((state) => state.logout);

	const handleLogout = async () => {
		try {
			await api.post("/logout");
		} catch (error) {
			console.error(
				"Logout request failed, but clearing local session:",
				error,
			);
		} finally {
			logout();
			navigate("/login", { replace: true });
		}
	};

	return (
		<Card className="py-5">
			<div className="px-5 flex flex-col gap-3 sm:flex-row items-start justify-between">
				<div>
					<h3 className="font-semibold">Account</h3>
					<FieldDescription className="text-sm">
						Sign out of your MIIT account
					</FieldDescription>
				</div>
				<Button
					onClick={handleLogout}
					className="flex hover:cursor-pointer items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 rounded-md transition-colors">
					<IconLogout size={18} />
					<span className="font-medium">Logout</span>
				</Button>
			</div>
		</Card>
	);
}
