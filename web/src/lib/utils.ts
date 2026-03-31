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

type UserRole = "IC" | "Supervisor" | "Faculty" | "Student" | "Student Affairs";

export const HasRole = (role: UserRole): boolean => {
	const authUser = useAuthStore.getState().authUser;

	return authUser?.role === role;
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
