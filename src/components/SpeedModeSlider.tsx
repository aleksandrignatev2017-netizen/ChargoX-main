import React, { useState, useRef } from 'react';
import { Zap, Sparkles, Rocket } from 'lucide-react';

export type SpeedMode = 'fast' | 'auto' | 'max';

interface SpeedModeSliderProps {
  value: SpeedMode;
  onChange: (mode: SpeedMode) => void;
  compact?: boolean;
}

export const SpeedModeSlider: React.FC<SpeedModeSliderProps> = ({
  value,
  onChange,
  compact = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);

  const modes: Array<{
    id: SpeedMode;
    label: string;
    sub: string;
    icon: typeof Zap;
    color: string;
    glow: string;
    badge: string;
  }> = [
    {
      id: 'fast',
      label: 'Fast',
      sub: 'Sub-second',
      icon: Zap,
      color: 'text-teal-400',
      glow: 'shadow-teal-500/20 bg-teal-500/20 border-teal-500/40 text-teal-300',
      badge: '1-2s Response'
    },
    {
      id: 'auto',
      label: 'Auto',
      sub: 'Smart balance',
      icon: Sparkles,
      color: 'text-amber-400',
      glow: 'shadow-amber-500/20 bg-amber-500/20 border-amber-500/40 text-amber-300',
      badge: 'Best Model'
    },
    {
      id: 'max',
      label: 'Max',
      sub: 'Deep reasoning',
      icon: Rocket,
      color: 'text-fuchsia-400',
      glow: 'shadow-fuchsia-500/20 bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300',
      badge: 'Flagship Logic'
    }
  ];

  const currentIndex = modes.findIndex((m) => m.id === value);

  // Swipe / touch handling for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null) return;
    const diff = e.changedTouches[0].clientX - touchStartX;
    const threshold = 35; // minimum swipe distance

    if (diff > threshold) {
      // Swiped right -> move towards max
      if (value === 'fast') onChange('auto');
      else if (value === 'auto') onChange('max');
    } else if (diff < -threshold) {
      // Swiped left -> move towards fast
      if (value === 'max') onChange('auto');
      else if (value === 'auto') onChange('fast');
    }
    setTouchStartX(null);
  };

  if (compact) {
    return (
      <div 
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative inline-flex items-center bg-[#10131a] p-1 rounded-xl border border-[#212738] select-none"
        title="Swipe or click: Fast (sub-second) - Auto (smart balance) - Max (deep reasoning)"
      >
        {/* Sliding Indicator Pill */}
        <div 
          className="absolute top-1 bottom-1 w-[calc(33.333%-2px)] rounded-lg bg-[#1f2638] border border-[#2f3952] transition-all duration-200 ease-out shadow-sm pointer-events-none"
          style={{
            left: `calc(${currentIndex * 33.333}% + 1px)`,
          }}
        />

        {modes.map((m) => {
          const Icon = m.icon;
          const isActive = value === m.id;
          return (
            <button
              key={m.id}
              type="button"
              onClick={() => onChange(m.id)}
              className={`relative z-10 flex items-center justify-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition cursor-pointer min-w-[68px] ${
                isActive ? m.color : 'text-[#7e8596] hover:text-white'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{m.label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Interactive Swipeable Track Container */}
      <div
        ref={containerRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="relative w-full max-w-md bg-[#10131a] p-1.5 rounded-2xl border border-[#23293a] select-none shadow-inner"
      >
        {/* Sliding pill */}
        <div 
          className="absolute top-1.5 bottom-1.5 w-[calc(33.333%-3px)] rounded-xl bg-gradient-to-b from-[#20273a] to-[#151a28] border border-cyan-500/30 transition-all duration-200 ease-out shadow-md shadow-cyan-500/10 pointer-events-none"
          style={{
            left: `calc(${currentIndex * 33.333}% + 1.5px)`,
          }}
        />

        {/* 3 Interactive Buttons (Fast - Auto - Max) */}
        <div className="relative z-10 grid grid-cols-3 gap-1">
          {modes.map((m) => {
            const Icon = m.icon;
            const isActive = value === m.id;
            return (
              <button
                key={m.id}
                type="button"
                onClick={() => onChange(m.id)}
                className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition cursor-pointer text-center ${
                  isActive ? 'text-white' : 'text-[#7c8394] hover:text-[#c4cad8]'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  <Icon className={`w-3.5 h-3.5 ${isActive ? m.color : ''}`} />
                  <span>{m.label}</span>
                </div>
                <span className="text-[10px] text-[#697082] line-clamp-1 mt-0.5 font-mono">
                  {m.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Swipe Guide & Status Note */}
      <div className="flex items-center justify-between w-full max-w-md px-2 text-[10px] text-[#6f7688]">
        <span className="flex items-center gap-1">
          <span className="text-cyan-400 font-mono">⇄</span>
          <span>Swipe or tap to switch</span>
        </span>
        <span className="font-semibold text-cyan-300">
          {modes[currentIndex].badge}
        </span>
      </div>
    </div>
  );
};
