"use client";

import { useState, useMemo } from "react";
import { SubpageLayout } from "@/components/layout/subpage-layout";
import { AdSlot } from "@/components/ads/ad-slot";
import { ChevronDown, Search } from "lucide-react";

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQS: FAQItem[] = [
  {
    id: "faq-1",
    category: "Dasar & Pengukuran",
    question: "Apa perbedaan antara Latensi (Ping) Unloaded dan Loaded?",
    answer:
      "Latensi Unloaded mengukur waktu respons bolak-balik (RTT) saat jaringan sedang menganggur tanpa ada lalu lintas data besar. Sementara Latensi Loaded mengukur respons ping saat saluran sedang dipadati lalu lintas unduhan (download) atau unggahan (upload). Jika latensi loaded melonjak tinggi (misal dari 12ms menjadi 200ms), jaringan Anda mengalami fenomena Bufferbloat.",
  },
  {
    id: "faq-2",
    category: "Stabilitas Jaringan",
    question: "Apa itu Jitter dan mengapa sangat memengaruhi Game atau Zoom?",
    answer:
      "Jitter adalah variansi atau ketidakkonsistenan waktu kedatangan paket data (fluktuasi latensi). Dalam panggilan suara, video conference, dan game online, paket data harus tiba secara ritmis. Jitter di bawah 3ms dianggap sempurna. Jitter di atas 20ms akan menyebabkan suara patah-patah, video glitch, atau karakter game berpindah secara mendadak (teleporting).",
  },
  {
    id: "faq-3",
    category: "Akurasi Hasil",
    question: "Mengapa hasil Pingly bisa berbeda dengan aplikasi uji kecepatan lain?",
    answer:
      "Banyak aplikasi speedtest lokal menguji ke server internal yang berada di jaringan ISP Anda sendiri (intranet peering), yang menunjukkan kapasitas teoritis terbaik. Pingly mengukur throughput riil ke edge node publik tier-1 dan rute transit global, memberikan gambaran nyata kecepatan internet saat Anda membuka YouTube, Netflix, Steam, atau server internasional.",
  },
  {
    id: "faq-4",
    category: "Mode Koneksi",
    question: "Kapan saya harus menggunakan Mode Multi vs Mode Tunggal?",
    answer:
      "Gunakan Mode Multi untuk menguji kapasitas pipa bandwidth puncak koneksi Anda (menggunakan beberapa socket paralel, mirip download manager atau torrent). Gunakan Mode Tunggal untuk menguji performa satu sesi TCP, seperti respon saat browsing web biasa, mengunduh file dokumen, atau streaming tunggal.",
  },
  {
    id: "faq-5",
    category: "Kehilangan Data",
    question: "Apa itu Packet Loss dan apa dampak 1% kehilangan paket?",
    answer:
      "Packet Loss adalah persentase data yang gagal tiba di server tujuan karena antrean router meluap atau gangguan fisik kabel serat optik. Walau 1% terdengar kecil, pada protokol TCP kehilangan 1 paket akan memicu retransmisi dan memotong jendela kecepatan (congestion window) hingga setengahnya, menyebabkan penurunan drastis pada kecepatan transfer.",
  },
  {
    id: "faq-6",
    category: "Metodologi",
    question: "Mengapa pengujian Pingly menggunakan ukuran blok (Chunk Size) bertahap?",
    answer:
      "Pingly menguji throughput mulai dari 100 kB, 1 MB, 10 MB, hingga 25 MB secara bertahap. Hal ini bertujuan untuk mengukur ramp-up time TCP, kemampuan burst buffer awal, dan kecepatan stabil (steady-state) setelah algoritma congestion control mencapai keseimbangan.",
  },
  {
    id: "faq-7",
    category: "Privasi & Keamanan",
    question: "Apakah Pingly menyimpan alamat IP atau riwayat pengetesan saya?",
    answer:
      "Tidak. Pingly menerapkan kebijakan Zero-Logging ketat. Alamat IP hanya diproses secara instan di memori RAM untuk penentuan rute dan lookup ASN tanpa pernah disimpan ke basis data permanen. Riwayat pengujian disimpan secara lokal pada peramban Anda (LocalStorage) dan dapat dihapus kapan saja.",
  },
];

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({
    "faq-1": true,
    "faq-2": true,
  });

  const filteredFaqs = useMemo(() => {
    if (!searchQuery.trim()) return FAQS;
    const q = searchQuery.toLowerCase();
    return FAQS.filter(
      (f) =>
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q) ||
        f.category.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <SubpageLayout
      title="Tanya Jawab (FAQ) & Panduan Teknis"
      subtitle="Temukan jawaban mendalam seputar cara kerja diagnostik kecepatan, istilah latensi loaded, bufferbloat, dan cara membaca hasil pengujian Pingly."
      breadcrumbs={[
        { label: "Bantuan" },
        { label: "Tanya Jawab (FAQ)" },
      ]}
    >
      {/* Search Bar */}
      <div className="relative w-full max-w-xl mx-auto">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Cari pertanyaan (misal: jitter, bufferbloat, IP, multi)..."
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border/60 bg-card/70 dark:bg-zinc-900/50 backdrop-blur-md text-xs placeholder:text-muted-foreground text-foreground focus:outline-none focus:ring-1 focus:ring-[#800020] transition-all shadow-xs"
        />
      </div>

      {/* Non-intrusive Ad Strip */}
      <AdSlot variant="strip" slotId="faq-search-strip" title="Ads Here · Pasang Iklan Produk Jaringan & Bantuan IT" className="my-3 max-w-xl mx-auto" />

      {/* Accordion Questions List */}
      <div className="space-y-3">
        {filteredFaqs.length > 0 ? (
          filteredFaqs.map((faq) => {
            const isOpen = !!openIds[faq.id];
            return (
              <div
                key={faq.id}
                className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl overflow-hidden transition-all shadow-xs"
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  className="w-full p-3.5 sm:p-5 text-left flex items-center justify-between gap-2.5 sm:gap-3 hover:bg-muted/30 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#800020] dark:text-rose-400">
                      {faq.category}
                    </span>
                    <h3 className="font-bold text-xs xs:text-sm sm:text-base text-foreground leading-snug">
                      {faq.question}
                    </h3>
                  </div>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#800020] dark:text-rose-400" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-3.5 sm:px-5 pb-4 sm:pb-5 pt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed border-t border-border/40 animate-in fade-in duration-200">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="py-12 text-center text-xs text-muted-foreground">
            Tidak ada pertanyaan yang sesuai dengan kata kunci &quot;{searchQuery}&quot;.
          </div>
        )}
      </div>
    </SubpageLayout>
  );
}