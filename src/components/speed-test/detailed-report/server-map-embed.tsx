"use client";

import { useState } from "react";
import { ServerOption, NetworkDetails, GlobalProviderNode } from "@/types/speed-test";
import { useLanguage } from "@/context/language-context";
import {
  Compass,
  MapPin,
  Navigation,
  Radio,
  Server,
  Laptop,
  Activity,
} from "lucide-react";

interface ServerMapEmbedProps {
  selectedServer: ServerOption;
  networkDetails: NetworkDetails;
  testedNodes?: GlobalProviderNode[];
  onSelectNode?: (node: GlobalProviderNode) => void;
}

function calculateHaversineDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  if (!lat1 || !lon1 || !lat2 || !lon2) return 0;
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

export function ServerMapEmbed({
  selectedServer,
  networkDetails,
  testedNodes = [],
  onSelectNode,
}: ServerMapEmbedProps) {
  const { t } = useLanguage();
  const [activeMapNode, setActiveMapNode] = useState<GlobalProviderNode | null>(null);

  // Active target server details for the map
  const currentTarget = activeMapNode
    ? {
        id: activeMapNode.id,
        name: activeMapNode.provider,
        location: activeMapNode.location,
        country: activeMapNode.country,
        flag: activeMapNode.flag,
        lat: activeMapNode.lat,
        lng: activeMapNode.lng,
        ping: activeMapNode.ping || activeMapNode.basePing,
        recvRate: activeMapNode.recvRate,
        category: activeMapNode.category,
      }
    : {
        id: selectedServer.id,
        name: selectedServer.name,
        location: selectedServer.location,
        country: selectedServer.country,
        flag: selectedServer.flag,
        lat: selectedServer.lat,
        lng: selectedServer.lng,
        ping: selectedServer.basePing,
        recvRate: null,
        category: "nasional",
      };

  // Real client coordinates detected from GeoIP (fallback to Jakarta only if detection is still pending)
  const clientLat = typeof networkDetails.lat === "number" ? networkDetails.lat : -6.2088;
  const clientLng = typeof networkDetails.lng === "number" ? networkDetails.lng : 106.8456;

  const distanceKm = calculateHaversineDistance(
    clientLat,
    clientLng,
    currentTarget.lat,
    currentTarget.lng
  );

  // Reliable Google Maps embed query that centers on server location
  const mapSrc = `https://maps.google.com/maps?q=${currentTarget.lat},${currentTarget.lng}&z=10&output=embed`;

  const isInternational = distanceKm > 1800 || currentTarget.country !== "Indonesia";

  return (
    <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl p-4 sm:p-5 shadow-xs space-y-4">
      {/* Title & Route Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400">
              <Navigation className="size-4" />
            </div>
            <h3 className="font-bold text-sm tracking-tight text-foreground">
              {t("map_route_title")}
            </h3>
            {testedNodes.length > 0 && (
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-semibold">
                {testedNodes.length} {t("nodes_tested")}
              </span>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">
            {t("map_route_desc")}
          </p>
        </div>

        {/* Location Indicators */}
        <div className="flex items-center gap-2 text-xs self-start sm:self-auto flex-wrap">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-muted/60 border border-border/50">
            <span className="size-2 rounded-full bg-emerald-500" />
            <span className="font-medium text-foreground">{networkDetails.userLocation}</span>
          </div>
          <span className="text-muted-foreground">→</span>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-rose-50 dark:bg-rose-950/50 border border-rose-200/50 dark:border-rose-900/40 text-rose-900 dark:text-rose-200 font-medium">
            <span className="size-2 rounded-full bg-[#800020]" />
            <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-muted border border-border/50">
              {currentTarget.flag}
            </span>
            <span>{currentTarget.location}</span>
          </div>
        </div>
      </div>

      {/* Network Topology Visualizer (Fiber Transmission Arc) */}
      <div className="p-4 rounded-xl border border-border/60 bg-gradient-to-r from-muted/40 via-background/60 to-muted/40 backdrop-blur-md">
        <div className="grid grid-cols-1 md:grid-cols-7 gap-3 items-center">
          {/* Client Terminal (Left) */}
          <div className="md:col-span-2 p-3 rounded-lg border border-border/50 bg-background/80 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-400 shrink-0">
              <Laptop className="size-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                {t("client_device")}
              </span>
              <span className="font-bold text-xs text-foreground block truncate">
                {networkDetails.network}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                IP: {networkDetails.ip} ({networkDetails.userLocation})
              </span>
            </div>
          </div>

          {/* Fiber Optic Transmission Line (Center) */}
          <div className="md:col-span-3 flex flex-col items-center justify-center text-center px-2 py-1">
            <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground mb-1">
              <Activity className="size-3 text-[#800020] animate-pulse" />
              <span>
                {isInternational ? t("subsea_cable") : t("fiber_domestic")}
              </span>
            </div>

            {/* Glowing Fiber Cable Line */}
            <div className="relative w-full h-2 rounded-full bg-muted overflow-hidden flex items-center">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 via-[#800020] to-rose-500 opacity-60" />
              <div className="absolute w-8 h-full bg-white blur-xs animate-ping" />
            </div>

            <div className="flex items-center justify-between w-full mt-1.5 font-mono text-[10px] text-muted-foreground">
              <span>{t("distance_prefix")}: ~{distanceKm.toLocaleString()} km</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">
                {t("ping")}: {currentTarget.ping !== null ? `${currentTarget.ping.toFixed(1)} ms` : "-- ms"}
              </span>
            </div>
          </div>

          {/* Server Edge Datacenter (Right) */}
          <div className="md:col-span-2 p-3 rounded-lg border border-border/50 bg-background/80 flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 shrink-0">
              <Server className="size-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] uppercase font-semibold text-muted-foreground block">
                {t("target_edge_server")}
              </span>
              <span className="font-bold text-xs text-foreground block truncate">
                {currentTarget.name}
              </span>
              <span className="text-[10px] font-mono text-muted-foreground block truncate">
                {currentTarget.location}, {currentTarget.country}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Tested Nodes Points Bar */}
      {testedNodes.length > 0 ? (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="font-semibold text-foreground flex items-center gap-1">
              <Compass className="size-3.5 text-[#800020] dark:text-rose-400" />
              {t("select_node_on_map")}
            </span>
            <span className="text-[11px]">{t("click_to_switch_map")}</span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1.5 scrollbar-thin">
            {testedNodes.map((node) => {
              const isSelectedOnMap =
                activeMapNode?.id === node.id || (!activeMapNode && selectedServer.id === node.id);

              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => {
                    setActiveMapNode(node);
                    if (onSelectNode) onSelectNode(node);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs whitespace-nowrap transition-all cursor-pointer ${
                    isSelectedOnMap
                      ? "bg-[#800020] text-white border-[#800020] shadow-xs font-semibold scale-102"
                      : "bg-muted/40 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                  }`}
                >
                  <span
                    className={`px-1.5 py-0.2 rounded text-[9px] font-mono font-bold border ${
                      isSelectedOnMap
                        ? "bg-rose-900 text-white border-rose-700"
                        : "bg-muted text-foreground border-border/50"
                    }`}
                  >
                    {node.flag}
                  </span>
                  <div className="text-left">
                    <span className="block font-medium leading-tight">{node.provider}</span>
                    <span
                      className={`text-[10px] font-mono leading-none ${
                        isSelectedOnMap ? "text-rose-200" : "text-muted-foreground"
                      }`}
                    >
                      {node.ping?.toFixed(1)} ms · {node.recvRate?.toFixed(1)} Mbps
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="px-3 py-2 rounded-xl bg-muted/40 border border-border/50 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Radio className="size-3.5 text-[#800020] animate-pulse" />
            <span>
              {t("target_server")}: <strong className="text-foreground">{selectedServer.name}</strong>. {t("start_test")}
            </span>
          </div>
        </div>
      )}

      {/* Embedded Google Maps Container */}
      <div className="relative w-full h-[320px] sm:h-[380px] rounded-xl overflow-hidden border border-black/[0.05] dark:border-white/[0.08] bg-muted/30">
        <iframe
          title="Google Maps Server Location"
          src={mapSrc}
          width="100%"
          height="100%"
          style={{ border: 0 }}
          allowFullScreen={false}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          className="w-full h-full filter saturate-[0.98] contrast-[1.02]"
        />

        {/* Live Diagnostics Card Overlay on Map */}
        <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:right-auto sm:max-w-md bg-background/95 dark:bg-zinc-900/95 backdrop-blur-md p-2.5 sm:p-3 rounded-xl border border-border/60 text-xs shadow-md space-y-1.5 sm:space-y-2">
          <div className="flex items-center justify-between gap-2 sm:gap-3">
            <div className="flex items-center gap-1.5 sm:gap-2 font-bold text-foreground min-w-0">
              <MapPin className="size-3.5 sm:size-4 text-[#800020] dark:text-rose-400 shrink-0" />
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-muted border border-border/50 text-foreground shrink-0">
                {currentTarget.flag}
              </span>
              <span className="truncate">{currentTarget.name}</span>
            </div>
            <span className="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted border border-border/50 text-muted-foreground shrink-0">
              {currentTarget.location}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 pt-1 border-t border-border/40 text-[10px] sm:text-[11px]">
            <div>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground block truncate">{t("physical_distance")}</span>
              <span className="font-mono font-bold text-foreground truncate block">
                {distanceKm > 0 ? `~${distanceKm.toLocaleString()}km` : "Local"}
              </span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground block truncate">{t("ping")}</span>
              <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400 truncate block">
                {currentTarget.ping !== null ? `${currentTarget.ping.toFixed(1)}ms` : "--"}
              </span>
            </div>
            <div>
              <span className="text-[9px] sm:text-[10px] text-muted-foreground block truncate">{t("download")}</span>
              <span className="font-mono font-bold text-[#800020] dark:text-rose-400 truncate block">
                {currentTarget.recvRate !== null ? `${currentTarget.recvRate.toFixed(1)}M` : "--"}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
