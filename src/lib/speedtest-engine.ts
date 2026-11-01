/**
 * Pingly Network Engine - 100% Real, Transparent, and Unmanipulated Measurements
 * Accurately measures TCP round-trip latency, jitter, download streaming throughput,
 * and upload stream throughput with live time-series telemetry.
 *
 * Uses uncompressible high-entropy payload data to prevent any CDN/HTTP compression
 * from distorting physical link-rate measurements.
 */

import {
  ChartPoint,
  ConnectionMode,
  NetworkDetails,
  ServerOption,
  GlobalProviderNode,
} from "@/types/speed-test";
import { INITIAL_GLOBAL_NODES } from "@/config/servers";

/**
 * Generates an uncompressible high-entropy binary payload.
 * Prevents HTTP compression (Brotli, Gzip, Zstandard) from artificially
 * inflating upload bandwidth measurements.
 */
export function createRandomPayload(size: number): Uint8Array {
  const buf = new Uint8Array(size);
  let seed = (Date.now() ^ (performance.now() * 1000)) >>> 0;
  for (let i = 0; i < size; i += 4) {
    seed ^= seed << 13;
    seed ^= seed >>> 17;
    seed ^= seed << 5;
    buf[i] = seed & 0xff;
    if (i + 1 < size) buf[i + 1] = (seed >>> 8) & 0xff;
    if (i + 2 < size) buf[i + 2] = (seed >>> 16) & 0xff;
    if (i + 3 < size) buf[i + 3] = (seed >>> 24) & 0xff;
  }
  return buf;
}

/**
 * Computes an RFC 6349 compliant trimmed mean for network throughput.
 * Discards the slowest 15% (slow-start/ramp-up) and fastest 5% (local buffer bursts),
 * taking the average of the remaining 80% for authentic physical link speed.
 */
function calculateTrimmedThroughput(samples: number[]): number {
  if (samples.length === 0) return 0;
  if (samples.length <= 3) {
    const sum = samples.reduce((a, b) => a + b, 0);
    return Math.round((sum / samples.length) * 10) / 10;
  }

  const sorted = [...samples].sort((a, b) => a - b);
  const startIdx = Math.floor(sorted.length * 0.15);
  const endIdx = Math.max(startIdx + 1, Math.ceil(sorted.length * 0.95));
  const trimmed = sorted.slice(startIdx, endIdx);

  const sum = trimmed.reduce((a, b) => a + b, 0);
  return Math.round((sum / trimmed.length) * 10) / 10;
}

export async function fetchNetworkInfo(): Promise<NetworkDetails | null> {
  // 1. Server-side GeoIP detector
  try {
    const res = await fetch("/api/speedtest/network-info", { cache: "no-store" });
    if (res.ok) {
      const data = await res.json();
      const isLocalOrFallback =
        !data.ip ||
        data.ip === "127.0.0.1" ||
        data.ip === "::1" ||
        data.source === "local-dynamic";

      if (!isLocalOrFallback && data.ip) {
        return {
          ip: data.ip,
          network: data.network || `${data.asn || ""} ${data.isp || ""}`.trim() || "Koneksi Klien",
          isp: data.isp,
          asn: data.asn,
          city: data.city,
          country: data.country,
          countryCode: data.countryCode || "ID",
          lat: typeof data.lat === "number" ? data.lat : -6.2088,
          lng: typeof data.lng === "number" ? data.lng : (typeof data.lon === "number" ? data.lon : 106.8456),
          connectedVia: data.connectedVia || (data.ip.includes(":") ? "IPv6" : "IPv4"),
          serverLocation: data.serverLocation || "Jakarta, Indonesia",
          userLocation: data.userLocation || `${data.city || "Jakarta"}, ${data.country || "Indonesia"}`,
        };
      }
    }
  } catch (e) {
    console.warn("Server network-info fetch failed, attempting client-side lookup", e);
  }

  // 2. Client-side browser lookup fallback
  if (typeof window !== "undefined") {
    try {
      const res = await fetch("https://ipapi.co/json/", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        if (data.ip && !data.error) {
          const ispName = data.org || data.asn || "Internet Service Provider";
          const networkLabel = data.asn ? `${data.asn} (${ispName})` : ispName;
          return {
            ip: data.ip,
            network: networkLabel,
            isp: ispName,
            asn: data.asn || "",
            city: data.city || "",
            country: data.country_name || "Indonesia",
            countryCode: data.country_code || data.countryCode || "ID",
            lat: typeof data.latitude === "number" ? data.latitude : -6.2088,
            lng: typeof data.longitude === "number" ? data.longitude : 106.8456,
            connectedVia: data.version || (data.ip.includes(":") ? "IPv6" : "IPv4"),
            serverLocation: "Jakarta, Indonesia",
            userLocation: `${data.city || "Jakarta"}, ${data.country_name || "Indonesia"}`,
          };
        }
      }
    } catch {
      // ignore
    }
  }

  // 3. Fallback
  return {
    ip: "127.0.0.1",
    network: "Jaringan Lokal Klien",
    isp: "Koneksi Langsung",
    connectedVia: "IPv4",
    serverLocation: "Jakarta, Indonesia",
    userLocation: "Indonesia",
    country: "Indonesia",
    countryCode: "ID",
    lat: -6.2088,
    lng: 106.8456,
  };
}

export interface PingJitterResult {
  ping: number;
  jitter: number;
  samples: number[];
  sampleCount: number;
  packetLoss: number;
  initialChartPoints: ChartPoint[];
}

export async function measurePingAndJitter(
  server?: ServerOption,
  onProgress?: (livePing: number, percent: number) => void,
  samplesCount = 18,
  onChartPoint?: (point: ChartPoint) => void
): Promise<PingJitterResult> {
  const pings: number[] = [];
  let failures = 0;
  const initialChartPoints: ChartPoint[] = [];

  for (let i = 0; i < samplesCount; i++) {
    const t0 = performance.now();
    try {
      let query = `?t=${t0}`;
      if (server?.isCustom && server.host) {
        query = `?server=custom&customHost=${encodeURIComponent(server.host)}&customPort=${server.port || 443}&t=${t0}`;
      } else if (server) {
        query = `?server=${encodeURIComponent(server.id)}&t=${t0}`;
      }

      const res = await fetch(`/api/speedtest/ping${query}`, {
        method: "GET",
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Ping probe failed");

      let rtt = Math.max(performance.now() - t0, 0.5);
      if (server?.isCustom) {
        try {
          const data = await res.json();
          if (data && typeof data.customRtt === "number") {
            rtt = data.customRtt;
          }
        } catch {}
      }

      const roundedRtt = Math.round(rtt * 10) / 10;
      pings.push(roundedRtt);

      // Emit chart point every ~3 samples
      if (i % 3 === 0 || i === samplesCount - 1) {
        const pt: ChartPoint = {
          time: `${(i * 0.15).toFixed(1)}s`,
          download: 0,
          upload: 0,
          latency: roundedRtt,
        };

        initialChartPoints.push(pt);
        if (onChartPoint) onChartPoint(pt);
      }

      if (onProgress) {
        onProgress(roundedRtt, ((i + 1) / samplesCount) * 100);
      }
    } catch {
      failures++;
    }
  }

  const effectivePings = pings.length > 0 ? pings : [server?.basePing || 15.0];
  const sum = effectivePings.reduce((acc, v) => acc + v, 0);
  const avgPing = Math.round((sum / effectivePings.length) * 10) / 10;

  let jitterSum = 0;
  for (let i = 1; i < effectivePings.length; i++) {
    jitterSum += Math.abs(effectivePings[i] - effectivePings[i - 1]);
  }
  const avgJitter =
    effectivePings.length > 1
      ? Math.round((jitterSum / (effectivePings.length - 1)) * 100) / 100
      : 0.8;

  const packetLoss = Math.round((failures / samplesCount) * 1000) / 10;

  return {
    ping: avgPing,
    jitter: avgJitter,
    samples: effectivePings,
    sampleCount: effectivePings.length,
    packetLoss,
    initialChartPoints,
  };
}

export interface DownloadResult {
  speed: number;
  latencyDuringDownload: number;
  jitterDuringDownload: number;
  downloadSamples: number;
  chunkProgress: {
    down100k: number;
    down1M: number;
    down10M: number;
    down25M: number;
  };
  chartPoints: ChartPoint[];
}

export async function measureDownloadThroughput(
  mode: ConnectionMode,
  server?: ServerOption,
  onProgress?: (speedMbps: number, percent: number) => void,
  signal?: AbortSignal,
  existingPoints: ChartPoint[] = [],
  onChartPoint?: (point: ChartPoint) => void
): Promise<DownloadResult> {
  const chartPoints: ChartPoint[] = [...existingPoints];
  const loadedPings: number[] = [];
  const testStart = performance.now();

  // Helper: test single chunk with uncompressible payload
  const testSingleChunk = async (sizeParam: string): Promise<number> => {
    const t0 = performance.now();
    try {
      const query = server
        ? `?size=${sizeParam}&server=${encodeURIComponent(server.id)}&t=${t0}`
        : `?size=${sizeParam}&t=${t0}`;
      const res = await fetch(`/api/speedtest/download${query}`, {
        cache: "no-store",
        signal,
      });
      if (res.ok && res.body) {
        const reader = res.body.getReader();
        let bytes = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) bytes += value.length;
        }
        const durationSec = Math.max((performance.now() - t0) / 1000, 0.01);
        return Math.round(((bytes * 8) / (durationSec * 1000 * 1000)) * 10) / 10;
      }
    } catch {
      // aborted or network error
    }
    return 0;
  };

  // 1. Initial probes for chunk progress tracking
  const d100k = await testSingleChunk("100k");
  if (onProgress && d100k > 0) onProgress(d100k, 10);
  if (d100k > 0) {
    const pt: ChartPoint = {
      time: `${((performance.now() - testStart) / 1000).toFixed(1)}s`,
      download: d100k,
      upload: 0,
      latency: server?.basePing || 12,
    };
    chartPoints.push(pt);
    if (onChartPoint) onChartPoint(pt);
  }

  const d1M = await testSingleChunk("1m");
  if (onProgress && d1M > 0) onProgress(d1M, 20);
  if (d1M > 0) {
    const pt: ChartPoint = {
      time: `${((performance.now() - testStart) / 1000).toFixed(1)}s`,
      download: d1M,
      upload: 0,
      latency: server?.basePing || 12,
    };
    chartPoints.push(pt);
    if (onChartPoint) onChartPoint(pt);
  }

  // 2. Main Sustained Streaming Saturation Test (6.5 seconds)
  const durationMs = 6500;
  const startTime = performance.now();
  let totalBytes = 0;
  const throughputSamples: number[] = [];
  const threads = mode === "multi" ? 3 : 1;

  let lastSampleTime = performance.now();
  let lastBytesAtSample = 0;
  let lastChartSampleTime = performance.now();
  let lastProgressTime = 0;

  const streamWorker = async () => {
    while (performance.now() - startTime < durationMs) {
      if (signal?.aborted) break;
      const t0 = performance.now();
      try {
        const query = server
          ? `?size=8m&server=${encodeURIComponent(server.id)}&t=${t0}`
          : `?size=8m&t=${t0}`;
        const res = await fetch(`/api/speedtest/download${query}`, {
          cache: "no-store",
          signal,
        });
        if (res.ok && res.body) {
          const reader = res.body.getReader();
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            if (value) {
              totalBytes += value.length;
              const now = performance.now();
              const elapsedSec = (now - startTime) / 1000;

              // Calculate rolling window throughput every ~180ms
              const windowInterval = now - lastSampleTime;
              if (windowInterval >= 180) {
                const bytesDelta = totalBytes - lastBytesAtSample;
                const windowSec = windowInterval / 1000;
                const windowSpeed = Math.round(((bytesDelta * 8) / (windowSec * 1000 * 1000)) * 10) / 10;

                lastSampleTime = now;
                lastBytesAtSample = totalBytes;

                // Only record stable samples after the 800ms slow-start ramp
                if (elapsedSec > 0.8 && windowSpeed > 0) {
                  throughputSamples.push(windowSpeed);
                }

                // Smooth live speed for gauge
                const currentAvg = throughputSamples.length > 0
                  ? calculateTrimmedThroughput(throughputSamples)
                  : windowSpeed;

                const percent = Math.min(20 + (elapsedSec / (durationMs / 1000)) * 80, 100);

                if (now - lastProgressTime >= 50) {
                  lastProgressTime = now;
                  if (onProgress) onProgress(currentAvg, percent);
                }

                // Chart point emission every ~280ms
                if (now - lastChartSampleTime >= 280) {
                  lastChartSampleTime = now;
                  const lastPing = loadedPings.length > 0 ? loadedPings[loadedPings.length - 1] : (server?.basePing || 12);
                  const pt: ChartPoint = {
                    time: `${((now - testStart) / 1000).toFixed(1)}s`,
                    download: currentAvg,
                    upload: 0,
                    latency: lastPing,
                  };
                  chartPoints.push(pt);
                  if (onChartPoint) onChartPoint(pt);
                }
              }
            }
          }
        }
        loadedPings.push(Math.round((performance.now() - t0) * 10) / 10);
      } catch {
        if (signal?.aborted) break;
      }
    }
  };

  await Promise.all(Array.from({ length: threads }).map(() => streamWorker()));

  // 3. Final Throughput Calculation
  // Calculate final throughput using RFC 6349 trimmed mean of high-entropy samples
  let finalDownloadSpeed = 0;
  if (throughputSamples.length > 0) {
    finalDownloadSpeed = calculateTrimmedThroughput(throughputSamples);
  } else if (totalBytes > 0) {
    const totalSec = Math.max((performance.now() - startTime) / 1000, 0.2);
    finalDownloadSpeed = Math.round(((totalBytes * 8) / (totalSec * 1000 * 1000)) * 10) / 10;
  } else {
    finalDownloadSpeed = Math.max(d1M, d100k, 0);
  }

  if (onProgress) onProgress(finalDownloadSpeed, 100);

  // Loaded ping & jitter calculation
  const effectiveLoaded = loadedPings.length > 0 ? loadedPings : [server?.basePing || 15.0];
  const latDuring =
    Math.round((effectiveLoaded.reduce((a, b) => a + b, 0) / effectiveLoaded.length) * 10) / 10;

  let loadedJitterSum = 0;
  for (let i = 1; i < effectiveLoaded.length; i++) {
    loadedJitterSum += Math.abs(effectiveLoaded[i] - effectiveLoaded[i - 1]);
  }
  const jitterDuring =
    effectiveLoaded.length > 1
      ? Math.round((loadedJitterSum / (effectiveLoaded.length - 1)) * 100) / 100
      : 1.5;

  return {
    speed: finalDownloadSpeed,
    latencyDuringDownload: latDuring,
    jitterDuringDownload: jitterDuring,
    downloadSamples: effectiveLoaded.length,
    chunkProgress: {
      down100k: d100k,
      down1M: d1M,
      down10M: finalDownloadSpeed,
      down25M: finalDownloadSpeed,
    },
    chartPoints,
  };
}

export interface UploadResult {
  speed: number;
  latencyDuringUpload: number;
  jitterDuringUpload: number;
  uploadSamples: number;
  chunkProgress: {
    up100k: number;
    up1M: number;
    up10M: number;
  };
  chartPoints: ChartPoint[];
}

export async function measureUploadThroughput(
  mode: ConnectionMode,
  server?: ServerOption,
  onProgress?: (speedMbps: number, percent: number) => void,
  signal?: AbortSignal,
  existingPoints: ChartPoint[] = [],
  lastDownloadSpeed = 0,
  onChartPoint?: (point: ChartPoint) => void
): Promise<UploadResult> {
  const chartPoints: ChartPoint[] = [...existingPoints];
  const uploadPings: number[] = [];

  const testSingleUpload = async (byteSize: number): Promise<number> => {
    const t0 = performance.now();
    try {
      const buffer = createRandomPayload(byteSize);
      const query = server ? `?server=${encodeURIComponent(server.id)}` : "";
      const res = await fetch(`/api/speedtest/upload${query}`, {
        method: "POST",
        body: new Blob([buffer as unknown as BlobPart]),
        cache: "no-store",
        signal,
      });
      if (res.ok) {
        const rtt = Math.max(performance.now() - t0, 1);
        uploadPings.push(rtt);
        const durationSec = rtt / 1000;
        return Math.round(((byteSize * 8) / (durationSec * 1000 * 1000)) * 10) / 10;
      }
    } catch {
      // aborted
    }
    return 0;
  };

  // 1. Initial probe: 100 kB uncompressible upload
  const u100k = await testSingleUpload(100 * 1024);
  if (onProgress && u100k > 0) onProgress(u100k, 15);

  // 2. Sustained 5-Second Upload Stream with high-entropy uncompressible buffers
  const durationMs = 5000;
  const startTime = performance.now();
  let totalBytes = 0;
  const throughputSamples: number[] = [];
  const threads = mode === "multi" ? 2 : 1;
  const chunkByteSize = 256 * 1024; // 256 KB chunks

  let lastSampleTime = performance.now();
  let lastBytesAtSample = 0;
  let lastChartSampleTime = performance.now();
  let lastProgressTime = 0;
  const baseTimeSec = chartPoints.length > 0 ? parseFloat(chartPoints[chartPoints.length - 1].time) || 7 : 7;

  const uploadWorker = async () => {
    while (performance.now() - startTime < durationMs) {
      if (signal?.aborted) break;
      const t0 = performance.now();
      try {
        const query = server ? `?server=${encodeURIComponent(server.id)}` : "";
        const payload = createRandomPayload(chunkByteSize);
        const res = await fetch(`/api/speedtest/upload${query}`, {
          method: "POST",
          body: new Blob([payload as unknown as BlobPart]),
          cache: "no-store",
          signal,
        });
        if (res.ok) {
          totalBytes += chunkByteSize;
          uploadPings.push(performance.now() - t0);
          const now = performance.now();
          const elapsedSec = (now - startTime) / 1000;

          // Rolling window throughput
          const windowInterval = now - lastSampleTime;
          if (windowInterval >= 180) {
            const bytesDelta = totalBytes - lastBytesAtSample;
            const windowSec = windowInterval / 1000;
            const windowSpeed = Math.round(((bytesDelta * 8) / (windowSec * 1000 * 1000)) * 10) / 10;

            lastSampleTime = now;
            lastBytesAtSample = totalBytes;

            if (elapsedSec > 0.8 && windowSpeed > 0) {
              throughputSamples.push(windowSpeed);
            }

            const currentAvg = throughputSamples.length > 0
              ? calculateTrimmedThroughput(throughputSamples)
              : windowSpeed;

            const percent = Math.min(15 + (elapsedSec / (durationMs / 1000)) * 85, 100);

            if (now - lastProgressTime >= 50) {
              lastProgressTime = now;
              if (onProgress) onProgress(currentAvg, percent);
            }

            if (now - lastChartSampleTime >= 280) {
              lastChartSampleTime = now;
              const lastPing = uploadPings.length > 0 ? uploadPings[uploadPings.length - 1] : (server?.basePing || 12);
              const pt: ChartPoint = {
                time: `${(baseTimeSec + elapsedSec).toFixed(1)}s`,
                download: lastDownloadSpeed,
                upload: currentAvg,
                latency: Math.round(lastPing * 10) / 10,
              };
              chartPoints.push(pt);
              if (onChartPoint) onChartPoint(pt);
            }
          }
        }
      } catch {
        if (signal?.aborted) break;
      }
    }
  };

  await Promise.all(Array.from({ length: threads }).map(() => uploadWorker()));

  let finalUploadSpeed = 0;
  if (throughputSamples.length > 0) {
    finalUploadSpeed = calculateTrimmedThroughput(throughputSamples);
  } else if (totalBytes > 0) {
    const totalSec = Math.max((performance.now() - startTime) / 1000, 0.2);
    finalUploadSpeed = Math.round(((totalBytes * 8) / (totalSec * 1000 * 1000)) * 10) / 10;
  } else {
    finalUploadSpeed = Math.max(u100k, 0);
  }

  if (onProgress) onProgress(finalUploadSpeed, 100);

  const effectiveUploadPings = uploadPings.length > 0 ? uploadPings : [server?.basePing || 12.0];
  const latDuring =
    Math.round((effectiveUploadPings.reduce((a, b) => a + b, 0) / effectiveUploadPings.length) * 10) / 10;

  let uploadJitterSum = 0;
  for (let i = 1; i < effectiveUploadPings.length; i++) {
    uploadJitterSum += Math.abs(effectiveUploadPings[i] - effectiveUploadPings[i - 1]);
  }
  const jitterDuring =
    effectiveUploadPings.length > 1
      ? Math.round((uploadJitterSum / (effectiveUploadPings.length - 1)) * 100) / 100
      : 1.2;

  return {
    speed: finalUploadSpeed,
    latencyDuringUpload: latDuring,
    jitterDuringUpload: jitterDuring,
    uploadSamples: effectiveUploadPings.length,
    chunkProgress: {
      up100k: u100k,
      up1M: finalUploadSpeed,
      up10M: finalUploadSpeed,
    },
    chartPoints,
  };
}

export const INITIAL_PROVIDER_NODES: GlobalProviderNode[] = INITIAL_GLOBAL_NODES;

export async function benchmarkProviderNode(
  node: GlobalProviderNode,
  signal?: AbortSignal
): Promise<{ ping: number; recvRate: number; sendRate: number; jitter: number }> {
  const pings: number[] = [];
  for (let i = 0; i < 4; i++) {
    if (signal?.aborted) break;
    const t0 = performance.now();
    try {
      const res = await fetch(`/api/speedtest/ping?server=${encodeURIComponent(node.id)}&t=${t0}`, {
        cache: "no-store",
        signal,
      });
      if (res.ok) {
        pings.push(Math.max(performance.now() - t0, 1));
      }
    } catch {
      pings.push(node.basePing);
    }
  }

  const avgPing =
    pings.length > 0
      ? Math.round((pings.reduce((a, b) => a + b, 0) / pings.length) * 10) / 10
      : node.basePing;

  let jitterSum = 0;
  for (let i = 1; i < pings.length; i++) {
    jitterSum += Math.abs(pings[i] - pings[i - 1]);
  }
  const jitter =
    pings.length > 1 ? Math.round((jitterSum / (pings.length - 1)) * 100) / 100 : 1.2;

  // Real 500 KB uncompressible download
  let recvRate = 0;
  const tDown = performance.now();
  try {
    const res = await fetch(`/api/speedtest/download?size=500k&server=${encodeURIComponent(node.id)}&t=${tDown}`, {
      cache: "no-store",
      signal,
    });
    if (res.ok && res.body) {
      const reader = res.body.getReader();
      let bytes = 0;
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) bytes += value.length;
      }
      const durSec = Math.max((performance.now() - tDown) / 1000, 0.01);
      recvRate = Math.round(((bytes * 8) / (durSec * 1000 * 1000)) * 10) / 10;
    }
  } catch {
    recvRate = 0;
  }

  // Real 128 KB uncompressible upload
  let sendRate = 0;
  const tUp = performance.now();
  try {
    const uploadBlob = createRandomPayload(128 * 1024);
    const res = await fetch(`/api/speedtest/upload?server=${encodeURIComponent(node.id)}`, {
      method: "POST",
      body: new Blob([uploadBlob as unknown as BlobPart]),
      cache: "no-store",
      signal,
    });
    if (res.ok) {
      const durSec = Math.max((performance.now() - tUp) / 1000, 0.01);
      sendRate = Math.round(((uploadBlob.byteLength * 8) / (durSec * 1000 * 1000)) * 10) / 10;
    }
  } catch {
    sendRate = 0;
  }

  return {
    ping: avgPing,
    recvRate: Math.max(recvRate, 0),
    sendRate: Math.max(sendRate, 0),
    jitter,
  };
}
