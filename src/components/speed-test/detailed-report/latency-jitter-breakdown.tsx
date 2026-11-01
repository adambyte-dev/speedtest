"use client";

import { Activity, Clock } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface LatencyJitterBreakdownProps {
  unloadedLatency: number | null;
  downloadLatency: number | null;
  uploadLatency: number | null;
  unloadedJitter: number | null;
  downloadJitter: number | null;
  uploadJitter: number | null;
  unloadedSamples?: number;
  downloadSamples?: number;
  uploadSamples?: number;
}

export function LatencyJitterBreakdown({
  unloadedLatency,
  downloadLatency,
  uploadLatency,
  unloadedJitter,
  downloadJitter,
  uploadJitter,
  unloadedSamples = 0,
  downloadSamples = 0,
  uploadSamples = 0,
}: LatencyJitterBreakdownProps) {
  const { t } = useLanguage();
  const maxMs = 40;
  const getPercent = (val: number | null) => (val ? Math.min((val / maxMs) * 100, 100) : 0);

  return (
    <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400">
          <Activity className="size-4" />
        </div>
        <div>
          <h3 className="font-bold text-sm tracking-tight text-foreground">
            {t("latency_breakdown_title")}
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("latency_breakdown_desc")}
          </p>
        </div>
      </div>

      {/* Latency & Jitter Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {/* Latency Summary Box */}
        <div className="p-4 rounded-xl bg-background/80 dark:bg-zinc-900/60 border border-border/50">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            <span>{t("ping")}</span>
            <Clock className="size-3.5 text-rose-700 dark:text-rose-400" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/40">
              <span className="text-[10px] text-muted-foreground block font-medium">Unloaded</span>
              <span className="font-mono font-bold text-lg text-foreground">
                {unloadedLatency !== null ? unloadedLatency : "--"}
              </span>
              <span className="text-[10px] text-muted-foreground block">ms</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40">
              <span className="text-[10px] text-muted-foreground block font-medium">{t("during_download")}</span>
              <span className="font-mono font-bold text-lg text-foreground">
                {downloadLatency !== null ? downloadLatency : "--"}
              </span>
              <span className="text-[10px] text-muted-foreground block">ms</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40">
              <span className="text-[10px] text-muted-foreground block font-medium">{t("during_upload")}</span>
              <span className="font-mono font-bold text-lg text-foreground">
                {uploadLatency !== null ? uploadLatency : "--"}
              </span>
              <span className="text-[10px] text-muted-foreground block">ms</span>
            </div>
          </div>
        </div>

        {/* Jitter Summary Box */}
        <div className="p-4 rounded-xl bg-background/80 dark:bg-zinc-900/60 border border-border/50">
          <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
            <span>{t("jitter_variance")}</span>
            <Activity className="size-3.5 text-rose-700 dark:text-rose-400" />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-muted/40">
              <span className="text-[10px] text-muted-foreground block font-medium">Unloaded</span>
              <span className="font-mono font-bold text-lg text-foreground">
                {unloadedJitter !== null ? unloadedJitter : "--"}
              </span>
              <span className="text-[10px] text-muted-foreground block">ms</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40">
              <span className="text-[10px] text-muted-foreground block font-medium">{t("during_download")}</span>
              <span className="font-mono font-bold text-lg text-foreground">
                {downloadJitter !== null ? downloadJitter : "--"}
              </span>
              <span className="text-[10px] text-muted-foreground block">ms</span>
            </div>
            <div className="p-2 rounded-lg bg-muted/40">
              <span className="text-[10px] text-muted-foreground block font-medium">{t("during_upload")}</span>
              <span className="font-mono font-bold text-lg text-foreground">
                {uploadJitter !== null ? uploadJitter : "--"}
              </span>
              <span className="text-[10px] text-muted-foreground block">ms</span>
            </div>
          </div>
        </div>
      </div>

      {/* Latency Measurement Distributions */}
      <div className="space-y-4 pt-2">
        <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
          {t("latency_distribution")}
        </h4>

        {/* 1. Unloaded Latency */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              {t("ping")} Unloaded ({unloadedSamples} {t("samples")})
            </span>
            <span className="font-mono font-bold text-[#800020] dark:text-rose-400">
              {unloadedLatency !== null ? `${unloadedLatency} ms` : "--"}
            </span>
          </div>
          <div className="relative w-full h-4 rounded-full bg-muted/60 dark:bg-zinc-800/60 overflow-hidden">
            <div
              style={{ width: `${getPercent(unloadedLatency)}%` }}
              className="h-full rounded-full bg-gradient-to-r from-emerald-400 to-teal-500 transition-all duration-700"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>0 ms</span>
            <span>20 ms</span>
            <span>40+ ms</span>
          </div>
        </div>

        {/* 2. Latency during download */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              {t("during_download")} ({downloadSamples} {t("samples")})
            </span>
            <span className="font-mono font-bold text-[#800020] dark:text-rose-400">
              {downloadLatency !== null ? `${downloadLatency} ms` : "--"}
            </span>
          </div>
          <div className="relative w-full h-4 rounded-full bg-muted/60 dark:bg-zinc-800/60 overflow-hidden">
            <div
              style={{ width: `${getPercent(downloadLatency)}%` }}
              className="h-full rounded-full bg-gradient-to-r from-rose-400 via-rose-600 to-[#800020] transition-all duration-700"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>0 ms</span>
            <span>20 ms</span>
            <span>40+ ms</span>
          </div>
        </div>

        {/* 3. Latency during upload */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-foreground">
              {t("during_upload")} ({uploadSamples} {t("samples")})
            </span>
            <span className="font-mono font-bold text-[#800020] dark:text-rose-400">
              {uploadLatency !== null ? `${uploadLatency} ms` : "--"}
            </span>
          </div>
          <div className="relative w-full h-4 rounded-full bg-muted/60 dark:bg-zinc-800/60 overflow-hidden">
            <div
              style={{ width: `${getPercent(uploadLatency)}%` }}
              className="h-full rounded-full bg-gradient-to-r from-red-400 via-red-700 to-[#4C0519] transition-all duration-700"
            />
          </div>
          <div className="flex justify-between text-[10px] font-mono text-muted-foreground">
            <span>0 ms</span>
            <span>20 ms</span>
            <span>40+ ms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
