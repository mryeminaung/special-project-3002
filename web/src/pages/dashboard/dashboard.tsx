import { HasRole } from "@/lib/utils";
import AdminDashboard from "./AdminDashboard";
import StudentAffairsDashboard from "./StudentAffairsDashboard";
import StudentDashboard from "./StudentDashboard";
import SupervisorDashboard from "./SupervisorDashboard";

export default function DashboardPage() {
	if (HasRole("IC")) return <AdminDashboard />;
	else if (HasRole("Faculty")) return <SupervisorDashboard />;
	else if (HasRole("Student")) return <StudentDashboard />;
	else if (HasRole("Student Affairs")) return <StudentAffairsDashboard />;
}
