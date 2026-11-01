"use client";

import { CheckCircle2, Film, Gamepad2, Video, ShieldCheck, AlertCircle } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface PerformanceScoresProps {
  ping: number | null;
  jitter: number | null;
  download: number | null;
  packetLoss: number | null;
}

export function PerformanceScores({
  ping,
  jitter,
  download,
  packetLoss,
}: PerformanceScoresProps) {
  const { t } = useLanguage();
  const hasData = ping !== null || download !== null;

  // Real multi-tier evaluation with dynamic translations
  const getGamingTier = (): { label: string; desc: string; isOptimal: boolean } => {
    if (!hasData || ping === null) return { label: "--", desc: t("tier_untested"), isOptimal: false };
    const j = jitter ?? 2;
    if (ping < 30 && j < 6) return { label: t("tier_excellent"), desc: t("gaming_desc_excellent"), isOptimal: true };
    if (ping < 60 && j < 15) return { label: t("tier_good"), desc: t("gaming_desc_good"), isOptimal: true };
    if (ping < 120) return { label: t("tier_fair"), desc: t("gaming_desc_fair"), isOptimal: false };
    return { label: t("tier_poor"), desc: t("gaming_desc_poor"), isOptimal: false };
  };

  const getVideoTier = (): { label: string; desc: string; isOptimal: boolean } => {
    if (!hasData || download === null) return { label: "--", desc: t("tier_untested"), isOptimal: false };
    const p = ping ?? 20;
    if (download >= 25 && p < 60) return { label: t("tier_excellent"), desc: t("video_desc_excellent"), isOptimal: true };
    if (download >= 8 && p < 120) return { label: t("tier_good"), desc: t("video_desc_good"), isOptimal: true };
    if (download >= 3) return { label: t("tier_fair"), desc: t("video_desc_fair"), isOptimal: false };
    return { label: t("tier_poor"), desc: t("video_desc_poor"), isOptimal: false };
  };

  const getStreamingTier = (): { label: string; desc: string; isOptimal: boolean } => {
    if (!hasData || download === null) return { label: "--", desc: t("tier_untested"), isOptimal: false };
    if (download >= 35) return { label: t("tier_excellent"), desc: t("stream_desc_excellent"), isOptimal: true };
    if (download >= 15) return { label: t("tier_good"), desc: t("stream_desc_good"), isOptimal: true };
    if (download >= 5) return { label: t("tier_fair"), desc: t("stream_desc_fair"), isOptimal: false };
    return { label: t("tier_poor"), desc: t("stream_desc_poor"), isOptimal: false };
  };

  const gaming = getGamingTier();
  const video = getVideoTier();
  const streaming = getStreamingTier();

  const packetLossText =
    packetLoss !== null
      ? packetLoss === 0
        ? t("packet_loss_optimal")
        : `${packetLoss.toFixed(1)}% · ${packetLoss <= 1 ? t("packet_loss_good") : t("packet_loss_warning")}`
      : "--";

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
      {/* Gaming Score */}
      <div className="p-4 rounded-xl border border-black/[0.05] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0">
            <Gamepad2 className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("gaming_online")}
            </div>
            <div className="font-bold text-base text-foreground flex items-center gap-1.5 mt-0.5">
              <span>{gaming.label}</span>
              {hasData && (
                gaming.isOptimal ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="size-4 text-amber-500" />
                )
              )}
            </div>
            <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
              {gaming.desc}
            </span>
          </div>
        </div>
      </div>

      {/* Video Calls Score */}
      <div className="p-4 rounded-xl border border-black/[0.05] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0">
            <Video className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("video_calls")}
            </div>
            <div className="font-bold text-base text-foreground flex items-center gap-1.5 mt-0.5">
              <span>{video.label}</span>
              {hasData && (
                video.isOptimal ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="size-4 text-amber-500" />
                )
              )}
            </div>
            <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
              {video.desc}
            </span>
          </div>
        </div>
      </div>

      {/* Streaming Score */}
      <div className="p-4 rounded-xl border border-black/[0.05] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0">
            <Film className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("streaming_4k")}
            </div>
            <div className="font-bold text-base text-foreground flex items-center gap-1.5 mt-0.5">
              <span>{streaming.label}</span>
              {hasData && (
                streaming.isOptimal ? (
                  <CheckCircle2 className="size-4 text-emerald-500" />
                ) : (
                  <AlertCircle className="size-4 text-amber-500" />
                )
              )}
            </div>
            <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
              {streaming.desc}
            </span>
          </div>
        </div>
      </div>

      {/* Packet Loss Score */}
      <div className="p-4 rounded-xl border border-black/[0.05] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="size-10 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="size-5" />
          </div>
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {t("packet_loss")}
            </div>
            <div className="font-bold text-base text-foreground flex items-center gap-1.5 mt-0.5">
              <span>{packetLossText}</span>
              {packetLoss !== null && <CheckCircle2 className="size-4 text-emerald-500" />}
            </div>
            <span className="text-[10px] text-muted-foreground block leading-tight mt-0.5">
              {packetLoss !== null ? t("packet_loss_desc") : t("tier_untested")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
