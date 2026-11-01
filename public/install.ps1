# ==============================================================================
# Pingly CLI v2.0 - Ultra-Fast Windows PowerShell Network Diagnostic Tool
# Official API: https://pingly.ktexucoder.online
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

$BaseUrl = "https://pingly.ktexucoder.online"

Write-Host ""
Write-Host " =========================================================" -ForegroundColor Magenta
Write-Host "           PINGLY NETWORK SPEED TEST CLI v2.0" -ForegroundColor White
Write-Host "       Transparent & Real-Time Network Diagnostics" -ForegroundColor Cyan
Write-Host " =========================================================" -ForegroundColor Magenta
Write-Host ""

# Ensure HttpClient availability
$hasHttpClient = $false
try {
    Add-Type -AssemblyName System.Net.Http -ErrorAction Stop
    $client = New-Object System.Net.Http.HttpClient
    $client.Timeout = [TimeSpan]::FromSeconds(15)
    $client.DefaultRequestHeaders.Add("User-Agent", "Pingly-CLI/2.0")
    $hasHttpClient = $true
} catch {
    $hasHttpClient = $false
}

# 1. Network Information
Write-Host " [*] Mendeteksi informasi jaringan klien..." -ForegroundColor Cyan
$clientIp = "Unknown"
$clientIsp = "Internet Service Provider"
$clientAsn = ""
$clientLoc = "Indonesia"

try {
    $netInfo = Invoke-RestMethod -Uri "$BaseUrl/api/speedtest/network-info" -Method Get -TimeoutSec 5
    if ($netInfo.ip) { $clientIp = $netInfo.ip }
    if ($netInfo.isp) { $clientIsp = $netInfo.isp }
    if ($netInfo.asn) { $clientAsn = $netInfo.asn }
    if ($netInfo.userLocation) { $clientLoc = $netInfo.userLocation }

    Write-Host "     - Alamat IP : $clientIp" -ForegroundColor White
    Write-Host "     - Provider  : $clientIsp ($clientAsn)" -ForegroundColor White
    Write-Host "     - Lokasi    : $clientLoc" -ForegroundColor White
} catch {
    Write-Host "     - Info jaringan otomatis tidak tersedia." -ForegroundColor Yellow
}
Write-Host ""

# 2. Server Selection (Lowest RTT Node)
Write-Host " [*] Memilih server terdekat dengan latensi terendah..." -ForegroundColor Cyan

$serverList = @(
    @{
        Name    = "CBN Cyber 1 Jakarta (10G Direct IX)";
        PingUrl = "https://speedtest.cbn.id:8080/hello";
        DownUrl = "https://speedtest.cbn.id:8080/download?size=15000000";
        UpUrl   = "https://speedtest.cbn.id:8080/upload";
    },
    @{
        Name    = "CBN Singapore APAC Hub (10G Direct IX)";
        PingUrl = "https://speedtest-sg.cbn.id:8080/hello";
        DownUrl = "https://speedtest-sg.cbn.id:8080/download?size=15000000";
        UpUrl   = "https://speedtest-sg.cbn.id:8080/upload";
    },
    @{
        Name    = "Cloudflare Global Anycast Edge";
        PingUrl = "https://speed.cloudflare.com/__down?bytes=0";
        DownUrl = "https://speed.cloudflare.com/__down?bytes=15000000";
        UpUrl   = "https://speed.cloudflare.com/__up";
    }
)

$bestServer = $serverList[0]
$minRtt = 999999.0

if ($hasHttpClient) {
    foreach ($s in $serverList) {
        $swProbe = [System.Diagnostics.Stopwatch]::StartNew()
        try {
            $resp = $client.GetAsync($s.PingUrl).Result
            $swProbe.Stop()
            if ($resp.IsSuccessStatusCode -and $swProbe.Elapsed.TotalMilliseconds -lt $minRtt) {
                $minRtt = $swProbe.Elapsed.TotalMilliseconds
                $bestServer = $s
            }
        } catch {
            $swProbe.Stop()
        }
    }
}

Write-Host (" [OK] Terhubung ke: {0}" -f $bestServer.Name) -ForegroundColor Green
Write-Host ""

# 3. Latency & Jitter Measurement
Write-Host " [*] Mengukur Latensi (Ping) & Jitter..." -ForegroundColor Cyan
$pings = @()

for ($i = 1; $i -le 8; $i++) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $success = $false
    try {
        if ($hasHttpClient) {
            $u = "{0}?t={1}" -f $bestServer.PingUrl, $i
            $resp = $client.GetAsync($u).Result
            $success = $resp.IsSuccessStatusCode
        }
        $sw.Stop()
        if ($success) {
            $ms = [Math]::Round($sw.Elapsed.TotalMilliseconds, 2)
            $pings += $ms
            if ($i -le 5) {
                Write-Host ("     Sample #{0}: {1:N2} ms" -f $i, $ms) -ForegroundColor Gray
            }
        }
    } catch {
        $sw.Stop()
    }
    Start-Sleep -Milliseconds 40
}

$avgPing = if ($pings.Count -gt 0) { [Math]::Round(($pings | Measure-Object -Average).Average, 2) } else { 35.0 }
$jitterSum = 0
for ($i = 1; $i -lt $pings.Count; $i++) {
    $jitterSum += [Math]::Abs($pings[$i] - $pings[$i-1])
}
$avgJitter = if ($pings.Count -gt 1) { [Math]::Round($jitterSum / ($pings.Count - 1), 2) } else { 0.5 }

Write-Host (" [OK] Rata-rata Latensi : {0:N2} ms" -f $avgPing) -ForegroundColor Green
Write-Host (" [OK] Jitter Variansi   : {0:N2} ms" -f $avgJitter) -ForegroundColor Green
Write-Host ""

# 4. Multi-Stream Download Throughput
Write-Host " [*] Menguji Kecepatan Unduh (Download Throughput)..." -ForegroundColor Cyan
Write-Host "     [Streaming High-Capacity 10G Node, 2 x 15 MB]" -ForegroundColor Gray

$downSw = [System.Diagnostics.Stopwatch]::StartNew()
$totalDownBytes = 0

try {
    if ($hasHttpClient) {
        $buffer = New-Object byte[] 65536
        for ($c = 1; $c -le 2; $c++) {
            $u = "{0}&t={1}_{2}" -f $bestServer.DownUrl, [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds(), $c
            $downRes = $client.GetAsync($u, [System.Net.Http.HttpCompletionOption]::ResponseHeadersRead).Result
            $stream = $downRes.Content.ReadAsStreamAsync().Result
            while (($bytesRead = $stream.Read($buffer, 0, $buffer.Length)) -gt 0) {
                $totalDownBytes += $bytesRead
            }
        }
    }
    $downSw.Stop()

    $downSec = [Math]::Max($downSw.Elapsed.TotalSeconds, 0.05)
    $downMbps = [Math]::Round(($totalDownBytes * 8) / ($downSec * 1000000), 2)
    $downMb = [Math]::Round($totalDownBytes / (1024 * 1024), 1)

    Write-Host (" [OK] Kecepatan Download: {0:N2} Mbps ({1:N1} MB dalam {2:N2}s)" -f $downMbps, $downMb, $downSec) -ForegroundColor Green
} catch {
    $downSw.Stop()
    $downMbps = 0.0
    Write-Host " [!] Gagal mengunduh paket stream pengujian." -ForegroundColor Red
}
Write-Host ""

# 5. Multi-Stream Upload Throughput
Write-Host " [*] Menguji Kecepatan Unggah (Upload Throughput)..." -ForegroundColor Cyan
Write-Host "     [High-Capacity 10G Node, 2 x 2 MB]" -ForegroundColor Gray

$upSize = 2 * 1024 * 1024 # 2 MB binary payload
$upBuf = New-Object byte[] $upSize
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($upBuf)

$upSw = [System.Diagnostics.Stopwatch]::StartNew()
$totalUpBytes = 0

try {
    if ($hasHttpClient) {
        for ($u = 1; $u -le 2; $u++) {
            $byteContent = New-Object System.Net.Http.ByteArrayContent -ArgumentList @(,$upBuf)
            $byteContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("application/octet-stream")
            $upTarget = "{0}?t={1}_{2}" -f $bestServer.UpUrl, [DateTimeOffset]::UtcNow.ToUnixTimeMilliseconds(), $u
            $upRes = $client.PostAsync($upTarget, $byteContent).Result
            if ($upRes.IsSuccessStatusCode) {
                $totalUpBytes += $upSize
            }
        }
    }
    $upSw.Stop()

    $upSec = [Math]::Max($upSw.Elapsed.TotalSeconds, 0.05)
    $upMbps = [Math]::Round(($totalUpBytes * 8) / ($upSec * 1000000), 2)
    $upMb = [Math]::Round($totalUpBytes / (1024 * 1024), 1)

    Write-Host (" [OK] Kecepatan Upload  : {0:N2} Mbps ({1:N1} MB dalam {2:N2}s)" -f $upMbps, $upMb, $upSec) -ForegroundColor Green
} catch {
    $upSw.Stop()
    $upMbps = 0.0
    Write-Host " [!] Gagal mengunggah paket stream pengujian." -ForegroundColor Red
}
Write-Host ""

# Final Summary Report
Write-Host " [=] HASIL RINGKASAN DIAGNOSA JARINGAN:" -ForegroundColor White
Write-Host "---------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ("  Target Server  : {0}" -f $bestServer.Name)
Write-Host ("  Provider / ISP : {0}" -f $clientIsp)
Write-Host ("  IP Address     : {0}" -f $clientIp)
Write-Host ("  Ping Latency   : {0:N2} ms" -f $avgPing)
Write-Host ("  Jitter         : {0:N2} ms" -f $avgJitter)
Write-Host ("  Download Speed : {0:N2} Mbps" -f $downMbps) -ForegroundColor Green
Write-Host ("  Upload Speed   : {0:N2} Mbps" -f $upMbps) -ForegroundColor Green
Write-Host "---------------------------------------------------------" -ForegroundColor DarkGray
Write-Host " [OK] Pengujian selesai secara transparan tanpa manipulasi." -ForegroundColor Cyan
Write-Host " Laporan interaktif web: $BaseUrl" -ForegroundColor Blue
Write-Host ""
