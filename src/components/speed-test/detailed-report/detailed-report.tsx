"use client";

import React from "react";
import {
  GlobalProviderNode,
  NetworkDetails,
  ProviderAccumulation,
  ServerOption,
  SpeedTestMetrics,
  TestPhase,
} from "@/types/speed-test";
import { PerformanceScores } from "./performance-scores";
import { NetworkInfoCard } from "./network-info-card";
import { LatencyJitterBreakdown } from "./latency-jitter-breakdown";
import { ChunkMeasurements } from "./chunk-measurements";
import { ServerMapEmbed } from "./server-map-embed";
import { ProviderMatrix } from "./provider-matrix";
import { AdSlot } from "@/components/ads/ad-slot";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLanguage } from "@/context/language-context";
import {
  ArrowDown,
  ArrowUp,
  BarChart2,
  Clock,
  Gauge,
  MapPin,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";

interface DetailedReportProps {
  metrics: SpeedTestMetrics;
  selectedServer: ServerOption;
  networkDetails: NetworkDetails;
  phase?: TestPhase;
  providerNodes?: GlobalProviderNode[];
  providerAccumulation?: ProviderAccumulation;
  activeDisplayNode?: GlobalProviderNode | null;
  onSelectForDisplay?: (node: GlobalProviderNode) => void;
  testedNodes?: GlobalProviderNode[];
}

function DetailedReportComponent({
  metrics,
  selectedServer,
  networkDetails,
  phase = "idle",
  providerNodes = [],
  providerAccumulation = {
    nasional: {
      testedCount: 0,
      totalCount: 0,
      avgDownload: null,
      peakDownload: null,
      avgUpload: null,
      avgPing: null,
    },
    internasional: {
      testedCount: 0,
      totalCount: 0,
      avgDownload: null,
      peakDownload: null,
      avgUpload: null,
      avgPing: null,
    },
    bestNode: null,
  },
  activeDisplayNode = null,
  onSelectForDisplay = () => {},
  testedNodes = [],
}: DetailedReportProps) {
  const { t } = useLanguage();
  const download = metrics.download;
  const upload = metrics.upload;
  const latency = metrics.ping;
  const latencyDown = metrics.latencyDownload;
  const latencyUp = metrics.latencyUpload;

  const jitter = metrics.jitter;
  const jitterDown = metrics.jitterDownload;
  const jitterUp = metrics.jitterUpload;

  return (
    <section className="w-full max-w-6xl mx-auto px-4 mt-8 mb-8 space-y-4 animate-in fade-in duration-500">
      {/* Title Header with Tabs Navigation */}
      <Tabs defaultValue="overview" className="w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/60">
          <div>
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400">
                <Gauge className="size-5" />
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-foreground">
                {t("diagnostics_title")}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("diagnostics_subtitle")}
            </p>
          </div>

          {/* Compact Tab Switchers - Horizontally Scrollable on Mobile */}
          <div className="w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <TabsList className="bg-muted/60 dark:bg-zinc-900/60 p-1 rounded-xl border border-black/[0.05] dark:border-white/[0.08] inline-flex whitespace-nowrap gap-1">
              <TabsTrigger
                value="overview"
                className="text-xs px-3 py-1.5 rounded-lg font-semibold data-active:bg-[#800020] data-active:text-white shrink-0 cursor-pointer"
              >
                <ShieldCheck className="size-3.5 mr-1.5" />
                {t("tab_overview")}
              </TabsTrigger>
              <TabsTrigger
                value="measurements"
                className="text-xs px-3 py-1.5 rounded-lg font-semibold data-active:bg-[#800020] data-active:text-white shrink-0 cursor-pointer"
              >
                <BarChart2 className="size-3.5 mr-1.5" />
                {t("tab_measurements")}
              </TabsTrigger>
              <TabsTrigger
                value="providers"
                className="text-xs px-3 py-1.5 rounded-lg font-semibold data-active:bg-[#800020] data-active:text-white shrink-0 cursor-pointer"
              >
                <Server className="size-3.5 mr-1.5" />
                {t("tab_providers")}
              </TabsTrigger>
              <TabsTrigger
                value="route"
                className="text-xs px-3 py-1.5 rounded-lg font-semibold data-active:bg-[#800020] data-active:text-white shrink-0 cursor-pointer"
              >
                <MapPin className="size-3.5 mr-1.5" />
                {t("tab_route")}
              </TabsTrigger>
            </TabsList>
          </div>
        </div>

        {/* Primary Metrics Banner (Always Visible on Top of Tabs for instant glance) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 pt-3">
          {/* Download */}
          <div className="p-3 sm:p-3.5 rounded-xl border border-black/[0.05] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase">
              <span>{t("download")}</span>
              <ArrowDown className="size-3.5 sm:size-4 text-rose-700 dark:text-rose-400" />
            </div>
            <div className="mt-1 font-mono tabular-nums text-xl sm:text-2xl font-extrabold text-foreground truncate">
              {download !== null ? download.toFixed(1) : "--"}
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground">Mbps</span>
          </div>

          {/* Upload */}
          <div className="p-3 sm:p-3.5 rounded-xl border border-black/[0.05] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase">
              <span>{t("upload")}</span>
              <ArrowUp className="size-3.5 sm:size-4 text-rose-700 dark:text-rose-400" />
            </div>
            <div className="mt-1 font-mono tabular-nums text-xl sm:text-2xl font-extrabold text-foreground truncate">
              {upload !== null ? upload.toFixed(1) : "--"}
            </div>
            <span className="text-[10px] font-semibold text-muted-foreground">Mbps</span>
          </div>

          {/* Latency / Ping */}
          <div className="p-3 sm:p-3.5 rounded-xl border border-black/[0.05] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase">
              <span>{t("ping")}</span>
              <Clock className="size-3.5 sm:size-4 text-rose-700 dark:text-rose-400" />
            </div>
            <div className="mt-1 font-mono tabular-nums text-xl sm:text-2xl font-extrabold text-foreground truncate">
              {latency !== null ? latency.toFixed(1) : "--"}
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 truncate">
              <span>{latencyDown !== null ? `${latencyDown}ms` : "--"}</span> · <span>{latencyUp !== null ? `${latencyUp}ms` : "--"}</span>
            </div>
          </div>

          {/* Jitter */}
          <div className="p-3 sm:p-3.5 rounded-xl border border-black/[0.05] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase">
              <span>{t("jitter")}</span>
              <Zap className="size-3.5 sm:size-4 text-rose-700 dark:text-rose-400" />
            </div>
            <div className="mt-1 font-mono tabular-nums text-xl sm:text-2xl font-extrabold text-foreground truncate">
              {jitter !== null ? jitter.toFixed(2) : "--"}
            </div>
            <div className="flex items-center gap-1 sm:gap-1.5 text-[9px] sm:text-[10px] text-muted-foreground mt-0.5 truncate">
              <span>{jitterDown !== null ? `${jitterDown}ms` : "--"}</span> · <span>{jitterUp !== null ? `${jitterUp}ms` : "--"}</span>
            </div>
          </div>

          {/* Packet Loss */}
          <div className="col-span-2 sm:col-span-1 p-3 sm:p-3.5 rounded-xl border border-black/[0.05] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md">
            <div className="flex items-center justify-between text-[11px] sm:text-xs text-muted-foreground font-semibold uppercase">
              <span>{t("packet_loss")}</span>
              <ShieldCheck className="size-3.5 sm:size-4 text-emerald-500" />
            </div>
            <div className="mt-1 font-mono tabular-nums text-xl sm:text-2xl font-extrabold text-foreground truncate">
              {metrics.packetLoss !== null ? `${metrics.packetLoss.toFixed(1)}%` : "--"}
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 dark:text-emerald-400 block truncate">
              {metrics.packetLoss !== null ? ((metrics.packetLoss ?? 0) === 0 ? t("tier_excellent") : t("tier_good")) : t("tier_untested")}
            </span>
          </div>
        </div>

        {/* TAB 1: Overview & Performance Scores */}
        <TabsContent value="overview" className="space-y-4 pt-3 focus-visible:outline-none">
          {/* Application Performance Scores */}
          <PerformanceScores
            ping={latency}
            jitter={jitter}
            download={download}
            packetLoss={metrics.packetLoss ?? 0}
          />

          {/* Non-intrusive Inline Sponsor Strip */}
          <AdSlot variant="strip" slotId="tab-overview-strip" />

          {/* Network & Connection Details */}
          <NetworkInfoCard
            networkDetails={networkDetails}
            selectedServer={selectedServer}
          />
        </TabsContent>

        {/* TAB 2: Measurements (Latency & Chunks) */}
        <TabsContent value="measurements" className="space-y-4 pt-3 focus-visible:outline-none">
          {/* Latency & Jitter Breakdown */}
          <LatencyJitterBreakdown
            unloadedLatency={latency}
            downloadLatency={latencyDown}
            uploadLatency={latencyUp}
            unloadedJitter={jitter}
            downloadJitter={jitterDown}
            uploadJitter={jitterUp}
            unloadedSamples={metrics.unloadedSamples}
            downloadSamples={metrics.downloadSamples}
            uploadSamples={metrics.uploadSamples}
          />

          {/* Non-intrusive Inline Sponsor Strip */}
          <AdSlot variant="strip" slotId="tab-measurements-strip" />

          {/* Chunk Size Measurements */}
          <ChunkMeasurements
            downloadSpeed={download}
            uploadSpeed={upload}
            chunks={metrics.chunks}
          />
        </TabsContent>

        {/* TAB 3: Global Provider Benchmark Matrix */}
        <TabsContent value="providers" className="pt-3 space-y-3 focus-visible:outline-none">
          <ProviderMatrix
            providerNodes={providerNodes}
            providerAccumulation={providerAccumulation}
            selectedServer={selectedServer}
            activeDisplayNode={activeDisplayNode}
            phase={phase}
            onSelectForDisplay={onSelectForDisplay}
          />

          {/* Non-intrusive Inline Sponsor Strip */}
          <AdSlot variant="strip" slotId="tab-providers-strip" />
        </TabsContent>

        {/* TAB 4: Google Maps Route */}
        <TabsContent value="route" className="pt-3 space-y-3 focus-visible:outline-none">
          <ServerMapEmbed
            selectedServer={selectedServer}
            networkDetails={networkDetails}
            testedNodes={testedNodes}
            onSelectNode={onSelectForDisplay}
          />

          {/* Non-intrusive Inline Sponsor Strip */}
          <AdSlot
            variant="strip"
            slotId="tab-route-strip"
          />
        </TabsContent>
      </Tabs>
    </section>
  );
}

// Memoized to completely ignore chartPoints streaming and prevent expensive re-renders during test runs
export const DetailedReport = React.memo(DetailedReportComponent, (prev, next) => {
  return (
    prev.phase === next.phase &&
    prev.selectedServer.id === next.selectedServer.id &&
    prev.networkDetails.ip === next.networkDetails.ip &&
    prev.activeDisplayNode?.id === next.activeDisplayNode?.id &&
    prev.metrics.download === next.metrics.download &&
    prev.metrics.upload === next.metrics.upload &&
    prev.metrics.ping === next.metrics.ping &&
    prev.metrics.jitter === next.metrics.jitter &&
    prev.metrics.packetLoss === next.metrics.packetLoss &&
    prev.providerNodes === next.providerNodes &&
    prev.providerAccumulation === next.providerAccumulation &&
    prev.testedNodes === next.testedNodes
  );
});