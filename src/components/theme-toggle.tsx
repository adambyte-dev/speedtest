"use client";

import { useTheme } from "@/hooks/use-theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label="Toggle dark mode"
      className="relative size-10 rounded-full border border-border/60 bg-background/80 backdrop-blur-xs flex items-center justify-center text-foreground hover:bg-muted/60 transition-colors shadow-2xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring cursor-pointer"
    >
      {theme === "dark" ? (
        <Sun className="size-4.5 text-amber-400 transition-transform hover:rotate-45" />
      ) : (
        <Moon className="size-4.5 text-slate-700 transition-transform hover:-rotate-12" />
      )}
    </button>
  );
}
