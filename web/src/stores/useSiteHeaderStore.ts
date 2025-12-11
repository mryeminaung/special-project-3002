import { create } from "zustand";

type SiteHeaderProps = {
	tabTitle: string;
	siteHeader: string;
	setTabTitle: (title: string) => void;
	setSiteHeader: (title: string) => void;
};

export const useSiteHeaderStore = create<SiteHeaderProps>((set) => ({
	tabTitle: "",
	siteHeader: "",
	setTabTitle: (title: string) => {
		document.title = title;
		set((state) => ({ ...state, tabTitle: title }));
	},
	setSiteHeader: (header: string) => {
		set((state) => ({ ...state, siteHeader: header }));
	},
}));
