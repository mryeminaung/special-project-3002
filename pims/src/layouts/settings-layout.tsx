import { HEADINGS } from "@/constants/navigation";
import Heading from "@/components/heading";
import { useRoleChecker } from "@/hooks/use-role-checker";
import { IconCalendarEvent } from "@tabler/icons-react";
// Lock ကို ဒီမှာ ထည့်သွင်းပေးပါ
import { Lock, SlidersVertical, TriangleAlert, UserRound } from "lucide-react";
import { Link, Navigate, useLocation } from "react-router";

export default function SettingsLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const location = useLocation();
	const { isIC } = useRoleChecker();
	const SettingTabs = [
		{
			title: "Profile",
			href: "/settings/profile",
			icon: UserRound,
		},
		...(isIC
			? [
					{
						title: "Events",
						href: "/settings/events",
						icon: IconCalendarEvent,
					},
				]
			: []),
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

	if (location.pathname === "/settings") {
		return (
			<Navigate
				to="/settings/profile"
				replace
				state={{ from: location }}
			/>
		);
	}

	return (
		<div>
			<Heading
				title={HEADINGS.settings.title}
				description={HEADINGS.settings.description}
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
											? "bg-primary-100 dark:bg-primary-900/60 text-primary-800 dark:text-primary-300 font-semibold shadow-sm border-l-primary-700 dark:border-l-primary-400 border-l-4"
											: "hover:bg-card text-muted-foreground"
									}`}>
									<tab.icon className="mr-2 h-4 w-4" />
									{tab.title}
								</Link>
							);
						})}
					</div>
				</div>
				<div className="md:col-span-4 lg:col-span-5">{children}</div>
			</section>
		</div>
	);
}
