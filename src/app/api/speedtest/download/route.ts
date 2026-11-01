import { NextResponse } from "next/server";
import crypto from "node:crypto";

// High-entropy 4 MB random binary pool to guarantee 100% UNCOMPRESSIBLE data
// Pre-allocated at module initialization to avoid CPU and garbage collection overhead during streaming.
const POOL_SIZE = 4 * 1024 * 1024; // 4 MB
const RANDOM_POOL = crypto.randomBytes(POOL_SIZE);
const CHUNK_SIZE = 256 * 1024; // 256 KB chunks for high throughput streaming

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
      totalBytes = Math.min(parsed, 100 * 1024 * 1024); // Cap at 100 MB
    }
  }

  let bytesRemaining = totalBytes;
  let poolOffset = 0;

  // Stream raw uncompressible bytes in 256 KB zero-copy chunks
  const stream = new ReadableStream({
    pull(controller) {
      if (bytesRemaining <= 0) {
        controller.close();
        return;
      }
      const chunkSize = Math.min(bytesRemaining, CHUNK_SIZE);
      const endOffset = poolOffset + chunkSize;

      let chunk: Uint8Array;
      if (endOffset <= POOL_SIZE) {
        chunk = RANDOM_POOL.subarray(poolOffset, endOffset);
        poolOffset = endOffset % POOL_SIZE;
      } else {
        // Pool boundary wrap-around without slow concat: wrap poolOffset to 0
        poolOffset = 0;
        chunk = RANDOM_POOL.subarray(0, chunkSize);
        poolOffset = chunkSize;
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
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
    },
  });
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
}
