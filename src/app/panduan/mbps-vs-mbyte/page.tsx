"use client";

import { useState } from "react";
import { SubpageLayout } from "@/components/layout/subpage-layout";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  Calculator,
  Clock,
  Film,
  Gamepad2,
  Layers,
  Sparkles,
} from "lucide-react";

export default function MbpsVsMBytePage() {
  const [mbpsValue, setMbpsValue] = useState<number>(100);

  // 1 Byte = 8 bits
  const mbytePerSec = Math.round((mbpsValue / 8) * 10) / 10;

  // Time calculations
  const calculateDownloadTime = (sizeMB: number) => {
    const seconds = sizeMB / (mbpsValue / 8);
    if (seconds < 60) return `${Math.ceil(seconds)} detik`;
    if (seconds < 3600) {
      const mins = Math.floor(seconds / 60);
      const secs = Math.ceil(seconds % 60);
      return `${mins} menit ${secs > 0 ? `${secs} detik` : ""}`;
    }
    const hours = Math.floor(seconds / 3600);
    const mins = Math.round((seconds % 3600) / 60);
    return `${hours} jam ${mins > 0 ? `${mins} menit` : ""}`;
  };

  const benchmarks = [
    { name: "Lagu MP3 / Audio Hi-Res (10 MB)", size: 10, icon: Sparkles },
    { name: "Video HD 1080p 1 Jam (1.5 GB)", size: 1500, icon: Film },
    { name: "Film 4K Ultra HD (15 GB)", size: 15000, icon: Film },
    { name: "Game PC / Konsol AAA (65 GB)", size: 65000, icon: Gamepad2 },
  ];

  const referenceTiers = [
    { mbps: 20, mbpsStr: "20 Mbps", mbsStr: "2.5 MB/s", streaming: "1 Layar 4K", gaming: "Baik" },
    { mbps: 50, mbpsStr: "50 Mbps", mbsStr: "6.25 MB/s", streaming: "2 Layar 4K", gaming: "Sangat Baik" },
    { mbps: 100, mbpsStr: "100 Mbps", mbsStr: "12.5 MB/s", streaming: "4 Layar 4K", gaming: "Optimal" },
    { mbps: 250, mbpsStr: "250 Mbps", mbsStr: "31.25 MB/s", streaming: "Multi-device", gaming: "Kompetitif" },
    { mbps: 500, mbpsStr: "500 Mbps", mbsStr: "62.5 MB/s", streaming: "Ultra HD Tak Terbatas", gaming: "Ultra Rendah" },
    { mbps: 1000, mbpsStr: "1 Gbps (1000M)", mbsStr: "125 MB/s", streaming: "Kapasitas Server", gaming: "Gigabit Pro" },
  ];

  return (
    <SubpageLayout
      title="Perbedaan Mbps & MB/s — Panduan & Kalkulator"
      subtitle="Ketahui perbedaan mendasar antara megabit per detik (kecepatan ISP) dan megabyte per detik (kecepatan unduh file asli) beserta kalkulator estimasi waktu unduh."
      breadcrumbs={[
        { label: "Panduan" },
        { label: "Perbedaan Mbps & MB/s" },
      ]}
    >
      {/* Interactive Converter Card */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/50 backdrop-blur-xl p-4 sm:p-6 shadow-xs space-y-5">
        <div className="flex items-center gap-2.5 pb-3 border-b border-border/50">
          <div className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 shrink-0">
            <Calculator className="size-5" />
          </div>
          <div>
            <h3 className="font-bold text-sm sm:text-base text-foreground">
              Kalkulator Konversi Kecepatan & Estimasi Waktu Unduh
            </h3>
            <p className="text-xs text-muted-foreground">
              Geser nilai Mbps paket internetmu untuk melihat kecepatan unduh riil dan perkiraan durasi file.
            </p>
          </div>
        </div>

        {/* Input & Live Results Display */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
          <div className="md:col-span-7 space-y-4">
            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-2">
                <span className="text-muted-foreground">Kecepatan Paket Internet (ISP):</span>
                <span className="font-mono text-base font-extrabold text-[#800020] dark:text-rose-400">
                  {mbpsValue} Mbps
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="1000"
                step="5"
                value={mbpsValue}
                onChange={(e) => setMbpsValue(Number(e.target.value))}
                className="w-full accent-[#800020] cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-muted-foreground font-mono mt-1">
                <span>5 Mbps</span>
                <span>100 Mbps</span>
                <span>500 Mbps</span>
                <span>1000 Mbps (1G)</span>
              </div>
            </div>

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="text-[11px] text-muted-foreground mr-1">Pilihan Cepat:</span>
              {[20, 50, 100, 200, 300, 500, 1000].map((v) => (
                <button
                  key={v}
                  type="button"
                  onClick={() => setMbpsValue(v)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-mono font-medium transition-all cursor-pointer ${
                    mbpsValue === v
                      ? "bg-[#800020] text-white font-bold shadow-xs"
                      : "bg-muted/60 hover:bg-muted text-muted-foreground hover:text-foreground border border-border/50"
                  }`}
                >
                  {v >= 1000 ? "1 Gbps" : `${v}M`}
                </button>
              ))}
            </div>
          </div>

          {/* Equalizer Result Box */}
          <div className="md:col-span-5 p-3.5 sm:p-4 rounded-xl bg-gradient-to-br from-rose-50/80 via-white to-rose-100/40 dark:from-rose-950/30 dark:via-zinc-900/40 dark:to-zinc-900/70 border border-rose-200/50 dark:border-rose-900/30 space-y-1.5 sm:space-y-2 text-center">
            <span className="text-[11px] sm:text-xs text-muted-foreground font-medium uppercase tracking-wider block">
              Kecepatan Unduh Riil (Browser / Steam / IDM)
            </span>
            <div className="font-mono font-black text-2xl xs:text-3xl sm:text-4xl text-[#800020] dark:text-rose-400">
              {mbytePerSec} <span className="text-base sm:text-lg">MB/s</span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-muted-foreground">
              Didapat dari rumus: <strong>{mbpsValue} Mbps ÷ 8 = {mbytePerSec} MB/detik</strong>
            </p>
          </div>
        </div>

        {/* Live Download Times for Typical Files */}
        <div className="pt-3 border-t border-border/40">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 flex items-center gap-1.5">
            <Clock className="size-3.5 text-[#800020] dark:text-rose-400" />
            Estimasi Waktu Unduh pada Kecepatan {mbpsValue} Mbps:
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {benchmarks.map((b, i) => {
              const Icon = b.icon;
              return (
                <div
                  key={i}
                  className="p-3 rounded-xl bg-muted/40 dark:bg-zinc-900/60 border border-border/50 space-y-1.5"
                >
                  <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
                    <Icon className="size-3.5 text-[#800020] dark:text-rose-400" />
                    <span className="truncate">{b.name}</span>
                  </div>
                  <div className="font-mono text-base font-extrabold text-foreground">
                    {calculateDownloadTime(b.size)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Non-intrusive Ad Banner */}
      <AdSlot variant="leaderboard" slotId="mbps-calc-bottom-ad" className="my-2" />

      {/* Explanation Cards: 8 Bits = 1 Byte */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-5 rounded-2xl border border-border/60 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-[#800020]" />
            <h3 className="font-bold text-sm text-foreground">Apa itu Mbps (Megabit per detik)?</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>Mbps</strong> (dengan huruf &apos;b&apos; kecil) adalah satuan kecepatan transfer data
            dalam jaringan telekomunikasi. Seluruh provider internet (ISP) seperti Indihome, Biznet,
            MyRepublic, First Media, dan operator seluler menjual paket mereka dalam satuan <strong>Megabit</strong>.
          </p>
          <div className="p-2.5 rounded-lg bg-muted/50 font-mono text-xs text-muted-foreground">
            1 Megabit (Mb) = 1.000.000 bit pulsa data digital
          </div>
        </div>

        <div className="p-5 rounded-2xl border border-border/60 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2.5">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-500" />
            <h3 className="font-bold text-sm text-foreground">Apa itu MB/s (Megabyte per detik)?</h3>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            <strong>MB/s</strong> (dengan huruf &apos;B&apos; besar) adalah satuan ukuran file penyimpanan yang
            digunakan di komputer, smartphone, Google Chrome, Steam, dan IDM. Dalam ilmu komputer, dibutuhkan
            <strong> 8 bit untuk membentuk 1 Byte</strong> karakter data.
          </p>
          <div className="p-2.5 rounded-lg bg-muted/50 font-mono text-xs text-muted-foreground">
            1 Megabyte (MB) = 8 Megabit (Mb)
          </div>
        </div>
      </div>

      {/* Non-intrusive Ad Strip */}
      <AdSlot variant="strip" slotId="mbps-table-top-ad" className="my-2" />

      {/* Reference Table */}
      <div className="rounded-2xl border border-border/50 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Layers className="size-4 text-[#800020] dark:text-rose-400" />
          Tabel Referensi Paket Kecepatan Populer
        </h3>
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full min-w-[480px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 font-semibold text-muted-foreground">
                <th className="py-2.5 px-3">Paket Langganan ISP</th>
                <th className="py-2.5 px-3">Kecepatan Unduh Riil</th>
                <th className="py-2.5 px-3">Kapasitas Streaming</th>
                <th className="py-2.5 px-3">Pengalaman Gaming</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-sans">
              {referenceTiers.map((t, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-mono font-bold text-foreground">{t.mbpsStr}</td>
                  <td className="py-2.5 px-3 font-mono font-extrabold text-[#800020] dark:text-rose-400">
                    {t.mbsStr}
                  </td>
                  <td className="py-2.5 px-3 text-muted-foreground">{t.streaming}</td>
                  <td className="py-2.5 px-3 text-emerald-600 dark:text-emerald-400 font-medium">
                    {t.gaming}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SubpageLayout>
  );
}
