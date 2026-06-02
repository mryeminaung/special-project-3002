import { useRoleChecker } from "@/hooks/use-role-checker";
import AdminDashboard from "./admin/admin-dashboard";
import FacultyDashboard from "./faculty/faculty-dashboard";
import ICDashboard from "./ic/ic-dashboard";
import StudentDashboard from "./student/student-dashboard";

export default function DashboardPage() {
	const { isIC, isAdmin, isFaculty, isStudent } = useRoleChecker();
	if (isIC) return <ICDashboard />;
	else if (isAdmin) return <AdminDashboard />;
	else if (isFaculty) return <FacultyDashboard />;
	else if (isStudent) return <StudentDashboard />;
}
