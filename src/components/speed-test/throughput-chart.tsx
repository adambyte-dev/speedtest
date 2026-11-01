"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDown, ArrowUp, TrendingUp, Zap, Activity } from "lucide-react";
import { SpeedTestMetrics, TestPhase } from "@/types/speed-test";
import { useLanguage } from "@/context/language-context";

interface ThroughputChartProps {
  phase: TestPhase;
  currentSpeed: number;
  metrics: SpeedTestMetrics;
}

function ThroughputChartComponent({
  phase,
  currentSpeed,
  metrics,
}: ThroughputChartProps) {
  const { t } = useLanguage();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      setMounted(true);
    });
    return () => cancelAnimationFrame(raf);
  }, []);

  const download = metrics.download;
  const upload = metrics.upload;
  const ping = metrics.ping;
  const chartPoints = metrics.chartPoints;

  const isTesting = phase === "ping" || phase === "download" || phase === "upload";
  const hasRecordedPoints = Boolean(chartPoints && chartPoints.length > 0);
  const hasData = isTesting || (download !== null && download > 0) || hasRecordedPoints;

  // 100% Genuine Chart Points: Decoupled from currentSpeed to avoid recreating SVG paths on every frame
  const chartData = useMemo(() => {
    if (chartPoints && chartPoints.length > 0) {
      return chartPoints;
    }

    if (isTesting) {
      return [
        {
          time: "0.0s",
          download: 0,
          upload: 0,
          latency: ping || 0,
        },
      ];
    }

    return [];
  }, [chartPoints, isTesting, ping]);

  return (
    <div className="w-full min-w-0 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl p-3.5 sm:p-4 shadow-xs flex flex-col justify-between select-none outline-none focus:outline-none focus-visible:outline-none">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-1.5 min-w-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-1 rounded-md bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 shrink-0">
            <TrendingUp className="size-3.5" />
          </div>
          <div className="min-w-0">
            <h3 className="font-bold text-xs sm:text-sm tracking-tight text-foreground truncate">
              {t("chart_title")}
            </h3>
            <p className="text-[10px] text-muted-foreground truncate">
              {t("chart_subtitle")}
            </p>
          </div>
        </div>

        {/* Live Peak / Telemetry Badge */}
        <div className="self-start sm:self-auto shrink-0 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 rounded-full bg-rose-50 dark:bg-rose-950/60 border border-rose-200/50 dark:border-rose-900/40 text-[10px] sm:text-[11px] font-semibold text-rose-900 dark:text-rose-200 font-mono">
            <span
              className={`size-1.5 rounded-full ${
                isTesting
                  ? "bg-[#800020] animate-pulse"
                  : hasRecordedPoints
                  ? "bg-emerald-500"
                  : "bg-muted-foreground/40"
              }`}
            />
            {isTesting
              ? `${currentSpeed.toFixed(1)} Mbps`
              : download !== null
              ? `${t("peak")}: ${download.toFixed(1)} Mbps`
              : t("waiting_test")}
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full min-w-0 h-[175px] sm:h-[195px] my-1 outline-none focus:outline-none [&_*]:outline-none [&_*]:focus:outline-none [&_*]:focus:ring-0 [&_*]:focus-visible:outline-none">
        {hasData && chartData.length > 0 && mounted ? (
          <ResponsiveContainer width="100%" height={180} minWidth={100} minHeight={160}>
            <AreaChart
              data={chartData}
              margin={{ top: 8, right: 8, left: -24, bottom: 0 }}
              style={{ outline: "none" }}
            >
              <defs>
                <linearGradient id="maroonDownloadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#800020" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#800020" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="crimsonUploadGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#BE123C" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#BE123C" stopOpacity={0.0} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" opacity={0.12} vertical={false} />
              <XAxis
                dataKey="time"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "currentColor" }}
                className="text-muted-foreground font-mono"
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10, fill: "currentColor" }}
                className="text-muted-foreground font-mono"
                unit="M"
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const downPoint = payload.find((p) => p.dataKey === "download")?.value;
                    const upPoint = payload.find((p) => p.dataKey === "upload")?.value;
                    const latPoint = payload.find((p) => p.dataKey === "latency")?.value;

                    return (
                      <div className="bg-popover/95 backdrop-blur-md border border-border/80 p-2 rounded-lg shadow-lg text-[11px] font-sans space-y-0.5 outline-none pointer-events-none">
                        <div className="font-semibold text-foreground border-b border-border/50 pb-0.5">
                          Telemetri: {label}
                        </div>
                        {downPoint !== undefined && (
                          <div className="flex items-center gap-1.5 text-rose-800 dark:text-rose-300 font-mono font-medium">
                            <span className="size-1.5 rounded-full bg-[#800020]" />
                            <span>{t("download")}: {downPoint} Mbps</span>
                          </div>
                        )}
                        {upPoint !== undefined && (
                          <div className="flex items-center gap-1.5 text-red-700 dark:text-red-400 font-mono font-medium">
                            <span className="size-1.5 rounded-full bg-[#BE123C]" />
                            <span>{t("upload")}: {upPoint} Mbps</span>
                          </div>
                        )}
                        {latPoint !== undefined && (
                          <div className="flex items-center gap-1.5 text-muted-foreground font-mono text-[10px]">
                            <span className="size-1.5 rounded-full bg-slate-400" />
                            <span>{t("ping")}: {latPoint} ms</span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="download"
                name={t("download")}
                stroke="#800020"
                strokeWidth={2.2}
                fillOpacity={1}
                fill="url(#maroonDownloadGrad)"
                isAnimationActive={false}
              />
              <Area
                type="monotone"
                dataKey="upload"
                name={t("upload")}
                stroke="#BE123C"
                strokeWidth={1.8}
                fillOpacity={1}
                fill="url(#crimsonUploadGrad)"
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-muted/20 text-center p-4">
            <Activity className="size-6 text-muted-foreground/40 mb-1.5" />
            <span className="text-xs font-semibold text-foreground">{t("waiting_test")}</span>
            <span className="text-[11px] text-muted-foreground mt-0.5 max-w-xs">
              Klik &quot;{t("start_test")}&quot; untuk merekam grafik kurva bandwidth murni secara real-time.
            </span>
          </div>
        )}
      </div>

      {/* Compact Bottom Stat Strip */}
      <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-2 border-t border-border/40 text-center">
        <div className="p-1 sm:p-1.5 rounded-md bg-muted/40 flex items-center justify-center gap-1 sm:gap-1.5 min-w-0">
          <ArrowDown className="size-3 text-rose-700 dark:text-rose-400 shrink-0" />
          <div className="text-left min-w-0">
            <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-semibold block leading-tight truncate">
              {t("max_down")}
            </span>
            <span className="font-mono font-bold text-[11px] sm:text-xs text-foreground truncate block">
              {download !== null ? `${download.toFixed(1)}M` : "--"}
            </span>
          </div>
        </div>

        <div className="p-1 sm:p-1.5 rounded-md bg-muted/40 flex items-center justify-center gap-1 sm:gap-1.5 min-w-0">
          <ArrowUp className="size-3 text-rose-700 dark:text-rose-400 shrink-0" />
          <div className="text-left min-w-0">
            <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-semibold block leading-tight truncate">
              {t("max_up")}
            </span>
            <span className="font-mono font-bold text-[11px] sm:text-xs text-foreground truncate block">
              {upload !== null ? `${upload.toFixed(1)}M` : "--"}
            </span>
          </div>
        </div>

        <div className="p-1 sm:p-1.5 rounded-md bg-muted/40 flex items-center justify-center gap-1 sm:gap-1.5 min-w-0">
          <Zap className="size-3 text-rose-700 dark:text-rose-400 shrink-0" />
          <div className="text-left min-w-0">
            <span className="text-[8px] sm:text-[9px] text-muted-foreground uppercase font-semibold block leading-tight truncate">
              {t("avg_ping")}
            </span>
            <span className="font-mono font-bold text-[11px] sm:text-xs text-foreground truncate block">
              {ping !== null ? `${ping.toFixed(1)}ms` : "--"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ThroughputChart = React.memo(ThroughputChartComponent);