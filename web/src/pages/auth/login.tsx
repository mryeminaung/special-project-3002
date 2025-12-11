import { LoginForm } from "@/components/auth/login-form";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IconMail, IconQuestionMark } from "@tabler/icons-react";

export default function LoginPage() {
	return (
		<div className="bg-[url(/main-bg.jpg)] bg-center bg-cover flex min-h-svh flex-col items-center justify-center p-6 md:p-10 relative">
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
	);
}
