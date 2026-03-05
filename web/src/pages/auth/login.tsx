import { ThemeToggle } from "@/components/theme-toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import GuestLayout from "@/layouts/guest-layout";
import { IconMail, IconQuestionMark } from "@tabler/icons-react";
import { LoginForm } from "./components/login-form";

export default function LoginPage() {
	return (
		<GuestLayout>
			<div className=" min-h-svh p-6 md:p-10 flex flex-col items-center justify-center ">
				<ThemeToggle variant="floating" />
				<LoginForm />
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<IconQuestionMark
							color="black"
							className="absolute bottom-5 right-5 drop-shadow-2xl bg-white rounded-full p-1 hover:cursor-pointer"
							size={34}
						/>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel className="text-center">
							Help & Support
						</DropdownMenuLabel>
						<DropdownMenuGroup>
							<DropdownMenuItem className="hover:underline hover:cursor-pointer hover:bg-cherry-pie-700">
								<DropdownMenuShortcut>
									<IconMail />
								</DropdownMenuShortcut>
								Get in Touch
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
		</GuestLayout>
	);
}
