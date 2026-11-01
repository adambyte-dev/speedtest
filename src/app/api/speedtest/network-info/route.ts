import { NextResponse } from "next/server";

export async function GET(request: Request) {
  // 1. Detect client IP from standard proxy & direct headers
  const forwardedFor = request.headers.get("x-forwarded-for");
  const realIp = request.headers.get("x-real-ip");
  const cfConnectingIp = request.headers.get("cf-connecting-ip");
  const rawClientIp = cfConnectingIp || (forwardedFor ? forwardedFor.split(",")[0].trim() : realIp || "");

  const isLocal =
    !rawClientIp ||
    rawClientIp === "::1" ||
    rawClientIp === "127.0.0.1" ||
    rawClientIp.startsWith("192.168.") ||
    rawClientIp.startsWith("10.") ||
    rawClientIp.startsWith("172.16.");

  const queryIp = isLocal ? "" : rawClientIp;

  // 2. Query Primary IP GeoIP: ip-api.com
  try {
    const ipApiUrl = queryIp
      ? `http://ip-api.com/json/${encodeURIComponent(queryIp)}?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,as,query`
      : `http://ip-api.com/json/?fields=status,message,country,countryCode,region,regionName,city,lat,lon,timezone,isp,org,as,query`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);

    const res = await fetch(ipApiUrl, {
      signal: controller.signal,
      cache: "no-store",
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.status === "success") {
        const protocol = (data.query || "").includes(":") ? "IPv6" : "IPv4";
        const ispName = data.isp || data.org || "Internet Provider";
        const networkLabel = data.as ? `${data.as} (${ispName})` : ispName;

        return NextResponse.json({
          success: true,
          ip: data.query,
          connectedVia: protocol,
          network: networkLabel,
          isp: ispName,
          asn: data.as || "",
          org: data.org || "",
          city: data.city || "",
          region: data.regionName || data.region || "",
          country: data.country || "Indonesia",
          countryCode: data.countryCode || "ID",
          lat: typeof data.lat === "number" ? data.lat : -6.2088,
          lon: typeof data.lon === "number" ? data.lon : 106.8456,
          lng: typeof data.lon === "number" ? data.lon : 106.8456,
          userLocation: `${data.city || "Jakarta"}, ${data.country || "Indonesia"}`,
          serverLocation: "Jakarta, Indonesia",
          source: "pingly-geoip",
        });
      }
    }
  } catch {
    // try fallback provider
  }

  // 3. Secondary Provider: ipapi.co
  try {
    const ipapiCoUrl = queryIp
      ? `https://ipapi.co/${encodeURIComponent(queryIp)}/json/`
      : `https://ipapi.co/json/`;

    const controller2 = new AbortController();
    const timeoutId2 = setTimeout(() => controller2.abort(), 3500);
    const res2 = await fetch(ipapiCoUrl, {
      signal: controller2.signal,
      headers: { "User-Agent": "PinglySpeedTest/1.0" },
      cache: "no-store",
    });
    clearTimeout(timeoutId2);

    if (res2.ok) {
      const data2 = await res2.json();
      if (data2.ip && !data2.error) {
        const ispName = data2.org || data2.asn || "Internet Service Provider";
        const networkLabel = data2.asn ? `${data2.asn} (${ispName})` : ispName;

        return NextResponse.json({
          success: true,
          ip: data2.ip,
          connectedVia: data2.version || (data2.ip.includes(":") ? "IPv6" : "IPv4"),
          network: networkLabel,
          isp: ispName,
          asn: data2.asn || "",
          org: data2.org || "",
          city: data2.city || "Jakarta",
          region: data2.region || "",
          country: data2.country_name || "Indonesia",
          countryCode: data2.country_code || "ID",
          lat: typeof data2.latitude === "number" ? data2.latitude : -6.2088,
          lon: typeof data2.longitude === "number" ? data2.longitude : 106.8456,
          lng: typeof data2.longitude === "number" ? data2.longitude : 106.8456,
          userLocation: `${data2.city || "Jakarta"}, ${data2.country_name || "Indonesia"}`,
          serverLocation: "Jakarta, Indonesia",
          source: "ipapi-co",
        });
      }
    }
  } catch {
    // continue to dynamic local fallback
  }

  // 4. Neutral Dynamic Fallback (Never hardcode a fake specific ISP name)
  const fallbackIp = rawClientIp && !isLocal ? rawClientIp : "127.0.0.1";
  return NextResponse.json({
    success: true,
    ip: fallbackIp,
    connectedVia: fallbackIp.includes(":") ? "IPv6" : "IPv4",
    network: isLocal ? "Jaringan Lokal / WiFi" : `ISP Klien (${fallbackIp})`,
    isp: isLocal ? "Koneksi Lokal" : "Internet Provider Klien",
    asn: "",
    org: "",
    city: "Indonesia",
    region: "",
    country: "Indonesia",
    countryCode: "ID",
    lat: -6.2088,
    lon: 106.8456,
    lng: 106.8456,
    userLocation: "Indonesia",
    serverLocation: "Jakarta, Indonesia",
    source: "local-dynamic",
  });
}
