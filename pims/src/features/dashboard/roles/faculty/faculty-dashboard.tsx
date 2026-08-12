import api from "@/api/api";
import { PAGE_META, HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import { FacultyCards } from "./components/faculty-card";

export default function FacultyDashboard() {
	useHeaderInitializer(PAGE_META.facultyDashboard.title, PAGE_META.facultyDashboard.subtitle);
	const fetchFacultyDashboardData = async () => {
		const res = await api.get("/dashboard");
		return res.data;
	};

	const { data: facultyDashboardData } = useQuery({
		queryKey: ["FacultyDashboardData"],
		queryFn: fetchFacultyDashboardData,
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
