import { useEffect, useState } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isIframe, setIsIframe] = useState(false);
  const [browserName, setBrowserName] = useState<'chrome' | 'safari' | 'edge' | 'firefox' | 'other'>('chrome');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect standalone mode (already running installed)
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true;
    setIsInstalled(isStandalone);

    // Detect iframe
    try {
      setIsIframe(window.self !== window.top);
    } catch {
      setIsIframe(true);
    }

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsAndroid(/android/.test(ua));

    if (ua.includes('edg/')) {
      setBrowserName('edge');
    } else if (ua.includes('chrome') && !ua.includes('edg/')) {
      setBrowserName('chrome');
    } else if (ua.includes('safari') && !ua.includes('chrome')) {
      setBrowserName('safari');
    } else if (ua.includes('firefox')) {
      setBrowserName('firefox');
    } else {
      setBrowserName('other');
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const install = async (): Promise<'installed' | 'prompted' | 'manual_needed'> => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setIsInstalled(true);
          setDeferredPrompt(null);
          return 'installed';
        }
        return 'prompted';
      } catch (err) {
        console.warn('Install prompt error:', err);
      }
    }
    return 'manual_needed';
  };

  const openInNewTab = () => {
    if (typeof window !== 'undefined') {
      window.open(window.location.href, '_blank', 'noopener,noreferrer');
    }
  };

  return {
    isInstallable: !!deferredPrompt,
    isInstalled,
    isIOS,
    isAndroid,
    isIframe,
    browserName,
    install,
    openInNewTab,
  };
}
