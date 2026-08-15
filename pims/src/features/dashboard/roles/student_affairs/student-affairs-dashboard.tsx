import { PAGE_META } from "@/constants/navigation";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { StudentAffairCard } from "./components/student-affair-card";

export default function StudentAffairsDashboard() {
	useHeaderInitializer(PAGE_META.studentAffairsDashboard.title, PAGE_META.studentAffairsDashboard.subtitle);

	return (
		<StudentAffairCard />
	);
}
