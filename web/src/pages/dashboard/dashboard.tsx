import { HasRole } from "@/lib/utils";
import AdminDashboard from "./admin/admin-dashboard";
import StudentDashboard from "./student/student-dashboard";
import StudentAffairsDashboard from "./student_affairs/student-affairs-dashboard";
import SupervisorDashboard from "./faculty/supervisor-dashboard";

export default function DashboardPage() {
	if (HasRole("IC")) return <AdminDashboard />;
	else if (HasRole("Faculty")) return <SupervisorDashboard />;
	else if (HasRole("Student")) return <StudentDashboard />;
	else if (HasRole("Student Affairs")) return <StudentAffairsDashboard />;
}
