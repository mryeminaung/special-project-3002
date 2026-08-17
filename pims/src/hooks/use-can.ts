import { useAuthStore } from "@/stores/use-auth-store";

export type Permission =
	| "approve-proposal"
	| "reject-proposal"
	| "mark-project-complete"
	| "manage-announcements"
	| "manage-examiners"
	| "set-seminar-deadlines"
	| "update-report-status"
	| "update-seminar-status";

export const useCan = () => {
	const permissions = useAuthStore((s) => s.authUser?.permissions ?? []);

	const can = (permission: Permission): boolean => permissions.includes(permission);

	return { can };
};
