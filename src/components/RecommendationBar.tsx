import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  ChevronDown, 
  ChevronUp, 
  Wand2, 
  RefreshCw, 
  Zap, 
  Volume2, 
  Palette, 
  Database, 
  Gauge, 
  Check, 
  X,
  Plus
} from 'lucide-react';
import { AppRecommendation } from '../types';

interface RecommendationBarProps {
  appName: string;
  originalPrompt: string;
  previewHtml: string;
  onApplyRecommendation: (prompt: string) => void;
  isBuilding: boolean;
}

export const RecommendationBar: React.FC<RecommendationBarProps> = ({
  appName,
  originalPrompt,
  previewHtml,
  onApplyRecommendation,
  isBuilding
}) => {
  const [recommendations, setRecommendations] = useState<AppRecommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [appliedId, setAppliedId] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/recommend-improvements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          appName,
          prompt: originalPrompt,
          previewHtml: (previewHtml || '').slice(0, 3000)
        })
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
          setRecommendations(data.recommendations);
        }
      }
    } catch (err) {
      console.warn('Failed to load AI recommendations:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [appName]);

  const handleApply = (rec: AppRecommendation) => {
    setAppliedId(rec.id);
    onApplyRecommendation(rec.prompt);
    setTimeout(() => {
      setAppliedId(null);
    }, 2500);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'audio':
        return <Volume2 className="w-3.5 h-3.5 text-yellow-400" />;
      case 'design':
        return <Palette className="w-3.5 h-3.5 text-pink-400" />;
      case 'data':
        return <Database className="w-3.5 h-3.5 text-cyan-400" />;
      case 'performance':
        return <Gauge className="w-3.5 h-3.5 text-emerald-400" />;
      default:
        return <Zap className="w-3.5 h-3.5 text-indigo-400" />;
    }
  };

  const getImpactBadge = (impact: string) => {
    switch (impact) {
      case 'High':
        return 'bg-purple-950/70 text-purple-300 border-purple-800/40';
      case 'Quick Win':
        return 'bg-emerald-950/70 text-emerald-300 border-emerald-800/40';
      default:
        return 'bg-blue-950/70 text-blue-300 border-blue-800/40';
    }
  };

  if (recommendations.length === 0 && !isLoading) {
    return null;
  }

  return (
    <div className="border-b border-[#1b202c] bg-[#0c0e15] px-3 py-2 text-xs transition-all">
      <div className="flex items-center justify-between gap-2">
        {/* Toggle header */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center gap-2 text-[#9da3b4] hover:text-white transition group cursor-pointer text-left"
        >
          <div className="w-5 h-5 rounded-md bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 group-hover:scale-105 transition-transform">
            <Sparkles className="w-3 h-3 animate-pulse" />
          </div>
          <span className="font-semibold text-[11px] sm:text-xs text-slate-200">
            AI App Recommendations
          </span>
          <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-cyan-950 text-cyan-400 border border-cyan-800/40 font-mono font-medium">
            {recommendations.length}
          </span>
          {isExpanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-slate-400" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          )}
        </button>

        {/* Right action: Refresh with AI button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={fetchRecommendations}
            disabled={isLoading || isBuilding}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-[#141822] hover:bg-[#1b2130] text-[#8e95a5] hover:text-cyan-300 border border-[#22293a] text-[10px] font-medium transition disabled:opacity-50 cursor-pointer"
            title="Generate fresh AI recommendations for this app"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin text-cyan-400' : ''}`} />
            <span className="hidden sm:inline">Refresh with AI</span>
          </button>
        </div>
      </div>

      {/* Expanded recommendations grid */}
      {isExpanded && (
        <div className="mt-2.5 pt-2 border-t border-[#171b26] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {recommendations.map((rec) => {
            const isJustApplied = appliedId === rec.id;
            return (
              <div
                key={rec.id}
                className="p-2.5 rounded-xl bg-[#11141e] hover:bg-[#141824] border border-[#1e2434] hover:border-cyan-500/30 transition flex flex-col justify-between group shadow-xs"
              >
                <div>
                  <div className="flex items-center justify-between gap-1.5 mb-1.5">
                    <div className="flex items-center gap-1.5 min-w-0">
                      {getCategoryIcon(rec.category)}
                      <span className="font-bold text-[11px] text-white truncate">
                        {rec.title}
                      </span>
                    </div>
                    <span className={`px-1.5 py-0.5 rounded text-[9px] font-semibold border shrink-0 ${getImpactBadge(rec.impact)}`}>
                      {rec.impact}
                    </span>
                  </div>
                  <p className="text-[10px] text-[#868d9e] leading-snug line-clamp-2 mb-2">
                    {rec.description}
                  </p>
                </div>

                <button
                  onClick={() => handleApply(rec)}
                  disabled={isBuilding}
                  className={`w-full py-1.5 px-2 rounded-lg text-[10px] font-bold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50 ${
                    isJustApplied
                      ? 'bg-emerald-500 text-black shadow-xs'
                      : 'bg-cyan-950/80 hover:bg-cyan-500 hover:text-black text-cyan-300 border border-cyan-800/50 group-hover:border-cyan-500/50'
                  }`}
                >
                  {isJustApplied ? (
                    <>
                      <Check className="w-3 h-3" />
                      <span>Applying to App...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-3 h-3" />
                      <span>1-Click Apply</span>
                    </>
                  )}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
