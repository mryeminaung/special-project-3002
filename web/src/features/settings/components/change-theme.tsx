import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useTheme } from "@/hooks/use-theme";
import { IconMoon, IconSun } from "@tabler/icons-react";

export default function ChangeTheme() {
	const { theme, toggleTheme } = useTheme();

	return (
		<Card className="py-5">
			<CardHeader>
				<CardTitle>Appearance</CardTitle>
				<CardDescription>Customize how the app looks</CardDescription>
			</CardHeader>

			<CardContent>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					<div>
						<p className="text-sm font-medium">Theme</p>
						<p className="text-sm text-muted-foreground">Light or dark mode</p>
					</div>

					<div className="flex items-center gap-3">
						<Button
							variant="outline"
							onClick={toggleTheme}
							className="gap-2">
							{theme === "dark" ? (
								<>
									<IconSun size={16} />
									Light mode
								</>
							) : (
								<>
									<IconMoon size={16} />
									Dark mode
								</>
							)}
						</Button>

						<span className="text-sm text-muted-foreground">
							Current: <strong>{theme}</strong>
						</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
