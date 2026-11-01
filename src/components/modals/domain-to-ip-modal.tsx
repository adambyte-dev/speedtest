"use client";

import { useState } from "react";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DnsRecordInfo, ServerOption } from "@/types/speed-test";
import { useLanguage } from "@/context/language-context";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Globe2,
  HardDrive,
  Loader2,
  MapPin,
  Network,
  Radio,
  Search,
  Server,
  ShieldCheck,
} from "lucide-react";

interface DomainToIpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAsServer?: (server: ServerOption) => void;
}

const POPULAR_DOMAINS = [
  "google.com",
  "cloudflare.com",
  "telkom.co.id",
  "sg.speedtest.net",
  "github.com",
  "dns.google",
];

export function DomainToIpModal({
  open,
  onOpenChange,
  onSelectAsServer,
}: DomainToIpModalProps) {
  const { t } = useLanguage();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<DnsRecordInfo | null>(null);
  const [copiedIp, setCopiedIp] = useState<string | null>(null);

  const handleLookup = async (targetDomain?: string) => {
    const q = (targetDomain || query).trim();
    if (!q) return;

    if (targetDomain) {
      setQuery(targetDomain);
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch(`/api/speedtest/domain-to-ip?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      if (!res.ok || data.status === "error") {
        setError(data.error || "Gagal menyelesaikan DNS domain.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Terjadi kesalahan jaringan saat menghubungi DNS resolver.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedIp(text);
    setTimeout(() => setCopiedIp(null), 2000);
  };

  const handleUseAsServer = () => {
    if (!result || !onSelectAsServer) return;

    const primaryIp = result.ipv4?.[0] || result.ipv6?.[0] || result.domain;
    const serverObj: ServerOption = {
      id: `custom-dns-${Date.now()}`,
      name: `${result.domain} (${result.geo?.isp || "DNS Target"})`,
      location: result.geo?.city ? `${result.geo.city}, ${result.geo.country}` : "Global Target",
      country: result.geo?.country || "Global",
      flag: result.geo?.countryCode || "🌐",
      host: primaryIp,
      port: 443,
      protocol: "https",
      basePing: result.pingMs || 25.0,
      sponsor: result.geo?.isp || result.domain,
      lat: result.geo?.lat || -6.2088,
      lng: result.geo?.lng || 106.8456,
      isCustom: true,
    };

    onSelectAsServer(serverObj);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400">
              <Network className="size-5" />
            </div>
            <div>
              <DialogTitle>{t("domain_to_ip")}</DialogTitle>
              <DialogDescription>
                {t("domain_to_ip_desc")}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        {/* Search Input Bar */}
        <div className="space-y-3 mt-1">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleLookup();
            }}
            className="flex gap-2"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("input_domain_placeholder")}
                className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-border/70 bg-card/70 dark:bg-zinc-900/50 backdrop-blur-md placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading || !query.trim()}
              className="px-4 py-2 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-xs font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 transition-all cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" />
                  <span>Cek...</span>
                </>
              ) : (
                <>
                  <Search className="size-3.5" />
                  <span>Lookup</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Domain Presets */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-muted-foreground">{t("quick_examples")}</span>
            {POPULAR_DOMAINS.map((dom) => (
              <button
                key={dom}
                type="button"
                onClick={() => handleLookup(dom)}
                className="px-2 py-0.5 rounded-md text-[11px] font-mono bg-muted/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-[#800020] dark:hover:text-rose-300 border border-border/50 text-foreground transition-all cursor-pointer"
              >
                {dom}
              </button>
            ))}
          </div>
        </div>

        {/* Error Feedback */}
        {error && (
          <div className="p-3 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 text-xs text-rose-900 dark:text-rose-200">
            {error}
          </div>
        )}

        {/* Results Container */}
        {result && (
          <div className="space-y-3.5 pt-2 border-t border-border/40 animate-in fade-in duration-200">
            {/* Top Identity Card */}
            <div className="p-3.5 rounded-xl border border-border/60 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="space-y-0.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono font-bold text-base text-foreground">
                    {result.domain}
                  </span>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="size-3" />
                    Terselesaikan
                  </span>
                </div>
                {result.ptr && (
                  <p className="text-[11px] text-muted-foreground font-mono truncate max-w-sm">
                    Reverse PTR: {result.ptr}
                  </p>
                )}
              </div>

              {/* Live Ping Badge */}
              {result.pingMs !== null && result.pingMs !== undefined ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-card border border-border shadow-2xs">
                  <Radio className="size-3.5 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block leading-tight">
                      TCP Latency
                    </span>
                    <span className="font-mono font-bold text-xs text-emerald-600 dark:text-emerald-400">
                      {result.pingMs} ms
                    </span>
                  </div>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-xl bg-card border border-border text-[11px] text-muted-foreground">
                  Port 443/80 tertutup atau timeout
                </div>
              )}
            </div>

            {/* Resolved IP Addresses (IPv4 & IPv6) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-foreground">
                <span className="flex items-center gap-1.5">
                  <Server className="size-3.5 text-[#800020] dark:text-rose-400" />
                  Alamat IP Terkait
                </span>
                <span className="text-[11px] font-normal text-muted-foreground">
                  {result.ipv4.length + result.ipv6.length} Record Ditemukan
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                {result.ipv4.map((ip) => (
                  <div
                    key={ip}
                    className="p-2 px-3 rounded-lg border border-border/50 bg-card/60 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-[#800020] dark:text-rose-300">
                        A (IPv4)
                      </span>
                      <span className="font-mono font-semibold text-foreground">{ip}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ip)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Salin IP"
                    >
                      {copiedIp === ip ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                ))}

                {result.ipv6.map((ip) => (
                  <div
                    key={ip}
                    className="p-2 px-3 rounded-lg border border-border/50 bg-card/60 flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2">
                      <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        AAAA (IPv6)
                      </span>
                      <span className="font-mono font-semibold text-foreground truncate max-w-[240px]">
                        {ip}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ip)}
                      className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Salin IPv6"
                    >
                      {copiedIp === ip ? (
                        <Check className="size-3 text-emerald-600" />
                      ) : (
                        <Copy className="size-3" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ISP & Geolocation Details */}
            {result.geo && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl border border-border/50 bg-muted/20 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]">
                    <Globe2 className="size-3" />
                    <span>Provider / ISP & ASN</span>
                  </div>
                  <div className="font-semibold text-foreground truncate">
                    {result.geo.isp || "Private ASN"}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {result.geo.asn || "ASN tidak terdaftar"}
                  </div>
                </div>

                <div className="p-2.5 rounded-xl border border-border/50 bg-muted/20 space-y-0.5">
                  <div className="flex items-center gap-1.5 text-muted-foreground font-medium text-[11px]">
                    <MapPin className="size-3" />
                    <span>Lokasi Server</span>
                  </div>
                  <div className="font-semibold text-foreground truncate">
                    {result.geo.city ? `${result.geo.city}, ` : ""}
                    {result.geo.country} {result.geo.countryCode && `(${result.geo.countryCode})`}
                  </div>
                  <div className="text-[10px] text-muted-foreground font-mono">
                    {result.geo.lat.toFixed(3)}, {result.geo.lng.toFixed(3)}
                  </div>
                </div>
              </div>
            )}

            {/* Additional DNS Records (MX & NS) */}
            {(result.mx?.length || result.ns?.length) ? (
              <div className="space-y-1.5 pt-1">
                <span className="text-[11px] font-semibold text-muted-foreground block">
                  DNS Name Servers & Mail Exchangers
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {result.ns && result.ns.length > 0 && (
                    <div className="p-2 rounded-lg border border-border/50 bg-card/40 space-y-1">
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <HardDrive className="size-3 text-[#800020] dark:text-rose-400" />
                        NS (Name Server)
                      </span>
                      <ul className="space-y-0.5 font-mono text-muted-foreground">
                        {result.ns.slice(0, 3).map((n) => (
                          <li key={n} className="truncate">
                            • {n}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {result.mx && result.mx.length > 0 && (
                    <div className="p-2 rounded-lg border border-border/50 bg-card/40 space-y-1">
                      <span className="font-bold text-foreground flex items-center gap-1">
                        <ExternalLink className="size-3 text-[#800020] dark:text-rose-400" />
                        MX (Mail Server)
                      </span>
                      <ul className="space-y-0.5 font-mono text-muted-foreground">
                        {result.mx.slice(0, 3).map((m) => (
                          <li key={m.exchange} className="truncate">
                            • pri:{m.priority} {m.exchange}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            {/* Action Bar: Use as Speed Test Target */}
            {onSelectAsServer && (
              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleUseAsServer}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  <span>{t("use_as_speedtest_server")}</span>
                  <ArrowRight className="size-4" />
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ad Slot in Modal */}
        <div className="pt-2">
          <AdSlot
            variant="strip"
            slotId="modal-domain-ad"
            title="Ads Here · Pasang Iklan Layanan Domain, Web Hosting & VPS"
            subtitle="Jangkau ribuan network engineer & web developer setiap hari"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
