import { NextResponse } from "next/server";

// Pre-allocated reusable random payload block (64 KB)
const BLOCK_SIZE = 64 * 1024;
const CHUNK_BLOCK = Buffer.alloc(BLOCK_SIZE, 0xa5);

export async function GET(request: Request) {
  const url = new URL(request.url);
  const sizeParam = (url.searchParams.get("size") || "10m").toLowerCase();

  let totalBytes = 10 * 1024 * 1024; // Default 10 MB

  if (sizeParam.endsWith("k") || sizeParam.endsWith("kb")) {
    const val = parseFloat(sizeParam) || 100;
    totalBytes = Math.round(val * 1024);
  } else if (sizeParam.endsWith("m") || sizeParam.endsWith("mb")) {
    const val = parseFloat(sizeParam) || 10;
    totalBytes = Math.round(val * 1024 * 1024);
  } else {
    const parsed = parseInt(sizeParam, 10);
    if (!isNaN(parsed) && parsed > 0) {
      totalBytes = Math.min(parsed, 50 * 1024 * 1024); // Cap at 50 MB
    }
  }

  // Stream bytes in 64 KB chunks
  let bytesRemaining = totalBytes;
  const stream = new ReadableStream({
    pull(controller) {
      if (bytesRemaining <= 0) {
        controller.close();
        return;
      }
      const chunkSize = Math.min(bytesRemaining, BLOCK_SIZE);
      const chunk = chunkSize === BLOCK_SIZE ? CHUNK_BLOCK : CHUNK_BLOCK.subarray(0, chunkSize);
      controller.enqueue(chunk);
      bytesRemaining -= chunkSize;
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": totalBytes.toString(),
      "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
      Pragma: "no-cache",
      Expires: "0",
    },
  });
}
