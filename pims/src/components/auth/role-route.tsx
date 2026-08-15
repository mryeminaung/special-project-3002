import { useAuthStore } from "@/stores/use-auth-store";
import { Outlet } from "react-router";
import UnAuthorized from "./un-authorized";

type UserRole = "admin" | "ic" | "supervisor" | "faculty" | "student" | "student-affairs";

function createRoleRoute(...allowedRoles: UserRole[]) {
	return function RoleGuard() {
		const authUser = useAuthStore((state) => state.authUser);
		const hasAccess = allowedRoles.some((r) => authUser?.roles?.includes(r));
		return hasAccess ? <Outlet /> : <UnAuthorized />;
	};
}

export const AdminRoute            = createRoleRoute("admin");
export const ICRoute               = createRoleRoute("ic");
export const SupervisorRoute       = createRoleRoute("supervisor");
export const FacultyRoute          = createRoleRoute("faculty");
export const StudentRoute          = createRoleRoute("student");
export const AdminOrICRoute        = createRoleRoute("admin", "ic");
export const ICOrSARoute           = createRoleRoute("ic", "student-affairs");
export const NonAdminRoute         = createRoleRoute("ic", "supervisor", "student", "student-affairs", "faculty");
export const StudentOrICOrSARoute  = createRoleRoute("student", "ic", "student-affairs", "faculty", "supervisor");
export const FacultyOrSupOrICRoute = createRoleRoute("faculty", "supervisor", "ic");
