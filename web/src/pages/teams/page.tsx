import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";

export default function TeamsPage() {
	useHeaderInitializer("MIIT| Teams", "Teams");

	return (
		<RootLayout>
			<h1 className="px-6">Teams Page</h1>
		</RootLayout>
	);
}
