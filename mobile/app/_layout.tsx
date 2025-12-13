import { Stack } from "expo-router";
import "./global.css";

export default function RootLayout() {
	return (
		<Stack initialRouteName="(auth)">
			<Stack.Screen
				name="(auth)"
				options={{ headerShown: false }}
			/>
			<Stack.Screen
				name="index"
				options={{ headerShown: false }}
			/>
		</Stack>
	);
}
