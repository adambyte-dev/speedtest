"use client";

import { SubpageLayout } from "@/components/layout/subpage-layout";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  FileText,
  Scale,
  ShieldCheck,
  Terminal,
} from "lucide-react";

export default function TermsOfServicePage() {
  return (
    <SubpageLayout
      title="Ketentuan Layanan & Kebijakan Penggunaan"
      subtitle="Syarat dan ketentuan penggunaan platform pengujian kecepatan internet Pingly untuk pengguna web, pengembang aplikasi, dan integrasi API."
      breadcrumbs={[
        { label: "Privasi & Hukum" },
        { label: "Ketentuan Layanan" },
      ]}
    >
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl p-4 sm:p-8 space-y-5 sm:space-y-6 text-xs text-muted-foreground leading-relaxed shadow-xs">
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Scale className="size-4 text-[#800020] dark:text-rose-400" />
            1. Penerimaan Ketentuan
          </h3>
          <p>
            Dengan mengakses situs web Pingly atau menggunakan layanan diagnostik jaringan kami
            melalui web maupun CLI, Anda menyetujui untuk terikat oleh Ketentuan Layanan ini. Jika
            Anda tidak menyetujui ketentuan ini, Anda dipersilakan untuk tidak menggunakan platform kami.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <ShieldCheck className="size-4 text-[#800020] dark:text-rose-400" />
            2. Kebijakan Penggunaan Wajar (Fair Use Policy)
          </h3>
          <p>
            Layanan pengujian bandwidth Pingly disediakan secara gratis untuk konsumen umum dan
            administrator sistem. Anda dilarang keras melakukan aktivitas berikut:
          </p>
          <ul className="list-disc list-inside space-y-1 pl-2">
            <li>Menjalankan serangan DDoS, flooding, atau eksploitasi beban terhadap node server Pingly.</li>
            <li>Memanipulasi atau merekayasa paket buatan untuk memalsukan hasil throughput.</li>
            <li>Menggunakan skrip otomatis loop tanpa batas waktu istirahat yang memonopoli bandwidth pengguna lain.</li>
          </ul>
        </section>

        {/* Non-intrusive Ad Strip */}
        <AdSlot variant="strip" slotId="terms-mid-ad" className="my-2" />

        <section className="space-y-2 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <FileText className="size-4 text-[#800020] dark:text-rose-400" />
            3. Batasan Tanggung Jawab & Jaminan
          </h3>
          <p>
            Hasil pengujian kecepatan disediakan berdasarkan kondisi jaringan &quot;sebagaimana adanya&quot; (as-is).
            Faktor-faktor seperti kualitas sinyal Wi-Fi, beban router lokal, antrean ISP, dan rute transit
            internasional dapat memengaruhi hasil setiap detik. Pingly tidak bertanggung jawab atas sengketa
            kontrak antara Anda dan penyedia layanan internet (ISP) pihak ketiga.
          </p>
        </section>

        <section className="space-y-2 pt-4 border-t border-border/40">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Terminal className="size-4 text-[#800020] dark:text-rose-400" />
            4. Hak Kekayaan Intelektual
          </h3>
          <p>
            Nama merek Pingly, logo kelinci (*speed hare*), desain antarmuka, dan algoritma diagnostik
            merupakan hak cipta yang dilindungi undang-undang internasional. Anda dipersilakan membagikan
            tangkapan layar hasil pengujian Anda untuk keperluan pribadi atau laporan ke teknisi ISP Anda.
          </p>
        </section>
      </div>
    </SubpageLayout>
  );
}
