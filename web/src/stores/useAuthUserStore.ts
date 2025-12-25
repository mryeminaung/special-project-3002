import { create } from "zustand";
import { persist } from "zustand/middleware";

type AuthStoreProps = {
	authUser: any;
	setAuthUser: (user: any) => void;
};

export const useAuthUserStore = create<AuthStoreProps>(
	persist(
		(set) => ({
			authUser: "",
			setAuthUser: (user: any) => set(() => ({ authUser: user })),
		}),
		{
			name: "authUser",
			// storage: createJSONStorage(() => sessionStorage),
		},
	) as any,
);
