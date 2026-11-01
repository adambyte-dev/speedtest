import { NextResponse } from "next/server";
import crypto from "node:crypto";

// High-entropy 2 MB random binary pool to guarantee 100% UNCOMPRESSIBLE data
// This ensures that Brotli, Gzip, or any CDN compression CANNOT shrink the payload,
// giving 100% true, accurate physical wire-speed measurement.
const POOL_SIZE = 2 * 1024 * 1024; // 2 MB
const RANDOM_POOL = crypto.randomBytes(POOL_SIZE);
const BLOCK_SIZE = 64 * 1024; // 64 KB chunks

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

  let bytesRemaining = totalBytes;
  let poolOffset = 0;

  // Stream raw uncompressible bytes in 64 KB chunks
  const stream = new ReadableStream({
    pull(controller) {
      if (bytesRemaining <= 0) {
        controller.close();
        return;
      }
      const chunkSize = Math.min(bytesRemaining, BLOCK_SIZE);
      // Slice rotating window from the high-entropy pool
      const endOffset = poolOffset + chunkSize;
      let chunk: Buffer;
      if (endOffset <= POOL_SIZE) {
        chunk = RANDOM_POOL.subarray(poolOffset, endOffset);
        poolOffset = endOffset % POOL_SIZE;
      } else {
        // Wrap around pool
        chunk = Buffer.concat([
          RANDOM_POOL.subarray(poolOffset, POOL_SIZE),
          RANDOM_POOL.subarray(0, endOffset % POOL_SIZE),
        ]);
        poolOffset = endOffset % POOL_SIZE;
      }

      controller.enqueue(chunk);
      bytesRemaining -= chunkSize;
    },
  });

  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "application/octet-stream",
      "Content-Length": totalBytes.toString(),
      "Content-Encoding": "identity",
      "Cache-Control": "no-store, no-cache, no-transform, must-revalidate, max-age=0",
      "Pragma": "no-cache",
      "Expires": "0",
    },
  });
}
