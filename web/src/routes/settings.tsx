import Account from "@/pages/settings/account";
import Events from "@/pages/settings/events";
import SettingsPage from "@/pages/settings/page";
import Password from "@/pages/settings/password";
import Preferences from "@/pages/settings/preferences";
import Profile from "@/pages/settings/profile";

export const settingsRoutes = [
	{
		path: "/settings",
		Component: SettingsPage,
		children: [
			{
				path: "profile",
				Component: Profile,
			},
			{
				path: "password",
				Component: Password,
			},
			{
				path: "events",
				Component: Events,
			},
			{
				path: "preferences",
				Component: Preferences,
			},
			{
				path: "account",
				Component: Account,
			},
		],
	},
];
