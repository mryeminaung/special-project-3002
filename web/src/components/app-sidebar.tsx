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
import { useRoleCheck } from "@/lib/utils";
import { useAuthStore } from "@/stores/useAuthStore";
import { BarChart3, Shield } from "lucide-react";
import { NavLink, useNavigate } from "react-router";
import { NavUser } from "./nav-user";
import { Button } from "./ui/button";
import adminAvatar from "/avatar.png";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { open, isMobile } = useSidebar();
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
				url: "/project-proposals/submission",
				icon: IconFileDescription,
			},
			{
				title: "Supervisors",
				url: "/supervisors",
				icon: Shield,
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
		Supervisor: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: IconLayoutDashboard,
			},
			{
				title: "Project Requests",
				url: "/my-tasks",
				icon: IconListCheck,
			},
			{
				title: "My Teams",
				url: "/teams",
				icon: IconUsers,
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
				url: "/project-proposals/submission/my",
				icon: IconDeviceTabletSearch,
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
		],
		Student: [
			{
				title: "Dashboard",
				url: "/dashboard",
				icon: IconLayoutDashboard,
			},
			{
				title: "My Proposal",
				url: "/my-proposal",
				icon: BarChart3,
			},
			{
				title: "My Supervisor",
				url: "/my-supervisor",
				icon: Shield,
			},
			{
				title: "My Tasks",
				url: "/my-tasks",
				icon: IconListCheck,
			},
			{
				title: "My Team",
				url: "/my-team",
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
				title: "Projects",
				url: "/my-tasks",
				icon: IconListCheck,
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
			...(useRoleCheck("IC") ? tabs.IC : []),
			...(useRoleCheck("Student") ? tabs.Student : []),
			...(useRoleCheck("Student Affairs") ? tabs.StudentAffairs : []),
			...(useRoleCheck("Faculty") ? tabs.Faculty : []),
			...(useRoleCheck("Supervisor") ? tabs.Supervisor : []),
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
					<Button
						onClick={handleLogout}
						className="border border-red-500 bg-white text-red-500 hover:cursor-pointer rounded-xl py-5 hover:bg-gray-100  mt-3 absolute bottom-5 right-5 text-[14px] left-5 justify-center">
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
