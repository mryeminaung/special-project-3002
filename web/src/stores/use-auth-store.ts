import api from "@/api/api";
import { create } from "zustand";
import { persist } from "zustand/middleware";
export interface AuthUser {
	id: number;
	name: string;
	email: string;
	phoneNumber?: string | null;
	address?: string | null;
	avatar_url?: string | null;
	role?: string;
	major?: string | null;
	gpa?: string | null;
	rank?: string | null;
	departmentName?: string | null;
	graduationStatus?: string | null;
	status?: string | null;
}

export interface AuthState {
	authUser: AuthUser;
	token: string | null;
}

type AuthStoreProps = {
	authUser: any | null;
	token: string | null;
	setAuth: (data: { user: any; token: string }) => void;
	logout: () => void;
};

export const useAuthStore = create<AuthStoreProps>()(
	persist(
		(set) => ({
			authUser: null,
			token: null,
			setAuth: (data: { user: any; token: string }) =>
				set({
					authUser: data.user,
					token: data.token,
				}),
			logout: () => {
				(set({ authUser: null, token: null }),
					delete api.defaults.headers.common["Authorization"]);
			},
		}),
		{ name: "spms-auth" },
	) as any,
);
