"use client";

import { NetworkDetails, ServerOption } from "@/types/speed-test";
import { Globe, MapPin, Network, Server, Shield } from "lucide-react";
import { useState } from "react";
import { useLanguage } from "@/context/language-context";

interface NetworkInfoCardProps {
  networkDetails: NetworkDetails;
  selectedServer: ServerOption;
}

export function NetworkInfoCard({
  networkDetails,
  selectedServer,
}: NetworkInfoCardProps) {
  const { t } = useLanguage();
  const [copied, setCopied] = useState(false);

  const handleCopyIP = () => {
    navigator.clipboard.writeText(networkDetails.ip);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl p-5 shadow-xs">
      <div className="flex items-center gap-2 mb-4">
        <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400">
          <Network className="size-4" />
        </div>
        <h3 className="font-bold text-sm tracking-tight text-foreground">
          {t("network_info_title")}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Connected via */}
        <div className="p-3.5 rounded-xl bg-background/80 dark:bg-zinc-900/60 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <Globe className="size-3.5 text-rose-700 dark:text-rose-400" />
            <span>{t("connected_via")}</span>
          </div>
          <div className="mt-1 font-mono font-bold text-base text-foreground flex items-center gap-2">
            <span>{networkDetails.connectedVia}</span>
            <span className="text-[10px] font-sans font-medium px-1.5 py-0.2 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300">
              {t("active")}
            </span>
          </div>
        </div>

        {/* Server Location */}
        <div className="p-3.5 rounded-xl bg-background/80 dark:bg-zinc-900/60 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <Server className="size-3.5 text-rose-700 dark:text-rose-400" />
            <span>{t("server_location")}</span>
          </div>
          <div className="mt-1 font-semibold text-sm text-foreground flex items-center gap-1.5 truncate">
            <span className="truncate">{selectedServer.location}, {selectedServer.country}</span>
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-muted border border-border/50 text-foreground shrink-0">
              {selectedServer.flag}
            </span>
          </div>
        </div>

        {/* Your Network / ASN */}
        <div className="p-3.5 rounded-xl bg-background/80 dark:bg-zinc-900/60 border border-border/50">
          <div className="flex items-center gap-2 text-muted-foreground text-xs font-medium">
            <Shield className="size-3.5 text-rose-700 dark:text-rose-400" />
            <span>{t("your_network")}</span>
          </div>
          <div className="mt-1 font-semibold text-xs text-foreground truncate" title={networkDetails.network}>
            {networkDetails.network}
          </div>
        </div>

        {/* IP Address */}
        <div className="p-3.5 rounded-xl bg-background/80 dark:bg-zinc-900/60 border border-border/50">
          <div className="flex items-center justify-between text-muted-foreground text-xs font-medium">
            <div className="flex items-center gap-2">
              <MapPin className="size-3.5 text-rose-700 dark:text-rose-400" />
              <span>{t("your_ip")}</span>
            </div>
            <button
              type="button"
              onClick={handleCopyIP}
              className="text-[11px] text-[#800020] dark:text-rose-400 hover:underline cursor-pointer"
            >
              {copied ? t("copied") : t("copy")}
            </button>
          </div>
          <div className="mt-1 font-mono font-bold text-sm text-foreground">
            {networkDetails.ip}
          </div>
        </div>
      </div>
    </div>
  );
}
