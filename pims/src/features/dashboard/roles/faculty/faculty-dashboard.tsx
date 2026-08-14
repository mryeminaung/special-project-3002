import { getDashboardData } from "../../services/dashboard.service";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import { FacultyCards } from "./components/faculty-card";

export default function FacultyDashboard() {
	useHeaderInitializer(PAGE_META.facultyDashboard.title, PAGE_META.facultyDashboard.subtitle);
	const { data: facultyDashboardData } = useQuery({
		queryKey: ["FacultyDashboardData"],
		queryFn: getDashboardData,
	});

	return (
		<div className="mb-5 space-y-3">
			<Heading
				title={HEADINGS.facultyDashboard.title}
				description={HEADINGS.facultyDashboard.description}
			/>
			{facultyDashboardData && <FacultyCards data={facultyDashboardData} />}
		</div>
	);
}
