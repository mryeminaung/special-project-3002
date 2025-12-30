import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { useSiteHeaderStore } from "@/stores/useSiteHeaderStore";
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

export const useRoleCheck = (role: UserRole): boolean => {
	const authUser = useAuthUserStore((state) => state.authUser);

	return authUser?.role === role;
};
