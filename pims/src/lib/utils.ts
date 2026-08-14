import { useAuthStore } from "@/stores/use-auth-store";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
	const parts = name.trim().split(/\s+/);
	if (parts.length === 1) return parts[0][0]?.toUpperCase() ?? "";
	return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

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
