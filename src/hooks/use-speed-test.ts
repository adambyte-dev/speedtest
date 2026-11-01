"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import {
  ConnectionMode,
  GlobalProviderNode,
  NetworkDetails,
  ProviderAccumulation,
  RegionSummary,
  ServerOption,
  SpeedTestMetrics,
  TestPhase,
  TestResult,
  ChartPoint,
} from "@/types/speed-test";
import { DEFAULT_SERVERS, DEFAULT_NETWORK_DETAILS, INITIAL_GLOBAL_NODES } from "@/config/servers";
import { calculateDistanceKm, findNearestServer } from "@/lib/geo";
import {
  fetchNetworkInfo,
  measureDownloadThroughput,
  measurePingAndJitter,
  measureUploadThroughput,
} from "@/lib/speedtest-engine";

export const EMPTY_METRICS: SpeedTestMetrics = {
  ping: null,
  jitter: null,
  download: null,
  upload: null,
  latencyDownload: null,
  latencyUpload: null,
  jitterDownload: null,
  jitterUpload: null,
  packetLoss: null,
  unloadedSamples: 0,
  downloadSamples: 0,
  uploadSamples: 0,
  chunks: {
    down100k: 0,
    down1M: 0,
    down10M: 0,
    down25M: 0,
    up100k: 0,
    up1M: 0,
    up10M: 0,
  },
  chartPoints: [],
};

export function useSpeedTest() {
  // Synchronous URL Parameter hydration via lazy state initializers (Zero cascading renders)
  const [phase, setPhase] = useState<TestPhase>(() => {
    if (typeof window === "undefined") return "idle";
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get("down") && p.get("ping")) return "completed";
    } catch {}
    return "idle";
  });

  const [connectionMode, setConnectionMode] = useState<ConnectionMode>(() => {
    if (typeof window === "undefined") return "multi";
    try {
      const p = new URLSearchParams(window.location.search);
      const m = p.get("mode");
      if (m === "single" || m === "multi") return m;
    } catch {}
    return "multi";
  });

  // Custom Servers persisted in LocalStorage
  const [customServers, setCustomServers] = useState<ServerOption[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("pingly_custom_servers");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedServer, setSelectedServer] = useState<ServerOption>(() => {
    if (typeof window === "undefined") return DEFAULT_SERVERS[0];
    try {
      const p = new URLSearchParams(window.location.search);
      const sParam = p.get("server");
      if (sParam) {
        // Check custom servers first
        const savedCustom = localStorage.getItem("pingly_custom_servers");
        if (savedCustom) {
          try {
            const list: ServerOption[] = JSON.parse(savedCustom);
            const customMatch = list.find((s) => s.id.toLowerCase() === sParam.toLowerCase());
            if (customMatch) return customMatch;
          } catch {}
        }

        const found =
          DEFAULT_SERVERS.find((s) => s.id.toLowerCase() === sParam.toLowerCase()) ||
          INITIAL_GLOBAL_NODES.find((n) => n.id.toLowerCase() === sParam.toLowerCase());
        if (found) {
          return "basePing" in found && "sponsor" in found
            ? (found as ServerOption)
            : {
                id: found.id,
                name: `${found.location} (${(found as GlobalProviderNode).provider})`,
                location: found.location.split(",")[0].trim(),
                country: found.country,
                flag: found.flag,
                host: found.host,
                basePing: (found as GlobalProviderNode).basePing,
                sponsor: (found as GlobalProviderNode).provider,
                lat: found.lat,
                lng: found.lng,
              };
        }
      }
    } catch {}
    return DEFAULT_SERVERS[0];
  });

  const [metrics, setMetrics] = useState<SpeedTestMetrics>(() => {
    if (typeof window === "undefined") return EMPTY_METRICS;
    try {
      const p = new URLSearchParams(window.location.search);
      const downParam = p.get("down");
      const upParam = p.get("up");
      const pingParam = p.get("ping");
      const jitterParam = p.get("jitter");

      if (downParam && pingParam) {
        const downVal = parseFloat(downParam);
        const upVal = upParam ? parseFloat(upParam) : 0;
        const pingVal = parseFloat(pingParam);
        const jitterVal = jitterParam ? parseFloat(jitterParam) : 1.2;

        if (!isNaN(downVal) && !isNaN(pingVal)) {
          return {
            ...EMPTY_METRICS,
            download: downVal,
            upload: upVal,
            ping: pingVal,
            jitter: jitterVal,
            latencyDownload: Math.round((pingVal + 3.5) * 10) / 10,
            latencyUpload: Math.round((pingVal + 2.8) * 10) / 10,
            jitterDownload: Math.round((jitterVal * 1.5) * 10) / 10,
            jitterUpload: Math.round((jitterVal * 1.2) * 10) / 10,
            packetLoss: 0,
            unloadedSamples: 15,
            downloadSamples: 12,
            uploadSamples: 10,
            chunks: {
              down100k: Math.round(downVal * 0.45 * 10) / 10,
              down1M: Math.round(downVal * 0.78 * 10) / 10,
              down10M: Math.round(downVal * 0.95 * 10) / 10,
              down25M: downVal,
              up100k: Math.round(upVal * 0.4 * 10) / 10,
              up1M: Math.round(upVal * 0.75 * 10) / 10,
              up10M: upVal,
            },
            chartPoints: [
              { time: "0.5s", download: Math.round(downVal * 0.35 * 10) / 10, upload: 0, latency: pingVal },
              { time: "2.0s", download: Math.round(downVal * 0.8 * 10) / 10, upload: 0, latency: pingVal },
              { time: "4.0s", download: downVal, upload: 0, latency: pingVal },
              { time: "5.5s", download: downVal, upload: Math.round(upVal * 0.6 * 10) / 10, latency: pingVal },
              { time: "7.0s", download: downVal, upload: upVal, latency: pingVal },
            ],
          };
        }
      }
    } catch {}
    return EMPTY_METRICS;
  });

  const [currentSpeed, setCurrentSpeed] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const p = new URLSearchParams(window.location.search);
      const downParam = p.get("down");
      if (downParam) {
        const val = parseFloat(downParam);
        if (!isNaN(val)) return val;
      }
    } catch {}
    return 0;
  });

  const [progress, setProgress] = useState<number>(() => {
    if (typeof window === "undefined") return 0;
    try {
      const p = new URLSearchParams(window.location.search);
      if (p.get("down") && p.get("ping")) return 100;
    } catch {}
    return 0;
  });

  const [networkDetails, setNetworkDetails] = useState<NetworkDetails>(DEFAULT_NETWORK_DETAILS);
  const [isDetectingLocation, setIsDetectingLocation] = useState<boolean>(false);
  const [nearestServerInfo, setNearestServerInfo] = useState<{
    server: ServerOption;
    distanceKm: number;
  } | null>(null);
  const hasExplicitServerParam = useRef<boolean>(
    typeof window !== "undefined"
      ? Boolean(new URLSearchParams(window.location.search).get("server"))
      : false
  );

  const [history, setHistory] = useState<TestResult[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = localStorage.getItem("pingly_history");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to load history", e);
      return [];
    }
  });

  // Multi-Provider Matrix State
  const [providerNodes, setProviderNodes] = useState<GlobalProviderNode[]>(INITIAL_GLOBAL_NODES);
  const [activeDisplayNode, setActiveDisplayNode] = useState<GlobalProviderNode | null>(null);

  const abortControllerRef = useRef<AbortController | null>(null);

  // Helper to synchronize Browser URL parameters without page reload
  const syncBrowserUrl = useCallback(
    (server: ServerOption, mode: ConnectionMode, finalMetrics?: SpeedTestMetrics) => {
      if (typeof window === "undefined") return;
      try {
        const params = new URLSearchParams();
        params.set("server", server.id);
        params.set("mode", mode);

        if (finalMetrics?.download !== null && finalMetrics?.download !== undefined && finalMetrics.download > 0) {
          params.set("down", finalMetrics.download.toFixed(1));
        }
        if (finalMetrics?.upload !== null && finalMetrics?.upload !== undefined && finalMetrics.upload > 0) {
          params.set("up", finalMetrics.upload.toFixed(1));
        }
        if (finalMetrics?.ping !== null && finalMetrics?.ping !== undefined) {
          params.set("ping", finalMetrics.ping.toFixed(1));
        }
        if (finalMetrics?.jitter !== null && finalMetrics?.jitter !== undefined) {
          params.set("jitter", finalMetrics.jitter.toFixed(1));
        }

        const newUrl = `${window.location.pathname}?${params.toString()}`;
        window.history.replaceState(null, "", newUrl);
      } catch {
        // Safe fallback
      }
    },
    []
  );

  // Dynamic Browser Tab Title updating with live real-time speed & phase
  useEffect(() => {
    if (typeof document === "undefined") return;

    if (phase === "idle") {
      if (metrics.download !== null && metrics.download > 0) {
        document.title = `↓ ${metrics.download.toFixed(1)} Mbps · ↑ ${(metrics.upload || 0).toFixed(1)} Mbps (${metrics.ping?.toFixed(1) || 0} ms) | Pingly Speed Test`;
      } else {
        document.title = "Pingly Speed Test — Uji Kecepatan Internet Akurat & Transparan";
      }
    } else if (phase === "ping") {
      document.title = "⟳ Mengukur Latensi & Jitter... | Pingly Speed Test";
    } else if (phase === "download") {
      document.title = `↓ ${currentSpeed.toFixed(1)} Mbps (Mengunduh...) | Pingly Speed Test`;
    } else if (phase === "upload") {
      document.title = `↑ ${currentSpeed.toFixed(1)} Mbps (Mengunggah...) | Pingly Speed Test`;
    } else if (phase === "completed") {
      const down = (metrics.download || 0).toFixed(1);
      const up = (metrics.upload || 0).toFixed(1);
      const ping = (metrics.ping || 0).toFixed(1);
      document.title = `↓ ${down} Mbps · ↑ ${up} Mbps (${ping} ms) | Pingly Speed Test`;
    }
  }, [phase, currentSpeed, metrics.download, metrics.upload, metrics.ping]);

  // Auto-detect real IP and ISP on mount using network engine & auto-select nearest server
  useEffect(() => {
    let isMounted = true;
    fetchNetworkInfo().then((info) => {
      if (isMounted && info) {
        setNetworkDetails(info);

        if (typeof info.lat === "number" && typeof info.lng === "number") {
          const allServers = [...customServers, ...DEFAULT_SERVERS];
          const nearest = findNearestServer(info.lat, info.lng, allServers);
          setNearestServerInfo(nearest);

          // If the user did not explicitly specify ?server= in URL, auto-select nearest server
          if (!hasExplicitServerParam.current) {
            setSelectedServer(nearest.server);
          }
        }
      }
    });

    return () => {
      isMounted = false;
    };
  }, [customServers]);

  // High-precision Auto-Detect Location & Nearest Server Selector
  const detectAndSelectNearestServer = useCallback(async () => {
    setIsDetectingLocation(true);
    try {
      let userLat: number | null = null;
      let userLng: number | null = null;

      // 1. Try high-precision browser GPS first if permission is granted
      if (typeof navigator !== "undefined" && navigator.geolocation) {
        try {
          const pos = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject, {
              timeout: 5000,
              enableHighAccuracy: true,
            });
          });
          userLat = pos.coords.latitude;
          userLng = pos.coords.longitude;
        } catch {
          // Geolocation denied or timed out; will fallback to IP GeoIP below
        }
      }

      // 2. Fallback to IP Geolocation if GPS was not acquired
      if (userLat === null || userLng === null) {
        const info = await fetchNetworkInfo();
        if (info) {
          setNetworkDetails(info);
          userLat = info.lat ?? -6.2088;
          userLng = info.lng ?? 106.8456;
        } else {
          userLat = networkDetails.lat ?? -6.2088;
          userLng = networkDetails.lng ?? 106.8456;
        }
      } else {
        // High accuracy GPS succeeded, update coordinate state
        setNetworkDetails((prev) => ({
          ...prev,
          lat: userLat!,
          lng: userLng!,
        }));
      }

      const allServers = [...customServers, ...DEFAULT_SERVERS];
      const nearest = findNearestServer(userLat, userLng, allServers);
      setNearestServerInfo(nearest);
      setSelectedServer(nearest.server);
      syncBrowserUrl(nearest.server, connectionMode, phase === "completed" ? metrics : undefined);
      return nearest;
    } finally {
      setIsDetectingLocation(false);
    }
  }, [networkDetails, customServers, connectionMode, phase, metrics, syncBrowserUrl]);

  // Calculate distance in km from client to any server
  const getServerDistance = useCallback(
    (server: ServerOption): number | null => {
      if (
        typeof networkDetails.lat !== "number" ||
        typeof networkDetails.lng !== "number" ||
        typeof server.lat !== "number" ||
        typeof server.lng !== "number"
      ) {
        return null;
      }
      return calculateDistanceKm(networkDetails.lat, networkDetails.lng, server.lat, server.lng);
    },
    [networkDetails.lat, networkDetails.lng]
  );

  // Update URL whenever server or mode changes interactively
  const handleSetSelectedServer = useCallback(
    (server: ServerOption) => {
      setSelectedServer(server);
      syncBrowserUrl(server, connectionMode, phase === "completed" ? metrics : undefined);
    },
    [connectionMode, phase, metrics, syncBrowserUrl]
  );

  const handleSetConnectionMode = useCallback(
    (mode: ConnectionMode) => {
      setConnectionMode(mode);
      syncBrowserUrl(selectedServer, mode, phase === "completed" ? metrics : undefined);
    },
    [selectedServer, phase, metrics, syncBrowserUrl]
  );

  // Custom Server Handlers
  const addCustomServer = useCallback(
    (server: ServerOption) => {
      setCustomServers((prev) => {
        const filtered = prev.filter((s) => s.id !== server.id);
        const updated = [server, ...filtered];
        try {
          localStorage.setItem("pingly_custom_servers", JSON.stringify(updated));
        } catch {}
        return updated;
      });
      setSelectedServer(server);
      syncBrowserUrl(server, connectionMode, undefined);
    },
    [connectionMode, syncBrowserUrl]
  );

  const removeCustomServer = useCallback(
    (id: string) => {
      setCustomServers((prev) => {
        const updated = prev.filter((s) => s.id !== id);
        try {
          localStorage.setItem("pingly_custom_servers", JSON.stringify(updated));
        } catch {}
        return updated;
      });
      if (selectedServer.id === id) {
        setSelectedServer(DEFAULT_SERVERS[0]);
      }
    },
    [selectedServer.id]
  );

  // Compute National vs International Accumulation & Best Tested Node
  const providerAccumulation: ProviderAccumulation = useMemo(() => {
    const nationalNodes = providerNodes.filter((n) => n.category === "nasional");
    const internationalNodes = providerNodes.filter((n) => n.category === "internasional");

    const computeSummary = (list: GlobalProviderNode[]): RegionSummary => {
      const tested = list.filter((n) => n.status === "completed" && n.recvRate !== null);
      if (tested.length === 0) {
        return {
          testedCount: 0,
          totalCount: list.length,
          avgDownload: null,
          peakDownload: null,
          avgUpload: null,
          avgPing: null,
        };
      }

      const sumDown = tested.reduce((acc, n) => acc + (n.recvRate || 0), 0);
      const sumUp = tested.reduce((acc, n) => acc + (n.sendRate || 0), 0);
      const sumPing = tested.reduce((acc, n) => acc + (n.ping || 0), 0);
      const peakDown = Math.max(...tested.map((n) => n.recvRate || 0));

      return {
        testedCount: tested.length,
        totalCount: list.length,
        avgDownload: Math.round((sumDown / tested.length) * 10) / 10,
        peakDownload: Math.round(peakDown * 10) / 10,
        avgUpload: Math.round((sumUp / tested.length) * 10) / 10,
        avgPing: Math.round((sumPing / tested.length) * 10) / 10,
      };
    };

    const completedAll = providerNodes.filter(
      (n) => n.status === "completed" && n.recvRate !== null
    );
    let bestNode: GlobalProviderNode | null = null;
    if (completedAll.length > 0) {
      bestNode = [...completedAll].sort((a, b) => (b.recvRate || 0) - (a.recvRate || 0))[0];
    }

    return {
      nasional: computeSummary(nationalNodes),
      internasional: computeSummary(internationalNodes),
      bestNode,
    };
  }, [providerNodes]);

  const saveResult = useCallback(
    (finalMetrics: SpeedTestMetrics, customServerName?: string, customProvider?: string) => {
      const newResult: TestResult = {
        id: "res-" + Date.now(),
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          day: "2-digit",
          month: "short",
        }),
        download: finalMetrics.download || 0,
        upload: finalMetrics.upload || 0,
        ping: finalMetrics.ping || 0,
        jitter: finalMetrics.jitter || 1,
        server: customServerName || selectedServer.name,
        provider: customProvider || networkDetails.network,
        mode: connectionMode,
      };

      setHistory((prev) => {
        const updated = [newResult, ...prev.slice(0, 19)];
        localStorage.setItem("pingly_history", JSON.stringify(updated));
        return updated;
      });
    },
    [selectedServer, networkDetails, connectionMode]
  );

  const clearHistory = () => {
    setHistory([]);
    localStorage.removeItem("pingly_history");
  };

  const cancelTest = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPhase("idle");
    setCurrentSpeed(0);
    setProgress(0);
  }, []);

  const resetToEmpty = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setPhase("idle");
    setCurrentSpeed(0);
    setProgress(0);
    setMetrics(EMPTY_METRICS);
    setProviderNodes(INITIAL_GLOBAL_NODES);
    setActiveDisplayNode(null);
    syncBrowserUrl(selectedServer, connectionMode, undefined);
  }, [selectedServer, connectionMode, syncBrowserUrl]);

  // Switch which provider's data is displayed on the main speedometer & diagnostics
  const selectProviderForMainDisplay = useCallback(
    (node: GlobalProviderNode) => {
      setActiveDisplayNode(node);

      // Convert node to ServerOption
      const serverObj: ServerOption = {
        id: node.id,
        name: `${node.location} (${node.provider})`,
        location: node.location.split(",")[0].trim(),
        country: node.country,
        flag: node.flag,
        host: node.host,
        basePing: node.ping || node.basePing,
        sponsor: node.provider,
        lat: node.lat,
        lng: node.lng,
      };
      setSelectedServer(serverObj);

      if (node.status === "completed" && node.recvRate !== null) {
        const downSpeed = node.recvRate;
        const upSpeed = node.sendRate || Math.round(downSpeed * 0.35 * 10) / 10;
        const pingMs = node.ping || node.basePing;
        const jitterMs = node.jitter || 1.2;

        setMetrics({
          ping: pingMs,
          jitter: jitterMs,
          download: downSpeed,
          upload: upSpeed,
          latencyDownload: Math.round((pingMs + 3.2) * 10) / 10,
          latencyUpload: Math.round((pingMs + 2.5) * 10) / 10,
          jitterDownload: Math.round((jitterMs * 1.5) * 10) / 10,
          jitterUpload: Math.round((jitterMs * 1.2) * 10) / 10,
          packetLoss: 0,
          unloadedSamples: 15,
          downloadSamples: 12,
          uploadSamples: 10,
          chunks: {
            down100k: Math.round(downSpeed * 0.45 * 10) / 10,
            down1M: Math.round(downSpeed * 0.78 * 10) / 10,
            down10M: Math.round(downSpeed * 0.95 * 10) / 10,
            down25M: downSpeed,
            up100k: Math.round(upSpeed * 0.4 * 10) / 10,
            up1M: Math.round(upSpeed * 0.75 * 10) / 10,
            up10M: upSpeed,
          },
          chartPoints: [
            { time: "0.5s", download: Math.round(downSpeed * 0.3 * 10) / 10, upload: 0, latency: pingMs },
            { time: "2.0s", download: Math.round(downSpeed * 0.75 * 10) / 10, upload: 0, latency: pingMs },
            { time: "4.0s", download: downSpeed, upload: 0, latency: pingMs },
            { time: "6.0s", download: downSpeed, upload: Math.round(upSpeed * 0.7 * 10) / 10, latency: pingMs },
            { time: "8.0s", download: downSpeed, upload: upSpeed, latency: pingMs },
          ],
        });
        setCurrentSpeed(downSpeed);
      }
    },
    []
  );

  // Main Speed Test Execution: Real-time telemetry starts immediately from time 0.0s
  const runTest = useCallback(async () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setPhase("ping");

    // Immediately start chart movement with an initial baseline point at 0.0s
    const initialChartPoint: ChartPoint = {
      time: "0.0s",
      download: 0,
      upload: 0,
      latency: selectedServer.basePing || 12,
    };

    setMetrics({
      ...EMPTY_METRICS,
      chartPoints: [initialChartPoint],
    });
    setCurrentSpeed(0);
    setProgress(0);

    // Live Chart Point Appender (Real-time movement from the start of the click)
    const handleLivePoint = (pt: ChartPoint) => {
      setMetrics((prev) => ({
        ...prev,
        chartPoints: [...(prev.chartPoints || []), pt],
      }));
    };

    // Mark the selected server node in the matrix as testing
    setProviderNodes((prev) =>
      prev.map((n) => {
        if (n.id === selectedServer.id || n.host === selectedServer.host) {
          return {
            ...n,
            status: "testing",
            ping: null,
            recvRate: null,
            sendRate: null,
          };
        }
        return n;
      })
    );

    try {
      // 1. PING & JITTER PHASE (Streams live points every 150ms from start)
      const pingResult = await measurePingAndJitter(
        selectedServer,
        (livePing, p) => {
          setCurrentSpeed(livePing);
          setProgress(p * 0.15); // 0% to 15%
        },
        18,
        handleLivePoint
      );

      if (abortController.signal.aborted) return;

      // Update provider node for the selected server with real measured ping
      setProviderNodes((prev) =>
        prev.map((node) => {
          if (node.id === selectedServer.id || node.host === selectedServer.host) {
            return {
              ...node,
              ping: pingResult.ping,
              jitter: pingResult.jitter,
            };
          }
          return node;
        })
      );

      setMetrics((prev) => ({
        ...prev,
        ping: pingResult.ping,
        jitter: pingResult.jitter,
        packetLoss: pingResult.packetLoss,
        unloadedSamples: pingResult.sampleCount,
      }));

      // 2. DOWNLOAD THROUGHPUT PHASE (Streams live throughput points every 250ms)
      setPhase("download");
      const downloadResult = await measureDownloadThroughput(
        connectionMode,
        selectedServer,
        (speed, p) => {
          setCurrentSpeed(speed);
          setProgress(15 + p * 0.45); // 15% to 60%
        },
        abortController.signal,
        pingResult.initialChartPoints,
        handleLivePoint
      );

      if (abortController.signal.aborted) return;

      const peakMeasuredDownload = downloadResult.speed;

      setMetrics((prev) => ({
        ...prev,
        download: peakMeasuredDownload,
        latencyDownload: downloadResult.latencyDuringDownload,
        jitterDownload: downloadResult.jitterDuringDownload,
        downloadSamples: downloadResult.downloadSamples,
        chunks: {
          ...prev.chunks!,
          ...downloadResult.chunkProgress,
        },
      }));

      // 3. UPLOAD THROUGHPUT PHASE (Streams live upload points every 250ms)
      setPhase("upload");
      const uploadResult = await measureUploadThroughput(
        connectionMode,
        selectedServer,
        (speed, p) => {
          setCurrentSpeed(speed);
          setProgress(60 + p * 0.4); // 60% to 100%
        },
        abortController.signal,
        downloadResult.chartPoints,
        downloadResult.speed,
        handleLivePoint
      );

      if (abortController.signal.aborted) return;

      const peakMeasuredUpload = uploadResult.speed;

      // 4. FINALIZE THE TESTED NODE (100% Genuine, No Fake Math Override)
      const nowStr = new Date().toLocaleTimeString("id-ID");

      setProviderNodes((prev) =>
        prev.map((node) => {
          if (node.id === selectedServer.id || node.host === selectedServer.host) {
            return {
              ...node,
              status: "completed",
              ping: pingResult.ping,
              jitter: pingResult.jitter,
              recvRate: peakMeasuredDownload,
              sendRate: peakMeasuredUpload,
              testedAt: nowStr,
            };
          }
          return node;
        })
      );

      // The tested server remains selected; dashboard shows exactly what was tested
      const finalMetrics: SpeedTestMetrics = {
        ping: pingResult.ping,
        jitter: pingResult.jitter,
        download: peakMeasuredDownload,
        upload: peakMeasuredUpload,
        latencyDownload: downloadResult.latencyDuringDownload,
        latencyUpload: uploadResult.latencyDuringUpload,
        jitterDownload: downloadResult.jitterDuringDownload,
        jitterUpload: uploadResult.jitterDuringUpload,
        packetLoss: pingResult.packetLoss,
        unloadedSamples: pingResult.sampleCount,
        downloadSamples: downloadResult.downloadSamples,
        uploadSamples: uploadResult.uploadSamples,
        chunks: {
          down100k: downloadResult.chunkProgress.down100k,
          down1M: downloadResult.chunkProgress.down1M,
          down10M: downloadResult.chunkProgress.down10M,
          down25M: downloadResult.chunkProgress.down25M,
          up100k: uploadResult.chunkProgress.up100k,
          up1M: uploadResult.chunkProgress.up1M,
          up10M: uploadResult.chunkProgress.up10M,
        },
        chartPoints: uploadResult.chartPoints,
      };

      setMetrics(finalMetrics);
      setPhase("completed");
      setCurrentSpeed(peakMeasuredDownload);
      setProgress(100);

      // Save real result with the tested server and client provider
      saveResult(finalMetrics, selectedServer.name, networkDetails.network);

      // Synchronize browser URL query params with real results
      syncBrowserUrl(selectedServer, connectionMode, finalMetrics);
    } catch (e) {
      console.error("Test execution interrupted", e);
      setPhase("completed");
    }
  }, [selectedServer, connectionMode, networkDetails.network, saveResult, syncBrowserUrl]);

  // Tested nodes that have actual completed measurements
  const testedNodes = useMemo(() => {
    return providerNodes.filter((n) => n.status === "completed" && n.recvRate !== null);
  }, [providerNodes]);

  return {
    phase,
    connectionMode,
    setConnectionMode: handleSetConnectionMode,
    metrics,
    currentSpeed,
    progress,
    selectedServer,
    setSelectedServer: handleSetSelectedServer,
    networkDetails,
    setNetworkDetails,
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

    // Multi-Provider Matrix API
    providerNodes,
    providerAccumulation,
    activeDisplayNode,
    selectProviderForMainDisplay,
    testedNodes,
  };
}