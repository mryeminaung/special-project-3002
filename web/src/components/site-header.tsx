import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { useAuthUserStore } from "@/stores/useAuthUserStore";
import { useSiteHeaderStore } from "@/stores/useSiteHeaderStore";
import { useEffect, useState } from "react";
import { NavUser } from "./nav-user";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
	const siteHeader = useSiteHeaderStore((state) => state.siteHeader);
	const [isScrolled, setIsScrolled] = useState(false);

	useEffect(() => {
		const handleScroll = () => {
			setIsScrolled(window.scrollY > 10);
		};

		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, []);

	const authUser = useAuthUserStore((state) => state.authUser);

	const data = {
		user: {
			name: authUser.name,
			email: authUser.email,
			avatar: "/avatars/shadcn.jpg",
		},
	};

	return (
		<header
			className={[
				"flex h-(--header-height) shrink-0 items-center gap-2 border-b transition-all ease-linear sticky top-0 z-10 py-8",
				isScrolled ? "bg-transparent backdrop-blur-md shadow" : "bg-background",
			].join(" ")}>
			<div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mx-1 data-[orientation=vertical]:h-4"
				/>
				<h1 className="text-lg font-medium line-clamp-1">{siteHeader}</h1>
				<div className="ml-auto flex items-center gap-2">
					<ThemeToggle />
					<NavUser user={data.user} />
				</div>
			</div>
		</header>
	);
}
