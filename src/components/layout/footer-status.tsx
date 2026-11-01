"use client";

import { ServerOption } from "@/types/speed-test";
import { ChevronDown, Server, Wifi } from "lucide-react";

interface FooterStatusProps {
  selectedServer: ServerOption;
  onOpenServerModal: () => void;
  providerName?: string;
}

export function FooterStatus({
  selectedServer,
  onOpenServerModal,
  providerName = "Telkom Indonesia",
}: FooterStatusProps) {
  return (
    <div className="w-full max-w-xl mx-auto px-4 pb-10 pt-2 flex items-center justify-center">
      <div className="inline-flex items-center gap-6 sm:gap-9 py-2.5 px-6 rounded-full bg-white/70 dark:bg-zinc-900/60 backdrop-blur-xl border border-black/[0.05] dark:border-white/[0.08] shadow-xs">
        {/* Server Selector Button */}
        <button
          type="button"
          onClick={onOpenServerModal}
          className="group flex items-center gap-2.5 text-left cursor-pointer transition-all hover:opacity-90"
        >
          <div className="size-8.5 rounded-full bg-violet-100/70 dark:bg-violet-950/50 text-[#5850EC] dark:text-violet-400 flex items-center justify-center shrink-0 group-hover:bg-[#5850EC] group-hover:text-white transition-colors">
            <Server className="size-4" />
          </div>
          <div>
            <div className="text-[10px] font-medium text-muted-foreground leading-tight">
              Server Otomatis
            </div>
            <div className="flex items-center gap-1 font-semibold text-xs sm:text-sm text-foreground group-hover:text-[#5850EC] dark:group-hover:text-violet-400 transition-colors">
              <span>{selectedServer.name}</span>
              <ChevronDown className="size-3 text-muted-foreground group-hover:text-[#5850EC] transition-colors" />
            </div>
          </div>
        </button>

        {/* Minimal Divider */}
        <div className="h-6 w-px bg-border/60" />

        {/* Provider Info */}
        <div className="flex items-center gap-2.5 text-left">
          <div className="size-8.5 rounded-full bg-violet-100/70 dark:bg-violet-950/50 text-[#5850EC] dark:text-violet-400 flex items-center justify-center shrink-0">
            <Wifi className="size-4" />
          </div>
          <div>
            <div className="text-[10px] font-medium text-muted-foreground leading-tight">
              Provider
            </div>
            <div className="font-semibold text-xs sm:text-sm text-foreground">
              {providerName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
