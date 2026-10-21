import React, { useState } from 'react';
import { Download, Check, Sparkles } from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';
import { PWAInstallModal } from './PWAInstallModal';

interface PWAInstallButtonProps {
  variant?: 'button' | 'badge' | 'sidebar';
  className?: string;
}

export const PWAInstallButton: React.FC<PWAInstallButtonProps> = ({
  variant = 'button',
  className = '',
}) => {
  const { 
    isInstallable, 
    isInstalled, 
    isIOS, 
    isAndroid, 
    isIframe, 
    install, 
    openInNewTab 
  } = usePWAInstall();

  const [showModal, setShowModal] = useState(false);

  const handleClick = async () => {
    // If installable directly (browser provided native event outside iframe)
    if (isInstallable) {
      const res = await install();
      if (res === 'installed') {
        return;
      }
    }
    // Always open the full helpful installation modal/guide
    setShowModal(true);
  };

  if (variant === 'sidebar') {
    return (
      <>
        <button
          onClick={handleClick}
          className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-fuchsia-500/10 hover:from-cyan-500/20 hover:to-fuchsia-500/20 border border-cyan-500/30 text-xs font-semibold text-cyan-300 transition text-left cursor-pointer group shadow-sm ${className}`}
          title="Add ChargoX to Home Screen"
        >
          <div className="flex items-center gap-2.5">
            <div className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Download className="w-3.5 h-3.5 group-hover:scale-110 transition" />
            </div>
            <div>
              <div className="text-[11px] font-bold text-white leading-tight">
                {isInstalled ? 'App Installed' : 'Add to Home Screen'}
              </div>
              <div className="text-[9px] text-[#8e94a4]">
                {isInstalled ? 'Standalone Mode' : 'Install on Mobile & PC'}
              </div>
            </div>
          </div>
          {isInstalled ? (
            <Check className="w-4 h-4 text-emerald-400" />
          ) : (
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-cyan-950 text-cyan-400 font-bold border border-cyan-800/40">
              PWA
            </span>
          )}
        </button>

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
      </>
    );
  }

  return (
    <>
      <button
        onClick={handleClick}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 hover:opacity-90 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition cursor-pointer active:scale-95 ${className}`}
        title="Add ChargoX to your device Home Screen"
      >
        <Download className="w-3.5 h-3.5" />
        <span>Add to Home Screen</span>
      </button>

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
    </>
  );
};
