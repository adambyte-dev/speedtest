#!/usr/bin/env python3
"""
Pingly CLI v2.0 - Ultra-Fast, Multi-Stream Network Diagnostic Tool
Official API: https://pingly.ktexucoder.online
"""

import urllib.request
import json
import time
import os
import sys
import threading
import math
import ssl

# Ensure UTF-8 stdout across all operating systems and terminals
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

# Bypass local CA verification issues on minimal Linux VPS images
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

BASE_URL = "https://pingly.ktexucoder.online"

# High-Capacity 10G/100G Edge Nodes (including exact CBN Cyber 1 IDC Node)
SERVERS = [
    {
        "id": "cbn-jkt",
        "name": "CBN Cyber 1 Jakarta (10G Direct IX)",
        "location": "Jakarta, Indonesia",
        "ping_url": "https://speedtest.cbn.id:8080/hello",
        "down_url": "https://speedtest.cbn.id:8080/download",
        "up_url": "https://speedtest.cbn.id:8080/upload",
        "type": "ookla"
    },
    {
        "id": "cbn-sg",
        "name": "CBN Singapore APAC Hub (10G Direct IX)",
        "location": "Singapore, SG",
        "ping_url": "https://speedtest-sg.cbn.id:8080/hello",
        "down_url": "https://speedtest-sg.cbn.id:8080/download",
        "up_url": "https://speedtest-sg.cbn.id:8080/upload",
        "type": "ookla"
    },
    {
        "id": "cf-edge",
        "name": "Cloudflare Global Anycast Edge",
        "location": "Nearest Edge PoP",
        "ping_url": "https://speed.cloudflare.com/__down?bytes=0",
        "down_url": "https://speed.cloudflare.com/__down",
        "up_url": "https://speed.cloudflare.com/__up",
        "type": "cloudflare"
    }
]

def trimmed_mean(samples):
    if not samples:
        return 0.0
    if len(samples) <= 3:
        return round(sum(samples) / len(samples), 2)
    s = sorted(samples)
    lo = int(len(s) * 0.15)
    hi = max(lo + 1, math.ceil(len(s) * 0.95))
    trimmed = s[lo:hi]
    return round(sum(trimmed) / len(trimmed), 2) if trimmed else 0.0

print("")
print(" =========================================================")
print("           PINGLY NETWORK SPEED TEST CLI v2.0")
print("       Transparent & Real-Time Network Diagnostics")
print(" =========================================================")
print("")

# 1. Network Information
print(" [*] Mendeteksi informasi jaringan klien...")
client_ip = "Unknown"
client_isp = "Unknown ISP"
client_asn = ""
client_loc = "Indonesia"

try:
    req = urllib.request.Request(f"{BASE_URL}/api/speedtest/network-info", headers={"User-Agent": "Pingly-CLI/2.0"})
    with urllib.request.urlopen(req, timeout=5, context=ssl_context) as res:
        data = json.loads(res.read().decode())
        client_ip = data.get("ip", "Unknown")
        client_isp = data.get("isp", "Unknown ISP")
        client_asn = f" ({data['asn']})" if data.get("asn") else ""
        client_loc = data.get("userLocation", "Indonesia")
except Exception:
    pass

print(f"     - Alamat IP : {client_ip}")
print(f"     - Provider  : {client_isp}{client_asn}")
print(f"     - Lokasi    : {client_loc}")
print("")

# 2. Server Selection (Lowest RTT Node)
print(" [*] Memilih server terdekat dengan latensi terendah...")
selected_server = SERVERS[0]
best_rtt = 999999.0

for s in SERVERS:
    t0 = time.perf_counter()
    try:
        req = urllib.request.Request(f"{s['ping_url']}?t={int(time.time()*1000)}", headers={"User-Agent": "Pingly-CLI/2.0"})
        with urllib.request.urlopen(req, timeout=2.5, context=ssl_context) as res:
            res.read()
            rtt = (time.perf_counter() - t0) * 1000
            if rtt < best_rtt:
                best_rtt = rtt
                selected_server = s
    except Exception:
        pass

print(f" [OK] Terhubung ke: {selected_server['name']} ({selected_server['location']})")
print("")

# 3. Latency & Jitter Measurement
print(" [*] Mengukur Latensi (Ping) & Jitter...")
pings = []
for i in range(1, 9):
    t0 = time.perf_counter()
    ok = False
    try:
        req = urllib.request.Request(f"{selected_server['ping_url']}?t={i}", headers={"User-Agent": "Pingly-CLI/2.0"})
        with urllib.request.urlopen(req, timeout=3, context=ssl_context) as res:
            res.read()
            ok = True
    except Exception:
        pass

    if ok:
        ms = round((time.perf_counter() - t0) * 1000, 2)
        pings.append(ms)
        if i <= 5:
            print(f"     Sample #{i}: {ms:.2f} ms")
    time.sleep(0.04)

avg_ping = trimmed_mean(pings) if pings else round(best_rtt, 2)
jitter_sum = sum(abs(pings[i] - pings[i-1]) for i in range(1, len(pings)))
avg_jitter = round(jitter_sum / (len(pings) - 1), 2) if len(pings) > 1 else 0.5

print(f" [OK] Rata-rata Latensi : {avg_ping:.2f} ms")
print(f" [OK] Jitter Variansi   : {avg_jitter:.2f} ms")
print("")

# 4. Multi-Stream Download Throughput (Saturates Gigabit / 10G Links)
print(" [*] Menguji Kecepatan Unduh (Download Throughput)...")
print("     [Multi-stream x6, High-Capacity 10G Node, durasi ~7 detik]")

download_lock = threading.Lock()
download_total_bytes = 0
download_duration = 7.0
download_start = time.perf_counter()
download_samples = []

# Construct download URL depending on server type
def get_download_url(worker_id):
    if selected_server["type"] == "ookla":
        return f"{selected_server['down_url']}?size=25000000&t={time.perf_counter()}_{worker_id}"
    else:
        return f"{selected_server['down_url']}?bytes=25000000&t={time.perf_counter()}_{worker_id}"

def download_worker(worker_id):
    global download_total_bytes
    while time.perf_counter() - download_start < download_duration:
        try:
            url = get_download_url(worker_id)
            req = urllib.request.Request(url, headers={"User-Agent": "Pingly-CLI/2.0"})
            with urllib.request.urlopen(req, timeout=8, context=ssl_context) as res:
                while time.perf_counter() - download_start < download_duration:
                    chunk = res.read(131072) # 128 KB chunks
                    if not chunk:
                        break
                    with download_lock:
                        download_total_bytes += len(chunk)
        except Exception:
            time.sleep(0.05)

threads_down = [threading.Thread(target=download_worker, args=(i,), daemon=True) for i in range(6)]
for t in threads_down:
    t.start()

last_bytes_down = 0
last_time_down = download_start
while True:
    now = time.perf_counter()
    elapsed = now - download_start
    if elapsed >= download_duration:
        break

    with download_lock:
        curr_bytes = download_total_bytes

    window = now - last_time_down
    if window >= 0.2:
        delta = curr_bytes - last_bytes_down
        speed = (delta * 8) / (window * 1e6)
        last_bytes_down = curr_bytes
        last_time_down = now
        if elapsed > 1.0 and speed > 0:
            download_samples.append(speed)

    pct = min((elapsed / download_duration) * 100, 99)
    current_rate = download_samples[-1] if download_samples else (curr_bytes * 8 / (max(elapsed, 0.1) * 1e6))
    mb_transferred = curr_bytes / (1024 * 1024)
    print(f"\r     ↓ {current_rate:.1f} Mbps ({mb_transferred:.1f} MB, {pct:.0f}%)   ", end="", flush=True)
    time.sleep(0.15)

for t in threads_down:
    t.join(timeout=1.5)

download_elapsed = time.perf_counter() - download_start
down_mbps = trimmed_mean(download_samples) if download_samples else round((download_total_bytes * 8) / (max(download_elapsed, 0.1) * 1e6), 2)
mb_transferred_down = download_total_bytes / (1024 * 1024)

print(f"\r [OK] Kecepatan Download: {down_mbps:.2f} Mbps ({mb_transferred_down:.1f} MB dalam {download_elapsed:.2f}s)      ")
print("")

# 5. Multi-Stream Upload Throughput (Saturates Gigabit / 10G Links)
print(" [*] Menguji Kecepatan Unggah (Upload Throughput)...")
print("     [Multi-stream x4, High-Capacity 10G Node, durasi ~6 detik]")

upload_lock = threading.Lock()
upload_total_bytes = 0
upload_duration = 6.0
upload_start = time.perf_counter()
upload_samples = []
UPLOAD_CHUNK = 2 * 1024 * 1024 # 2 MB random binary payload
upload_payload = os.urandom(UPLOAD_CHUNK)

def upload_worker(worker_id):
    global upload_total_bytes
    while time.perf_counter() - upload_start < upload_duration:
        try:
            up_url = f"{selected_server['up_url']}?t={time.perf_counter()}_{worker_id}"
            req = urllib.request.Request(
                up_url,
                data=upload_payload,
                headers={"Content-Type": "application/octet-stream", "User-Agent": "Pingly-CLI/2.0"},
                method="POST"
            )
            with urllib.request.urlopen(req, timeout=8, context=ssl_context) as res:
                res.read()
            with upload_lock:
                upload_total_bytes += UPLOAD_CHUNK
        except Exception:
            time.sleep(0.05)

threads_up = [threading.Thread(target=upload_worker, args=(i,), daemon=True) for i in range(4)]
for t in threads_up:
    t.start()

last_bytes_up = 0
last_time_up = upload_start
while True:
    now = time.perf_counter()
    elapsed = now - upload_start
    if elapsed >= upload_duration:
        break

    with upload_lock:
        curr_bytes = upload_total_bytes

    window = now - last_time_up
    if window >= 0.2:
        delta = curr_bytes - last_bytes_up
        speed = (delta * 8) / (window * 1e6)
        last_bytes_up = curr_bytes
        last_time_up = now
        if elapsed > 0.8 and speed > 0:
            upload_samples.append(speed)

    pct = min((elapsed / upload_duration) * 100, 99)
    current_rate = upload_samples[-1] if upload_samples else (curr_bytes * 8 / (max(elapsed, 0.1) * 1e6))
    mb_transferred_up = curr_bytes / (1024 * 1024)
    print(f"\r     ↑ {current_rate:.1f} Mbps ({mb_transferred_up:.1f} MB, {pct:.0f}%)   ", end="", flush=True)
    time.sleep(0.15)

for t in threads_up:
    t.join(timeout=1.5)

upload_elapsed = time.perf_counter() - upload_start
up_mbps = trimmed_mean(upload_samples) if upload_samples else round((upload_total_bytes * 8) / (max(upload_elapsed, 0.1) * 1e6), 2)
mb_transferred_up = upload_total_bytes / (1024 * 1024)

print(f"\r [OK] Kecepatan Upload  : {up_mbps:.2f} Mbps ({mb_transferred_up:.1f} MB dalam {upload_elapsed:.2f}s)      ")
print("")

# 6. Final Summary Report
print(" [=] HASIL RINGKASAN DIAGNOSA JARINGAN:")
print("---------------------------------------------------------")
print(f"  Target Server  : {selected_server['name']}")
print(f"  Provider / ISP : {client_isp}")
print(f"  IP Address     : {client_ip}")
print(f"  Ping Latency   : {avg_ping:.2f} ms")
print(f"  Jitter         : {avg_jitter:.2f} ms")
print(f"  Download Speed : {down_mbps:.2f} Mbps")
print(f"  Upload Speed   : {up_mbps:.2f} Mbps")
print("---------------------------------------------------------")
print(" [OK] Pengujian selesai secara transparan tanpa manipulasi.")
print(f" Laporan interaktif web: {BASE_URL}")
print("")
