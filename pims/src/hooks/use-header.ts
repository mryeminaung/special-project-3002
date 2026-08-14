import { useSiteHeaderStore } from "@/stores/use-site-header-store";

export const useHeader = () => {
	const tabTitle = useSiteHeaderStore((state) => state.tabTitle);
	const setTabTitle = useSiteHeaderStore((state) => state.setTabTitle);
	const siteHeader = useSiteHeaderStore((state) => state.siteHeader);
	const setSiteHeader = useSiteHeaderStore((state) => state.setSiteHeader);

	return { tabTitle, setTabTitle, siteHeader, setSiteHeader };
};
