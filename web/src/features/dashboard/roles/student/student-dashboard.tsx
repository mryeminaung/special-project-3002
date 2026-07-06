import api from "@/api/api";
import PageWrapper from "@/components/common/page-wrapper";
import Heading from "@/components/heading";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useQuery } from "@tanstack/react-query";
import { StudentCards } from "./components/student-card";

export default function StudentDashboard() {
	useHeaderInitializer("MIIT | Student Dashboard", "Dashboard");

	const fetchStudentDashboardData = async () => {
		const res = await api.get("/dashboard");
		return res.data;
	};

	const { data: studentDashboardData } = useQuery({
		queryKey: ["studentDashboardData"],
		queryFn: fetchStudentDashboardData,
	});

	return (
		<PageWrapper>
			<div className="mb-5 space-y-3">
				<Heading
					title="Student Dashboard"
					description="Welcome to your dashboard. Here you can view your projects, proposals, and upcoming tasks."
				/>
				{studentDashboardData && <StudentCards data={studentDashboardData} />}
			</div>
		</PageWrapper>
	);
}
