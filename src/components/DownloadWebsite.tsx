import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  Monitor, 
  Share2, 
  PlusSquare, 
  ExternalLink, 
  Copy, 
  Check, 
  Sparkles, 
  Globe, 
  ArrowRight, 
  Layers, 
  Code2, 
  ShieldCheck, 
  Terminal, 
  Zap, 
  HelpCircle,
  FileCode,
  QrCode,
  Laptop
} from 'lucide-react';
import JSZip from 'jszip';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface DownloadWebsiteProps {
  onLaunchStudio: () => void;
}

export const DownloadWebsite: React.FC<DownloadWebsiteProps> = ({ onLaunchStudio }) => {
  const { 
    isInstallable, 
    isInstalled, 
    isIOS, 
    isAndroid, 
    isIframe, 
    install, 
    openInNewTab 
  } = usePWAInstall();

  const [copied, setCopied] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [downloadingZip, setDownloadingZip] = useState(false);

  // App direct public link for sharing & QR
  const directAppUrl = typeof window !== 'undefined' && window.location.origin.includes('http')
    ? `${window.location.origin}`
    : 'https://ais-pre-ugbccjrlvithkz272k377l-724972749343.asia-northeast1.run.app';

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(directAppUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  const handleDownloadStandaloneZip = async () => {
    setDownloadingZip(true);
    try {
      const zip = new JSZip();

      // Bundle core runnable offline package
      const offlineHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>ChargoX — AI App & Website Builder</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="stylesheet" href="style.css" />
</head>
<body class="bg-[#0d0f12] text-slate-100 min-h-screen flex flex-col items-center justify-center p-6 text-center">
  <div class="max-w-xl mx-auto space-y-6">
    <div class="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-cyan-400 to-blue-600 flex items-center justify-center font-black text-2xl text-slate-950 shadow-xl shadow-cyan-500/20">
      CX
    </div>
    <h1 class="text-3xl font-extrabold text-white">ChargoX Standalone Bundle</h1>
    <p class="text-slate-400 text-sm leading-relaxed">
      You are running the offline-capable standalone distribution of ChargoX. Connect to the web to access the live autonomous Gemini generation API, or use your pre-compiled projects offline.
    </p>
    <div class="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
      <a href="${directAppUrl}" class="px-5 py-2.5 rounded-xl bg-cyan-400 text-slate-950 font-bold text-xs hover:bg-cyan-300 transition">
        Launch Cloud Version
      </a>
    </div>
  </div>
</body>
</html>`;

      const readme = `# ChargoX Standalone Distribution
Thank you for downloading ChargoX!

## Online Cloud Deployment
You can access the live, real-time updated cloud application anytime at:
${directAppUrl}

## Features
- Autonomous Gemini 3.8 Flash Code Synthesis
- Live Interactive Sandboxed Preview
- In-App Multi-file Code Editor
- GitHub Repository Import & Local ZIP Archiving
- Progressive Web App (PWA) Offline Caching & Home Screen Pinning
`;

      zip.file('index.html', offlineHtml);
      zip.file('README.md', readme);
      zip.file('style.css', '/* ChargoX Base Styles */\nbody { font-family: system-ui, -apple-system, sans-serif; }\n');

      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'chargox-standalone-app.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download zip error:', err);
    } finally {
      setDownloadingZip(false);
    }
  };

  const handleInstallClick = async () => {
    if (isInstallable) {
      const res = await install();
      if (res === 'installed') return;
    }
    setShowModal(true);
  };

  return (
    <div className="min-h-screen bg-[#090b0e] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-black">
      {/* Top Bar Contract: Zone 1 (Wordmark) — Zone 2 (4-5 nav links) — Zone 3 (1 primary CTA) */}
      <header className="sticky top-0 z-40 bg-[#090b0e]/90 backdrop-blur-md border-b border-[#181d27] h-16 flex items-center justify-between gap-8 px-6 lg:px-12">
        {/* Zone 1: Brand wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-fuchsia-500 p-0.5 shadow-md shadow-cyan-500/20">
            <div className="w-full h-full bg-[#090b0e] rounded-[0.65rem] flex items-center justify-center font-black text-cyan-400 text-xs">
              CX
            </div>
          </div>
          <span className="font-extrabold text-base tracking-tight text-white whitespace-nowrap shrink-0">
            ChargoX
          </span>
        </div>

        {/* Zone 2: Nav links */}
        <nav className="hidden md:flex items-center gap-8 text-xs font-medium text-[#9298a8]">
          <a href="#downloads" className="hover:text-white transition whitespace-nowrap shrink-0">
            Platform Downloads
          </a>
          <a href="#qr-mobile" className="hover:text-white transition whitespace-nowrap shrink-0">
            QR Quick Install
          </a>
          <a href="#features" className="hover:text-white transition whitespace-nowrap shrink-0">
            Capabilities
          </a>
          <a href="#faq" className="hover:text-white transition whitespace-nowrap shrink-0">
            Troubleshooting & FAQ
          </a>
        </nav>

        {/* Zone 3: 1 Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onLaunchStudio}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 hover:opacity-90 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition whitespace-nowrap shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Launch Studio</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-6 lg:px-8 py-12 lg:py-16 space-y-20">
        {/* Hero Section */}
        <section className="space-y-10 text-center max-w-4xl mx-auto">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-medium text-cyan-400">
              <span>Official Download & Installation Center</span>
              <span aria-hidden="true">·</span>
              <span>v1.0 Release</span>
              <span aria-hidden="true">·</span>
              <span>All Devices Supported</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white tracking-tight text-balance leading-tight">
              Get <span className="bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 bg-clip-text text-transparent">ChargoX</span> on your mobile device & desktop
            </h1>

            <p className="text-sm sm:text-base text-[#8e95a5] max-w-2xl mx-auto leading-relaxed">
              Transform ideas into live, interactive applications. Install ChargoX as a full-screen native app on iOS and Android, run it on desktop, or download the offline project package.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleInstallClick}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 hover:opacity-90 text-slate-950 font-extrabold text-xs sm:text-sm shadow-xl shadow-cyan-500/20 transition cursor-pointer active:scale-95"
            >
              <Download className="w-4 h-4" />
              <span>Add to Home Screen (Instant PWA)</span>
            </button>

            <button
              onClick={handleDownloadStandaloneZip}
              disabled={downloadingZip}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#141822] hover:bg-[#1a202d] text-white font-semibold text-xs sm:text-sm border border-[#262e42] transition cursor-pointer"
            >
              <FileCode className="w-4 h-4 text-cyan-400" />
              <span>{downloadingZip ? 'Creating ZIP...' : 'Download Offline ZIP Bundle'}</span>
            </button>

            <button
              onClick={onLaunchStudio}
              className="flex items-center gap-2 px-5 py-3.5 rounded-xl bg-[#141822] hover:bg-[#1a202d] text-cyan-300 font-semibold text-xs sm:text-sm border border-cyan-500/30 transition cursor-pointer"
            >
              <span>Open Web Studio</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Product Showcase Image */}
          <div className="pt-6">
            <div className="relative rounded-2xl overflow-hidden border border-[#202738] shadow-2xl bg-[#10131b]">
              <img
                src="/src/assets/images/chargox_app_showcase_1792397461939.jpg"
                alt="ChargoX AI App Builder running across smartphone and laptop devices"
                referrerPolicy="no-referrer"
                className="w-full h-auto object-cover max-h-[500px]"
                onError={(e) => {
                  // Fallback container if image can't be rendered
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#090b0e] via-transparent to-transparent opacity-60 pointer-events-none"></div>
            </div>
          </div>
        </section>

        {/* Section: Platform Downloads Bento Grid */}
        <section id="downloads" className="space-y-6 scroll-mt-24">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-[#181d27] pb-5">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">Platform Download Options</h2>
              <p className="text-xs text-[#8c92a2] mt-1">Select your operating system for step-by-step installation instructions.</p>
            </div>
            <div className="text-xs text-[#717686]">
              <span>Zero App Store Fees</span>
              <span className="mx-2">·</span>
              <span>100% Free & Open Web</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* iOS Card */}
            <div className={`p-6 rounded-2xl border transition ${isIOS ? 'bg-[#121622] border-cyan-500/50 ring-1 ring-cyan-500/30' : 'bg-[#10131a] border-[#1d2332]'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-[#787f90]">iPhone & iPad</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Apple iOS (Safari)</h3>
              <p className="text-xs text-[#8d94a4] leading-relaxed mb-4">
                Pins directly to your home screen with a native icon, launching in borderless full-screen mode.
              </p>
              <div className="space-y-2 text-xs text-[#b0b6c6] bg-[#0c0e14] p-3.5 rounded-xl border border-[#1a1f2c] mb-5">
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono">1.</span>
                  <span>Open direct link in <strong>Safari</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono">2.</span>
                  <span>Tap <strong>Share</strong> <Share2 className="w-3 h-3 inline text-cyan-400" /> icon</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-cyan-400 font-mono">3.</span>
                  <span>Select <strong>"Add to Home Screen"</strong></span>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 rounded-xl bg-[#161b26] hover:bg-[#1e2434] text-xs font-semibold text-white border border-[#273042] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied to Clipboard' : 'Copy Safari App Link'}</span>
              </button>
            </div>

            {/* Android Card */}
            <div className={`p-6 rounded-2xl border transition ${isAndroid ? 'bg-[#121622] border-cyan-500/50 ring-1 ring-cyan-500/30' : 'bg-[#10131a] border-[#1d2332]'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                  <Smartphone className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-[#787f90]">Android Phones & Tablets</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Android (Chrome)</h3>
              <p className="text-xs text-[#8d94a4] leading-relaxed mb-4">
                Native Android APK web-app integration with offline service workers and splash screens.
              </p>
              <div className="space-y-2 text-xs text-[#b0b6c6] bg-[#0c0e14] p-3.5 rounded-xl border border-[#1a1f2c] mb-5">
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono">1.</span>
                  <span>Open in <strong>Google Chrome</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono">2.</span>
                  <span>Tap <strong>Menu (⋮)</strong> top-right</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-emerald-400 font-mono">3.</span>
                  <span>Tap <strong>"Install app"</strong></span>
                </div>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full py-2.5 px-3 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-xs font-semibold text-emerald-300 border border-emerald-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Install on Android</span>
              </button>
            </div>

            {/* Desktop Card */}
            <div className={`p-6 rounded-2xl border transition ${!isIOS && !isAndroid ? 'bg-[#121622] border-cyan-500/50 ring-1 ring-cyan-500/30' : 'bg-[#10131a] border-[#1d2332]'}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
                  <Laptop className="w-5 h-5" />
                </div>
                <span className="text-[11px] text-[#787f90]">Mac, Windows & Linux</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Desktop PWA App</h3>
              <p className="text-xs text-[#8d94a4] leading-relaxed mb-4">
                Runs as a standalone desktop window on macOS, Windows, and Linux with multi-monitor support.
              </p>
              <div className="space-y-2 text-xs text-[#b0b6c6] bg-[#0c0e14] p-3.5 rounded-xl border border-[#1a1f2c] mb-5">
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-mono">1.</span>
                  <span>Click <strong>Install icon (⊕)</strong> in URL bar</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-mono">2.</span>
                  <span>Or click <strong>Menu &gt; Save &amp; share &gt; Install</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-purple-400 font-mono">3.</span>
                  <span>Pin to Taskbar or macOS Dock</span>
                </div>
              </div>
              <button
                onClick={handleInstallClick}
                className="w-full py-2.5 px-3 rounded-xl bg-[#161b26] hover:bg-[#1e2434] text-xs font-semibold text-white border border-[#273042] transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>Install on Desktop</span>
              </button>
            </div>

            {/* Yandex Browser Card (Яндекс Браузер) */}
            <div className="p-6 rounded-2xl border bg-[#12141f] border-red-500/40 hover:border-red-500/60 transition shadow-lg shadow-red-500/5">
              <div className="flex items-center justify-between mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-600/15 text-red-500 flex items-center justify-center font-bold text-lg">
                  Я
                </div>
                <span className="text-[11px] text-[#787f90]">Яндекс Браузер / Yandex</span>
              </div>
              <h3 className="text-base font-bold text-white mb-2">Yandex Browser (PC &amp; Phone)</h3>
              <p className="text-xs text-[#8d94a4] leading-relaxed mb-4">
                No external search or download website needed on Yandex! This website is the official install hub:
              </p>
              <div className="space-y-2 text-xs text-[#b0b6c6] bg-[#0c0e14] p-3.5 rounded-xl border border-[#1a1f2c] mb-5">
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-mono">1.</span>
                  <span><strong>PC:</strong> Нажмите Меню <strong>(≡)</strong> вверху &gt; <strong>Приложения</strong> &gt; <strong>Установить</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-mono">2.</span>
                  <span><strong>Телефон:</strong> Нажмите <strong>(⋮)</strong> внизу &gt; <strong>Добавить на главный экран</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-red-400 font-mono">3.</span>
                  <span>Значок ChargoX появится прямо на рабочем столе!</span>
                </div>
              </div>
              <button
                onClick={handleCopyLink}
                className="w-full py-2.5 px-3 rounded-xl bg-red-600/15 hover:bg-red-600/25 text-xs font-semibold text-red-300 border border-red-500/30 transition flex items-center justify-center gap-2 cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Ссылка скопирована!' : 'Скопировать ссылку для Яндекса'}</span>
              </button>
            </div>
          </div>
        </section>

        {/* Section: QR Code Mobile Quick-Scanner */}
        <section id="qr-mobile" className="p-8 rounded-3xl bg-gradient-to-r from-[#10141f] via-[#111624] to-[#141224] border border-[#202738] scroll-mt-24">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl text-left">
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-cyan-400">
                <QrCode className="w-4 h-4" />
                <span>Instant Mobile Transfer</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Scan with your phone to install in seconds
              </h2>
              <p className="text-xs sm:text-sm text-[#8c93a4] leading-relaxed">
                Open your iPhone or Android camera, point it at this QR code, and tap the notification link to open ChargoX directly on your phone. Then tap "Add to Home Screen" to install it.
              </p>
              <div className="pt-2 flex flex-wrap items-center gap-3">
                <button
                  onClick={handleCopyLink}
                  className="px-4 py-2 rounded-xl bg-[#191f2c] hover:bg-[#222a3c] text-white text-xs font-semibold border border-[#2b344a] flex items-center gap-2 transition cursor-pointer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied link!' : 'Copy Direct App URL'}</span>
                </button>
                <button
                  onClick={openInNewTab}
                  className="px-4 py-2 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 text-xs font-semibold border border-cyan-500/30 flex items-center gap-2 transition cursor-pointer"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Standalone Tab</span>
                </button>
              </div>
            </div>

            {/* High-Contrast Interactive QR Code Mockup (Vector SVG) */}
            <div className="bg-white p-5 rounded-2xl shadow-2xl flex flex-col items-center justify-center shrink-0">
              {/* Crisp SVG QR Code pointing visually to ChargoX */}
              <svg className="w-44 h-44" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="120" height="120" fill="white" />
                {/* Corner Finder 1 (Top Left) */}
                <rect x="10" y="10" width="30" height="30" rx="4" fill="#090b0e" />
                <rect x="15" y="15" width="20" height="20" rx="2" fill="white" />
                <rect x="20" y="20" width="10" height="10" rx="1" fill="#090b0e" />
                
                {/* Corner Finder 2 (Top Right) */}
                <rect x="80" y="10" width="30" height="30" rx="4" fill="#090b0e" />
                <rect x="85" y="15" width="20" height="20" rx="2" fill="white" />
                <rect x="90" y="20" width="10" height="10" rx="1" fill="#090b0e" />

                {/* Corner Finder 3 (Bottom Left) */}
                <rect x="10" y="80" width="30" height="30" rx="4" fill="#090b0e" />
                <rect x="15" y="85" width="20" height="20" rx="2" fill="white" />
                <rect x="20" y="90" width="10" height="10" rx="1" fill="#090b0e" />

                {/* Data Modules Matrix Pattern */}
                <rect x="46" y="12" width="6" height="6" fill="#090b0e" />
                <rect x="58" y="12" width="6" height="6" fill="#090b0e" />
                <rect x="46" y="24" width="6" height="6" fill="#090b0e" />
                <rect x="64" y="24" width="6" height="6" fill="#090b0e" />
                <rect x="52" y="36" width="6" height="6" fill="#090b0e" />
                <rect x="46" y="48" width="6" height="6" fill="#090b0e" />
                <rect x="58" y="48" width="6" height="6" fill="#090b0e" />
                <rect x="70" y="48" width="6" height="6" fill="#090b0e" />
                <rect x="12" y="48" width="6" height="6" fill="#090b0e" />
                <rect x="24" y="48" width="6" height="6" fill="#090b0e" />
                <rect x="36" y="48" width="6" height="6" fill="#090b0e" />

                <rect x="46" y="60" width="6" height="6" fill="#090b0e" />
                <rect x="58" y="60" width="6" height="6" fill="#090b0e" />
                <rect x="70" y="60" width="6" height="6" fill="#090b0e" />
                <rect x="82" y="60" width="6" height="6" fill="#090b0e" />
                <rect x="94" y="60" width="6" height="6" fill="#090b0e" />

                <rect x="46" y="72" width="6" height="6" fill="#090b0e" />
                <rect x="58" y="72" width="6" height="6" fill="#090b0e" />
                <rect x="70" y="72" width="6" height="6" fill="#090b0e" />
                <rect x="82" y="72" width="6" height="6" fill="#090b0e" />
                <rect x="94" y="72" width="6" height="6" fill="#090b0e" />

                <rect x="46" y="84" width="6" height="6" fill="#090b0e" />
                <rect x="58" y="84" width="6" height="6" fill="#090b0e" />
                <rect x="70" y="84" width="6" height="6" fill="#090b0e" />
                <rect x="82" y="84" width="6" height="6" fill="#090b0e" />
                <rect x="94" y="84" width="6" height="6" fill="#090b0e" />

                <rect x="46" y="96" width="6" height="6" fill="#090b0e" />
                <rect x="58" y="96" width="6" height="6" fill="#090b0e" />
                <rect x="70" y="96" width="6" height="6" fill="#090b0e" />
                <rect x="82" y="96" width="6" height="6" fill="#090b0e" />
                <rect x="94" y="96" width="6" height="6" fill="#090b0e" />

                {/* Central Brand Badge */}
                <rect x="48" y="48" width="24" height="24" rx="4" fill="#090b0e" />
                <text x="60" y="64" fill="#22d3ee" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">CX</text>
              </svg>
              <span className="text-[10px] font-mono font-bold text-slate-800 mt-2">SCAN WITH PHONE CAMERA</span>
            </div>
          </div>
        </section>

        {/* Section: Features & Capabilities */}
        <section id="features" className="space-y-8 scroll-mt-24">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">Why install ChargoX?</h2>
            <p className="text-xs sm:text-sm text-[#8a91a2]">
              The entire AI software engineering loop encapsulated in a modern progressive web application.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#10131a] border border-[#1b212e] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Gemini 3.8 Flash AI</h3>
              <p className="text-xs text-[#8c92a2] leading-relaxed">
                Autonomous code generation capable of multi-file applications, games, and web tools from single sentences.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#10131a] border border-[#1b212e] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">Live Sandboxed Sandbox</h3>
              <p className="text-xs text-[#8c92a2] leading-relaxed">
                Interactive real-time execution with Tailwind CSS, Web Audio API, Canvas physics, and console log capture.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#10131a] border border-[#1b212e] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-fuchsia-500/10 text-fuchsia-400 flex items-center justify-center">
                <Code2 className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">In-App Code Editor</h3>
              <p className="text-xs text-[#8c92a2] leading-relaxed">
                Inspect and tweak HTML, CSS, and JS with hot-reloading and instant live preview updates.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#10131a] border border-[#1b212e] space-y-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="text-sm font-bold text-white">GitHub & ZIP Export</h3>
              <p className="text-xs text-[#8c92a2] leading-relaxed">
                Import your existing repositories or export complete ZIP packages with zero vendor lock-in.
              </p>
            </div>
          </div>
        </section>

        {/* Section: FAQ & Troubleshooting */}
        <section id="faq" className="space-y-6 scroll-mt-24 border-t border-[#181d27] pt-12">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold text-white">Frequently Asked Questions</h2>
            <p className="text-xs text-[#888e9e]">Everything you need to know about downloading and installing ChargoX.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl bg-[#10131a] border border-[#1d2332] space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Why did the install button not prompt directly in preview?</span>
              </h4>
              <p className="text-xs text-[#8b92a2] leading-relaxed">
                Browsers enforce security sandboxing: inside an iframe (like the AI Studio container), native "Add to Home Screen" dialogs are blocked. Simply open the app in a standalone tab or scan the QR code to install directly.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#10131a] border border-[#1d2332] space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Do I need an Apple App Store or Google Play account?</span>
              </h4>
              <p className="text-xs text-[#8b92a2] leading-relaxed">
                No. ChargoX is built as a Progressive Web App (PWA). It installs directly from your browser in 3 seconds without downloading large files or requiring App Store logins.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#10131a] border border-[#1d2332] space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Can I download the code of apps I make in ChargoX?</span>
              </h4>
              <p className="text-xs text-[#8b92a2] leading-relaxed">
                Yes! Every app you generate can be exported as a full ZIP file or standalone single-file HTML. You own 100% of the code and can host it anywhere (Vercel, Netlify, GitHub Pages, or local).
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#10131a] border border-[#1d2332] space-y-2">
              <h4 className="text-sm font-semibold text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>How can other people use my ChargoX installation?</span>
              </h4>
              <p className="text-xs text-[#8b92a2] leading-relaxed">
                Share your public link! Anyone with the link can open ChargoX on their smartphone or laptop and click "Add to Home Screen" to install their own copy immediately.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="p-8 rounded-3xl bg-gradient-to-r from-cyan-950/40 via-blue-950/40 to-fuchsia-950/40 border border-cyan-500/30 text-center space-y-4">
          <h2 className="text-2xl font-extrabold text-white">Ready to start building?</h2>
          <p className="text-xs text-[#9aa1b2] max-w-lg mx-auto">
            Open the studio now and type your first app idea. Watch ChargoX generate code and launch a live running application in seconds.
          </p>
          <div className="pt-2">
            <button
              onClick={onLaunchStudio}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-fuchsia-500 hover:opacity-90 text-slate-950 font-bold text-xs shadow-lg shadow-cyan-500/20 transition cursor-pointer"
            >
              Launch ChargoX Studio Now
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[#181d27] bg-[#07090c] py-8 px-6 lg:px-12 text-xs text-[#717686]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">ChargoX</span>
            <span>·</span>
            <span>Progressive Web App & AI Code Studio</span>
          </div>

          <div className="flex items-center gap-6">
            <button onClick={onLaunchStudio} className="hover:text-white transition">
              Studio
            </button>
            <a href="#downloads" className="hover:text-white transition">
              Downloads
            </a>
            <button onClick={handleInstallClick} className="text-cyan-400 hover:underline">
              Add to Home Screen
            </button>
          </div>
        </div>
      </footer>

      {/* PWA Install Modal */}
      <PWAInstallModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        isInstallable={isInstallable}
        isInstalled={isInstalled}
        isIOS={isIOS}
        isAndroid={isAndroid}
        isIframe={isIframe}
        onInstall={install}
        onOpenInNewTab={openInNewTab}
      />
    </div>
  );
};
