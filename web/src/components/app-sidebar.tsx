import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useRoleChecker } from "@/hooks/use-role-checker";
import { useAuthStore } from "@/stores/use-auth-store";
import { NAV_ITEMS } from "@/constants/navigation";
import AppLogo from "./app-logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const authUser = useAuthStore((state) => state.authUser);
	const { isAdmin, isIC, isStudent, isFaculty, isSupervisor } =
		useRoleChecker();

	const navMain = [
		...(isIC ? NAV_ITEMS.ic : []),
		...(isAdmin ? NAV_ITEMS.admin : []),
		...(isStudent ? NAV_ITEMS.student : []),
		...((isFaculty || isSupervisor) && !isAdmin && !isIC ? NAV_ITEMS.supervisor : []),
	];

	return (
		<Sidebar
			collapsible="offcanvas"
			{...props}
			className="dark:border-r-gray-500">
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="-mt-1">
						<AppLogo />
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain
					role={authUser?.role}
					items={navMain}
				/>
			</SidebarContent>
		</Sidebar>
	);
}
