"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackgroundWaves } from "@/components/layout/background-waves";
import { AdSlot } from "@/components/ads/ad-slot";
import { ArrowLeft, ChevronRight, Home } from "lucide-react";

interface SubpageLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
  breadcrumbs?: { label: string; href?: string }[];
}

export function SubpageLayout({
  children,
  title,
  subtitle,
  breadcrumbs = [],
}: SubpageLayoutProps) {
  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden font-sans selection:bg-[#800020]/15 selection:text-[#800020]">
      <BackgroundWaves />

      {/* Main Header */}
      <Header
        onOpenServers={() => {}}
        onOpenResults={() => {}}
        onOpenAbout={() => {}}
        historyCount={0}
      />

      <main className="flex-1 max-w-5xl w-full mx-auto px-3.5 sm:px-6 py-4 sm:py-10 space-y-6 sm:space-y-8 animate-in fade-in duration-300">
        {/* Navigation Breadcrumb Bar */}
        <div className="flex items-center justify-between gap-2 sm:gap-3 text-xs text-muted-foreground pb-2 border-b border-border/40">
          <nav className="flex items-center gap-1.5 flex-wrap min-w-0">
            <Link
              href="/"
              className="flex items-center gap-1 hover:text-foreground transition-colors shrink-0"
            >
              <Home className="size-3.5" />
              <span>Beranda</span>
            </Link>
            <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
            {breadcrumbs.map((b, i) => (
              <span key={i} className="flex items-center gap-1.5 min-w-0">
                {b.href ? (
                  <Link href={b.href} className="hover:text-foreground transition-colors truncate">
                    {b.label}
                  </Link>
                ) : (
                  <span className="font-semibold text-foreground truncate">{b.label}</span>
                )}
                {i < breadcrumbs.length - 1 && (
                  <ChevronRight className="size-3 text-muted-foreground/60 shrink-0" />
                )}
              </span>
            ))}
          </nav>

          {/* Back Button: Compact on mobile, labeled on desktop */}
          <Link
            href="/"
            className="inline-flex sm:hidden items-center justify-center size-7 rounded-full border border-border/60 hover:bg-muted text-foreground transition-all shrink-0"
            aria-label="Kembali ke Speed Test"
            title="Kembali ke Speed Test"
          >
            <ArrowLeft className="size-3.5" />
          </Link>
          <Link
            href="/"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/60 hover:bg-muted text-foreground transition-all text-xs font-medium cursor-pointer shrink-0"
          >
            <ArrowLeft className="size-3" />
            <span>Kembali ke Speed Test</span>
          </Link>
        </div>

        {/* Hero Title Section */}
        <div className="space-y-1.5 sm:space-y-2">
          {/* Top Non-intrusive Subpage Sponsor Strip */}
          <AdSlot variant="strip" slotId="subpage-top-strip" title="Ads Here · Space Iklan & Kemitraan Digital" className="mb-2" />

          <h1 className="text-xl xs:text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
            {title}
          </h1>
          <p className="text-xs xs:text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
            {subtitle}
          </p>
        </div>

        {/* Main Content Body */}
        <div className="space-y-6">{children}</div>

        {/* Non-intrusive Subpage Bottom Ad Slot */}
        <AdSlot variant="leaderboard" slotId="subpage-bottom-banner" className="mt-6" />
      </main>

      <Footer />
    </div>
  );
}
