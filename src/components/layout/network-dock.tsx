"use client";

import React from "react";
import { ServerOption } from "@/types/speed-test";
import { ChevronDown, RotateCcw, Server, Wifi, Share2 } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface NetworkDockProps {
  selectedServer: ServerOption;
  onOpenServerModal: () => void;
  providerName?: string;
  hasData?: boolean;
  onReset?: () => void;
  onShare?: () => void;
}

function NetworkDockComponent({
  selectedServer,
  onOpenServerModal,
  providerName = "Mendeteksi Jaringan...",
  hasData = false,
  onReset,
  onShare,
}: NetworkDockProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full flex items-center justify-between gap-2 sm:gap-3 px-2.5 sm:px-3.5 py-2 rounded-xl bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.08] shadow-xs text-xs min-w-0">
      {/* Server Selector Button */}
      <button
        type="button"
        onClick={onOpenServerModal}
        className="group flex items-center gap-1.5 sm:gap-2 text-left cursor-pointer transition-all hover:opacity-90 min-w-0"
      >
        <div className="size-6.5 sm:size-7 rounded-lg bg-rose-100/70 dark:bg-rose-950/50 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0 group-hover:bg-[#800020] group-hover:text-white transition-colors">
          <Server className="size-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-[9px] font-medium text-muted-foreground uppercase leading-none">
            {t("server")}
          </div>
          <div className="flex items-center gap-1 font-semibold text-xs text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors truncate max-w-[90px] xs:max-w-[130px] sm:max-w-[180px]">
            <span className="truncate">{selectedServer.name}</span>
            <ChevronDown className="size-3 text-muted-foreground group-hover:text-[#800020] transition-colors shrink-0" />
          </div>
        </div>
      </button>

      {/* Minimal Divider */}
      <div className="h-5 w-px bg-border/60 shrink-0" />

      {/* Provider Info */}
      <div className="flex items-center gap-1.5 sm:gap-2 text-left min-w-0 flex-1">
        <div className="size-6.5 sm:size-7 rounded-lg bg-rose-100/70 dark:bg-rose-950/50 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0">
          <Wifi className="size-3.5" />
        </div>
        <div className="min-w-0">
          <div className="text-[9px] font-medium text-muted-foreground uppercase leading-none">
            {t("provider")}
          </div>
          <div className="font-semibold text-xs text-foreground truncate max-w-[100px] xs:max-w-[150px] sm:max-w-[200px]" title={providerName}>
            {providerName}
          </div>
        </div>
      </div>

      {/* Actions: Share & Reset Data (if data is populated) */}
      {hasData && (
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="h-5 w-px bg-border/60 shrink-0 mr-0.5" />
          {onShare && (
            <button
              type="button"
              onClick={onShare}
              title={t("share_results")}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-50 dark:bg-rose-950/60 hover:bg-rose-100 dark:hover:bg-rose-900/60 text-[#800020] dark:text-rose-300 border border-rose-200 dark:border-rose-900/40 transition-colors cursor-pointer text-[10px] sm:text-[11px] shrink-0 font-semibold"
            >
              <Share2 className="size-3" />
              <span className="hidden xs:inline">{t("share_results")}</span>
            </button>
          )}
          {onReset && (
            <button
              type="button"
              onClick={onReset}
              title={t("reset_data")}
              className="flex items-center gap-1 px-2 py-1 rounded-lg bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer text-[10px] sm:text-[11px] shrink-0 font-medium"
            >
              <RotateCcw className="size-3" />
              <span className="hidden sm:inline">{t("reset_data")}</span>
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export const NetworkDock = React.memo(NetworkDockComponent);