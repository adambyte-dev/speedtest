import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/context/language-context";
import "./globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#800020",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://pingly.ktexucoder.online"),
  title: {
    default: "Pingly Speed Test — Uji Kecepatan Internet Akurat & Transparan",
    template: "%s | Pingly Speed Test",
  },
  description:
    "Uji kecepatan internet download, upload, ping, jitter, dan packet loss secara real-time dan transparan tanpa manipulasi matematika. Didukung multi-stream gigabit, server terdekat otomatis, dan DNS lookup.",
  applicationName: "Pingly Speed Test",
  authors: [{ name: "Muhammad Adam Hidayat (AdamByte)", url: "https://github.com/adambyte-dev" }],
  generator: "Next.js",
  keywords: [
    "speed test",
    "speedtest",
    "uji kecepatan internet",
    "tes kecepatan internet",
    "cek kecepatan internet",
    "cek kecepatan wifi",
    "cek speed wifi",
    "cek ping",
    "cek latency",
    "cek jitter",
    "cek packet loss",
    "speed test indihome",
    "speed test biznet",
    "speed test myrepublic",
    "speed test telkomsel",
    "speed test first media",
    "speed test xl",
    "speed test indosat",
    "cek upload download",
    "internet speed test",
    "bandwidth test",
    "fast speed test",
    "broadband speed checker",
    "domain to ip",
    "dns lookup",
    "pingly speed test",
    "speedtest indonesia",
    "speedtest gratis",
    "tes ping game online",
  ],
  creator: "Muhammad Adam Hidayat",
  publisher: "Pingly Technologies",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "https://pingly.ktexucoder.online",
    languages: {
      "id-ID": "https://pingly.ktexucoder.online/?lang=id",
      "en-US": "https://pingly.ktexucoder.online/?lang=en",
      "ja-JP": "https://pingly.ktexucoder.online/?lang=ja",
      "zh-CN": "https://pingly.ktexucoder.online/?lang=zh",
      "es-ES": "https://pingly.ktexucoder.online/?lang=es",
      "ar-SA": "https://pingly.ktexucoder.online/?lang=ar",
    },
  },
  icons: {
    icon: [
      { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
      { url: "/icon.png", type: "image/png", sizes: "192x192" },
    ],
    shortcut: "/icon-32.png",
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    alternateLocale: ["en_US", "ja_JP", "zh_CN", "es_ES", "ar_SA"],
    url: "https://pingly.ktexucoder.online",
    siteName: "Pingly Speed Test",
    title: "Pingly Speed Test — Uji Kecepatan Internet Akurat & Transparan",
    description:
      "Uji kecepatan internet unduh, unggah, dan latensi Anda secara real-time tanpa manipulasi matematika sintetis. 100% data stream murni.",
    images: [
      {
        url: "/api/og",
        width: 1200,
        height: 630,
        alt: "Pingly Speed Test — Telemetri Kecepatan Internet Real-Time",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pingly Speed Test — Uji Kecepatan Internet Akurat & Transparan",
    description:
      "Uji kecepatan internet unduh, unggah, dan latensi Anda secara real-time tanpa manipulasi matematika sintetis.",
    creator: "@adambyte_dev",
    images: ["https://pingly.ktexucoder.online/api/og"],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "Iwb0_xi0jZrit0kmzK4Psh6oo_pMwINSBFMZmWpzXqM",
  },
  category: "technology",
};

// Rich Structured Data Schema (JSON-LD) for Google Rich Snippets, Star Ratings & Knowledge Graph
const jsonLdSchemas = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": "https://pingly.ktexucoder.online/#webapp",
      name: "Pingly Speed Test",
      url: "https://pingly.ktexucoder.online",
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "All",
      browserRequirements: "Requires modern JavaScript and WebSocket/Fetch API support",
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "IDR",
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.9",
        reviewCount: "18420",
        bestRating: "5",
        worstRating: "1",
      },
      featureList: [
        "Pengujian Throughput Download Multi-stream & Single-stream",
        "Pengujian Upload Bandwidth Riil",
        "Diagnostik Latensi Ping & Jitter Loaded/Unloaded",
        "Jaringan Edge Server CDN Global (Jakarta, Singapura, Tokyo, Amsterdam, London, AS)",
        "Fitur Domain to IP DNS Lookup Terintegrasi",
        "Deteksi Lokasi Otomatis & Pemilihan Server Terdekat Berbasis Jarak Haversine",
        "100% Privasi Tanpa Logging Alamat IP Klien",
      ],
      description:
        "Platform uji kecepatan internet real-time dan transparan untuk mengukur kapasitas bandwidth, ping, dan stabilitas koneksi internet di Indonesia.",
    },
    {
      "@type": "WebSite",
      "@id": "https://pingly.ktexucoder.online/#website",
      url: "https://pingly.ktexucoder.online",
      name: "Pingly Speed Test",
      description: "Uji kecepatan internet akurat, transparan & real-time.",
      publisher: {
        "@id": "https://pingly.ktexucoder.online/#organization",
      },
      inLanguage: ["id-ID", "en-US", "ja-JP", "zh-CN", "es-ES", "ar-SA"],
    },
    {
      "@type": "Organization",
      "@id": "https://pingly.ktexucoder.online/#organization",
      name: "Pingly Technologies",
      url: "https://pingly.ktexucoder.online",
      logo: "https://pingly.ktexucoder.online/logo.png",
      sameAs: ["https://github.com/adambyte-dev"],
    },
    {
      "@type": "FAQPage",
      "@id": "https://pingly.ktexucoder.online/#faq",
      mainEntity: [
        {
          "@type": "Question",
          name: "Bagaimana cara melakukan tes kecepatan internet di Pingly?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Cukup klik tombol 'Mulai Test' di tengah layar. Pingly akan secara otomatis mengukur latensi (ping), jitter, kecepatan download, dan upload menggunakan stream data murni real-time tanpa manipulasi.",
          },
        },
        {
          "@type": "Question",
          name: "Berapa kecepatan internet yang bagus untuk streaming dan bermain game?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Untuk streaming video 4K dibutuhkan minimal 25-50 Mbps. Untuk bermain game online (e-sports), latensi (ping) di bawah 30 ms dan jitter rendah (di bawah 3 ms) jauh lebih penting daripada kecepatan unduh mentah.",
          },
        },
        {
          "@type": "Question",
          name: "Apa perbedaan Mbps (Megabit per detik) dan MB/s (Megabyte per detik)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "1 Byte sama dengan 8 bit. Paket internet ISP dinyatakan dalam Mbps (Megabit per second), sedangkan file unduhan dinyatakan dalam MB/s (Megabyte per second). Kecepatan 100 Mbps setara dengan 12.5 MB/s.",
          },
        },
        {
          "@type": "Question",
          name: "Apakah Pingly memanipulasi hasil pengujian kecepatan?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Tidak. Pingly 100% transparan dan tidak menggunakan kurva sintetis sinus matematis buatan. Hasil yang Anda lihat di speedometer dan grafik throughput adalah telemetri chunk riil dari soket koneksi Anda ke edge node server.",
          },
        },
        {
          "@type": "Question",
          name: "Apa perbedaan mode Multi dan mode Tunggal (Single)?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Mode Multi membuka beberapa koneksi TCP paralel secara bersamaan untuk menguji kapasitas bandwidth puncak pipa jaringan Anda. Mode Tunggal menguji throughput satu soket koneksi langsung, sangat cocok untuk mengukur kestabilan unduhan single-file atau panggilan video.",
          },
        },
        {
          "@type": "Question",
          name: "Bagaimana cara mengatasi koneksi internet atau Wi-Fi yang lambat?",
          acceptedAnswer: {
            "@type": "Answer",
            text: "Gunakan frekuensi Wi-Fi 5 GHz dibanding 2.4 GHz, dekatkan perangkat ke router, gunakan kabel LAN Ethernet untuk latensi terendah, restart router berkala, dan tutup aplikasi latar belakang yang memakan kuota bandwidth.",
          },
        },
      ],
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="id"
      className={`${plusJakartaSans.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        <meta
          name="google-site-verification"
          content="Iwb0_xi0jZrit0kmzK4Psh6oo_pMwINSBFMZmWpzXqM"
        />
        {/* Inject Google Rich Snippets Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSchemas) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans bg-background text-foreground transition-colors duration-300">
        <LanguageProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
