import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { StudentAffairCard } from "./components/student-affair-card";

export default function StudentAffairsDashboard() {
	useHeaderInitializer("MIIT | Student Affairs Dashboard", "Dashboard");

	return (
		<>
			<div className="max-w-7xl mx-auto">
				<StudentAffairCard />
			</div>
		</>
	);
}
