import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";

export default function SupervisorDashboard() {
	useHeaderInitializer("MIIT| Supervisor Dashboard", "Dashboard");

	return <RootLayout>SupervisorDashboard</RootLayout>;
}
