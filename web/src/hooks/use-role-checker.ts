import { HasRole } from "@/lib/utils";

export const useRoleChecker = (): {
	isStudent: boolean;
	isAdmin: boolean;
	isIC: boolean;
	isSupervisor: boolean;
	isFaculty: boolean;
} => {
	const isStudent = HasRole("Student");
	const isAdmin = HasRole("Admin");
	const isIC = HasRole("IC");
	const isSupervisor = HasRole("Supervisor");
	const isFaculty = HasRole("Faculty");

	return { isStudent, isAdmin, isIC, isSupervisor, isFaculty };
};
