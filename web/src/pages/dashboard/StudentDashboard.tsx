import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";

export default function StudentDashboard() {
	useHeaderInitializer("MIIT| Student Dashboard", "Dashboard");

	return <RootLayout>StudentDashboard</RootLayout>;
}
