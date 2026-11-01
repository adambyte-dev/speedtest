"use client";

import { useMemo } from "react";
import { Megaphone, Sparkles, ExternalLink, Zap } from "lucide-react";

export const AD_LINKS = [
  "https://auctionr.org/4/f3242efae567eaecbda49c13b8cf7463",
  "https://auctionr.org/4/00ee9b2da80dfd428b9527192dbafe4b",
] as const;

export function getAdUrl(slotId?: string, overrideHref?: string): string {
  if (overrideHref) return overrideHref;
  if (!slotId) return AD_LINKS[0];
  let sum = 0;
  for (let i = 0; i < slotId.length; i++) {
    sum += slotId.charCodeAt(i);
  }
  return AD_LINKS[sum % AD_LINKS.length];
}

const DEFAULT_HEADLINES = [
  "🚀 Promo Server Cloud VPS & Hosting Super Cepat",
  "⚡ Akselerator Jaringan & Proteksi Koneksi Aman",
  "🛡️ Solusi DNS Berkecepatan Tinggi & Anti DDoS",
  "🌐 Penawaran Spesial Bandwidth Unlimited & Internet Cepat",
];

const DEFAULT_SUBTITLES = [
  "Dapatkan penawaran eksklusif dan diskon spesial dari mitra resmi jaringan kami.",
  "Tingkatkan stabilitas ping, latency streaming, dan keamanan berselancar Anda.",
  "Akses server internasional berkecepatan gigabit tanpa batasan kuota.",
  "Koneksi andal untuk streaming 4K, low-ping gaming, dan kerja jarak jauh.",
];

interface AdSlotProps {
  variant?: "leaderboard" | "strip" | "rectangle" | "compact";
  className?: string;
  slotId?: string;
  href?: string;
  title?: string;
  subtitle?: string;
}

export function AdSlot({
  variant = "leaderboard",
  className = "",
  slotId = "default-slot",
  href,
  title,
  subtitle,
}: AdSlotProps) {
  const targetUrl = useMemo(() => getAdUrl(slotId, href), [slotId, href]);

  // Deterministic copy based on slotId sum
  const [displayTitle, displaySubtitle] = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < slotId.length; i++) {
      sum += slotId.charCodeAt(i);
    }
    const t = title || DEFAULT_HEADLINES[sum % DEFAULT_HEADLINES.length];
    const s = subtitle || DEFAULT_SUBTITLES[sum % DEFAULT_SUBTITLES.length];
    return [t, s];
  }, [slotId, title, subtitle]);

  // Variant 1: Compact (inline pill for small vertical spaces, modals, below gauge)
  if (variant === "compact") {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ad-slot={slotId}
        className={`group w-full rounded-xl border border-dashed border-rose-300/60 dark:border-rose-900/50 bg-rose-50/40 dark:bg-rose-950/20 hover:bg-rose-50/80 dark:hover:bg-rose-950/40 hover:border-[#800020]/50 transition-all p-2.5 sm:p-3 flex items-center justify-between gap-2.5 text-xs select-none cursor-pointer shadow-2xs ${className}`}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-[#800020] text-white shrink-0">
            Ads
          </span>
          <span className="text-[11px] font-semibold text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors truncate">
            {displayTitle}
          </span>
        </div>
        <div className="shrink-0 flex items-center gap-1 text-[10px] font-bold text-[#800020] dark:text-rose-400 group-hover:translate-x-0.5 transition-transform">
          <span>Kunjungi</span>
          <ExternalLink className="size-3" />
        </div>
      </a>
    );
  }

  // Variant 2: Slim Strip (compact horizontal bar for between sections or under tabs)
  if (variant === "strip") {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ad-slot={slotId}
        className={`group w-full rounded-xl border border-dashed border-border/80 hover:border-[#800020]/50 bg-card/60 dark:bg-zinc-900/50 hover:bg-rose-50/40 dark:hover:bg-rose-950/30 backdrop-blur-md transition-all p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs text-muted-foreground select-none cursor-pointer shadow-2xs ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-[#800020] dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60 shrink-0">
            Iklan
          </span>
          <div className="flex items-center gap-1.5 truncate">
            <Megaphone className="size-3.5 text-[#800020] dark:text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-semibold text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 text-[11px] sm:text-xs truncate transition-colors">
              {displayTitle}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#800020] text-white text-[10px] sm:text-[11px] font-semibold group-hover:bg-[#68001a] transition-all shadow-2xs group-hover:scale-105 active:scale-95">
          <span>Lihat Promo</span>
          <ExternalLink className="size-3" />
        </div>
      </a>
    );
  }

  // Variant 3: Medium Rectangle (square card for sidebars or multi-column grids)
  if (variant === "rectangle") {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ad-slot={slotId}
        className={`group w-full rounded-2xl border border-dashed border-border/80 hover:border-[#800020]/50 bg-card/60 dark:bg-zinc-900/50 hover:bg-rose-50/40 dark:hover:bg-rose-950/30 backdrop-blur-md transition-all p-4 sm:p-5 flex flex-col items-center justify-center text-center relative overflow-hidden select-none min-h-[160px] sm:min-h-[190px] cursor-pointer shadow-2xs ${className}`}
      >
        <div className="absolute top-2.5 left-2.5">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-rose-100 dark:bg-rose-950 text-[#800020] dark:text-rose-300 border border-border/50">
            Sponsor
          </span>
        </div>

        <div className="space-y-2 max-w-xs flex flex-col items-center">
          <div className="size-11 rounded-2xl bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Sparkles className="size-5" />
          </div>
          <div>
            <h4 className="font-bold text-xs sm:text-sm text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors">
              {displayTitle}
            </h4>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5 leading-relaxed">
              {displaySubtitle}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#800020] group-hover:bg-[#68001a] text-white text-[11px] font-semibold transition-all shadow-2xs group-hover:scale-105 active:scale-95 mt-1">
            <span>Kunjungi Situs Mitra</span>
            <ExternalLink className="size-3" />
          </div>
        </div>
      </a>
    );
  }

  // Variant 4: Responsive Leaderboard Banner (Standard horizontal ad slot)
  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-ad-slot={slotId}
      className={`group w-full rounded-2xl border border-dashed border-border/80 hover:border-[#800020]/50 bg-card/60 dark:bg-zinc-900/50 hover:bg-rose-50/40 dark:hover:bg-rose-950/30 backdrop-blur-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden select-none min-h-[64px] sm:min-h-[78px] cursor-pointer shadow-2xs ${className}`}
    >
      <div className="flex items-center gap-3 w-full sm:w-auto min-w-0">
        <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-[#800020] dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60 shrink-0">
          Iklan
        </span>
        <div className="min-w-0">
          <div className="flex items-center gap-1.5">
            <Zap className="size-3.5 text-[#800020] dark:text-rose-400 shrink-0 group-hover:scale-110 transition-transform" />
            <span className="font-bold text-xs sm:text-sm text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors truncate">
              {displayTitle}
            </span>
          </div>
          <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
            {displaySubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#800020] group-hover:bg-[#68001a] text-white text-[10px] sm:text-[11px] font-semibold transition-all shadow-2xs group-hover:scale-105 active:scale-95">
          <span>Lihat Penawaran</span>
          <ExternalLink className="size-3" />
        </div>
      </div>
    </a>
  );
}
