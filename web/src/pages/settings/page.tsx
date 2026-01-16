import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useHeaderInitializer } from "@/hooks/use-header-initializer";
import { useTheme } from "@/hooks/use-theme";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function SettingsPage() {
	useHeaderInitializer("MIIT | Settings", "Settings");
	const { theme, toggleTheme } = useTheme();

	return (
		<div className="space-y-6 max-w-7xl mx-auto">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						{theme === "dark" ? <IconMoon size={20} /> : <IconSun size={20} />}
						Appearance
					</CardTitle>
					<CardDescription>
						Customize the appearance of the application
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex items-center justify-between">
						<div className="space-y-0.5">
							<p className="text-sm font-medium">Theme</p>
							<p className="text-sm text-muted-foreground">
								Switch between light and dark mode
							</p>
						</div>
						<Button
							variant="outline"
							onClick={toggleTheme}
							className="gap-2">
							{theme === "dark" ? (
								<>
									<IconSun size={16} />
									Light Mode
								</>
							) : (
								<>
									<IconMoon size={16} />
									Dark Mode
								</>
							)}
						</Button>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
