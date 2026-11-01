"use client";

import { useMemo } from "react";
import {
  Cloud,
  ExternalLink,
  Flame,
  Rocket,
  Shield,
  Wifi,
  Zap,
} from "lucide-react";

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

interface SponsoredCreative {
  brand: string;
  category: string;
  headline: string;
  tagline: string;
  badge: string;
  cta: string;
  icon: typeof Rocket;
  colorClass: string;
}

const SPONSORED_CREATIVES: SponsoredCreative[] = [
  {
    brand: "CloudHost Gigabit",
    category: "Cloud VPS NVMe",
    headline: "Server VPS NVMe Ultra Cepat — Diskon Spesial 70%",
    tagline: "Uptime 99.99%, latensi < 10ms direct peering OpenIXP & IIX Jakarta.",
    badge: "Diskon 70%",
    cta: "Klaim Promo",
    icon: Cloud,
    colorClass: "from-blue-600 to-indigo-700 text-blue-500",
  },
  {
    brand: "SecureVPN Pro",
    category: "Keamanan & Privasi",
    headline: "Bypass Throttling ISP — Akselerasi Koneksi 10 Gbps",
    tagline: "Enkripsi militer ChaCha20, zero logging audit, dan bebas lag gaming.",
    badge: "Trending #1",
    cta: "Mulai Gratis",
    icon: Shield,
    colorClass: "from-emerald-600 to-teal-700 text-emerald-500",
  },
  {
    brand: "FiberOptic Home",
    category: "Broadband Rumah",
    headline: "Internet Rumah 100% Fiber Simetris — Bebas FUP Selamanya",
    tagline: "Kecepatan unduh dan unggah 1:1, streaming 4K lancar tanpa jeda.",
    badge: "Promo Terbatas",
    cta: "Cek Jangkauan",
    icon: Zap,
    colorClass: "from-rose-600 to-red-700 text-[#800020] dark:text-rose-400",
  },
  {
    brand: "Anti-DDoS Shield",
    category: "Proteksi Server",
    headline: "Mitigasi DDoS Otomatis Multi-Tbps & Anycast DNS",
    tagline: "Saring serangan volumetrik L3/L4/L7 seketika tanpa downtime.",
    badge: "Sponsor Resmi",
    cta: "Pelajari",
    icon: Flame,
    colorClass: "from-amber-600 to-orange-700 text-amber-500",
  },
  {
    brand: "WiFi 7 Tri-Band",
    category: "Perangkat Jaringan",
    headline: "Router Wi-Fi 7 Generasi Baru — Jangkau Seluruh Sudut Rumah",
    tagline: "Throughput nirkabel hingga 9.6 Gbps dengan latensi ultra rendah.",
    badge: "Pilihan Editor",
    cta: "Lihat Produk",
    icon: Wifi,
    colorClass: "from-purple-600 to-pink-700 text-purple-500",
  },
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

  // Deterministically pick a rich creative based on slotId
  const creative = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < slotId.length; i++) {
      sum += slotId.charCodeAt(i);
    }
    return SPONSORED_CREATIVES[sum % SPONSORED_CREATIVES.length];
  }, [slotId]);

  const displayTitle = title || creative.headline;
  const displaySubtitle = subtitle || creative.tagline;
  const Icon = creative.icon;

  // Variant 1: Compact (pill style for small cards, under gauge, modals)
  if (variant === "compact") {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ad-slot={slotId}
        className={`group w-full rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-card/80 dark:bg-zinc-900/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 backdrop-blur-md transition-all p-2.5 sm:p-3 flex items-center justify-between gap-2.5 text-xs select-none cursor-pointer shadow-xs hover:shadow-sm hover:border-[#800020]/40 ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-7 rounded-lg bg-rose-100/80 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Icon className="size-3.5" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded bg-rose-100 dark:bg-rose-950 text-[#800020] dark:text-rose-300 shrink-0">
                {creative.badge}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold truncate">
                {creative.brand}
              </span>
            </div>
            <div className="text-[11px] font-bold text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors truncate">
              {displayTitle}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#800020] group-hover:bg-[#68001a] text-white text-[10px] font-semibold transition-all shadow-2xs group-hover:translate-x-0.5">
          <span>{creative.cta}</span>
          <ExternalLink className="size-2.5" />
        </div>
      </a>
    );
  }

  // Variant 2: Slim Strip (horizontal banner for between sections & under tabs)
  if (variant === "strip") {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ad-slot={slotId}
        className={`group w-full rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-card/85 dark:bg-zinc-900/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 backdrop-blur-md transition-all p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs select-none cursor-pointer shadow-xs hover:shadow-sm hover:border-[#800020]/40 ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="size-8 rounded-lg bg-rose-100/80 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
            <Icon className="size-4" />
          </div>
          <div className="min-w-0 flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/50 shrink-0">
              Iklan · {creative.brand}
            </span>
            <span className="font-bold text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 text-xs sm:text-[13px] truncate transition-colors">
              {displayTitle}
            </span>
            <span className="text-[11px] text-muted-foreground truncate hidden md:inline">
              · {displaySubtitle}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020] group-hover:bg-[#68001a] text-white text-[11px] font-semibold transition-all shadow-2xs group-hover:scale-105 active:scale-95">
          <span>{creative.cta}</span>
          <ExternalLink className="size-3" />
        </div>
      </a>
    );
  }

  // Variant 3: Medium Rectangle (square card)
  if (variant === "rectangle") {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ad-slot={slotId}
        className={`group w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card/85 dark:bg-zinc-900/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 backdrop-blur-md transition-all p-5 flex flex-col items-center justify-center text-center relative overflow-hidden select-none min-h-[180px] cursor-pointer shadow-xs hover:shadow-md hover:border-[#800020]/40 ${className}`}
      >
        <div className="absolute top-3 left-3 flex items-center gap-1.5">
          <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
            Disponsori
          </span>
          <span className="text-[10px] text-muted-foreground font-semibold">
            {creative.brand}
          </span>
        </div>

        <div className="space-y-2.5 max-w-xs flex flex-col items-center mt-3">
          <div className="size-12 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xs">
            <Icon className="size-6" />
          </div>
          <div>
            <h4 className="font-extrabold text-sm sm:text-base text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors">
              {displayTitle}
            </h4>
            <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
              {displaySubtitle}
            </p>
          </div>
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] group-hover:bg-[#68001a] text-white text-xs font-semibold transition-all shadow-2xs group-hover:scale-105 active:scale-95">
            <span>{creative.cta}</span>
            <ExternalLink className="size-3.5" />
          </div>
        </div>
      </a>
    );
  }

  // Variant 4: Responsive Leaderboard Banner (Default full-width ad banner)
  return (
    <a
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      data-ad-slot={slotId}
      className={`group w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card/85 dark:bg-zinc-900/60 hover:bg-rose-50/50 dark:hover:bg-rose-950/30 backdrop-blur-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden select-none min-h-[72px] sm:min-h-[84px] cursor-pointer shadow-xs hover:shadow-md hover:border-[#800020]/40 ${className}`}
    >
      <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0">
        <div className="size-10 sm:size-11 rounded-xl bg-rose-100/90 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs">
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-rose-100 dark:bg-rose-950/80 text-[#800020] dark:text-rose-300 border border-rose-200/60 dark:border-rose-900/60 shrink-0">
              Iklan · {creative.badge}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground truncate">
              {creative.brand} · {creative.category}
            </span>
          </div>
          <div className="font-extrabold text-xs sm:text-sm text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors truncate">
            {displayTitle}
          </div>
          <p className="text-[11px] text-muted-foreground truncate hidden xs:block">
            {displaySubtitle}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0">
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] group-hover:bg-[#68001a] text-white text-xs font-semibold transition-all shadow-2xs group-hover:scale-105 active:scale-95">
          <span>{creative.cta}</span>
          <ExternalLink className="size-3.5" />
        </div>
      </div>
    </a>
  );
}
