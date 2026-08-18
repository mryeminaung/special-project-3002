import { useAuthStore } from "@/stores/use-auth-store";

export const useRoleChecker = () => {
	const roles = useAuthStore((s) => s.authUser?.roles ?? []);

	return {
		isStudent:        roles.includes("student"),
		isAdmin:          roles.includes("admin"),
		isIC:             roles.includes("ic"),
		isSupervisor:     roles.includes("supervisor"),
		isFaculty:        roles.includes("faculty"),
		isExaminer:       roles.includes("examiner"),
		isTeamLeader:     roles.includes("team-leader"),
		isStudentAffairs: roles.includes("student-affairs"),
	};
};
