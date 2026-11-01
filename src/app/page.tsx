"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { BackgroundWaves } from "@/components/layout/background-waves";
import { SpeedGauge } from "@/components/speed-test/speed-gauge";
import { MetricsGrid } from "@/components/speed-test/metrics-grid";
import { ModeSelector } from "@/components/speed-test/mode-selector";
import { NetworkDock } from "@/components/layout/network-dock";
import { ThroughputChart } from "@/components/speed-test/throughput-chart";
import { DetailedReport } from "@/components/speed-test/detailed-report/detailed-report";
import { ActiveProviderBanner } from "@/components/speed-test/active-provider-banner";
import { SeoContentSection } from "@/components/home/seo-content-section";
import { AdSlot } from "@/components/ads/ad-slot";
import { ServersModal } from "@/components/modals/servers-modal";
import { ResultsModal } from "@/components/modals/results-modal";
import { AboutModal } from "@/components/modals/about-modal";
import { DomainToIpModal } from "@/components/modals/domain-to-ip-modal";
import { ShareModal } from "@/components/modals/share-modal";
import { useSpeedTest } from "@/hooks/use-speed-test";
import { DEFAULT_SERVERS } from "@/config/servers";
import { useLanguage } from "@/context/language-context";

export default function Home() {
  const { t, autoDetectFromCountry } = useLanguage();
  const [serversOpen, setServersOpen] = useState(false);
  const [resultsOpen, setResultsOpen] = useState(false);
  const [aboutOpen, setAboutOpen] = useState(false);
  const [domainToIpOpen, setDomainToIpOpen] = useState(false);
  const [shareOpen, setShareOpen] = useState(false);

  const {
    phase,
    connectionMode,
    setConnectionMode,
    metrics,
    currentSpeed,
    progress,
    selectedServer,
    setSelectedServer,
    networkDetails,
    history,
    clearHistory,
    runTest,
    cancelTest,
    resetToEmpty,

    // Proximity & Geolocation API
    isDetectingLocation,
    nearestServerInfo,
    detectAndSelectNearestServer,
    getServerDistance,

    // Custom Server API
    customServers,
    addCustomServer,
    removeCustomServer,

    // Multi-Provider Matrix State & Actions (100% Synced)
    providerNodes,
    providerAccumulation,
    activeDisplayNode,
    selectProviderForMainDisplay,
    testedNodes,
  } = useSpeedTest();

  // Auto-detect language from client's detected country code if not manually locked
  useEffect(() => {
    if (networkDetails.countryCode) {
      autoDetectFromCountry(networkDetails.countryCode);
    }
  }, [networkDetails.countryCode, autoDetectFromCountry]);

  const isTesting = phase === "ping" || phase === "download" || phase === "upload";

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-x-hidden font-sans selection:bg-[#800020]/15 selection:text-[#800020]">
      {/* Ambient Background with Maroon Waves */}
      <BackgroundWaves />

      {/* Standalone Professional Header */}
      <Header
        onOpenServers={() => setServersOpen(true)}
        onOpenResults={() => setResultsOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
        onOpenDomainToIp={() => setDomainToIpOpen(true)}
        historyCount={history.length}
        serverName={selectedServer.name}
        serversCount={DEFAULT_SERVERS.length + customServers.length}
      />

      {/* Main Speed Test Dashboard - Tight & Compact Layout */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-3 sm:px-4 py-3 sm:py-6 space-y-3 sm:space-y-3.5">
        {/* Top Header Ad Strip */}
        <AdSlot variant="strip" slotId="home-top-strip" />

        {/* Active & Best Provider Quick Bar */}
        <ActiveProviderBanner
          activeDisplayNode={activeDisplayNode}
          bestNode={providerAccumulation.bestNode}
          testedNodes={testedNodes}
          selectedServer={selectedServer}
          onSelectProvider={selectProviderForMainDisplay}
          onOpenServersModal={() => setServersOpen(true)}
        />

        {/* Top Unified Hub: Balanced 2-Column Grid (Zero Empty Space) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-3.5 items-stretch">
          {/* Left Column (5 cols): Title, Mode Selector, & Circular Gauge */}
          <div className="lg:col-span-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-xl p-3.5 sm:p-5 shadow-xs flex flex-col items-center justify-between text-center min-w-0">
            {/* Title & Subtitle with Rabbit Logo */}
            <div className="space-y-1 sm:space-y-1.5 flex flex-col items-center">
              <div className="flex items-center gap-2 justify-center">
                <div className="relative size-7 sm:size-9 shrink-0 flex items-center justify-center">
                  <Image
                    src="/logo.png"
                    alt="Pingly Logo"
                    width={36}
                    height={36}
                    className="object-contain w-auto h-6.5 sm:h-8 dark:brightness-110"
                    priority
                  />
                </div>
                <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  Pingly{" "}
                  <span className="text-[#800020] dark:text-rose-400">
                    Speed Test
                  </span>
                </h1>
              </div>
              <p className="text-muted-foreground text-[11px] sm:text-xs font-normal max-w-xs mx-auto">
                {t("app_subtitle")}
              </p>
            </div>

            {/* Mode Selector (Multi vs Tunggal) */}
            <ModeSelector
              mode={connectionMode}
              onModeChange={setConnectionMode}
              disabled={isTesting}
            />

            {/* Compact Speedometer Gauge (Trigger for the unified speed test) */}
            <SpeedGauge
              phase={phase}
              currentSpeed={currentSpeed}
              progress={progress}
              onStart={runTest}
              onCancel={cancelTest}
              onShare={() => setShareOpen(true)}
            />

            {/* Compact Ad Slot below Gauge */}
            <AdSlot variant="compact" slotId="gauge-bottom-ad" className="mt-2" />
          </div>

          {/* Right Column (7 cols): Metrics Cards + Live Chart + Network Dock */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-2 sm:gap-2.5 min-w-0">
            {/* Live Metrics Row (Download, Upload, Ping) */}
            <MetricsGrid phase={phase} metrics={metrics} />

            {/* Live Throughput Chart with Gradient Fill */}
            <ThroughputChart
              phase={phase}
              currentSpeed={currentSpeed}
              metrics={metrics}
            />

            {/* Server & Provider Dock Bar */}
            <NetworkDock
              selectedServer={selectedServer}
              onOpenServerModal={() => setServersOpen(true)}
              providerName={networkDetails.network}
              hasData={metrics.download !== null || metrics.ping !== null || phase !== "idle"}
              onReset={resetToEmpty}
              onShare={() => setShareOpen(true)}
            />
          </div>
        </div>

        {/* Non-intrusive Ad Slot (Mid Page) */}
        <AdSlot variant="leaderboard" slotId="home-mid-banner" className="my-1.5 sm:my-2.5" />

        {/* Bottom Section: Compact Diagnostics Tabs (Overview, Measurements, Providers, Google Maps) */}
        <DetailedReport
          metrics={metrics}
          selectedServer={selectedServer}
          networkDetails={networkDetails}
          phase={phase}
          providerNodes={providerNodes}
          providerAccumulation={providerAccumulation}
          activeDisplayNode={activeDisplayNode}
          onSelectForDisplay={selectProviderForMainDisplay}
          testedNodes={testedNodes}
        />

        {/* Non-intrusive Ad Slot (Pre-Footer) */}
        <AdSlot variant="leaderboard" slotId="home-bottom-banner" className="my-1.5 sm:my-2.5" />

        {/* Dense SEO & Educational Content Section for Google Rank #1 */}
        <SeoContentSection />
      </main>

      {/* Standalone Professional Footer */}
      <Footer
        onOpenServers={() => setServersOpen(true)}
        onOpenResults={() => setResultsOpen(true)}
        onOpenAbout={() => setAboutOpen(true)}
      />

      {/* Dialog Modals */}
      <ServersModal
        open={serversOpen}
        onOpenChange={setServersOpen}
        selectedServer={selectedServer}
        onSelectServer={setSelectedServer}
        customServers={customServers}
        onAddCustomServer={addCustomServer}
        onRemoveCustomServer={removeCustomServer}
        onOpenDomainToIp={() => setDomainToIpOpen(true)}
        networkDetails={networkDetails}
        nearestServerInfo={nearestServerInfo}
        onDetectLocation={detectAndSelectNearestServer}
        isDetectingLocation={isDetectingLocation}
        getServerDistance={getServerDistance}
      />

      <DomainToIpModal
        open={domainToIpOpen}
        onOpenChange={setDomainToIpOpen}
        onSelectAsServer={(srv) => {
          addCustomServer(srv);
          setSelectedServer(srv);
        }}
      />

      <ResultsModal
        open={resultsOpen}
        onOpenChange={setResultsOpen}
        history={history}
        onClearHistory={clearHistory}
      />

      <AboutModal
        open={aboutOpen}
        onOpenChange={setAboutOpen}
      />

      <ShareModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        metrics={metrics}
        selectedServer={selectedServer}
        providerName={networkDetails.network}
      />
    </div>
  );
}