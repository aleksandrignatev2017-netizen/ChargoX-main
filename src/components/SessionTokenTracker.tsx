import React, { useState } from 'react';
import { Coins, ChevronDown, ChevronUp, Cpu, Activity, Info, Sparkles } from 'lucide-react';
import { SessionTokenUsage } from '../types';

interface SessionTokenTrackerProps {
  usage: SessionTokenUsage;
}

export const SessionTokenTracker: React.FC<SessionTokenTrackerProps> = ({ usage }) => {
  const [isOpen, setIsOpen] = useState(false);

  const formatTokens = (num: number): string => {
    if (num >= 1_000_000) return (num / 1_000_000).toFixed(2) + 'M';
    if (num >= 1_000) return (num / 1_000).toFixed(1) + 'k';
    return num.toLocaleString();
  };

  const formatCost = (cost: number): string => {
    if (cost < 0.0001 && cost > 0) return '< $0.0001';
    return `$${cost.toFixed(4)}`;
  };

  return (
    <div className="relative">
      {/* Trigger pill button in header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-2 sm:px-2.5 py-1 rounded-xl bg-[#141822] hover:bg-[#1b2130] border border-[#22293a] text-xs transition cursor-pointer text-[#9fa6b8] hover:text-white group"
        title="Session Token Usage & Cost"
      >
        <Coins className="w-3.5 h-3.5 text-amber-400 group-hover:scale-110 transition-transform" />
        
        {/* Token summary */}
        <div className="flex items-center gap-1.5 font-mono text-[11px]">
          <span className="text-cyan-400 font-semibold">{formatTokens(usage.totalTokens)}</span>
          <span className="text-[#555d70] hidden sm:inline">tok</span>
          <span className="text-[#3b4356] hidden sm:inline">•</span>
          <span className="text-emerald-400 font-semibold hidden sm:inline">{formatCost(usage.estimatedCost)}</span>
        </div>

        {isOpen ? (
          <ChevronUp className="w-3 h-3 text-slate-500" />
        ) : (
          <ChevronDown className="w-3 h-3 text-slate-500" />
        )}
      </button>

      {/* Popover detailed breakdown */}
      {isOpen && (
        <>
          <div 
            className="fixed inset-0 z-30" 
            onClick={() => setIsOpen(false)} 
          />
          <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl bg-[#10131d] border border-[#252c3f] shadow-2xl z-40 p-3.5 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
            <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-[#1c2234]">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Activity className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="font-bold text-white text-[12px]">Session Token Tracker</div>
                  <div className="text-[10px] text-slate-400">Real-time compute & cost analytics</div>
                </div>
              </div>
              <span className="px-1.5 py-0.5 rounded text-[9px] bg-cyan-950 text-cyan-300 font-mono border border-cyan-800/40">
                {usage.callCount} {usage.callCount === 1 ? 'call' : 'calls'}
              </span>
            </div>

            {/* Token breakdown grid */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <div className="p-2 rounded-xl bg-[#0a0c12] border border-[#191f2e]">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5 font-medium">Input Tokens</div>
                <div className="font-mono text-sm font-bold text-cyan-400">{usage.inputTokens.toLocaleString()}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Prompt + Context</div>
              </div>

              <div className="p-2 rounded-xl bg-[#0a0c12] border border-[#191f2e]">
                <div className="text-[10px] text-slate-400 uppercase tracking-wider mb-0.5 font-medium">Output Tokens</div>
                <div className="font-mono text-sm font-bold text-fuchsia-400">{usage.outputTokens.toLocaleString()}</div>
                <div className="text-[9px] text-slate-500 mt-0.5">Code + Plan JSON</div>
              </div>
            </div>

            {/* Total tokens and cost */}
            <div className="p-2.5 rounded-xl bg-gradient-to-r from-emerald-950/40 to-cyan-950/40 border border-emerald-500/20 mb-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-[11px] text-slate-300">Total Tokens Consumed:</span>
                <span className="font-mono font-bold text-white text-[12px]">{usage.totalTokens.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] text-emerald-400 font-medium">Estimated Session Cost:</span>
                <span className="font-mono font-bold text-emerald-300 text-[13px]">{formatCost(usage.estimatedCost)}</span>
              </div>
            </div>

            {/* Last turn metrics */}
            {(usage.lastTurnInputTokens !== undefined || usage.lastTurnOutputTokens !== undefined) && (
              <div className="pt-2 border-t border-[#1a2030] flex items-center justify-between text-[10px] text-slate-400 font-mono">
                <span>Last Turn:</span>
                <span className="text-slate-300">
                  +{usage.lastTurnInputTokens?.toLocaleString() || 0} in / +{usage.lastTurnOutputTokens?.toLocaleString() || 0} out
                </span>
              </div>
            )}

            <div className="mt-2 text-[9px] text-slate-500 flex items-center gap-1">
              <Info className="w-3 h-3 text-slate-500 shrink-0" />
              <span>Calculated at Gemini API standard rates ($0.075 / 1M in, $0.30 / 1M out).</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
