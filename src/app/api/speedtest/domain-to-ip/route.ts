import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import net from "node:net";
import { DnsRecordInfo } from "@/types/speed-test";
import { isSafeTargetHost, isValidPort } from "@/lib/security";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

// Measure raw TCP handshake latency to host:port
async function measureTcpPing(host: string, port = 443, timeoutMs = 2500): Promise<number | null> {
  return new Promise((resolve) => {
    const start = performance.now();
    const socket = new net.Socket();

    let resolved = false;
    const cleanup = () => {
      if (!resolved) {
        resolved = true;
        socket.destroy();
      }
    };

    socket.setTimeout(timeoutMs);

    socket.connect(port, host, () => {
      const duration = performance.now() - start;
      cleanup();
      resolve(Math.round(duration * 10) / 10);
    });

    socket.on("error", () => {
      cleanup();
      resolve(null);
    });

    socket.on("timeout", () => {
      cleanup();
      resolve(null);
    });
  });
}

export async function GET(request: Request) {
  // 1. Rate Limiting Protection (Max 45 lookups per minute per IP)
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`domain-to-ip:${clientIp}`, 45, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        status: "error",
        error: "Terlalu banyak permintaan DNS Lookup. Harap tunggu sebentar.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
        },
      }
    );
  }

  const url = new URL(request.url);
  const rawQuery = (url.searchParams.get("q") || "").trim();

  if (!rawQuery) {
    return NextResponse.json(
      {
        status: "error",
        error: "Parameter domain atau IP (q) wajib diisi.",
      },
      { status: 400 }
    );
  }

  // Sanitize host: remove http://, https://, paths, ports
  let cleanHost = rawQuery.replace(/^https?:\/\//i, "").split("/")[0].split("?")[0].trim();
  let explicitPort = 443;

  if (cleanHost.includes(":") && !cleanHost.includes("]")) {
    const parts = cleanHost.split(":");
    cleanHost = parts[0];
    const parsedPort = parseInt(parts[1], 10);
    if (!isNaN(parsedPort) && isValidPort(parsedPort)) {
      explicitPort = parsedPort;
    }
  }

  // 2. SSRF Pre-check
  const preCheck = isSafeTargetHost(cleanHost);
  if (!preCheck.safe) {
    return NextResponse.json(
      {
        status: "error",
        error: preCheck.reason || "Domain atau host tidak diizinkan.",
      },
      { status: 403 }
    );
  }

  const isIp = net.isIP(cleanHost);

  let ipv4: string[] = [];
  let ipv6: string[] = [];
  let mx: Array<{ exchange: string; priority: number }> = [];
  let ns: string[] = [];
  let ptr: string | undefined = undefined;

  try {
    if (isIp) {
      if (isIp === 4) {
        ipv4 = [cleanHost];
      } else {
        ipv6 = [cleanHost];
      }
      try {
        const reverseResults = await dns.reverse(cleanHost);
        if (reverseResults.length > 0) {
          ptr = reverseResults[0];
        }
      } catch {
        // PTR resolution optional
      }
    } else {
      // Resolve A (IPv4)
      try {
        ipv4 = await dns.resolve4(cleanHost);
      } catch {
        try {
          const lookup = await dns.lookup(cleanHost, { family: 4 });
          if (lookup?.address) ipv4 = [lookup.address];
        } catch {}
      }

      // Resolve AAAA (IPv6)
      try {
        ipv6 = await dns.resolve6(cleanHost);
      } catch {}

      // Resolve MX
      try {
        mx = await dns.resolveMx(cleanHost);
      } catch {}

      // Resolve NS
      try {
        ns = await dns.resolveNs(cleanHost);
      } catch {}
    }

    if (ipv4.length === 0 && ipv6.length === 0) {
      return NextResponse.json(
        {
          status: "error",
          error: `Gagal menyelesaikan DNS untuk '${cleanHost}'. Domain tidak ditemukan atau belum memiliki DNS Record A/AAAA.`,
          domain: cleanHost,
          query: rawQuery,
        },
        { status: 404 }
      );
    }

    // Target IP for GeoIP lookup and TCP ping
    const primaryIp = ipv4[0] || ipv6[0];

    // 3. SSRF Post-check on resolved IP
    const postCheck = isSafeTargetHost(primaryIp);
    if (!postCheck.safe) {
      return NextResponse.json(
        {
          status: "error",
          error: `Alamat IP terdeteksi (${primaryIp}) termasuk jangkauan jaringan privat/lokal yang dilarang.`,
          domain: cleanHost,
          query: rawQuery,
        },
        { status: 403 }
      );
    }

    // Measure live TCP latency
    let pingMs = await measureTcpPing(primaryIp, explicitPort);
    if (pingMs === null && explicitPort === 443) {
      // Fallback to port 80 if 443 timed out
      pingMs = await measureTcpPing(primaryIp, 80);
    }

    // Lookup GeoIP & ASN
    let geoInfo: DnsRecordInfo["geo"] = undefined;
    try {
      const geoRes = await fetch(
        `http://ip-api.com/json/${encodeURIComponent(primaryIp)}?fields=status,country,countryCode,regionName,city,lat,lon,isp,org,as,query`,
        { cache: "no-store", signal: AbortSignal.timeout(3000) }
      );
      if (geoRes.ok) {
        const data = await geoRes.json();
        if (data.status === "success") {
          geoInfo = {
            ip: data.query || primaryIp,
            isp: data.isp || "Unknown ISP",
            org: data.org || data.isp || "",
            asn: data.as || "",
            city: data.city || "",
            country: data.country || "",
            countryCode: data.countryCode || "",
            lat: data.lat || 0,
            lng: data.lon || 0,
          };
        }
      }
    } catch {
      // GeoIP fallback
    }

    const responseData: DnsRecordInfo = {
      domain: cleanHost,
      query: rawQuery,
      status: "success",
      ipv4,
      ipv6,
      mx: mx.length > 0 ? mx : undefined,
      ns: ns.length > 0 ? ns : undefined,
      ptr,
      pingMs,
      geo: geoInfo,
    };

    return NextResponse.json(responseData, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Kesalahan internal resolusi DNS";
    return NextResponse.json(
      {
        status: "error",
        error: msg,
        domain: cleanHost,
        query: rawQuery,
      },
      { status: 500 }
    );
  }
}
