import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const downParam = searchParams.get("down");
    const upParam = searchParams.get("up");
    const pingParam = searchParams.get("ping");
    const serverParam = searchParams.get("server") || "Jakarta (Telkom)";
    const ispParam = searchParams.get("isp") || "High-Speed Internet";

    const hasResults = Boolean(downParam && pingParam);

    return new ImageResponse(
      (
        <div
          style={{
            height: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            backgroundColor: "#0F0205",
            backgroundImage:
              "radial-gradient(circle at 25% 25%, rgba(128, 0, 32, 0.45) 0%, transparent 55%), radial-gradient(circle at 80% 80%, rgba(225, 29, 72, 0.35) 0%, transparent 50%)",
            padding: "50px 60px",
            fontFamily: "system-ui, -apple-system, sans-serif",
            color: "#FFFFFF",
          }}
        >
          {/* Header Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
              <div
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  backgroundColor: "#800020",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 8px 24px rgba(128, 0, 32, 0.6)",
                }}
              >
                <span style={{ fontSize: "28px" }}>⚡</span>
              </div>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <span style={{ fontSize: "32px", fontWeight: 900, letterSpacing: "-0.03em" }}>
                  Pingly <span style={{ color: "#FB7185" }}>Speed Test</span>
                </span>
                <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.7)" }}>
                  speedtest.pingly.net · Uji Kecepatan Akurat & Transparan
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "8px 18px",
                borderRadius: "999px",
                backgroundColor: "rgba(16, 185, 129, 0.15)",
                border: "1px solid rgba(16, 185, 129, 0.4)",
                color: "#34D399",
                fontSize: "14px",
                fontWeight: 700,
              }}
            >
              <div
                style={{
                  width: "8px",
                  height: "8px",
                  borderRadius: "999px",
                  backgroundColor: "#10B981",
                }}
              />
              <span>100% UNMANIPULATED TELEMETRY</span>
            </div>
          </div>

          {/* Center Content: Speed Results Card or Brand Banner */}
          {hasResults ? (
            <div
              style={{
                display: "flex",
                gap: "24px",
                width: "100%",
                marginTop: "20px",
                marginBottom: "20px",
              }}
            >
              {/* Download Card */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "26px 30px",
                  borderRadius: "24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(251, 113, 133, 0.25)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#FB7185", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  ↓ DOWNLOAD
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "10px" }}>
                  <span style={{ fontSize: "64px", fontWeight: 900, fontFamily: "monospace", letterSpacing: "-0.04em" }}>
                    {downParam}
                  </span>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: "rgba(255, 255, 255, 0.6)" }}>
                    Mbps
                  </span>
                </div>
              </div>

              {/* Upload Card */}
              <div
                style={{
                  flex: 1,
                  display: "flex",
                  flexDirection: "column",
                  padding: "26px 30px",
                  borderRadius: "24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(251, 113, 133, 0.25)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#FDA4AF", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  ↑ UPLOAD
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "10px" }}>
                  <span style={{ fontSize: "64px", fontWeight: 900, fontFamily: "monospace", letterSpacing: "-0.04em" }}>
                    {upParam || "0.0"}
                  </span>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: "rgba(255, 255, 255, 0.6)" }}>
                    Mbps
                  </span>
                </div>
              </div>

              {/* Ping / Latency Card */}
              <div
                style={{
                  width: "240px",
                  display: "flex",
                  flexDirection: "column",
                  padding: "26px 30px",
                  borderRadius: "24px",
                  backgroundColor: "rgba(255, 255, 255, 0.05)",
                  border: "1px solid rgba(251, 113, 133, 0.25)",
                  boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                }}
              >
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#34D399", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  ⚡ PING
                </span>
                <div style={{ display: "flex", alignItems: "baseline", gap: "8px", marginTop: "10px" }}>
                  <span style={{ fontSize: "64px", fontWeight: 900, fontFamily: "monospace", letterSpacing: "-0.04em", color: "#34D399" }}>
                    {pingParam}
                  </span>
                  <span style={{ fontSize: "20px", fontWeight: 700, color: "rgba(255, 255, 255, 0.6)" }}>
                    ms
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
                marginTop: "30px",
                marginBottom: "30px",
              }}
            >
              <span
                style={{
                  fontSize: "52px",
                  fontWeight: 900,
                  lineHeight: 1.15,
                  letterSpacing: "-0.03em",
                }}
              >
                Uji Kecepatan Internet Akurat,
                <br />
                <span style={{ color: "#FB7185" }}>Transparan & Real-Time</span>
              </span>
              <span style={{ fontSize: "20px", color: "rgba(255, 255, 255, 0.75)", maxWidth: "800px" }}>
                Pengukuran multi-stream bandwidth murni tanpa manipulasi. Dilengkapi diagnostik latensi jitter, matriks provider global, dan DNS domain lookup.
              </span>
            </div>
          )}

          {/* Footer Metadata Row */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              borderTop: "1px solid rgba(255, 255, 255, 0.12)",
              paddingTop: "24px",
              width: "100%",
            }}
          >
            <div style={{ display: "flex", gap: "28px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.5)" }}>Server:</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>{serverParam}</span>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span style={{ fontSize: "14px", color: "rgba(255, 255, 255, 0.5)" }}>Provider:</span>
                <span style={{ fontSize: "15px", fontWeight: 700, color: "#FFFFFF" }}>{ispParam}</span>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "13px", color: "rgba(255, 255, 255, 0.5)" }}>
                Bagikan & Uji Kecepatan di:
              </span>
              <span style={{ fontSize: "15px", fontWeight: 800, color: "#FB7185" }}>
                speedtest.pingly.net
              </span>
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (e: unknown) {
    const errorMsg = e instanceof Error ? e.message : "Error generating OG Image";
    return new Response(`Failed to generate image: ${errorMsg}`, { status: 500 });
  }
}
