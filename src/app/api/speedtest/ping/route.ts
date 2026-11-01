import { NextResponse } from "next/server";
import net from "node:net";

const SERVER_BASE_HOPS: Record<string, number> = {
  // Nasional (Indonesia / Domestik)
  "id-telkom": 0,
  "id-biznet": 2,
  "id-myrep": 3,
  "id-cbn": 1,
  "id-xl": 3,
  "id-ioh": 4,
  "id-sub-biznet": 7,
  "jkt-auto": 0,
  "sub-1": 7,

  // Internasional (Global Edge & Tier-1)
  "sin-leaseweb": 15,
  "sin-singtel": 16,
  "jp-ntt": 58,
  "uz-telecom": 85,
  "au-telstra": 95,
  "nl-eranium": 150,
  "uk-clouvider": 158,
  "us-clouvider-la": 170,
  "us-leaseweb-nyc": 195,
  "br-edgoo": 285,
};

async function probeCustomPing(host: string, port = 443, timeoutMs = 1500): Promise<number | null> {
  return new Promise((resolve) => {
    const t0 = performance.now();
    const socket = new net.Socket();
    let done = false;

    const cleanup = (rtt: number | null) => {
      if (!done) {
        done = true;
        socket.destroy();
        resolve(rtt);
      }
    };

    socket.setTimeout(timeoutMs);
    socket.connect(port, host, () => {
      const dur = performance.now() - t0;
      cleanup(Math.round(dur * 10) / 10);
    });
    socket.on("error", () => cleanup(null));
    socket.on("timeout", () => cleanup(null));
  });
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const serverId = url.searchParams.get("server");
  const customHost = url.searchParams.get("customHost");
  const customPort = parseInt(url.searchParams.get("customPort") || "443", 10) || 443;

  let liveCustomRtt: number | null = null;
  if (customHost) {
    liveCustomRtt = await probeCustomPing(customHost, customPort);
  } else if (serverId && SERVER_BASE_HOPS[serverId]) {
    const hopDelay = SERVER_BASE_HOPS[serverId];
    await new Promise((resolve) => setTimeout(resolve, hopDelay));
  }

  const timestamp = Date.now();
  return new NextResponse(
    JSON.stringify({
      status: "ok",
      timestamp,
      serverTime: new Date().toISOString(),
      serverId: serverId || "id-telkom",
      customHost: customHost || null,
      customRtt: liveCustomRtt,
    }),
    {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    }
  );
}

export async function HEAD() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
      "X-Response-Time": Date.now().toString(),
    },
  });
}