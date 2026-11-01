"use client";

import { ThemeToggle } from "@/components/theme-toggle";

interface NavbarProps {
  onOpenServers: () => void;
  onOpenResults: () => void;
  onOpenAbout: () => void;
}

export function Navbar({ onOpenServers, onOpenResults, onOpenAbout }: NavbarProps) {
  return (
    <header className="w-full max-w-5xl mx-auto px-4 sm:px-8 pt-7 pb-4 flex items-center justify-between">
      {/* Minimalist Logo */}
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="size-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-violet-600 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-200">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="3.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-4.5"
          >
            <path d="M6 18V6h6a4 4 0 0 1 0 8H6" />
          </svg>
        </div>
        <span className="font-bold text-xl tracking-tight text-foreground/90 group-hover:text-foreground transition-colors">
          Pingly
        </span>
      </div>

      {/* Minimalist Segmented Pill Navigation */}
      <nav
        aria-label="Navigasi Utama"
        className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-background/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-xs"
      >
        <button
          type="button"
          className="px-5 py-1.5 text-xs font-semibold rounded-full bg-[#5850EC] text-white shadow-xs transition-all cursor-pointer"
        >
          Speed Test
        </button>
        <button
          type="button"
          onClick={onOpenServers}
          className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
        >
          Servers
        </button>
        <button
          type="button"
          onClick={onOpenResults}
          className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
        >
          Results
        </button>
        <button
          type="button"
          onClick={onOpenAbout}
          className="px-4 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/50 transition-colors cursor-pointer"
        >
          About
        </button>
      </nav>

      {/* Right Actions: Mobile Links & Theme Switcher */}
      <div className="flex items-center gap-2">
        <div className="sm:hidden flex items-center gap-1">
          <button
            type="button"
            onClick={onOpenServers}
            className="text-xs px-2.5 py-1 font-medium text-muted-foreground hover:text-foreground"
          >
            Servers
          </button>
          <button
            type="button"
            onClick={onOpenResults}
            className="text-xs px-2.5 py-1 font-medium text-muted-foreground hover:text-foreground"
          >
            Results
          </button>
        </div>
        <ThemeToggle />
      </div>
    </header>
  );
}
