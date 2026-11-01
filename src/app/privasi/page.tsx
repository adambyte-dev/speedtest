"use client";

import { SubpageLayout } from "@/components/layout/subpage-layout";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  Cookie,
  Database,
  EyeOff,
  Lock,
} from "lucide-react";

export default function PrivacyPolicyPage() {
  const principles = [
    {
      icon: EyeOff,
      title: "Tidak Ada Penyimpanan Alamat IP (Zero-Logging)",
      desc: "Alamat IP publik Anda hanya digunakan sementara di memori RAM server selama beberapa detik untuk mengarahkan transmisi paket dan lookup ASN / lokasi kota. Alamat IP tidak pernah dicatat atau disimpan ke basis data persisten.",
    },
    {
      icon: Cookie,
      title: "Bebas Cookie Pelacak Iklan",
      desc: "Pingly tidak menggunakan Google AdSense, Facebook Pixel, atau pelacak pihak ketiga yang memantau profil penjelajahan internet Anda di lintas situs.",
    },
    {
      icon: Database,
      title: "Riwayat Disimpan Murni di Browser Lokal",
      desc: "Semua riwayat hasil uji kecepatan Anda tersimpan di LocalStorage browser perangkat Anda sendiri. Anda memiliki kendali penuh untuk menghapusnya kapan saja dengan satu klik tombol.",
    },
    {
      icon: Lock,
      title: "Enkripsi Penuh dengan TLS 1.3",
      desc: "Seluruh komunikasi antara perangkat Anda dan node edge server dilindungi enkripsi canggih TLS 1.3 untuk mencegah manipulasi dan inspeksi pihak ketiga.",
    },
  ];

  return (
    <SubpageLayout
      title="Kebijakan Privasi & Prinsip Tanpa Logging"
      subtitle="Komitmen transparan Pingly dalam melindungi privasi Anda. Kami percaya bahwa diagnostik jaringan harus akurat tanpa mengorbankan privasi data pribadi."
      breadcrumbs={[
        { label: "Privasi & Hukum" },
        { label: "Kebijakan Privasi" },
      ]}
    >
      {/* 4 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {principles.map((p, i) => {
          const Icon = p.icon;
          return (
            <div
              key={i}
              className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl space-y-2 sm:space-y-2.5 shadow-xs"
            >
              <div className="p-2 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 w-fit">
                <Icon className="size-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground">{p.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{p.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Non-intrusive Ad Banner */}
      <AdSlot variant="leaderboard" slotId="privacy-mid-banner" className="my-2" />

      {/* Detailed Legal Clauses */}
      <div className="p-6 rounded-2xl border border-border/50 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-4 text-xs text-muted-foreground leading-relaxed">
        <h3 className="text-sm font-bold text-foreground">1. Data Teknis yang Diproses Secara Sementara</h3>
        <p>
          Saat Anda memulai pengujian kecepatan, server kami menerima paket data TCP/HTTP yang
          berisi header jaringan standar (seperti IP asal, ukuran buffer TCP, dan User-Agent).
          Data ini murni digunakan untuk menghitung rasio bandwidth (bytes ÷ detik) dan latensi rute.
          Segera setelah sesi pengujian selesai, memori dialokasikan ulang dan data transaksi dibuang.
        </p>

        <h3 className="text-sm font-bold text-foreground">2. Analitik Kinerja Internal</h3>
        <p>
          Kami dapat mencatat data telemetri agregat tanpa pengidentifikasi pribadi (seperti total
          pengujian per wilayah kota dan rata-rata performa server) untuk tujuan penyeimbangan beban
          (load balancing) dan pemeliharaan server agar node tidak mengalami kelebihan beban.
        </p>

        <h3 className="text-sm font-bold text-foreground">3. Kontak Petugas Privasi</h3>
        <p>
          Jika Anda memiliki pertanyaan tentang kebijakan privasi kami atau arsitektur keamanan
          Pingly, Anda dapat menghubungi tim kami melalui email resmi di{" "}
          <strong className="text-foreground">privacy@pingly.net</strong>.
        </p>
      </div>
    </SubpageLayout>
  );
}
