import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { PAGE_META } from "@/constants/navigation";
import SettingsLayout from "@/layouts/settings-layout";
import { Outlet } from "react-router";

export default function SettingsPage() {
	useHeaderInitializer(PAGE_META.settings.title, PAGE_META.settings.subtitle);

	return (
		<SettingsLayout>
			<Outlet />
		</SettingsLayout>
	);
}
