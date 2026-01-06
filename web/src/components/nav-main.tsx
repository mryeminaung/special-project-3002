import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@/components/ui/sidebar";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import { NavLink } from "react-router";
import type { ComponentType } from "react";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: ComponentType<{ className?: string }>;
	}[];
}) {
	const authUser = useAuthUserStore((state) => state.authUser);

	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				{authUser.role === "Student" && (
					<SidebarMenu className="mb-3">
						<NavLink
							to={"/project-proposals/create"}
							className="bg-primary-950 dark:bg-primary-800 rounded-2xl transition-all active:scale-95 flex items-center px-6 gap-2 text-white dark:text-neutral-100 py-2 hover:bg-primary-900 dark:hover:bg-primary-700 shadow-sm hover:shadow-md">
							<PlusCircleIcon className="w-7 h-7" />
							<span>Create Proposal</span>
						</NavLink>
					</SidebarMenu>
				)}
				<SidebarMenu className="gap-y-2 ">
					{items.map((item) => (
						<NavLink
							key={item.title}
							className={({ isActive }) =>
								[
									"rounded-md py-2 transition-all duration-200 active:scale-95",
									isActive
										? "bg-sidebar-accent text-sidebar-accent-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground border-l-4 border-l-primary-600 dark:border-l-primary-500 font-medium shadow-sm"
										: "bg-transparent dark:bg-transparent text-sidebar-foreground/70 dark:text-sidebar-foreground/80 hover:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground",
								].join(" ")
							}
							to={item.url}>
							<p className="flex items-center w-auto gap-x-3 mx-6">
								{item.icon && <item.icon className="w-5 h-5" />}
								<span className="text-[14px]">{item.title}</span>
							</p>
						</NavLink>
						// <SidebarMenuItem key={item.title}>
						// <SidebarMenuButton
						//  className="border mb-2 py-5 w-[120px]"
						//  tooltip={item.title}>
						//  <NavLink
						//   className="rounded-xl w-full bg-red-500 bor"
						//   to={item.url}>
						//   <p className="flex items-center w-[120px] gap-x-3 mx-auto py-5 ">
						//    {item.icon && <item.icon />}
						//    <span className="text-[14px]">{item.title}</span>
						//   </p>
						//  </NavLink>
						// </SidebarMenuButton>
						// </SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
