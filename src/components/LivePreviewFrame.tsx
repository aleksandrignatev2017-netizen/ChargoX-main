import React, { useState, useRef, useEffect } from 'react';
import { 
  RotateCw, 
  ExternalLink, 
  Monitor, 
  Tablet, 
  Smartphone, 
  Copy, 
  Check, 
  ShieldCheck, 
  Download, 
  Terminal, 
  ChevronUp, 
  ChevronDown, 
  Trash2,
  AlertTriangle,
  Info
} from 'lucide-react';
import { ViewportMode, AppDeployment } from '../types';
import { Rocket, Globe } from 'lucide-react';

interface LivePreviewFrameProps {
  htmlContent: string;
  appName: string;
  isBuilding: boolean;
  deployment?: AppDeployment;
  onOpenDeploy?: () => void;
}

interface ConsoleLog {
  type: 'log' | 'warn' | 'error' | 'info';
  message: string;
  timestamp: string;
}

export const LivePreviewFrame: React.FC<LivePreviewFrameProps> = ({
  htmlContent,
  appName,
  isBuilding,
  deployment,
  onOpenDeploy,
}) => {
  const [viewport, setViewport] = useState<ViewportMode>('desktop');
  const [refreshKey, setRefreshKey] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isConsoleOpen, setIsConsoleOpen] = useState(false);
  const [logs, setLogs] = useState<ConsoleLog[]>([
    { type: 'info', message: 'Iframe sandbox initialized with Tailwind CSS & Web APIs.', timestamp: '00:00:01' },
    { type: 'log', message: 'Application mounted successfully.', timestamp: '00:00:02' }
  ]);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Listen for logs sent from the child iframe
  useEffect(() => {
    const handleMessage = (e: MessageEvent) => {
      if (e.data && e.data.source === 'chargox-sandbox') {
        setLogs((prev) => [
          ...prev,
          {
            type: e.data.type || 'log',
            message: typeof e.data.data === 'string' ? e.data.data : JSON.stringify(e.data.data),
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
          }
        ]);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  // Inject console interceptor into htmlContent so logs bridge to parent
  const injectedHtml = React.useMemo(() => {
    const interceptorScript = `
    <script>
      (function() {
        const origLog = console.log;
        const origWarn = console.warn;
        const origErr = console.error;
        console.log = function(...args) {
          origLog.apply(console, args);
          try { window.parent.postMessage({ source: 'chargox-sandbox', type: 'log', data: args.join(' ') }, '*'); } catch(e){}
        };
        console.warn = function(...args) {
          origWarn.apply(console, args);
          try { window.parent.postMessage({ source: 'chargox-sandbox', type: 'warn', data: args.join(' ') }, '*'); } catch(e){}
        };
        console.error = function(...args) {
          origErr.apply(console, args);
          try { window.parent.postMessage({ source: 'chargox-sandbox', type: 'error', data: args.join(' ') }, '*'); } catch(e){}
        };
      })();
    </script>
    `;
    if (htmlContent.includes('<head>')) {
      return htmlContent.replace('<head>', `<head>${interceptorScript}`);
    }
    return interceptorScript + htmlContent;
  }, [htmlContent]);

  const getViewportDimensions = () => {
    switch (viewport) {
      case 'mobile':
        return 'w-[375px] h-[667px] shadow-2xl rounded-[2.5rem] border-[10px] border-slate-800 my-auto';
      case 'tablet':
        return 'w-[768px] h-[920px] max-h-full shadow-2xl rounded-2xl border-4 border-slate-800 my-auto';
      case 'desktop':
      default:
        return 'w-full h-full';
    }
  };

  const handleReload = () => {
    setRefreshKey((prev) => prev + 1);
    setLogs((prev) => [
      ...prev,
      { type: 'info', message: 'Preview reloaded by user.', timestamp: new Date().toLocaleTimeString() }
    ]);
  };

  const handlePopout = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    window.open(url, '_blank');
  };

  const handleDownloadHtml = () => {
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-chargox.html`;
    a.click();
  };

  const isPublished = deployment && deployment.status === 'published';
  const displayUrl = isPublished && deployment?.publicUrl
    ? deployment.publicUrl
    : typeof window !== 'undefined'
      ? `${window.location.origin}/app/${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`
      : `https://chargox.studio/app/${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`;

  const copyUrl = () => {
    navigator.clipboard.writeText(displayUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-full w-full bg-[#0a0c10] overflow-hidden select-none relative">
      {/* Top Browser Bar */}
      <div className="h-12 border-b border-[#1c202a] bg-[#12151c] px-4 flex items-center justify-between shrink-0 gap-3">
        {/* Navigation & Refresh */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 mr-2">
            <span className="w-3 h-3 rounded-full bg-rose-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-amber-500/80 inline-block"></span>
            <span className="w-3 h-3 rounded-full bg-emerald-500/80 inline-block"></span>
          </div>
          <button 
            onClick={handleReload}
            className="p-1.5 rounded-lg text-[#888d9a] hover:text-white hover:bg-[#1a1e28] transition"
            title="Reload preview"
          >
            <RotateCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Address Bar */}
        <div className="flex-1 max-w-lg mx-auto flex items-center justify-between px-3.5 py-1 rounded-lg bg-[#0a0c10] border border-[#202533] text-xs text-[#9aa0b0]">
          <div className="flex items-center gap-2 truncate">
            {isPublished ? (
              <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 animate-pulse"></span>
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            )}
            <span className="truncate font-mono text-[11px] text-[#c2c7d4]">
              {displayUrl}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            {onOpenDeploy && (
              <button
                onClick={onOpenDeploy}
                className={`text-[10px] font-bold px-2 py-0.5 rounded transition ${
                  isPublished 
                    ? 'bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900' 
                    : 'bg-cyan-950 text-cyan-300 border border-cyan-800 hover:bg-cyan-900'
                }`}
                title="Manage Live Deployment"
              >
                {isPublished ? 'Live' : 'Auto-Deploy'}
              </button>
            )}
            <button 
              onClick={copyUrl}
              className="p-1 rounded text-[#717684] hover:text-white transition" 
              title="Copy shareable link"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Viewport switchers & Popout & Download */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center bg-[#0a0c10] border border-[#202533] rounded-lg p-0.5">
            <button
              onClick={() => setViewport('desktop')}
              className={`p-1.5 rounded-md transition ${viewport === 'desktop' ? 'bg-[#1e2330] text-cyan-300' : 'text-[#717684] hover:text-white'}`}
              title="Desktop View"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('tablet')}
              className={`p-1.5 rounded-md transition ${viewport === 'tablet' ? 'bg-[#1e2330] text-cyan-300' : 'text-[#717684] hover:text-white'}`}
              title="Tablet View"
            >
              <Tablet className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewport('mobile')}
              className={`p-1.5 rounded-md transition ${viewport === 'mobile' ? 'bg-[#1e2330] text-cyan-300' : 'text-[#717684] hover:text-white'}`}
              title="Mobile View"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleDownloadHtml}
            className="p-1.5 rounded-lg text-[#888d9a] hover:text-white hover:bg-[#1a1e28] transition"
            title="Download Standalone HTML file"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={handlePopout}
            className="p-1.5 rounded-lg text-[#888d9a] hover:text-white hover:bg-[#1a1e28] transition"
            title="Open app in new browser window"
          >
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Frame Container */}
      <div className="flex-1 overflow-auto bg-[#08090d] flex items-center justify-center p-3 relative">
        {isBuilding && (
          <div className="absolute inset-0 bg-[#08090d]/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mb-4 animate-spin">
              <RotateCw className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold text-white mb-1">ChargoX Agent Building App...</h4>
            <p className="text-xs text-[#8c92a0] max-w-sm">
              Writing code, generating interactive components, and compiling dev preview.
            </p>
          </div>
        )}

        <div className={`transition-all duration-300 ${getViewportDimensions()} overflow-hidden bg-black flex flex-col`}>
          <iframe
            key={refreshKey}
            ref={iframeRef}
            srcDoc={injectedHtml}
            title={appName}
            sandbox="allow-scripts allow-modals allow-forms allow-same-origin allow-popups"
            className="w-full h-full border-none bg-black flex-1"
          />
        </div>
      </div>

      {/* Collapsible Console Drawer at Bottom */}
      <div className={`border-t border-[#1c202a] bg-[#0c0e14] transition-all duration-200 flex flex-col ${isConsoleOpen ? 'h-44' : 'h-8'}`}>
        <div 
          onClick={() => setIsConsoleOpen(!isConsoleOpen)}
          className="h-8 px-4 flex items-center justify-between cursor-pointer hover:bg-[#121620] text-xs text-[#7c8292]"
        >
          <div className="flex items-center gap-2 font-mono">
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span className="font-semibold text-slate-300">Sandbox Console</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-[#181d28] text-[#8e94a6]">
              {logs.length} events
            </span>
          </div>

          <div className="flex items-center gap-2">
            {isConsoleOpen && (
              <button 
                onClick={(e) => { e.stopPropagation(); setLogs([]); }}
                className="p-1 text-[#6a7080] hover:text-white"
                title="Clear console"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            )}
            {isConsoleOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </div>
        </div>

        {isConsoleOpen && (
          <div className="flex-1 overflow-y-auto p-3 font-mono text-[11px] space-y-1.5 bg-[#080a0e]">
            {logs.map((log, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-[#4e5464] shrink-0">{log.timestamp}</span>
                {log.type === 'error' && <span className="text-rose-400 font-bold shrink-0">[ERR]</span>}
                {log.type === 'warn' && <span className="text-amber-400 font-bold shrink-0">[WARN]</span>}
                {log.type === 'info' && <span className="text-cyan-400 font-bold shrink-0">[INFO]</span>}
                {log.type === 'log' && <span className="text-emerald-400 font-bold shrink-0">[LOG]</span>}
                <span className={`break-all ${
                  log.type === 'error' ? 'text-rose-300' :
                  log.type === 'warn' ? 'text-amber-300' :
                  log.type === 'info' ? 'text-cyan-300' : 'text-slate-300'
                }`}>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
