"use client";

import { useState } from "react";
import { SubpageLayout } from "@/components/layout/subpage-layout";
import { AdSlot } from "@/components/ads/ad-slot";
import {
  Check,
  Copy,
  Terminal,
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
      os: "Linux & macOS (Bash / Zsh)",
      cmd: "curl -sL https://speedtest.pingly.net/install.sh | bash",
    },
    {
      os: "Windows PowerShell (x64 / ARM)",
      cmd: "iwr -useb https://speedtest.pingly.net/install.ps1 | iex",
    },
    {
      os: "Node.js (NPX Instant Run)",
      cmd: "npx pingly-speedtest --json",
    },
    {
      os: "Go Binary Direct",
      cmd: "go install github.com/pingly/speedtest-cli@latest",
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
        <h3 className="font-bold text-sm text-foreground flex items-center gap-2">
          <Terminal className="size-4 text-[#800020] dark:text-rose-400" />
          Perintah Instalasi & Eksekusi Cepat
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {installCommands.map((item, idx) => (
            <div
              key={idx}
              className="p-3.5 sm:p-4 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2"
            >
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-foreground">{item.os}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(item.cmd, idx)}
                  className="flex items-center gap-1 text-[11px] text-[#800020] dark:text-rose-400 hover:underline cursor-pointer"
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
              <div className="p-2.5 rounded-xl bg-zinc-950 font-mono text-[11px] text-zinc-200 overflow-x-auto select-all border border-zinc-800">
                <code>{item.cmd}</code>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-intrusive Ad Banner */}
      <AdSlot variant="leaderboard" slotId="cli-mid-banner" className="my-3" />

      {/* Terminal Mockup Preview */}
      <div className="rounded-2xl border border-zinc-800 bg-zinc-950 text-zinc-100 overflow-hidden shadow-xl font-mono text-xs">
        {/* Terminal Titlebar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-zinc-900 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <span className="size-3 rounded-full bg-red-500/80 inline-block" />
            <span className="size-3 rounded-full bg-amber-500/80 inline-block" />
            <span className="size-3 rounded-full bg-emerald-500/80 inline-block" />
            <span className="ml-2 text-zinc-400 text-[11px]">user@server:~ pingly --matrix</span>
          </div>
          <span className="text-zinc-500 text-[10px]">Pingly CLI v1.2</span>
        </div>

        {/* Terminal Body */}
        <div className="p-4 sm:p-6 space-y-3 leading-relaxed">
          <div className="text-zinc-400">
            $ <span className="text-white">pingly --server auto --json</span>
          </div>
          <div className="text-rose-400 font-bold">
            Pingly Network Diagnostics Engine [v1.2.0-cli]
          </div>
          <div className="text-zinc-400">
            ISP: Client Network / ISP Auto-Detected | IP: Public Gateway
          </div>
          <div className="text-zinc-400">
            Testing edge node: Jakarta Core 10G (Telkom / PLD) ...
          </div>

          <div className="pt-2 border-t border-zinc-800/80 space-y-1">
            <div className="flex items-center justify-between max-w-sm">
              <span className="text-zinc-400">Latency (Unloaded):</span>
              <span className="text-emerald-400 font-bold">11.20 ms</span>
            </div>
            <div className="flex items-center justify-between max-w-sm">
              <span className="text-zinc-400">Jitter Variance:</span>
              <span className="text-emerald-400 font-bold">1.18 ms</span>
            </div>
            <div className="flex items-center justify-between max-w-sm">
              <span className="text-zinc-400">Download Throughput:</span>
              <span className="text-rose-400 font-bold">92.64 Mbps</span>
            </div>
            <div className="flex items-center justify-between max-w-sm">
              <span className="text-zinc-400">Upload Throughput:</span>
              <span className="text-amber-400 font-bold">33.20 Mbps</span>
            </div>
            <div className="flex items-center justify-between max-w-sm">
              <span className="text-zinc-400">Packet Loss:</span>
              <span className="text-emerald-400 font-bold">0.00 %</span>
            </div>
          </div>

          <div className="text-emerald-400 pt-2 text-[11px]">
            ✓ Benchmark completed successfully in 14.8 seconds.
          </div>
        </div>
      </div>
    </SubpageLayout>
  );
}
