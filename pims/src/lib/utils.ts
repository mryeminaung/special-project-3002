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
export type ProposalAppliedType = "Student" | "Faculty";
export type ProposalProjectType = "Special" | "Capstone" | "Master";
export type ProjectStatus = "active" | "pending" | "under_review" | "completed";

// Thin wrappers — actual colors live in @/constants/badge-colors
import {
	proposalStatusColor,
	proposalAppliedTypeColor,
	projectTypeColor,
	projectStatusColor,
} from "@/constants/badge-colors";

export const PROPOSAL_STATUS_COLOR = (status: ProposalStatus) => proposalStatusColor(status);
export const PROPOSAL_APPLIED_TYPE_COLOR = (type: ProposalAppliedType) => proposalAppliedTypeColor(type);
export const PROPOSAL_PROJECT_TYPE_COLOR = (type: ProposalProjectType) => projectTypeColor(type);
export const PROJECT_STATUS_COLOR = (status: ProjectStatus) => projectStatusColor(status);
