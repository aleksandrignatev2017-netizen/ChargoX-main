import React, { useEffect, useRef, useState } from 'react';

type Tab = 'claude' | 'terminal' | 'browser';
type Line = { kind: 'user' | 'assistant' | 'tool' | 'raw' | 'error'; text: string };
type Status = { enabled: boolean; claude?: boolean; claudeVersion?: string; ollama?: boolean; workspace?: string } | null;

const LS = 'chargox-code-settings';
const defaults = { model: 'qwen3-coder', ollamaUrl: 'http://localhost:11434', useOllama: true };

async function streamRun(body: object, onEvent: (type: string, data: any) => void, signal: AbortSignal) {
  const res = await fetch('/api/local/run', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-ChargoX-Local': '1' },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok || !res.body) {
    let msg = 'Request failed.';
    try { msg = (await res.json()).error || msg; } catch {}
    onEvent('stderr', msg + '\n');
    return;
  }
  const reader = res.body.getReader();
  const dec = new TextDecoder();
  let buf = '';
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buf += dec.decode(value, { stream: true });
    const parts = buf.split('\n\n');
    buf = parts.pop() || '';
    for (const p of parts) {
      if (!p.startsWith('data: ')) continue;
      try { const ev = JSON.parse(p.slice(6)); onEvent(ev.type, ev.data); } catch {}
    }
  }
}

function normalizeUrl(v: string) {
  const t = v.trim();
  if (!t) return '';
  if (/^https?:\/\//i.test(t) || t.startsWith('/')) return t;
  if (/^(localhost|127\.0\.0\.1)/i.test(t)) return 'http://' + t;
  return 'https://' + t;
}

export const ClaudeCodePanel: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const [tab, setTab] = useState<Tab>('claude');
  const [status, setStatus] = useState<Status>(null);
  const [cfg, setCfg] = useState(() => {
    try { return { ...defaults, ...JSON.parse(localStorage.getItem(LS) || '{}') }; } catch { return defaults; }
  });
  const [cwd, setCwd] = useState('');
  const [busy, setBusy] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  // Claude tab
  const [lines, setLines] = useState<Line[]>([]);
  const [prompt, setPrompt] = useState('');
  const [started, setStarted] = useState(false);
  const claudeBuf = useRef('');
  // Terminal tab
  const [termOut, setTermOut] = useState('');
  const [cmd, setCmd] = useState('');
  // Browser tab
  const [hist, setHist] = useState<string[]>(['/workspace-preview/']);
  const [idx, setIdx] = useState(0);
  const [urlInput, setUrlInput] = useState('/workspace-preview/');
  const [frameKey, setFrameKey] = useState(0);

  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { try { localStorage.setItem(LS, JSON.stringify(cfg)); } catch {} }, [cfg]);
  useEffect(() => { endRef.current?.scrollIntoView({ block: 'end' }); }, [lines, termOut, tab]);

  const refreshStatus = () => {
    fetch('/api/local/status?ollamaUrl=' + encodeURIComponent(cfg.ollamaUrl))
      .then((r) => r.json()).then(setStatus).catch(() => setStatus({ enabled: false }));
  };
  useEffect(() => { if (isOpen) refreshStatus(); /* eslint-disable-next-line */ }, [isOpen]);

  if (!isOpen) return null;

  const push = (l: Line) => setLines((p) => [...p, l]);

  const handleClaudeLine = (raw: string) => {
    if (!raw.trim()) return;
    let j: any;
    try { j = JSON.parse(raw); } catch { push({ kind: 'raw', text: raw }); return; }
    if (j.type === 'assistant' && Array.isArray(j.message?.content)) {
      for (const b of j.message.content) {
        if (b.type === 'text' && b.text) push({ kind: 'assistant', text: b.text });
        else if (b.type === 'tool_use') {
          const i = b.input || {};
          const brief = i.command || i.file_path || i.pattern || i.path || JSON.stringify(i).slice(0, 120);
          push({ kind: 'tool', text: `${b.name}: ${brief}` });
        }
      }
    } else if (j.type === 'result' && j.is_error) {
      push({ kind: 'error', text: String(j.result || 'Claude Code reported an error.') });
    }
  };

  const stop = () => { abortRef.current?.abort(); setBusy(false); };

  const sendClaude = async () => {
    const text = prompt.trim();
    if (!text || busy) return;
    setPrompt('');
    push({ kind: 'user', text });
    setBusy(true);
    claudeBuf.current = '';
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      await streamRun({ mode: 'claude', input: text, cwd, model: cfg.model, ollamaUrl: cfg.ollamaUrl, useOllama: cfg.useOllama, cont: started }, (type, data) => {
        if (type === 'cwd') setCwd(data);
        else if (type === 'stdout') {
          claudeBuf.current += data;
          const ls = claudeBuf.current.split('\n');
          claudeBuf.current = ls.pop() || '';
          ls.forEach(handleClaudeLine);
        } else if (type === 'stderr' && String(data).trim()) push({ kind: 'error', text: String(data).trim() });
      }, ac.signal);
      if (claudeBuf.current) handleClaudeLine(claudeBuf.current);
      setStarted(true);
    } catch {}
    setBusy(false);
  };

  const runShell = async (command: string, echo = true) => {
    if (!command.trim() || busy) return;
    setBusy(true);
    if (echo) setTermOut((o) => o + `\n${cwd || ''}> ${command}\n`);
    const ac = new AbortController();
    abortRef.current = ac;
    try {
      await streamRun({ mode: 'shell', input: command, cwd }, (type, data) => {
        if (type === 'cwd') setCwd(data);
        else if (type === 'stdout' || type === 'stderr') setTermOut((o) => o + data);
      }, ac.signal);
    } catch {}
    setBusy(false);
  };

  const installClaude = async () => {
    setTab('terminal');
    await runShell('npm install -g @anthropic-ai/claude-code');
    refreshStatus();
  };

  const go = (u: string) => {
    const n = normalizeUrl(u);
    if (!n) return;
    const h = [...hist.slice(0, idx + 1), n];
    setHist(h); setIdx(h.length - 1); setUrlInput(n); setFrameKey((k) => k + 1);
  };
  const step = (d: number) => {
    const n = idx + d;
    if (n < 0 || n >= hist.length) return;
    setIdx(n); setUrlInput(hist[n]); setFrameKey((k) => k + 1);
  };

  const input = 'rounded-lg bg-[#0b0d12] border border-[#232836] px-3 py-2 text-sm text-slate-200 outline-none focus:border-cyan-500';
  const tabBtn = (t: Tab, label: string) => (
    <button key={t} onClick={() => setTab(t)}
      className={`px-4 py-2 text-sm font-semibold rounded-lg ${tab === t ? 'bg-cyan-500 text-black' : 'text-slate-300 hover:bg-[#1a1f2b]'}`}>{label}</button>
  );

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#0b0d12] text-slate-200" style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      <div className="flex items-center gap-2 border-b border-[#202534] bg-[#12151c] px-3 py-2">
        <span className="font-bold text-white pr-2">&gt;_ Claude Code</span>
        {tabBtn('claude', 'Claude Code')}
        {tabBtn('terminal', 'Terminal')}
        {tabBtn('browser', 'Browser')}
        <div className="flex-1" />
        <button onClick={onClose} className="rounded-lg px-3 py-2 text-sm text-slate-300 hover:bg-[#1a1f2b]">Close</button>
      </div>

      {status && !status.enabled && tab !== 'browser' ? (
        <div className="m-6 max-w-xl rounded-xl border border-amber-500/40 bg-amber-500/10 p-5 text-sm">
          <b className="text-amber-300">Claude Code needs ChargoX on your own computer.</b>
          <p className="mt-2 text-slate-300">It edits files and runs commands on the machine that hosts ChargoX, so it is switched off on the online version for everyone's safety. Run ChargoX on your computer (double-click <code>start-chargox</code>) and open it at localhost:3000.</p>
        </div>
      ) : tab === 'claude' ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <div className="flex flex-wrap items-center gap-2 border-b border-[#202534] px-3 py-2 text-xs">
            <label className="flex items-center gap-1"><input type="checkbox" checked={cfg.useOllama} onChange={(e) => setCfg({ ...cfg, useOllama: e.target.checked })} /> Use Ollama</label>
            <input className={input + ' w-44'} value={cfg.model} onChange={(e) => setCfg({ ...cfg, model: e.target.value })} placeholder="model, e.g. qwen3-coder" aria-label="Model" />
            <input className={input + ' w-52'} value={cfg.ollamaUrl} onChange={(e) => setCfg({ ...cfg, ollamaUrl: e.target.value })} placeholder="Ollama address" aria-label="Ollama address" />
            <span className={status?.claude ? 'text-emerald-400' : 'text-rose-400'}>Claude Code {status?.claude ? '✓ ' + (status.claudeVersion || '') : '✗ not installed'}</span>
            <span className={status?.ollama ? 'text-emerald-400' : 'text-rose-400'}>Ollama {status?.ollama ? '✓ running' : '✗ not reachable'}</span>
            {status && !status.claude && <button onClick={installClaude} className="rounded-lg bg-cyan-500 px-3 py-1.5 font-bold text-black">Install Claude Code</button>}
            <button onClick={refreshStatus} className="rounded-lg border border-[#232836] px-2 py-1.5">Recheck</button>
            <button onClick={() => { setLines([]); setStarted(false); }} className="rounded-lg border border-[#232836] px-2 py-1.5">New chat</button>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto p-4 text-sm">
            {lines.length === 0 && <p className="text-slate-400">Describe what to build or change. Claude Code works in <code>{cwd || status?.workspace || 'the workspace folder'}</code> and can read, write and run things there. Open the Browser tab to preview the result.</p>}
            {lines.map((l, i) => (
              <div key={i} className={
                l.kind === 'user' ? 'ml-auto max-w-[85%] rounded-xl bg-cyan-500/15 border border-cyan-500/30 px-3 py-2 whitespace-pre-wrap' :
                l.kind === 'assistant' ? 'max-w-[90%] whitespace-pre-wrap' :
                l.kind === 'tool' ? 'font-mono text-xs text-violet-300' :
                l.kind === 'error' ? 'rounded-lg border border-rose-500/40 bg-rose-500/10 px-3 py-2 text-rose-200 whitespace-pre-wrap' :
                'font-mono text-xs text-slate-500 whitespace-pre-wrap'}>{l.text}</div>
            ))}
            {busy && <div className="text-xs text-cyan-300">Working…</div>}
            <div ref={endRef} />
          </div>
          <div className="flex gap-2 border-t border-[#202534] p-3">
            <textarea className={input + ' flex-1 resize-none'} rows={2} value={prompt} placeholder="Ask Claude Code to build something…"
              onChange={(e) => setPrompt(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendClaude(); } }} />
            {busy ? <button onClick={stop} className="rounded-lg bg-rose-500 px-5 font-bold text-white">Stop</button>
              : <button onClick={sendClaude} className="rounded-lg bg-cyan-500 px-5 font-bold text-black">Send</button>}
          </div>
        </div>
      ) : tab === 'terminal' ? (
        <div className="flex min-h-0 flex-1 flex-col">
          <pre className="flex-1 overflow-auto whitespace-pre-wrap p-4 font-mono text-xs text-slate-200">{termOut || 'Run a command below. Interactive programs are not supported here.'}<div ref={endRef} /></pre>
          <form className="flex gap-2 border-t border-[#202534] p-3" onSubmit={(e) => { e.preventDefault(); const c = cmd; setCmd(''); runShell(c); }}>
            <span className="max-w-[40%] self-center truncate font-mono text-xs text-cyan-300" title={cwd}>{cwd || 'workspace'}&gt;</span>
            <input className={input + ' flex-1 font-mono'} value={cmd} onChange={(e) => setCmd(e.target.value)} placeholder="command, e.g. npm install" autoCapitalize="off" autoCorrect="off" />
            {busy ? <button type="button" onClick={stop} className="rounded-lg bg-rose-500 px-4 font-bold text-white">Stop</button>
              : <button className="rounded-lg bg-cyan-500 px-4 font-bold text-black">Run</button>}
          </form>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 flex-col">
          <form className="flex items-center gap-2 border-b border-[#202534] p-2" onSubmit={(e) => { e.preventDefault(); go(urlInput); }}>
            <button type="button" onClick={() => step(-1)} disabled={idx === 0} className="rounded-lg px-3 py-2 disabled:opacity-30" aria-label="Back">←</button>
            <button type="button" onClick={() => step(1)} disabled={idx >= hist.length - 1} className="rounded-lg px-3 py-2 disabled:opacity-30" aria-label="Forward">→</button>
            <button type="button" onClick={() => setFrameKey((k) => k + 1)} className="rounded-lg px-3 py-2" aria-label="Reload">⟳</button>
            <input className={input + ' flex-1'} value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="Address, e.g. localhost:5173" />
            <button type="button" onClick={() => go('/workspace-preview/')} className="rounded-lg border border-[#232836] px-3 py-2 text-xs">Workspace</button>
            <a href={hist[idx]} target="_blank" rel="noreferrer" className="rounded-lg border border-[#232836] px-3 py-2 text-xs">Open in tab</a>
          </form>
          <iframe key={frameKey} src={hist[idx]} title="ChargoX browser" className="min-h-0 flex-1 bg-white" sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-modals" />
          <p className="border-t border-[#202534] px-3 py-1 text-[11px] text-slate-500">Some websites refuse to open inside other apps. Use Open in tab for those. Your own apps on localhost work.</p>
        </div>
      )}
    </div>
  );
};
