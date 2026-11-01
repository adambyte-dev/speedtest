"use client";

import { useState, useMemo } from "react";
import { GlobalProviderNode, ProviderAccumulation, ServerOption, TestPhase } from "@/types/speed-test";
import { useLanguage } from "@/context/language-context";
import {
  ArrowDown,
  ArrowUp,
  Award,
  Building2,
  CheckCircle2,
  Globe,
  Loader2,
  Radio,
  Server,
  Zap,
} from "lucide-react";

interface ProviderMatrixProps {
  providerNodes: GlobalProviderNode[];
  providerAccumulation: ProviderAccumulation;
  selectedServer: ServerOption;
  activeDisplayNode: GlobalProviderNode | null;
  phase?: TestPhase;
  onSelectForDisplay: (node: GlobalProviderNode) => void;
}

export function ProviderMatrix({
  providerNodes,
  providerAccumulation,
  selectedServer,
  activeDisplayNode,
  phase = "idle",
  onSelectForDisplay,
}: ProviderMatrixProps) {
  const { t } = useLanguage();
  const [filterCategory, setFilterCategory] = useState<"all" | "nasional" | "internasional">("all");

  const filteredNodes = useMemo(() => {
    if (filterCategory === "all") return providerNodes;
    return providerNodes.filter((n) => n.category === filterCategory);
  }, [providerNodes, filterCategory]);

  const nationalSummary = providerAccumulation.nasional;
  const internationalSummary = providerAccumulation.internasional;
  const bestNode = providerAccumulation.bestNode;

  const nationalCount = useMemo(
    () => providerNodes.filter((n) => n.category === "nasional").length,
    [providerNodes]
  );
  const internationalCount = useMemo(
    () => providerNodes.filter((n) => n.category === "internasional").length,
    [providerNodes]
  );

  const isTesting = phase === "ping" || phase === "download" || phase === "upload";
  const testedCount = providerNodes.filter(
    (n) => n.status === "completed" && n.recvRate !== null
  ).length;

  return (
    <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl p-4 sm:p-5 shadow-xs space-y-5">
      {/* Top Header & Synchronized Status Indicator */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400">
            <Server className="size-4" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-bold text-sm tracking-tight text-foreground">
                {t("matrix_title")}
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-rose-100/70 dark:bg-rose-950/60 text-[#800020] dark:text-rose-300 font-mono text-[10px] font-bold">
                {providerNodes.length} Nodes
              </span>
              {testedCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-semibold">
                  {testedCount} {t("nodes_tested")}
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              {t("matrix_desc")}
            </p>
          </div>
        </div>

        {/* Synchronized Status Badge */}
        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {isTesting ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-rose-100/80 dark:bg-rose-950/70 text-[#800020] dark:text-rose-300 text-xs font-semibold animate-pulse border border-rose-300/40">
              <Loader2 className="size-3.5 animate-spin" />
              <span>{t("testing_connection")}</span>
            </div>
          ) : testedCount > 0 ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-100/80 dark:bg-emerald-950/70 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-300/40">
              <CheckCircle2 className="size-3.5" />
              <span>{testedCount} {t("nodes_tested")}</span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-muted/60 text-muted-foreground text-xs font-medium border border-border/50">
              <Radio className="size-3 text-[#800020] dark:text-rose-400" />
              <span>{t("select_and_start")}</span>
            </div>
          )}
        </div>
      </div>

      {/* Akumulasi Domestik & Internasional Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {/* Card 1: Domestik / Nasional */}
        <div className="p-3.5 rounded-xl border border-rose-200/50 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-950/20 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Building2 className="size-3.5 text-[#800020] dark:text-rose-400" /> {t("domestic_route")}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100/70 dark:bg-rose-900/50 text-[#800020] dark:text-rose-300 font-semibold">
              {nationalSummary.testedCount}/{nationalSummary.totalCount} {t("domestic_tested")}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-rose-200/40 dark:border-rose-900/40">
            <div>
              <span className="text-[10px] text-muted-foreground block">{t("avg_download")}</span>
              <span className="text-sm font-extrabold font-mono text-foreground">
                {nationalSummary.avgDownload !== null ? `${nationalSummary.avgDownload} M` : "--"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">{t("peak_download")}</span>
              <span className="text-sm font-extrabold font-mono text-[#800020] dark:text-rose-400">
                {nationalSummary.peakDownload !== null ? `${nationalSummary.peakDownload} M` : "--"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">{t("avg_ping")}</span>
              <span className="text-sm font-extrabold font-mono text-emerald-600 dark:text-emerald-400">
                {nationalSummary.avgPing !== null ? `${nationalSummary.avgPing} ms` : "--"}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            {t("domestic_peering_note")}
          </p>
        </div>

        {/* Card 2: Internasional */}
        <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Globe className="size-3.5 text-[#800020] dark:text-rose-400" /> {t("global_route")}
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-semibold">
              {internationalSummary.testedCount}/{internationalSummary.totalCount} {t("domestic_tested")}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-border/40">
            <div>
              <span className="text-[10px] text-muted-foreground block">{t("avg_download")}</span>
              <span className="text-sm font-extrabold font-mono text-foreground">
                {internationalSummary.avgDownload !== null ? `${internationalSummary.avgDownload} M` : "--"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">{t("peak_download")}</span>
              <span className="text-sm font-extrabold font-mono text-[#800020] dark:text-rose-400">
                {internationalSummary.peakDownload !== null ? `${internationalSummary.peakDownload} M` : "--"}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-muted-foreground block">{t("avg_ping")}</span>
              <span className="text-sm font-extrabold font-mono text-amber-600 dark:text-amber-400">
                {internationalSummary.avgPing !== null ? `${internationalSummary.avgPing} ms` : "--"}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground italic">
            {t("subsea_cable_note")}
          </p>
        </div>

        {/* Card 3: Node Terbaik */}
        <div className="p-3.5 rounded-xl border border-amber-200/60 dark:border-amber-900/40 bg-amber-50/40 dark:bg-amber-950/20 backdrop-blur-sm space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-amber-900 dark:text-amber-300 flex items-center gap-1.5">
              <Award className="size-3.5 text-amber-600 fill-amber-500/20" />
              {t("best_tested_node")}
            </span>
            <span className="text-[10px] font-semibold text-amber-800 dark:text-amber-400">
              {t("tested_connection")}
            </span>
          </div>

          {bestNode ? (
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-bold text-xs text-foreground flex items-center gap-1.5">
                    <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-muted border border-border/50 text-foreground">
                      {bestNode.flag}
                    </span>
                    <span>{bestNode.provider}</span>
                  </div>
                  <span className="text-[10px] text-muted-foreground">{bestNode.location}</span>
                </div>
                <div className="text-right">
                  <span className="font-mono font-extrabold text-sm text-[#800020] dark:text-rose-400 block">
                    {bestNode.recvRate?.toFixed(1)} Mbps
                  </span>
                  <span className="font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                    {bestNode.ping?.toFixed(1)} ms
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => onSelectForDisplay(bestNode)}
                className="w-full mt-1 py-1 rounded-lg bg-[#800020] hover:bg-rose-900 text-white text-[11px] font-semibold transition-all cursor-pointer shadow-xs"
              >
                {t("show_on_dashboard")}
              </button>
            </div>
          ) : (
            <div className="py-2 text-center text-xs text-muted-foreground">
              {t("idle_banner_desc")}
            </div>
          )}
        </div>
      </div>

      {/* Filter Tabs Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs">
        <div className="flex items-center gap-1.5 bg-muted/60 dark:bg-zinc-800/60 p-1 rounded-xl border border-border/50 overflow-x-auto max-w-full scrollbar-none">
          <button
            type="button"
            onClick={() => setFilterCategory("all")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer whitespace-nowrap shrink-0 ${
              filterCategory === "all"
                ? "bg-background text-foreground shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {t("filter_all")} ({providerNodes.length})
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("nasional")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              filterCategory === "nasional"
                ? "bg-[#800020] text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Building2 className="size-3" />
            <span>{t("filter_domestic")} ({nationalCount})</span>
          </button>
          <button
            type="button"
            onClick={() => setFilterCategory("internasional")}
            className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer flex items-center gap-1.5 whitespace-nowrap shrink-0 ${
              filterCategory === "internasional"
                ? "bg-[#800020] text-white shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Globe className="size-3" />
            <span>{t("filter_international")} ({internationalCount})</span>
          </button>
        </div>

        <span className="text-muted-foreground text-[11px] self-end sm:self-auto">
          {t("showing_nodes")} <span className="font-semibold text-foreground">{filteredNodes.length}</span> {t("nodes_count")}
        </span>
      </div>

      {/* Provider Matrix Table (Synced Results) */}
      <div className="overflow-x-auto rounded-xl border border-border/50 bg-background/60 dark:bg-zinc-900/60">
        <table className="w-full min-w-[560px] text-left text-xs border-collapse">
          <thead>
            <tr className="border-b border-border/60 bg-muted/40 font-semibold text-muted-foreground">
              <th className="py-2.5 px-3">{t("col_provider")}</th>
              <th className="py-2.5 px-3">{t("col_location")}</th>
              <th className="py-2.5 px-3 text-right">
                <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 font-bold">
                  <ArrowDown className="size-3" /> {t("col_download")}
                </span>
              </th>
              <th className="py-2.5 px-3 text-right">
                <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 font-bold">
                  <ArrowUp className="size-3" /> {t("col_upload")}
                </span>
              </th>
              <th className="py-2.5 px-3 text-right">
                <span className="inline-flex items-center gap-1 font-bold">
                  <Zap className="size-3" /> {t("col_latency")}
                </span>
              </th>
              <th className="py-2.5 px-3 text-center">{t("col_action")}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40 font-sans">
            {filteredNodes.map((node) => {
              const isCurrentSelected =
                activeDisplayNode?.id === node.id ||
                selectedServer.id === node.id ||
                selectedServer.name.includes(node.location.split(",")[0]);

              const isBest = bestNode?.id === node.id;
              const isNodeTesting = node.status === "testing" || (isTesting && isCurrentSelected);
              const isDone = node.status === "completed" && node.recvRate !== null;

              const pingColor =
                node.ping === null
                  ? "text-muted-foreground"
                  : node.ping < 45
                  ? "text-emerald-600 dark:text-emerald-400 font-bold"
                  : node.ping < 140
                  ? "text-amber-600 dark:text-amber-400 font-bold"
                  : "text-rose-600 dark:text-rose-400 font-bold";

              return (
                <tr
                  key={node.id}
                  className={`transition-colors hover:bg-muted/30 ${
                    isCurrentSelected ? "bg-rose-50/50 dark:bg-rose-950/25" : ""
                  }`}
                >
                  {/* Provider Info */}
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-muted text-muted-foreground border border-border/50 shrink-0">
                        {node.flag}
                      </span>
                      <div>
                        <div className="font-bold text-foreground flex items-center gap-1.5 flex-wrap">
                          <span>{node.provider}</span>
                          <span className="text-[9px] font-mono px-1.5 py-0.2 rounded-md bg-muted text-muted-foreground border border-border/40">
                            {node.capacity}
                          </span>
                          {isBest && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 border border-amber-300/50 flex items-center gap-0.5">
                              <Award className="size-2.5" />
                              <span>{t("best")}</span>
                            </span>
                          )}
                          {isCurrentSelected && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-md bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-300 border border-rose-300/50">
                              {t("active")}
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-muted-foreground block truncate max-w-[170px]">
                          {node.host}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-3">
                    <span className="font-medium text-foreground">{node.location}</span>
                    <span className="text-[10px] text-muted-foreground block capitalize">
                      {node.category}
                    </span>
                  </td>

                  {/* Recv (Download) */}
                  <td className="py-3 px-3 text-right font-mono">
                    {isNodeTesting ? (
                      <span className="inline-flex items-center gap-1 text-rose-700 dark:text-rose-400 animate-pulse text-[11px]">
                        <Loader2 className="size-3 animate-spin" /> {t("status_measuring")}
                      </span>
                    ) : isDone && node.recvRate !== null ? (
                      <div>
                        <span className="font-bold text-sm text-foreground">
                          {node.recvRate.toFixed(1)} Mbps
                        </span>
                        <div className="w-16 ml-auto h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                          <div
                            style={{ width: `${Math.min((node.recvRate / 150) * 100, 100)}%` }}
                            className="h-full rounded-full bg-[#800020]"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-- Mbps</span>
                    )}
                  </td>

                  {/* Send (Upload) */}
                  <td className="py-3 px-3 text-right font-mono">
                    {isNodeTesting ? (
                      <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 animate-pulse text-[11px]">
                        <Loader2 className="size-3 animate-spin" /> ...
                      </span>
                    ) : isDone && node.sendRate !== null ? (
                      <div>
                        <span className="font-bold text-sm text-foreground">
                          {node.sendRate.toFixed(1)} Mbps
                        </span>
                        <div className="w-16 ml-auto h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                          <div
                            style={{ width: `${Math.min((node.sendRate / 80) * 100, 100)}%` }}
                            className="h-full rounded-full bg-[#BE123C]"
                          />
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground">-- Mbps</span>
                    )}
                  </td>

                  {/* Latency */}
                  <td className="py-3 px-3 text-right font-mono">
                    {isNodeTesting ? (
                      <span className="text-muted-foreground animate-pulse text-[11px]">...</span>
                    ) : (
                      <span className={pingColor}>
                        {node.ping !== null ? `${node.ping.toFixed(1)} ms` : `~${node.basePing} ms`}
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3 px-3 text-center">
                    <button
                      type="button"
                      onClick={() => onSelectForDisplay(node)}
                      disabled={isTesting}
                      className={`px-3 py-1 rounded-lg text-xs font-medium border transition-all cursor-pointer disabled:opacity-40 ${
                        isCurrentSelected
                          ? "bg-[#800020] text-white border-[#800020] shadow-xs"
                          : isDone
                          ? "bg-rose-50 dark:bg-rose-950/40 text-[#800020] dark:text-rose-300 border-rose-200 dark:border-rose-900/50 hover:bg-rose-100"
                          : "bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground border-border/50"
                      }`}
                    >
                      {isCurrentSelected ? t("active") : isDone ? t("action_view") : t("action_select")}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
