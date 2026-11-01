"use client";

import { useMemo } from "react";
import {
  Cloud,
  ExternalLink,
  Flame,
  Info,
  Shield,
  Star,
  Wifi,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { LanguageCode } from "@/lib/i18n/types";

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

interface LocalizedString {
  id: string;
  en: string;
  ja: string;
  zh: string;
  es: string;
  ar: string;
}

interface SponsoredCreative {
  brand: string;
  category: LocalizedString;
  headline: LocalizedString;
  tagline: LocalizedString;
  badge: LocalizedString;
  cta: LocalizedString;
  rating: number;
  reviews: string;
  icon: typeof Cloud;
  accentBg: string;
  badgeBg: string;
}

const SPONSORED_CREATIVES: SponsoredCreative[] = [
  {
    brand: "NordVPN Pro",
    category: {
      id: "Keamanan & Privasi Internet",
      en: "Internet Security & Privacy",
      ja: "セキュリティ＆プライバシー",
      zh: "网络安全与隐私保护",
      es: "Seguridad y Privacidad",
      ar: "الأمان والخصوصية الرقمية",
    },
    headline: {
      id: "Bypass Throttling ISP — Akselerasi Koneksi Ultra 10 Gbps",
      en: "Bypass ISP Throttling — Ultra 10 Gbps Connection Speed",
      ja: "ISP制限を完全回避 — 10Gbpsの超高速サーバー接続",
      zh: "告别运营商恶意限速 — 体验10 Gbps极速网络互联",
      es: "Evita la limitación de tu ISP — Conexión ultra de 10 Gbps",
      ar: "تجاوز تقييد مزود الإنترنت — سرعات فائقة تصل إلى 10 جيجابت",
    },
    tagline: {
      id: "Enkripsi ChaCha20 militer, zero-logs bersertifikasi, dan bebas lag saat gaming atau streaming.",
      en: "Military-grade ChaCha20 encryption, audited zero-logs, and zero lag for competitive gaming.",
      ja: "軍事レベルのChaCha20暗号化、監査済みノーログポリシー、ゲームや動画を快適に。",
      zh: "军工级ChaCha20强力加密，经过严格审计的无日志承诺，竞技游戏与超清视频零卡顿。",
      es: "Cifrado militar ChaCha20, sin registros auditado y latencia cero para juegos y streaming.",
      ar: "تشفير عسكري صارم، وسياسة عدم احتفاظ بالسجلات لضمان سرعة واستقرار كامل أثناء الألعاب والبث.",
    },
    badge: {
      id: "Diskon 72%",
      en: "72% OFF",
      ja: "72%割引",
      zh: "特惠2.8折",
      es: "72% Dto",
      ar: "خصم 72%",
    },
    cta: {
      id: "Klaim Promo",
      en: "Claim Offer",
      ja: "特典を見る",
      zh: "立即获取",
      es: "Obtener Oferta",
      ar: "احصل على العرض",
    },
    rating: 4.9,
    reviews: "24.8k",
    icon: Shield,
    accentBg: "bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
    badgeBg: "bg-blue-100 dark:bg-blue-950/80 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
  },
  {
    brand: "Hostinger Cloud",
    category: {
      id: "Web Hosting NVMe",
      en: "High-Speed NVMe Hosting",
      ja: "超高速NVMeホスティング",
      zh: "超高速NVMe云虚拟主机",
      es: "Hosting NVMe de Alta Velocidad",
      ar: "استضافة NVMe فائقة السرعة",
    },
    headline: {
      id: "Server Cloud NVMe 300% Lebih Cepat — Gratis Domain & SSL",
      en: "Cloud NVMe Servers 300% Faster — Free Domain & SSL",
      ja: "LiteSpeed搭載NVMeサーバー300%高速化 — ドメイン＆SSL無料",
      zh: "搭载LiteSpeed缓存的NVMe云服务器提速300% — 赠顶级域名与SSL",
      es: "Servidores Cloud NVMe 300% Más Rápidos — Dominio y SSL Gratis",
      ar: "خوادم سحابية أسرع بنسبة 300% مع نطاق وشهادة أمان مجانية",
    },
    tagline: {
      id: "Uptime 99.99%, latensi < 10ms direct peering OpenIXP & Telkom, cPanel modern ramah pemula.",
      en: "99.99% uptime, <10ms latency direct peering with OpenIXP, easy cPanel for all projects.",
      ja: "稼働率99.99%、アジア圏主要IX直結で超低遅延、初心者にも分かりやすい管理画面。",
      zh: "高达99.99%高可用在线率，直连核心互联网骨干节点，直观面板轻松部署企业应用。",
      es: "99.99% tiempo de actividad, latencia <10ms con peering directo y panel intuitivo.",
      ar: "جاهزية بنسبة 99.99%، استجابة منخفضة جداً وربط مباشر بنقاط تبادل الإنترنت العالمية.",
    },
    badge: {
      id: "Pilihan Editor",
      en: "Editor's Choice",
      ja: "注目のおすすめ",
      zh: "编辑推荐",
      es: "Elección del Editor",
      ar: "اختيار المحرر",
    },
    cta: {
      id: "Mulai Sekarang",
      en: "Get Started",
      ja: "今すぐ開始",
      zh: "立即开始",
      es: "Empezar Ahora",
      ar: "ابدأ الآن",
    },
    rating: 4.8,
    reviews: "32.1k",
    icon: Cloud,
    accentBg: "bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
    badgeBg: "bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800",
  },
  {
    brand: "Starlink Global",
    category: {
      id: "Internet Satelit Berkecepatan Tinggi",
      en: "High-Speed Satellite Broadband",
      ja: "超高速低軌道衛星ブロードバンド",
      zh: "高速低轨卫星宽带互联网",
      es: "Banda Ancha Satelital de Alta Velocidad",
      ar: "إنترنت النطاق العريض عبر الأقمار الصناعية",
    },
    headline: {
      id: "Internet Satelit 220 Mbps di Mana Saja — Tanpa Kabel Fisik",
      en: "220 Mbps Satellite Internet Anywhere — Zero Physical Wires",
      ja: "地球上どこでも繋がる220Mbps衛星通信 — 光回線不要で即開通",
      zh: "随时随地畅享220 Mbps卫星极速互联 — 无需任何光纤实体布线",
      es: "Internet Satelital de 220 Mbps en Cualquier Lugar — Sin Cables",
      ar: "إنترنت فضائي بسرعة 220 ميجابت في أي مكان — بدون تمديدات سلكية",
    },
    tagline: {
      id: "Koneksi stabil di area pelosok, pulau terpencil, dan pedalaman dengan konstelasi satelit LEO.",
      en: "Reliable connectivity across remote areas and islands powered by next-gen LEO satellites.",
      ja: "次世代低軌道衛星コンステレーションにより、山間部や離島でも光回線並みの低遅延を実現。",
      zh: "由先进低轨卫星星座提供动力，彻底解决偏远山区、岛屿及户外作业的稳定联网难题。",
      es: "Conectividad confiable en áreas remotas e islas gracias a la constelación satelital LEO.",
      ar: "اتصال موثوق ومستقر في المناطق النائية والريفية بفضل كوكبة الأقمار الصناعية المدارية الحديثة.",
    },
    badge: {
      id: "Teknologi Baru",
      en: "New Tech",
      ja: "次世代技術",
      zh: "创新技术",
      es: "Nueva Tecnología",
      ar: "تقنية حديثة",
    },
    cta: {
      id: "Cek Jangkauan",
      en: "Check Coverage",
      ja: "エリア確認",
      zh: "查询覆盖",
      es: "Ver Cobertura",
      ar: "فحص التغطية",
    },
    rating: 4.9,
    reviews: "18.3k",
    icon: Zap,
    accentBg: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800",
  },
  {
    brand: "ExpressVPN Ultra",
    category: {
      id: "Streaming 4K & Anti Lag",
      en: "4K Streaming & Gaming Accelerator",
      ja: "4K動画＆ゲーム高速化",
      zh: "4K超清串流与电竞网络加速",
      es: "Streaming 4K y Acelerador de Juegos",
      ar: "مسرع بث 4K والألعاب الإلكترونية",
    },
    headline: {
      id: "Bebas Buffer Streaming 4K di 105 Negara — Garansi 30 Hari",
      en: "Buffer-Free 4K Streaming Across 105 Countries — 30-Day Guarantee",
      ja: "世界105カ国でバッファゼロの4Kストリーミング — 30日間全額返金保証",
      zh: "遍布全球105个国家节点的4K零缓冲播放 — 支持30天全额退款保障",
      es: "Streaming 4K sin Cortes en 105 Países — Garantía de 30 Días",
      ar: "بث 4K بدون أي تقطيع في 105 دول — ضمان استرداد الأموال لمدة 30 يوماً",
    },
    tagline: {
      id: "Protokol Lightway eksklusif memberikan kecepatan maksimum tanpa membebani baterai perangkat.",
      en: "Exclusive Lightway protocol delivers peak throughput without draining your device battery.",
      ja: "独自開発のLightwayプロトコルがデバイスのバッテリー消費を抑えつつ最高の通信速度を提供。",
      zh: "独家自研Lightway协议在极致节省终端电量的同时，释放物理宽带的满血峰值吞吐。",
      es: "El protocolo exclusivo Lightway ofrece máximo rendimiento sin agotar la batería.",
      ar: "بروتوكول Lightway الحصري يوفر أعلى سرعات نقل بيانات بأقل استهلاك لطاقة البطارية.",
    },
    badge: {
      id: "Garansi 100%",
      en: "Verified",
      ja: "公式認定",
      zh: "官方认证",
      es: "Verificado",
      ar: "موثق رسمي",
    },
    cta: {
      id: "Coba Gratis",
      en: "Try Free",
      ja: "無料で試す",
      zh: "免费试用",
      es: "Probar Gratis",
      ar: "تجربة مجانية",
    },
    rating: 4.9,
    reviews: "41.6k",
    icon: Flame,
    accentBg: "bg-rose-500/15 text-[#800020] dark:text-rose-400 border-rose-500/30",
    badgeBg: "bg-rose-100 dark:bg-rose-950/80 text-[#800020] dark:text-rose-300 border-rose-200 dark:border-rose-800",
  },
  {
    brand: "WiFi 7 Mesh Pro",
    category: {
      id: "Perangkat Jaringan Generasi Baru",
      en: "Next-Gen Wireless Mesh",
      ja: "次世代Wi-Fi 7 メッシュルーター",
      zh: "新一代Wi-Fi 7分布式无线路由",
      es: "Red Mesh Inalámbrica de Nueva Generación",
      ar: "أجهزة راوتر وشبكات Wi-Fi 7 المتطورة",
    },
    headline: {
      id: "Router Wi-Fi 7 Tri-Band 9.6 Gbps — Jangkau Seluruh Sudut Rumah",
      en: "Tri-Band Wi-Fi 7 Router 9.6 Gbps — Zero Dead Zones Anywhere",
      ja: "Wi-Fi 7 トライバンド9.6Gbps — 家中の死角をゼロにする超強力電波",
      zh: "Wi-Fi 7三频全屋覆盖无线路由9.6 Gbps — 彻底消灭家庭WiFi信号死角",
      es: "Router Wi-Fi 7 Tri-Banda 9.6 Gbps — Cobertura Total en Todo tu Hogar",
      ar: "راوتر Wi-Fi 7 ثلاثي النطاق 9.6 جيجابت — تغطية شاملة وبدون أي نقاط ميتة",
    },
    tagline: {
      id: "Kanal 320 MHz, Multi-Link Operation (MLO), dan latensi ultra rendah untuk VR dan gaming 8K.",
      en: "320 MHz channels, Multi-Link Operation (MLO), and ultra-low latency built for 8K streaming.",
      ja: "320MHz帯域幅とMLO技術で混雑時も低遅延、8K動画やVRゲームにも余裕で対応。",
      zh: "支持320MHz超宽频宽与MLO多链路聚合技术，为8K超高清视频与VR游戏提供极低延迟保障。",
      es: "Canales de 320 MHz, tecnología MLO y latencia ultra baja para VR y streaming en 8K.",
      ar: "قنوات 320 ميجاهرتز وتقنية MLO لتوفير استجابة فورية مخصصة لبث 8K والواقع الافتراضي.",
    },
    badge: {
      id: "Trending #1",
      en: "Trending #1",
      ja: "人気急上昇",
      zh: "热度第一",
      es: "Tendencia #1",
      ar: "الأكثر طلباً",
    },
    cta: {
      id: "Lihat Produk",
      en: "View Deal",
      ja: "詳細を見る",
      zh: "查看详情",
      es: "Ver Producto",
      ar: "عرض المنتج",
    },
    rating: 4.8,
    reviews: "15.9k",
    icon: Wifi,
    accentBg: "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
    badgeBg: "bg-amber-100 dark:bg-amber-950/80 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800",
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
  const { lang } = useLanguage();
  const currentLang = (lang as LanguageCode) || "id";

  const targetUrl = useMemo(() => getAdUrl(slotId, href), [slotId, href]);

  // Deterministically select creative based on slotId
  const creative = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < slotId.length; i++) {
      sum += slotId.charCodeAt(i);
    }
    return SPONSORED_CREATIVES[sum % SPONSORED_CREATIVES.length];
  }, [slotId]);

  // Clean out any placeholder strings like "Ads Here", "Space Iklan", or "Pasang Iklan"
  const isPlaceholder =
    title &&
    (title.includes("Ads Here") ||
      title.includes("Space Iklan") ||
      title.includes("Pasang Iklan") ||
      title.includes("Pasang Banner") ||
      title.includes("Slot Sponsor"));

  const displayTitle = isPlaceholder || !title ? creative.headline[currentLang] : title;
  const displaySubtitle = !subtitle || subtitle.includes("Ads Here") ? creative.tagline[currentLang] : subtitle;
  const displayCategory = creative.category[currentLang];
  const displayBadge = creative.badge[currentLang];
  const displayCta = creative.cta[currentLang];
  const Icon = creative.icon;

  const adLabel = currentLang === "id" ? "Iklan" : currentLang === "ja" ? "広告" : currentLang === "zh" ? "广告" : currentLang === "es" ? "Anuncio" : currentLang === "ar" ? "إعلان" : "Ad";
  const sponsoredLabel = currentLang === "id" ? "Disponsori" : currentLang === "ja" ? "スポンサー" : currentLang === "zh" ? "赞助商" : currentLang === "es" ? "Patrocinado" : currentLang === "ar" ? "إعلان ممول" : "Sponsored";

  // Variant 1: Compact (pill style for small cards, under gauge, modals)
  if (variant === "compact") {
    return (
      <a
        href={targetUrl}
        target="_blank"
        rel="noopener noreferrer"
        data-ad-slot={slotId}
        aria-label={`${sponsoredLabel}: ${creative.brand}`}
        className={`group w-full rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-card/90 dark:bg-zinc-900/80 hover:bg-rose-50/40 dark:hover:bg-zinc-800/80 backdrop-blur-md transition-all p-2.5 sm:p-3 flex items-center justify-between gap-2.5 text-xs select-none cursor-pointer shadow-xs hover:shadow-md hover:border-[#800020]/40 ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`size-8 rounded-lg ${creative.accentBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border`}>
            <Icon className="size-4" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.2 rounded border ${creative.badgeBg}`}>
                {displayBadge}
              </span>
              <span className="text-[10px] text-muted-foreground font-semibold truncate flex items-center gap-1">
                <span>{creative.brand}</span>
                <span className="text-[9px] text-amber-500 font-mono font-bold flex items-center">
                  <Star className="size-2.5 fill-current inline" />
                  {creative.rating}
                </span>
              </span>
            </div>
            <div className="text-[11px] font-bold text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors truncate">
              {displayTitle}
            </div>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-1.5">
          <div className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#800020] group-hover:bg-[#68001a] text-white text-[10px] font-semibold transition-all shadow-2xs group-hover:translate-x-0.5">
            <span>{displayCta}</span>
            <ExternalLink className="size-2.5" />
          </div>
          <div className="text-muted-foreground/60 hover:text-muted-foreground transition-colors p-0.5" title="AdChoices">
            <Info className="size-3" />
          </div>
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
        aria-label={`${sponsoredLabel}: ${creative.brand}`}
        className={`group w-full rounded-xl border border-black/[0.08] dark:border-white/[0.08] bg-card/90 dark:bg-zinc-900/80 hover:bg-rose-50/40 dark:hover:bg-zinc-800/80 backdrop-blur-md transition-all p-2.5 sm:p-3 flex items-center justify-between gap-3 text-xs select-none cursor-pointer shadow-xs hover:shadow-md hover:border-[#800020]/40 ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className={`size-8 rounded-lg ${creative.accentBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform border`}>
            <Icon className="size-4" />
          </div>
          <div className="min-w-0 flex items-center gap-2 flex-wrap sm:flex-nowrap">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-muted text-muted-foreground border border-border/60 shrink-0 flex items-center gap-1">
              <span>{adLabel}</span>
              <span>·</span>
              <span className="text-foreground">{creative.brand}</span>
            </span>
            <span className="font-bold text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 text-xs sm:text-[13px] truncate transition-colors">
              {displayTitle}
            </span>
            <span className="text-[11px] text-muted-foreground truncate hidden md:inline">
              · {displaySubtitle}
            </span>
          </div>
        </div>

        <div className="shrink-0 flex items-center gap-2">
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono hidden xs:flex">
            <Star className="size-3 text-amber-500 fill-current" />
            <span className="font-bold text-foreground">{creative.rating}</span>
            <span>({creative.reviews})</span>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#800020] group-hover:bg-[#68001a] text-white text-[11px] font-semibold transition-all shadow-2xs group-hover:scale-105 active:scale-95">
            <span>{displayCta}</span>
            <ExternalLink className="size-3" />
          </div>

          <div className="text-muted-foreground/50 hover:text-muted-foreground transition-colors" title="AdChoices">
            <Info className="size-3.5" />
          </div>
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
        aria-label={`${sponsoredLabel}: ${creative.brand}`}
        className={`group w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card/90 dark:bg-zinc-900/80 hover:bg-rose-50/40 dark:hover:bg-zinc-800/80 backdrop-blur-md transition-all p-5 flex flex-col items-center justify-between text-center relative overflow-hidden select-none min-h-[200px] cursor-pointer shadow-xs hover:shadow-md hover:border-[#800020]/40 ${className}`}
      >
        <div className="w-full flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-muted text-muted-foreground border border-border/50">
              {sponsoredLabel}
            </span>
            <span className="text-[10px] text-muted-foreground font-semibold">
              {creative.brand}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-muted-foreground font-mono">
            <span className="flex items-center text-amber-500 font-bold">
              <Star className="size-2.5 fill-current mr-0.5" />
              {creative.rating}
            </span>
            <Info className="size-3 text-muted-foreground/50" />
          </div>
        </div>

        <div className="space-y-2.5 max-w-xs flex flex-col items-center my-auto">
          <div className={`size-12 rounded-2xl ${creative.accentBg} flex items-center justify-center group-hover:scale-110 transition-transform shadow-xs border`}>
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
        </div>

        <div className="w-full pt-3 mt-1 flex items-center justify-center">
          <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] group-hover:bg-[#68001a] text-white text-xs font-semibold transition-all shadow-2xs group-hover:scale-105 active:scale-95">
            <span>{displayCta}</span>
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
      aria-label={`${sponsoredLabel}: ${creative.brand}`}
      className={`group w-full rounded-2xl border border-black/[0.08] dark:border-white/[0.08] bg-card/90 dark:bg-zinc-900/80 hover:bg-rose-50/40 dark:hover:bg-zinc-800/80 backdrop-blur-md transition-all p-3 sm:p-4 flex flex-col sm:flex-row items-center justify-between gap-3 relative overflow-hidden select-none min-h-[76px] sm:min-h-[88px] cursor-pointer shadow-xs hover:shadow-md hover:border-[#800020]/40 ${className}`}
    >
      <div className="flex items-center gap-3.5 w-full sm:w-auto min-w-0">
        <div className={`size-10 sm:size-11 rounded-xl ${creative.accentBg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform shadow-2xs border`}>
          <Icon className="size-5" />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
            <span className={`text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded border shrink-0 ${creative.badgeBg}`}>
              {adLabel} · {displayBadge}
            </span>
            <span className="text-[11px] font-semibold text-muted-foreground truncate flex items-center gap-1.5">
              <span>{creative.brand}</span>
              <span>·</span>
              <span className="text-muted-foreground/80">{displayCategory}</span>
            </span>
            <span className="text-[10px] text-amber-500 font-mono font-bold flex items-center gap-0.5 hidden xs:inline-flex">
              <Star className="size-2.5 fill-current" />
              <span>{creative.rating}</span>
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

      <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end shrink-0">
        <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#800020] group-hover:bg-[#68001a] text-white text-xs font-semibold transition-all shadow-2xs group-hover:scale-105 active:scale-95">
          <span>{displayCta}</span>
          <ExternalLink className="size-3.5" />
        </div>

        <div className="text-muted-foreground/50 hover:text-muted-foreground transition-colors p-1" title="AdChoices · Info Iklan">
          <Info className="size-3.5" />
        </div>
      </div>
    </a>
  );
}
