import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import RootLayout from "@/layouts/RootLayout";
import { StudentCards } from "./components/student-card";

export default function StudentDashboard() {
	useHeaderInitializer("MIIT| Student Dashboard", "Dashboard");

	return (
		<RootLayout>
			<StudentCards />
		</RootLayout>
	);
}
