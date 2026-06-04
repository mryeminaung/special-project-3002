import { useRoleChecker } from "@/hooks/use-role-checker";
import AdminDashboard from "../roles/admin/admin-dashboard";
import FacultyDashboard from "../roles/faculty/faculty-dashboard";
import ICDashboard from "../roles/ic/ic-dashboard";
import StudentDashboard from "../roles/student/student-dashboard";

export default function DashboardPage() {
	const { isIC, isAdmin, isFaculty, isStudent } = useRoleChecker();

	if (isAdmin) return <AdminDashboard />;
	else if (isIC) return <ICDashboard />;
	else if (isFaculty) return <FacultyDashboard />;
	else if (isStudent) return <StudentDashboard />;
}
