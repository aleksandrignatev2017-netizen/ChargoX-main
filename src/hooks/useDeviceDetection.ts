import { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';
export type DeviceOS = 'iOS' | 'Android' | 'Windows' | 'macOS' | 'Linux' | 'Unknown';

export interface DeviceInfo {
  deviceType: DeviceType;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  os: DeviceOS;
  width: number;
  height: number;
  pixelRatio: number;
  hasTouch: boolean;
  orientation: 'portrait' | 'landscape';
  recommendedModelId: string;
  recommendedModelName: string;
  deviceBannerText: string;
  devicePromptContext: string;
}

function getOS(): DeviceOS {
  if (typeof window === 'undefined') return 'Unknown';
  const ua = navigator.userAgent || navigator.vendor || (window as any).opera || '';
  if (/iPad|iPhone|iPod/.test(ua) && !(window as any).MSStream) return 'iOS';
  if (/android/i.test(ua)) return 'Android';
  if (/Win/i.test(ua)) return 'Windows';
  if (/Mac/i.test(ua)) return 'macOS';
  if (/Linux/i.test(ua)) return 'Linux';
  return 'Unknown';
}

function detectDevice(): DeviceInfo {
  if (typeof window === 'undefined') {
    return {
      deviceType: 'desktop',
      isMobile: false,
      isTablet: false,
      isDesktop: true,
      os: 'Unknown',
      width: 1280,
      height: 800,
      pixelRatio: 1,
      hasTouch: false,
      orientation: 'landscape',
      recommendedModelId: 'gemini-4-argon',
      recommendedModelName: 'ChargoX 4 Argon (Desktop Pro)',
      deviceBannerText: 'Desktop Mode Active',
      devicePromptContext: '[DEVICE DETECTED: DESKTOP (Mouse & Keyboard). Ensure full desktop UI.]',
    };
  }

  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = window.devicePixelRatio || 1;
  const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const os = getOS();
  const ua = navigator.userAgent.toLowerCase();

  const isMobileUA = /android|webos|iphone|ipod|blackberry|iemobile|opera mini/i.test(ua);
  const isTabletUA = /ipad|tablet|(android(?!.*mobile))/i.test(ua);

  let deviceType: DeviceType = 'desktop';

  if (isMobileUA || (width < 768 && hasTouch)) {
    deviceType = 'mobile';
  } else if (isTabletUA || (width >= 768 && width <= 1024 && hasTouch)) {
    deviceType = 'tablet';
  } else if (width < 768) {
    deviceType = 'mobile';
  } else {
    deviceType = 'desktop';
  }

  const isMobile = deviceType === 'mobile';
  const isTablet = deviceType === 'tablet';
  const isDesktop = deviceType === 'desktop';
  const orientation: 'portrait' | 'landscape' = height > width ? 'portrait' : 'landscape';

  const recommendedModelId = isMobile
    ? 'gemini-3.8-flash'
    : isTablet
    ? 'gemini-4-argon'
    : 'gemini-4-argon';

  const recommendedModelName = isMobile
    ? 'ChargoX Mobile Adaptive (Ultra-Fast Touch Engine)'
    : isTablet
    ? 'ChargoX Tablet Hybrid'
    : 'ChargoX 4 Argon (Desktop Pro)';

  const deviceBannerText = isMobile
    ? `📱 Mobile (${os} • ${width}x${height}) — Auto-Tuned for Touch & Sub-Second Speed`
    : isTablet
    ? `📟 Tablet (${os} • ${width}x${height}) — Hybrid Touch Viewport Active`
    : `💻 Desktop (${os} • ${width}x${height}) — Full Multi-Pane Studio Active`;

  const devicePromptContext = isMobile
    ? `[DEVICE CONTEXT: MOBILE DEVICE DETECTED (${os}, Viewport: ${width}x${height}px, Touchscreen: ACTIVE). CRITICAL DESIGN DIRECTIVE: You MUST build a mobile-first, thumb-accessible layout. Use min 48px touch targets, comfortable tap padding, sticky bottom navigation or drawer where suitable, safe-area-inset padding, no horizontal overflowing text or tables, and include on-screen touch controls (like virtual D-pad or swipe buttons) if making games or interactive tools.]`
    : isTablet
    ? `[DEVICE CONTEXT: TABLET DEVICE DETECTED (${os}, Viewport: ${width}x${height}px, Touchscreen: ACTIVE). Support both portrait and landscape orientation with responsive grid layout and touch-friendly controls.]`
    : `[DEVICE CONTEXT: DESKTOP WORKSTATION DETECTED (${os}, Viewport: ${width}x${height}px, Mouse/Keyboard: ACTIVE). Provide full desktop interface with keyboard shortcuts, side-by-side multi-column views, and rich hover effects.]`;

  return {
    deviceType,
    isMobile,
    isTablet,
    isDesktop,
    os,
    width,
    height,
    pixelRatio,
    hasTouch,
    orientation,
    recommendedModelId,
    recommendedModelName,
    deviceBannerText,
    devicePromptContext,
  };
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>(detectDevice);

  useEffect(() => {
    const handleResize = () => {
      setDeviceInfo(detectDevice());
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
    };
  }, []);

  return deviceInfo;
}
