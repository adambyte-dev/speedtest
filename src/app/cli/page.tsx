"use client";

import { useState } from "react";
import { SubpageLayout } from "@/components/layout/subpage-layout";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  Check,
  Copy,
  Terminal,
  Cpu,
  ShieldCheck,
  Layers,
  Sparkles,
} from "lucide-react";

export default function CLIPage() {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const installCommands = [
    {
      os: "Linux & macOS (Bash / Zsh One-Liner)",
      cmd: "curl -sL https://pingly.ktexucoder.online/cli.sh | bash",
      badge: "Shell Script",
    },
    {
      os: "Windows PowerShell (x64 / ARM)",
      cmd: "irm https://pingly.ktexucoder.online/cli.ps1 | iex",
      badge: "PowerShell",
    },
    {
      os: "Node.js (Cross-Platform Direct)",
      cmd: "curl -sL https://pingly.ktexucoder.online/cli.js | node",
      badge: "Node.js Runtime",
    },
    {
      os: "Python 3 (Universal Linux/Mac/Win)",
      cmd: "curl -sL https://pingly.ktexucoder.online/cli.py | python3",
      badge: "Python 3",
    },
  ];

  const cliFlags = [
    {
      flag: "--server <id>",
      desc: "Menentukan edge server spesifik (contoh: id-jkt, sg-sin, auto).",
      example: "curl -sL https://pingly.ktexucoder.online/cli.sh | bash -s -- --server id-jkt",
    },
    {
      flag: "--mode <single|multi>",
      desc: "Memilih mode pengujian single stream atau multi-stream paralel.",
      example: "node cli.js --mode single",
    },
    {
      flag: "--json",
      desc: "Menghasilkan keluaran telemetri dalam format JSON terstruktur untuk cron / CI/CD.",
      example: "python3 cli.py --json > speed_log.json",
    },
    {
      flag: "--uncompressed",
      desc: "Menjamin payload ber-entropi tinggi tanpa kompresi gzip/brotli untuk akurasi kabel fisik.",
      example: "Aktif secara default",
    },
  ];

  return (
    <SubpageLayout
      title="Pingly CLI — Uji Jaringan Melalui Terminal"
      subtitle="Jalankan pengujian throughput dan pemantauan latensi langsung dari shell server, VPS, atau skrip cron tanpa antarmuka grafis."
      breadcrumbs={[
        { label: "Fitur" },
        { label: "Pingly CLI & API" },
      ]}
    >
      {/* Quick Install Commands */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
            <Terminal className="size-4 text-[#800020] dark:text-rose-400" />
            Perintah Eksekusi Cepat Terminal (Tanpa Instalasi Tambahan)
          </h3>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 font-bold hidden sm:inline-block">
            Online & Siap Pakai
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {installCommands.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2.5 transition-all hover:border-[#800020]/30 shadow-xs"
            >
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="font-semibold text-foreground">{item.os}</span>
                  <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-muted text-muted-foreground border border-border/50">
                    {item.badge}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.cmd, idx)}
                  className="flex items-center gap-1 text-[11px] text-[#800020] dark:text-rose-400 hover:underline cursor-pointer font-medium"
                >
                  {copiedIndex === idx ? (
                    <>
                      <Check className="size-3" />
                      <span>Tersalin!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="size-3" />
                      <span>Salin</span>
                    </>
                  )}
                </button>
              </div>
              <div className="p-2.5 rounded-xl bg-zinc-950 font-mono text-[11px] text-zinc-200 overflow-x-auto select-all border border-zinc-800 flex items-center justify-between gap-2">
                <code>{item.cmd}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
        <div className="p-3.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/40 dark:bg-zinc-900/30 backdrop-blur-md space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <ShieldCheck className="size-4 text-emerald-500" />
            <span>Tanpa Kompresi Palsu</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Data stream acak ber-entropi tinggi mencegah manipulasi gzip/brotli dari CDN.
          </p>
        </div>

        <div className="p-3.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/40 dark:bg-zinc-900/30 backdrop-blur-md space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Cpu className="size-4 text-blue-500" />
            <span>Ringan & Tanpa Root</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Dapat dieksekusi oleh pengguna biasa tanpa memerlukan hak akses administrator (sudo).
          </p>
        </div>

        <div className="p-3.5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/40 dark:bg-zinc-900/30 backdrop-blur-md space-y-1">
          <div className="flex items-center gap-2 text-xs font-bold text-foreground">
            <Layers className="size-4 text-purple-500" />
            <span>Output JSON Otomatis</span>
          </div>
          <p className="text-[11px] text-muted-foreground leading-relaxed">
            Sangat cocok untuk pemantauan uptime jaringan dan log telemetri berkala (crontab).
          </p>
        </div>
      </div>

      {/* Non-intrusive Ad Banner */}
      <AdSlot variant="leaderboard" slotId="cli-mid-banner" className="my-2" />

      {/* Terminal Mockup Preview */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-xl font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500/80 inline-block" />
            <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-zinc-400 text-[11px]">user@server:~ pingly-cli</span>
          </div>
          <span className="text-zinc-500 text-[10px] flex items-center gap-1">
            <Sparkles className="size-2.5 text-amber-400" />
            Pingly CLI v1.2
          </span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 space-y-3 leading-relaxed">
          <div className="text-zinc-400">
            $ <span className="text-white">curl -sL https://pingly.ktexucoder.online/cli.sh | bash</span>
          </div>
          <div className="text-rose-400 font-bold">
            ⚡ ================================================= ⚡
          </div>
          <div className="text-zinc-200 font-semibold">
            PINGLY NETWORK SPEED TEST CLI v1.2 — Real Diagnostics
          </div>
          <div className="text-zinc-400">
            🔍 Mendeteksi informasi jaringan klien...
          </div>
          <div className="text-zinc-300 pl-4 space-y-0.5 text-[11px]">
            <div>• Alamat IP : 103.191.196.202</div>
            <div>• Provider  : PT Pangkalan Lintas Data (AS149934)</div>
            <div>• Lokasi    : Jatiwangi, Indonesia</div>
          </div>

          <div className="text-zinc-400 pt-1">
            📡 Mengukur Latensi (Ping) & Jitter...
          </div>
          <div className="text-zinc-300 pl-4 space-y-0.5 text-[11px]">
            <div>Sample #1: 18.20 ms</div>
            <div>Sample #2: 17.85 ms</div>
            <div>Sample #3: 18.05 ms</div>
            <div className="text-emerald-400 font-bold">✓ Rata-rata Latensi : 18.03 ms</div>
            <div className="text-emerald-400 font-bold">✓ Jitter Variansi  : 0.82 ms</div>
          </div>

          <div className="text-zinc-400 pt-1">
            📥 Menguji Kecepatan Unduh (Download Throughput)...
          </div>
          <div className="text-emerald-400 pl-4 font-bold text-[11px]">
            ✓ Kecepatan Download: 58.40 Mbps (8192 KB dalam 1.12s)
          </div>

          <div className="text-zinc-400 pt-1">
            📤 Menguji Kecepatan Unggah (Upload Throughput)...
          </div>
          <div className="text-emerald-400 pl-4 font-bold text-[11px]">
            ✓ Kecepatan Upload  : 48.20 Mbps (2048 KB dalam 0.34s)
          </div>

          <div className="pt-2 border-t border-zinc-800/80 space-y-1">
            <div className="text-white font-bold text-[11px]">
              📊 HASIL RINGKASAN DIAGNOSA JARINGAN:
            </div>
            <div className="flex items-center justify-between max-w-sm">
              <span className="text-zinc-400">Provider / ISP:</span>
              <span className="text-zinc-200 font-medium">PT Pangkalan Lintas Data</span>
            </div>
            <div className="flex items-center justify-between max-w-sm">
              <span className="text-zinc-400">Ping Latency:</span>
              <span className="text-emerald-400 font-bold">18.03 ms</span>
            </div>
            <div className="flex items-center justify-between max-w-sm">
              <span className="text-zinc-400">Download Speed:</span>
              <span className="text-rose-400 font-bold">58.40 Mbps</span>
            </div>
            <div className="flex items-center justify-between max-w-sm">
              <span className="text-zinc-400">Upload Speed:</span>
              <span className="text-amber-400 font-bold">48.20 Mbps</span>
            </div>
          </div>

          <div className="text-emerald-400 pt-2 text-[11px]">
            ✓ Pengujian selesai secara transparan tanpa manipulasi.
          </div>
        </div>
      </div>

      {/* Parameter Flag Reference Table */}
      <div className="space-y-3 pt-4">
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Terminal className="size-4 text-[#800020] dark:text-rose-400" />
          Daftar Parameter & Flags Pendukung
        </h3>

        <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] overflow-hidden bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md">
          <div className="divide-y divide-border/50 text-xs">
            {cliFlags.map((item, idx) => (
              <div key={idx} className="p-3.5 sm:p-4 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="font-mono font-bold text-[#800020] dark:text-rose-400 bg-rose-50 dark:bg-rose-950/60 px-2 py-0.5 rounded border border-rose-200/50 dark:border-rose-900/50">
                    {item.flag}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs">{item.desc}</p>
                <div className="font-mono text-[10px] text-muted-foreground bg-muted/60 p-2 rounded-lg overflow-x-auto">
                  <code>Contoh: {item.example}</code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
}
