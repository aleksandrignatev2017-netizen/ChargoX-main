import React, { useState } from 'react';
import { 
  Sparkles, 
  Plus, 
  LayoutGrid, 
  History, 
  SlidersHorizontal, 
  Settings, 
  Search, 
  Bell, 
  Key, 
  ChevronRight, 
  ChevronDown, 
  Mic, 
  ArrowRight, 
  Smartphone, 
  Layers, 
  ExternalLink,
  Zap,
  Code2,
  Github,
  Globe,
  Trash2,
  Menu,
  X,
  Cpu,
  Monitor
} from 'lucide-react';
import { AppProject } from '../types';
import { PWAInstallButton } from './PWAInstallButton';
import { TokenMeter } from './TokenMeter';
import { SpeedModeSlider, SpeedMode } from './SpeedModeSlider';
import { AVAILABLE_MODELS, getModelById, resolveAutoModel } from '../data/models';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

interface HomeScreenProps {
  onStartBuild: (prompt: string, preset?: AppProject, mode?: string, speedMode?: SpeedMode) => void;
  onOpenSettings: () => void;
  onOpenGallery: () => void;
  onOpenGitHubModal?: () => void;
  onOpenDownloadWebsite?: () => void;
  onDeleteApp?: (appId: string) => void;
  myApps: AppProject[];
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onStartBuild,
  onOpenSettings,
  onOpenGallery,
  onOpenGitHubModal,
  onOpenDownloadWebsite,
  onDeleteApp,
  myApps,
}) => {
  const device = useDeviceDetection();
  const [prompt, setPrompt] = useState('');
  const [speedMode, setSpeedMode] = useState<SpeedMode>('auto');
  // Auto mode is default as requested!
  const [selectedModelId, setSelectedModelId] = useState<string>('auto-smart-select');
  const [showModeDropdown, setShowModeDropdown] = useState(false);
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [activeTab, setActiveTab] = useState<'new_app' | 'my_apps'>('new_app');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [appsSearch, setAppsSearch] = useState('');
  const [appsFilter, setAppsFilter] = useState<'all' | 'published'>('all');

  const selectedModel = getModelById(selectedModelId);
  const autoResolution = resolveAutoModel(prompt);

  const handleEnhancePrompt = async () => {
    if (!prompt.trim() || isEnhancing) return;
    setIsEnhancing(true);
    try {
      const res = await fetch('/api/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, deviceInfo: device }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
      console.error('Enhance error:', e);
    } finally {
      setIsEnhancing(false);
    }
  };

  const toggleVoice = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      if (isRecording) {
        setIsRecording(false);
        return;
      }
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setPrompt((prev) => (prev ? `${prev} ${transcript}` : transcript));
          setIsRecording(false);
        };
        recognition.onerror = () => setIsRecording(false);
        recognition.onend = () => setIsRecording(false);
        recognition.start();
        return;
      } catch (err) {
        console.warn('SpeechRecognition error:', err);
      }
    }

    // Fallback simulation
    setIsRecording(!isRecording);
    if (!isRecording) {
      setTimeout(() => {
        setPrompt((prev) => prev ? prev + ' with responsive mobile touch controls and sound effects' : 'Build a touch-friendly interactive mobile app');
        setIsRecording(false);
      }, 1500);
    }
  };

  const handleSpeedModeChange = (sm: SpeedMode) => {
    setSpeedMode(sm);
    if (sm === 'fast') {
      setSelectedModelId('gemini-3.1-flash-lite');
    } else if (sm === 'auto') {
      setSelectedModelId('auto-smart-select');
    } else if (sm === 'max') {
      setSelectedModelId('gemini-4-argon');
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!prompt.trim()) return;
    
    // If in Auto mode, resolve to the ideal model
    const effectiveMode = selectedModelId === 'auto-smart-select'
      ? autoResolution.modelName
      : selectedModel.name;

    onStartBuild(prompt.trim(), undefined, effectiveMode, speedMode);
  };

  // Filtered Apps for "My Apps"
  const filteredApps = myApps.filter((app) => {
    const matchesSearch = 
      app.name.toLowerCase().includes(appsSearch.toLowerCase()) ||
      app.summary.toLowerCase().includes(appsSearch.toLowerCase()) ||
      app.prompt.toLowerCase().includes(appsSearch.toLowerCase());
    
    if (appsFilter === 'published') {
      return matchesSearch && app.deployment?.status === 'published';
    }
    return matchesSearch;
  });

  return (
    <div className="flex h-screen w-screen bg-[#0d0f12] text-[#e3e3e3] select-none overflow-hidden relative font-sans">
      {/* Mobile Drawer Backdrop */}
      {isMobileMenuOpen && (
        <div 
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-xs z-40 lg:hidden transition-opacity"
        />
      )}

      {/* Sidebar: Responsive Drawer on mobile, static on desktop */}
      <aside 
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-[#111318] border-r border-[#1f2228] flex flex-col justify-between shrink-0 h-full transition-transform duration-200 lg:static lg:w-64 lg:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0 shadow-2xl shadow-cyan-500/10' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* Brand header */}
          <div className="p-4 flex items-center justify-between border-b border-[#1f2228]">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-tr from-cyan-500 via-blue-500 to-fuchsia-500 flex items-center justify-center shadow-md shadow-blue-500/20 font-black text-black text-xs">
                CX
              </div>
              <span className="font-bold text-sm tracking-wide text-white flex items-center gap-1.5">
                ChargoX <span className="text-[10px] text-cyan-400 font-semibold px-1.5 py-0.2 rounded bg-cyan-950/60 border border-cyan-800/40">Studio</span>
              </span>
            </div>
            {/* Mobile close button */}
            <button 
              onClick={() => setIsMobileMenuOpen(false)}
              className="lg:hidden text-[#888c94] hover:text-white p-1 rounded-lg hover:bg-[#1a1d24]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
            {/* Build Section */}
            <div>
              <div className="text-[11px] font-semibold text-[#666a73] uppercase tracking-wider px-3 mb-1.5">
                Workspace
              </div>
              <div className="space-y-1">
                <button 
                  onClick={() => { setActiveTab('new_app'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    activeTab === 'new_app' 
                      ? 'bg-gradient-to-r from-cyan-950/80 to-[#182030] text-cyan-300 border border-cyan-500/30 shadow-sm' 
                      : 'text-[#a3a7b0] hover:text-white hover:bg-[#1a1d24]'
                  }`}
                >
                  <Plus className="w-4 h-4 text-cyan-400" />
                  <span>Create New App</span>
                </button>
                <button 
                  onClick={() => { setActiveTab('my_apps'); setIsMobileMenuOpen(false); }}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition text-left cursor-pointer ${
                    activeTab === 'my_apps' 
                      ? 'bg-gradient-to-r from-cyan-950/80 to-[#182030] text-cyan-300 border border-cyan-500/30 shadow-sm' 
                      : 'text-[#a3a7b0] hover:text-white hover:bg-[#1a1d24]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutGrid className="w-4 h-4 text-[#888c94]" />
                    <span>My Applications</span>
                  </div>
                  {myApps.length > 0 && (
                    <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono">
                      {myApps.length}
                    </span>
                  )}
                </button>
              </div>
            </div>

            {/* Device Info Card in Sidebar */}
            <div className="p-3 rounded-xl bg-[#141720] border border-[#232838] space-y-2">
              <div className="flex items-center justify-between text-[11px] font-semibold text-white">
                <span className="flex items-center gap-1.5 text-cyan-400">
                  {device.isMobile ? <Smartphone className="w-3.5 h-3.5" /> : <Monitor className="w-3.5 h-3.5" />}
                  {device.isMobile ? 'Mobile Optimized' : 'Desktop Station'}
                </span>
                <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-400 border border-emerald-800/40">
                  Auto Active
                </span>
              </div>
              <p className="text-[10px] text-[#868d9e] leading-relaxed">
                {device.isMobile 
                  ? 'Auto-configured for touch interactions, high-speed mobile generation, and safe-area insets.'
                  : 'Full multi-pane editor with side-by-side terminal & live browser emulator.'}
              </p>
              <div className="pt-1 border-t border-[#1e2330] flex items-center justify-between text-[9px] font-mono text-[#666d80]">
                <span>{device.os} • {device.width}x{device.height}</span>
                <span className="text-cyan-400">{device.hasTouch ? 'Touch On' : 'Mouse'}</span>
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-1">
              {onOpenGitHubModal && (
                <button 
                  onClick={() => { onOpenGitHubModal(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#a3a7b0] hover:text-white hover:bg-[#1a1d24] transition text-left cursor-pointer"
                >
                  <Github className="w-4 h-4 text-white" />
                  <span>Import GitHub / ZIP</span>
                </button>
              )}
              {onOpenDownloadWebsite && (
                <button 
                  onClick={() => { onOpenDownloadWebsite(); setIsMobileMenuOpen(false); }}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-[#a3a7b0] hover:text-white hover:bg-[#1a1d24] transition text-left cursor-pointer"
                >
                  <Globe className="w-4 h-4 text-cyan-400" />
                  <span>Download App Hub</span>
                </button>
              )}
            </div>
          </div>

          {/* Bottom Settings Row */}
          <div className="border-t border-[#1f2228] p-3 flex items-center justify-between text-[#888c94]">
            <button 
              onClick={() => { onOpenSettings(); setIsMobileMenuOpen(false); }}
              className="p-2 hover:text-white hover:bg-[#1a1d24] rounded-lg transition flex items-center gap-2 text-xs"
              title="Settings"
            >
              <Settings className="w-4 h-4 text-cyan-400" />
              <span>Settings</span>
            </button>
            <PWAInstallButton variant="button" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-y-auto relative bg-[#0d0f12]">
        {/* Top Navbar */}
        <header className="h-14 flex items-center justify-between px-4 sm:px-6 shrink-0 border-b border-[#171a22] bg-[#0d0f14]/80 backdrop-blur-md sticky top-0 z-30">
          <div className="flex items-center gap-2">
            {/* Mobile Hamburger Drawer Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl bg-[#161a22] text-[#8e94a4] hover:text-white border border-[#242938]"
              title="Open Navigation Menu"
            >
              <Menu className="w-4 h-4" />
            </button>

            {/* Mobile Device Auto-Detection Status Badge */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#141822] border border-[#232938] text-[11px] text-[#9ea4b4]">
              {device.isMobile ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="font-semibold text-white">Mobile Mode</span>
                  <span className="text-[9px] px-1.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/40 hidden sm:inline">
                    Touch Active
                  </span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  <span className="font-semibold text-white">Desktop Mode</span>
                </>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {onOpenDownloadWebsite && (
              <button
                onClick={onOpenDownloadWebsite}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#161a24] hover:bg-[#202636] border border-[#262c3e] text-xs font-semibold text-cyan-300 transition"
              >
                <Globe className="w-3.5 h-3.5" />
                <span>Download App</span>
              </button>
            )}

            <PWAInstallButton variant="button" />

            <button 
              onClick={onOpenSettings}
              className="p-2 rounded-xl text-[#888c94] hover:text-white hover:bg-[#171a21] transition"
              title="Settings"
            >
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* View Switcher: My Apps vs New App */}
        {activeTab === 'my_apps' ? (
          <div className="flex-1 flex flex-col px-4 sm:px-8 py-6 max-w-5xl mx-auto w-full">
            <div className="flex items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
                  <span>My Applications</span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40 font-mono">
                    {myApps.length}
                  </span>
                </h1>
                <p className="text-xs text-[#828898] mt-1">Open in live editor or delete applications.</p>
              </div>

              <button
                onClick={() => setActiveTab('new_app')}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-bold text-xs shadow-md shadow-cyan-500/20 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New App</span>
              </button>
            </div>

            {/* Search Input */}
            <div className="relative mb-6">
              <Search className="w-4 h-4 text-[#6d7384] absolute left-3.5 top-3" />
              <input
                type="text"
                value={appsSearch}
                onChange={(e) => setAppsSearch(e.target.value)}
                placeholder="Search your applications..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#13161c] border border-[#212530] text-xs text-white placeholder-[#686e7c] focus:outline-none focus:border-cyan-500/60 transition"
              />
            </div>

            {/* Apps Grid */}
            {filteredApps.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredApps.map((app) => (
                  <div
                    key={app.id}
                    className="group relative bg-[#13161c] hover:bg-[#171b23] border border-[#212530] hover:border-cyan-500/40 rounded-2xl p-4 sm:p-5 transition-all duration-200 shadow-sm flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center font-bold text-xs">
                          CX
                        </div>
                        <div className="flex items-center gap-2">
                          {app.deployment?.status === 'published' ? (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center gap-1">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                              Live
                            </span>
                          ) : (
                            <span className="text-[10px] text-[#717684] font-mono">{app.createdAt}</span>
                          )}

                          {/* Delete App Button ("delete this") */}
                          {onDeleteApp && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                if (window.confirm(`Delete "${app.name}" permanently?`)) {
                                  onDeleteApp(app.id);
                                }
                              }}
                              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/60 border border-rose-900/40 transition cursor-pointer"
                              title="Delete this app"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition mb-1">
                        {app.name}
                      </h3>
                      <p className="text-xs text-[#8c92a0] line-clamp-2 leading-relaxed mb-4">
                        {app.summary}
                      </p>
                    </div>

                    <div className="pt-3 border-t border-[#1e222c] flex items-center justify-between text-xs">
                      <button
                        onClick={() => onStartBuild(app.prompt, app)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 font-semibold text-xs border border-cyan-500/30 transition flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <Code2 className="w-3.5 h-3.5" />
                        <span>Open in Studio</span>
                      </button>

                      {app.deployment?.status === 'published' && app.deployment.publicUrl && (
                        <a
                          href={app.deployment.publicUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 p-1.5 rounded-lg bg-[#1a1e28] hover:bg-[#222836] text-emerald-400 border border-emerald-500/30 transition flex items-center justify-center"
                          title="Open Live Web App"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-10 text-center rounded-2xl bg-[#12151c] border border-[#202534] space-y-3">
                <p className="text-sm font-semibold text-white">No applications found</p>
                <p className="text-xs text-[#7d8495]">Type your prompt in "Create New App" to build one.</p>
                <button
                  onClick={() => setActiveTab('new_app')}
                  className="mt-2 px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs"
                >
                  Create New App
                </button>
              </div>
            )}
          </div>
        ) : (
          /* Central Creation Station (Clean, distraction-free, no intrusive templates) */
          <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 max-w-4xl mx-auto w-full py-6">
            {/* Device-Specific Status Pill */}
            {device.isMobile && (
              <div className="w-full max-w-xl mx-auto mb-4 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-950/60 via-[#131b2c] to-blue-950/60 border border-cyan-500/30 flex items-center justify-between text-xs text-cyan-200 shadow-sm animate-in fade-in">
                <div className="flex items-center gap-2">
                  <span className="p-1 rounded-md bg-cyan-500/20 text-cyan-300">📱</span>
                  <div>
                    <span className="font-bold text-white">Mobile Device Detected</span>
                    <span className="text-[11px] text-[#8fa0ba] ml-1.5 hidden sm:inline">Auto-tuning for touch and sub-second speed</span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded-full bg-cyan-900/60 text-cyan-300 border border-cyan-700/40">
                  Touch Ready
                </span>
              </div>
            )}

            {/* Main Title */}
            <h1 className="text-2xl sm:text-4xl md:text-5xl font-extrabold text-white text-center mb-2 tracking-tight">
              Build your ideas with <span className="bg-gradient-to-r from-white via-cyan-200 to-blue-400 bg-clip-text text-transparent">ChargoX</span>
            </h1>
            <p className="text-xs sm:text-sm text-[#7e8596] text-center mb-4">
              Just describe what you want. ChargoX codes, compiles, and runs live interactive web apps.
            </p>

            {/* Swipeable Mode Slider: Fast — Auto — Max */}
            <div className="w-full max-w-md mx-auto mb-4">
              <SpeedModeSlider
                value={speedMode}
                onChange={handleSpeedModeChange}
              />
            </div>

            {/* The Radiant Prompt Box */}
            <div className="w-full ai-glow-border ai-glow-ambient p-1 transition-all duration-300">
              <div className="bg-[#13161c] rounded-[1.2rem] p-4 flex flex-col min-h-[140px] justify-between">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSubmit();
                    }
                  }}
                  placeholder="Describe what you want to build (an app, game, dashboard, portfolio, or interactive tool)..."
                  rows={device.isMobile ? 4 : 3}
                  className="w-full bg-transparent resize-none text-sm sm:text-base text-white placeholder-[#686d77] focus:outline-none leading-relaxed"
                />

                {/* Bottom bar of prompt box */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between pt-3 mt-2 border-t border-[#1d212b] gap-2.5">
                  {/* Left tools: Improve + Token Meter */}
                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Magic Enhance Prompt Button */}
                    <button
                      type="button"
                      onClick={handleEnhancePrompt}
                      disabled={isEnhancing || !prompt.trim()}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition border ${
                        isEnhancing 
                          ? 'bg-cyan-950 text-cyan-300 border-cyan-800 animate-pulse'
                          : 'bg-[#181c26] text-cyan-400 border-cyan-500/20 hover:bg-[#202636] hover:border-cyan-500/40 cursor-pointer'
                      }`}
                      title="AI Magic Prompt Enhancer"
                    >
                      <Sparkles className={`w-3.5 h-3.5 ${isEnhancing ? 'animate-spin' : ''}`} />
                      <span className="text-[11px] font-semibold">{isEnhancing ? 'Improving...' : 'Improve'}</span>
                    </button>

                    {/* Live Token & Character Telemetry Meter */}
                    <TokenMeter
                      text={prompt}
                      compact={true}
                      maxTokens={selectedModel.maxInputTokens}
                      maxChars={selectedModel.maxInputChars}
                    />
                  </div>

                  {/* Right controls: Model selector + Mic + Submit */}
                  <div className="flex items-center justify-between sm:justify-end gap-2 relative">
                    {/* Model selector dropdown (Featuring Auto option!) */}
                    <div className="relative">
                      <button
                        type="button"
                        onClick={() => setShowModeDropdown(!showModeDropdown)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#1b1f28] hover:bg-[#232835] text-xs font-medium text-[#c0c4cf] border border-[#282d3b] transition cursor-pointer"
                      >
                        <span className="truncate max-w-[130px] sm:max-w-none">{selectedModel.name}</span>
                        <ChevronDown className="w-3.5 h-3.5 text-[#888c94] shrink-0" />
                      </button>

                      {showModeDropdown && (
                        <div className="absolute bottom-full right-0 mb-2 w-72 sm:w-80 bg-[#161a24] border border-[#272d3e] rounded-2xl shadow-2xl overflow-hidden z-40 p-1.5 space-y-1">
                          <div className="px-2 py-1 text-[10px] font-bold text-[#686f80] uppercase tracking-wider flex items-center justify-between">
                            <span>Select AI Model ({AVAILABLE_MODELS.length})</span>
                            <span className="text-cyan-400 font-mono">Smart Auto Ready</span>
                          </div>

                          <div className="max-h-72 overflow-y-auto space-y-1 pr-1">
                            {AVAILABLE_MODELS.map((m) => (
                              <button
                                key={m.id}
                                type="button"
                                onClick={() => {
                                  setSelectedModelId(m.id);
                                  setShowModeDropdown(false);
                                }}
                                className={`w-full text-left p-2 rounded-xl text-xs flex flex-col gap-0.5 transition ${
                                  selectedModelId === m.id
                                    ? 'bg-cyan-950/80 border border-cyan-800/60 text-cyan-300'
                                    : 'hover:bg-[#202636] text-slate-200'
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <span className="font-bold text-white flex items-center gap-1.5">
                                    {m.id === 'auto-smart-select' && <Sparkles className="w-3 h-3 text-amber-400" />}
                                    {m.name}
                                  </span>
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

                    {/* Microphone voice button */}
                    <button
                      type="button"
                      onClick={toggleVoice}
                      className={`p-2.5 rounded-xl transition ${
                        isRecording 
                          ? 'bg-rose-500 text-white animate-pulse shadow-lg shadow-rose-500/50' 
                          : 'text-[#888c94] hover:text-white bg-[#1b1f28] hover:bg-[#232835]'
                      }`}
                      title={isRecording ? 'Listening... click to stop' : 'Voice input'}
                    >
                      <Mic className="w-4 h-4" />
                    </button>

                    {/* Submit Button */}
                    <button
                      type="button"
                      onClick={() => handleSubmit()}
                      disabled={!prompt.trim()}
                      className={`h-9 px-4 rounded-xl flex items-center justify-center gap-1.5 text-xs font-bold transition shadow-md ${
                        prompt.trim()
                          ? 'bg-white hover:bg-slate-200 text-black cursor-pointer'
                          : 'bg-[#222631] text-[#555a64] cursor-not-allowed'
                      }`}
                      title="Build with ChargoX"
                    >
                      <span>Build</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Auto Routing preview pill when prompt is typed in Auto mode */}
            {selectedModelId === 'auto-smart-select' && prompt.trim().length > 3 && (
              <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#121622] border border-cyan-500/30 text-[11px] text-[#a0a8be] animate-in fade-in">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"></span>
                <span>Auto-Router will use:</span>
                <span className="font-semibold text-cyan-300">{autoResolution.modelName}</span>
                <span className="text-[9px] px-1.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800/40">
                  {autoResolution.badge}
                </span>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
