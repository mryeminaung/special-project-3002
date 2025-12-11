import { IconCirclePlusFilled, type Icon } from "@tabler/icons-react";

import {
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
} from "@/components/ui/sidebar";
import { NavLink } from "react-router";

export function NavMain({
	items,
}: {
	items: {
		title: string;
		url: string;
		icon?: Icon;
	}[];
}) {
	return (
		<SidebarGroup>
			<SidebarGroupContent className="flex flex-col gap-2">
				<SidebarMenu>
					<NavLink
						to={"/dashboard"}
						className="bg-cherry-pie-950 rounded-2xl transition-transform active:scale-95 flex items-center px-6 gap-2 text-white py-2">
						<IconCirclePlusFilled size={28} />
						<span>Quick Create</span>
					</NavLink>
				</SidebarMenu>
				<SidebarMenu className="gap-y-2 mt-3">
					{items.map((item) => (
						<NavLink
							key={item.title}
							className={({ isActive }) =>
								[
									"rounded-2xl py-2 transition-transform active:scale-95",
									isActive
										? "bg-background text-black hover:text-black border-l-5 border-l-cherry-pie-950"
										: "bg-cherry-pie-50 text-black hover:bg-background hover:text-black",
								].join(" ")
							}
							to={item.url}>
							<p className="flex items-center w-[120px] gap-x-3 mx-6">
								{item.icon && <item.icon />}
								<span className="text-[14px]">{item.title}</span>
							</p>
						</NavLink>
						// <SidebarMenuItem key={item.title}>
						// 	<SidebarMenuButton
						// 		className="border mb-2 py-5 w-[120px]"
						// 		tooltip={item.title}>
						// 		<NavLink
						// 			className="rounded-xl w-full bg-red-500 bor"
						// 			to={item.url}>
						// 			<p className="flex items-center  w-[120px]  gap-x-3 mx-auto py-5 ">
						// 				{item.icon && <item.icon />}
						// 				<span className="text-[14px]">{item.title}</span>
						// 			</p>
						// 		</NavLink>
						// 	</SidebarMenuButton>
						// </SidebarMenuItem>
					))}
				</SidebarMenu>
			</SidebarGroupContent>
		</SidebarGroup>
	);
}
