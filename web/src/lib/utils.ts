import { useAuthStore } from "@/stores/use-auth-store";
import { useSiteHeaderStore } from "@/stores/use-site-header-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export const useHeader = () => {
	const tabTitle = useSiteHeaderStore((state) => state.tabTitle);
	const setTabTitle = useSiteHeaderStore((state) => state.setTabTitle);
	const siteHeader = useSiteHeaderStore((state) => state.siteHeader);
	const setSiteHeader = useSiteHeaderStore((state) => state.setSiteHeader);

	return { tabTitle, setTabTitle, siteHeader, setSiteHeader };
};

type UserRole =
	| "admin"
	| "ic"
	| "supervisor"
	| "faculty"
	| "student"
	| "student-affairs";

export const HasRole = (role: UserRole): boolean => {
	const authUser = useAuthStore.getState().authUser;

	return authUser?.roles.includes(role);
};

export type ProposalStatus = "pending" | "rejected" | "approved";

export const PROPOSAL_STATUS_COLOR = (status: ProposalStatus): string => {
	const styles: Record<ProposalStatus, string> = {
		pending:
			"bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
		rejected:
			"bg-red-100 text-red-800 border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-800",
		approved:
			"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
	};

	return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
};

export type ProposalAppliedType = "Student" | "Faculty";

export const PROPOSAL_APPLIED_TYPE_COLOR = (type: ProposalAppliedType): string => {
	const styles: Record<ProposalAppliedType, string> = {
		Student:
			"bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-400 dark:border-sky-800",
		Faculty:
			"bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-400 dark:border-violet-800",
	};

	return styles[type] || "bg-gray-100 text-gray-800 border-gray-200";
};

export type ProposalProjectType = "Special" | "Capstone" | "Master";

export const PROPOSAL_PROJECT_TYPE_COLOR = (type: ProposalProjectType): string => {
	const styles: Record<ProposalProjectType, string> = {
		Special:
			"bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/30 dark:text-teal-400 dark:border-teal-800",
		Capstone:
			"bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-400 dark:border-orange-800",
		Master:
			"bg-indigo-100 text-indigo-800 border-indigo-200 dark:bg-indigo-900/30 dark:text-indigo-400 dark:border-indigo-800",
	};

	return styles[type] || "bg-gray-100 text-gray-800 border-gray-200";
};

export type ProjectStatus = "active" | "pending" | "under_review" | "completed";

export const PROJECT_STATUS_COLOR = (status: ProjectStatus): string => {
	const styles: Record<ProjectStatus, string> = {
		active:
			"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
		under_review:
			"bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
		pending:
			"bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800",
		completed:
			"bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800",
	};

	return styles[status] || "bg-gray-100 text-gray-800 border-gray-200";
};
