"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DEFAULT_SERVERS } from "@/config/servers";
import { NetworkDetails, ServerOption } from "@/types/speed-test";
import { useLanguage } from "@/context/language-context";
import {
  Check,
  Globe2,
  Plus,
  Radio,
  Server,
  Trash2,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Network,
  MapPin,
  LocateFixed,
  Sparkles,
} from "lucide-react";

interface ServersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedServer: ServerOption;
  onSelectServer: (server: ServerOption) => void;
  customServers?: ServerOption[];
  onAddCustomServer?: (server: ServerOption) => void;
  onRemoveCustomServer?: (id: string) => void;
  onOpenDomainToIp?: () => void;
  networkDetails?: NetworkDetails;
  nearestServerInfo?: { server: ServerOption; distanceKm: number } | null;
  onDetectLocation?: () => Promise<unknown> | void;
  isDetectingLocation?: boolean;
  getServerDistance?: (server: ServerOption) => number | null;
}

const COMMON_PORTS = [80, 443, 8080, 8443, 3000];

export function ServersModal({
  open,
  onOpenChange,
  selectedServer,
  onSelectServer,
  customServers = [],
  onAddCustomServer,
  onRemoveCustomServer,
  onOpenDomainToIp,
  networkDetails,
  nearestServerInfo,
  onDetectLocation,
  isDetectingLocation = false,
  getServerDistance,
}: ServersModalProps) {
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"standard" | "custom">("standard");

  // Custom Server Form State
  const [hostInput, setHostInput] = useState("");
  const [portInput, setPortInput] = useState("443");
  const [protocolInput, setProtocolInput] = useState<"http" | "https">("https");
  const [nameInput, setNameInput] = useState("");
  const [probing, setProbing] = useState(false);
  const [probeResult, setProbeResult] = useState<{
    success: boolean;
    message: string;
    rtt?: number | null;
  } | null>(null);

  const handleProbeAndAddServer = async (e: React.FormEvent) => {
    e.preventDefault();
    const host = hostInput.trim();
    const port = parseInt(portInput, 10);

    if (!host) {
      setProbeResult({ success: false, message: "Host atau alamat IP wajib diisi." });
      return;
    }

    if (isNaN(port) || port <= 0 || port > 65535) {
      setProbeResult({ success: false, message: "Port harus antara 1 dan 65535." });
      return;
    }

    setProbing(true);
    setProbeResult(null);

    try {
      const res = await fetch("/api/speedtest/custom-server", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          host,
          port,
          protocol: protocolInput,
          name: nameInput.trim() || undefined,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setProbeResult({
          success: false,
          message: data.error || "Gagal memverifikasi server kustom.",
        });
      } else {
        setProbeResult({
          success: true,
          message: data.message,
          rtt: data.rtt,
        });

        if (onAddCustomServer && data.server) {
          onAddCustomServer(data.server);
          onSelectServer(data.server);
        }

        // Reset form
        setHostInput("");
        setNameInput("");
      }
    } catch {
      setProbeResult({
        success: false,
        message: "Terjadi kesalahan jaringan saat memvalidasi socket TCP server.",
      });
    } finally {
      setProbing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-[calc(100vw-2rem)] sm:max-w-lg max-h-[88vh] p-4 sm:p-6 overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400">
              <Globe2 className="size-5" />
            </div>
            <div>
              <DialogTitle>{t("select_server_title")}</DialogTitle>
              <DialogDescription>
                {t("select_server_subtitle")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Location Detection Bar & GPS Button */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-muted/40 border border-border/60 text-xs gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="p-1.5 rounded-lg bg-rose-100/70 dark:bg-rose-900/40 text-[#800020] dark:text-rose-300 shrink-0">
              <MapPin className="size-3.5" />
            </div>
            <div className="min-w-0">
              <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                {t("location_detected")}
              </div>
              <div className="font-semibold text-foreground text-xs truncate">
                {networkDetails?.city || "Indonesia"}, {networkDetails?.country || "Indonesia"}{" "}
                <span className="text-muted-foreground font-normal">({networkDetails?.connectedVia || "IPv4"})</span>
              </div>
            </div>
          </div>

          {onDetectLocation && (
            <button
              type="button"
              disabled={isDetectingLocation}
              onClick={async () => {
                await onDetectLocation();
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#800020] text-white hover:bg-[#68001a] dark:bg-rose-950 dark:hover:bg-rose-900 text-xs font-semibold flex items-center gap-1.5 cursor-pointer disabled:opacity-50 transition-all shrink-0 shadow-xs"
              title="Deteksi lokasi dan pilih server terdekat"
            >
              {isDetectingLocation ? (
                <>
                  <Loader2 className="size-3 animate-spin" />
                  <span>{t("detecting_location")}</span>
                </>
              ) : (
                <>
                  <LocateFixed className="size-3" />
                  <span>{t("auto_detect_location")}</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 gap-1.5 p-1 rounded-xl bg-muted/60 border border-border/50 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab("standard")}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "standard"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Server className="size-3.5" />
            <span>{t("tab_recommended")} ({DEFAULT_SERVERS.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("custom")}
            className={`py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer ${
              activeTab === "custom"
                ? "bg-card text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Plus className="size-3.5" />
            <span>{t("tab_custom")} ({customServers.length})</span>
          </button>
        </div>

        {/* TAB 1: STANDARD SERVERS */}
        {activeTab === "standard" && (
          <div className="space-y-2 mt-1 animate-in fade-in duration-150">
            {DEFAULT_SERVERS.map((server) => {
              const isSelected = server.id === selectedServer.id;
              const isNearest = nearestServerInfo?.server.id === server.id;
              const distance = getServerDistance ? getServerDistance(server) : null;

              return (
                <button
                  key={server.id}
                  type="button"
                  onClick={() => {
                    onSelectServer(server);
                    onOpenChange(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group cursor-pointer ${
                    isSelected
                      ? "border-[#800020] bg-rose-50/70 dark:bg-rose-950/40 shadow-xs ring-1 ring-[#800020]/20"
                      : "border-border/60 hover:border-rose-300 dark:hover:border-rose-800 hover:bg-muted/40"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-muted text-muted-foreground border border-border/50 shrink-0">
                      {server.flag}
                    </span>
                    <div className="min-w-0">
                      <div className="font-semibold text-foreground text-sm flex items-center gap-2 truncate">
                        <span className="truncate">{server.name}</span>
                        {isNearest && (
                          <span className="text-[10px] font-semibold uppercase px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 shrink-0 flex items-center gap-1">
                            <Sparkles className="size-2.5" />
                            {t("nearest_server")}
                          </span>
                        )}
                        {server.id === "jkt-auto" && (
                          <span className="text-[10px] font-medium uppercase px-1.5 py-0.5 rounded-md bg-rose-100 dark:bg-rose-900 text-rose-900 dark:text-rose-200 shrink-0">
                            Auto
                          </span>
                        )}
                      </div>
                      <div className="text-xs text-muted-foreground truncate flex items-center gap-1.5 mt-0.5">
                        <span>{server.sponsor}</span>
                        {distance !== null && (
                          <>
                            <span>·</span>
                            <span className="font-mono text-emerald-600 dark:text-emerald-400 font-medium">
                              {distance} km
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-2">
                    <div className="text-right">
                      <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400 flex items-center gap-1 justify-end">
                        <Radio className="size-3 animate-pulse" />
                        ~{server.basePing} ms
                      </span>
                    </div>
                    {isSelected && (
                      <div className="size-5 rounded-full bg-[#800020] text-white flex items-center justify-center shrink-0">
                        <Check className="size-3" />
                      </div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* TAB 2: CUSTOM SERVER (DOMAIN/IP & PORT) */}
        {activeTab === "custom" && (
          <div className="space-y-4 mt-1 animate-in fade-in duration-150">
            {/* Create Custom Server Form */}
            <form
              onSubmit={handleProbeAndAddServer}
              className="p-3.5 rounded-xl border border-border/70 bg-card/60 backdrop-blur-md space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("add_new_server")}
                </span>
                {onOpenDomainToIp && (
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      onOpenDomainToIp();
                    }}
                    className="text-[11px] font-medium text-[#800020] dark:text-rose-400 hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <Network className="size-3" />
                    Lookup {t("domain_to_ip")}
                  </button>
                )}
              </div>

              {/* Host and Port Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                <div className="sm:col-span-8 space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground block">
                    {t("host_or_ip_label")}
                  </label>
                  <input
                    type="text"
                    value={hostInput}
                    onChange={(e) => setHostInput(e.target.value)}
                    placeholder={t("host_placeholder")}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#800020] font-mono"
                    required
                  />
                </div>

                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] font-semibold text-muted-foreground block">
                    {t("port_label")}
                  </label>
                  <input
                    type="number"
                    value={portInput}
                    onChange={(e) => setPortInput(e.target.value)}
                    placeholder="443"
                    min={1}
                    max={65535}
                    className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#800020] font-mono"
                    required
                  />
                </div>
              </div>

              {/* Quick Port Chips & Protocol Toggle */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-0.5">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-[10px] text-muted-foreground">{t("quick_ports")}:</span>
                  {COMMON_PORTS.map((p) => (
                    <button
                      key={p}
                      type="button"
                      onClick={() => setPortInput(String(p))}
                      className={`px-2 py-0.5 rounded text-[10px] font-mono border transition-all cursor-pointer ${
                        portInput === String(p)
                          ? "bg-[#800020] text-white border-[#800020]"
                          : "bg-muted/50 border-border/60 text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-1 text-[11px]">
                  <span className="text-[10px] text-muted-foreground mr-1">{t("protocol")}:</span>
                  <button
                    type="button"
                    onClick={() => setProtocolInput("https")}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                      protocolInput === "https"
                        ? "bg-[#800020] text-white border-[#800020]"
                        : "bg-muted/50 border-border/60 text-muted-foreground"
                    }`}
                  >
                    HTTPS
                  </button>
                  <button
                    type="button"
                    onClick={() => setProtocolInput("http")}
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold border transition-all cursor-pointer ${
                      protocolInput === "http"
                        ? "bg-[#800020] text-white border-[#800020]"
                        : "bg-muted/50 border-border/60 text-muted-foreground"
                    }`}
                  >
                    HTTP
                  </button>
                </div>
              </div>

              {/* Optional Label */}
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground block">
                  {t("server_label_optional")}
                </label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  placeholder={t("server_label_placeholder")}
                  className="w-full px-3 py-2 text-xs rounded-lg border border-border bg-background placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-[#800020]"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={probing || !hostInput.trim()}
                className="w-full py-2.5 px-4 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                {probing ? (
                  <>
                    <Loader2 className="size-3.5 animate-spin" />
                    <span>{t("verifying_tcp")}</span>
                  </>
                ) : (
                  <>
                    <Plus className="size-3.5" />
                    <span>{t("probe_and_save")}</span>
                  </>
                )}
              </button>

              {/* Probe Result Feedback */}
              {probeResult && (
                <div
                  className={`p-2.5 rounded-lg border text-xs flex items-start gap-2 ${
                    probeResult.success
                      ? "border-emerald-300 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-200"
                      : "border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/40 text-rose-900 dark:text-rose-200"
                  }`}
                >
                  {probeResult.success ? (
                    <CheckCircle2 className="size-4 shrink-0 text-emerald-600 mt-0.5" />
                  ) : (
                    <AlertCircle className="size-4 shrink-0 text-rose-600 mt-0.5" />
                  )}
                  <div className="space-y-0.5">
                    <div>{probeResult.message}</div>
                    {probeResult.rtt && (
                      <div className="font-mono font-bold text-[11px]">
                        {t("ping")}: {probeResult.rtt} ms
                      </div>
                    )}
                  </div>
                </div>
              )}
            </form>

            {/* List of Saved Custom Servers */}
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-foreground block">
                {t("saved_custom_servers")} ({customServers.length})
              </span>

              {customServers.length === 0 ? (
                <div className="p-4 rounded-xl border border-dashed border-border/70 text-center text-xs text-muted-foreground">
                  {t("no_custom_servers")}
                </div>
              ) : (
                <div className="space-y-2">
                  {customServers.map((srv) => {
                    const isSelected = srv.id === selectedServer.id;
                    const distance = getServerDistance ? getServerDistance(srv) : null;

                    return (
                      <div
                        key={srv.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                          isSelected
                            ? "border-[#800020] bg-rose-50/70 dark:bg-rose-950/40 shadow-xs ring-1 ring-[#800020]/20"
                            : "border-border/60 hover:bg-muted/40"
                        }`}
                      >
                        <div
                          onClick={() => {
                            onSelectServer(srv);
                            onOpenChange(false);
                          }}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                        >
                          <span className="px-2 py-1 rounded-lg text-xs font-mono font-bold bg-muted text-muted-foreground border border-border/50 shrink-0">
                            {srv.flag || "CST"}
                          </span>
                          <div className="min-w-0">
                            <div className="font-semibold text-foreground text-sm flex items-center gap-2 truncate">
                              <span className="truncate">{srv.name}</span>
                              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground">
                                :{srv.port || 443}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground truncate">
                              {srv.sponsor} · {srv.host}
                              {distance !== null && ` · ${distance} km`}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-mono font-medium text-emerald-600 dark:text-emerald-400">
                            ~{srv.basePing} ms
                          </span>

                          {isSelected ? (
                            <div className="size-5 rounded-full bg-[#800020] text-white flex items-center justify-center">
                              <Check className="size-3" />
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => {
                                onSelectServer(srv);
                                onOpenChange(false);
                              }}
                              className="px-2.5 py-1 rounded-lg bg-card border border-border hover:border-[#800020] text-xs font-semibold text-foreground transition-all cursor-pointer"
                            >
                              {t("action_select")}
                            </button>
                          )}

                          {onRemoveCustomServer && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                onRemoveCustomServer(srv.id);
                              }}
                              className="p-1.5 rounded-lg hover:bg-rose-100 dark:hover:bg-rose-950/60 text-muted-foreground hover:text-rose-600 transition-colors cursor-pointer"
                              title="Hapus server kustom"
                            >
                              <Trash2 className="size-3.5" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}