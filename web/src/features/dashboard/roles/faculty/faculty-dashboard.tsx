import api from "@/api/api";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import { FacultyCards } from "./components/faculty-card";

export default function FacultyDashboard() {
	useHeaderInitializer("MIIT | Supervisor Dashboard", "Dashboard");
	const fetchFacultyDashboardData = async () => {
		const res = await api.get("/dashboard");
		return res.data;
	};

	const { data: facultyDashboardData } = useQuery({
		queryKey: ["FacultyDashboardData"],
		queryFn: fetchFacultyDashboardData,
	});

	return (
		<PageWrapper>
			<div className="mb-5 space-y-3">
				<Heading
					title="Supervisor Dashboard"
					description="Monitor project health, review student submissions, and manage your mentorship workload."
				/>
				{facultyDashboardData && <FacultyCards data={facultyDashboardData} />}
			</div>
		</PageWrapper>
	);
}
