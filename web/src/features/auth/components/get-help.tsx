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

export default function GetHelp() {
	return (
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
	);
}
