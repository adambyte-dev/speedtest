# ==============================================================================
# Pingly CLI - Windows PowerShell Network Diagnostic Tool
# Official API: https://pingly.ktexucoder.online
# ==============================================================================

[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
$OutputEncoding = [System.Text.Encoding]::UTF8
try { [Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12 } catch {}

$BaseUrl = "https://pingly.ktexucoder.online"

Write-Host ""
Write-Host " =========================================================" -ForegroundColor Magenta
Write-Host "           PINGLY NETWORK SPEED TEST CLI v1.2" -ForegroundColor White
Write-Host "       Transparent & Real-Time Network Diagnostics" -ForegroundColor Cyan
Write-Host " =========================================================" -ForegroundColor Magenta
Write-Host ""

# Ensure HttpClient or WebClient availability
$hasHttpClient = $false
try {
    Add-Type -AssemblyName System.Net.Http -ErrorAction Stop
    $client = New-Object System.Net.Http.HttpClient
    $client.Timeout = [TimeSpan]::FromSeconds(20)
    $hasHttpClient = $true
} catch {
    $hasHttpClient = $false
}

# 1. Network Information
Write-Host " [*] Mendeteksi informasi jaringan klien..." -ForegroundColor Cyan
try {
    $netInfo = Invoke-RestMethod -Uri "$BaseUrl/api/speedtest/network-info" -Method Get -TimeoutSec 6
    $clientIp = if ($netInfo.ip) { $netInfo.ip } else { "Unknown" }
    $clientIsp = if ($netInfo.isp) { $netInfo.isp } else { "Internet Service Provider" }
    $clientAsn = if ($netInfo.asn) { $netInfo.asn } else { "" }
    $clientLoc = if ($netInfo.userLocation) { $netInfo.userLocation } else { "Indonesia" }

    Write-Host "     - Alamat IP : $clientIp" -ForegroundColor White
    Write-Host "     - Provider  : $clientIsp ($clientAsn)" -ForegroundColor White
    Write-Host "     - Lokasi    : $clientLoc" -ForegroundColor White
} catch {
    $clientIp = "Unknown"
    $clientIsp = "Internet Service Provider"
    Write-Host "     - Gagal mendeteksi info jaringan otomatis." -ForegroundColor Yellow
}
Write-Host ""

# 2. Latency & Jitter
Write-Host " [*] Mengukur Latensi (Ping) & Jitter..." -ForegroundColor Cyan
$pings = @()

for ($i = 1; $i -le 5; $i++) {
    $sw = [System.Diagnostics.Stopwatch]::StartNew()
    $success = $false
    try {
        if ($hasHttpClient) {
            $resp = $client.GetAsync("$BaseUrl/api/speedtest/ping?t=$i").Result
            $success = $resp.IsSuccessStatusCode
        } else {
            $wc = New-Object System.Net.WebClient
            $null = $wc.DownloadString("$BaseUrl/api/speedtest/ping?t=$i")
            $success = $true
        }
        $sw.Stop()
        if ($success) {
            $ms = [Math]::Round($sw.Elapsed.TotalMilliseconds, 2)
            $pings += $ms
            Write-Host ("     Sample #{0}: {1:N2} ms" -f $i, $ms) -ForegroundColor Gray
        }
    } catch {
        $sw.Stop()
    }
    Start-Sleep -Milliseconds 60
}

$avgPing = if ($pings.Count -gt 0) { [Math]::Round(($pings | Measure-Object -Average).Average, 2) } else { 0.0 }
$jitterSum = 0
for ($i = 1; $i -lt $pings.Count; $i++) {
    $jitterSum += [Math]::Abs($pings[$i] - $pings[$i-1])
}
$avgJitter = if ($pings.Count -gt 1) { [Math]::Round($jitterSum / ($pings.Count - 1), 2) } else { 0.0 }

Write-Host (" [OK] Rata-rata Latensi : {0:N2} ms" -f $avgPing) -ForegroundColor Green
Write-Host (" [OK] Jitter Variansi   : {0:N2} ms" -f $avgJitter) -ForegroundColor Green
Write-Host ""

# 3. Download Speed Test
Write-Host " [*] Menguji Kecepatan Unduh (Download Throughput)..." -ForegroundColor Cyan
$downUrl = "$BaseUrl/api/speedtest/download?size=4m"
$swDown = [System.Diagnostics.Stopwatch]::StartNew()
try {
    if ($hasHttpClient) {
        $downResp = $client.GetAsync($downUrl, [System.Net.Http.HttpCompletionOption]::ResponseContentRead).Result
        $bytes = $downResp.Content.ReadAsByteArrayAsync().Result
    } else {
        $wc = New-Object System.Net.WebClient
        $bytes = $wc.DownloadData($downUrl)
    }
    $swDown.Stop()

    $downSec = [Math]::Max($swDown.Elapsed.TotalSeconds, 0.05)
    $downMbps = [Math]::Round(($bytes.Length * 8) / ($downSec * 1000000), 2)

    Write-Host (" [OK] Kecepatan Download: {0:N2} Mbps ({1:N0} KB dalam {2:N2}s)" -f $downMbps, ($bytes.Length / 1024), $downSec) -ForegroundColor Green
} catch {
    $swDown.Stop()
    $downMbps = 0.0
    Write-Host " [!] Gagal mengunduh paket stream pengujian." -ForegroundColor Red
}
Write-Host ""

# 4. Upload Speed Test
Write-Host " [*] Menguji Kecepatan Unggah (Upload Throughput)..." -ForegroundColor Cyan
$upSize = 1 * 1024 * 1024 # 1 MB random uncompressible data
$upBuf = New-Object byte[] $upSize
$rng = [System.Security.Cryptography.RandomNumberGenerator]::Create()
$rng.GetBytes($upBuf)

$swUp = [System.Diagnostics.Stopwatch]::StartNew()
try {
    if ($hasHttpClient) {
        $byteContent = New-Object System.Net.Http.ByteArrayContent -ArgumentList @(,$upBuf)
        $byteContent.Headers.ContentType = [System.Net.Http.Headers.MediaTypeHeaderValue]::Parse("application/octet-stream")
        $upResp = $client.PostAsync("$BaseUrl/api/speedtest/upload", $byteContent).Result
        $null = $upResp.EnsureSuccessStatusCode()
    } else {
        $wc = New-Object System.Net.WebClient
        $wc.Headers.Add("Content-Type", "application/octet-stream")
        $null = $wc.UploadData("$BaseUrl/api/speedtest/upload", "POST", $upBuf)
    }
    $swUp.Stop()

    $upSec = [Math]::Max($swUp.Elapsed.TotalSeconds, 0.05)
    $upMbps = [Math]::Round(($upSize * 8) / ($upSec * 1000000), 2)

    Write-Host (" [OK] Kecepatan Upload  : {0:N2} Mbps ({1:N0} KB dalam {2:N2}s)" -f $upMbps, ($upSize / 1024), $upSec) -ForegroundColor Green
} catch {
    $swUp.Stop()
    $upMbps = 0.0
    Write-Host " [!] Gagal mengunggah paket stream pengujian." -ForegroundColor Red
}
Write-Host ""

# Final Summary Report
Write-Host " [=] HASIL RINGKASAN DIAGNOSA JARINGAN:" -ForegroundColor White
Write-Host "---------------------------------------------------------" -ForegroundColor DarkGray
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
