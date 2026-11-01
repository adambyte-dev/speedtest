"use client";

import { ReactNode } from "react";
import { cn } from "cn";

interface MetricCardProps {
  icon: ReactNode;
  label: string;
  value: number | null;
  unit: string;
  isActive?: boolean;
}

export function MetricCard({
  icon,
  label,
  value,
  unit,
  isActive = false,
}: MetricCardProps) {
  return (
    <div
      className={cn(
        "relative flex items-center gap-1.5 xs:gap-2 sm:gap-2.5 px-2 xs:px-2.5 sm:px-3 py-2 sm:py-2.5 rounded-xl bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.08] shadow-xs transition-all duration-300 min-w-0",
        isActive
          ? "ring-1.5 ring-[#800020] dark:ring-rose-400 bg-rose-50/50 dark:bg-rose-950/20 shadow-md shadow-rose-950/10 scale-[1.02]"
          : "hover:border-black/[0.1] dark:hover:border-white/[0.15]"
      )}
    >
      {/* Icon Badge */}
      <div
        className={cn(
          "size-7 xs:size-8 sm:size-8.5 rounded-lg flex items-center justify-center shrink-0 transition-colors",
          isActive
            ? "bg-[#800020] text-white shadow-xs"
            : "bg-rose-100/70 dark:bg-rose-950/50 text-[#800020] dark:text-rose-400"
        )}
      >
        {icon}
      </div>

      {/* Metric details */}
      <div className="flex flex-col min-w-0">
        <span className="text-[9px] xs:text-[10px] font-semibold text-muted-foreground uppercase tracking-tight truncate">
          {label}
        </span>
        <div className="flex items-baseline gap-0.5 xs:gap-1 mt-0.5">
          <span className="font-mono tabular-nums text-sm xs:text-base sm:text-lg font-bold tracking-tight text-foreground truncate">
            {value !== null
              ? label === "Ping"
                ? value.toFixed(value < 10 ? 1 : 0)
                : value.toFixed(1)
              : "--"}
          </span>
          <span className="text-[9px] xs:text-[10px] font-medium text-muted-foreground shrink-0">
            {unit}
          </span>
        </div>
      </div>
    </div>
  );
}
