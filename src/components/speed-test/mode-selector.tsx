"use client";

import React from "react";
import { ConnectionMode } from "@/types/speed-test";
import { Layers, Radio } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface ModeSelectorProps {
  mode: ConnectionMode;
  onModeChange: (mode: ConnectionMode) => void;
  disabled?: boolean;
}

function ModeSelectorComponent({
  mode,
  onModeChange,
  disabled = false,
}: ModeSelectorProps) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center gap-1.5 my-2">
      <div
        className={`inline-flex items-center p-1 rounded-full bg-muted/60 dark:bg-zinc-900/60 border border-black/[0.06] dark:border-white/[0.08] shadow-2xs backdrop-blur-md ${
          disabled ? "opacity-60 pointer-events-none" : ""
        }`}
      >
        <button
          type="button"
          onClick={() => onModeChange("multi")}
          className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            mode === "multi"
              ? "bg-[#800020] text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
          title={t("multi_desc")}
        >
          <Layers className="size-3.5" />
          <span>{t("multi_mode")}</span>
        </button>

        <button
          type="button"
          onClick={() => onModeChange("single")}
          className={`flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold transition-all cursor-pointer ${
            mode === "single"
              ? "bg-[#800020] text-white shadow-xs"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
          }`}
          title={t("single_desc")}
        >
          <Radio className="size-3.5" />
          <span>{t("single_mode")}</span>
        </button>
      </div>

      <span className="text-[11px] text-muted-foreground/80 tracking-tight">
        {mode === "multi" ? t("multi_desc") : t("single_desc")}
      </span>
    </div>
  );
}

export const ModeSelector = React.memo(ModeSelectorComponent);