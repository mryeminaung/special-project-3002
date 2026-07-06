import { HasRole } from "@/lib/utils";

export const useRoleChecker = (): {
	isStudent: boolean;
	isAdmin: boolean;
	isIC: boolean;
	isSupervisor: boolean;
	isFaculty: boolean;
} => {
	const isStudent = HasRole("student");
	const isAdmin = HasRole("admin");
	const isIC = HasRole("ic");
	const isSupervisor = HasRole("supervisor");
	const isFaculty = HasRole("faculty");

	return { isStudent, isAdmin, isIC, isSupervisor, isFaculty };
};
