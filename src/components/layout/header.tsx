"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageToggle } from "@/components/language-toggle";
import { useLanguage } from "@/context/language-context";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Activity, Globe2, History, Info, Menu, Network, Wifi } from "lucide-react";

interface HeaderProps {
  onOpenServers: () => void;
  onOpenResults: () => void;
  onOpenAbout: () => void;
  onOpenDomainToIp?: () => void;
  historyCount?: number;
  serverName?: string;
  serversCount?: number;
}

function HeaderComponent({
  onOpenServers,
  onOpenResults,
  onOpenAbout,
  onOpenDomainToIp,
  historyCount = 0,
  serverName = "Jakarta, ID",
  serversCount = 10,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, lang, setLang, languages } = useLanguage();

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-xl bg-background/85 border-b border-black/[0.05] dark:border-white/[0.06] transition-colors">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-15 flex items-center justify-between">
        {/* Brand Logo & Live Signal */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="group flex items-center gap-2 cursor-pointer text-left bg-transparent border-0 p-0"
          >
            <div className="relative size-9 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="Pingly Logo"
                width={36}
                height={36}
                className="object-contain w-auto h-8 dark:brightness-110"
                priority
              />
            </div>
            <span className="font-extrabold text-lg sm:text-xl tracking-tight text-foreground">
              Pingly
            </span>
          </Link>

          {/* Minimal Live Status Badge */}
          <div className="hidden sm:flex items-center gap-1.5 ml-1 px-2.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200/60 dark:border-emerald-800/40 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
            <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{t("online")}</span>
          </div>
        </div>

        {/* Center Pill Navigation (Desktop) */}
        <nav
          aria-label="Navigasi Utama"
          className="hidden sm:flex items-center gap-1 p-1 rounded-full bg-muted/50 dark:bg-zinc-900/60 border border-black/[0.05] dark:border-white/[0.08] shadow-2xs"
        >
          <Link
            href="/"
            className="px-4 py-1.5 text-xs font-semibold rounded-full bg-[#800020] hover:bg-[#68001a] text-white shadow-xs transition-all cursor-pointer"
          >
            {t("speed_test")}
          </Link>
          <button
            type="button"
            onClick={onOpenServers}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <Globe2 className="size-3.5" />
            <span>{t("servers")}</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-muted text-foreground/80 font-mono">
              {serversCount}
            </span>
          </button>
          {onOpenDomainToIp ? (
            <button
              type="button"
              onClick={onOpenDomainToIp}
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Network className="size-3.5" />
              <span>{t("domain_to_ip")}</span>
            </button>
          ) : (
            <Link
              href="/tools/domain-to-ip"
              className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-colors cursor-pointer"
            >
              <Network className="size-3.5" />
              <span>{t("domain_to_ip")}</span>
            </Link>
          )}
          <button
            type="button"
            onClick={onOpenResults}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <History className="size-3.5" />
            <span>{t("results")}</span>
            {historyCount > 0 && (
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200 font-mono font-semibold">
                {historyCount}
              </span>
            )}
          </button>
          <button
            type="button"
            onClick={onOpenAbout}
            className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium text-muted-foreground hover:text-foreground rounded-full hover:bg-muted/60 transition-colors cursor-pointer"
          >
            <Info className="size-3.5" />
            <span>{t("about")}</span>
          </button>
        </nav>

        {/* Right Actions: Server Tag + Language Toggle + Theme Toggle + Mobile Menu */}
        <div className="flex items-center gap-2">
          {/* Quick Server Indicator Button */}
          <button
            type="button"
            onClick={onOpenServers}
            className="hidden lg:flex items-center gap-2 px-3 py-1 rounded-full border border-border/60 hover:border-rose-300 dark:hover:border-rose-700 bg-background/80 text-xs text-muted-foreground hover:text-foreground transition-all cursor-pointer shadow-2xs"
          >
            <Wifi className="size-3 text-rose-700 dark:text-rose-400" />
            <span className="font-semibold text-foreground truncate max-w-[110px]">
              {serverName}
            </span>
          </button>

          {/* Language Switcher */}
          <LanguageToggle />

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Trigger */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger
              render={
                <Button
                  variant="outline"
                  size="icon-sm"
                  className="sm:hidden rounded-full"
                  aria-label="Buka Menu"
                />
              }
            >
              <Menu className="size-4" />
            </SheetTrigger>

            <SheetContent side="right" className="p-6 flex flex-col justify-between">
              <div>
                <SheetHeader className="mb-6">
                  <div className="flex items-center gap-2.5">
                    <div className="relative size-8 flex items-center justify-center shrink-0">
                      <Image
                        src="/logo.png"
                        alt="Pingly Logo"
                        width={32}
                        height={32}
                        className="object-contain w-auto h-7"
                      />
                    </div>
                    <div>
                      <SheetTitle className="text-base">{t("app_title")}</SheetTitle>
                      <p className="text-xs text-muted-foreground">{t("app_subtitle")}</p>
                    </div>
                  </div>
                </SheetHeader>

                <div className="space-y-1.5">
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-[#800020] dark:text-rose-300 font-semibold text-sm text-left"
                  >
                    <Activity className="size-4" />
                    <span>{t("speed_test")}</span>
                  </Link>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenServers();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-muted text-foreground font-medium text-sm text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Globe2 className="size-4 text-muted-foreground" />
                      <span>{t("servers")}</span>
                    </div>
                    <span className="text-xs font-mono text-muted-foreground">{serversCount} Server</span>
                  </button>

                  {onOpenDomainToIp ? (
                    <button
                      type="button"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        onOpenDomainToIp();
                      }}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-muted text-foreground font-medium text-sm text-left transition-colors"
                    >
                      <Network className="size-4 text-muted-foreground" />
                      <span>{t("domain_to_ip")}</span>
                    </button>
                  ) : (
                    <Link
                      href="/tools/domain-to-ip"
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-muted text-foreground font-medium text-sm text-left transition-colors"
                    >
                      <Network className="size-4 text-muted-foreground" />
                      <span>{t("domain_to_ip")}</span>
                    </Link>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenResults();
                    }}
                    className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl hover:bg-muted text-foreground font-medium text-sm text-left transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <History className="size-4 text-muted-foreground" />
                      <span>{t("results")}</span>
                    </div>
                    {historyCount > 0 && (
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-950 text-rose-900 dark:text-rose-200">
                        {historyCount}
                      </span>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenAbout();
                    }}
                    className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl hover:bg-muted text-foreground font-medium text-sm text-left transition-colors"
                  >
                    <Info className="size-4 text-muted-foreground" />
                    <span>{t("about")}</span>
                  </button>

                  {/* Language Selector in Mobile Drawer */}
                  <div className="pt-3 border-t border-border/40 mt-2">
                    <span className="text-[11px] font-semibold text-muted-foreground uppercase px-2 mb-1.5 block">
                      Bahasa / Language
                    </span>
                    <div className="grid grid-cols-2 gap-1.5">
                      {languages.map((l) => (
                        <button
                          key={l.code}
                          type="button"
                          onClick={() => {
                            setLang(l.code);
                            setMobileMenuOpen(false);
                          }}
                          className={`p-2 rounded-lg text-xs flex items-center gap-1.5 transition-colors cursor-pointer ${
                            l.code === lang
                              ? "bg-[#800020] text-white font-semibold"
                              : "bg-muted/50 hover:bg-muted text-foreground"
                          }`}
                        >
                          <span>{l.flag}</span>
                          <span className="truncate">{l.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-border/50 text-xs text-muted-foreground space-y-2">
                <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-medium">
                  <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
                  {t("footer_all_operational")}
                </div>
                <div>Pingly Speed Test v1.0.0 · Next.js 16</div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}

export const Header = React.memo(HeaderComponent);
