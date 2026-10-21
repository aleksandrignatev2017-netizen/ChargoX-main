import React, { useState } from 'react';
import { Cpu, Info, Zap } from 'lucide-react';

interface TokenMeterProps {
  text: string;
  maxTokens?: number;
  maxChars?: number;
  compact?: boolean;
}

export const TokenMeter: React.FC<TokenMeterProps> = ({
  text,
  maxTokens = 32768,
  maxChars = 131072,
  compact = false,
}) => {
  const [showTooltip, setShowTooltip] = useState(false);

  const charCount = text.length;
  const wordCount = text.trim() ? text.trim().split(/\s+/).filter(Boolean).length : 0;
  // Gemini standard rule-of-thumb: ~1 token per 4 characters
  const tokenCount = Math.ceil(charCount / 4);
  const remainingTokens = Math.max(0, maxTokens - tokenCount);
  const remainingChars = Math.max(0, maxChars - charCount);
  const percentUsed = Math.min(100, (tokenCount / maxTokens) * 100);

  if (compact) {
    return (
      <div className="relative inline-flex items-center">
        <button
          type="button"
          onClick={() => setShowTooltip(!showTooltip)}
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-[#0e1117] hover:bg-[#161a22] border border-[#222736] text-[10px] font-mono text-[#9ea4b4] hover:text-cyan-300 transition cursor-pointer"
          title="Click to view token & character budget"
        >
          <Zap className="w-3 h-3 text-cyan-400" />
          <span className="font-semibold text-white">{tokenCount.toLocaleString()}</span>
          <span className="text-[#646a78]">/ {maxTokens.toLocaleString()} tok</span>
          <span className="text-cyan-400 font-medium">({remainingTokens.toLocaleString()} left)</span>
        </button>

        {showTooltip && (
          <div className="absolute bottom-full right-0 mb-2 w-64 bg-[#141822] border border-[#262c3e] rounded-xl shadow-2xl p-3 z-50 text-[11px] text-slate-200">
            <div className="flex items-center justify-between pb-1.5 border-b border-[#202534] mb-2 font-bold text-white">
              <span className="flex items-center gap-1 text-cyan-400">
                <Cpu className="w-3.5 h-3.5" /> Token & Text Capacity
              </span>
              <span className="text-[10px] text-emerald-400 font-mono">
                {percentUsed < 0.1 ? '<0.1%' : `${percentUsed.toFixed(1)}%`} used
              </span>
            </div>

            <div className="space-y-1.5 font-mono text-[10px]">
              <div className="flex justify-between">
                <span className="text-slate-400">Tokens entered:</span>
                <span className="font-bold text-white">{tokenCount.toLocaleString()} tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Tokens remaining:</span>
                <span className="font-bold text-cyan-400">+{remainingTokens.toLocaleString()} tokens</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Characters typed:</span>
                <span className="font-bold text-white">{charCount.toLocaleString()} / {maxChars.toLocaleString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Characters remaining:</span>
                <span className="font-bold text-emerald-400">+{remainingChars.toLocaleString()} chars</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Word count:</span>
                <span className="font-bold text-white">{wordCount.toLocaleString()} words</span>
              </div>
            </div>

            {/* Visual Token Meter Bar */}
            <div className="w-full h-1 bg-[#1e2330] rounded-full overflow-hidden mt-2.5">
              <div
                className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-200"
                style={{ width: `${Math.max(percentUsed, 1)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative inline-flex items-center gap-2">
      <div
        className="flex items-center gap-2 px-2.5 py-1 rounded-xl bg-[#0e1117] border border-[#222736] text-[11px] font-mono text-[#9da3b2]"
        onMouseEnter={() => setShowTooltip(true)}
        onMouseLeave={() => setShowTooltip(false)}
      >
        <div className="flex items-center gap-1 text-cyan-400 font-bold">
          <Zap className="w-3.5 h-3.5" />
          <span>{tokenCount.toLocaleString()}</span>
          <span className="text-[#626876] font-normal">/ {maxTokens.toLocaleString()} tokens</span>
        </div>

        <span className="text-[#3a4050]">•</span>

        <div className="flex items-center gap-1 text-slate-300">
          <span>{charCount.toLocaleString()}</span>
          <span className="text-[#626876]">/ {maxChars.toLocaleString()} chars</span>
        </div>

        <span className="text-[#3a4050]">•</span>

        <span className="text-emerald-400 font-medium">
          +{remainingTokens.toLocaleString()} tokens ({remainingChars.toLocaleString()} text left)
        </span>
      </div>

      {showTooltip && (
        <div className="absolute bottom-full left-0 mb-2 w-72 bg-[#141822] border border-[#262c3e] rounded-xl shadow-2xl p-3 z-50 text-[11px] text-slate-200">
          <div className="flex items-center justify-between pb-1.5 border-b border-[#202534] mb-2 font-bold text-white">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Cpu className="w-3.5 h-3.5" /> Live Token & Text Telemetry
            </span>
            <span className="text-[10px] text-emerald-400 font-mono">
              {percentUsed < 0.1 ? '<0.1%' : `${percentUsed.toFixed(1)}%`}
            </span>
          </div>

          <p className="text-[10px] text-slate-400 mb-2">
            Real-time context window estimator (~4 characters per token). As you speak or type, remaining budget updates automatically.
          </p>

          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Current Tokens:</span>
              <span className="font-bold text-white">{tokenCount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Tokens Left:</span>
              <span className="font-bold text-cyan-400">+{remainingTokens.toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Current Text:</span>
              <span className="font-bold text-white">{charCount.toLocaleString()} characters ({wordCount} words)</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Text Capacity Left:</span>
              <span className="font-bold text-emerald-400">+{remainingChars.toLocaleString()} characters</span>
            </div>
          </div>

          <div className="w-full h-1 bg-[#1e2330] rounded-full overflow-hidden mt-2.5">
            <div
              className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 transition-all duration-200"
              style={{ width: `${Math.max(percentUsed, 1)}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
