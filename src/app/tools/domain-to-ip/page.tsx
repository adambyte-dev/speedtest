"use client";

import { useState } from "react";
import Link from "next/link";
import { AdSlot } from "@/components/ads/ad-slot";
import { SubpageLayout } from "@/components/layout/subpage-layout";
import { DnsRecordInfo } from "@/types/speed-test";
import {
  ArrowRight,
  Check,
  Copy,
  ExternalLink,
  Globe2,
  HardDrive,
  Info,
  Loader2,
  MapPin,
  Radio,
  Search,
  Server,
  ShieldCheck,
  Zap,
} from "lucide-react";

const POPULAR_DOMAINS = [
  "google.com",
  "cloudflare.com",
  "telkom.co.id",
  "sg.speedtest.net",
  "github.com",
  "wikipedia.org",
];

export default function DomainToIpPage() {
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

  return (
    <SubpageLayout
      title="Domain to IP & DNS Lookup Tool"
      subtitle="Resolusikan nama domain ke alamat IPv4 dan IPv6 murni, periksa rute ASN, lokasi geografis server fisik, dan ukur waktu respons latensi TCP secara akurat."
      breadcrumbs={[
        { label: "Tools" },
        { label: "Domain to IP" },
      ]}
    >
      {/* Interactive Tool Card */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/70 dark:bg-zinc-900/40 backdrop-blur-xl p-5 sm:p-7 shadow-xs space-y-5">
        <div className="space-y-1">
          <h2 className="text-lg font-bold text-foreground">
            Periksa Alamat IP & Catatan DNS
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Ketik nama domain atau alamat IP untuk melihat catatan A (IPv4), AAAA (IPv6), NS, MX, dan ISP penyedia.
          </p>
        </div>

        {/* Input Form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleLookup();
          }}
          className="flex flex-col sm:flex-row gap-2.5"
        >
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Contoh: google.com, cloudflare.com, atau 103.191.196.202"
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-border/70 bg-card/70 dark:bg-zinc-900/50 backdrop-blur-md text-sm placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all shadow-xs"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="px-6 py-3 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white text-sm font-semibold shadow-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Memeriksa DNS...</span>
              </>
            ) : (
              <>
                <Search className="size-4" />
                <span>Resolusikan IP</span>
              </>
            )}
          </button>
        </form>

        {/* Popular Domain Quick Chips */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-medium">Domain Populer:</span>
          {POPULAR_DOMAINS.map((dom) => (
            <button
              key={dom}
              type="button"
              onClick={() => handleLookup(dom)}
              className="px-2.5 py-1 rounded-lg text-xs font-mono bg-muted/60 hover:bg-rose-50 dark:hover:bg-rose-950/40 hover:text-[#800020] dark:hover:text-rose-300 border border-border/50 text-foreground transition-all cursor-pointer"
            >
              {dom}
            </button>
          ))}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50/80 dark:bg-rose-950/40 text-sm text-rose-900 dark:text-rose-200">
            {error}
          </div>
        )}

        {/* Result Area */}
        {result && (
          <div className="space-y-5 pt-4 border-t border-border/50 animate-in fade-in duration-200">
            {/* Domain Header Badge & Latency */}
            <div className="p-4 rounded-xl border border-border/60 bg-muted/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="font-mono font-extrabold text-lg sm:text-xl text-foreground">
                    {result.domain}
                  </span>
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                    <ShieldCheck className="size-3.5" />
                    DNS Terverifikasi
                  </span>
                </div>
                {result.ptr && (
                  <p className="text-xs text-muted-foreground font-mono">
                    PTR Record (Reverse DNS): {result.ptr}
                  </p>
                )}
              </div>

              {result.pingMs !== null && result.pingMs !== undefined ? (
                <div className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-card border border-border shadow-2xs">
                  <Radio className="size-4 text-emerald-600 dark:text-emerald-400 animate-pulse" />
                  <div className="text-right">
                    <span className="text-[10px] uppercase font-semibold text-muted-foreground block leading-tight">
                      TCP Handshake Latency
                    </span>
                    <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                      {result.pingMs} ms
                    </span>
                  </div>
                </div>
              ) : (
                <div className="px-3.5 py-2 rounded-xl bg-card border border-border text-xs text-muted-foreground">
                  Port 443 tidak merespons
                </div>
              )}
            </div>

            {/* Resolved IPs Grid */}
            <div className="space-y-3">
              <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
                <Server className="size-4 text-[#800020] dark:text-rose-400" />
                Alamat IP yang Dihasilkan
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                {result.ipv4.map((ip) => (
                  <div
                    key={ip}
                    className="p-3 rounded-xl border border-border/60 bg-card/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-rose-100 dark:bg-rose-950 text-[#800020] dark:text-rose-300">
                        A (IPv4)
                      </span>
                      <span className="font-mono font-bold text-foreground">{ip}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ip)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Salin Alamat IPv4"
                    >
                      {copiedIp === ip ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                ))}

                {result.ipv6.map((ip) => (
                  <div
                    key={ip}
                    className="p-3 rounded-xl border border-border/60 bg-card/60 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-800 dark:text-blue-300">
                        AAAA (IPv6)
                      </span>
                      <span className="font-mono font-bold text-foreground truncate max-w-[200px]">
                        {ip}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => copyToClipboard(ip)}
                      className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                      title="Salin Alamat IPv6"
                    >
                      {copiedIp === ip ? (
                        <Check className="size-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="size-3.5" />
                      )}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* ISP & Geolocation */}
            {result.geo && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground font-semibold text-xs">
                    <Globe2 className="size-3.5" />
                    <span>Provider / ISP & Autonomous System (ASN)</span>
                  </div>
                  <div className="font-bold text-sm text-foreground">
                    {result.geo.isp || "Private ASN"}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    {result.geo.asn || "ASN tidak terdaftar"} {result.geo.org && `· ${result.geo.org}`}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl border border-border/60 bg-muted/20 space-y-1">
                  <div className="flex items-center gap-2 text-muted-foreground font-semibold text-xs">
                    <MapPin className="size-3.5" />
                    <span>Lokasi Geografis Server</span>
                  </div>
                  <div className="font-bold text-sm text-foreground">
                    {result.geo.city ? `${result.geo.city}, ` : ""}
                    {result.geo.country} {result.geo.countryCode && `(${result.geo.countryCode})`}
                  </div>
                  <div className="text-xs text-muted-foreground font-mono">
                    Koordinat: {result.geo.lat.toFixed(4)}, {result.geo.lng.toFixed(4)}
                  </div>
                </div>
              </div>
            )}

            {/* Additional DNS Records (MX & NS) */}
            {(result.mx?.length || result.ns?.length) ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {result.ns && result.ns.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 space-y-2">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <HardDrive className="size-3.5 text-[#800020] dark:text-rose-400" />
                      NS (Authoritative Name Servers)
                    </span>
                    <ul className="space-y-1 font-mono text-muted-foreground">
                      {result.ns.map((n) => (
                        <li key={n} className="truncate">
                          • {n}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {result.mx && result.mx.length > 0 && (
                  <div className="p-3.5 rounded-xl border border-border/60 bg-card/40 space-y-2">
                    <span className="font-bold text-foreground flex items-center gap-1.5">
                      <ExternalLink className="size-3.5 text-[#800020] dark:text-rose-400" />
                      MX (Mail Exchange Servers)
                    </span>
                    <ul className="space-y-1 font-mono text-muted-foreground">
                      {result.mx.map((m) => (
                        <li key={m.exchange} className="truncate">
                          • Priority {m.priority}: {m.exchange}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : null}

            {/* CTA to run test against this domain */}
            <div className="pt-2">
              <Link
                href={`/?server=${encodeURIComponent(result.domain)}`}
                className="w-full py-3 px-5 rounded-xl bg-[#800020] hover:bg-[#68001a] text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <span>Uji Kecepatan Internet Menggunakan Target Server Ini</span>
                <ArrowRight className="size-4" />
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Mid-page Ad Slot */}
      <AdSlot
        variant="leaderboard"
        slotId="domain-tool-mid-banner"
        className="my-2"
      />

      {/* Educational Article Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-6">
        <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/50 dark:bg-zinc-900/30 p-5 space-y-2">
          <div className="size-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center">
            <Zap className="size-4" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            Apa itu DNS & Domain to IP?
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Domain Name System (DNS) adalah buku telepon internet. Manusia mengingat nama domain seperti <code>google.com</code>, namun perangkat jaringan hanya memahami alamat numerik IP (seperti <code>142.250.190.46</code>). Resolusi ini mengubah nama menjadi IP fisik.
          </p>
        </div>

        <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/50 dark:bg-zinc-900/30 p-5 space-y-2">
          <div className="size-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center">
            <Globe2 className="size-4" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            Perbedaan Record A vs AAAA
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Record A (Address) memetakan domain ke alamat IPv4 32-bit (format 4 oktet desimal). Sementara Record AAAA (Quad-A) memetakan domain ke IPv6 128-bit heksadesimal dengan kapasitas pengalamatan global tanpa batas.
          </p>
        </div>

        <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/50 dark:bg-zinc-900/30 p-5 space-y-2">
          <div className="size-8 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center">
            <Info className="size-4" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            Latensi TCP vs Latensi DNS
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Sebelum halaman web terbuka, peramban Anda harus terlebih dahulu meminta DNS lookup (~10-40ms), lalu melakukan TCP 3-Way Handshake (~15-50ms). Pingly mengukur kedua komponen ini secara transparan dan murni.
          </p>
        </div>
      </div>
    </SubpageLayout>
  );
}
