import {
	IconCalendarEvent,
	IconDeviceTabletSearch,
	IconFileDescription,
	IconLayoutDashboard,
	IconListDetails,
	IconSend,
	IconSettings,
	IconUsersGroup,
} from "@tabler/icons-react";
import * as React from "react";

import { NavMain } from "@/components/nav-main";
import {
	Sidebar,
	SidebarContent,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

import { HasRole } from "@/lib/utils";
import { useAuthStore } from "@/stores/use-auth-store";
import { ShieldCheckIcon } from "lucide-react";
import AppLogo from "./app-logo";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	// const { isMobile } = useSidebar();
	const authUser = useAuthStore((state) => state.authUser);

	const adminTabs = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconLayoutDashboard,
		},
		{
			title: "Events",
			url: "/events",
			icon: IconCalendarEvent,
		},
		{
			title: "Project Areas",
			url: "/project-proposals",
			icon: IconFileDescription,
		},
		{
			title: "Students",
			url: "/students",
			icon: ShieldCheckIcon,
		},
		{
			title: "Faculties",
			url: "/faculties",
			icon: ShieldCheckIcon,
		},
		{
			title: "Departments",
			url: "/projects",
			icon: IconListDetails,
		},
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
	];

	const icTabs = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconLayoutDashboard,
		},
		{
			title: "Events",
			url: "/events",
			icon: IconCalendarEvent,
		},
		{
			title: "Announcements",
			url: "/announcements",
			icon: IconSend,
		},
		{
			title: "Project Proposals",
			url: "/project-proposals",
			icon: IconFileDescription,
		},
		{
			title: "Supervisors",
			url: "/supervisors",
			icon: ShieldCheckIcon,
		},
		{
			title: "Projects",
			url: "/projects",
			icon: IconListDetails,
		},
		{
			title: "Faculties",
			url: "/faculties",
			icon: IconUsersGroup,
		},
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
	];

	const supervisorTabs = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconLayoutDashboard,
		},
		{
			title: "Events",
			url: "/events",
			icon: IconCalendarEvent,
		},
		{
			title: "Announcements",
			url: "/announcements",
			icon: IconSend,
		},
		{
			title: "Browse Proposals",
			url: "/project-proposals/browse",
			icon: IconDeviceTabletSearch,
		},
		{
			title: "Assigned Projects",
			url: "/assigned-projects",
			icon: IconListDetails,
		},
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
	];

	const studentTabs = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconLayoutDashboard,
		},
		{
			title: "Events",
			url: "/events",
			icon: IconCalendarEvent,
		},
		{
			title: "Announcements",
			url: "/announcements",
			icon: IconSend,
		},
		{
			title: "My Proposals",
			url: "/project-proposals/me",
			icon: IconFileDescription,
		},
		{
			title: "My Projects",
			url: "/projects/my-projects",
			icon: IconListDetails,
		},
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
	];

	const studentAffairTabs = [
		{
			title: "Dashboard",
			url: "/dashboard",
			icon: IconLayoutDashboard,
		},
		{
			title: "Project Proposals",
			url: "/project-proposals",
			icon: IconFileDescription,
		},
		{
			title: "Supervisors",
			url: "/supervisors",
			icon: ShieldCheckIcon,
		},
		{
			title: "Projects",
			url: "/projects",
			icon: IconListDetails,
		},
		{
			title: "Settings",
			url: "/settings",
			icon: IconSettings,
		},
	];

	const tabs = {
		IC: [...icTabs],
		Admin: [...adminTabs],
		Faculty: [...supervisorTabs],
		Student: [...studentTabs],
		StudentAffairs: [...studentAffairTabs],
	};

	const data = {
		user: {
			name: authUser?.name,
			email: authUser?.email,
			avatar: authUser?.avatar_url,
		},
		navMain: [
			...(HasRole("IC") ? tabs.IC : []),
			...(HasRole("Admin") ? tabs.Admin : []),
			...(HasRole("Student") ? tabs.Student : []),
			...((HasRole("Faculty") || HasRole("Supervisor")) &&
			!HasRole("Admin") &&
			!HasRole("IC")
				? tabs.Faculty
				: []),
		],
	};

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
					items={data.navMain}
				/>
			</SidebarContent>
			{/* <SidebarFooter>{isMobile && <NavUser user={data.user} />}</SidebarFooter> */}
		</Sidebar>
	);
}
