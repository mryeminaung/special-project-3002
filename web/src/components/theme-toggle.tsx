import { useTheme } from "@/hooks/use-theme";
import { Button } from "@/components/ui/button";
import { IconMoon, IconSun } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
  variant?: "default" | "floating";
}

export function ThemeToggle({ className, variant = "default" }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();

  const baseStyles = variant === "floating"
    ? "absolute top-5 right-5 h-10 w-10 rounded-full bg-white/90 dark:bg-neutral-900/90 backdrop-blur-sm hover:bg-white dark:hover:bg-neutral-800 shadow-lg"
    : "h-9 w-9 rounded-md";

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className={cn(baseStyles, className)}
      aria-label="Toggle theme">
      {theme === "dark" ? (
        <IconSun className="h-5 w-5" />
      ) : (
        <IconMoon className="h-5 w-5" />
      )}
    </Button>
  );
}

