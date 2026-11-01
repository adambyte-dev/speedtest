import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "upload",
    message: "POST binary payload to measure upload throughput",
  });
}

export async function POST(request: Request) {
  const startTime = Date.now();
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

    const durationMs = Math.max(Date.now() - startTime, 1);
    const durationSec = durationMs / 1000;
    const megabits = (bytesReceived * 8) / (1000 * 1000);
    const speedMbps = Math.round((megabits / durationSec) * 10) / 10;

    return NextResponse.json({
      success: true,
      bytesReceived,
      durationMs,
      speedMbps,
    });
  } catch {
    return NextResponse.json(
      {
        success: false,
        error: "Upload stream aborted or failed",
        bytesReceived,
      },
      { status: 500 }
    );
  }
}
