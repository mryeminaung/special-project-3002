import {
	IconCamera,
	IconDatabase,
	IconDeviceTabletSearch,
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
	IconUsersGroup,
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

import api from "@/api/api";
import { useTheme } from "@/hooks/use-theme";
import { HasRole } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { Shield, ShieldCheckIcon } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";
import adminAvatar from "/avatar.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { isMobile } = useSidebar();
	const { theme } = useTheme();
	const navigate = useNavigate();
	const setAuthToken = useAuthStore((state) => state.setAuthToken);

	const tabs = {
		IC: [
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
				title: "Faculties",
				url: "/faculties",
				icon: IconUsers,
			},
			{
				title: "Teams",
				url: "/teams",
				icon: IconUsersGroup,
			},
			{
				title: "Settings",
				url: "/settings",
				icon: IconSettings,
			},
		],
		Faculty: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: IconLayoutDashboard,
			},
			{
				title: "Browse Proposals",
				url: "/project-proposals/my",
				icon: IconDeviceTabletSearch,
			},
			{
				title: "My Projects",
				url: "/my-projects",
				icon: IconListDetails,
			},
			{
				title: "My Teams",
				url: "/my-teams",
				icon: IconListDetails,
			},
			{
				title: "Settings",
				url: "/settings",
				icon: IconSettings,
			},
		],
		Student: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: IconLayoutDashboard,
			},
			{
				title: "Project Proposals",
				url: "/project-proposals/my-proposals",
				icon: IconFileDescription,
			},
			{
				title: "My Tasks",
				url: "/my-tasks",
				icon: IconListCheck,
			},
			{
				title: "My Teams",
				url: "/teams/my-teams",
				icon: IconUsersGroup,
			},
			{
				title: "Settings",
				url: "/settings",
				icon: IconSettings,
			},
		],
		StudentAffairs: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: IconLayoutDashboard,
			},
			{
				title: "Project Proposals",
				url: "/project-proposals/submission",
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
				title: "Teams",
				url: "/teams",
				icon: IconUsersGroup,
			},
			{
				title: "Settings",
				url: "/settings",
				icon: IconSettings,
			},
		],
	};

	const data = {
		user: {
			name: "Dr. Myat Thuzar Tun",
			email: "myat_thuzar_tun@miit.edu.mm",
			avatar: adminAvatar,
		},
		navMain: [
			...(HasRole("IC") ? tabs.IC : []),
			...(HasRole("Student") ? tabs.Student : []),
			...(HasRole("Student Affairs") ? tabs.StudentAffairs : []),
			...(HasRole("Faculty") || HasRole("Supervisor") ? tabs.Faculty : []),
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

	const handleLogout = async () => {
		try {
			await api.post("/logout");
		} catch (error) {
			console.error(
				"Logout request failed, but clearing local session:",
				error,
			);
		} finally {
			setAuthToken("");
			delete api.defaults.headers.common["Authorization"];
			navigate("/login", { replace: true });
		}
	};

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
										key={theme}
										src={
											theme === "dark"
												? "/wordmark_light_text.png"
												: "/wordmark.png"
										}
										alt="MIIT SPMS Logo"
										className="w-full"
									/>
									<span className="text-[12px] hidden text-left font-semibold">
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
					<Button
						onClick={handleLogout}
						variant="outline"
						className="gap-2 rounded-xl px-6 py-6 text-sm font-medium transition-all duration-200
    border-2 border-red-200 dark:border-red-800
    text-red-600 dark:text-red-400
    bg-white dark:bg-neutral-900
    hover:bg-red-50 dark:hover:bg-red-950/30
    hover:border-red-300 dark:hover:border-red-700
    hover:text-red-700 dark:hover:text-red-300
    active:bg-red-100 dark:active:bg-red-950/50
    shadow-sm hover:shadow
    absolute bottom-5 right-5 left-5
    justify-center items-center">
						<IconLogout size={18} />
						<span>Log Out</span>
					</Button>
				) : (
					<NavUser user={data.user} />
				)}
			</SidebarFooter>
		</Sidebar>
	);
}
