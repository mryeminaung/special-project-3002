import Account from "./pages/account";
import Password from "./pages/password";
import Preferences from "./pages/preferences";
import Profile from "./pages/profile";
import SettingsPage from "./pages/settings-page";

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
