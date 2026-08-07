import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type SiteHeaderProps = {
	tabTitle: string;
	siteHeader: string;
	setTabTitle: (title: string) => void;
	setSiteHeader: (title: string) => void;
};

export const useSiteHeaderStore = create<SiteHeaderProps>(
	persist(
		(set) => ({
			tabTitle: "",
			siteHeader: "",
			setTabTitle: (title: string) => {
				document.title = title;
				set((state: any) => ({ ...state, tabTitle: title }));
			},
			setSiteHeader: (header: string) => {
				set((state: any) => ({ ...state, siteHeader: header }));
			},
		}),
		{
			name: "siteInfo",
			storage: createJSONStorage(() => sessionStorage),
		},
	) as any,
);
