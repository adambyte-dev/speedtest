"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Activity, Globe2, ShieldCheck, Zap } from "lucide-react";
import { AdSlot } from "@/components/ads/ad-slot";
import { useLanguage } from "@/context/language-context";

interface FooterProps {
  onOpenServers?: () => void;
  onOpenResults?: () => void;
  onOpenAbout?: () => void;
}

function FooterComponent({ onOpenServers, onOpenResults, onOpenAbout }: FooterProps) {
  const { t } = useLanguage();

  return (
    <footer className="w-full border-t border-black/[0.06] dark:border-white/[0.06] bg-card/40 dark:bg-zinc-950/40 backdrop-blur-md transition-colors mt-12">
      {/* Top Value Reassurance Banner */}
      <div className="border-b border-black/[0.05] dark:border-white/[0.05]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            <div className="flex items-start gap-3">
              <div className="size-9 sm:size-10 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0">
                <Zap className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("footer_precision")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {t("footer_precision_desc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="size-9 sm:size-10 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0">
                <ShieldCheck className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("footer_no_tracking")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {t("footer_no_tracking_desc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="size-9 sm:size-10 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0">
                <Globe2 className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("footer_global_edge")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {t("footer_global_edge_desc")}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="size-9 sm:size-10 rounded-xl bg-rose-100/80 dark:bg-rose-950/60 text-[#800020] dark:text-rose-400 flex items-center justify-center shrink-0">
                <Activity className="size-4.5 sm:size-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  {t("footer_jitter_ping")}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                  {t("footer_jitter_ping_desc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 sm:gap-10">
          {/* Brand & Mission */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/" className="inline-flex items-center gap-2.5">
              <div className="relative size-8 flex items-center justify-center shrink-0">
                <Image
                  src="/logo.png"
                  alt="Pingly Logo"
                  width={32}
                  height={32}
                  className="object-contain w-auto h-7 dark:brightness-110"
                />
              </div>
              <span className="font-extrabold text-lg tracking-tight text-foreground">
                Pingly Speed Test
              </span>
            </Link>

            <p className="text-xs text-muted-foreground leading-relaxed max-w-sm">
              {t("footer_mission")}
            </p>

            {/* Operational Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/50 dark:border-emerald-800/40 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{t("footer_all_operational")}</span>
            </div>
          </div>

          {/* Column 1: Fitur Utama */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("footer_main_features")}
            </h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/"
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  {t("speed_test")}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenServers}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  {t("servers")}
                </button>
              </li>
              <li>
                <Link
                  href="/tools/domain-to-ip"
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  {t("domain_to_ip")}
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenResults}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  {t("results")}
                </button>
              </li>
              <li>
                <Link
                  href="/mode"
                  className="hover:text-foreground transition-colors"
                >
                  {t("multi_mode")} vs {t("single_mode")}
                </Link>
              </li>
              <li>
                <Link
                  href="/cli"
                  className="hover:text-foreground transition-colors"
                >
                  CLI & Browser Extension
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 2: Panduan & Info */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("footer_guides")}
            </h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/mode"
                  className="hover:text-foreground transition-colors"
                >
                  Measurement Methodology
                </Link>
              </li>
              <li>
                <Link
                  href="/panduan/mbps-vs-mbyte"
                  className="hover:text-foreground transition-colors"
                >
                  Mbps vs MB/s
                </Link>
              </li>
              <li>
                <Link
                  href="/panduan/wifi"
                  className="hover:text-foreground transition-colors"
                >
                  Wi-Fi Optimization
                </Link>
              </li>
              <li>
                <Link
                  href="/faq"
                  className="hover:text-foreground transition-colors"
                >
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Privasi & Hukum */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold uppercase tracking-wider text-foreground">
              {t("footer_privacy_legal")}
            </h5>
            <ul className="space-y-2 text-xs text-muted-foreground">
              <li>
                <Link
                  href="/privasi"
                  className="hover:text-foreground transition-colors"
                >
                  No-Logging Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-foreground transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/keamanan"
                  className="hover:text-foreground transition-colors"
                >
                  Network Security
                </Link>
              </li>
              <li>
                <button
                  type="button"
                  onClick={onOpenAbout}
                  className="hover:text-foreground transition-colors cursor-pointer"
                >
                  {t("about")}
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Footer Sponsor Strip */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-6">
        <AdSlot
          variant="strip"
          slotId="footer-sponsor-strip"
          title="⚡ Verified Cloud Hosting, CDN & High-Speed Network Partners"
        />
      </div>

      {/* Bottom Bar: Copyright, Tech Stack & Social */}
      <div className="border-t border-black/[0.05] dark:border-white/[0.05] bg-muted/20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
          {/* Copyright */}
          <div>
            {t("footer_rights")}
          </div>

          {/* Tech Stack */}
          <div className="flex items-center gap-1.5 text-[11px]">
            <span>Powered by</span>
            <span className="font-semibold text-foreground">Next.js 16</span>
            <span>&</span>
            <span className="font-semibold text-foreground">shadcn/ui</span>
          </div>

          {/* Social Links (GitHub Only) */}
          <div className="flex items-center gap-2">
            <a
              href="https://github.com/adambyte-dev"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub @adambyte-dev"
              className="size-8 rounded-full border border-border/60 hover:border-rose-400 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors"
            >
              <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export const Footer = React.memo(FooterComponent);
