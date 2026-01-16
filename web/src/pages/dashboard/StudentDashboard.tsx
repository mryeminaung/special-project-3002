import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { StudentCards } from "./components/student-card";

export default function StudentDashboard() {
	useHeaderInitializer("MIIT | Student Dashboard", "Dashboard");

	return (
		<div className="max-w-7xl mx-auto">
			<StudentCards />
		</div>
	);
}
