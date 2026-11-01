"use client";

import React, { useState, useRef, useEffect } from "react";
import { GlobalProviderNode, ServerOption } from "@/types/speed-test";
import { useLanguage } from "@/context/language-context";
import {
  Award,
  ChevronDown,
  Globe,
  Server,
  CheckCircle2,
} from "lucide-react";

interface ActiveProviderBannerProps {
  activeDisplayNode: GlobalProviderNode | null;
  bestNode: GlobalProviderNode | null;
  testedNodes: GlobalProviderNode[];
  selectedServer: ServerOption;
  onSelectProvider: (node: GlobalProviderNode) => void;
  onOpenServersModal?: () => void;
}

function ActiveProviderBannerComponent({
  activeDisplayNode,
  bestNode,
  testedNodes,
  selectedServer,
  onSelectProvider,
  onOpenServersModal,
}: ActiveProviderBannerProps) {
  const { t } = useLanguage();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const activeTested =
    activeDisplayNode && activeDisplayNode.status === "completed"
      ? activeDisplayNode
      : testedNodes.find((n) => n.id === selectedServer.id) || null;

  return (
    <div className="w-full rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/70 dark:bg-zinc-900/50 backdrop-blur-xl p-2.5 sm:p-3.5 shadow-xs transition-all">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-2.5">
        {/* Left: Status / Active Server Info */}
        <div className="flex items-center gap-2 sm:gap-2.5 min-w-0">
          <div
            className={`p-1.5 sm:p-2 rounded-xl shrink-0 ${
              activeTested
                ? "bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300"
                : "bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400"
            }`}
          >
            {activeTested ? <CheckCircle2 className="size-4" /> : <Server className="size-4" />}
          </div>

          <div className="min-w-0 flex-1">
            {activeTested ? (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[10px] sm:text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                  {t("active_tested_banner")}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-muted border border-border/50 text-foreground">
                  {activeTested.flag}
                </span>
                <span className="font-extrabold text-xs text-foreground truncate max-w-[120px] xs:max-w-none">
                  {activeTested.provider}
                </span>
                <span className="text-[10px] text-muted-foreground hidden xs:inline">({activeTested.location})</span>
                <span className="font-mono text-[10px] sm:text-[11px] font-bold text-[#800020] dark:text-rose-400">
                  {activeTested.recvRate?.toFixed(1)}M ↓
                </span>
                <span className="font-mono text-[10px] sm:text-[11px] font-semibold text-rose-600 dark:text-rose-300">
                  {activeTested.sendRate?.toFixed(1)}M ↑
                </span>
                <span className="text-[9px] sm:text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
                  · {activeTested.ping?.toFixed(1)}ms
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
                <span className="text-[11px] sm:text-xs font-semibold text-foreground">
                  {t("target_server_banner")}
                </span>
                <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-muted border border-border/50 text-foreground">
                  {selectedServer.flag}
                </span>
                <span className="font-mono text-xs text-[#800020] dark:text-rose-400 font-bold truncate max-w-[150px] xs:max-w-none">
                  {selectedServer.name}
                </span>
              </div>
            )}
            <p className="text-[10px] text-muted-foreground truncate hidden xs:block">
              {activeTested
                ? t("tested_result_desc")
                : t("idle_banner_desc")}
            </p>
          </div>
        </div>

        {/* Right: Switch Provider Dropdown & Server Change */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end shrink-0 relative" ref={dropdownRef}>
          {testedNodes.length > 1 && bestNode && (
            <button
              type="button"
              onClick={() => onSelectProvider(bestNode)}
              className="px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300/40 hover:bg-amber-100 text-[10px] sm:text-[11px] font-semibold transition-all cursor-pointer flex items-center gap-1"
            >
              <Award className="size-3" />
              <span>{t("peak_node")}</span>
            </button>
          )}

          {testedNodes.length > 1 ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setDropdownOpen((prev) => !prev)}
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-border/70 hover:bg-muted text-[11px] sm:text-xs font-medium text-foreground transition-all cursor-pointer bg-background/80 shadow-2xs"
              >
                <span className="text-muted-foreground text-[10px] sm:text-[11px]">{t("server")}:</span>
                <span className="font-bold max-w-[110px] xs:max-w-[140px] sm:max-w-[180px] truncate">
                  {activeDisplayNode ? activeDisplayNode.provider : selectedServer.name}
                </span>
                <ChevronDown className="size-3.5 text-muted-foreground" />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-1.5 w-[calc(100vw-2.5rem)] max-w-xs sm:w-72 max-h-72 overflow-y-auto rounded-xl border border-border/70 bg-popover/95 backdrop-blur-md shadow-lg p-1.5 z-50 text-xs animate-in fade-in zoom-in-95">
                  <div className="px-2 py-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider border-b border-border/40 mb-1">
                    {t("tested_servers_count")} ({testedNodes.length})
                  </div>
                  {testedNodes.map((node) => {
                    const isSelected =
                      activeDisplayNode?.id === node.id || selectedServer.id === node.id;
                    const isBest = bestNode?.id === node.id;

                    return (
                      <button
                        key={node.id}
                        type="button"
                        onClick={() => {
                          onSelectProvider(node);
                          setDropdownOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-2 rounded-lg flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                          isSelected
                            ? "bg-rose-50 dark:bg-rose-950/50 text-[#800020] dark:text-rose-200 font-semibold"
                            : "hover:bg-muted text-foreground"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="px-1 py-0.2 rounded text-[9px] font-mono font-bold bg-muted border border-border/50 text-foreground">
                              {node.flag}
                            </span>
                            <span className="truncate">{node.provider}</span>
                            {isBest && (
                              <span className="px-1 py-0.2 rounded text-[9px] bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 font-bold inline-flex items-center gap-0.5">
                                <Award className="size-2.5" />
                              </span>
                            )}
                          </div>
                          <span className="text-[10px] text-muted-foreground block truncate">
                            {node.location}
                          </span>
                        </div>
                        <div className="text-right shrink-0 font-mono text-[11px]">
                          <span className="font-bold block text-foreground">
                            {node.recvRate?.toFixed(1)} M
                          </span>
                          <span className="text-[10px] text-muted-foreground">
                            {node.ping?.toFixed(1)} ms
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          ) : (
            onOpenServersModal && (
              <button
                type="button"
                onClick={onOpenServersModal}
                className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-xl border border-border/70 hover:bg-muted text-[11px] sm:text-xs font-medium text-foreground transition-all cursor-pointer"
              >
                <Globe className="size-3 text-[#800020] dark:text-rose-400" />
                <span>{t("change_server")}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
}

export const ActiveProviderBanner = React.memo(ActiveProviderBannerComponent);
