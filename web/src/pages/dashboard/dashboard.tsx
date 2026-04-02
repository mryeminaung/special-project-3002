import { HasRole } from "@/lib/utils";
import AdminDashboard from "./admin/admin-dashboard";
import FacultyDashboard from "./faculty/faculty-dashboard";
import ICDashboard from "./ic/ic-dashboard";
import StudentDashboard from "./student/student-dashboard";
import StudentAffairsDashboard from "./student_affairs/student-affairs-dashboard";

export default function DashboardPage() {
	if (HasRole("IC")) return <ICDashboard />;
	else if (HasRole("Admin")) return <AdminDashboard />;
	else if (HasRole("Faculty")) return <FacultyDashboard />;
	else if (HasRole("Student")) return <StudentDashboard />;
	else if (HasRole("Student Affairs")) return <StudentAffairsDashboard />;
}
