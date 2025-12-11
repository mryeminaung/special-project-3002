import {
	IconCamera,
	IconChartBar,
	IconDatabase,
	IconFileAi,
	IconFileDescription,
	IconFileWord,
	IconHelp,
	IconLayoutDashboard,
	IconListCheck,
	IconListDetails,
	IconLogout,
	IconReport,
	IconSearch,
	IconSettings,
	IconUsers,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";

import { NavLink } from "react-router";
import { NavUser } from "./nav-user";
import adminAvatar from "/avatar.png";

const data = {
	user: {
		name: "Dr. Myat Thuzar Tun",
		email: "myat_thuzar_tun@miit.edu.mm",
		avatar: adminAvatar,
	},
	navMain: [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconLayoutDashboard,
		},
		{
			title: "My Tasks",
			url: "/my-tasks",
			icon: IconListCheck,
		},
		{
			title: "Supervisors",
			url: "/supervisors",
			icon: IconChartBar,
		},
		{
			title: "Projects",
			url: "/projects",
			icon: IconListDetails,
		},
		{
			title: "Teams",
			url: "/teams",
			icon: IconUsers,
		},
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
	],
	navClouds: [
		{
			title: "Capture",
			icon: IconCamera,
			isActive: true,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Proposal",
			icon: IconFileDescription,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
		{
			title: "Prompts",
			icon: IconFileAi,
			url: "#",
			items: [
				{
					title: "Active Proposals",
					url: "#",
				},
				{
					title: "Archived",
					url: "#",
				},
			],
		},
	],
	navSecondary: [
		{
			title: "Settings",
			url: "#",
			icon: IconSettings,
		},
		{
			title: "Get Help",
			url: "#",
			icon: IconHelp,
		},
		{
			title: "Search",
			url: "#",
			icon: IconSearch,
		},
	],
	documents: [
		{
			name: "Data Library",
			url: "#",
			icon: IconDatabase,
		},
		{
			name: "Reports",
			url: "#",
			icon: IconReport,
		},
		{
			name: "Word Assistant",
			url: "#",
			icon: IconFileWord,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { open, isMobile } = useSidebar();
	// use to change the img, that appeared on the side bar
	// console.log(open);

	return (
		<Sidebar
			collapsible="offcanvas"
			{...props}>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="-mt-1">
						<SidebarMenuButton
							asChild
							// className="data-[slot=sidebar-menu-button]:!p-1.5"
							className="mx-auto border py-8 bg-card rounded-2xl ">
							<div className="text-center">
								<NavLink
									to="/dashboard"
									className="flex flex-row px-5 justify-center items-center gap-x-3 text-center">
									<img
										src="/logo_bg_rm.png"
										alt="Image"
										className="w-full h-16 rounded-full"
									/>
									<span className="text-[12px] font-mon hidden text-left font-semibold">
										Myanmar Institute of Information Technology
									</span>
								</NavLink>
							</div>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				{/* <NavDocuments items={data.documents} />
				<NavSecondary
					items={data.navSecondary}
					className="mt-auto"
				/> */}
			</SidebarContent>
			<SidebarFooter>
				{!isMobile ? (
					<NavLink
						to={"/login"}
						className="bg-red-500 flex flex-row gap-x-2 items-center px-3 py-2 rounded-full text-primary-foreground hover:bg-primary/90 hover:text-primary-foreground active:bg-primary/90 active:text-primary-foreground min-w-8 duration-200 ease-linear absolute bottom-5 right-5 text-[14px] left-5 justify-center">
						<IconLogout size={18} />
						<span>Log Out</span>
					</NavLink>
				) : (
					<NavUser user={data.user} />
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
