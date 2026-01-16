import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStoreProps = {
	authToken: string;
	setAuthToken: (token: string) => void;
};

export const useAuthStore = create<AuthStoreProps>(
	persist(
		(set) => ({
			authToken: "",
			setAuthToken: (token: string) => set(() => ({ authToken: token })),
		}),
		{
			name: "authToken",
			// storage: createJSONStorage(() => sessionStorage),
		},
	) as any,
);
