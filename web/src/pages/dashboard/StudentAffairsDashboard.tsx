import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";

export default function StudentAffairsDashboard() {
	useHeaderInitializer("MIIT| Student Affairs Dashboard", "Dashboard");

	return (
		<RootLayout>
			<div className="px-6">
				StudentAffairsDashboard
				<br />
			</div>
		</RootLayout>
	);
}
