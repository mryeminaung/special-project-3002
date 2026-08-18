import { useRoleChecker } from "@/hooks/use-role-checker";
import AdminDashboard from "../roles/admin/admin-dashboard";
import FacultyDashboard from "../roles/faculty/faculty-dashboard";
import ICDashboard from "../roles/ic/ic-dashboard";
import StudentDashboard from "../roles/student/student-dashboard";
import StudentAffairsDashboard from "../roles/student_affairs/student-affairs-dashboard";

export default function DashboardPage() {
	const { isIC, isAdmin, isFaculty, isStudent, isStudentAffairs } = useRoleChecker();

	if (isAdmin) return <AdminDashboard />;
	else if (isIC) return <ICDashboard />;
	else if (isFaculty) return <FacultyDashboard />;
	else if (isStudent) return <StudentDashboard />;
	else if (isStudentAffairs) return <StudentAffairsDashboard />;
}
