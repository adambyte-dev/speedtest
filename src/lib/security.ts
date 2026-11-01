/**
 * Pingly Security & Protection Engine
 * Protects against SSRF (Server-Side Request Forgery), abusive port scanning,
 * and malicious input vectors.
 */

import net from "node:net";

// Private, loopback, and cloud metadata IP ranges that must never be targeted by public server probes
const BLOCKED_IP_PATTERNS = [
  /^127\./, // Loopback IPv4 (127.0.0.0/8)
  /^10\./, // Private Class A (10.0.0.0/8)
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private Class B (172.16.0.0/12)
  /^192\.168\./, // Private Class C (192.168.0.0/16)
  /^169\.254\./, // Link-local & Cloud Metadata (AWS/GCP/Azure: 169.254.169.254)
  /^0\./, // Current network (0.0.0.0/8)
  /^100\.(6[4-9]|[7-9][0-9]|1[0-1][0-9]|12[0-7])\./, // Shared address space (Carrier-grade NAT)
  /^::1$/, // IPv6 loopback
  /^fc00:/i, // IPv6 Unique local address
  /^fe80:/i, // IPv6 Link-local address
];

const BLOCKED_HOSTNAMES = [
  "localhost",
  "localhost.localdomain",
  "metadata.google.internal",
  "169.254.169.254",
  "instance-data",
];

/**
 * Checks if a target IP address or hostname is safe for outbound connectivity probing.
 * Prevents SSRF attacks into internal VPCs, Kubernetes services, or cloud metadata endpoints.
 */
export function isSafeTargetHost(hostOrIp: string): { safe: boolean; reason?: string } {
  const clean = hostOrIp.toLowerCase().trim();

  if (!clean) {
    return { safe: false, reason: "Host tidak boleh kosong." };
  }

  // Check known dangerous hostnames
  if (BLOCKED_HOSTNAMES.includes(clean)) {
    return { safe: false, reason: "Host lokal atau metadata dilarang untuk alasan keamanan (SSRF protection)." };
  }

  // Check if it's an IP address and if it falls into private/reserved blocks
  if (net.isIP(clean)) {
    for (const pattern of BLOCKED_IP_PATTERNS) {
      if (pattern.test(clean)) {
        return {
          safe: false,
          reason: `Alamat IP '${clean}' berada pada jangkauan jaringan privat/lokal dan dilarang untuk keamanan.`,
        };
      }
    }
  }

  return { safe: true };
}

/**
 * Validates TCP port number within legal range
 */
export function isValidPort(port: number): boolean {
  return Number.isInteger(port) && port >= 1 && port <= 65535;
}
