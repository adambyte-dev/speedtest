export type TestPhase = "idle" | "ping" | "download" | "upload" | "completed";
export type ConnectionMode = "multi" | "single";

export interface LatencyStat {
  latency: number;
  jitter: number;
  samples: number;
}

export interface ChunkMetrics {
  down100k: number;
  down1M: number;
  down10M: number;
  down25M: number;
  up100k: number;
  up1M: number;
  up10M: number;
}

export interface ChartPoint {
  time: string;
  download: number;
  upload: number;
  latency: number;
}

export interface SpeedTestMetrics {
  ping: number | null;
  jitter: number | null;
  download: number | null;
  upload: number | null;
  latencyDownload: number | null;
  latencyUpload: number | null;
  jitterDownload: number | null;
  jitterUpload: number | null;
  packetLoss: number | null;
  unloadedSamples?: number;
  downloadSamples?: number;
  uploadSamples?: number;
  chunks?: ChunkMetrics;
  chartPoints?: ChartPoint[];
}

export interface QualityScore {
  rating: "Great" | "Good" | "Fair" | "Poor";
  score: number; // 0 - 100
  detail: string;
}

export interface ChunkProgress {
  size: string;
  count: string;
  speedBit: string;
  progress: number;
}

export interface ServerOption {
  id: string;
  name: string;
  location: string;
  country: string;
  flag: string;
  host: string;
  port?: number;
  protocol?: "http" | "https";
  basePing: number;
  sponsor: string;
  lat: number;
  lng: number;
  isCustom?: boolean;
}

export interface DnsRecordInfo {
  domain: string;
  query: string;
  status: "success" | "error";
  error?: string;
  ipv4: string[];
  ipv6: string[];
  mx?: Array<{ exchange: string; priority: number }>;
  ns?: string[];
  ptr?: string;
  pingMs?: number | null;
  geo?: {
    ip: string;
    isp: string;
    org: string;
    asn: string;
    city: string;
    country: string;
    countryCode: string;
    lat: number;
    lng: number;
  };
}

export interface NetworkDetails {
  ip: string;
  network: string;
  isp?: string;
  asn?: string;
  org?: string;
  city?: string;
  region?: string;
  country?: string;
  countryCode?: string;
  lat?: number;
  lng?: number;
  connectedVia: "IPv4" | "IPv6";
  serverLocation: string;
  userLocation: string;
}

export interface GlobalProviderNode {
  id: string;
  provider: string;
  location: string;
  country: string;
  flag: string;
  capacity: string;
  host: string;
  basePing: number;
  category: "nasional" | "internasional";
  lat: number;
  lng: number;
  status: "idle" | "testing" | "completed" | "error";
  ping: number | null;
  sendRate: number | null; // Upload (Mbps)
  recvRate: number | null; // Download (Mbps)
  jitter?: number | null;
  testedAt?: string | null;
}

export interface RegionSummary {
  testedCount: number;
  totalCount: number;
  avgDownload: number | null;
  peakDownload: number | null;
  avgUpload: number | null;
  avgPing: number | null;
}

export interface ProviderAccumulation {
  nasional: RegionSummary;
  internasional: RegionSummary;
  bestNode: GlobalProviderNode | null;
}

export interface TestResult {
  id: string;
  timestamp: string;
  download: number;
  upload: number;
  ping: number;
  jitter: number;
  server: string;
  provider: string;
  mode: ConnectionMode;
}
