import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";

export default function ProjectsPage() {
	useHeaderInitializer("MIIT| Projects", "Projects");

	return (
		<RootLayout>
			<h1 className="px-6">Projects Page</h1>
		</RootLayout>
	);
}
