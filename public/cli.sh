#!/usr/bin/env bash
# ==============================================================================
# Pingly CLI v2.0 - Ultra-Fast, Multi-Stream Network Diagnostic Tool
# Official API: https://pingly.ktexucoder.online
# ==============================================================================

set -e

BASE_URL="https://pingly.ktexucoder.online"

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
CYAN='\033[0;36m'
BOLD='\033[1m'
NC='\033[0m'

echo ""
echo " ========================================================="
echo "           PINGLY NETWORK SPEED TEST CLI v2.0"
echo "       Transparent & Real-Time Network Diagnostics"
echo " ========================================================="
echo ""

# Check for curl
if ! command -v curl >/dev/null 2>&1; then
  echo -e "${RED}Error: 'curl' is required but not installed.${NC}"
  exit 1
fi

TMPDIR_PINGLY=$(mktemp -d 2>/dev/null || echo "/tmp/pingly_$$")
mkdir -p "$TMPDIR_PINGLY"
trap "rm -rf '$TMPDIR_PINGLY'" EXIT

# 1. Network Information
echo -e "${CYAN} [*] Mendeteksi informasi jaringan klien...${NC}"
NET_INFO=$(curl -s --max-time 5 "${BASE_URL}/api/speedtest/network-info" 2>/dev/null || echo "{}")

CLIENT_IP=$(echo "$NET_INFO" | grep -o '"ip":"[^"]*' | cut -d'"' -f4 || echo "Unknown")
CLIENT_ISP=$(echo "$NET_INFO" | grep -o '"isp":"[^"]*' | cut -d'"' -f4 || echo "Unknown ISP")
CLIENT_ASN=$(echo "$NET_INFO" | grep -o '"asn":"[^"]*' | cut -d'"' -f4 || echo "")
CLIENT_LOC=$(echo "$NET_INFO" | grep -o '"userLocation":"[^"]*' | cut -d'"' -f4 || echo "Indonesia")

echo "     - Alamat IP : ${CLIENT_IP}"
echo "     - Provider  : ${CLIENT_ISP} (${CLIENT_ASN})"
echo "     - Lokasi    : ${CLIENT_LOC}"
echo ""

# 2. Server Selection (Lowest RTT Node)
echo -e "${CYAN} [*] Memilih server terdekat dengan latensi terendah...${NC}"

# Candidate Nodes
SERVERS_NAME=("CBN Cyber 1 Jakarta (10G Direct IX)" "CBN Singapore APAC Hub (10G Direct IX)" "Cloudflare Global Anycast Edge")
SERVERS_PING=("https://speedtest.cbn.id:8080/hello" "https://speedtest-sg.cbn.id:8080/hello" "https://speed.cloudflare.com/__down?bytes=0")
SERVERS_DOWN=("https://speedtest.cbn.id:8080/download?size=25000000" "https://speedtest-sg.cbn.id:8080/download?size=25000000" "https://speed.cloudflare.com/__down?bytes=25000000")
SERVERS_UP=("https://speedtest.cbn.id:8080/upload" "https://speedtest-sg.cbn.id:8080/upload" "https://speed.cloudflare.com/__up")

BEST_IDX=0
BEST_TIME=999999

for idx in 0 1 2; do
  PING_URL="${SERVERS_PING[$idx]}"
  R_TIME=$(curl -k -s -o /dev/null -w "%{time_total}" --max-time 2 "$PING_URL" 2>/dev/null || echo "999")
  IS_FASTER=$(awk "BEGIN {print ($R_TIME < $BEST_TIME ? 1 : 0)}")
  if [ "$IS_FASTER" = "1" ]; then
    BEST_TIME=$R_TIME
    BEST_IDX=$idx
  fi
done

SELECTED_NAME="${SERVERS_NAME[$BEST_IDX]}"
SELECTED_PING="${SERVERS_PING[$BEST_IDX]}"
SELECTED_DOWN="${SERVERS_DOWN[$BEST_IDX]}"
SELECTED_UP="${SERVERS_UP[$BEST_IDX]}"

echo -e " ${GREEN}[OK]${NC} Terhubung ke: ${BOLD}${SELECTED_NAME}${NC}"
echo ""

# 3. Latency & Jitter Measurement
echo -e "${CYAN} [*] Mengukur Latensi (Ping) & Jitter...${NC}"
PINGS=()
TOTAL_PING=0

for i in $(seq 1 8); do
  START_TIME=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')
  HTTP_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" --max-time 3 "${SELECTED_PING}?t=${i}" 2>/dev/null || echo "0")
  END_TIME=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')

  if [ "$HTTP_CODE" = "200" ]; then
    DIFF_MS=$(awk "BEGIN {print ($END_TIME - $START_TIME) / 1000000}")
    PINGS+=("$DIFF_MS")
    TOTAL_PING=$(awk "BEGIN {print $TOTAL_PING + $DIFF_MS}")
    if [ "$i" -le 5 ]; then
      printf "     Sample #%d: %.2f ms\n" "$i" "$DIFF_MS"
    fi
  fi
  sleep 0.04
done

COUNT=${#PINGS[@]}
AVG_PING=$(awk "BEGIN {print ($COUNT > 0) ? $TOTAL_PING / $COUNT : 0}")

JITTER_SUM=0
if [ "$COUNT" -gt 1 ]; then
  for (( i=1; i<COUNT; i++ )); do
    PREV=${PINGS[$i-1]}
    CURR=${PINGS[$i]}
    DIFF=$(awk "BEGIN {d = $CURR - $PREV; print (d < 0 ? -d : d)}")
    JITTER_SUM=$(awk "BEGIN {print $JITTER_SUM + $DIFF}")
  done
  AVG_JITTER=$(awk "BEGIN {print $JITTER_SUM / ($COUNT - 1)}")
else
  AVG_JITTER=0.5
fi

printf " ${GREEN}[OK]${NC} Rata-rata Latensi : %.2f ms\n" "$AVG_PING"
printf " ${GREEN}[OK]${NC} Jitter Variansi   : %.2f ms\n" "$AVG_JITTER"
echo ""

# 4. Multi-Stream Download Throughput (6 Parallel Workers)
echo -e "${CYAN} [*] Menguji Kecepatan Unduh (Download Throughput)...${NC}"
echo "     [Multi-stream x6, High-Capacity 10G Node, durasi ~7 detik]"

DOWNLOAD_DURATION=7
NUM_DOWN_STREAMS=6

for i in $(seq 1 $NUM_DOWN_STREAMS); do
  echo "0" > "${TMPDIR_PINGLY}/down_${i}"
  (
    TOTAL=0
    END_AT=$(($(date +%s) + DOWNLOAD_DURATION))
    while [ "$(date +%s)" -lt "$END_AT" ]; do
      BYTES=$(curl -k -s -o /dev/null -w "%{size_download}" --max-time $((DOWNLOAD_DURATION + 2)) \
        "${SELECTED_DOWN}&t=$(date +%s%N)_${i}" 2>/dev/null || echo "0")
      TOTAL=$((TOTAL + BYTES))
      echo "$TOTAL" > "${TMPDIR_PINGLY}/down_${i}"
    done
  ) &
done

DOWNLOAD_START=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')

# Progress monitor
for s in $(seq 1 $((DOWNLOAD_DURATION * 2))); do
  sleep 0.5
  NOW_TOTAL=0
  for i in $(seq 1 $NUM_DOWN_STREAMS); do
    B=$(cat "${TMPDIR_PINGLY}/down_${i}" 2>/dev/null || echo "0")
    NOW_TOTAL=$((NOW_TOTAL + B))
  done
  MB_NOW=$(awk "BEGIN {printf \"%.1f\", $NOW_TOTAL / (1024*1024)}")
  PCT=$(( (s * 50) / DOWNLOAD_DURATION ))
  if [ "$PCT" -gt 99 ]; then PCT=99; fi
  printf "\r     ↓ %s MB (%d%%)...   " "$MB_NOW" "$PCT"
done

wait

DOWNLOAD_END=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')

TOTAL_DOWN_BYTES=0
for i in $(seq 1 $NUM_DOWN_STREAMS); do
  WORKER_BYTES=$(cat "${TMPDIR_PINGLY}/down_${i}" 2>/dev/null || echo "0")
  TOTAL_DOWN_BYTES=$((TOTAL_DOWN_BYTES + WORKER_BYTES))
done

DOWNLOAD_DUR_SEC=$(awk "BEGIN {print ($DOWNLOAD_END - $DOWNLOAD_START) / 1000000000}")
if (( $(awk "BEGIN {print ($DOWNLOAD_DUR_SEC > 0.1)}") )); then
  DOWNLOAD_MBPS=$(awk "BEGIN {printf \"%.2f\", ($TOTAL_DOWN_BYTES * 8) / ($DOWNLOAD_DUR_SEC * 1000000)}")
else
  DOWNLOAD_MBPS="0.00"
fi

TOTAL_DOWN_MB=$(awk "BEGIN {printf \"%.1f\", $TOTAL_DOWN_BYTES / (1024*1024)}")

printf "\r ${GREEN}[OK]${NC} Kecepatan Download: %s Mbps (%s MB dalam %.2fs)      \n" \
  "$DOWNLOAD_MBPS" "$TOTAL_DOWN_MB" "$DOWNLOAD_DUR_SEC"
echo ""

# 5. Multi-Stream Upload Throughput (4 Parallel Workers)
echo -e "${CYAN} [*] Menguji Kecepatan Unggah (Upload Throughput)...${NC}"
echo "     [Multi-stream x4, High-Capacity 10G Node, durasi ~6 detik]"

UPLOAD_DURATION=6
UPLOAD_CHUNK_SIZE=2097152  # 2 MB
NUM_UP_STREAMS=4

UPLOAD_FILE="${TMPDIR_PINGLY}/upload_payload.bin"
dd if=/dev/urandom of="$UPLOAD_FILE" bs=1048576 count=2 status=none 2>/dev/null || head -c 2097152 /dev/urandom > "$UPLOAD_FILE"

for i in $(seq 1 $NUM_UP_STREAMS); do
  echo "0" > "${TMPDIR_PINGLY}/up_${i}"
  (
    TOTAL=0
    END_AT=$(($(date +%s) + UPLOAD_DURATION))
    while [ "$(date +%s)" -lt "$END_AT" ]; do
      HTTP_CODE=$(curl -k -s -o /dev/null -w "%{http_code}" -X POST \
        "${SELECTED_UP}?t=$(date +%s%N)_${i}" \
        --data-binary @"$UPLOAD_FILE" --max-time $((UPLOAD_DURATION + 2)) \
        -H "Content-Type: application/octet-stream" 2>/dev/null || echo "0")
      if [ "$HTTP_CODE" = "200" ]; then
        TOTAL=$((TOTAL + UPLOAD_CHUNK_SIZE))
        echo "$TOTAL" > "${TMPDIR_PINGLY}/up_${i}"
      fi
    done
  ) &
done

UPLOAD_START=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')

for s in $(seq 1 $((UPLOAD_DURATION * 2))); do
  sleep 0.5
  NOW_UP=0
  for i in $(seq 1 $NUM_UP_STREAMS); do
    B=$(cat "${TMPDIR_PINGLY}/up_${i}" 2>/dev/null || echo "0")
    NOW_UP=$((NOW_UP + B))
  done
  MB_UP=$(awk "BEGIN {printf \"%.1f\", $NOW_UP / (1024*1024)}")
  PCT=$(( (s * 50) / UPLOAD_DURATION ))
  if [ "$PCT" -gt 99 ]; then PCT=99; fi
  printf "\r     ↑ %s MB (%d%%)...   " "$MB_UP" "$PCT"
done

wait

UPLOAD_END=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')

TOTAL_UP_BYTES=0
for i in $(seq 1 $NUM_UP_STREAMS); do
  WORKER_BYTES=$(cat "${TMPDIR_PINGLY}/up_${i}" 2>/dev/null || echo "0")
  TOTAL_UP_BYTES=$((TOTAL_UP_BYTES + WORKER_BYTES))
done

UPLOAD_DUR_SEC=$(awk "BEGIN {print ($UPLOAD_END - $UPLOAD_START) / 1000000000}")
if [ "$TOTAL_UP_BYTES" -gt 0 ] && (( $(awk "BEGIN {print ($UPLOAD_DUR_SEC > 0.1)}") )); then
  UPLOAD_MBPS=$(awk "BEGIN {printf \"%.2f\", ($TOTAL_UP_BYTES * 8) / ($UPLOAD_DUR_SEC * 1000000)}")
else
  UPLOAD_MBPS="0.00"
fi

TOTAL_UP_MB=$(awk "BEGIN {printf \"%.1f\", $TOTAL_UP_BYTES / (1024*1024)}")

printf "\r ${GREEN}[OK]${NC} Kecepatan Upload  : %s Mbps (%s MB dalam %.2fs)      \n" \
  "$UPLOAD_MBPS" "$TOTAL_UP_MB" "$UPLOAD_DUR_SEC"
echo ""

# Summary Report
echo " [=] HASIL RINGKASAN DIAGNOSA JARINGAN:"
echo "---------------------------------------------------------"
printf "  Target Server  : %s\n" "$SELECTED_NAME"
printf "  Provider / ISP : %s\n" "$CLIENT_ISP"
printf "  IP Address     : %s\n" "$CLIENT_IP"
printf "  Ping Latency   : %.2f ms\n" "$AVG_PING"
printf "  Jitter         : %.2f ms\n" "$AVG_JITTER"
printf "  Download Speed : %s Mbps\n" "$DOWNLOAD_MBPS"
printf "  Upload Speed   : %s Mbps\n" "$UPLOAD_MBPS"
echo "---------------------------------------------------------"
echo " [OK] Pengujian selesai secara transparan tanpa manipulasi."
echo " Laporan interaktif web: ${BASE_URL}"
echo ""
