import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import express, { Express, Request, Response, NextFunction } from 'express';

// Local-only agent: runs Claude Code and shell commands on the computer that runs ChargoX.
// It refuses every request that does not come from this same computer.
export const WORKSPACE = path.resolve(process.cwd(), 'workspace');

function isLocal(req: Request): boolean {
  const ip = req.socket.remoteAddress || '';
  const loopback = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1';
  const host = (req.headers.host || '').replace(/:\d+$/, '');
  return loopback && ['localhost', '127.0.0.1', '[::1]'].includes(host);
}

function guard(req: Request, res: Response, next: NextFunction) {
  if (!isLocal(req)) return res.status(403).json({ error: 'The local agent only works when ChargoX runs on your own computer.' });
  const origin = req.headers.origin;
  if (origin) {
    try { if (new URL(origin).host !== req.headers.host) return res.status(403).json({ error: 'Blocked origin.' }); }
    catch { return res.status(403).json({ error: 'Blocked origin.' }); }
  }
  if (req.method !== 'GET' && req.headers['x-chargox-local'] !== '1') return res.status(403).json({ error: 'Missing header.' });
  next();
}

function runOnce(cmd: string, ms = 8000): Promise<{ ok: boolean; out: string }> {
  return new Promise((resolve) => {
    let out = '';
    const c = spawn(cmd, { shell: true });
    const t = setTimeout(() => { c.kill(); resolve({ ok: false, out }); }, ms);
    c.stdout.on('data', (d) => (out += d));
    c.stderr.on('data', (d) => (out += d));
    c.on('close', (code) => { clearTimeout(t); resolve({ ok: code === 0, out: out.trim() }); });
    c.on('error', () => { clearTimeout(t); resolve({ ok: false, out }); });
  });
}

function resolveDir(cwd?: string): string {
  fs.mkdirSync(WORKSPACE, { recursive: true });
  if (cwd && fs.existsSync(cwd) && fs.statSync(cwd).isDirectory()) return path.resolve(cwd);
  return WORKSPACE;
}

export function registerLocalAgent(app: Express) {
  app.get('/api/local/status', async (req, res) => {
    if (!isLocal(req)) return res.json({ enabled: false });
    const ollamaUrl = String(req.query.ollamaUrl || 'http://localhost:11434');
    const claude = await runOnce('claude --version');
    let ollama = false;
    try {
      const r = await fetch(ollamaUrl.replace(/\/$/, '') + '/api/tags', { signal: AbortSignal.timeout(2500) });
      ollama = r.ok;
    } catch {}
    res.json({ enabled: true, claude: claude.ok, claudeVersion: claude.ok ? claude.out : '', ollama, workspace: WORKSPACE });
  });

  app.use('/workspace-preview', guard, (req, res, next) => { fs.mkdirSync(WORKSPACE, { recursive: true }); next(); }, express.static(WORKSPACE));

  app.post('/api/local/run', guard, (req, res) => {
    const { mode, input, cwd, model, ollamaUrl, useOllama, cont } = req.body || {};
    if (typeof input !== 'string' || !input.trim()) return res.status(400).json({ error: 'Nothing to run.' });
    const dir = resolveDir(cwd);

    res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' });
    const send = (type: string, data: unknown) => res.write(`data: ${JSON.stringify({ type, data })}\n\n`);
    send('cwd', dir);

    if (mode === 'shell') {
      const m = /^cd\s+(.+)$/i.exec(input.trim());
      if (m) {
        const target = path.resolve(dir, m[1].replace(/^["']|["']$/g, ''));
        if (fs.existsSync(target) && fs.statSync(target).isDirectory()) send('cwd', target);
        else send('stderr', `No such folder: ${target}\n`);
        send('exit', 0);
        return res.end();
      }
    }

    let cmd: string;
    let stdin: string | null = null;
    let env: NodeJS.ProcessEnv = { ...process.env };
    if (mode === 'claude') {
      const safeModel = /^[\w.:\-\/]+$/.test(model || '') ? model : '';
      cmd = ['claude', '-p', '--output-format', 'stream-json', '--verbose', '--permission-mode', 'acceptEdits',
        '--allowedTools', 'Bash,Read,Write,Edit,Glob,Grep', ...(safeModel ? ['--model', safeModel] : []), ...(cont ? ['--continue'] : [])].join(' ');
      stdin = input;
      if (useOllama) {
        env = { ...env, ANTHROPIC_BASE_URL: ollamaUrl || 'http://localhost:11434', ANTHROPIC_AUTH_TOKEN: 'ollama', ANTHROPIC_API_KEY: '' };
      }
    } else {
      cmd = input;
    }

    const child = spawn(cmd, { cwd: dir, env, shell: true });
    if (stdin !== null) { child.stdin.write(stdin); child.stdin.end(); }
    child.stdout.on('data', (d) => send('stdout', d.toString()));
    child.stderr.on('data', (d) => send('stderr', d.toString()));
    child.on('error', (e) => send('stderr', e.message + '\n'));
    child.on('close', (code) => { send('exit', code); res.end(); });
    res.on('close', () => {
      if (child.exitCode !== null || !child.pid) return;
      if (process.platform === 'win32') spawn('taskkill', ['/pid', String(child.pid), '/T', '/F']);
      else child.kill();
    });
  });
}
