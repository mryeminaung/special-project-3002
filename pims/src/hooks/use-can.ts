import { useAuthStore } from "@/stores/use-auth-store";

export type Permission =
	// Proposals
	| "approve-proposal"
	| "reject-proposal"
	| "view-all-proposals"
	| "submit-proposal"
	// Projects
	| "mark-project-complete"
	| "manage-examiners"
	| "set-seminar-deadlines"
	| "update-report-status"
	| "update-seminar-status"
	| "upload-report"
	// Grades
	| "give-grade"
	// Announcements
	| "manage-announcements"
	// IC
	| "manage-events"
	// Admin
	| "manage-departments"
	| "manage-project-areas"
	| "manage-faculties"
	| "manage-students";

export const useCan = () => {
	const permissions = useAuthStore((s) => s.authUser?.permissions ?? []);

	const can = (permission: Permission): boolean =>
		permissions.includes(permission);

	return { can };
};
