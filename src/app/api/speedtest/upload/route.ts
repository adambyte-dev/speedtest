import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "upload",
    message: "POST binary payload to measure upload throughput",
  });
}

export async function POST(request: Request) {
  const startTime = performance.now();
  let bytesReceived = 0;

  try {
    if (request.body) {
      const reader = request.body.getReader();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (value) {
          bytesReceived += value.length;
        }
      }
    } else {
      const blob = await request.arrayBuffer();
      bytesReceived = blob.byteLength;
    }

    const durationMs = Math.max(performance.now() - startTime, 1);
    const durationSec = durationMs / 1000;
    const megabits = (bytesReceived * 8) / (1000 * 1000);
    const speedMbps = Math.round((megabits / durationSec) * 10) / 10;

    return NextResponse.json(
      {
        success: true,
        bytesReceived,
        durationMs: Math.round(durationMs * 10) / 10,
        speedMbps,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, no-transform, must-revalidate",
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST, OPTIONS",
        },
      }
    );
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Upload stream aborted or failed",
        bytesReceived,
      },
      {
        status: 500,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
