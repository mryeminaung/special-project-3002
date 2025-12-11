import { useHeader } from "@/lib/utils";
import { useEffect } from "react";

export const useHeaderInitializer = (title: string, header: string) => {
	const { setTabTitle, setSiteHeader } = useHeader();

	useEffect(() => {
		setTabTitle(title);
		setSiteHeader(header);
	}, [title, header]);
};
