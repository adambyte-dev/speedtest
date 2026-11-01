"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ChevronDown,
  Gauge,
  HelpCircle,
  Laptop,
  Radio,
  Server,
  ShieldCheck,
  Smartphone,
  Tv,
  Wifi,
  Zap,
} from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "Bagaimana cara melakukan tes kecepatan internet di Pingly Speed Test?",
    a: "Cukup klik tombol bulat 'Mulai Test' di bagian atas halaman. Pingly akan secara otomatis mengirimkan paket data stream murni multi-stream ke server terdekat untuk mengukur latensi (ping), variasi jitter, kecepatan unduh (download), dan kecepatan unggah (upload) secara real-time.",
  },
  {
    q: "Berapa kecepatan internet ideal untuk bermain game online, streaming 4K, dan WFH?",
    a: "Untuk streaming video 4K Ultra HD di Netflix atau YouTube dibutuhkan minimal 25–50 Mbps per perangkat. Untuk game online kompetitif (Mobile Legends, PUBG, Valorant, Dota 2), nilai ping rendah (di bawah 30 ms) dan jitter stabil jauh lebih penting dibandingkan kecepatan unduh. Untuk panggilan video HD (Zoom, Google Meet), koneksi 10–20 Mbps dengan upload minimal 5 Mbps sudah sangat stabil.",
  },
  {
    q: "Apa perbedaan antara Mbps (Megabit per detik) dan MB/s (Megabyte per detik)?",
    a: "1 Byte sama dengan 8 bit. Provider internet (ISP) selalu menjual paket dalam satuan Mbps (Megabit per second), sedangkan aplikasi unduhan browser atau Steam menampilkan kecepatan dalam MB/s (Megabyte per second). Jika paket internet Anda 100 Mbps, kecepatan download riil adalah 100 ÷ 8 = 12.5 MB/s.",
  },
  {
    q: "Mengapa hasil speed test di Pingly berbeda dengan aplikasi lain?",
    a: "Banyak speed test menggunakan algoritma kompresi atau kurva sinus sintetis buatan yang memanipulasi angka agar terlihat lebih tinggi demi kepuasan pemasaran. Pingly menggunakan stream data pseudorandom entropi tinggi tanpa kompresi yang tidak dapat dimanipulasi oleh proxy ISP, mencerminkan kapasitas fisik pipa internet Anda yang sebenarnya.",
  },
  {
    q: "Apa perbedaan Mode Multi dan Mode Tunggal (Single)?",
    a: "Mode Multi membuka beberapa socket TCP paralel secara simultan untuk menguji kapasitas bandwidth puncak maksimum pipa broadband Anda. Mode Tunggal menguji throughput satu koneksi socket tunggal, sangat ideal untuk mensimulasikan unduhan file tunggal atau panggilan video satu lawan satu.",
  },
  {
    q: "Bagaimana cara mengatasi internet atau Wi-Fi yang lambat?",
    a: "1) Pindahkan perangkat lebih dekat ke router Wi-Fi. 2) Gunakan frekuensi Wi-Fi 5 GHz atau 6 GHz dibanding 2.4 GHz yang padat. 3) Gunakan kabel LAN Ethernet untuk latensi terendah. 4) Restart router secara berkala untuk membersihkan memori buffer. 5) Cek aplikasi latar belakang yang mengonsumsi bandwidth.",
  },
];

const ISP_BENCHMARKS = [
  { provider: "Telkomsel / IndiHome", tech: "Fiber FTTH & 5G/4G", avgPing: "12 - 25 ms", typicalSpeed: "30 - 300 Mbps", peering: "Direct OpenIXP & Telkom Anycast" },
  { provider: "Biznet Networks", tech: "Pure Fiber FTTH / Metro", avgPing: "8 - 18 ms", typicalSpeed: "50 - 500 Mbps", peering: "Direct IIX & Global Tier-1" },
  { provider: "MyRepublic", tech: "Ultra Fiber FTTH", avgPing: "9 - 20 ms", typicalSpeed: "50 - 500 Mbps", peering: "Low-latency Gaming Route" },
  { provider: "First Media (Link Net)", tech: "Hybrid Fiber Coaxial / FTTH", avgPing: "15 - 32 ms", typicalSpeed: "30 - 300 Mbps", peering: "Local Cache & CDG Hub" },
  { provider: "XL Axiata / XL Satu", tech: "FTTH & 4.5G/5G LTE", avgPing: "14 - 30 ms", typicalSpeed: "30 - 200 Mbps", peering: "Direct Transit Singapore" },
  { provider: "Indosat Ooredoo Hutchison", tech: "FTTH HiFi & 4G/5G", avgPing: "15 - 35 ms", typicalSpeed: "30 - 250 Mbps", peering: "BGP Anycast & APJII IIX" },
];

export function SeoContentSection() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 text-foreground" aria-labelledby="seo-heading">
      {/* Main Educational Header */}
      <div className="border-b border-border/50 pb-5 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/60 text-[#800020] dark:text-rose-300 text-xs font-semibold">
          <ShieldCheck className="size-3.5" />
          <span>Panduan Lengkap & Metodologi Pengujian Jaringan</span>
        </div>
        <h2 id="seo-heading" className="text-xl sm:text-3xl font-extrabold tracking-tight">
          Pingly Speed Test: Uji Kecepatan Internet Akurat & Transparan di Indonesia
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-4xl">
          Platform telemetri diagnostik internet modern untuk mengukur kapasitas unduh (download), unggah (upload), latensi ping, jitter, dan kehilangan paket (packet loss) secara real-time. Didesain untuk memberikan data murni tanpa manipulasi algoritma sintetis bagi seluruh pengguna seluler dan fixed-broadband di Indonesia.
        </p>
      </div>

      {/* 3 Pillar Educational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2.5">
          <div className="size-9 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center">
            <Gauge className="size-4.5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            Download & Upload Bandwidth Riil
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Pingly menguji kapasitas transfer data menggunakan protokol HTTP/2 dan WebSocket multi-stream. Data chunk pseudorandom entropi tinggi mencegah kompresi semu dari router dan modem ISP, menghasilkan angka throughput murni.
          </p>
        </article>

        <article className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2.5">
          <div className="size-9 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center">
            <Activity className="size-4.5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            Latensi Unloaded vs Loaded (Bufferbloat)
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Mengukur latensi saat jaringan santai (unloaded) dan saat pengunduhan serta pengunggahan aktif (loaded). Perbedaan latensi ini mendeteksi <em>bufferbloat</em> yang kerap menjadi penyebab utama lag saat bermain game online.
          </p>
        </article>

        <article className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2.5">
          <div className="size-9 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center">
            <Radio className="size-4.5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            Jaringan Node Edge Anycast Nasional
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Terhubung langsung dengan node server strategis di Jakarta (Cyber 1 IIX & OpenIXP), Surabaya, Medan, Singapura, Tokyo, dan London dengan deteksi jarak geografis Haversine otomatis untuk akurasi maksimal.
          </p>
        </article>
      </div>

      {/* Benchmark Standard Requirements Table */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 space-y-3.5">
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
            <Zap className="size-4 text-[#800020] dark:text-rose-400" />
            Standar Kebutuhan Kecepatan Internet Berdasarkan Aktivitas Digital
          </h3>
          <p className="text-xs text-muted-foreground">
            Gunakan tabel acuan berikut untuk mengevaluasi apakah hasil speed test Anda memenuhi standar kebutuhan aktivitas harian:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3">Aktivitas Digital</th>
                <th className="py-2.5 px-3">Min. Download</th>
                <th className="py-2.5 px-3">Min. Upload</th>
                <th className="py-2.5 px-3">Ping Disarankan</th>
                <th className="py-2.5 px-3">Tingkat Stabilitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Smartphone className="size-3.5 text-muted-foreground" />
                  Browsing & Media Sosial
                </td>
                <td className="py-2.5 px-3">5 - 10 Mbps</td>
                <td className="py-2.5 px-3">2 - 5 Mbps</td>
                <td className="py-2.5 px-3">&lt; 100 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">Dasar</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Laptop className="size-3.5 text-muted-foreground" />
                  Panggilan Video HD (Zoom/Meet)
                </td>
                <td className="py-2.5 px-3">15 - 25 Mbps</td>
                <td className="py-2.5 px-3">5 - 10 Mbps</td>
                <td className="py-2.5 px-3">&lt; 50 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">Tinggi</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Tv className="size-3.5 text-muted-foreground" />
                  Streaming 4K Ultra HD (Netflix)
                </td>
                <td className="py-2.5 px-3">25 - 50 Mbps</td>
                <td className="py-2.5 px-3">5 - 10 Mbps</td>
                <td className="py-2.5 px-3">&lt; 80 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">Sangat Tinggi</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Zap className="size-3.5 text-[#800020] dark:text-rose-400" />
                  Gaming Online Kompetitif (Esports)
                </td>
                <td className="py-2.5 px-3">20 - 50 Mbps</td>
                <td className="py-2.5 px-3">10 - 20 Mbps</td>
                <td className="py-2.5 px-3">&lt; 25 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">Kritis (Zero Jitter)</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Server className="size-3.5 text-muted-foreground" />
                  Live Streaming 1080p60 & Cloud Backup
                </td>
                <td className="py-2.5 px-3">50 - 100 Mbps</td>
                <td className="py-2.5 px-3">25 - 50 Mbps</td>
                <td className="py-2.5 px-3">&lt; 40 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">Kritis</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Indonesian ISP Benchmark Table */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 space-y-3.5">
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
            <Wifi className="size-4 text-[#800020] dark:text-rose-400" />
            Tabel Referensi Provider Internet & ISP Utama di Indonesia
          </h3>
          <p className="text-xs text-muted-foreground">
            Pingly mendukung pengujian otomatis pada jaringan seluruh penyedia layanan internet terkemuka di tanah air:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3">Provider / ISP</th>
                <th className="py-2.5 px-3">Teknologi Jaringan</th>
                <th className="py-2.5 px-3">Latensi Rata-rata</th>
                <th className="py-2.5 px-3">Rentang Paket</th>
                <th className="py-2.5 px-3">Karakteristik Peering</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-sans">
              {ISP_BENCHMARKS.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-foreground">{item.provider}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{item.tech}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{item.avgPing}</td>
                  <td className="py-2.5 px-3 font-mono">{item.typicalSpeed}</td>
                  <td className="py-2.5 px-3 text-muted-foreground text-[11px]">{item.peering}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search-Optimized FAQ Accordion (Directly maps to FAQPage Schema) */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
            <HelpCircle className="size-4 text-[#800020] dark:text-rose-400" />
            Pertanyaan yang Sering Diajukan (FAQ) Seputar Tes Kecepatan Internet
          </h3>
          <p className="text-xs text-muted-foreground">
            Jawaban lengkap seputar cara kerja pengujian, metrik teknis, dan tips memaksimalkan kecepatan Wi-Fi Anda.
          </p>
        </div>

        <div className="divide-y divide-border/50">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between gap-3 text-left group cursor-pointer"
                >
                  <span className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#800020] dark:text-rose-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-2 text-xs text-muted-foreground leading-relaxed pr-4 animate-in fade-in duration-200">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Link Footer to In-Depth Guides */}
        <div className="pt-3 border-t border-border/40 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Pelajari Lebih Lanjut:</span>
          <Link href="/panduan/mbps-vs-mbyte" className="text-[#800020] dark:text-rose-400 hover:underline">
            Kalkulator Mbps vs MB/s →
          </Link>
          <Link href="/panduan/wifi" className="text-[#800020] dark:text-rose-400 hover:underline">
            Cara Mempercepat Sinyal Wi-Fi →
          </Link>
          <Link href="/tools/domain-to-ip" className="text-[#800020] dark:text-rose-400 hover:underline">
            Alat DNS & Domain to IP Lookup →
          </Link>
          <Link href="/mode" className="text-[#800020] dark:text-rose-400 hover:underline">
            Metodologi Single vs Multi Stream →
          </Link>
        </div>
      </div>
    </section>
  );
}
