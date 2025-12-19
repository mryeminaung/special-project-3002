import { useRoleCheck } from "@/lib/utils";
import AdminDashboard from "./AdminDashboard";
import StudentAffairsDashboard from "./StudentAffairsDashboard";
import StudentDashboard from "./StudentDashboard";
import SupervisorDashboard from "./SupervisorDashboard";

export default function DashboardPage() {
	if (useRoleCheck("IC")) return <AdminDashboard />;
	else if (useRoleCheck("Faculty")) return <SupervisorDashboard />;
	else if (useRoleCheck("Student")) return <StudentDashboard />;
	else if (useRoleCheck("Student Affairs")) return <StudentAffairsDashboard />;
}
