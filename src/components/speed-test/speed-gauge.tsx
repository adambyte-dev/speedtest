"use client";

import React, { useMemo } from "react";
import { TestPhase } from "@/types/speed-test";
import { Play, RotateCcw, Share2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface SpeedGaugeProps {
  phase: TestPhase;
  currentSpeed: number;
  progress: number; // 0 to 100
  onStart: () => void;
  onCancel: () => void;
  onShare?: () => void;
}

// Compact Modern Gauge Geometry (Precomputed Constants for 60fps Zero-Overhead Renders)
const TOTAL_TICKS = 42;
const GAUGE_SIZE = 280;
const GAUGE_CENTER = GAUGE_SIZE / 2;
const GAUGE_RADIUS = 112;
const START_ANGLE = 135;
const SWEEP_ANGLE = 270;
const round2 = (num: number) => Math.round(num * 100) / 100;

// Precompute static geometry for ticks once at module load
const STATIC_TICKS = Array.from({ length: TOTAL_TICKS + 1 }, (_, i) => {
  const angle = START_ANGLE + (i / TOTAL_TICKS) * SWEEP_ANGLE;
  const rad = (angle * Math.PI) / 180;
  const isMajor = i % 6 === 0;
  const tickLength = isMajor ? 9 : 4.5;
  const outerR = GAUGE_RADIUS + 12;
  const innerR = outerR - tickLength;

  return {
    id: i,
    x1: round2(GAUGE_CENTER + innerR * Math.cos(rad)),
    y1: round2(GAUGE_CENTER + innerR * Math.sin(rad)),
    x2: round2(GAUGE_CENTER + outerR * Math.cos(rad)),
    y2: round2(GAUGE_CENTER + outerR * Math.sin(rad)),
    isMajor,
    progressThreshold: (i / TOTAL_TICKS) * 100,
  };
});

// Arc path calculation constants
const startRad = (START_ANGLE * Math.PI) / 180;
const endRad = ((START_ANGLE + SWEEP_ANGLE) * Math.PI) / 180;
const startX = round2(GAUGE_CENTER + GAUGE_RADIUS * Math.cos(startRad));
const startY = round2(GAUGE_CENTER + GAUGE_RADIUS * Math.sin(startRad));
const endX = round2(GAUGE_CENTER + GAUGE_RADIUS * Math.cos(endRad));
const endY = round2(GAUGE_CENTER + GAUGE_RADIUS * Math.sin(endRad));
const ARC_PATH = `M ${startX} ${startY} A ${GAUGE_RADIUS} ${GAUGE_RADIUS} 0 1 1 ${endX} ${endY}`;
const ARC_LENGTH = (SWEEP_ANGLE / 360) * 2 * Math.PI * GAUGE_RADIUS;

function SpeedGaugeComponent({
  phase,
  currentSpeed,
  progress,
  onStart,
  onCancel,
  onShare,
}: SpeedGaugeProps) {
  const { t } = useLanguage();
  const isRunning = phase === "ping" || phase === "download" || phase === "upload";
  const isCompleted = phase === "completed";
  const isIdle = phase === "idle";

  const dashOffset = ARC_LENGTH * (1 - Math.min(progress, 100) / 100);

  // Status subtitle
  const phaseLabel = useMemo(() => {
    switch (phase) {
      case "ping":
        return t("testing_ping");
      case "download":
        return t("testing_download");
      case "upload":
        return t("testing_upload");
      case "completed":
        return t("test_completed");
      default:
        return t("start_test");
    }
  }, [phase, t]);

  return (
    <div className="relative flex flex-col items-center justify-center my-1 sm:my-2 select-none w-full max-w-[280px]">
      <div className="relative size-[235px] xs:size-[255px] sm:size-[275px] flex items-center justify-center">
        {/* Modern Minimalist SVG Dial (Maroon Theme) */}
        <svg
          viewBox={`0 0 ${GAUGE_SIZE} ${GAUGE_SIZE}`}
          className="absolute inset-0 size-full pointer-events-none"
          suppressHydrationWarning
        >
          <defs>
            <linearGradient id="maroonArcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB7185" />
              <stop offset="50%" stopColor="#E11D48" />
              <stop offset="100%" stopColor="#800020" />
            </linearGradient>

            <filter id="maroonGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#800020" floodOpacity="0.5" />
            </filter>
          </defs>

          {/* Background Outer Arc Track */}
          <path
            d={ARC_PATH}
            fill="none"
            stroke="currentColor"
            className="text-rose-100/70 dark:text-zinc-800/80 transition-colors"
            strokeWidth="7"
            strokeLinecap="round"
          />

          {/* Minimalist Radial Ticks */}
          {STATIC_TICKS.map((tItem) => {
            const isActive = (isRunning || isCompleted) && tItem.progressThreshold <= progress;
            return (
              <line
                key={tItem.id}
                x1={tItem.x1}
                y1={tItem.y1}
                x2={tItem.x2}
                y2={tItem.y2}
                stroke="currentColor"
                className={`transition-colors duration-150 ${
                  isActive
                    ? "text-[#800020] dark:text-rose-400 stroke-2"
                    : tItem.isMajor
                    ? "text-slate-400/90 dark:text-slate-600 stroke-[1.4]"
                    : "text-slate-300/60 dark:text-slate-800 stroke-1"
                }`}
                strokeLinecap="round"
              />
            );
          })}

          {/* Active Gradient Arc with Glow */}
          {(isRunning || isCompleted) && (
            <path
              d={ARC_PATH}
              fill="none"
              stroke="url(#maroonArcGradient)"
              strokeWidth="7.5"
              strokeLinecap="round"
              strokeDasharray={ARC_LENGTH}
              strokeDashoffset={dashOffset}
              filter="url(#maroonGlow)"
              className="transition-[stroke-dashoffset] duration-75 ease-out"
            />
          )}
        </svg>

        {/* Center Frosted Minimalist Disc */}
        <div className="relative size-[165px] xs:size-[180px] sm:size-[195px] rounded-full bg-white/85 dark:bg-zinc-900/85 backdrop-blur-xl border border-black/[0.06] dark:border-white/[0.08] shadow-lg shadow-rose-950/[0.06] flex flex-col items-center justify-center text-center p-2.5 sm:p-3 z-10 transition-all">
          {isIdle && (
            <button
              type="button"
              onClick={onStart}
              aria-label={t("start_test")}
              className="group flex flex-col items-center justify-center size-full rounded-full cursor-pointer transition-transform duration-300 hover:scale-105 active:scale-95"
            >
              {/* Play Button Icon with Soft Maroon Ring */}
              <div className="size-12 xs:size-13 sm:size-14 rounded-full bg-rose-50 dark:bg-rose-950/60 flex items-center justify-center text-[#800020] dark:text-rose-400 group-hover:bg-[#800020] group-hover:text-white transition-all duration-300 shadow-sm group-hover:shadow-rose-900/30">
                <Play className="size-5 xs:size-6 sm:size-7 fill-current translate-x-0.5" />
              </div>
              <span className="mt-2 font-bold text-xs xs:text-sm sm:text-base text-foreground tracking-tight group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors">
                {t("start_test")}
              </span>
            </button>
          )}

          {isRunning && (
            <div className="flex flex-col items-center justify-center w-full px-1">
              <div className="font-mono tabular-nums font-extrabold text-foreground tracking-tight flex items-baseline justify-center">
                <span className="text-2xl xs:text-3xl sm:text-4xl">{currentSpeed.toFixed(1)}</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mt-0.5">
                {phase === "ping" ? "ms" : "Mbps"}
              </span>

              <div className="mt-1.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 text-[9px] xs:text-[10px] font-medium animate-pulse max-w-full truncate">
                <span className="size-1.5 rounded-full bg-[#800020] dark:bg-rose-400 shrink-0" />
                <span className="truncate">{phaseLabel}</span>
              </div>

              <button
                type="button"
                onClick={onCancel}
                className="mt-1 text-[10px] text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
              >
                {t("cancel")}
              </button>
            </div>
          )}

          {isCompleted && (
            <div className="flex flex-col items-center justify-center w-full animate-in fade-in zoom-in-95 duration-200">
              <span className="text-[10px] font-medium text-muted-foreground">{t("download")}</span>
              <div className="font-mono tabular-nums font-extrabold text-foreground tracking-tight flex items-baseline justify-center">
                <span className="text-2xl xs:text-3xl sm:text-4xl">{currentSpeed.toFixed(1)}</span>
              </div>
              <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Mbps
              </span>

              <div className="mt-2 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={onStart}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#800020] hover:bg-[#68001a] text-white text-[10px] xs:text-[11px] font-semibold shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <RotateCcw className="size-3" />
                  {t("test_again")}
                </button>
                {onShare && (
                  <button
                    type="button"
                    onClick={onShare}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 dark:hover:bg-rose-900/40 text-[#800020] dark:text-rose-300 text-[10px] xs:text-[11px] font-semibold transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    title={t("share_results")}
                  >
                    <Share2 className="size-3" />
                    <span>{t("share_results")}</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export const SpeedGauge = React.memo(SpeedGaugeComponent);