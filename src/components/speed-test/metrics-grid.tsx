"use client";

import React from "react";
import { SpeedTestMetrics, TestPhase } from "@/types/speed-test";
import { MetricCard } from "./metric-card";
import { ArrowDown, ArrowUp, Zap } from "lucide-react";
import { useLanguage } from "@/context/language-context";

interface MetricsGridProps {
  phase: TestPhase;
  metrics: SpeedTestMetrics;
}

function MetricsGridComponent({ phase, metrics }: MetricsGridProps) {
  const { t } = useLanguage();

  return (
    <div className="w-full grid grid-cols-3 gap-2">
      <MetricCard
        icon={<ArrowDown className="size-4 stroke-[2.4]" />}
        label={t("download")}
        value={metrics.download}
        unit="Mbps"
        isActive={phase === "download"}
      />
      <MetricCard
        icon={<ArrowUp className="size-4 stroke-[2.4]" />}
        label={t("upload")}
        value={metrics.upload}
        unit="Mbps"
        isActive={phase === "upload"}
      />
      <MetricCard
        icon={<Zap className="size-4 fill-current stroke-[1.8]" />}
        label={t("ping")}
        value={metrics.ping}
        unit="ms"
        isActive={phase === "ping"}
      />
    </div>
  );
}

export const MetricsGrid = React.memo(MetricsGridComponent, (prev, next) => {
  return (
    prev.phase === next.phase &&
    prev.metrics.download === next.metrics.download &&
    prev.metrics.upload === next.metrics.upload &&
    prev.metrics.ping === next.metrics.ping
  );
});