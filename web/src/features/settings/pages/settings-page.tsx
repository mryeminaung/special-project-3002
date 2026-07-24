import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import SettingsLayout from "@/layouts/settings-layout";
import { Outlet } from "react-router";

export default function SettingsPage() {
	useHeaderInitializer("MIIT | Settings", "Settings");

	return (
		<SettingsLayout>
			<Outlet />
		</SettingsLayout>
	);
}
