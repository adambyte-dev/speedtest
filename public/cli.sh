#!/usr/bin/env bash
# ==============================================================================
# Pingly CLI - Ultra-Modern, Transparent Network Diagnostic Tool
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
NC='\033[0m' # No Color

echo -e "${PURPLE}${BOLD}"
echo "  ⚡ ================================================= ⚡"
echo "           PINGLY NETWORK SPEED TEST CLI v1.2"
echo "       Transparent & Real-Time Network Diagnostics"
echo "  ⚡ ================================================= ⚡"
echo -e "${NC}"

# Check for curl
if ! command -v curl >/dev/null 2>&1; then
  echo -e "${RED}Error: 'curl' is required but not installed.${NC}"
  exit 1
fi

# 1. Fetching Network Telemetry
echo -e "${CYAN}🔍 Mendeteksi informasi jaringan klien...${NC}"
NET_INFO=$(curl -s --max-time 5 "${BASE_URL}/api/speedtest/network-info" || echo "{}")

CLIENT_IP=$(echo "$NET_INFO" | grep -o '"ip":"[^"]*' | cut -d'"' -f4 || echo "Unknown")
CLIENT_ISP=$(echo "$NET_INFO" | grep -o '"isp":"[^"]*' | cut -d'"' -f4 || echo "Unknown ISP")
CLIENT_ASN=$(echo "$NET_INFO" | grep -o '"asn":"[^"]*' | cut -d'"' -f4 || echo "Unknown ASN")
CLIENT_LOC=$(echo "$NET_INFO" | grep -o '"userLocation":"[^"]*' | cut -d'"' -f4 || echo "Indonesia")

echo -e "   • Alamat IP : ${BOLD}${CLIENT_IP}${NC}"
echo -e "   • Provider  : ${BOLD}${CLIENT_ISP} (${CLIENT_ASN})${NC}"
echo -e "   • Lokasi    : ${BOLD}${CLIENT_LOC}${NC}"
echo ""

# 2. Testing Latency & Jitter
echo -e "${CYAN}📡 Mengukur Latensi (Ping) & Jitter...${NC}"
PINGS=()
TOTAL_PING=0
SAMPLE_COUNT=5

for i in $(seq 1 $SAMPLE_COUNT); do
  START_TIME=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')
  HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" --max-time 3 "${BASE_URL}/api/speedtest/ping?t=${i}")
  END_TIME=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')
  
  if [ "$HTTP_CODE" = "200" ]; then
    DIFF_MS=$(awk "BEGIN {print ($END_TIME - $START_TIME) / 1000000}")
    PINGS+=("$DIFF_MS")
    TOTAL_PING=$(awk "BEGIN {print $TOTAL_PING + $DIFF_MS}")
    printf "   Sample #%d: %.2f ms\n" "$i" "$DIFF_MS"
  fi
  sleep 0.1
done

AVG_PING=$(awk "BEGIN {print $TOTAL_PING / ${#PINGS[@]}}")

# Jitter Calculation
JITTER_SUM=0
COUNT=${#PINGS[@]}
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

printf "   ${GREEN}✓ Rata-rata Latensi : %.2f ms${NC}\n" "$AVG_PING"
printf "   ${GREEN}✓ Jitter Variansi  : %.2f ms${NC}\n" "$AVG_JITTER"
echo ""

# 3. Testing Download Speed
echo -e "${CYAN}📥 Menguji Kecepatan Unduh (Download Throughput)...${NC}"
DOWNLOAD_START=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')

# Stream uncompressible 8MB random payload
DOWNLOAD_BYTES=$(curl -s -w "%{size_download}" -o /dev/null --max-time 10 "${BASE_URL}/api/speedtest/download?size=8m")
DOWNLOAD_END=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')

DOWNLOAD_DUR_SEC=$(awk "BEGIN {print ($DOWNLOAD_END - $DOWNLOAD_START) / 1000000000}")
if (( $(awk "BEGIN {print ($DOWNLOAD_DUR_SEC > 0.05)}") )); then
  DOWNLOAD_MBPS=$(awk "BEGIN {print ($DOWNLOAD_BYTES * 8) / ($DOWNLOAD_DUR_SEC * 1000000)}")
else
  DOWNLOAD_MBPS=0
fi

printf "   ${GREEN}✓ Kecepatan Download: %.2f Mbps${NC} (Transfer: %d KB dalam %.2fs)\n" \
  "$DOWNLOAD_MBPS" $((DOWNLOAD_BYTES / 1024)) "$DOWNLOAD_DUR_SEC"
echo ""

# 4. Testing Upload Speed
echo -e "${CYAN}📤 Menguji Kecepatan Unggah (Upload Throughput)...${NC}"
TMP_FILE=$(mktemp 2>/dev/null || echo "/tmp/pingly_upload.bin")
# Generate 2MB random uncompressible data
dd if=/dev/urandom of="$TMP_FILE" bs=1048576 count=2 status=none 2>/dev/null || head -c 2097152 /dev/urandom > "$TMP_FILE"

UPLOAD_START=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')
UPLOAD_HTTP=$(curl -s -o /dev/null -w "%{http_code}" -X POST "${BASE_URL}/api/speedtest/upload" \
  --data-binary @"$TMP_FILE" --max-time 10 -H "Content-Type: application/octet-stream")
UPLOAD_END=$(date +%s%N 2>/dev/null || python3 -c 'import time; print(int(time.time()*1e9))')
rm -f "$TMP_FILE"

UPLOAD_DUR_SEC=$(awk "BEGIN {print ($UPLOAD_END - $UPLOAD_START) / 1000000000}")
if [ "$UPLOAD_HTTP" = "200" ] && (( $(awk "BEGIN {print ($UPLOAD_DUR_SEC > 0.05)}") )); then
  UPLOAD_MBPS=$(awk "BEGIN {print (2097152 * 8) / ($UPLOAD_DUR_SEC * 1000000)}")
else
  UPLOAD_MBPS=0
fi

printf "   ${GREEN}✓ Kecepatan Upload  : %.2f Mbps${NC} (Transfer: 2048 KB dalam %.2fs)\n" \
  "$UPLOAD_MBPS" "$UPLOAD_DUR_SEC"
echo ""

# Summary Report
echo -e "${BOLD}📊 HASIL RINGKASAN DIAGNOSA JARINGAN:${NC}"
echo "---------------------------------------------------------"
printf "  • Provider / ISP : %s\n" "$CLIENT_ISP"
printf "  • IP Address     : %s\n" "$CLIENT_IP"
printf "  • Ping Latency   : %.2f ms\n" "$AVG_PING"
printf "  • Jitter         : %.2f ms\n" "$AVG_JITTER"
printf "  • Download Speed : ${BOLD}%.2f Mbps${NC}\n" "$DOWNLOAD_MBPS"
printf "  • Upload Speed   : ${BOLD}%.2f Mbps${NC}\n" "$UPLOAD_MBPS"
echo "---------------------------------------------------------"
echo -e "${GREEN}✓ Pengujian selesai secara transparan tanpa manipulasi.${NC}"
echo -e "Laporan interaktif web: ${BLUE}${BASE_URL}${NC}"
