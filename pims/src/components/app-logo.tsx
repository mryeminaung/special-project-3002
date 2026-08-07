import { useTheme } from "@/hooks/use-theme";
import { NavLink } from "react-router";
import { SidebarMenuButton } from "./ui/sidebar";

export default function AppLogo() {
	const { theme } = useTheme();

	return (
		<SidebarMenuButton
			asChild
			className="mx-auto border py-8 bg-card rounded-2xl ">
			<div className="text-center">
				<NavLink
					to="/dashboard"
					className="flex flex-row px-5 justify-center items-center gap-x-3 text-center">
					<img
						key={theme}
						src={
							"/login-pic.png"
							// theme === "dark" ? "/wordmark_light_text.png" : "/wordmark.png"
						}
						alt="MIIT PIMS Logo"
						className="w-full"
					/>
					<span className="text-[12px] hidden text-left font-semibold">
						Myanmar Institute of Information Technology
					</span>
				</NavLink>
			</div>
		</SidebarMenuButton>
	);
}
