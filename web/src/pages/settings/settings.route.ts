import Account from "./account";
import Events from "./events";
import SettingsPage from "./page";
import Password from "./password";
import Preferences from "./preferences";
import Profile from "./profile";

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
