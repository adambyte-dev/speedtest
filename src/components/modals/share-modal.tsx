"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ServerOption, SpeedTestMetrics } from "@/types/speed-test";
import { useLanguage } from "@/context/language-context";
import {
  Share2,
  Check,
  Copy,
  ArrowDown,
  ArrowUp,
  Zap,
  Send,
  MessageCircle,
} from "lucide-react";

interface ShareModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  metrics: SpeedTestMetrics;
  selectedServer: ServerOption;
  providerName?: string;
}

export function ShareModal({
  open,
  onOpenChange,
  metrics,
  selectedServer,
  providerName = "Internet Provider",
}: ShareModalProps) {
  const { t } = useLanguage();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  const downVal = metrics.download !== null ? metrics.download.toFixed(1) : "0.0";
  const upVal = metrics.upload !== null ? metrics.upload.toFixed(1) : "0.0";
  const pingVal = metrics.ping !== null ? metrics.ping.toFixed(1) : "0.0";
  const jitterVal = metrics.jitter !== null ? metrics.jitter.toFixed(1) : "1.0";

  // Build the shareable URL with parameters
  const origin = typeof window !== "undefined" ? window.location.origin : "https://speedtest.pingly.net";
  const shareUrl = `${origin}/?down=${downVal}&up=${upVal}&ping=${pingVal}&jitter=${jitterVal}&server=${encodeURIComponent(
    selectedServer.id
  )}`;

  // Formatted text message for social messaging apps
  const shareText = `🚀 Hasil Uji Kecepatan Internet Pingly:
↓ Download: ${downVal} Mbps
↑ Upload: ${upVal} Mbps
⚡ Latensi: ${pingVal} ms (Jitter: ${jitterVal} ms)
🌐 Server: ${selectedServer.name}
📶 Provider: ${providerName}

Uji kecepatan internetmu secara akurat & transparan di:
${shareUrl}`;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch {}
  };

  const handleCopyFormattedText = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2500);
    } catch {}
  };

  const handleNativeShare = async () => {
    if (typeof navigator !== "undefined" && navigator.share) {
      try {
        await navigator.share({
          title: "Hasil Uji Kecepatan Internet Pingly",
          text: `Hasil tes internet saya: ↓ ${downVal} Mbps, ↑ ${upVal} Mbps, Ping: ${pingVal} ms`,
          url: shareUrl,
        });
      } catch {
        // User dismissed native share sheet
      }
    } else {
      handleCopyLink();
    }
  };

  // WhatsApp share link
  const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareText)}`;

  // X (Twitter) share link
  const xUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
    `Kecepatan internet saya di Pingly: ↓ ${downVal} Mbps | ↑ ${upVal} Mbps (${pingVal} ms). Uji koneksi internetmu di sini: #SpeedTest #Pingly`
  )}&url=${encodeURIComponent(shareUrl)}`;

  // Telegram share link
  const tgUrl = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(
    `Hasil Uji Kecepatan Internet Pingly: ↓ ${downVal} Mbps | ↑ ${upVal} Mbps | ⚡ ${pingVal} ms`
  )}`;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-md max-h-[88vh] p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400">
              <Share2 className="size-5" />
            </div>
            <div>
              <DialogTitle>{t("share_results")}</DialogTitle>
              <DialogDescription>
                {t("share_desc")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Visual Preview Card of the Share Image / Result */}
        <div className="p-4 rounded-2xl bg-gradient-to-br from-rose-950/20 via-card to-card border border-rose-900/30 shadow-md space-y-3">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-foreground tracking-tight">Pingly Speed Test</span>
            </div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600 dark:text-emerald-400">
              Data Riil
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 py-2">
            <div className="p-2 rounded-xl bg-background/80 border border-border/50 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase font-semibold">
                <ArrowDown className="size-3 text-rose-700 dark:text-rose-400" />
                <span>{t("download")}</span>
              </div>
              <div className="text-base sm:text-lg font-mono font-extrabold text-foreground mt-0.5">
                {downVal}
              </div>
              <span className="text-[9px] text-muted-foreground font-semibold">Mbps</span>
            </div>

            <div className="p-2 rounded-xl bg-background/80 border border-border/50 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase font-semibold">
                <ArrowUp className="size-3 text-rose-700 dark:text-rose-400" />
                <span>{t("upload")}</span>
              </div>
              <div className="text-base sm:text-lg font-mono font-extrabold text-foreground mt-0.5">
                {upVal}
              </div>
              <span className="text-[9px] text-muted-foreground font-semibold">Mbps</span>
            </div>

            <div className="p-2 rounded-xl bg-background/80 border border-border/50 text-center">
              <div className="flex items-center justify-center gap-1 text-[10px] text-muted-foreground uppercase font-semibold">
                <Zap className="size-3 text-rose-700 dark:text-rose-400" />
                <span>{t("ping")}</span>
              </div>
              <div className="text-base sm:text-lg font-mono font-extrabold text-foreground mt-0.5 text-emerald-600 dark:text-emerald-400">
                {pingVal}
              </div>
              <span className="text-[9px] text-muted-foreground font-semibold">ms</span>
            </div>
          </div>

          <div className="text-[11px] text-muted-foreground flex items-center justify-between border-t border-border/40 pt-2 truncate">
            <span className="truncate">{selectedServer.name}</span>
            <span className="truncate max-w-[140px] text-right font-medium text-foreground">{providerName}</span>
          </div>
        </div>

        {/* 1-Click Social Share Buttons */}
        <div className="space-y-2 pt-1">
          <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
            {t("share_direct")}
          </span>

          <div className="grid grid-cols-3 gap-2">
            {/* WhatsApp */}
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 transition-all cursor-pointer group text-xs font-semibold gap-1"
            >
              <MessageCircle className="size-4 group-hover:scale-110 transition-transform" />
              <span>WhatsApp</span>
            </a>

            {/* Telegram */}
            <a
              href={tgUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-sky-500/30 bg-sky-500/10 hover:bg-sky-500/20 text-sky-700 dark:text-sky-300 transition-all cursor-pointer group text-xs font-semibold gap-1"
            >
              <Send className="size-4 group-hover:scale-110 transition-transform" />
              <span>Telegram</span>
            </a>

            {/* X / Twitter */}
            <a
              href={xUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex flex-col items-center justify-center p-2.5 rounded-xl border border-border/70 bg-card hover:bg-muted text-foreground transition-all cursor-pointer group text-xs font-semibold gap-1"
            >
              <svg className="size-4 fill-current group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span>X (Twitter)</span>
            </a>
          </div>
        </div>

        {/* Copy Link & Formatted Text */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 text-xs font-mono rounded-lg border border-border bg-muted/40 text-muted-foreground truncate focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyLink}
              className="px-3 py-2 rounded-lg bg-[#800020] hover:bg-[#68001a] text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shrink-0 shadow-xs"
            >
              {copiedLink ? (
                <>
                  <Check className="size-3.5" />
                  <span>{t("share_copied_link")}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>{t("share_copy_link")}</span>
                </>
              )}
            </button>
          </div>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyFormattedText}
              className="flex-1 py-2 px-3 rounded-lg border border-border/70 bg-card hover:bg-muted text-xs font-medium text-foreground flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              {copiedText ? (
                <>
                  <Check className="size-3.5 text-emerald-600" />
                  <span>{t("share_copied_text")}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>{t("share_copy_text")}</span>
                </>
              )}
            </button>

            {typeof navigator !== "undefined" && "share" in navigator && (
              <button
                type="button"
                onClick={handleNativeShare}
                className="py-2 px-3 rounded-lg border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/50 hover:bg-rose-100 text-[#800020] dark:text-rose-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                <Share2 className="size-3.5" />
                <span>{t("share_native")}</span>
              </button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
