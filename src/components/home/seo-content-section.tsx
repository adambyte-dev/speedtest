"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Activity,
  ChevronDown,
  Gauge,
  HelpCircle,
  Laptop,
  Radio,
  Server,
  ShieldCheck,
  Smartphone,
  Tv,
  Wifi,
  Zap,
} from "lucide-react";
import { useLanguage } from "@/context/language-context";
import { LanguageCode } from "@/lib/i18n/types";

interface FaqData {
  q: string;
  a: string;
}

const FAQ_DATA: Record<LanguageCode, FaqData[]> = {
  id: [
    {
      q: "Bagaimana cara melakukan tes kecepatan internet di Pingly Speed Test?",
      a: "Cukup klik tombol bulat 'Mulai Test' di bagian atas halaman. Pingly akan secara otomatis mengirimkan paket data stream murni multi-stream ke server terdekat untuk mengukur latensi (ping), variasi jitter, kecepatan unduh (download), dan kecepatan unggah (upload) secara real-time.",
    },
    {
      q: "Berapa kecepatan internet ideal untuk bermain game online, streaming 4K, dan WFH?",
      a: "Untuk streaming video 4K Ultra HD di Netflix atau YouTube dibutuhkan minimal 25–50 Mbps per perangkat. Untuk game online kompetitif (Mobile Legends, PUBG, Valorant, Dota 2), nilai ping rendah (di bawah 30 ms) dan jitter stabil jauh lebih penting dibandingkan kecepatan unduh. Untuk panggilan video HD (Zoom, Google Meet), koneksi 10–20 Mbps dengan upload minimal 5 Mbps sudah sangat stabil.",
    },
    {
      q: "Apa perbedaan antara Mbps (Megabit per detik) dan MB/s (Megabyte per detik)?",
      a: "1 Byte sama dengan 8 bit. Provider internet (ISP) selalu menjual paket dalam satuan Mbps (Megabit per second), sedangkan aplikasi unduhan browser atau Steam menampilkan kecepatan dalam MB/s (Megabyte per second). Jika paket internet Anda 100 Mbps, kecepatan download riil adalah 100 ÷ 8 = 12.5 MB/s.",
    },
    {
      q: "Mengapa hasil speed test di Pingly berbeda dengan aplikasi lain?",
      a: "Banyak speed test menggunakan algoritma kompresi atau kurva sinus sintetis buatan yang memanipulasi angka agar terlihat lebih tinggi demi kepuasan pemasaran. Pingly menggunakan stream data pseudorandom entropi tinggi tanpa kompresi yang tidak dapat dimanipulasi oleh proxy ISP, mencerminkan kapasitas fisik pipa internet Anda yang sebenarnya.",
    },
    {
      q: "Apa perbedaan Mode Multi dan Mode Tunggal (Single)?",
      a: "Mode Multi membuka beberapa socket TCP paralel secara simultan untuk menguji kapasitas bandwidth puncak maksimum pipa broadband Anda. Mode Tunggal menguji throughput satu koneksi socket tunggal, sangat ideal untuk mensimulasikan unduhan file tunggal atau panggilan video satu lawan satu.",
    },
    {
      q: "Bagaimana cara mengatasi internet atau Wi-Fi yang lambat?",
      a: "1) Pindahkan perangkat lebih dekat ke router Wi-Fi. 2) Gunakan frekuensi Wi-Fi 5 GHz atau 6 GHz dibanding 2.4 GHz yang padat. 3) Gunakan kabel LAN Ethernet untuk latensi terendah. 4) Restart router secara berkala untuk membersihkan memori buffer. 5) Cek aplikasi latar belakang yang mengonsumsi bandwidth.",
    },
  ],
  en: [
    {
      q: "How do I perform an internet speed test on Pingly?",
      a: "Simply click the 'Start Test' button at the top of the page. Pingly automatically streams uncompressed multi-stream packets to the nearest edge server to measure latency (ping), jitter variance, download speed, and upload speed in real time.",
    },
    {
      q: "What is an ideal internet speed for gaming, 4K streaming, and working from home?",
      a: "For 4K Ultra HD streaming on Netflix or YouTube, at least 25–50 Mbps per device is recommended. For competitive online gaming (Valorant, CS2, Dota 2), low latency (<30 ms) and zero jitter are much more important than sheer download speed. For HD video calls (Zoom, Meet), 15–25 Mbps with at least 5 Mbps upload is optimal.",
    },
    {
      q: "What is the difference between Mbps (Megabits per second) and MB/s (Megabytes per second)?",
      a: "1 Byte equals 8 bits. Internet service providers (ISPs) sell bandwidth packages in Mbps (Megabits per second), while web browsers, Steam, and download managers display transfer rates in MB/s (Megabytes per second). If your plan is 100 Mbps, your real download throughput is 100 ÷ 8 = 12.5 MB/s.",
    },
    {
      q: "Why do Pingly speed test results differ from other tools?",
      a: "Many speed tests use synthetic smoothing curves or compression that artificially inflate numbers for marketing. Pingly uses high-entropy uncompressible data streams that bypass ISP caching proxies, revealing your true physical line capacity.",
    },
    {
      q: "What is the difference between Multi and Single connection mode?",
      a: "Multi mode opens multiple parallel TCP sockets simultaneously to test your broadband line's absolute maximum peak bandwidth. Single mode measures the throughput of a single direct socket connection, ideal for simulating single file downloads or peer-to-peer calls.",
    },
    {
      q: "How can I fix slow internet or unstable Wi-Fi?",
      a: "1) Move closer to your Wi-Fi router. 2) Switch to 5 GHz or 6 GHz bands rather than congested 2.4 GHz. 3) Connect via Ethernet cable for minimal latency. 4) Reboot your modem/router periodically to clear buffer queues. 5) Check background apps consuming bandwidth.",
    },
  ],
  ja: [
    {
      q: "Pinglyスピードテストで測定を行うにはどうすればよいですか？",
      a: "ページ上部の「テスト開始」ボタンをクリックするだけです。最寄りのエッジサーバーにマルチストリーム接続を確立し、ダウンロード速度、アップロード速度、Ping応答、ジッターをリアルタイムで測定します。",
    },
    {
      q: "オンラインゲーム、4K動画、在宅勤務に理想的な通信速度は？",
      a: "NetflixやYouTubeでの4K動画再生には1台あたり25〜50 Mbpsが必要です。FPSなどの対戦型オンラインゲームでは、下り速度よりも30ms以下の低Ping値と安定したジッターが最も重要です。Zoom通話には15〜25 Mbpsが推奨されます。",
    },
    {
      q: "Mbps（メガビット毎秒）とMB/s（メガバイト毎秒）の違いは何ですか？",
      a: "1バイトは8ビットに相当します。インターネットプロバイダ（ISP）は通信速度をMbpsで表記しますが、ブラウザやSteamでのファイル保存速度はMB/sで表示されます。100 Mbpsの回線の場合、実効保存速度は100 ÷ 8 = 12.5 MB/sとなります。",
    },
    {
      q: "Pinglyの測定結果が他のスピードテストと異なる理由は何ですか？",
      a: "一部のスピードテストはプロバイダ内部のキャッシュサーバーを用いて人為的に数値を高く見せる場合があります。Pinglyは圧縮不可能な高エントロピー生データを用い、実際のインターネット利用環境における純粋な回線品質を測定します。",
    },
    {
      q: "マルチモードとシングルモードの違いは何ですか？",
      a: "マルチモードは複数の並列TCPソケットを開き、契約回線の最大帯域幅を計測します。シングルモードは単一のソケット通信をテストし、一般的なWeb閲覧や個別ファイル転送の安定度を評価するのに最適です。",
    },
    {
      q: "Wi-Fiやインターネットの通信速度を改善するには？",
      a: "1) Wi-Fiルーターの近くに移動する。2) 混雑した2.4 GHz帯から5 GHzまたは6 GHz帯に切り替える。3) 有線LANケーブルを使用する。4) 定期的にルーターを再起動する。5) バックグラウンドで帯域を消費しているアプリを確認する。",
    },
  ],
  zh: [
    {
      q: "如何使用Pingly进行网络测速？",
      a: "只需点击页面顶部的“开始测速”按钮。Pingly会自动与距离您最近的高速边缘节点建立多路流连接，毫秒级实时计算下载速率、上传速率、Ping延迟与网络抖动。",
    },
    {
      q: "网络游戏、4K高清播放及远程办公需要多大网速？",
      a: "4K超高清视频流媒体通常需要单设备25-50 Mbps。对于电竞竞技网游，低于30毫秒的极低Ping和零抖动远比盲目追求高下行更关键。对于高清视频会议，15-25 Mbps且上行5 Mbps即可保持高度稳定。",
    },
    {
      q: "Mbps（兆比特/秒）与MB/s（兆字节/秒）有什么区别？",
      a: "计算机中1字节（Byte）等于8比特（bit）。宽带运营商（ISP）宣传的千兆或百兆均为Mbps，而浏览器下载器或Steam显示的是MB/s。若您的宽带为100 Mbps，实际物理最高下载速度为100 ÷ 8 = 12.5 MB/s。",
    },
    {
      q: "为什么Pingly的测速结果与某些其他软件不同？",
      a: "许多测试工具内置算法拟合或连接运营商内网缓存节点以美化数值。Pingly采用高熵无压缩数据块测试，穿透运营商透明代理，真实客观呈现您连接公网核心节点的物理带宽。",
    },
    {
      q: "多线程模式与单线程模式有什么区别？",
      a: "多线程模式同时开启多个TCP并发通道，测算宽带物理管道的极限峰值承载能力；单线程模式测量单一Socket的传输表现，能更精确反映日常网页加载与点对点直连的即时质量。",
    },
    {
      q: "如何解决WiFi信号卡顿与网络迟缓问题？",
      a: "1) 靠近无线路由器减少物理阻隔。2) 尽量切换到5 GHz或Wi-Fi 6的6 GHz纯净频段。3) 对竞技游戏建议采用千兆网线直连。4) 定期重启路由器清理缓存队列。5) 关闭占用后台上传的冷门程序。",
    },
  ],
  es: [
    {
      q: "¿Cómo realizo una prueba de velocidad en Pingly?",
      a: "Simplemente haz clic en el botón 'Iniciar Prueba' en la parte superior. Pingly enviará flujos de datos sin compresión al nodo más cercano para medir descarga, subida, ping y jitter en tiempo real.",
    },
    {
      q: "¿Cuál es la velocidad recomendada para juegos, streaming 4K y teletrabajo?",
      a: "Para streaming 4K en Netflix o YouTube se recomiendan de 25 a 50 Mbps por equipo. Para juegos online, un ping bajo (<30 ms) y estabilidad son más importantes que la velocidad de bajada. Para videollamadas HD, 15 a 25 Mbps son suficientes.",
    },
    {
      q: "¿Cuál es la diferencia entre Mbps y MB/s?",
      a: "1 Byte equivale a 8 bits. Los operadores venden paquetes en Mbps (Megabits por segundo), mientras que Steam o navegadores muestran MB/s (Megabytes por segundo). Una conexión de 100 Mbps descarga archivos a 100 ÷ 8 = 12.5 MB/s.",
    },
    {
      q: "¿Por qué los resultados de Pingly difieren de otras aplicaciones?",
      a: "Muchas aplicaciones usan servidores internos del proveedor o compresión que infla las cifras. Pingly utiliza datos de alta entropía que atraviesan los proxies del ISP para reflejar la capacidad física real de tu conexión.",
    },
    {
      q: "¿Cuál es la diferencia entre el Modo Multi y el Modo Único?",
      a: "El Modo Multi abre múltiples conexiones simultáneas para medir la capacidad pico total de tu línea. El Modo Único prueba una sola sesión TCP, ideal para evaluar navegación web estándar o llamadas uno a uno.",
    },
    {
      q: "¿Cómo solucionar una conexión a internet o Wi-Fi lenta?",
      a: "1) Acércate al router. 2) Usa la banda de 5 GHz o 6 GHz en vez de 2.4 GHz. 3) Conéctate por cable Ethernet para máxima estabilidad. 4) Reinicia el módem regularmente. 5) Cierra apps en segundo plano que usen ancho de banda.",
    },
  ],
  ar: [
    {
      q: "كيف يمكنني إجراء اختبار سرعة الإنترنت على Pingly؟",
      a: "ما عليك سوى النقر على زر 'بدء الاختبار' أعلى الصفحة. يقوم النظام تلقائياً بإرسال تدفقات بيانات حقيقية متعددة المسارات إلى أقرب خادم لقياس التنزيل والرفع والاستجابة والتذبذب بشكل مباشر.",
    },
    {
      q: "ما هي السرعة المثالية للألعاب عبر الإنترنت، وبث 4K، والعمل عن بعد؟",
      a: "يتطلب بث 4K ما بين 25 إلى 50 ميجابت لكل جهاز. أما للألعاب التنافسية، فإن زمن الاستجابة المنخفض (أقل من 30 مللي ثانية) واستقرار التذبذب أهم بكثير من سرعة التحميل العالية.",
    },
    {
      q: "ما الفرق بين Mbps (ميجابت/ثانية) و MB/s (ميجابايت/ثانية)؟",
      a: "البايت الواحد يساوي 8 بت. شركات الإنترنت تبيع الباقات بوحدة Mbps، بينما تعرض برامج التنزيل السرعة بوحدة MB/s. إذا كانت باقتك 100 Mbps، فإن سرعة التنزيل الفعلية للملفات هي 100 ÷ 8 = 12.5 MB/s.",
    },
    {
      q: "لماذا تختلف نتائج Pingly عن بعض المواقع الأخرى؟",
      a: "تعتمد بعض المواقع على خوادم داخلية لشبكة المزود أو خوارزميات مضغوطة تُظهر أرقاماً غير دقيقة. يستخدم Pingly بيانات عشوائية حقيقية غير قابلة للتلاعب لتعكس السعة الفعلية لخطك.",
    },
    {
      q: "ما الفرق بين الوضع المتعدد (Multi) والوضع الأحادي (Single)؟",
      a: "يفتح الوضع المتعدد عدة اتصالات متزامنة لقياس السعة القصوى للباندويث المتاح، بينما يقيس الوضع الأحادي اتصالاً فردياً واحداً لمحاكاة التصفح العادي.",
    },
    {
      q: "كيف أقوم بتسريع اتصال الواي فاي والإنترنت المنزلي؟",
      a: "1) الاقتراب من جهاز التوجيه (الراوتر). 2) استخدام تردد 5 GHz بدلاً من 2.4 GHz المزدحم. 3) استخدام كابل إيثرنت للألعاب الحساسة. 4) إعادة تشغيل الراوتر دورياً. 5) إيقاف التطبيقات التي تستهلك البيانات في الخلفية.",
    },
  ],
};

const ISP_BENCHMARKS = [
  { provider: "Telkomsel / IndiHome", tech: "Fiber FTTH & 5G/4G", avgPing: "12 - 25 ms", typicalSpeed: "30 - 300 Mbps", peering: "Direct OpenIXP & Telkom Anycast" },
  { provider: "Biznet Networks", tech: "Pure Fiber FTTH / Metro", avgPing: "8 - 18 ms", typicalSpeed: "50 - 500 Mbps", peering: "Direct IIX & Global Tier-1" },
  { provider: "MyRepublic", tech: "Ultra Fiber FTTH", avgPing: "9 - 20 ms", typicalSpeed: "50 - 500 Mbps", peering: "Low-latency Gaming Route" },
  { provider: "First Media (Link Net)", tech: "Hybrid Fiber Coaxial / FTTH", avgPing: "15 - 32 ms", typicalSpeed: "30 - 300 Mbps", peering: "Local Cache & CDG Hub" },
  { provider: "XL Axiata / XL Satu", tech: "FTTH & 4.5G/5G LTE", avgPing: "14 - 30 ms", typicalSpeed: "30 - 200 Mbps", peering: "Direct Transit Singapore" },
  { provider: "Indosat Ooredoo Hutchison", tech: "FTTH HiFi & 4G/5G", avgPing: "15 - 35 ms", typicalSpeed: "30 - 250 Mbps", peering: "BGP Anycast & APJII IIX" },
];

export function SeoContentSection() {
  const { lang } = useLanguage();
  const currentLang = (lang as LanguageCode) || "id";
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const toggleFaq = (index: number) => {
    setOpenFaq((prev) => (prev === index ? null : index));
  };

  const currentFaqs = FAQ_DATA[currentLang] || FAQ_DATA.id;

  // Localized headers and strings
  const labels = {
    id: {
      badge: "Panduan Lengkap & Metodologi Pengujian Jaringan",
      heading: "Pingly Speed Test: Uji Kecepatan Internet Akurat & Transparan di Indonesia",
      subheading: "Platform telemetri diagnostik internet modern untuk mengukur kapasitas unduh (download), unggah (upload), latensi ping, jitter, dan kehilangan paket (packet loss) secara real-time tanpa manipulasi.",
      p1Title: "Download & Upload Bandwidth Riil",
      p1Desc: "Pingly menguji kapasitas transfer data menggunakan protokol HTTP/2 dan WebSocket multi-stream. Data chunk pseudorandom entropi tinggi mencegah kompresi semu dari router dan modem ISP.",
      p2Title: "Latensi Unloaded vs Loaded (Bufferbloat)",
      p2Desc: "Mengukur latensi saat jaringan santai (unloaded) dan saat pengunduhan serta pengunggahan aktif (loaded) untuk mendeteksi bufferbloat yang menjadi penyebab lag gaming.",
      p3Title: "Jaringan Node Edge Anycast Global",
      p3Desc: "Terhubung langsung dengan node server strategis di Jakarta (IIX & OpenIXP), Surabaya, Medan, Singapura, Tokyo, dan London dengan deteksi jarak geografis Haversine otomatis.",
      tableTitle: "Standar Kebutuhan Kecepatan Internet Berdasarkan Aktivitas Digital",
      tableDesc: "Gunakan tabel acuan berikut untuk mengevaluasi apakah hasil speed test Anda memenuhi standar kebutuhan aktivitas harian:",
      colActivity: "Aktivitas Digital",
      colMinDown: "Min. Download",
      colMinUp: "Min. Upload",
      colPing: "Ping Disarankan",
      colStability: "Tingkat Stabilitas",
      ispTitle: "Tabel Referensi Provider Internet & ISP Utama",
      ispDesc: "Pingly mendukung pengujian otomatis pada jaringan seluruh penyedia layanan internet terkemuka:",
      colProvider: "Provider / ISP",
      colTech: "Teknologi Jaringan",
      colAvgPing: "Latensi Rata-rata",
      colSpeedRange: "Rentang Paket",
      colPeering: "Karakteristik Peering",
      faqTitle: "Pertanyaan yang Sering Diajukan (FAQ) Seputar Tes Kecepatan Internet",
      faqDesc: "Jawaban lengkap seputar cara kerja pengujian, metrik teknis, dan tips memaksimalkan kecepatan Wi-Fi Anda.",
      learnMore: "Pelajari Lebih Lanjut:",
    },
    en: {
      badge: "Comprehensive Guide & Network Testing Methodology",
      heading: "Pingly Speed Test: Accurate & Transparent Internet Speed Diagnostics Worldwide",
      subheading: "Modern internet diagnostic telemetry platform measuring real-time download, upload, ping latency, jitter, and packet loss without synthetic manipulation.",
      p1Title: "Real Download & Upload Bandwidth",
      p1Desc: "Pingly tests data transfer using HTTP/2 and multi-stream WebSockets. High-entropy pseudorandom data chunks prevent artificial ISP compression, yielding pure throughput.",
      p2Title: "Unloaded vs Loaded Latency (Bufferbloat)",
      p2Desc: "Measures ping during idle and heavy download/upload load. Accurately detects bufferbloat, the primary culprit behind online gaming lag and VoIP jitter.",
      p3Title: "Global Anycast Edge Network",
      p3Desc: "Directly interconnected with strategic edge nodes in Jakarta, Singapore, Tokyo, and London with automated Haversine geographic distance calculation.",
      tableTitle: "Recommended Internet Speed Standards by Digital Activity",
      tableDesc: "Use the benchmark reference below to evaluate whether your speed test results meet the standard requirements for daily online activities:",
      colActivity: "Digital Activity",
      colMinDown: "Min. Download",
      colMinUp: "Min. Upload",
      colPing: "Target Ping",
      colStability: "Stability Requirement",
      ispTitle: "ISP & Global Network Providers Benchmark",
      ispDesc: "Pingly supports automatic testing across leading mobile and fixed-broadband internet service providers:",
      colProvider: "Provider / ISP",
      colTech: "Network Technology",
      colAvgPing: "Average Latency",
      colSpeedRange: "Typical Plan",
      colPeering: "Peering Characteristics",
      faqTitle: "Frequently Asked Questions (FAQ) About Internet Speed Tests",
      faqDesc: "In-depth technical answers on how network testing works, loaded latency, bufferbloat, and Wi-Fi tips.",
      learnMore: "Learn More:",
    },
    ja: {
      badge: "ネットワーク測定手法と総合ガイド",
      heading: "Pingly スピードテスト: 高精度で透明なインターネット通信速度診断",
      subheading: "ダウンロード、アップロード、Ping遅延、ジッター、パケットロスを合成操作なしでリアルタイム測定する現代的な回線診断プラットフォーム。",
      p1Title: "下り・上りの実効帯域幅",
      p1Desc: "HTTP/2とマルチストリームWebSocketで測定。高エントロピー疑似ランダムチャンクによりISPの圧縮を回避し、純粋なスループットを計測。",
      p2Title: "無負荷 vs 負荷時遅延 (バッファブロート)",
      p2Desc: "アイドル時と負荷時のPing応答を比較。オンラインゲームでラグを引き起こすバッファブロート現象を高精度に検出します。",
      p3Title: "グローバルAnycastエッジ網",
      p3Desc: "東京、シンガポール、ジャカルタ、ロンドンなど戦略的エッジサーバーに直結し、ハーバーサイン公式で最寄りノードを自動選択。",
      tableTitle: "デジタル用途別 推奨インターネット速度基準",
      tableDesc: "日常のアクティビティに必要な通信速度要件を満たしているか以下の基準表で確認してください:",
      colActivity: "デジタル用途",
      colMinDown: "推奨下り速度",
      colMinUp: "推奨上り速度",
      colPing: "推奨Ping",
      colStability: "要求安定性",
      ispTitle: "主要プロバイダ・ネットワーク基準表",
      ispDesc: "Pinglyは国内外の主要な光ファイバー回線およびモバイル回線の測定に対応しています:",
      colProvider: "プロバイダ",
      colTech: "ネットワーク方式",
      colAvgPing: "平均遅延",
      colSpeedRange: "代表的速度",
      colPeering: "相互接続特性",
      faqTitle: "通信速度テストに関するよくある質問 (FAQ)",
      faqDesc: "測定の仕組み、技術的な測定指標、Wi-Fiの高速化に関する技術回答集。",
      learnMore: "関連ガイド:",
    },
    zh: {
      badge: "完整指南与网络测试方法论",
      heading: "Pingly 网速测试: 全球高精度透明互联网测速诊断平台",
      subheading: "现代互联网诊断遥测平台，实时准确测量下载、上传、Ping延迟、抖动和丢包率，拒绝任何算法造假。",
      p1Title: "真实的下载与上传吞吐量",
      p1Desc: "使用HTTP/2与多流WebSocket测试，高熵随机数据块有效防止运营商透明代理伪压缩，精准反映物理链路极限。",
      p2Title: "空闲 vs 负载延迟（缓冲区膨胀检测）",
      p2Desc: "测量网络空闲与高负荷上传下载时的往返时延差异，直观诊断导致网游瞬移和语音卡顿的Bufferbloat。",
      p3Title: "全球Anycast边缘节点网络",
      p3Desc: "直连雅加达、新加坡、东京、伦敦等全球核心交换中心，结合球面距离算法实现最近节点智能调度。",
      tableTitle: "常见数字化应用场景网络带宽需求参考标准",
      tableDesc: "通过以下基准参考表评估您的测速结果是否满足日常数字生活与生产力需求:",
      colActivity: "数字化活动",
      colMinDown: "最低下载",
      colMinUp: "最低上传",
      colPing: "推荐延迟",
      colStability: "网络稳定性要求",
      ispTitle: "主流运营商与互联网服务提供商参考",
      ispDesc: "Pingly支持对主流移动蜂窝网与光纤宽带网络的无感自动适配测试:",
      colProvider: "网络运营商",
      colTech: "网络技术",
      colAvgPing: "平均延迟",
      colSpeedRange: "典型速率",
      colPeering: "互联对等特性",
      faqTitle: "关于网络测速的常见问题解答 (FAQ)",
      faqDesc: "全面深入解析网络测速工作原理、Bufferbloat诊断与Wi-Fi信号优化实用技巧。",
      learnMore: "深入了解:",
    },
    es: {
      badge: "Guía Completa y Metodología de Pruebas de Red",
      heading: "Pingly Speed Test: Medición Precisa y Transparente de Velocidad de Internet",
      subheading: "Plataforma de telemetría moderna que mide en tiempo real descarga, subida, ping, jitter y pérdida de paquetes sin manipulación artificial.",
      p1Title: "Ancho de Banda Real de Descarga y Subida",
      p1Desc: "Prueba el ancho de banda con HTTP/2 y WebSockets multiflujo. Datos de alta entropía evitan la compresión sintética del ISP.",
      p2Title: "Latencia en Reposo vs con Carga (Bufferbloat)",
      p2Desc: "Mide la latencia en reposo y bajo carga intensa, detectando el bufferbloat causante del lag en juegos online.",
      p3Title: "Red Perimetral Anycast Global",
      p3Desc: "Interconexión directa con nodos estratégicos en Yakarta, Singapur, Tokio y Londres con cálculo de distancia Haversine.",
      tableTitle: "Estándares Recomendados de Velocidad según Actividad Digital",
      tableDesc: "Usa la siguiente tabla para evaluar si los resultados de tu prueba satisfacen las demandas de tus actividades cotidianas:",
      colActivity: "Actividad Digital",
      colMinDown: "Descarga Mín.",
      colMinUp: "Subida Mín.",
      colPing: "Ping Sugerido",
      colStability: "Estabilidad Requerida",
      ispTitle: "Tabla de Referencia de Proveedores e ISPs Principales",
      ispDesc: "Pingly admite pruebas automáticas en las redes de los principales operadores de telecomunicaciones:",
      colProvider: "Proveedor / ISP",
      colTech: "Tecnología de Red",
      colAvgPing: "Latencia Promedio",
      colSpeedRange: "Rango Típico",
      colPeering: "Características de Peering",
      faqTitle: "Preguntas Frecuentes (FAQ) sobre el Test de Velocidad",
      faqDesc: "Respuestas técnicas sobre el funcionamiento de las pruebas, latencia con carga y consejos para optimizar tu Wi-Fi.",
      learnMore: "Más Información:",
    },
    ar: {
      badge: "دليل شامل ومنهجية قياس أداء الشبكات",
      heading: "Pingly لاختبار السرعة: قياس دقيق وشفاف لسرعة الإنترنت عالمياً",
      subheading: "منصة تشخيص شبكات متطورة لقياس سرعات التنزيل والرفع وزمن الاستجابة والتذبذب وفقدان الحزم لحظياً بدون أي تلاعب رقمي.",
      p1Title: "النطاق الترددي الحقيقي للتنزيل والرفع",
      p1Desc: "قياس حقيقي عبر بروتوكولات HTTP/2 والاتصالات المتزامنة مع حزم بيانات مشفرة عشوائياً تمنع تلاعب وضغط المزودات.",
      p2Title: "الاستجابة في الوضع العادي مقابل التحميل (Bufferbloat)",
      p2Desc: "مقارنة زمن الاستجابة في وضع الخمول وأثناء أقصى تحميل لكشف ظاهرة تضخم المخزن المؤقت المسببة للتقطيع في الألعاب.",
      p3Title: "شبكة خوادم حافة عالمية بتقنية Anycast",
      p3Desc: "اتصال مباشر بنقاط استراتيجية في جاكرتا وسنغافورة وطوكيو ولندن مع حساب المسافات الجغرافية بدقة متناهية.",
      tableTitle: "معايير سرعة الإنترنت المطلوبة حسب الأنشطة الرقمية",
      tableDesc: "استخدم الجدول التالي لتقييم ما إذا كانت نتائج اختبارك كافية لاحتياجات استخدامك اليومي:",
      colActivity: "النشاط الرقمي",
      colMinDown: "الحد الأدنى للتنزيل",
      colMinUp: "الحد الأدنى للرفع",
      colPing: "الاستجابة المقترحة",
      colStability: "مستوى الاستقرار",
      ispTitle: "مصفوفة أداء مزودي خدمات الإنترنت والشبكات",
      ispDesc: "يدعم النظام إجراء الاختبارات التلقائية المباشرة عبر شبكات كافة المزودين العالميين والمحليين:",
      colProvider: "المزود / الشركة",
      colTech: "تقنية الاتصال",
      colAvgPing: "متوسط الاستجابة",
      colSpeedRange: "السرعات الشائعة",
      colPeering: "خصائص مسار الربط",
      faqTitle: "الأسئلة الشائعة (FAQ) حول اختبارات سرعة الإنترنت",
      faqDesc: "إجابات تقنية شاملة حول كيفية عمل القياس، وكشف التأخير مع التحميل، وطرق تسريع الواي فاي.",
      learnMore: "للمزيد من المعلومات:",
    },
  }[currentLang] || {
    badge: "Comprehensive Guide & Network Testing Methodology",
    heading: "Pingly Speed Test: Accurate & Transparent Internet Speed Diagnostics Worldwide",
    subheading: "Modern internet diagnostic telemetry platform measuring real-time download, upload, ping latency, jitter, and packet loss without synthetic manipulation.",
    p1Title: "Real Download & Upload Bandwidth",
    p1Desc: "Pingly tests data transfer using HTTP/2 and multi-stream WebSockets. High-entropy pseudorandom data chunks prevent artificial ISP compression, yielding pure throughput.",
    p2Title: "Unloaded vs Loaded Latency (Bufferbloat)",
    p2Desc: "Measures ping during idle and heavy download/upload load. Accurately detects bufferbloat, the primary culprit behind online gaming lag and VoIP jitter.",
    p3Title: "Global Anycast Edge Network",
    p3Desc: "Directly interconnected with strategic edge nodes in Jakarta, Singapore, Tokyo, and London with automated Haversine geographic distance calculation.",
    tableTitle: "Recommended Internet Speed Standards by Digital Activity",
    tableDesc: "Use the benchmark reference below to evaluate whether your speed test results meet the standard requirements for daily online activities:",
    colActivity: "Digital Activity",
    colMinDown: "Min. Download",
    colMinUp: "Min. Upload",
    colPing: "Target Ping",
    colStability: "Stability Requirement",
    ispTitle: "ISP & Global Network Providers Benchmark",
    ispDesc: "Pingly supports automatic testing across leading mobile and fixed-broadband internet service providers:",
    colProvider: "Provider / ISP",
    colTech: "Network Technology",
    colAvgPing: "Average Latency",
    colSpeedRange: "Typical Plan",
    colPeering: "Peering Characteristics",
    faqTitle: "Frequently Asked Questions (FAQ) About Internet Speed Tests",
    faqDesc: "In-depth technical answers on how network testing works, loaded latency, bufferbloat, and Wi-Fi tips.",
    learnMore: "Learn More:",
  };

  return (
    <section className="w-full max-w-6xl mx-auto px-4 py-8 space-y-8 text-foreground" aria-labelledby="seo-heading">
      {/* Main Educational Header */}
      <div className="border-b border-border/50 pb-5 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-100/70 dark:bg-rose-950/60 text-[#800020] dark:text-rose-300 text-xs font-semibold">
          <ShieldCheck className="size-3.5" />
          <span>{labels.badge}</span>
        </div>
        <h2 id="seo-heading" className="text-xl sm:text-3xl font-extrabold tracking-tight">
          {labels.heading}
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-4xl">
          {labels.subheading}
        </p>
      </div>

      {/* 3 Pillar Educational Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <article className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2.5">
          <div className="size-9 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center">
            <Gauge className="size-4.5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            {labels.p1Title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {labels.p1Desc}
          </p>
        </article>

        <article className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2.5">
          <div className="size-9 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center">
            <Activity className="size-4.5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            {labels.p2Title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {labels.p2Desc}
          </p>
        </article>

        <article className="p-4 sm:p-5 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md space-y-2.5">
          <div className="size-9 rounded-xl bg-rose-100 dark:bg-rose-950/70 text-[#800020] dark:text-rose-400 flex items-center justify-center">
            <Radio className="size-4.5" />
          </div>
          <h3 className="font-bold text-sm text-foreground">
            {labels.p3Title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {labels.p3Desc}
          </p>
        </article>
      </div>

      {/* Benchmark Standard Requirements Table */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 space-y-3.5">
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
            <Zap className="size-4 text-[#800020] dark:text-rose-400" />
            {labels.tableTitle}
          </h3>
          <p className="text-xs text-muted-foreground">
            {labels.tableDesc}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[500px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3">{labels.colActivity}</th>
                <th className="py-2.5 px-3">{labels.colMinDown}</th>
                <th className="py-2.5 px-3">{labels.colMinUp}</th>
                <th className="py-2.5 px-3">{labels.colPing}</th>
                <th className="py-2.5 px-3">{labels.colStability}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-mono">
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Smartphone className="size-3.5 text-muted-foreground" />
                  Browsing & Social Media
                </td>
                <td className="py-2.5 px-3">5 - 10 Mbps</td>
                <td className="py-2.5 px-3">2 - 5 Mbps</td>
                <td className="py-2.5 px-3">&lt; 100 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">Standard</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Laptop className="size-3.5 text-muted-foreground" />
                  HD Video Calls (Zoom / Meet)
                </td>
                <td className="py-2.5 px-3">15 - 25 Mbps</td>
                <td className="py-2.5 px-3">5 - 10 Mbps</td>
                <td className="py-2.5 px-3">&lt; 50 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">High</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Tv className="size-3.5 text-muted-foreground" />
                  Streaming 4K Ultra HD (Netflix / YouTube)
                </td>
                <td className="py-2.5 px-3">25 - 50 Mbps</td>
                <td className="py-2.5 px-3">5 - 10 Mbps</td>
                <td className="py-2.5 px-3">&lt; 80 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">Very High</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Zap className="size-3.5 text-[#800020] dark:text-rose-400" />
                  Competitive Esports Gaming
                </td>
                <td className="py-2.5 px-3">20 - 50 Mbps</td>
                <td className="py-2.5 px-3">10 - 20 Mbps</td>
                <td className="py-2.5 px-3">&lt; 25 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">Critical (Low Jitter)</td>
              </tr>
              <tr className="hover:bg-muted/30 transition-colors">
                <td className="py-2.5 px-3 font-sans font-semibold text-foreground flex items-center gap-2">
                  <Server className="size-3.5 text-muted-foreground" />
                  Live Streaming 1080p60 & Cloud Backup
                </td>
                <td className="py-2.5 px-3">50 - 100 Mbps</td>
                <td className="py-2.5 px-3">25 - 50 Mbps</td>
                <td className="py-2.5 px-3">&lt; 40 ms</td>
                <td className="py-2.5 px-3 font-sans text-emerald-600 dark:text-emerald-400 font-medium">Critical</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* ISP Benchmark Table */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 space-y-3.5">
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
            <Wifi className="size-4 text-[#800020] dark:text-rose-400" />
            {labels.ispTitle}
          </h3>
          <p className="text-xs text-muted-foreground">
            {labels.ispDesc}
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[550px]">
            <thead>
              <tr className="border-b border-border/60 bg-muted/40 text-muted-foreground font-semibold">
                <th className="py-2.5 px-3">{labels.colProvider}</th>
                <th className="py-2.5 px-3">{labels.colTech}</th>
                <th className="py-2.5 px-3">{labels.colAvgPing}</th>
                <th className="py-2.5 px-3">{labels.colSpeedRange}</th>
                <th className="py-2.5 px-3">{labels.colPeering}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/40 font-sans">
              {ISP_BENCHMARKS.map((item, idx) => (
                <tr key={idx} className="hover:bg-muted/30 transition-colors">
                  <td className="py-2.5 px-3 font-bold text-foreground">{item.provider}</td>
                  <td className="py-2.5 px-3 text-muted-foreground">{item.tech}</td>
                  <td className="py-2.5 px-3 font-mono text-emerald-600 dark:text-emerald-400 font-semibold">{item.avgPing}</td>
                  <td className="py-2.5 px-3 font-mono">{item.typicalSpeed}</td>
                  <td className="py-2.5 px-3 text-muted-foreground text-[11px]">{item.peering}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search-Optimized FAQ Accordion (Directly maps to FAQPage Schema) */}
      <div className="rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-card/60 dark:bg-zinc-900/40 backdrop-blur-md p-5 space-y-4">
        <div className="space-y-1">
          <h3 className="font-bold text-sm sm:text-base text-foreground flex items-center gap-2">
            <HelpCircle className="size-4 text-[#800020] dark:text-rose-400" />
            {labels.faqTitle}
          </h3>
          <p className="text-xs text-muted-foreground">
            {labels.faqDesc}
          </p>
        </div>

        <div className="divide-y divide-border/50">
          {currentFaqs.map((item, index) => {
            const isOpen = openFaq === index;
            return (
              <div key={index} className="py-3">
                <button
                  type="button"
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between gap-3 text-left group cursor-pointer"
                >
                  <span className="font-semibold text-xs sm:text-sm text-foreground group-hover:text-[#800020] dark:group-hover:text-rose-400 transition-colors">
                    {item.q}
                  </span>
                  <ChevronDown
                    className={`size-4 text-muted-foreground transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180 text-[#800020] dark:text-rose-400" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-2 text-xs text-muted-foreground leading-relaxed pr-4 animate-in fade-in duration-200">
                    <p>{item.a}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Link Footer to In-Depth Guides */}
        <div className="pt-3 border-t border-border/40 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">{labels.learnMore}</span>
          <Link href="/panduan/mbps-vs-mbyte" className="text-[#800020] dark:text-rose-400 hover:underline">
            Kalkulator Mbps vs MB/s →
          </Link>
          <Link href="/panduan/wifi" className="text-[#800020] dark:text-rose-400 hover:underline">
            Cara Mempercepat Sinyal Wi-Fi →
          </Link>
          <Link href="/tools/domain-to-ip" className="text-[#800020] dark:text-rose-400 hover:underline">
            Alat DNS & Domain to IP Lookup →
          </Link>
          <Link href="/mode" className="text-[#800020] dark:text-rose-400 hover:underline">
            Metodologi Single vs Multi Stream →
          </Link>
        </div>
      </div>
    </section>
  );
}
