"use client";

import { SubpageLayout } from "@/components/layout/subpage-layout";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  Radio,
  Sparkles,
  Wifi,
  Zap,
} from "lucide-react";

export default function WifiOptimizationGuidePage() {
  const tips = [
    {
      number: "01",
      title: "Gunakan Frekuensi 5 GHz atau 6 GHz untuk Kecepatan Penuh",
      description:
        "Frekuensi 2.4 GHz memiliki jangkauan jauh namun throughput dibatasi sekitar 40-70 Mbps dan rentan interferensi microwave atau bluetooth. Frekuensi 5 GHz dan 6 GHz (Wi-Fi 6/6E) menawarkan kanal lebar bebas gangguan dengan throughput hingga gigabit.",
      badge: "Prioritas Tinggi",
    },
    {
      number: "02",
      title: "Pilih Penempatan Router di Ruang Terbuka & Ketinggian Ideal",
      description:
        "Letakkan router pada ketinggian 1-1.5 meter di area tengah rumah. Hindari menaruh router di dalam lemari tertutup, di lantai, atau di balik dinding beton tebal dan akuarium air yang memblokir gelombang elektromagnetik.",
      badge: "Fisik & Gelombang",
    },
    {
      number: "03",
      title: "Ganti DNS Router ke Anycast Resolvers Berkecepatan Tinggi",
      description:
        "DNS default penyedia ISP sering lambat memproses resolusi nama domain. Ubah pengaturan DNS pada modem/router ke Cloudflare (1.1.1.1 / 1.0.0.1) atau Google Public DNS (8.8.8.8 / 8.8.4.4) untuk memangkas latency lookup hingga 30ms.",
      badge: "Konfigurasi Jaringan",
    },
    {
      number: "04",
      title: "Atur Channel Wi-Fi Manual Bebas Tumpang Tindih",
      description:
        "Jika berada di perumahan atau apartemen padat sinyal tetangga, gunakan aplikasi Wi-Fi Analyzer. Pada 2.4 GHz, pilih channel non-overlapping (Channel 1, 6, atau 11). Pada 5 GHz, pilih channel DFS yang bebas interferensi.",
      badge: "Spektrum RF",
    },
    {
      number: "05",
      title: "Aktifkan Fitur SQM (Smart Queue Management) untuk Mencegah Bufferbloat",
      description:
        "Bufferbloat terjadi saat router menumpuk antrean paket saat ada unduhan besar, menyebabkan lonjakan ping hingga 300ms saat gaming. Aktifkan SQM (Cake atau FQ-CoDel) pada router untuk menjaga ping stabil di bawah 20ms walau jaringan sedang penuh.",
      badge: "Gaming & VoIP",
    },
    {
      number: "06",
      title: "Gunakan Kabel LAN Cat 6 untuk Perangkat Gaming & Workstation",
      description:
        "Untuk aktivitas kritis latensi seperti kompetisi e-sports dan streaming langsung, kabel Ethernet Cat 6 atau Cat 7 selalu mengalahkan sinyal nirkabel terbaik, memberikan jitter 0ms dan zero packet loss.",
      badge: "Koneksi Kabel",
    },
  ];

  return (
    <SubpageLayout
      title="Cara Mempercepat Wi-Fi & Menstabilkan Latensi"
      subtitle="Panduan komprehensif langkah demi langkah untuk menghilangkan gangguan sinyal, mengurangi ping lonjak (bufferbloat), dan memaksimalkan bandwidth internet nirkabel."
      breadcrumbs={[
        { label: "Panduan" },
        { label: "Optimasi Wi-Fi" },
      ]}
    >
      {/* Quick Comparison: 2.4GHz vs 5GHz vs 6GHz */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
        <div className="p-4 rounded-2xl border border-border/60 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Radio className="size-3.5 text-muted-foreground" />
              2.4 GHz
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              Jangkauan Luas
            </span>
          </div>
          <div className="font-mono font-bold text-lg text-foreground">Hingga 70 Mbps</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mampu menembus 2-3 lapis dinding beton tebal, namun rentan lag dan interferensi perangkat rumah tangga.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-[#800020] dark:text-rose-300 flex items-center gap-1.5">
              <Wifi className="size-3.5" />
              5 GHz (Wi-Fi 5 / 6)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-100/70 dark:bg-rose-900/50 text-[#800020] dark:text-rose-300 font-bold">
              Rekomendasi
            </span>
          </div>
          <div className="font-mono font-bold text-lg text-[#800020] dark:text-rose-400">
            Hingga 800+ Mbps
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Kanal lebar, latensi stabil, sangat minim gangguan. Pilihan terbaik untuk streaming 4K dan gaming dalam 1-2 ruangan.
          </p>
        </div>

        <div className="p-4 rounded-2xl border border-border/60 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <Zap className="size-3.5 text-amber-500" />
              6 GHz (Wi-Fi 6E / 7)
            </span>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
              Ultra Cepat
            </span>
          </div>
          <div className="font-mono font-bold text-lg text-foreground">Hingga 2.4 Gbps</div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Spektrum baru bebas interferensi total. Memerlukan perangkat klien dan router generasi mutakhir.
          </p>
        </div>
      </div>

      {/* Non-intrusive Ad Banner */}
      <AdSlot variant="leaderboard" slotId="wifi-mid-banner" className="my-3" />

      {/* Actionable Steps Grid */}
      <div className="space-y-4">
        <h3 className="font-bold text-base text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-[#800020] dark:text-rose-400" />
          6 Langkah Utama Mempercepat Jaringan Wi-Fi Anda
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tips.map((tip, idx) => (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl space-y-2 sm:space-y-2.5 transition-all hover:border-[#800020]/30 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-black text-xl text-[#800020] dark:text-rose-400">
                  {tip.number}
                </span>
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-muted text-muted-foreground border border-border/50">
                  {tip.badge}
                </span>
              </div>
              <h4 className="font-bold text-sm text-foreground leading-snug">{tip.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{tip.description}</p>
            </div>
          ))}
        </div>
      </div>
    </SubpageLayout>
  );
}
