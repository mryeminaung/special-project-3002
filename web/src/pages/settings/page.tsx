import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";

export default function SettingsPage() {
	useHeaderInitializer("MIIT| Settings", "Settings");

	return (
		<RootLayout>
			<h1 className="px-6">Settings Page</h1>
		</RootLayout>
	);
}
