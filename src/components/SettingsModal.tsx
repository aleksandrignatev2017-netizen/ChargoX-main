import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, Sparkles, Key, Cpu, ShieldCheck } from 'lucide-react';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<{ hasGeminiKey: boolean; model: string } | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/status')
        .then((r) => r.json())
        .then((data) => setStatus(data))
        .catch(() => setStatus({ hasGeminiKey: false, model: 'gemini-3.8-flash' }));
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#12151c] border border-[#232836] rounded-2xl max-w-md w-full p-6 shadow-2xl text-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-[#202534] mb-4">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-xs">
              CX
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">ChargoX Studio Settings</h3>
              <p className="text-[11px] text-[#858b99]">Engine and Model Configuration</p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#717684] hover:text-white p-1 rounded transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4 text-xs">
          {/* Active Model */}
          <div className="p-3.5 rounded-xl bg-[#171b24] border border-[#222836]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" /> Model Architecture
              </span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono">
                {status?.model || 'gemini-3.8-flash'}
              </span>
            </div>
            <p className="text-[11px] text-[#8c92a0]">
              Full multimodal reasoning with automated code generation, Tailwind styling, and live sandbox compilation.
            </p>
          </div>

          {/* API Key Status */}
          <div className="p-3.5 rounded-xl bg-[#171b24] border border-[#222836]">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-semibold text-white flex items-center gap-2">
                <Key className="w-4 h-4 text-amber-400" /> Gemini API Integration
              </span>
              {status?.hasGeminiKey ? (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> Connected
                </span>
              ) : (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Smart Instant Engine
                </span>
              )}
            </div>
            <p className="text-[11px] text-[#8c92a0]">
              Server-side secure proxy with automatic fallbacks for instant previews.
            </p>
          </div>

          {/* Sandbox Security */}
          <div className="p-3.5 rounded-xl bg-[#171b24] border border-[#222836]">
            <div className="flex items-center gap-2 font-semibold text-white mb-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" /> Isolated Iframe Sandbox
            </div>
            <p className="text-[11px] text-[#8c92a0]">
              All generated web apps and games run inside an isolated sandboxed runtime with CDN support (Tailwind, Lucide, Web Audio).
            </p>
          </div>
        </div>

        <div className="pt-5 mt-4 border-t border-[#202534] flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold text-xs shadow-md transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
