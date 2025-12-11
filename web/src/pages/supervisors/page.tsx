import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";

export default function SupervisorsPage() {
	useHeaderInitializer("MIIT| Supervisors", "Supervisors");

	return (
		<RootLayout>
			<h1 className="px-6">Supervisors Page</h1>
		</RootLayout>
	);
}
