import {
	IconAdjustmentsAlt,
	IconLockSquareRounded,
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
import { useAuthStore } from "@/stores/use-auth-store";
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
	const logout = useAuthStore((state) => state.logout);

	const handleLogout = async () => {
		try {
			await api.post("/logout");
		} catch (error) {
			console.error(
				"Logout request failed, but clearing local session:",
				error,
			);
		} finally {
			logout();
			navigate("/login", { replace: true });
		}
	};

	const avatarFallbackName = user.name
		?.split(" ")
		.slice(1, 3)
		.map((name: string) => name[0])
		.join("");

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground hover:cursor-pointer">
							<Avatar className="h-10 w-10 rounded-full">
								{user.avatar !== null ? (
									<AvatarImage
										src={user.avatar}
										alt={user.name}
									/>
								) : (
									<AvatarFallback className="bg-primary-50 text-primary-700">
										{avatarFallbackName}
									</AvatarFallback>
								)}
							</Avatar>
							<div className="flex-1 hidden md:grid text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
								<span className="text-muted-foreground truncate text-xs">
									{user.email}
								</span>
							</div>
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "bottom"}
						align="end"
						sideOffset={4}>
						<DropdownMenuLabel className="p-0 font-normal md:hidden">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-10 w-10 hidden rounded-full">
									{user.avatar !== null ? (
										<>
											<AvatarImage
												src={user.avatar}
												alt={user.name}
											/>
										</>
									) : (
										<AvatarFallback className="bg-primary-50 text-primary-700">
											{avatarFallbackName}
										</AvatarFallback>
									)}
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-medium">{user.name}</span>
									<span className="text-muted-foreground truncate text-xs">
										{user.email}
									</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator className="md:hidden" />
						<DropdownMenuGroup>
							<DropdownMenuItem className="hover:cursor-pointer">
								<IconUserCircle />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem className="hover:cursor-pointer">
								<IconLockSquareRounded />
								Security
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
