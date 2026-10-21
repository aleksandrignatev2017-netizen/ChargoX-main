import React from 'react';
import { Terminal, CheckCircle2, Clock, Cpu, Server } from 'lucide-react';
import { PlanStep } from '../types';

interface AgentTerminalProps {
  steps: PlanStep[];
  isBuilding: boolean;
  appName: string;
}

export const AgentTerminal: React.FC<AgentTerminalProps> = ({
  steps,
  isBuilding,
  appName,
}) => {
  return (
    <div className="flex flex-col h-full w-full bg-[#090b0e] text-[#a6accd] font-mono text-xs select-none overflow-hidden">
      {/* Header */}
      <div className="h-11 border-b border-[#1c202a] bg-[#11141a] px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2 text-white font-semibold">
          <Terminal className="w-4 h-4 text-cyan-400" />
          <span>ChargoX Build & Compilation Logs</span>
        </div>
        <div className="flex items-center gap-4 text-[11px] text-[#717684]">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-blue-400" /> Memory: 42MB
          </span>
          <span className="flex items-center gap-1.5">
            <Server className="w-3.5 h-3.5 text-emerald-400" /> Port: 3000
          </span>
        </div>
      </div>

      {/* Terminal Output */}
      <div className="flex-1 overflow-auto p-4 space-y-2 leading-relaxed">
        <div className="text-[#555a64]">
          [ChargoX Engine v2.4.0 - Google AI Studio Architecture Mode]
        </div>
        <div className="text-cyan-400">
          $ chargox build --app "{appName}" --target web-sandbox
        </div>
        <div className="text-[#7c8294]">
          ℹ Initializing runtime sandbox with Tailwind CSS v4, Lucide CDN, and Web APIs...
        </div>

        {steps.map((step, idx) => (
          <div key={idx} className="flex items-start gap-2 pt-1 border-l-2 border-cyan-500/30 pl-3">
            <span className="text-emerald-400 shrink-0">✔</span>
            <div>
              <div className="text-white font-semibold">{step.action}</div>
              <div className="text-[#888e9e] text-[11px]">{step.detail}</div>
            </div>
            {step.timestamp && (
              <span className="text-[10px] text-[#555a64] ml-auto shrink-0 font-mono">
                {step.timestamp}
              </span>
            )}
          </div>
        ))}

        {isBuilding ? (
          <div className="flex items-center gap-2 text-amber-400 animate-pulse pt-2">
            <span className="inline-block w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Agent executing tool steps and compiling preview...</span>
          </div>
        ) : (
          <div className="pt-3 border-t border-[#1c202a] text-emerald-400">
            ✔ Application compiled and running safely in sandboxed iframe. (0 errors, 0 warnings)
          </div>
        )}
      </div>
    </div>
  );
};
