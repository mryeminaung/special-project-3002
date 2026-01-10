import {
	IconAdjustmentsAlt,
	IconDotsVertical,
	IconLogout,
	IconNotification,
	IconUserCircle,
} from "@tabler/icons-react";

import api from "@/api/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { useNavigate } from "react-router";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	const { isMobile } = useSidebar();
	const navigate = useNavigate();
	const setAuthToken = useAuthStore((state) => state.setAuthToken);
	const setAuthUser = useAuthUserStore((state) => state.setAuthUser);

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
			setAuthUser("");
			delete api.defaults.headers.common["Authorization"];
			navigate("/login", { replace: true });
		}
	};

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer">
							<Avatar className="h-10 w-10 rounded-full">
								<AvatarImage
									src="/avatar.jpg"
									alt={user.name}
								/>
								<AvatarFallback className="rounded-lg">MT</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 hidden text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="text-muted-foreground truncate text-xs">
									{user.email}
								</span>
							</div>
							<IconDotsVertical className="ml-auto hidden size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "bottom"}
						align="end"
						sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-10 w-10 hidden rounded-full">
									<AvatarImage
										src="/avatar_v1.png"
										alt={user.name}
									/>
									<AvatarFallback className="rounded-lg">MT</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<DropdownMenuItem>
								<IconUserCircle />
								Account
							</DropdownMenuItem>
							<DropdownMenuItem
								onClick={() => navigate("/settings")}
								className="hover:cursor-pointer">
								<IconAdjustmentsAlt />
								Settings
							</DropdownMenuItem>
							<DropdownMenuItem className="hidden">
								<IconNotification />
								Notifications
							</DropdownMenuItem>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={handleLogout}
							variant="destructive"
							className="hover:cursor-pointer">
							<IconLogout />
							Log out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
