import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Monitor, 
  Share2, 
  PlusSquare, 
  Download, 
  CheckCircle2, 
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Globe
} from 'lucide-react';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
  isInstallable: boolean;
  isInstalled: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isIframe: boolean;
  onInstall: () => void;
  onOpenInNewTab: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({
  isOpen,
  onClose,
  isInstallable,
  isInstalled,
  isIOS,
  isAndroid,
  isIframe,
  onInstall,
  onOpenInNewTab,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12151e] border border-[#262c3e] rounded-2xl max-w-lg w-full p-6 shadow-2xl text-slate-100 relative animate-in fade-in zoom-in-95 duration-150">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#757b8c] hover:text-white p-1 rounded-lg hover:bg-[#1f2434] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3.5 mb-5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 via-blue-500 to-fuchsia-500 p-0.5 shadow-lg shadow-cyan-500/25 shrink-0">
            <div className="w-full h-full bg-[#12151e] rounded-[0.9rem] flex items-center justify-center font-black text-cyan-400 text-sm">
              CX
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg text-white">Add ChargoX to Home Screen</h3>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/40">
                PWA
              </span>
            </div>
            <p className="text-xs text-[#8c92a2]">Fast, full-screen native app experience without browser address bar</p>
          </div>
        </div>

        {/* Status Messages */}
        {isInstalled ? (
          <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-xs flex items-center gap-2.5 mb-4">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-emerald-200">ChargoX is already installed!</p>
              <p className="text-[11px] text-emerald-400/80">You can launch it anytime directly from your phone home screen or desktop application menu.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* If in iframe preview, prominent Open Full Tab button */}
            {isIframe && (
              <div className="p-4 rounded-xl bg-gradient-to-r from-blue-950/60 to-cyan-950/60 border border-cyan-500/30 text-xs space-y-2.5">
                <div className="flex items-start gap-2.5">
                  <Globe className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                  <div className="text-[#c4cad7] leading-relaxed">
                    <strong className="text-white">Note:</strong> You are inside the AI Studio preview container. Browsers require opening in a standalone tab to pin the app directly onto your device home screen.
                  </div>
                </div>
                <button
                  onClick={() => {
                    onOpenInNewTab();
                  }}
                  className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 hover:opacity-90 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Open in Full Browser Tab to Install</span>
                </button>
              </div>
            )}

            {/* Direct 1-click install button if available */}
            {isInstallable && (
              <div className="p-4 rounded-xl bg-[#171c28] border border-[#2a3248] space-y-3">
                <div className="flex items-center gap-2 text-xs text-cyan-300 font-semibold">
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Instant 1-Click Installation Ready</span>
                </div>
                <button
                  onClick={() => {
                    onInstall();
                  }}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 hover:opacity-90 text-slate-950 font-extrabold text-sm shadow-lg shadow-cyan-500/25 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Install ChargoX Now</span>
                </button>
              </div>
            )}

            {/* Platform Guides */}
            <div className="space-y-3">
              {/* iOS Guide */}
              <div className={`p-3.5 rounded-xl border text-xs transition ${isIOS ? 'bg-[#181d2a] border-cyan-500/40 ring-1 ring-cyan-500/20' : 'bg-[#141722] border-[#222838]'}`}>
                <div className="flex items-center gap-2 font-semibold text-white mb-2">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>iPhone & iPad (Safari):</span>
                  {isIOS && <span className="text-[10px] bg-cyan-950 text-cyan-300 px-1.5 py-0.2 rounded font-bold">Your Device</span>}
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-[#9ea4b4] leading-relaxed text-[11px]">
                  <li>
                    Tap the <strong className="text-white">Share button</strong> <Share2 className="w-3 h-3 inline mx-0.5 text-cyan-400" /> in Safari's toolbar.
                  </li>
                  <li>
                    Scroll down and tap <strong className="text-white">Add to Home Screen</strong> <PlusSquare className="w-3 h-3 inline mx-0.5 text-cyan-400" />.
                  </li>
                  <li>
                    Tap <strong className="text-white">Add</strong> in the top-right corner. ChargoX will appear on your phone home screen!
                  </li>
                </ol>
              </div>

              {/* Android Guide */}
              <div className={`p-3.5 rounded-xl border text-xs transition ${isAndroid ? 'bg-[#181d2a] border-cyan-500/40 ring-1 ring-cyan-500/20' : 'bg-[#141722] border-[#222838]'}`}>
                <div className="flex items-center gap-2 font-semibold text-white mb-2">
                  <Smartphone className="w-4 h-4 text-emerald-400" />
                  <span>Android (Chrome / Samsung Internet):</span>
                  {isAndroid && <span className="text-[10px] bg-emerald-950 text-emerald-300 px-1.5 py-0.2 rounded font-bold">Your Device</span>}
                </div>
                <p className="text-[#9ea4b4] text-[11px] leading-relaxed">
                  Tap the <strong className="text-white">Three Dots (⋮)</strong> menu in Chrome &gt; Tap <strong className="text-white">"Install app"</strong> or <strong className="text-white">"Add to Home screen"</strong>.
                </p>
              </div>

              {/* Desktop Guide */}
              <div className={`p-3.5 rounded-xl border text-xs transition ${!isIOS && !isAndroid ? 'bg-[#181d2a] border-cyan-500/40 ring-1 ring-cyan-500/20' : 'bg-[#141722] border-[#222838]'}`}>
                <div className="flex items-center gap-2 font-semibold text-white mb-2">
                  <Monitor className="w-4 h-4 text-blue-400" />
                  <span>Mac, Windows & Linux (Chrome / Edge):</span>
                  {!isIOS && !isAndroid && <span className="text-[10px] bg-blue-950 text-blue-300 px-1.5 py-0.2 rounded font-bold">Desktop</span>}
                </div>
                <p className="text-[#9ea4b4] text-[11px] leading-relaxed">
                  In Chrome or Edge, click the <strong className="text-cyan-300">Install icon (⊕)</strong> on the right side of the address bar, or click Menu (⋮) &gt; <strong className="text-white">Save and share &gt; Install ChargoX</strong>.
                </p>
              </div>

              {/* Yandex Browser Guide (Яндекс Браузер) */}
              <div className="p-3.5 rounded-xl border bg-[#151825] border-red-500/30 text-xs">
                <div className="flex items-center gap-2 font-semibold text-white mb-1.5">
                  <div className="w-4 h-4 rounded-full bg-red-600 text-white font-bold flex items-center justify-center text-[10px] shadow-sm">
                    Я
                  </div>
                  <span>Yandex Browser (Яндекс Браузер):</span>
                  <span className="text-[10px] bg-red-950/80 text-red-300 border border-red-800/40 px-1.5 py-0.2 rounded font-bold">
                    Official Guide
                  </span>
                </div>
                <p className="text-[#9ea4b4] text-[11px] leading-relaxed mb-2">
                  <strong className="text-white">No external website needed on Yandex!</strong> You are already on the installation page right now:
                </p>
                <div className="space-y-1.5 text-[#9ea4b4] text-[11px] pl-1 border-l-2 border-red-500/30">
                  <p>
                    <strong className="text-white">PC / Mac Yandex Browser:</strong> Click Menu <strong className="text-cyan-300">(≡)</strong> at top-right &gt; <strong className="text-white">"Apps" (Приложения)</strong> &gt; <strong className="text-white">"Install this site as an app" (Установить этот сайт как приложение)</strong>.
                  </p>
                  <p>
                    <strong className="text-white">Mobile Yandex Browser (Android / iOS):</strong> Tap the <strong className="text-cyan-300">Three Dots (⋮)</strong> at the bottom/top &gt; Tap <strong className="text-white">"Add to Home Screen" (Добавить на главный экран)</strong>.
                  </p>
                </div>
              </div>
            </div>

            {/* Copy Link helper */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1.5 text-xs text-[#8c92a4] hover:text-white transition px-2.5 py-1.5 rounded-lg hover:bg-[#1a1f2c]"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Link Copied!' : 'Copy App Link for Mobile'}</span>
              </button>

              <button
                onClick={onOpenInNewTab}
                className="flex items-center gap-1.5 text-xs text-cyan-400 hover:text-cyan-300 transition font-medium px-2.5 py-1.5 rounded-lg hover:bg-[#1a1f2c]"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                <span>Open in Tab</span>
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-[#202534] flex items-center justify-between text-xs text-[#717686]">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Offline Capable PWA
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1f2433] hover:bg-[#282f42] text-white text-xs font-semibold transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
