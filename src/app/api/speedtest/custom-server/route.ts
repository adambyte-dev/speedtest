import { NextResponse } from "next/server";
import dns from "node:dns/promises";
import net from "node:net";
import { ServerOption } from "@/types/speed-test";
import { isSafeTargetHost, isValidPort } from "@/lib/security";
import { checkRateLimit, getClientIp } from "@/lib/rate-limit";

async function probeTcpPort(host: string, port: number, timeoutMs = 3000): Promise<{ reachable: boolean; rtt: number }> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const socket = new net.Socket();
    let done = false;

    const finalize = (reachable: boolean, rtt: number) => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve({ reachable, rtt });
      }
    };

    socket.setTimeout(timeoutMs);

    socket.connect(port, host, () => {
      const duration = Math.max(performance.now() - t0, 1);
      finalize(true, Math.round(duration * 10) / 10);
    });

    socket.on("error", () => {
      finalize(false, 0);
    });

    socket.on("timeout", () => {
      finalize(false, 0);
    });
  });
}

export async function POST(request: Request) {
  // 1. Rate Limiting Protection (Max 30 custom probes per minute per IP)
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`custom-server:${clientIp}`, 30, 60000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        success: false,
        error: "Terlalu banyak permintaan probe server kustom. Harap tunggu sebentar.",
      },
      {
        status: 429,
        headers: {
          "Retry-After": Math.ceil(rateLimit.resetMs / 1000).toString(),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const rawHost = (body.host || "").trim();
    const port = parseInt(body.port, 10) || 443;
    const protocol: "http" | "https" = body.protocol === "http" ? "http" : "https";
    const customName = (body.name || "").trim();

    if (!rawHost) {
      return NextResponse.json(
        { success: false, error: "Host (domain atau alamat IP) wajib diisi." },
        { status: 400 }
      );
    }

    if (!isValidPort(port)) {
      return NextResponse.json(
        { success: false, error: "Nomor port tidak valid. Port harus antara 1 dan 65535." },
        { status: 400 }
      );
    }

    // Sanitize host string
    const host = rawHost.replace(/^https?:\/\//i, "").split("/")[0].split(":")[0].trim();

    // 2. SSRF Protection: Pre-resolution check
    const preCheck = isSafeTargetHost(host);
    if (!preCheck.safe) {
      return NextResponse.json(
        { success: false, error: preCheck.reason || "Target host tidak diizinkan." },
        { status: 403 }
      );
    }

    // 3. Resolve host to IP
    let resolvedIp = host;
    if (!net.isIP(host)) {
      try {
        const lookup = await dns.lookup(host);
        resolvedIp = lookup.address;
      } catch {
        return NextResponse.json(
          {
            success: false,
            error: `Domain '${host}' tidak dapat diselesaikan ke alamat IP melalui DNS.`,
          },
          { status: 400 }
        );
      }
    }

    // 4. SSRF Protection: Post-resolution check (prevent DNS rebinding to internal IP)
    const postCheck = isSafeTargetHost(resolvedIp);
    if (!postCheck.safe) {
      return NextResponse.json(
        {
          success: false,
          error: `Domain '${host}' menyelesaikan ke IP '${resolvedIp}' yang dilarang untuk keamanan jaringan internal.`,
        },
        { status: 403 }
      );
    }

    // 5. Probe port connectivity & latency
    const probe = await probeTcpPort(resolvedIp, port);

    // 6. GeoIP lookup for coordinates & ISP
    let country = "Indonesia";
    let countryCode = "ID";
    let city = "Custom Server";
    let isp = "Private / Custom Host";
    let lat = -6.2088;
    let lng = 106.8456;

    try {
      const geoRes = await fetch(
        `http://ip-api.com/json/${encodeURIComponent(resolvedIp)}?fields=status,country,countryCode,city,lat,lon,isp,org`,
        { cache: "no-store", signal: AbortSignal.timeout(3000) }
      );
      if (geoRes.ok) {
        const data = await geoRes.json();
        if (data.status === "success") {
          country = data.country || country;
          countryCode = data.countryCode || countryCode;
          city = data.city || city;
          isp = data.isp || data.org || isp;
          lat = data.lat || lat;
          lng = data.lon || lng;
        }
      }
    } catch {
      // fallback coordinates
    }

    const serverId = `custom-${Date.now()}`;
    const displayName = customName || `${host}:${port} (${isp})`;

    const serverOption: ServerOption = {
      id: serverId,
      name: displayName,
      location: `${city}, ${country}`,
      country,
      flag: countryCode.toUpperCase(),
      host,
      port,
      protocol,
      basePing: probe.reachable ? probe.rtt : 25.0,
      sponsor: isp,
      lat,
      lng,
      isCustom: true,
    };

    return NextResponse.json({
      success: true,
      server: serverOption,
      resolvedIp,
      reachable: probe.reachable,
      rtt: probe.reachable ? probe.rtt : null,
      message: probe.reachable
        ? `Port ${port} terbuka. Latensi TCP: ${probe.rtt} ms.`
        : `Peringatan: Port ${port} pada ${host} tidak merespons TCP ping dalam 3 detik. Server tetap dapat disimpan.`,
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Gagal memproses server kustom";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
