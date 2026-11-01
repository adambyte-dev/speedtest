"use client";

import { useState, useRef, useEffect } from "react";
import { useLanguage } from "@/context/language-context";
import { Check, Globe2 } from "lucide-react";
import { FlagIcon } from "./flag-icon";

export function LanguageToggle() {
  const { lang, setLang, languages, currentLanguageOption } = useLanguage();
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Pilih Bahasa / Select Language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-full border border-border/70 bg-card/60 dark:bg-zinc-900/50 backdrop-blur-md hover:bg-muted text-xs font-semibold text-foreground transition-all cursor-pointer shadow-2xs"
      >
        <Globe2 className="size-3.5 text-muted-foreground" />

        {/* Desktop: Crisp SVG Flag + ID tag (NO EMOJI) */}
        <div className="hidden sm:flex items-center gap-1.5">
          <FlagIcon code={currentLanguageOption.code} />
          <span className="font-mono text-[11px] font-bold uppercase tracking-wider">
            {currentLanguageOption.code}
          </span>
        </div>

        {/* Mobile/HP: Native OS Emoji */}
        <div className="flex sm:hidden items-center gap-1">
          <span className="text-xs">{currentLanguageOption.flag}</span>
          <span className="font-mono text-[11px] uppercase font-bold">
            {currentLanguageOption.code}
          </span>
        </div>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-48 rounded-xl border border-border/70 bg-popover/95 backdrop-blur-md shadow-lg p-1.5 z-50 animate-in fade-in zoom-in-95 text-xs">
          <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40 mb-1 flex items-center justify-between">
            <span>Bahasa / Language</span>
            <span className="text-[9px] font-mono opacity-70">i18n</span>
          </div>
          <div className="space-y-0.5">
            {languages.map((item) => {
              const isSelected = item.code === lang;
              return (
                <button
                  key={item.code}
                  type="button"
                  onClick={() => {
                    setLang(item.code);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-left transition-colors cursor-pointer ${
                    isSelected
                      ? "bg-rose-50 dark:bg-rose-950/50 text-[#800020] dark:text-rose-200 font-semibold"
                      : "hover:bg-muted text-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {/* Desktop: Crisp SVG Flag (NO EMOJI) */}
                    <div className="hidden sm:block shrink-0">
                      <FlagIcon code={item.code} />
                    </div>

                    {/* Mobile/HP: Native OS Emoji */}
                    <span className="text-sm sm:hidden shrink-0">{item.flag}</span>

                    <span className="truncate">{item.label}</span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 ml-1">
                    {/* Desktop Country ID Badge */}
                    <span className="hidden sm:inline-block px-1.5 py-0.2 rounded text-[10px] font-mono font-bold uppercase bg-muted text-muted-foreground">
                      {item.code}
                    </span>
                    {isSelected && <Check className="size-3 text-[#800020] dark:text-rose-400" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
