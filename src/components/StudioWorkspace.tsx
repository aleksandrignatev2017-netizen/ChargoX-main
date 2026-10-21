import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Sparkles, 
  Code2, 
  Eye, 
  Terminal, 
  SendHorizontal, 
  RotateCw, 
  CheckCircle2, 
  Clock, 
  Cpu, 
  SlidersHorizontal,
  ChevronDown,
  Zap,
  Github,
  Globe,
  Rocket,
  Trash2,
  MessageSquare,
  Smartphone,
  ExternalLink
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { AppProject, AppVersion, ChatMessage, StudioTab, AppDeployment, SessionTokenUsage } from '../types';
import { LivePreviewFrame } from './LivePreviewFrame';
import { CodeExplorer } from './CodeExplorer';
import { AgentTerminal } from './AgentTerminal';
import { PWAInstallButton } from './PWAInstallButton';
import { AutoDeployModal } from './AutoDeployModal';
import { TokenMeter } from './TokenMeter';
import { SpeedModeSlider, SpeedMode } from './SpeedModeSlider';
import { LiveBuildProgress } from './LiveBuildProgress';
import { SessionTokenTracker } from './SessionTokenTracker';
import { RecommendationBar } from './RecommendationBar';
import { AVAILABLE_MODELS, getModelById, resolveAutoModel, QUESTION_AIDS } from '../data/models';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface StudioWorkspaceProps {
  project: AppProject;
  messages: ChatMessage[];
  isBuilding: boolean;
  onSendPrompt: (prompt: string) => void;
  onBackToHome: () => void;
  onOpenSettings: () => void;
  onOpenGallery?: () => void;
  onOpenGitHubModal?: () => void;
  onOpenDownloadWebsite?: () => void;
  onUpdateFile?: (fileName: string, newContent: string) => void;
  onRollbackVersion?: (version: AppVersion) => void;
  onUpdateDeployment?: (deployment?: AppDeployment) => void;
  onDeleteApp?: (appId: string) => void;
  mode?: string;
  onModeChange?: (mode: string) => void;
  speedMode?: SpeedMode;
  onSpeedModeChange?: (speed: SpeedMode) => void;
  sessionTokenUsage?: SessionTokenUsage;
}

export const StudioWorkspace: React.FC<StudioWorkspaceProps> = ({
  project,
  messages,
  isBuilding,
  onSendPrompt,
  onBackToHome,
  onOpenSettings,
  onOpenGallery,
  onOpenGitHubModal,
  onOpenDownloadWebsite,
  onUpdateFile,
  onRollbackVersion,
  onUpdateDeployment,
  onDeleteApp,
  mode = 'Auto (Smart Model)',
  onModeChange,
  speedMode = 'auto',
  onSpeedModeChange,
  sessionTokenUsage,
}) => {
  const device = useDeviceDetection();
  const [activeTab, setActiveTab] = useState<StudioTab>('preview');
  // On mobile devices, allow switching between viewing the live app and the chat pane
  const [mobilePane, setMobilePane] = useState<'preview' | 'chat' | 'code' | 'logs'>('preview');
  const [inputPrompt, setInputPrompt] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isDeployModalOpen, setIsDeployModalOpen] = useState(false);
  const [showModelDropdown, setShowModelDropdown] = useState(false);
  const [localSpeedMode, setLocalSpeedMode] = useState<SpeedMode>(speedMode);

  const handleSpeedChange = (newSpeed: SpeedMode) => {
    setLocalSpeedMode(newSpeed);
    if (onSpeedModeChange) onSpeedModeChange(newSpeed);
    if (onModeChange) {
      if (newSpeed === 'fast') onModeChange('ChargoX 3.1 Flash Lite');
      else if (newSpeed === 'auto') onModeChange('Auto (Smart Model)');
      else if (newSpeed === 'max') onModeChange('ChargoX 4 Argon');
    }
  };

  const currentModel = AVAILABLE_MODELS.find((m) => m.name === mode || m.id === mode) || AVAILABLE_MODELS[0];
  const autoResolution = resolveAutoModel(inputPrompt);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputPrompt.trim() || isBuilding) return;
    onSendPrompt(inputPrompt.trim());
    setInputPrompt('');
    // On mobile, if sending from chat, stay in chat or switch to preview on finish
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  return (
    <div className="flex flex-col h-screen w-screen bg-[#0d0f12] text-slate-100 select-none overflow-hidden font-sans">
      {/* Top Workspace Header */}
      <header className="h-14 border-b border-[#1c202a] bg-[#11131a] px-3 sm:px-4 flex items-center justify-between shrink-0 z-20">
        {/* Left: Back button + App identity */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <button
            onClick={onBackToHome}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-[#181c24] hover:bg-[#202532] text-xs font-semibold text-[#9ea4b4] hover:text-white border border-[#262c3b] transition shrink-0 cursor-pointer"
            title="Return to Home"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Home</span>
          </button>

          <div className="h-4 w-px bg-[#262a36] hidden sm:block"></div>

          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-cyan-500 to-blue-500 text-black font-black text-[10px] flex items-center justify-center shrink-0">
              CX
            </div>
            <div className="font-bold text-xs sm:text-sm text-white truncate max-w-[140px] sm:max-w-xs">
              {project.name}
            </div>
            {isBuilding ? (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 font-medium shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-spin"></span>
                <span>Building...</span>
              </span>
            ) : (
              <span className="hidden md:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Ready</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Mobile View Switcher (Visible on mobile/tablet) */}
        <div className="flex lg:hidden items-center bg-[#090b0f] border border-[#1f2432] rounded-xl p-0.5 text-xs">
          <button
            onClick={() => setMobilePane('preview')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
              mobilePane === 'preview'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/50 shadow-xs'
                : 'text-[#848a98]'
            }`}
            title="View Live App"
          >
            <Eye className="w-3.5 h-3.5" />
            <span className="text-[11px]">App</span>
          </button>

          <button
            onClick={() => setMobilePane('chat')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition relative ${
              mobilePane === 'chat'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/50 shadow-xs'
                : 'text-[#848a98]'
            }`}
            title="Talk with ChargoX Agent"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span className="text-[11px]">Chat</span>
            {messages.length > 0 && (
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 absolute top-1 right-1"></span>
            )}
          </button>

          <button
            onClick={() => setMobilePane('code')}
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg font-medium transition ${
              mobilePane === 'code'
                ? 'bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/50 shadow-xs'
                : 'text-[#848a98]'
            }`}
            title="View Code"
          >
            <Code2 className="w-3.5 h-3.5" />
            <span className="text-[11px]">Code</span>
          </button>
        </div>

        {/* Center Desktop: Tabs switcher (Visible on desktop screens) */}
        <div className="hidden lg:flex items-center bg-[#0a0c10] border border-[#202533] rounded-xl p-1 text-xs">
          <button
            onClick={() => setActiveTab('preview')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'preview'
                ? 'bg-[#1e2330] text-cyan-300 font-semibold shadow-xs'
                : 'text-[#848a98] hover:text-white'
            }`}
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Live App</span>
          </button>

          <button
            onClick={() => setActiveTab('code')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'code'
                ? 'bg-[#1e2330] text-cyan-300 font-semibold shadow-xs'
                : 'text-[#848a98] hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Code Files ({project.files?.length || 1})</span>
          </button>

          <button
            onClick={() => setActiveTab('logs')}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-medium transition ${
              activeTab === 'logs'
                ? 'bg-[#1e2330] text-cyan-300 font-semibold shadow-xs'
                : 'text-[#848a98] hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Terminal</span>
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          {/* Live Session Token Tracker */}
          <SessionTokenTracker 
            usage={sessionTokenUsage || {
              inputTokens: 0,
              outputTokens: 0,
              totalTokens: 0,
              estimatedCost: 0,
              callCount: 0
            }} 
          />

          {/* 1-Click Auto-Deploy Button */}
          <button
            onClick={() => setIsDeployModalOpen(true)}
            className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer ${
              project.deployment?.status === 'published'
                ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 hover:bg-emerald-900 shadow-emerald-500/10'
                : 'bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-blue-400 text-black shadow-cyan-500/25'
            }`}
            title="Auto-Deploy to Internet with 1-click (Zero setup needed)"
          >
            <Rocket className={`w-3.5 h-3.5 ${project.deployment?.status === 'published' ? 'text-emerald-400' : 'text-black'}`} />
            <span className="hidden sm:inline">{project.deployment?.status === 'published' ? 'Live on Web' : 'Publish'}</span>
          </button>

          {/* Delete App Action ("delete this") */}
          {onDeleteApp && (
            <button
              onClick={() => {
                if (window.confirm(`Delete application "${project.name}" permanently?`)) {
                  onDeleteApp(project.id);
                }
              }}
              className="p-1.5 rounded-xl text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 border border-rose-900/40 transition cursor-pointer"
              title="Delete this application"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            onClick={triggerConfetti}
            className="p-1.5 rounded-xl text-amber-400 hover:bg-[#1a1e28] transition hidden sm:flex"
            title="Celebrate build"
          >
            <Sparkles className="w-4 h-4" />
          </button>

          <button
            onClick={onOpenSettings}
            className="p-1.5 rounded-xl text-[#888d9a] hover:text-white hover:bg-[#1a1e28] transition"
            title="Settings"
          >
            <SlidersHorizontal className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* AI-Powered App Recommendation Bar (Collapsible, never blocks typing) */}
      <RecommendationBar
        appName={project.name}
        originalPrompt={project.prompt}
        previewHtml={project.previewHtml}
        onApplyRecommendation={onSendPrompt}
        isBuilding={isBuilding}
      />

      {/* Main Layout Area */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        {/* Left Pane: Agent Studio Chat (Controlled by mobilePane on mobile, permanent column on desktop) */}
        <div 
          className={`bg-[#11131a] flex flex-col shrink-0 min-h-0 border-r border-[#1c202a] ${
            mobilePane === 'chat'
              ? 'w-full flex-1'
              : 'hidden lg:flex lg:w-[420px] xl:w-[460px]'
          }`}
        >
          {/* Agent status subheader with multi-model selector & Auto support */}
          <div className="px-3 sm:px-4 py-2 border-b border-[#1c202a] bg-[#0d0f14] flex flex-wrap items-center justify-between gap-2 text-xs text-[#8c92a2] relative">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse"></span>
              <span className="font-semibold text-white">ChargoX Engine</span>
              {device.isMobile && (
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  📱 Mobile
                </span>
              )}
            </div>

            {/* Swipeable / Clickable Speed Slider: Fast — Auto — Max */}
            <div className="flex items-center gap-2">
              <SpeedModeSlider
                compact={true}
                value={localSpeedMode}
                onChange={handleSpeedChange}
              />

              {/* Model selector dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowModelDropdown(!showModelDropdown)}
                  className="flex items-center gap-1.5 text-[10px] font-mono bg-[#191d26] hover:bg-[#202636] px-2 py-1 rounded-lg text-cyan-300 border border-[#262c3b] transition cursor-pointer"
                  title="Change active AI model"
                >
                  <span className="max-w-[80px] sm:max-w-none truncate">{currentModel.name}</span>
                  <ChevronDown className="w-3 h-3 text-[#787f91]" />
                </button>

              {showModelDropdown && (
                <div className="absolute top-full right-0 mt-1 w-64 bg-[#141722] border border-[#252b3d] rounded-xl shadow-2xl p-1.5 z-50 space-y-1">
                  <div className="px-2 py-1 text-[10px] font-bold text-[#686f80] uppercase tracking-wider">
                    Select Active Model ({AVAILABLE_MODELS.length})
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
                    {AVAILABLE_MODELS.map((m) => (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => {
                          if (onModeChange) onModeChange(m.name);
                          setShowModelDropdown(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs flex flex-col gap-0.5 transition ${
                          currentModel.id === m.id
                            ? 'bg-cyan-950/60 border border-cyan-800/40 text-cyan-300'
                            : 'hover:bg-[#1e2332] text-slate-200'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-white text-[11px]">{m.name}</span>
                          <span className={`text-[9px] px-1.5 py-0.2 rounded font-semibold border ${m.bgBadge}`}>
                            {m.badge}
                          </span>
                        </div>
                        <span className="text-[10px] text-[#7d8495] line-clamp-1">{m.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

          {/* Conversation and Thinking Feed */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((msg) => (
              <div key={msg.id} className="space-y-3">
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="max-w-[85%] rounded-2xl bg-[#1e2433] border border-[#2b3348] p-3 text-xs text-white leading-relaxed">
                      {msg.content}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-2.5">
                    {/* Assistant Message Header */}
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 rounded bg-gradient-to-tr from-cyan-500 to-blue-500 text-black font-bold text-[9px] flex items-center justify-center">
                        CX
                      </div>
                      <span className="text-xs font-bold text-white">ChargoX Agent</span>
                      <span className="text-[10px] text-[#636875] font-mono">{msg.timestamp}</span>
                    </div>

                    {/* Agent Thinking & Tool Action Box */}
                    {msg.planSteps && msg.planSteps.length > 0 && (
                      <div className="bg-[#141720] border border-[#222736] rounded-xl p-3.5 space-y-2.5 shadow-inner">
                        <div className="text-[11px] font-semibold text-cyan-400 flex items-center gap-1.5 uppercase tracking-wider">
                          <Zap className="w-3 h-3" /> Agent Execution Plan
                        </div>
                        <div className="space-y-2">
                          {msg.planSteps.map((step, sIdx) => (
                            <div key={sIdx} className="flex items-start gap-2 text-xs">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                              <div className="flex-1 min-w-0">
                                <span className="font-semibold text-white">{step.action}</span>
                                <p className="text-[11px] text-[#868d9e] leading-snug">{step.detail}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Assistant Text Response (Accurate, clear answers for questions) */}
                    <div className="text-xs text-[#d1d5db] leading-relaxed bg-[#151821]/80 p-3 rounded-xl border border-[#1e222e] whitespace-pre-wrap selection:bg-cyan-500/30">
                      {msg.content}
                    </div>
                  </div>
                )}
              </div>
            ))}

            {isBuilding && (
              <LiveBuildProgress speedMode={localSpeedMode} appName={project.name} />
            )}
          </div>

          {/* Bottom Chat Prompt Input with Question Aids (Templates removed! Clean and unobstructed) */}
          <div className="p-3 border-t border-[#1c202a] bg-[#11131a] space-y-2">
            {/* AI Question & Task Aids Quick Bar */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[10px] scrollbar-none">
              <span className="text-[#686f80] font-semibold flex items-center gap-1 shrink-0">
                <Sparkles className="w-2.5 h-2.5 text-cyan-400" /> Aids:
              </span>
              {QUESTION_AIDS.map((aid) => {
                const isSelected = 
                  (aid.id === 'auto-smart-select' && (mode.includes('Auto') || !mode)) || 
                  mode.toLowerCase().includes(aid.label.toLowerCase()) || 
                  currentModel.id === aid.id;
                return (
                  <button
                    key={aid.id}
                    type="button"
                    onClick={() => {
                      const matched = AVAILABLE_MODELS.find(m => m.id === aid.id);
                      if (matched && onModeChange) onModeChange(matched.name);
                    }}
                    className={`px-2 py-0.5 rounded-md font-medium shrink-0 transition cursor-pointer border ${
                      isSelected 
                        ? 'bg-cyan-950 text-cyan-300 border-cyan-700/60 font-bold shadow-xs' 
                        : 'bg-[#151922] text-[#8e95a7] border-[#222838] hover:text-white hover:bg-[#1c2230]'
                    }`}
                    title={aid.description}
                  >
                    {aid.label}
                  </button>
                );
              })}
            </div>

            {/* Smart Auto Model Routing Feedback */}
            {inputPrompt.trim() && (mode.includes('Auto') || !mode) && (
              <div className="flex items-center gap-1.5 text-[9px] text-cyan-400 font-mono bg-cyan-950/40 px-2 py-0.5 rounded-md border border-cyan-800/30">
                <Cpu className="w-2.5 h-2.5 text-cyan-400 shrink-0" />
                <span className="truncate">Auto Routing: <strong>{autoResolution.modelName}</strong> ({autoResolution.badge})</span>
              </div>
            )}

            <form onSubmit={handleSend} className="relative">
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Ask a question or request a feature (e.g. 'How does scoring work?' or 'Add dark mode')..."
                disabled={isBuilding}
                className="w-full pl-3.5 pr-10 py-2.5 rounded-xl bg-[#090b0f] border border-[#222736] text-xs text-white placeholder-[#686e7c] focus:outline-none focus:border-cyan-500/60 transition"
              />
              <button
                type="submit"
                disabled={!inputPrompt.trim() || isBuilding}
                className={`absolute right-1.5 top-1.5 p-1.5 rounded-lg transition ${
                  inputPrompt.trim() && !isBuilding
                    ? 'bg-cyan-500 text-slate-950 font-bold hover:bg-cyan-400 cursor-pointer'
                    : 'text-[#4d5260] cursor-not-allowed'
                }`}
              >
                <SendHorizontal className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Live Token & Character Telemetry Meter in Chat Input */}
            <div className="flex items-center justify-between px-1 text-[10px] text-[#787f91]">
              <TokenMeter
                text={inputPrompt}
                compact={true}
                maxTokens={currentModel.maxInputTokens}
                maxChars={currentModel.maxInputChars}
              />
              <span className="font-mono text-[#5b6170]">
                {currentModel.name}
              </span>
            </div>
          </div>
        </div>

        {/* Right Pane: Live App / Code Files / Terminal */}
        <div 
          className={`flex-1 flex flex-col min-w-0 bg-[#08090c] h-full overflow-hidden ${
            mobilePane === 'chat' ? 'hidden lg:flex' : 'flex'
          }`}
        >
          {(mobilePane === 'preview' || (activeTab === 'preview' && mobilePane !== 'code' && mobilePane !== 'logs')) && (
            <LivePreviewFrame
              htmlContent={project.previewHtml}
              appName={project.name}
              isBuilding={isBuilding}
              deployment={project.deployment}
              onOpenDeploy={() => setIsDeployModalOpen(true)}
            />
          )}

          {(mobilePane === 'code' || activeTab === 'code') && mobilePane !== 'preview' && (
            <CodeExplorer
              files={project.files}
              previewHtml={project.previewHtml}
              appName={project.name}
              onUpdateFile={onUpdateFile}
            />
          )}

          {(mobilePane === 'logs' || activeTab === 'logs') && mobilePane !== 'preview' && (
            <AgentTerminal
              steps={project.planSteps}
              isBuilding={isBuilding}
              appName={project.name}
            />
          )}
        </div>
      </div>

      {/* 1-Click Auto-Deploy Modal */}
      <AutoDeployModal
        isOpen={isDeployModalOpen}
        onClose={() => setIsDeployModalOpen(false)}
        project={project}
        onUpdateDeployment={(dep) => {
          if (onUpdateDeployment) onUpdateDeployment(dep);
        }}
      />
    </div>
  );
};
