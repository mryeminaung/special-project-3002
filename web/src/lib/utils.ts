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

export const HasRole = (role: UserRole): boolean => {
	const authUser = useAuthUserStore((state) => state.authUser);

	return authUser?.role === role;
};

export const STATUS_COLOR = (
	status: "approved" | "rejected" | "pending" | "active" | "completed",
) => {
	switch (status) {
		case "active":
			return "bg-green-100 text-green-800 border-green-200";
		case "approved":
			return "bg-green-100 text-green-800 border-green-200";
		case "completed":
			return "bg-green-100 text-green-800 border-green-200";
		case "rejected":
			return "bg-red-100 text-red-800 border-red-200";
		default:
			return "bg-yellow-100 text-yellow-800 border-yellow-200";
	}
};
