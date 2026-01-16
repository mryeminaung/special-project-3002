import { AppSidebar } from "@/components/app-sidebar";
import ProgressIndicator from "@/components/progress-indicator";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import Cookies from "js-cookie";
import { useState } from "react";

export default function RootLayout({ children }: any) {
	const [open, setOpen] = useState(
		Cookies.get("sidebar_state") === "true" || !Cookies.get("sidebar_state"),
	);

	const handleOpenChange = (isOpen: boolean) => {
		setOpen(isOpen);
		// Save the sidebar_state to a cookie whenever it changes
		Cookies.set("sidebar_state", String(isOpen), { expires: 365 });
	};

	return (
		<SidebarProvider
			open={open}
			onOpenChange={handleOpenChange}
			style={
				{
					"--sidebar-width": "calc(var(--spacing) * 60)",
					"--header-height": "calc(var(--spacing) * 12)",
				} as React.CSSProperties
			}>
			<ProgressIndicator />
			<AppSidebar variant="sidebar" />
			<SidebarInset>
				<SiteHeader />
				<div className="flex flex-1 flex-col">
					<div className="@container/main flex flex-1 flex-col gap-2">
						<div className="flex flex-col gap-4 md:gap-6 p-4 md:p-8">
							<div>{children}</div>
						</div>
					</div>
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
