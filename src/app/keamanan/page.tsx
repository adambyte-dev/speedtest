"use client";

import { AdSlot } from "@/components/ads/ad-slot";
import { SubpageLayout } from "@/components/layout/subpage-layout";
import {
  KeyRound,
  Lock,
  Server,
  Shield,
  ShieldCheck,
} from "lucide-react";

export default function SecurityStandardsPage() {
  const securityPillars = [
    {
      icon: Lock,
      title: "Enkripsi Modern TLS 1.3 Mandatori",
      desc: "Semua pengujian unduh, unggah, dan sinyal ping melewati saluran HTTPS terenkripsi TLS 1.3 dengan algoritma kriptografi ChaCha20-Poly1305 dan AES-GCM dengan Perfect Forward Secrecy (PFS).",
    },
    {
      icon: Shield,
      title: "Mitigasi DDoS Otomatis L3/L4/L7",
      desc: "Seluruh node Pingly dilindungi sistem mitigasi anycast cerdas yang mampu menyaring serangan volumetrik hingga multi-Tbps tanpa memutus pengujian pengguna valid.",
    },
    {
      icon: KeyRound,
      title: "Payload Acak Kriptografis Bebas Kompresi",
      desc: "Data chunk yang diunduh dan diunggah dihasilkan secara acak melalui generator pseudorandom entropi tinggi sehingga tidak dapat dikompresi oleh router atau modem ISP untuk memanipulasi angka kecepatan.",
    },
    {
      icon: Server,
      title: "Pengerasan Server (OS Hardening) & Sandboxing",
      desc: "Setiap node server edge berjalan di sistem operasi Linux berbobot minimal dengan kernel BBR TCP yang diperkeras, akses root dinonaktifkan, dan pembaruan keamanan otomatis 24/7.",
    },
  ];

  return (
    <SubpageLayout
      title="Standar Keamanan Jaringan & Node Pingly"
      subtitle="Arsitektur keamanan berlapis yang menjamin integritas transmisi data pengujian, perlindungan privasi perangkat, dan keandalan server tanpa kompromi."
      breadcrumbs={[
        { label: "Privasi & Hukum" },
        { label: "Keamanan Jaringan" },
      ]}
    >
      {/* 4 Security Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {securityPillars.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl space-y-2 sm:space-y-2.5 shadow-xs"
            >
              <div className="p-2 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 w-fit">
                <Icon className="size-4" />
              </div>
              <h3 className="font-bold text-sm text-foreground">{s.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Mid-content Ad Placement */}
      <AdSlot
        variant="leaderboard"
        slotId="security-mid-banner"
        className="my-1"
      />

      {/* Certifications and Cryptographic Guarantees */}
      <div className="rounded-2xl border border-border/50 bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md p-6 space-y-4">
        <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
          <ShieldCheck className="size-4 text-emerald-600 dark:text-emerald-400" />
          Proses Verifikasi Integritas Pengujian
        </h3>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Banyak penyedia layanan internet menggunakan teknik kompresi proxy transparan untuk membuat
          hasil speed test terlihat lebih tinggi dari aslinya. Untuk mencegah kecurangan ini, paket
          data Pingly menggunakan blok binary berdensitas entropi 1.0 (uncompressible data stream),
          memastikan bahwa throughput yang terbaca di layar Anda adalah transmisi kabel fisik riil.
        </p>
      </div>
    </SubpageLayout>
  );
}
