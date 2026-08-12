import { useThemeStore } from "@/stores/use-theme-store";
import { useLayoutEffect, type ReactNode } from "react";

export default function ThemeProvider({ children }: { children: ReactNode }) {
	const theme = useThemeStore((state) => state.theme);

	useLayoutEffect(() => {
		const root = document.documentElement;
		if (theme === "dark") {
			root.classList.add("dark");
		} else {
			root.classList.remove("dark");
		}
	}, [theme]);

	return <>{children}</>;
}
