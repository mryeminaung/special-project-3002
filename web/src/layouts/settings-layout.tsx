import Heading from "@/components/heading";
import PageWrapper from "@/components/page-wrapper";
import { Lock, SlidersVertical, TriangleAlert, UserRound } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router";

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const SettingTabs = [
		{
			title: "Profile",
			href: "/settings/profile",
			icon: UserRound,
		},
		{
			title: "Security",
			href: "/settings/password",
			icon: Lock,
		},
		{
			title: "Preferences",
			href: "/settings/preferences",
			icon: SlidersVertical,
		},
		{
			title: "Account",
			href: "/settings/account",
			icon: TriangleAlert,
		},
	];

	const location = useLocation();

	if (location.pathname === "/settings") {
		return (
			<Navigate
				to="//settings/profile"
				replace
				state={{ from: location }}
			/>
		);
	}

	return (
		<PageWrapper>
			<Heading
				title="Settings"
				description="Manage your account, security, and preferences"
			/>
			<section className="grid grid-cols-1 md:grid-cols-6 gap-10 mt-5">
				<div className="md:col-span-2 lg:col-span-1">
					<div className="flex flex-col gap-2">
						{SettingTabs.map((tab) => {
							const isActive = location.pathname === tab.href;
							return (
								<Link
									key={tab.href}
									to={tab.href}
									className={`flex items-center px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
										isActive
											? "bg-card font-semibold shadow-sm border-l-primary-500 border-l-4"
											: " hover:bg-card"
									}`}>
									{tab.icon && <tab.icon className="mr-2 h-4 w-4" />}
									{tab.title}
								</Link>
							);
						})}
					</div>
				</div>
				<div className="md:col-span-4 lg:col-span-5">{children}</div>
			</section>
		</PageWrapper>
	);
}
