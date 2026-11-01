"use client";

import { SubpageLayout } from "@/components/layout/subpage-layout";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  CheckCircle2,
  Layers,
  Radio,
  Split,
} from "lucide-react";

export default function ConnectionModesPage() {
  const comparisons = [
    {
      aspect: "Jumlah Socket TCP",
      multi: "4 hingga 8 koneksi paralel simultan",
      single: "1 koneksi soket TCP tunggal",
    },
    {
      aspect: "Tujuan Utama",
      multi: "Mengukur kapasitas pipa bandwidth puncak langganan ISP",
      single: "Mengukur kestabilan transmisi satu sesi data",
    },
    {
      aspect: "Simulasi Aktivitas",
      multi: "Torrent, Steam Game Download, IDM, multi-user di rumah",
      single: "Browsing web biasa, download PDF, single live stream",
    },
    {
      aspect: "Sensitivitas Terhadap Lag",
      multi: "Rendah (koneksi paralel menutupi packet loss kecil)",
      single: "Tinggi (1 packet loss langsung menurunkan kecepatan)",
    },
    {
      aspect: "Rekomendasi Diagnostik",
      multi: "Gunakan untuk memverifikasi apakah ISP menepati janji Mbps",
      single: "Gunakan untuk mendeteksi rute peering yang bermasalah",
    },
  ];

  return (
    <SubpageLayout
      title="Mode Multi vs Tunggal — Panduan Lengkap"
      subtitle="Pahami perbedaan mendasar antara pengujian koneksi paralel multi-thread dan koneksi socket tunggal untuk mengevaluasi performa jaringan internet Anda."
      breadcrumbs={[
        { label: "Fitur" },
        { label: "Mode Multi vs Tunggal" },
      ]}
    >
      {/* 2-Column Visual Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Multi Card */}
        <div className="p-4 sm:p-6 rounded-2xl border border-rose-200/60 dark:border-rose-900/40 bg-rose-50/30 dark:bg-rose-950/20 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-rose-100 dark:bg-rose-950 text-[#800020] dark:text-rose-400">
              <Layers className="size-5" />
            </span>
            <span className="px-2 py-0.5 rounded-full bg-rose-100 text-[#800020] dark:bg-rose-900/60 dark:text-rose-300 font-mono text-[10px] font-bold">
              Default Pingly
            </span>
          </div>

          <h3 className="font-extrabold text-base text-foreground">
            Mode Multi (Koneksi Paralel Multi-Thread)
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mode Multi membuka beberapa jalur transfer TCP secara bersamaan ke server uji. Pendekatan
            ini memaksimalkan kapasitas pipa serat optik ISP dan mencerminkan kondisi rumah saat beberapa
            perangkat (smartphone, smart TV, konsol, laptop) menggunakan internet sekaligus.
          </p>

          <div className="pt-2 border-t border-rose-200/50 dark:border-rose-900/40 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Memaksimalkan utilisasi buffer & jendela TCP</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Mencapai angka Mbps puncak paket langganan</span>
            </div>
          </div>
        </div>

        {/* Single Card */}
        <div className="p-4 sm:p-6 rounded-2xl border border-border/60 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-3">
          <div className="flex items-center justify-between">
            <span className="p-2 rounded-xl bg-muted text-muted-foreground">
              <Radio className="size-5" />
            </span>
            <span className="px-2 py-0.5 rounded-full bg-muted text-muted-foreground font-mono text-[10px] font-medium">
              Single Socket
            </span>
          </div>

          <h3 className="font-extrabold text-base text-foreground">
            Mode Tunggal (Single-Stream Connection)
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mode Tunggal hanya membuka 1 aliran TCP murni dari perangkat Anda ke server. Mode ini
            sangat rentan terhadap latensi dan jitter, menjadikannya tolok ukur terbaik untuk menilai
            kualitas rute peering murni saat membuka satu situs web atau panggilan video tatap muka.
          </p>

          <div className="pt-2 border-t border-border/50 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Mengukur efisiensi algoritma TCP BBR/Cubic</span>
            </div>
            <div className="flex items-center gap-2 text-foreground font-medium">
              <CheckCircle2 className="size-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span>Menunjukkan performa unduhan file tanpa download manager</span>
            </div>
          </div>
        </div>
      </div>

      {/* Non-intrusive Ad Banner */}
      <AdSlot variant="leaderboard" slotId="mode-mid-banner" title="Ads Here · Pasang Iklan Layanan Jaringan & Solusi Cloud" className="my-3" />

      {/* Comparison Matrix Table */}
      <div className="rounded-2xl border border-border/50 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 space-y-3">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Split className="size-4 text-[#800020] dark:text-rose-400" />
          Tabel Komparasi Fitur & Skenario
        </h3>
        <div className="overflow-x-auto rounded-xl border border-border/50">
          <table className="w-full min-w-[480px] text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 font-semibold text-muted-foreground">
                <th className="py-2.5 px-3">Aspek Pengujian</th>
                <th className="py-2.5 px-3 text-[#800020] dark:text-rose-400">Mode Multi</th>
                <th className="py-2.5 px-3">Mode Tunggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-sans">
              {comparisons.map((c, i) => (
                <tr key={i} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-semibold text-foreground">{c.aspect}</td>
                  <td className="py-2.5 px-3 text-foreground">{c.multi}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{c.single}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </SubpageLayout>
  );
}
