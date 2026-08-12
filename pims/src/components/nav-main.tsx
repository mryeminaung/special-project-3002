import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@/components/ui/sidebar";
import { PlusCircleIcon } from "@heroicons/react/24/solid";
import type { ComponentType } from "react";
import { NavLink } from "react-router";

export function NavMain({
	items,
	role,
}: {
	role: string;
	items: {
		title: string;
		url: string;
		icon?: ComponentType<{ className?: string }>;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				{role === "Student" && (
					<SidebarMenu className="mb-3 hidden">
						<NavLink
							to={"/proposals/new/student"}
							className="bg-primary-700 dark:bg-primary-800 rounded-2xl transition-all active:scale-95 flex items-center px-6 gap-2 text-white dark:text-neutral-100 py-2 hover:bg-primary-700/80 dark:hover:bg-primary-700 shadow-sm hover:shadow-md">
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
										? "bg-sidebar-accent text-sidebar-accent-foreground dark:text-primary-400 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground dark:hover:text-primary-300 border-l-4 border-l-primary-600 dark:border-l-primary-500 font-medium shadow-sm"
										: "bg-transparent dark:bg-transparent text-sidebar-foreground/70 dark:text-sidebar-foreground/80 hover:bg-sidebar-accent/50 dark:hover:bg-sidebar-accent/30 hover:text-sidebar-accent-foreground dark:hover:text-sidebar-accent-foreground",
								].join(" ")
							}
							to={item.url}>
							<p className="flex items-center w-auto gap-x-3 mx-6">
								{item.icon && <item.icon className="w-5 h-5" />}
								<span className="text-[14px]">{item.title}</span>
							</p>
						</NavLink>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
