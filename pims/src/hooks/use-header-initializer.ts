import { useHeader } from "@/hooks/use-header";
import { useEffect } from "react";

export const useHeaderInitializer = (
	title: string | "Unknown",
	header: string | "Unknown",
) => {
	const { setTabTitle, setSiteHeader } = useHeader();

	useEffect(() => {
		setTabTitle(title);
		setSiteHeader(header);
	}, [title, header]);
};
