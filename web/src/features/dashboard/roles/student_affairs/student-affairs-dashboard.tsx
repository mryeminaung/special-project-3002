import PageWrapper from "@/components/common/page-wrapper";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { StudentAffairCard } from "./components/student-affair-card";

export default function StudentAffairsDashboard() {
	useHeaderInitializer("MIIT | Student Affairs Dashboard", "Dashboard");

	return (
		<PageWrapper>
			<StudentAffairCard />
		</PageWrapper>
	);
}
