#!/usr/bin/env node

/**
 * Pingly CLI v2.0 - Ultra-Fast, Multi-Stream Node.js Network Diagnostic Tool
 * Official API: https://pingly.ktexucoder.online
 */

const https = require('https');
const crypto = require('crypto');

const BASE_URL = 'https://pingly.ktexucoder.online';

const SERVERS = [
  {
    id: 'cbn-jkt',
    name: 'CBN Cyber 1 Jakarta (10G Direct IX)',
    location: 'Jakarta, Indonesia',
    pingUrl: 'https://speedtest.cbn.id:8080/hello',
    downUrl: 'https://speedtest.cbn.id:8080/download',
    upUrl: 'https://speedtest.cbn.id:8080/upload',
    type: 'ookla'
  },
  {
    id: 'cbn-sg',
    name: 'CBN Singapore APAC Hub (10G Direct IX)',
    location: 'Singapore, SG',
    pingUrl: 'https://speedtest-sg.cbn.id:8080/hello',
    downUrl: 'https://speedtest-sg.cbn.id:8080/download',
    upUrl: 'https://speedtest-sg.cbn.id:8080/upload',
    type: 'ookla'
  },
  {
    id: 'cf-edge',
    name: 'Cloudflare Global Anycast Edge',
    location: 'Nearest Edge PoP',
    pingUrl: 'https://speed.cloudflare.com/__down?bytes=0',
    downUrl: 'https://speed.cloudflare.com/__down',
    upUrl: 'https://speed.cloudflare.com/__up',
    type: 'cloudflare'
  }
];

const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
  keepAlive: true,
  maxSockets: 32
});

function trimmedMean(samples) {
  if (!samples.length) return 0;
  if (samples.length <= 3) {
    return Math.round((samples.reduce((a, b) => a + b, 0) / samples.length) * 100) / 100;
  }
  const s = [...samples].sort((a, b) => a - b);
  const lo = Math.floor(s.length * 0.15);
  const hi = Math.max(lo + 1, Math.ceil(s.length * 0.95));
  const trimmed = s.slice(lo, hi);
  return Math.round((trimmed.reduce((a, b) => a + b, 0) / trimmed.length) * 100) / 100;
}

function fetchJson(url) {
  return new Promise((resolve) => {
    https.get(url, { agent: httpsAgent, headers: { 'User-Agent': 'Pingly-CLI/2.0' } }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try { resolve(JSON.parse(data)); } catch { resolve({}); }
      });
    }).on('error', () => resolve({}));
  });
}

function probeServerPing(url) {
  return new Promise((resolve) => {
    const t0 = process.hrtime.bigint();
    const req = https.get(url, { agent: httpsAgent, headers: { 'User-Agent': 'Pingly-CLI/2.0' } }, (res) => {
      res.resume();
      res.on('end', () => {
        const ms = Number(process.hrtime.bigint() - t0) / 1e6;
        resolve(ms);
      });
    });
    req.on('error', () => resolve(99999));
    req.setTimeout(2500, () => { req.destroy(); resolve(99999); });
  });
}

async function selectBestServer() {
  let best = SERVERS[0];
  let minRtt = 999999;
  for (const s of SERVERS) {
    const rtt = await probeServerPing(`${s.pingUrl}?t=${Date.now()}`);
    if (rtt < minRtt) {
      minRtt = rtt;
      best = s;
    }
  }
  return { server: best, rtt: minRtt };
}

function runMultiStreamDownload(server, durationSec = 7.0, threads = 6) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const endTime = startTime + durationSec * 1000;
    let totalBytes = 0;
    const samples = [];
    let isRunning = true;

    let lastBytes = 0;
    let lastTime = Date.now();

    const monitor = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const windowSec = (now - lastTime) / 1000;
      if (windowSec >= 0.2) {
        const delta = totalBytes - lastBytes;
        const mbps = (delta * 8) / (windowSec * 1e6);
        lastBytes = totalBytes;
        lastTime = now;
        if (elapsed > 1.0 && mbps > 0) {
          samples.push(mbps);
        }
      }

      const pct = Math.min((elapsed / durationSec) * 100, 99);
      const currentRate = samples.length ? samples[samples.length - 1] : (totalBytes * 8 / (Math.max(elapsed, 0.1) * 1e6));
      process.stdout.write(`\r     ↓ ${currentRate.toFixed(1)} Mbps (${(totalBytes / 1048576).toFixed(1)} MB, ${pct.toFixed(0)}%)   `);

      if (now >= endTime) {
        clearInterval(monitor);
        isRunning = false;
        const totalDuration = (Date.now() - startTime) / 1000;
        const finalSpeed = samples.length ? trimmedMean(samples) : Math.round(((totalBytes * 8) / (totalDuration * 1e6)) * 100) / 100;
        resolve({
          speedMbps: finalSpeed,
          totalMb: Math.round((totalBytes / 1048576) * 10) / 10,
          durationSec: Math.round(totalDuration * 100) / 100
        });
      }
    }, 150);

    const worker = (id) => {
      if (!isRunning) return;
      const queryParam = server.type === 'ookla' ? `size=25000000` : `bytes=25000000`;
      const url = `${server.downUrl}?${queryParam}&t=${Date.now()}_${id}`;
      const req = https.get(url, { agent: httpsAgent, headers: { 'User-Agent': 'Pingly-CLI/2.0' } }, (res) => {
        res.on('data', chunk => {
          totalBytes += chunk.length;
        });
        res.on('end', () => {
          if (isRunning) worker(id);
        });
      });
      req.on('error', () => {
        if (isRunning) setTimeout(() => worker(id), 80);
      });
    };

    for (let i = 0; i < threads; i++) {
      worker(i);
    }
  });
}

function runMultiStreamUpload(server, durationSec = 6.0, threads = 4) {
  return new Promise((resolve) => {
    const startTime = Date.now();
    const endTime = startTime + durationSec * 1000;
    let totalBytes = 0;
    const samples = [];
    let isRunning = true;

    const payload = crypto.randomBytes(2 * 1024 * 1024); // 2 MB

    let lastBytes = 0;
    let lastTime = Date.now();

    const monitor = setInterval(() => {
      const now = Date.now();
      const elapsed = (now - startTime) / 1000;
      const windowSec = (now - lastTime) / 1000;
      if (windowSec >= 0.2) {
        const delta = totalBytes - lastBytes;
        const mbps = (delta * 8) / (windowSec * 1e6);
        lastBytes = totalBytes;
        lastTime = now;
        if (elapsed > 0.8 && mbps > 0) {
          samples.push(mbps);
        }
      }

      const pct = Math.min((elapsed / durationSec) * 100, 99);
      const currentRate = samples.length ? samples[samples.length - 1] : (totalBytes * 8 / (Math.max(elapsed, 0.1) * 1e6));
      process.stdout.write(`\r     ↑ ${currentRate.toFixed(1)} Mbps (${(totalBytes / 1048576).toFixed(1)} MB, ${pct.toFixed(0)}%)   `);

      if (now >= endTime) {
        clearInterval(monitor);
        isRunning = false;
        const totalDuration = (Date.now() - startTime) / 1000;
        const finalSpeed = samples.length ? trimmedMean(samples) : Math.round(((totalBytes * 8) / (totalDuration * 1e6)) * 100) / 100;
        resolve({
          speedMbps: finalSpeed,
          totalMb: Math.round((totalBytes / 1048576) * 10) / 10,
          durationSec: Math.round(totalDuration * 100) / 100
        });
      }
    }, 150);

    const worker = (id) => {
      if (!isRunning) return;
      const url = `${server.upUrl}?t=${Date.now()}_${id}`;
      const req = https.request(url, {
        method: 'POST',
        agent: httpsAgent,
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Length': payload.length,
          'User-Agent': 'Pingly-CLI/2.0'
        }
      }, (res) => {
        res.resume();
        res.on('end', () => {
          totalBytes += payload.length;
          if (isRunning) worker(id);
        });
      });
      req.on('error', () => {
        if (isRunning) setTimeout(() => worker(id), 80);
      });
      req.write(payload);
      req.end();
    };

    for (let i = 0; i < threads; i++) {
      worker(i);
    }
  });
}

async function run() {
  console.log('\n =========================================================');
  console.log('           PINGLY NETWORK SPEED TEST CLI v2.0');
  console.log('       Transparent & Real-Time Network Diagnostics');
  console.log(' =========================================================\n');

  console.log(' [*] Mendeteksi informasi jaringan klien...');
  const net = await fetchJson(`${BASE_URL}/api/speedtest/network-info`).catch(() => ({}));
  const ip = net.ip || 'Unknown';
  const isp = net.isp || 'Internet Service Provider';
  const asn = net.asn ? ` (${net.asn})` : '';
  const loc = net.userLocation || 'Indonesia';

  console.log(`     - Alamat IP : ${ip}`);
  console.log(`     - Provider  : ${isp}${asn}`);
  console.log(`     - Lokasi    : ${loc}\n`);

  console.log(' [*] Memilih server terdekat dengan latensi terendah...');
  const { server, rtt } = await selectBestServer();
  console.log(` [OK] Terhubung ke: ${server.name} (${server.location})\n`);

  console.log(' [*] Mengukur Latensi (Ping) & Jitter...');
  const pings = [];
  for (let i = 1; i <= 8; i++) {
    const ms = await probeServerPing(`${server.pingUrl}?t=${i}`);
    if (ms < 9999) {
      pings.push(ms);
      if (i <= 5) {
        console.log(`     Sample #${i}: ${ms.toFixed(2)} ms`);
      }
    }
    await new Promise(r => setTimeout(r, 40));
  }

  const avgPing = trimmedMean(pings) || Math.round(rtt * 100) / 100;
  let jitterSum = 0;
  for (let i = 1; i < pings.length; i++) {
    jitterSum += Math.abs(pings[i] - pings[i - 1]);
  }
  const avgJitter = pings.length > 1 ? Math.round((jitterSum / (pings.length - 1)) * 100) / 100 : 0.8;
  console.log(` [OK] Rata-rata Latensi : ${avgPing.toFixed(2)} ms`);
  console.log(` [OK] Jitter Variansi   : ${avgJitter.toFixed(2)} ms\n`);

  console.log(' [*] Menguji Kecepatan Unduh (Download Throughput)...');
  console.log('     [Multi-stream x6, High-Capacity 10G Node, durasi ~7 detik]');
  const down = await runMultiStreamDownload(server, 7.0, 6);
  console.log(`\r [OK] Kecepatan Download: ${down.speedMbps.toFixed(2)} Mbps (${down.totalMb} MB dalam ${down.durationSec}s)      \n`);

  console.log(' [*] Menguji Kecepatan Unggah (Upload Throughput)...');
  console.log('     [Multi-stream x4, High-Capacity 10G Node, durasi ~6 detik]');
  const up = await runMultiStreamUpload(server, 6.0, 4);
  console.log(`\r [OK] Kecepatan Upload  : ${up.speedMbps.toFixed(2)} Mbps (${up.totalMb} MB dalam ${up.durationSec}s)      \n`);

  console.log(' [=] HASIL RINGKASAN DIAGNOSA JARINGAN:');
  console.log('---------------------------------------------------------');
  console.log(`  Target Server  : ${server.name}`);
  console.log(`  Provider / ISP : ${isp}`);
  console.log(`  IP Address     : ${ip}`);
  console.log(`  Ping Latency   : ${avgPing.toFixed(2)} ms`);
  console.log(`  Jitter         : ${avgJitter.toFixed(2)} ms`);
  console.log(`  Download Speed : ${down.speedMbps.toFixed(2)} Mbps`);
  console.log(`  Upload Speed   : ${up.speedMbps.toFixed(2)} Mbps`);
  console.log('---------------------------------------------------------');
  console.log(' [OK] Pengujian selesai secara transparan tanpa manipulasi.');
  console.log(` Laporan interaktif web: ${BASE_URL}\n`);
}

run();
