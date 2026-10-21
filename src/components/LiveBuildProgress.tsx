import React, { useState, useEffect } from 'react';
import { RotateCw, Zap, Sparkles, Rocket, CheckCircle2 } from 'lucide-react';
import { SpeedMode } from './SpeedModeSlider';

interface LiveBuildProgressProps {
  speedMode: SpeedMode;
  appName?: string;
}

export const LiveBuildProgress: React.FC<LiveBuildProgressProps> = ({
  speedMode,
  appName = 'Custom Web Application'
}) => {
  const [elapsed, setElapsed] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);

  const steps = [
    { title: 'Parsing user prompt & architectural intent', detail: 'Deconstructing features, UI components, and data state' },
    { title: 'Synthesizing responsive layout & Tailwind CSS', detail: 'Designing clean mobile/desktop interface with glassmorphism' },
    { title: 'Wiring event listeners & interactive JavaScript', detail: 'Connecting real state, buttons, audio, and storage' },
    { title: 'Compiling applet & verifying iframe sandbox', detail: 'Launching instant runtime preview' },
  ];

  useEffect(() => {
    const startTime = Date.now();
    const timerInterval = setInterval(() => {
      const seconds = ((Date.now() - startTime) / 1000);
      setElapsed(Number(seconds.toFixed(1)));

      if (seconds > 0.6 && seconds < 1.4) setStepIndex(1);
      else if (seconds >= 1.4 && seconds < 2.3) setStepIndex(2);
      else if (seconds >= 2.3) setStepIndex(3);
    }, 100);

    return () => clearInterval(timerInterval);
  }, []);

  const progressPercent = Math.min(95, Math.round(((stepIndex + 1) / steps.length) * 100 * 0.95));

  const speedBadge = 
    speedMode === 'fast' 
      ? { label: '⚡ Ultra-Fast Mode', color: 'text-teal-400 bg-teal-950 border-teal-800/40' }
      : speedMode === 'max'
      ? { label: '🚀 Max Reasoning Mode', color: 'text-fuchsia-400 bg-fuchsia-950 border-fuchsia-800/40' }
      : { label: '✨ Auto Adaptive Mode', color: 'text-amber-400 bg-amber-950 border-amber-800/40' };

  return (
    <div className="w-full p-4 rounded-2xl bg-gradient-to-b from-[#131722] to-[#0c0f16] border border-cyan-500/30 shadow-2xl space-y-3.5 animate-in fade-in duration-200">
      {/* Top Header: Spinner + Mode + Timer */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <RotateCw className="w-4 h-4 text-cyan-400 animate-spin" />
          <span className="text-xs font-bold text-white">ChargoX Active Synthesizer</span>
        </div>

        <div className="flex items-center gap-2">
          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border font-semibold ${speedBadge.color}`}>
            {speedBadge.label}
          </span>
          <span className="text-[11px] font-mono font-bold text-cyan-300 bg-[#161c28] px-2 py-0.5 rounded-lg border border-[#242c3e]">
            ⏱️ {elapsed}s
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-[10px] text-[#788094] font-mono">
          <span>Synthesizing application code...</span>
          <span className="text-cyan-400 font-bold">{progressPercent}%</span>
        </div>
        <div className="w-full h-1.5 bg-[#1b212f] rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 transition-all duration-300 ease-out"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Live Active Step List */}
      <div className="space-y-2 pt-1 border-t border-[#1b202c]">
        {steps.map((st, i) => {
          const isDone = i < stepIndex;
          const isCurrent = i === stepIndex;
          return (
            <div 
              key={i} 
              className={`flex items-start gap-2.5 text-xs transition-opacity duration-200 ${
                isCurrent ? 'opacity-100' : isDone ? 'opacity-70' : 'opacity-40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
              ) : isCurrent ? (
                <RotateCw className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0 mt-0.5" />
              ) : (
                <span className="w-3.5 h-3.5 rounded-full border border-[#3b4356] shrink-0 mt-0.5" />
              )}
              <div className="min-w-0 flex-1">
                <span className={`font-semibold ${isCurrent ? 'text-white' : 'text-[#c0c6d6]'}`}>
                  {st.title}
                </span>
                <p className="text-[10px] text-[#717888] leading-tight truncate">
                  {st.detail}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
