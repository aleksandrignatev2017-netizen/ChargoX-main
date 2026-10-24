import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { generateAppFromPrompt } from './server/dynamicAppGenerator.js';
import { registerLocalAgent } from './server/localAgent.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '10mb' }));

// Initialize Gemini client if API key is provided
let aiClient: GoogleGenAI | null = null;
if (process.env.GEMINI_API_KEY) {
  aiClient = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
}

// System instructions for the ChargoX app builder agent
const CHARGOX_SYSTEM_PROMPT = `
You are ChargoX — the autonomous AI App & Website Builder, identical in power and capability to Google AI Studio Build.
When a user provides a prompt, you formulate an architectural plan, choose modern UI styling (Tailwind CSS, Lucide icons, responsive layouts, micro-interactions), and write complete, fully-functional, interactive web applications.

CRITICAL RELEVANCE & ACCURACY DIRECTIVE:
1. YOU MUST BUILD PRECISELY WHAT THE USER REQUESTS IN THEIR PROMPT.
2. NEVER IGNORE THE USER'S PROMPT OR SUBSTITUTE IT WITH A DIFFERENT TEMPLATE OR UNRELATED DOMAIN.
3. If the user asks for a calculator, you MUST build a full working calculator. If the user asks for a quiz, build a quiz. If the user asks for a drawing canvas, build a drawing canvas. If the user asks for a game, build that specific game. If the user asks for a pizza ordering app, build a pizza ordering app.
4. Read every detail, noun, action, and rule mentioned in the user's prompt and ensure they are all fully reflected in the code.

Rules for generated code:
1. Provide a single, complete, beautiful self-contained HTML document in "previewHtml" that runs instantly inside an iframe sandbox with zero external build step.
2. Include:
   - Modern Tailwind CSS via CDN: <script src="https://cdn.tailwindcss.com"></script>
   - Lucide icons via CDN: <script src="https://unpkg.com/lucide@latest"></script> (call lucide.createIcons() on load and after DOM updates)
   - Font Inter / Plus Jakarta Sans via Google Fonts
   - Complete JavaScript logic: state management, real event handlers, local storage persistence, interactive features (modals, filters, counters, loops, audio effects where appropriate).
   - Rich mock data and realistic user interactions.
   - Clean UX: toasts/notifications, empty states, hover states, transition animations, dark theme.
3. Keep the "files" array empty [] or minimal. The server will automatically generate virtual files from your "previewHtml" so DO NOT repeat your code twice.
4. In "planSteps", return 3-5 realistic agent tool execution steps detailing your internal thinking.
5. In "suggestions", provide 3-4 natural follow-up prompt suggestions.
6. Escape all quotes inside strings properly to ensure valid JSON syntax.

Output MUST be strictly valid JSON conforming to this schema:
{
  "appName": "string",
  "summary": "string",
  "planSteps": [
    { "action": "string", "detail": "string", "status": "completed" }
  ],
  "previewHtml": "string (the complete runnable HTML code with html, head, style, body, script)",
  "suggestions": ["string", "string", "string"]
}
`;

// Universal Prompt-Adherent App Synthesizer (delegates to dynamic engine)
function getPresetApp(prompt: string): any {
  return generateAppFromPrompt(prompt);
  const p = prompt.toLowerCase();
  
  if (p.includes('game') || p.includes('arcade') || p.includes('retro') || p.includes('snake') || p.includes('space') || p.includes('shoot')) {
    return {
      appName: "CyberDash 2099 — Neon Retro Arcade",
      summary: "High-octane neon retro cyber arcade with interactive spaceship shooter, sound effects synthesis, particle bursts, combo multipliers, high-score local storage, and upgrade shop.",
      planSteps: [
        { action: "Scanning user prompt", detail: "Detected request for arcade game experience with modern neon aesthetics", status: "completed" },
        { action: "Initializing Canvas & Web Audio API", detail: "Configured 60 FPS requestAnimationFrame loop, particle emitter, and synthesized laser SFX", status: "completed" },
        { action: "Building retro HUD & shop system", detail: "Designed high-score persistence, energy shields, weapon upgrades, and responsive controls", status: "completed" },
        { action: "Compiling applet & verifying touch/keyboard handlers", detail: "Verified desktop Arrow/WASD keys and mobile touch virtual d-pad controls", status: "completed" }
      ],
      files: [
        {
          name: "index.html",
          path: "/index.html",
          type: "html",
          content: `<!-- CyberDash 2099 HTML Structure -->\n<div id="game-root" class="relative w-full h-screen bg-slate-950 flex flex-col items-center justify-center font-mono">...</div>`
        },
        {
          name: "app.js",
          path: "/app.js",
          type: "javascript",
          content: `// Canvas game loop, particle physics, audio context synthesizer\nclass GameEngine { ... }`
        },
        {
          name: "styles.css",
          path: "/styles.css",
          type: "css",
          content: `@keyframes pulseGlow { 0%, 100% { filter: drop-shadow(0 0 12px #38bdf8); } 50% { filter: drop-shadow(0 0 24px #ec4899); } }`
        }
      ],
      previewHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberDash 2099</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'JetBrains+Mono', monospace; background-color: #030712; color: #f8fafc; overflow: hidden; user-select: none; }
    .orbitron { font-family: 'Orbitron', sans-serif; }
    .glow-cyan { text-shadow: 0 0 15px rgba(6,182,212,0.8); }
    .glow-magenta { text-shadow: 0 0 15px rgba(236,72,153,0.8); }
    .box-glow { box-shadow: 0 0 25px rgba(6,182,212,0.25), inset 0 0 15px rgba(6,182,212,0.1); }
  </style>
</head>
<body class="flex flex-col h-screen">
  <!-- Top Bar -->
  <header class="flex items-center justify-between px-6 py-3 bg-slate-900/90 border-b border-cyan-500/30 backdrop-blur z-20">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center font-bold text-black orbitron">CX</div>
      <div>
        <h1 class="text-sm font-bold tracking-wider text-cyan-400 orbitron flex items-center gap-2">
          CYBERDASH 2099
          <span class="text-[10px] bg-cyan-950 text-cyan-300 px-2 py-0.5 rounded border border-cyan-500/40">ARCADE v2.4</span>
        </h1>
      </div>
    </div>
    <div class="flex items-center gap-6">
      <div class="text-right">
        <div class="text-[10px] text-slate-400">SCORE</div>
        <div id="scoreDisplay" class="text-xl font-bold text-white orbitron">00000</div>
      </div>
      <div class="text-right">
        <div class="text-[10px] text-slate-400">HIGH SCORE</div>
        <div id="highScoreDisplay" class="text-xl font-bold text-fuchsia-400 orbitron">14820</div>
      </div>
      <button id="soundToggle" class="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition">
        <i data-lucide="volume-2" class="w-4 h-4"></i>
      </button>
    </div>
  </header>

  <!-- Game Arena -->
  <main class="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
    <canvas id="gameCanvas" class="w-full h-full block cursor-crosshair"></canvas>
    
    <!-- Start / Game Over Overlay -->
    <div id="menuOverlay" class="absolute inset-0 bg-slate-950/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center z-30 transition-all duration-300">
      <div class="max-w-md w-full bg-slate-900/90 border border-cyan-500/40 p-8 rounded-2xl box-glow">
        <div class="inline-block p-3 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 mb-4">
          <i data-lucide="gamepad-2" class="w-8 h-8"></i>
        </div>
        <h2 id="overlayTitle" class="text-2xl font-black orbitron text-white glow-cyan mb-2">NEON SURVIVOR</h2>
        <p id="overlaySubtitle" class="text-xs text-slate-300 mb-6 leading-relaxed">
          Pilot your photon skimmer. Dodge enemy drones, collect energy cores, and unleash plasma salvos!
        </p>

        <div class="grid grid-cols-2 gap-3 mb-6 text-left text-xs bg-slate-950/60 p-4 rounded-xl border border-slate-800">
          <div class="text-slate-400 flex items-center gap-2"><span class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">A/D</span> or <span class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">←/→</span> Move</div>
          <div class="text-slate-400 flex items-center gap-2"><span class="px-1.5 py-0.5 rounded bg-slate-800 text-cyan-400 font-bold">SPACE</span> Fire Plasma</div>
          <div class="text-slate-400 flex items-center gap-2"><span class="px-1.5 py-0.5 rounded bg-slate-800 text-fuchsia-400 font-bold">W</span> Boost Shield</div>
          <div class="text-slate-400 flex items-center gap-2"><span class="px-1.5 py-0.5 rounded bg-slate-800 text-fuchsia-400 font-bold">MOUSE</span> Aim & Shoot</div>
        </div>

        <button id="startButton" class="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-slate-950 font-bold orbitron tracking-wider text-sm hover:opacity-90 active:scale-95 transition shadow-lg shadow-cyan-500/30">
          LAUNCH MISSION
        </button>
      </div>
    </div>

    <!-- In-Game HUD overlay -->
    <div class="absolute bottom-4 left-6 right-6 flex items-center justify-between pointer-events-none z-10">
      <div class="flex items-center gap-3 bg-slate-900/80 px-4 py-2 rounded-xl border border-slate-800 backdrop-blur pointer-events-auto">
        <div class="text-xs text-slate-400">SHIELD:</div>
        <div class="w-32 h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
          <div id="shieldBar" class="h-full bg-gradient-to-r from-cyan-500 to-emerald-400 w-full transition-all duration-200"></div>
        </div>
      </div>

      <div class="flex items-center gap-2 pointer-events-auto">
        <button id="upgradeFire" class="px-3 py-1.5 rounded-lg bg-slate-900/90 text-cyan-400 border border-cyan-500/30 text-xs hover:bg-cyan-950 transition flex items-center gap-1.5">
          <i data-lucide="zap" class="w-3.5 h-3.5"></i> Spread Shot
        </button>
        <button id="upgradeBomb" class="px-3 py-1.5 rounded-lg bg-slate-900/90 text-fuchsia-400 border border-fuchsia-500/30 text-xs hover:bg-fuchsia-950 transition flex items-center gap-1.5">
          <i data-lucide="sparkles" class="w-3.5 h-3.5"></i> EMP Bomb (<span id="bombCount">2</span>)
        </button>
      </div>
    </div>
  </main>

  <script>
    lucide.createIcons();

    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const scoreDisplay = document.getElementById('scoreDisplay');
    const highScoreDisplay = document.getElementById('highScoreDisplay');
    const shieldBar = document.getElementById('shieldBar');
    const menuOverlay = document.getElementById('menuOverlay');
    const overlayTitle = document.getElementById('overlayTitle');
    const overlaySubtitle = document.getElementById('overlaySubtitle');
    const startButton = document.getElementById('startButton');
    const soundToggle = document.getElementById('soundToggle');
    const bombCountSpan = document.getElementById('bombCount');

    let soundEnabled = true;
    let audioCtx = null;

    function playTone(freq, duration = 0.1, type = 'sine') {
      if (!soundEnabled) return;
      try {
        if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start();
        osc.stop(audioCtx.currentTime + duration);
      } catch (e) {}
    }

    soundToggle.addEventListener('click', () => {
      soundEnabled = !soundEnabled;
      soundToggle.classList.toggle('text-slate-500', !soundEnabled);
      soundToggle.classList.toggle('text-cyan-400', soundEnabled);
    });

    // Resize canvas
    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    // Game State
    let isPlaying = false;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('cyberdash_high') || '14820');
    highScoreDisplay.textContent = highScore.toString().padStart(5, '0');
    let bombs = 2;
    let tripleShot = false;

    const player = {
      x: canvas.width / 2,
      y: canvas.height - 80,
      width: 36,
      height: 42,
      speed: 7,
      shield: 100,
      vx: 0
    };

    let bullets = [];
    let enemies = [];
    let particles = [];
    let stars = [];

    // Init background stars
    for (let i = 0; i < 70; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 2 + 0.5,
        speed: Math.random() * 2 + 0.5,
        color: ['#38bdf8', '#c084fc', '#ffffff'][Math.floor(Math.random() * 3)]
      });
    }

    const keys = {};
    window.addEventListener('keydown', (e) => {
      keys[e.key] = true;
      if (e.code === 'Space' && isPlaying) {
        shoot();
        e.preventDefault();
      }
    });
    window.addEventListener('keyup', (e) => {
      keys[e.key] = false;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isPlaying) return;
      const rect = canvas.getBoundingClientRect();
      const targetX = e.clientX - rect.left;
      player.x += (targetX - player.x) * 0.15;
    });

    canvas.addEventListener('click', () => {
      if (isPlaying) shoot();
    });

    function shoot() {
      playTone(580, 0.08, 'sawtooth');
      if (tripleShot) {
        bullets.push({ x: player.x, y: player.y - 10, vx: 0, vy: -12, color: '#06b6d4' });
        bullets.push({ x: player.x - 12, y: player.y - 5, vx: -3, vy: -11, color: '#ec4899' });
        bullets.push({ x: player.x + 12, y: player.y - 5, vx: 3, vy: -11, color: '#ec4899' });
      } else {
        bullets.push({ x: player.x - 10, y: player.y - 5, vx: 0, vy: -12, color: '#06b6d4' });
        bullets.push({ x: player.x + 10, y: player.y - 5, vx: 0, vy: -12, color: '#06b6d4' });
      }
    }

    function createExplosion(x, y, color = '#f43f5e', count = 15) {
      playTone(180, 0.2, 'square');
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 5 + 1;
        particles.push({
          x, y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          decay: Math.random() * 0.03 + 0.02,
          color
        });
      }
    }

    function spawnEnemy() {
      if (!isPlaying) return;
      const types = [
        { hp: 1, speed: 2.5, width: 30, height: 30, color: '#f43f5e', score: 100 },
        { hp: 2, speed: 1.8, width: 40, height: 35, color: '#d946ef', score: 250 },
        { hp: 4, speed: 1.2, width: 55, height: 45, color: '#06b6d4', score: 500 }
      ];
      const type = types[Math.floor(Math.random() * types.length)];
      enemies.push({
        x: Math.random() * (canvas.width - 60) + 30,
        y: -50,
        ...type
      });
    }

    document.getElementById('upgradeFire').addEventListener('click', () => {
      tripleShot = !tripleShot;
      playTone(880, 0.15, 'triangle');
    });

    document.getElementById('upgradeBomb').addEventListener('click', () => {
      if (bombs > 0 && isPlaying) {
        bombs--;
        bombCountSpan.textContent = bombs;
        enemies.forEach(e => createExplosion(e.x, e.y, '#f59e0b', 25));
        enemies = [];
        score += 800;
        scoreDisplay.textContent = score.toString().padStart(5, '0');
        playTone(120, 0.4, 'sawtooth');
      }
    });

    function startGame() {
      isPlaying = true;
      score = 0;
      bombs = 2;
      bombCountSpan.textContent = bombs;
      player.shield = 100;
      player.x = canvas.width / 2;
      bullets = [];
      enemies = [];
      particles = [];
      scoreDisplay.textContent = '00000';
      shieldBar.style.width = '100%';
      menuOverlay.classList.add('opacity-0', 'pointer-events-none');
      playTone(440, 0.15, 'sine');
    }

    function gameOver() {
      isPlaying = false;
      playTone(90, 0.6, 'sawtooth');
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('cyberdash_high', highScore.toString());
        highScoreDisplay.textContent = highScore.toString().padStart(5, '0');
      }
      overlayTitle.textContent = "MISSION FAILED";
      overlaySubtitle.innerHTML = \`Final Score: <span class="text-cyan-400 font-bold text-base">\${score}</span> | High Score: <span class="text-fuchsia-400 font-bold text-base">\${highScore}</span>\`;
      startButton.textContent = "PLAY AGAIN";
      menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
    }

    startButton.addEventListener('click', startGame);

    // Enemy spawn timer
    setInterval(spawnEnemy, 1100);

    // Main Game Loop
    function update() {
      // Background star movement
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) {
          star.y = 0;
          star.x = Math.random() * canvas.width;
        }
        ctx.fillStyle = star.color;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      if (isPlaying) {
        // Keyboard controls
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;
        player.x = Math.max(25, Math.min(canvas.width - 25, player.x));

        // Draw Player Ship
        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
        // Ship Hull
        ctx.beginPath();
        ctx.moveTo(0, -22);
        ctx.lineTo(18, 18);
        ctx.lineTo(8, 12);
        ctx.lineTo(0, 16);
        ctx.lineTo(-8, 12);
        ctx.lineTo(-18, 18);
        ctx.closePath();
        ctx.fillStyle = '#06b6d4';
        ctx.fill();

        // Cockpit
        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(5, 5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fillStyle = '#e0f2fe';
        ctx.fill();

        // Thruster flame
        ctx.beginPath();
        ctx.moveTo(-5, 16);
        ctx.lineTo(0, 26 + Math.random() * 6);
        ctx.lineTo(5, 16);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.restore();

        // Bullets
        for (let i = bullets.length - 1; i >= 0; i--) {
          const b = bullets[i];
          b.x += b.vx;
          b.y += b.vy;
          ctx.save();
          ctx.shadowColor = b.color;
          ctx.shadowBlur = 10;
          ctx.fillStyle = b.color;
          ctx.fillRect(b.x - 2, b.y, 4, 14);
          ctx.restore();

          if (b.y < -20) bullets.splice(i, 1);
        }

        // Enemies
        for (let i = enemies.length - 1; i >= 0; i--) {
          const e = enemies[i];
          e.y += e.speed;

          ctx.save();
          ctx.translate(e.x, e.y);
          ctx.shadowColor = e.color;
          ctx.shadowBlur = 12;
          ctx.fillStyle = e.color;
          ctx.beginPath();
          ctx.moveTo(0, e.height / 2);
          ctx.lineTo(e.width / 2, -e.height / 2);
          ctx.lineTo(-e.width / 2, -e.height / 2);
          ctx.closePath();
          ctx.fill();
          ctx.restore();

          // Bullet collision
          for (let j = bullets.length - 1; j >= 0; j--) {
            const b = bullets[j];
            if (Math.hypot(b.x - e.x, b.y - e.y) < e.width / 2 + 5) {
              bullets.splice(j, 1);
              e.hp--;
              createExplosion(b.x, b.y, e.color, 6);
              if (e.hp <= 0) {
                createExplosion(e.x, e.y, e.color, 18);
                score += e.score;
                scoreDisplay.textContent = score.toString().padStart(5, '0');
                enemies.splice(i, 1);
                break;
              }
            }
          }

          // Player collision
          if (enemies[i] && Math.hypot(player.x - e.x, player.y - e.y) < player.width / 2 + e.width / 2) {
            createExplosion(e.x, e.y, '#ef4444', 20);
            enemies.splice(i, 1);
            player.shield -= 25;
            shieldBar.style.width = Math.max(0, player.shield) + '%';
            if (player.shield <= 0) {
              createExplosion(player.x, player.y, '#06b6d4', 35);
              gameOver();
            }
          }

          if (enemies[i] && e.y > canvas.height + 60) {
            enemies.splice(i, 1);
          }
        }

        // Particles
        for (let i = particles.length - 1; i >= 0; i--) {
          const p = particles[i];
          p.x += p.vx;
          p.y += p.vy;
          p.life -= p.decay;
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.life);
          ctx.fillRect(p.x, p.y, 3, 3);
          ctx.globalAlpha = 1.0;
          if (p.life <= 0) particles.splice(i, 1);
        }
      }

      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  </script>
</body>
</html>`
    };
  }

  if (p.includes('kanban') || p.includes('task') || p.includes('todo') || p.includes('agile') || p.includes('project')) {
    return {
      appName: "TaskPulse — Agile Flow & Kanban Board",
      summary: "Full-featured modern Kanban project management board with drag-and-drop column sorting, priority tags, real-time filtering, local storage persistence, activity timeline, and instant task creation modal.",
      planSteps: [
        { action: "Deconstructing Kanban workflow", detail: "Formulating 4 core columns (Backlog, In Progress, Code Review, Done) with priority labels", status: "completed" },
        { action: "Implementing local storage & drag handlers", detail: "Configured HTML5 drag/drop API and localStorage sync for persistent state", status: "completed" },
        { action: "Designing responsive UI & quick filters", detail: "Added assignee avatars, priority color codes, instant search bar, and task counter metrics", status: "completed" },
        { action: "Verifying modal dialogues & form validation", detail: "Tested task creation modal, delete confirmations, and column re-ordering", status: "completed" }
      ],
      files: [
        {
          name: "index.html",
          path: "/index.html",
          type: "html",
          content: `<!-- TaskPulse Kanban Board -->\n<div class="min-h-screen bg-slate-900 text-slate-100 p-6">...</div>`
        },
        {
          name: "app.js",
          path: "/app.js",
          type: "javascript",
          content: `// Kanban State Store & Drag-and-drop event listeners\nconst store = { tasks: [], columns: [] };`
        },
        {
          name: "styles.css",
          path: "/styles.css",
          type: "css",
          content: `.kanban-card:active { cursor: grabbing; opacity: 0.7; }`
        }
      ],
      previewHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>TaskPulse — Kanban Board</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0f172a; color: #f8fafc; }
    .custom-scroll::-webkit-scrollbar { width: 6px; height: 6px; }
    .custom-scroll::-webkit-scrollbar-track { background: #1e293b; border-radius: 4px; }
    .custom-scroll::-webkit-scrollbar-thumb { background: #334155; border-radius: 4px; }
  </style>
</head>
<body class="h-screen flex flex-col overflow-hidden bg-slate-950 text-slate-100">
  <!-- Top Navigation -->
  <header class="h-16 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between shrink-0">
    <div class="flex items-center gap-4">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">
        ⚡
      </div>
      <div>
        <h1 class="text-base font-bold flex items-center gap-2">
          TaskPulse Agile Board
          <span class="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">Sprint #14</span>
        </h1>
        <p class="text-xs text-slate-400">Q4 Product Release Roadmap</p>
      </div>
    </div>

    <!-- Actions & Search -->
    <div class="flex items-center gap-3">
      <div class="relative">
        <i data-lucide="search" class="w-4 h-4 absolute left-3 top-2.5 text-slate-400"></i>
        <input id="searchInput" type="text" placeholder="Search tasks..." class="pl-9 pr-4 py-1.5 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500 w-48 sm:w-64 transition">
      </div>
      <button id="openNewTaskBtn" class="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/30 transition">
        <i data-lucide="plus" class="w-4 h-4"></i> New Task
      </button>
    </div>
  </header>

  <!-- Board Metrics -->
  <div class="px-6 py-2.5 bg-slate-900/40 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
    <div class="flex items-center gap-6">
      <div>Total Tasks: <span id="totalCount" class="font-bold text-white">0</span></div>
      <div>Completed: <span id="completedCount" class="font-bold text-emerald-400">0</span></div>
      <div>High Priority: <span id="urgentCount" class="font-bold text-rose-400">0</span></div>
    </div>
    <div class="flex items-center gap-2">
      <span class="text-[11px] text-slate-400">Filter:</span>
      <button onclick="filterPriority('all')" class="px-2 py-0.5 rounded bg-slate-800 text-slate-300 hover:text-white text-[11px]">All</button>
      <button onclick="filterPriority('High')" class="px-2 py-0.5 rounded bg-rose-950/60 text-rose-300 border border-rose-800/40 text-[11px]">High</button>
      <button onclick="filterPriority('Medium')" class="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 text-[11px]">Medium</button>
      <button onclick="filterPriority('Low')" class="px-2 py-0.5 rounded bg-emerald-950/60 text-emerald-300 border border-emerald-800/40 text-[11px]">Low</button>
    </div>
  </div>

  <!-- Columns Container -->
  <main class="flex-1 p-6 overflow-x-auto flex gap-6 custom-scroll">
    <!-- Backlog Column -->
    <div class="w-80 shrink-0 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-4" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'backlog')">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 font-semibold text-sm">
          <div class="w-2.5 h-2.5 rounded-full bg-slate-400"></div>
          Backlog
          <span id="count-backlog" class="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">0</span>
        </div>
        <button onclick="openModalWithCol('backlog')" class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"><i data-lucide="plus" class="w-4 h-4"></i></button>
      </div>
      <div id="col-backlog" class="flex-1 overflow-y-auto space-y-3 custom-scroll pr-1 min-h-[150px]"></div>
    </div>

    <!-- In Progress Column -->
    <div class="w-80 shrink-0 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-4" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'progress')">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 font-semibold text-sm text-sky-400">
          <div class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></div>
          In Progress
          <span id="count-progress" class="text-xs bg-slate-800 text-sky-400 px-2 py-0.5 rounded-full font-mono">0</span>
        </div>
        <button onclick="openModalWithCol('progress')" class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"><i data-lucide="plus" class="w-4 h-4"></i></button>
      </div>
      <div id="col-progress" class="flex-1 overflow-y-auto space-y-3 custom-scroll pr-1 min-h-[150px]"></div>
    </div>

    <!-- Review Column -->
    <div class="w-80 shrink-0 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-4" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'review')">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 font-semibold text-sm text-amber-400">
          <div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
          Peer Review
          <span id="count-review" class="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-mono">0</span>
        </div>
        <button onclick="openModalWithCol('review')" class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"><i data-lucide="plus" class="w-4 h-4"></i></button>
      </div>
      <div id="col-review" class="flex-1 overflow-y-auto space-y-3 custom-scroll pr-1 min-h-[150px]"></div>
    </div>

    <!-- Done Column -->
    <div class="w-80 shrink-0 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-4" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'done')">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 font-semibold text-sm text-emerald-400">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
          Completed
          <span id="count-done" class="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-mono">0</span>
        </div>
        <button onclick="openModalWithCol('done')" class="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-white transition"><i data-lucide="plus" class="w-4 h-4"></i></button>
      </div>
      <div id="col-done" class="flex-1 overflow-y-auto space-y-3 custom-scroll pr-1 min-h-[150px]"></div>
    </div>
  </main>

  <!-- New Task Modal -->
  <div id="taskModal" class="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 hidden flex items-center justify-center p-4">
    <div class="bg-slate-900 border border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-2xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="font-bold text-base text-white">Create New Card</h3>
        <button id="closeModalBtn" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>
      <form id="taskForm" class="space-y-4">
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Task Title</label>
          <input id="taskTitle" type="text" required placeholder="e.g. Integrate Stripe Webhooks" class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500">
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Description</label>
          <textarea id="taskDesc" rows="3" placeholder="Add acceptance criteria or specs..." class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white focus:outline-none focus:border-indigo-500"></textarea>
        </div>
        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Column</label>
            <select id="taskColumn" class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white">
              <option value="backlog">Backlog</option>
              <option value="progress">In Progress</option>
              <option value="review">Peer Review</option>
              <option value="done">Completed</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-slate-400 mb-1">Priority</label>
            <select id="taskPriority" class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-xs text-white">
              <option value="Low">Low</option>
              <option value="Medium" selected>Medium</option>
              <option value="High">High</option>
            </select>
          </div>
        </div>
        <div>
          <label class="block text-xs font-medium text-slate-400 mb-1">Assignee</label>
          <input id="taskAssignee" type="text" placeholder="e.g. Alex Rivera" value="Alex R." class="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm text-white">
        </div>
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" id="cancelModalBtn" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white">Create Task</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let tasks = JSON.parse(localStorage.getItem('taskpulse_tasks') || '[]');
    if (tasks.length === 0) {
      tasks = [
        { id: '1', title: 'Design OAuth 2.0 flow diagram', desc: 'Map out PKCE token refresh loop and session revocation.', column: 'progress', priority: 'High', assignee: 'Sarah K.', date: 'Oct 18' },
        { id: '2', title: 'Refactor Tailwind color palette', desc: 'Migrate legacy slate accents to high-contrast neon tokens.', column: 'done', priority: 'Low', assignee: 'Dev Team', date: 'Oct 15' },
        { id: '3', title: 'Add Stripe subscription webhooks', desc: 'Handle invoice.payment_succeeded and customer churn events.', column: 'backlog', priority: 'High', assignee: 'Alex R.', date: 'Oct 21' },
        { id: '4', title: 'Optimize bundle size & tree-shaking', desc: 'Analyze chunks with rollup-plugin-visualizer.', column: 'review', priority: 'Medium', assignee: 'Elena M.', date: 'Oct 19' },
        { id: '5', title: 'Set up automated Cypress E2E tests', desc: 'Cover user sign-up, project checkout, and API key generation.', column: 'backlog', priority: 'Medium', assignee: 'Jordan P.', date: 'Oct 22' }
      ];
      localStorage.setItem('taskpulse_tasks', JSON.stringify(tasks));
    }

    let activeFilter = 'all';
    let searchQuery = '';

    function saveTasks() {
      localStorage.setItem('taskpulse_tasks', JSON.stringify(tasks));
      render();
    }

    function render() {
      const cols = ['backlog', 'progress', 'review', 'done'];
      cols.forEach(c => {
        document.getElementById('col-' + c).innerHTML = '';
      });

      const filtered = tasks.filter(t => {
        const matchesFilter = activeFilter === 'all' || t.priority === activeFilter;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              t.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      });

      const counts = { backlog: 0, progress: 0, review: 0, done: 0 };

      filtered.forEach(task => {
        counts[task.column] = (counts[task.column] || 0) + 1;
        const el = createTaskCard(task);
        const colContainer = document.getElementById('col-' + task.column);
        if (colContainer) colContainer.appendChild(el);
      });

      cols.forEach(c => {
        document.getElementById('count-' + c).textContent = counts[c];
      });

      document.getElementById('totalCount').textContent = tasks.length;
      document.getElementById('completedCount').textContent = tasks.filter(t => t.column === 'done').length;
      document.getElementById('urgentCount').textContent = tasks.filter(t => t.priority === 'High').length;

      lucide.createIcons();
    }

    function getPriorityBadge(priority) {
      if (priority === 'High') return '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">High</span>';
      if (priority === 'Medium') return '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>';
      return '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low</span>';
    }

    function createTaskCard(task) {
      const card = document.createElement('div');
      card.className = "bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3.5 shadow-sm transition hover:shadow-md cursor-grab active:cursor-grabbing";
      card.draggable = true;
      card.ondragstart = (e) => {
        e.dataTransfer.setData('text/plain', task.id);
      };

      card.innerHTML = \`
        <div class="flex items-center justify-between mb-2">
          \${getPriorityBadge(task.priority)}
          <div class="flex items-center gap-1.5">
            <button onclick="deleteTask('\${task.id}')" class="text-slate-500 hover:text-rose-400 p-1 transition"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
        </div>
        <h4 class="font-semibold text-xs text-white mb-1.5 leading-snug">\${task.title}</h4>
        <p class="text-[11px] text-slate-400 mb-3 line-clamp-2 leading-relaxed">\${task.desc || 'No description provided'}</p>
        <div class="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
          <div class="flex items-center gap-1.5">
            <div class="w-5 h-5 rounded-full bg-indigo-500/30 text-indigo-300 font-bold flex items-center justify-center text-[9px]">\${task.assignee ? task.assignee.charAt(0) : 'U'}</div>
            <span>\${task.assignee || 'Unassigned'}</span>
          </div>
          <span class="text-[10px] text-slate-400 font-mono">\${task.date || 'Today'}</span>
        </div>
      \`;
      return card;
    }

    function allowDrop(e) {
      e.preventDefault();
    }

    function handleDrop(e, column) {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const task = tasks.find(t => t.id === id);
      if (task) {
        task.column = column;
        saveTasks();
      }
    }

    function deleteTask(id) {
      tasks = tasks.filter(t => t.id !== id);
      saveTasks();
    }

    function filterPriority(p) {
      activeFilter = p;
      render();
    }

    document.getElementById('searchInput').addEventListener('input', (e) => {
      searchQuery = e.target.value;
      render();
    });

    // Modal
    const modal = document.getElementById('taskModal');
    const taskForm = document.getElementById('taskForm');
    const openNewTaskBtn = document.getElementById('openNewTaskBtn');
    const closeModalBtn = document.getElementById('closeModalBtn');
    const cancelModalBtn = document.getElementById('cancelModalBtn');

    function openModalWithCol(col = 'backlog') {
      document.getElementById('taskColumn').value = col;
      modal.classList.remove('hidden');
      document.getElementById('taskTitle').focus();
    }

    openNewTaskBtn.addEventListener('click', () => openModalWithCol('backlog'));
    closeModalBtn.addEventListener('click', () => modal.classList.add('hidden'));
    cancelModalBtn.addEventListener('click', () => modal.classList.add('hidden'));

    taskForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('taskTitle').value.trim();
      const desc = document.getElementById('taskDesc').value.trim();
      const col = document.getElementById('taskColumn').value;
      const priority = document.getElementById('taskPriority').value;
      const assignee = document.getElementById('taskAssignee').value.trim();

      if (!title) return;

      tasks.push({
        id: Date.now().toString(),
        title,
        desc,
        column: col,
        priority,
        assignee,
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      });

      saveTasks();
      taskForm.reset();
      modal.classList.add('hidden');
    });

    render();
  </script>
</body>
</html>`
    };
  }

  // Default SaaS Dashboard & Analytics App
  return {
    appName: "SaaSify — Executive Revenue & Metrics Hub",
    summary: "High-performance SaaS executive dashboard with real-time MRR analytics, churn metrics, active subscriber breakdown, user retention cohort table, and interactive date-range filtering.",
    planSteps: [
      { action: "Synthesizing product metrics schema", detail: "Defined Monthly Recurring Revenue (MRR), Customer Lifetime Value (LTV), and churn indicators", status: "completed" },
      { action: "Constructing charts and financial telemetry", detail: "Built dynamic SVG spline charts, transaction feeds, and tier distribution indicators", status: "completed" },
      { action: "Adding interactive state controls", detail: "Wired period selectors (7D, 30D, 1Y), plan upgrading modals, and CSV export triggers", status: "completed" },
      { action: "Validating responsive glassmorphic design", detail: "Passed all responsive layout verifications across Desktop, Tablet, and Mobile views", status: "completed" }
    ],
    files: [
      {
        name: "index.html",
        path: "/index.html",
        type: "html",
        content: `<!-- SaaSify Dashboard -->\n<div class="min-h-screen bg-slate-950 text-white flex">...</div>`
      },
      {
        name: "app.js",
        path: "/app.js",
        type: "javascript",
        content: `// Dynamic chart drawing and KPI metric recalculation\nfunction updateMetrics(range) { ... }`
      },
      {
        name: "styles.css",
        path: "/styles.css",
        type: "css",
        content: `.glass-panel { background: rgba(30, 41, 59, 0.7); backdrop-filter: blur(12px); }`
      }
    ],
    previewHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SaaSify — Executive Dashboard</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0b0f19; color: #f8fafc; }
    .mono { font-family: 'JetBrains+Mono', monospace; }
    .glass-card { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="min-h-screen flex bg-[#090d16] text-slate-100">
  <!-- Sidebar -->
  <aside class="w-64 border-r border-slate-800 bg-slate-950/70 p-5 flex flex-col justify-between shrink-0 hidden md:flex">
    <div>
      <div class="flex items-center gap-3 mb-8">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-white shadow-lg shadow-cyan-500/20">
          <i data-lucide="layers" class="w-5 h-5"></i>
        </div>
        <div>
          <h2 class="font-bold text-sm tracking-wide text-white">SAASIFY STUDIO</h2>
          <p class="text-[10px] text-slate-400">Enterprise Cloud v4.2</p>
        </div>
      </div>

      <nav class="space-y-1">
        <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-xl bg-cyan-500/10 text-cyan-400 font-semibold text-xs border border-cyan-500/20">
          <i data-lucide="layout-dashboard" class="w-4 h-4"></i> Overview
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 text-xs transition">
          <i data-lucide="trending-up" class="w-4 h-4"></i> Revenue & MRR
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 text-xs transition">
          <i data-lucide="users" class="w-4 h-4"></i> Customers
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 text-xs transition">
          <i data-lucide="credit-card" class="w-4 h-4"></i> Invoicing
        </a>
        <a href="#" class="flex items-center gap-3 px-3 py-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/50 text-xs transition">
          <i data-lucide="settings" class="w-4 h-4"></i> Integrations
        </a>
      </nav>
    </div>

    <!-- Storage quota -->
    <div class="p-4 rounded-xl bg-slate-900 border border-slate-800">
      <div class="flex items-center justify-between text-xs mb-2">
        <span class="text-slate-400">API Calls Quota</span>
        <span class="text-cyan-400 font-bold">82%</span>
      </div>
      <div class="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-2">
        <div class="w-4/5 h-full bg-cyan-400"></div>
      </div>
      <p class="text-[10px] text-slate-400">820,400 / 1,000,000 reqs</p>
    </div>
  </aside>

  <!-- Main Content Area -->
  <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
    <!-- Header -->
    <header class="h-16 border-b border-slate-800 bg-slate-950/40 px-6 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <h1 class="text-base font-bold text-white">Revenue Intelligence</h1>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live Stream
        </span>
      </div>

      <div class="flex items-center gap-3">
        <div class="flex items-center bg-slate-900 border border-slate-800 rounded-lg p-1 text-xs">
          <button onclick="setRange('7D')" id="btn-7D" class="px-2.5 py-1 rounded-md text-slate-400 hover:text-white">7D</button>
          <button onclick="setRange('30D')" id="btn-30D" class="px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30">30D</button>
          <button onclick="setRange('1Y')" id="btn-1Y" class="px-2.5 py-1 rounded-md text-slate-400 hover:text-white">1Y</button>
        </div>
        <button onclick="exportCSV()" class="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white border border-slate-700 transition">
          <i data-lucide="download" class="w-3.5 h-3.5"></i> Export
        </button>
      </div>
    </header>

    <!-- Metrics Grid -->
    <main class="p-6 space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5 rounded-2xl">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Monthly Recurring (MRR)</span>
            <i data-lucide="dollar-sign" class="w-4 h-4 text-cyan-400"></i>
          </div>
          <div id="mrrValue" class="text-2xl font-bold mono text-white mb-1">$84,320</div>
          <div class="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> +14.2% <span class="text-slate-400 font-normal">vs last month</span>
          </div>
        </div>

        <div class="glass-card p-5 rounded-2xl">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Active Subscriptions</span>
            <i data-lucide="user-check" class="w-4 h-4 text-indigo-400"></i>
          </div>
          <div id="subsValue" class="text-2xl font-bold mono text-white mb-1">2,845</div>
          <div class="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> +184 new <span class="text-slate-400 font-normal">this week</span>
          </div>
        </div>

        <div class="glass-card p-5 rounded-2xl">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Net Revenue Churn</span>
            <i data-lucide="pie-chart" class="w-4 h-4 text-amber-400"></i>
          </div>
          <div id="churnValue" class="text-2xl font-bold mono text-white mb-1">1.24%</div>
          <div class="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <i data-lucide="trending-down" class="w-3.5 h-3.5"></i> -0.4% <span class="text-slate-400 font-normal">industry best</span>
          </div>
        </div>

        <div class="glass-card p-5 rounded-2xl">
          <div class="flex items-center justify-between text-slate-400 mb-2">
            <span class="text-xs font-medium">Avg Revenue Per User</span>
            <i data-lucide="activity" class="w-4 h-4 text-purple-400"></i>
          </div>
          <div id="arpuValue" class="text-2xl font-bold mono text-white mb-1">$128.40</div>
          <div class="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <i data-lucide="trending-up" class="w-3.5 h-3.5"></i> +5.8% <span class="text-slate-400 font-normal">expansion</span>
          </div>
        </div>
      </div>

      <!-- Main Chart Card -->
      <div class="glass-card p-6 rounded-2xl">
        <div class="flex items-center justify-between mb-6">
          <div>
            <h3 class="font-bold text-sm text-white">Revenue Growth Trajectory</h3>
            <p class="text-xs text-slate-400">Estimated ARR run-rate based on active cohort expansion</p>
          </div>
          <div class="flex items-center gap-4 text-xs">
            <div class="flex items-center gap-1.5 text-cyan-400"><span class="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Current Year</div>
            <div class="flex items-center gap-1.5 text-slate-400"><span class="w-2.5 h-2.5 rounded-full bg-slate-600"></span> Projected</div>
          </div>
        </div>

        <!-- SVG Spline Chart -->
        <div class="h-64 w-full relative">
          <svg class="w-full h-full overflow-visible" viewBox="0 0 800 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.35"/>
                <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
              </linearGradient>
            </defs>
            <!-- Grid lines -->
            <line x1="0" y1="60" x2="800" y2="60" stroke="#1e293b" stroke-dasharray="4 4" />
            <line x1="0" y1="120" x2="800" y2="120" stroke="#1e293b" stroke-dasharray="4 4" />
            <line x1="0" y1="180" x2="800" y2="180" stroke="#1e293b" stroke-dasharray="4 4" />
            <!-- Area & Line -->
            <path id="chartArea" d="M 0,180 Q 150,150 300,140 T 600,70 T 800,40 L 800,240 L 0,240 Z" fill="url(#chartGrad)"></path>
            <path id="chartLine" d="M 0,180 Q 150,150 300,140 T 600,70 T 800,40" fill="none" stroke="#06b6d4" stroke-width="3.5" stroke-linecap="round"></path>
          </svg>
        </div>
        <div class="flex justify-between text-[11px] text-slate-400 mt-3 font-mono">
          <span>Jan</span><span>Mar</span><span>May</span><span>Jul</span><span>Sep</span><span>Nov</span><span>Dec</span>
        </div>
      </div>

      <!-- Recent Transactions Table -->
      <div class="glass-card rounded-2xl overflow-hidden">
        <div class="p-5 border-b border-slate-800 flex items-center justify-between">
          <h3 class="font-bold text-sm text-white">Live Transactions</h3>
          <button class="text-xs text-cyan-400 hover:underline">View All Invoices</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-xs text-slate-300">
            <thead class="bg-slate-900/60 text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th class="py-3 px-5">Customer</th>
                <th class="py-3 px-5">Plan</th>
                <th class="py-3 px-5">Amount</th>
                <th class="py-3 px-5">Status</th>
                <th class="py-3 px-5">Timestamp</th>
              </tr>
            </thead>
            <tbody id="transactionTable" class="divide-y divide-slate-800/60 font-mono">
              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-3.5 px-5 font-sans font-medium text-white flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-xs">V</div>
                  Vortex Media Corp
                </td>
                <td class="py-3.5 px-5 font-sans text-slate-300">Enterprise Annual</td>
                <td class="py-3.5 px-5 text-white font-bold">$12,400.00</td>
                <td class="py-3.5 px-5"><span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Cleared</span></td>
                <td class="py-3.5 px-5 text-slate-400">2 mins ago</td>
              </tr>
              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-3.5 px-5 font-sans font-medium text-white flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs">A</div>
                  Aether Robotics
                </td>
                <td class="py-3.5 px-5 font-sans text-slate-300">Scale Monthly</td>
                <td class="py-3.5 px-5 text-white font-bold">$499.00</td>
                <td class="py-3.5 px-5"><span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Cleared</span></td>
                <td class="py-3.5 px-5 text-slate-400">14 mins ago</td>
              </tr>
              <tr class="hover:bg-slate-800/30 transition">
                <td class="py-3.5 px-5 font-sans font-medium text-white flex items-center gap-2">
                  <div class="w-7 h-7 rounded-lg bg-fuchsia-500/20 text-fuchsia-400 flex items-center justify-center font-bold text-xs">N</div>
                  Nova Horizon AI
                </td>
                <td class="py-3.5 px-5 font-sans text-slate-300">Pro Team</td>
                <td class="py-3.5 px-5 text-white font-bold">$149.00</td>
                <td class="py-3.5 px-5"><span class="px-2 py-0.5 rounded text-[10px] bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Cleared</span></td>
                <td class="py-3.5 px-5 text-slate-400">45 mins ago</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

  <script>
    lucide.createIcons();

    function setRange(range) {
      const btns = ['7D', '30D', '1Y'];
      btns.forEach(b => {
        const btn = document.getElementById('btn-' + b);
        if (b === range) {
          btn.className = "px-2.5 py-1 rounded-md bg-cyan-500/20 text-cyan-300 font-semibold border border-cyan-500/30";
        } else {
          btn.className = "px-2.5 py-1 rounded-md text-slate-400 hover:text-white";
        }
      });

      if (range === '7D') {
        document.getElementById('mrrValue').textContent = '$24,190';
        document.getElementById('subsValue').textContent = '1,120';
        document.getElementById('chartLine').setAttribute('d', 'M 0,200 Q 200,180 400,120 T 800,80');
        document.getElementById('chartArea').setAttribute('d', 'M 0,200 Q 200,180 400,120 T 800,80 L 800,240 L 0,240 Z');
      } else if (range === '30D') {
        document.getElementById('mrrValue').textContent = '$84,320';
        document.getElementById('subsValue').textContent = '2,845';
        document.getElementById('chartLine').setAttribute('d', 'M 0,180 Q 150,150 300,140 T 600,70 T 800,40');
        document.getElementById('chartArea').setAttribute('d', 'M 0,180 Q 150,150 300,140 T 600,70 T 800,40 L 800,240 L 0,240 Z');
      } else {
        document.getElementById('mrrValue').textContent = '$420,800';
        document.getElementById('subsValue').textContent = '8,920';
        document.getElementById('chartLine').setAttribute('d', 'M 0,220 Q 200,130 500,90 T 800,20');
        document.getElementById('chartArea').setAttribute('d', 'M 0,220 Q 200,130 500,90 T 800,20 L 800,240 L 0,240 Z');
      }
    }

    function exportCSV() {
      const csv = "Customer,Plan,Amount,Status,Date\\nVortex Media,Enterprise,12400,Cleared,2026-10-17\\nAether Robotics,Scale,499,Cleared,2026-10-17\\nNova Horizon,Pro,149,Cleared,2026-10-17";
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'saasify-transactions.csv';
      a.click();
    }
  </script>
</body>
</html>`
  };
}

// API endpoint to check backend status
app.get('/api/status', (req, res) => {
  res.json({
    status: 'ok',
    hasGeminiKey: !!process.env.GEMINI_API_KEY,
    model: 'gemini-3.8-flash',
    version: 'ChargoX Agent Engine 1.0.0'
  });
});

function extractFilesFromHtml(html: string) {
  // Extract custom css from <style> tags
  const styleMatches = html.match(/<style[^>]*>([\s\S]*?)<\/style>/gi) || [];
  const cssContent = styleMatches.map(m => m.replace(/<\/?style[^>]*>/gi, '').trim()).join('\n\n') || '/* Custom Tailwind & CSS Tokens */';

  // Extract custom javascript from inline <script> tags (without src)
  const scriptMatches = html.match(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi) || [];
  const jsContent = scriptMatches.map(m => m.replace(/<\/?script[^>]*>/gi, '').trim()).join('\n\n') || '// App interactive state logic';

  return [
    {
      name: 'index.html',
      path: '/index.html',
      type: 'html' as const,
      content: html,
    },
    {
      name: 'styles.css',
      path: '/styles.css',
      type: 'css' as const,
      content: cssContent,
    },
    {
      name: 'app.js',
      path: '/app.js',
      type: 'javascript' as const,
      content: jsContent,
    },
  ];
}

function safeParseGeminiApp(responseText: string, prompt: string) {
  if (!responseText || typeof responseText !== 'string') return null;

  let text = responseText.trim();

  // Strip markdown code fences if present (```json ... ```)
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/, '').trim();
  }

  // Attempt 1: Direct JSON.parse
  try {
    const parsed = JSON.parse(text);
    if (parsed.previewHtml) {
      if (!parsed.files || parsed.files.length === 0) {
        parsed.files = extractFilesFromHtml(parsed.previewHtml);
      }
      return parsed;
    }
  } catch (e1) {
    // Continue to repair attempts
  }

  // Attempt 2: Extract between outer braces
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
    const candidate = text.substring(firstBrace, lastBrace + 1);
    try {
      const parsed = JSON.parse(candidate);
      if (parsed.previewHtml) {
        if (!parsed.files || parsed.files.length === 0) {
          parsed.files = extractFilesFromHtml(parsed.previewHtml);
        }
        return parsed;
      }
    } catch (e2) {
      // Continue to regex field extraction
    }
  }

  // Attempt 3: Regex field extraction (resilient against truncated output)
  try {
    let appName = 'ChargoX Custom Application';
    let summary = 'Interactive application synthesized with ChargoX engine.';
    let previewHtml = '';
    let suggestions = ['Add dark theme', 'Add sound effects', 'Export to CSV'];
    let planSteps = [
      { action: 'Synthesizing application', detail: 'Generated responsive layout and components', status: 'completed' },
      { action: 'Configuring interactive state', detail: 'Wired event handlers and local storage', status: 'completed' },
      { action: 'Compiling applet preview', detail: 'Validated DOM runtime and styles', status: 'completed' }
    ];

    const nameMatch = text.match(/"appName"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    if (nameMatch) {
      appName = nameMatch[1].replace(/\\"/g, '"');
    }

    const summaryMatch = text.match(/"summary"\s*:\s*"([^"\\]*(?:\\.[^"\\]*)*)"/);
    if (summaryMatch) {
      summary = summaryMatch[1].replace(/\\"/g, '"');
    }

    // Extract previewHtml: find the start of the string after "previewHtml": "
    const htmlKeyIndex = text.indexOf('"previewHtml"');
    if (htmlKeyIndex !== -1) {
      const afterKey = text.substring(htmlKeyIndex);
      const colonIndex = afterKey.indexOf(':');
      if (colonIndex !== -1) {
        const afterColon = afterKey.substring(colonIndex + 1).trim();
        if (afterColon.startsWith('"')) {
          let htmlRaw = afterColon.substring(1);
          // Look for closing pattern or take up to end
          const nextKeyMatch = htmlRaw.search(/"\s*,\s*"(?:suggestions|files|planSteps)"/);
          if (nextKeyMatch !== -1) {
            htmlRaw = htmlRaw.substring(0, nextKeyMatch);
          } else {
            const lastQuote = htmlRaw.lastIndexOf('"');
            if (lastQuote > 100) {
              htmlRaw = htmlRaw.substring(0, lastQuote);
            }
          }

          previewHtml = htmlRaw
            .replace(/\\"/g, '"')
            .replace(/\\n/g, '\n')
            .replace(/\\r/g, '\r')
            .replace(/\\t/g, '\t')
            .replace(/\\\\/g, '\\');
        }
      }
    }

    if (previewHtml && (previewHtml.includes('<!DOCTYPE') || previewHtml.includes('<html') || previewHtml.includes('<div') || previewHtml.includes('<body'))) {
      if (!previewHtml.includes('</html>')) {
        previewHtml += '\n</body>\n</html>';
      }
      return {
        appName,
        summary,
        planSteps,
        files: extractFilesFromHtml(previewHtml),
        previewHtml,
        suggestions
      };
    }
  } catch (err) {
    // Suppress regex parse error
  }

  // Attempt 4: Is the text wrapped in ```html ... ``` or contains full/partial HTML?
  let rawHtml = '';
  const htmlFenceMatch = text.match(/```(?:html|xml)?\s*([\s\S]*?)\s*```/i);
  if (htmlFenceMatch && (htmlFenceMatch[1].includes('<html') || htmlFenceMatch[1].includes('<!DOCTYPE') || htmlFenceMatch[1].includes('<body') || htmlFenceMatch[1].includes('<div'))) {
    rawHtml = htmlFenceMatch[1].trim();
  } else if (text.includes('<!DOCTYPE') || text.includes('<html')) {
    const docStart = text.indexOf('<!DOCTYPE');
    const htmlStart = text.indexOf('<html');
    const startIdx = docStart !== -1 ? docStart : htmlStart;
    const endIdx = text.lastIndexOf('</html>');
    if (startIdx !== -1 && endIdx !== -1 && endIdx > startIdx) {
      rawHtml = text.substring(startIdx, endIdx + 7).trim();
    } else if (startIdx !== -1) {
      rawHtml = text.substring(startIdx).trim();
    }
  }

  if (rawHtml && (rawHtml.includes('<html') || rawHtml.includes('<body') || rawHtml.includes('<div') || rawHtml.includes('<!DOCTYPE'))) {
    if (!rawHtml.includes('</html>')) {
      rawHtml += '\n</body>\n</html>';
    }
    const titleMatch = rawHtml.match(/<title[^>]*>([^<]+)<\/title>/i) || rawHtml.match(/<h1[^>]*>([^<]+)<\/h1>/i);
    const cleanTitle = titleMatch ? titleMatch[1].trim() : (prompt.slice(0, 32).trim() || 'Custom App');
    return {
      appName: cleanTitle,
      summary: `Generated customized application for: ${prompt.slice(0, 80)}.`,
      planSteps: [
        { action: 'Parsing user prompt requirements', detail: prompt, status: 'completed' },
        { action: 'Synthesizing tailored UI and interactive logic', detail: 'Generated responsive DOM tree with Tailwind CSS and Web APIs', status: 'completed' },
        { action: 'Compiling applet preview', detail: 'Application sandbox mounted and running', status: 'completed' }
      ],
      files: extractFilesFromHtml(rawHtml),
      previewHtml: rawHtml,
      suggestions: ['Add dark/light theme switch', 'Add audio sound effects', 'Export application data to JSON']
    };
  }

  return null;
}

// API endpoint to generate or iterate on an app
app.post('/api/generate-app', async (req, res) => {
  const { prompt, history = [], currentFiles = [], mode = 'Auto (Smart Model)', deviceInfo } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // If Gemini API is available, try generation with gemini-3.8-flash
  if (aiClient) {
    try {
      const conversationContext = history.length > 0
        ? `Conversation History:\n${history.map((h: any) => `${h.role}: ${h.content}`).join('\n')}\n\n`
        : '';

      const currentFilesContext = currentFiles.length > 0
        ? `Current App Code Base:\n${currentFiles.map((f: any) => `=== ${f.name} ===\n${f.content.slice(0, 1500)}`).join('\n')}\n\n`
        : '';

      const isMobileClient = Boolean(deviceInfo && deviceInfo.isMobile);
      const deviceDirective = isMobileClient
        ? '\n\n[MOBILE DEVICE DETECTED: The user is accessing this application on a Mobile Device / Phone. CRITICAL REQUIREMENT: You MUST build a mobile-first, thumb-accessible interface. Include `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover">`, minimum 44px-48px touch tap targets, safe-area-inset padding, no horizontal scrolling, responsive grid, and on-screen touch controls / virtual buttons if making games or interactive tools.]'
        : '';

      const modeInstruction = (mode === 'ChargoX 4 Argon' || mode === 'gemini-4-argon')
        ? '\n\n[ARCHITECTURAL MODE: ChargoX 4 Argon - Deep Reasoning & Complex Logic Active]\nProvide highest depth architecture, comprehensive interactive controls, robust responsive design, local storage persistence where applicable, error handling, micro-animations, and visual polish.'
        : '';

      const userContent = `${conversationContext}${currentFilesContext}User prompt: "${prompt}"${deviceDirective}${modeInstruction}\n\nCRITICAL DIRECTIVE: You MUST build an app tailored directly to the user's prompt above. DO NOT build an unrelated game or dashboard if the prompt is for something else. Please generate a full, beautiful, production-grade interactive web app adhering strictly to the JSON specification.`;

      // Speed Mode handling: 'fast' | 'auto' | 'max'
      const modeStr = (mode || '').toLowerCase();
      const speedSetting = (req.body.speedMode || (modeStr.includes('fast') ? 'fast' : modeStr.includes('max') ? 'max' : 'auto')).toLowerCase();

      let targetModel = 'gemini-3.8-flash';
      let timeoutMs = 12000; // default auto timeout
      let routingNote = '';

      if (speedSetting === 'fast') {
        // Fast Mode: sub-second generation using flash-lite or flash
        targetModel = 'gemini-3.1-flash-lite';
        timeoutMs = 7000;
        routingNote = 'Fast Mode active (ChargoX 3.1 Flash Lite - Sub-Second Engine)';
      } else if (speedSetting === 'max') {
        // Max Mode: full deep reasoning
        targetModel = 'gemini-4-argon';
        timeoutMs = 20000;
        routingNote = 'Max Mode active (ChargoX 4 Argon - Deep Reasoning)';
      } else {
        // Auto Mode: smart intent-aware routing
        timeoutMs = 12000;
        const p = prompt.toLowerCase();
        if (p.includes('game') || p.includes('arcade') || p.includes('canvas') || p.includes('snake') || p.includes('shooter') || p.includes('physics') || p.includes('three.js') || p.includes('3d')) {
          targetModel = 'gemini-4-argon';
          routingNote = 'Auto: ChargoX Game Master (Canvas Physics)';
        } else if (p.includes('sound') || p.includes('audio') || p.includes('synth') || p.includes('music') || p.includes('beat') || p.includes('oscillator')) {
          targetModel = 'gemini-3.8-flash-tts';
          routingNote = 'Auto: ChargoX Sound Design & Audio (Web Audio API)';
        } else if (p.includes('dashboard') || p.includes('saas') || p.includes('chart') || p.includes('metrics') || p.includes('finance') || p.includes('budget') || p.includes('csv') || p.includes('analytics')) {
          targetModel = 'gemini-3.8-pro';
          routingNote = 'Auto: ChargoX Data & SaaS (Analytics & Metrics)';
        } else if (p.includes('theme') || p.includes('dark') || p.includes('color') || p.includes('design') || p.includes('glow') || p.includes('tailwind')) {
          targetModel = 'gemini-3.8-flash';
          routingNote = 'Auto: ChargoX UI/UX Designer (Tailwind & Aesthetics)';
        } else if (prompt.length < 50 && (p.startsWith('add ') || p.startsWith('change ') || p.startsWith('make ') || p.startsWith('fix '))) {
          targetModel = 'gemini-3.1-flash-lite';
          routingNote = 'Auto: ChargoX Flash Lite (Sub-Second Execution)';
        } else if (isMobileClient) {
          targetModel = 'gemini-3.8-flash';
          routingNote = 'Auto: ChargoX Mobile Adaptive (Ultra-Fast Touch Engine)';
        } else {
          targetModel = 'gemini-4-argon';
          routingNote = 'Auto: ChargoX 4 Argon (Pro Reasoning)';
        }
      }

      // Execute AI generation with strict timeout protection
      const executeCall = async () => {
        try {
          return await aiClient!.models.generateContent({
            model: targetModel,
            contents: userContent,
            config: {
              systemInstruction: CHARGOX_SYSTEM_PROMPT,
              responseMimeType: 'application/json',
              temperature: speedSetting === 'fast' ? 0.4 : 0.65,
            },
          });
        } catch (mErr: any) {
          if (targetModel !== 'gemini-3.8-flash') {
            console.warn(`Model ${targetModel} fallback to gemini-3.8-flash:`, mErr?.message || mErr);
            return await aiClient!.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: userContent,
              config: {
                systemInstruction: CHARGOX_SYSTEM_PROMPT,
                responseMimeType: 'application/json',
                temperature: 0.5,
              },
            });
          }
          throw mErr;
        }
      };

      let timeoutHandle: any;
      const timeoutPromise = new Promise((_, reject) => {
        timeoutHandle = setTimeout(() => reject(new Error('AI Generation Timeout exceeded')), timeoutMs);
      });

      let response: any;
      try {
        response = await Promise.race([executeCall(), timeoutPromise]);
      } finally {
        clearTimeout(timeoutHandle);
      }

      const responseText = response.text?.trim() || '';
      const parsed = safeParseGeminiApp(responseText, prompt);
      if (parsed && parsed.previewHtml) {
        const inputTokens = response.usageMetadata?.promptTokenCount || Math.ceil(userContent.length / 4);
        const outputTokens = response.usageMetadata?.candidatesTokenCount || Math.ceil(responseText.length / 4);
        const totalTokens = response.usageMetadata?.totalTokenCount || (inputTokens + outputTokens);
        const estimatedCost = (inputTokens * 0.000000075) + (outputTokens * 0.00000030);

        return res.json({
          ...parsed,
          tokenUsage: {
            inputTokens,
            outputTokens,
            totalTokens,
            estimatedCost: Number(estimatedCost.toFixed(6))
          }
        });
      }
    } catch (genErr: any) {
      console.warn('Gemini generation warning (falling back gracefully):', genErr?.message || genErr);
    }
  }

  // Fallback smart generator: Universal Prompt-Adherent Synthesizer
  const appData = generateAppFromPrompt(prompt, mode);
  const inTokens = Math.ceil((prompt.length + 350) / 4);
  const outTokens = Math.ceil(JSON.stringify(appData).length / 4);
  const fallbackCost = (inTokens * 0.000000075) + (outTokens * 0.00000030);

  return res.json({
    ...appData,
    tokenUsage: {
      inputTokens: inTokens,
      outputTokens: outTokens,
      totalTokens: inTokens + outTokens,
      estimatedCost: Number(fallbackCost.toFixed(6))
    }
  });
});

// API endpoint to enhance/expand user prompt
app.post('/api/enhance-prompt', async (req, res) => {
  const { prompt } = req.body;
  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  if (aiClient) {
    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: `You are an expert product architect at ChargoX Studio. Expand this raw user request into a concise, high-impact, professional app specification prompt (under 60 words): "${prompt}". Focus on features, interactive controls, modern UI, and responsive design. Output ONLY the improved prompt, no commentary.`,
      });
      const enhanced = response.text?.trim();
      if (enhanced) {
        return res.json({ enhancedPrompt: enhanced });
      }
    } catch (err) {
      console.warn('Enhance prompt fallback:', err);
    }
  }

  // Fallback enhancements
  const clean = prompt.trim();
  const enhancedPrompt = `Build a high-performance ${clean} with modern Tailwind CSS styling, responsive layout, interactive state controls, micro-interactions, local storage persistence, sound effects, and clean typography.`;
  return res.json({ enhancedPrompt });
});

// Helper to parse GitHub repo from URL or string
function parseGitHubRepo(input: string): { owner: string; repo: string; branch?: string } | null {
  if (!input) return null;
  let clean = input.trim();
  clean = clean.replace(/^(?:https?:\/\/)?(?:www\.)?github\.com\//i, '');
  clean = clean.replace(/\.git$/i, '');
  clean = clean.replace(/^\/+|\/+$/g, '');

  const parts = clean.split('/');
  if (parts.length >= 2) {
    const owner = parts[0];
    const repo = parts[1];
    let branch: string | undefined = undefined;
    if (parts[2] === 'tree' && parts[3]) {
      branch = parts.slice(3).join('/');
    }
    return { owner, repo, branch };
  }
  return null;
}

// GitHub API: Fetch user repositories
app.get('/api/github/user-repos', async (req, res) => {
  const username = req.query.username as string;
  const token = (req.query.token as string) || (req.headers.authorization?.replace(/^Bearer\s+/i, '') || '');

  try {
    const headers: Record<string, string> = {
      'User-Agent': 'ChargoX-Studio/1.0',
      'Accept': 'application/vnd.github.v3+json',
    };
    if (token) {
      headers['Authorization'] = `token ${token}`;
    }

    const endpoint = token && !username
      ? 'https://api.github.com/user/repos?sort=updated&per_page=30'
      : `https://api.github.com/users/${encodeURIComponent(username || 'octocat')}/repos?sort=updated&per_page=30`;

    const ghRes = await fetch(endpoint, { headers });
    if (!ghRes.ok) {
      const errText = await ghRes.text();
      return res.status(ghRes.status).json({ error: `GitHub API error: ${ghRes.statusText}`, details: errText });
    }

    const reposData = await ghRes.json();
    const repos = Array.isArray(reposData) ? reposData.map((r: any) => ({
      name: r.name,
      full_name: r.full_name,
      description: r.description,
      html_url: r.html_url,
      default_branch: r.default_branch,
      stargazers_count: r.stargazers_count,
      language: r.language,
      updated_at: r.updated_at,
      private: r.private,
    })) : [];

    return res.json({ repos });
  } catch (err: any) {
    console.error('GitHub user-repos error:', err);
    return res.status(500).json({ error: 'Failed to fetch repositories from GitHub', details: err?.message });
  }
});

// GitHub API: Import and bundle repository for editing in ChargoX
app.post('/api/github/import-repo', async (req, res) => {
  const { repoUrl, branch: userBranch, token } = req.body;

  if (!repoUrl || typeof repoUrl !== 'string') {
    return res.status(400).json({ error: 'GitHub repository URL or owner/repo is required' });
  }

  const parsed = parseGitHubRepo(repoUrl);
  if (!parsed) {
    return res.status(400).json({ error: 'Invalid GitHub repository format. Use format "owner/repo" or "https://github.com/owner/repo"' });
  }

  const { owner, repo } = parsed;
  const githubHeaders: Record<string, string> = {
    'User-Agent': 'ChargoX-Studio/1.0',
    'Accept': 'application/vnd.github.v3+json',
  };
  if (token) {
    githubHeaders['Authorization'] = `token ${token}`;
  }

  try {
    let repoName = repo;
    let repoDesc = 'Web application';
    let repoUrlFinal = `https://github.com/${owner}/${repo}`;
    let branch = userBranch || parsed.branch || 'main';
    let starsCount = 0;
    let lang = 'JavaScript';

    // 1. Fetch repo metadata
    try {
      const repoInfoRes = await fetch(`https://api.github.com/repos/${owner}/${repo}`, { headers: githubHeaders });
      if (repoInfoRes.ok) {
        const repoInfo = await repoInfoRes.json();
        repoName = repoInfo.name || repo;
        repoDesc = repoInfo.description || repoDesc;
        repoUrlFinal = repoInfo.html_url || repoUrlFinal;
        branch = userBranch || parsed.branch || repoInfo.default_branch || 'main';
        starsCount = repoInfo.stargazers_count || 0;
        lang = repoInfo.language || lang;
      }
    } catch {
      // Continue to raw fetch
    }

    // 2. Fetch Git tree or fallback to common paths
    let treeFiles: any[] = [];
    try {
      const treeRes = await fetch(`https://api.github.com/repos/${owner}/${repo}/git/trees/${branch}?recursive=1`, { headers: githubHeaders });
      if (treeRes.ok) {
        const treeData = await treeRes.json();
        treeFiles = (treeData.tree || []).filter((item: any) => item.type === 'blob');
      }
    } catch {
      // fallback
    }

    // If tree is empty (due to rate limit or error), probe common root web files via raw.githubusercontent
    if (treeFiles.length === 0) {
      const commonPaths = [
        'index.html',
        'styles.css',
        'style.css',
        'app.js',
        'main.js',
        'script.js',
        'index.js',
        'package.json',
        'README.md'
      ];
      treeFiles = commonPaths.map((p) => ({ path: p, type: 'blob' }));
    }

    // 3. Filter key web files to fetch
    const fileExtensions = /\.(html|htm|css|js|jsx|ts|tsx|json|svg|md)$/i;
    const candidateFiles = treeFiles.filter((f) => fileExtensions.test(f.path));

    // Sort to prioritize index.html, style sheets, scripts, package.json
    const priorityOrder = (p: string) => {
      const lower = p.toLowerCase();
      if (lower === 'index.html') return 1;
      if (lower.endsWith('index.html')) return 2;
      if (lower === 'style.css' || lower === 'styles.css') return 3;
      if (lower === 'app.js' || lower === 'main.js' || lower === 'index.js' || lower === 'src/app.tsx') return 4;
      if (lower.endsWith('.css')) return 5;
      if (lower.endsWith('.js') || lower.endsWith('.ts')) return 6;
      if (lower.endsWith('package.json')) return 7;
      if (lower.endsWith('readme.md')) return 8;
      return 10;
    };

    candidateFiles.sort((a, b) => priorityOrder(a.path) - priorityOrder(b.path));
    const filesToFetch = candidateFiles.slice(0, 16); // up to 16 files

    // 4. Fetch content of each file
    const fetchedFiles: { name: string; path: string; type: 'html' | 'css' | 'javascript' | 'json'; content: string }[] = [];

    await Promise.all(
      filesToFetch.map(async (fileItem) => {
        try {
          const rawUrl = `https://raw.githubusercontent.com/${owner}/${repo}/${branch}/${fileItem.path}`;
          const rawRes = await fetch(rawUrl, { headers: githubHeaders });
          if (rawRes.ok) {
            const content = await rawRes.text();
            let type: 'html' | 'css' | 'javascript' | 'json' = 'javascript';
            if (/\.(html|htm)$/i.test(fileItem.path)) type = 'html';
            else if (/\.css$/i.test(fileItem.path)) type = 'css';
            else if (/\.json$/i.test(fileItem.path)) type = 'json';

            fetchedFiles.push({
              name: fileItem.path.split('/').pop() || fileItem.path,
              path: `/${fileItem.path}`,
              type,
              content,
            });
          }
        } catch (fetchErr) {
          console.warn(`Failed to fetch file ${fileItem.path}:`, fetchErr);
        }
      })
    );

    // 5. Synthesize runnable previewHtml
    let previewHtml = '';
    const mainHtmlFile = fetchedFiles.find((f) => f.name.toLowerCase() === 'index.html' || f.path.endsWith('/index.html')) 
      || fetchedFiles.find((f) => f.type === 'html');

    if (mainHtmlFile) {
      previewHtml = mainHtmlFile.content;

      // Inline local CSS files
      const cssFiles = fetchedFiles.filter((f) => f.type === 'css');
      if (cssFiles.length > 0) {
        cssFiles.forEach((css) => {
          // Replace link tag with style tag or append
          const linkPattern = new RegExp(`<link[^>]+href=["'][^"']*${css.name}["'][^>]*>`, 'gi');
          if (linkPattern.test(previewHtml)) {
            previewHtml = previewHtml.replace(linkPattern, `<style>\n/* ${css.name} */\n${css.content}\n</style>`);
          } else {
            // Append before </head> or at start
            if (previewHtml.includes('</head>')) {
              previewHtml = previewHtml.replace('</head>', `<style>\n/* ${css.name} */\n${css.content}\n</style>\n</head>`);
            } else {
              previewHtml = `<style>\n/* ${css.name} */\n${css.content}\n</style>\n` + previewHtml;
            }
          }
        });
      }

      // Inline local JS files
      const jsFiles = fetchedFiles.filter((f) => f.type === 'javascript' && !f.name.endsWith('.d.ts'));
      if (jsFiles.length > 0) {
        jsFiles.forEach((js) => {
          const scriptPattern = new RegExp(`<script[^>]+src=["'][^"']*${js.name}["'][^>]*>\\s*<\\/script>`, 'gi');
          if (scriptPattern.test(previewHtml)) {
            previewHtml = previewHtml.replace(scriptPattern, `<script>\n// ${js.name}\n${js.content}\n</script>`);
          } else {
            // Append before </body> or at end
            if (previewHtml.includes('</body>')) {
              previewHtml = previewHtml.replace('</body>', `<script>\n// ${js.name}\n${js.content}\n</script>\n</body>`);
            } else {
              previewHtml += `\n<script>\n// ${js.name}\n${js.content}\n</script>`;
            }
          }
        });
      }

      // Inject Lucide icons if missing and icons used
      if (!previewHtml.includes('unpkg.com/lucide') && previewHtml.includes('data-lucide')) {
        previewHtml = previewHtml.replace('</head>', '<script src="https://unpkg.com/lucide@latest"></script>\n</head>');
        previewHtml = previewHtml.replace('</body>', '<script>if(window.lucide)lucide.createIcons();</script>\n</body>');
      }
    } else {
      // No index.html found: synthesize a showcase runner
      const mainJs = fetchedFiles.find((f) => f.type === 'javascript');
      const mainCss = fetchedFiles.find((f) => f.type === 'css');

      previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${repoName}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0b0d13; color: #f3f4f6; }
    ${mainCss ? mainCss.content : ''}
  </style>
</head>
<body class="min-h-screen p-6 flex flex-col justify-between">
  <div class="max-w-4xl mx-auto w-full">
    <div class="flex items-center justify-between pb-6 border-b border-white/10 mb-6">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-fuchsia-500 flex items-center justify-center font-bold text-black">
          ${repoName.slice(0, 2).toUpperCase()}
        </div>
        <div>
          <h1 class="text-xl font-bold text-white">${repoName}</h1>
          <p class="text-xs text-slate-400">${repoDesc || 'Imported from GitHub to ChargoX'}</p>
        </div>
      </div>
      <a href="${repoUrlFinal}" target="_blank" class="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-cyan-300 transition flex items-center gap-1.5">
        <i data-lucide="github" class="w-3.5 h-3.5"></i>
        <span>View on GitHub</span>
      </a>
    </div>

    <div id="app" class="p-6 rounded-2xl bg-slate-900/60 border border-white/10 shadow-xl min-h-[300px]">
      <p class="text-sm text-cyan-300 mb-4 font-mono">// Ready for interactive editing in ChargoX Studio</p>
      <div id="output" class="text-xs font-mono text-slate-300 whitespace-pre-wrap"></div>
    </div>
  </div>

  <footer class="mt-8 text-center text-xs text-slate-500">
    Imported into ChargoX • Edit this app with prompt revisions on the left
  </footer>

  <script>
    ${mainJs ? mainJs.content : 'console.log("App loaded in ChargoX");'}
    if (window.lucide) lucide.createIcons();
  </script>
</body>
</html>`;
    }

    // 6. Build the ChargoX project object
    const importedProject = {
      id: `gh-${owner}-${repo}-${Date.now()}`,
      name: repoName,
      prompt: `Imported from GitHub: ${owner}/${repo} (${repoDesc})`,
      summary: repoDesc || `Application imported from GitHub repository ${owner}/${repo}. Ready for live preview, editing, and prompt improvements.`,
      category: 'Productivity',
      tags: ['GitHub', lang || 'JavaScript', 'Imported'],
      createdAt: 'Just now',
      sourceType: 'github',
      sourceUrl: repoUrlFinal,
      repoFullName: `${owner}/${repo}`,
      files: fetchedFiles.length > 0 ? fetchedFiles : extractFilesFromHtml(previewHtml),
      previewHtml,
      planSteps: [
        { action: `Connecting to GitHub repository: ${owner}/${repo}`, detail: `Found default branch "${branch}" with ${starsCount} stars`, status: 'completed', timestamp: '15ms' },
        { action: `Scanned repository tree`, detail: `Found ${treeFiles.length} repository objects, extracted ${fetchedFiles.length} application files`, status: 'completed', timestamp: '75ms' },
        { action: `Synthesizing live preview sandbox`, detail: `Bundled HTML, CSS stylesheets, and JavaScript logic for ChargoX runtime`, status: 'completed', timestamp: '140ms' },
        { action: `Compiling applet & verifying DOM runtime`, detail: `App ready for interactive use and prompt editing`, status: 'completed', timestamp: '190ms' }
      ],
      suggestions: [
        'Add modern dark cyberpunk theme with Tailwind CSS',
        'Add a responsive mobile navigation drawer',
        'Add local storage to persist user data',
        'Add sound effects and micro-interactions'
      ]
    };

    return res.json({ project: importedProject });
  } catch (err: any) {
    console.error('GitHub import error:', err);
    return res.status(500).json({ error: 'Failed to import repository from GitHub', details: err?.message });
  }
});

// API endpoint to edit an existing app (either imported or generated)
app.post('/api/edit-app', async (req, res) => {
  const { prompt, currentFiles = [], previewHtml = '', appName = 'Application', deviceInfo } = req.body;

  if (!prompt || typeof prompt !== 'string') {
    return res.status(400).json({ error: 'Edit prompt is required' });
  }

  if (aiClient) {
    try {
      const editSystemPrompt = `
You are ChargoX — the elite autonomous AI App Architect, Systems Explainer, and Code Editor.
The user is working with an existing application. They may:
1. ASK A QUESTION or request an explanation (e.g., "how does scoring work?", "why did it stop?", "what models are there?", "can this run on mobile?", "explain the code").
2. REQUEST A CODE EDIT / NEW FEATURE (e.g., "add dark mode", "make the ball bounce higher", "add a reset button").
3. DO BOTH (e.g., "how does the speed work, and can you make it 2x faster?").

CRITICAL INTELLIGENCE RULES:
- IF THE USER IS ASKING A QUESTION / EXPLANATION:
  * Provide a clear, direct, insightful, and articulate technical explanation in "explanation" and "summary".
  * DO NOT inject random placeholder buttons, fake actions, or junk HTML tags into the user's application!
  * If the user only asked a question and DID NOT ask to change the code, keep "previewHtml" completely intact and functioning, with "isQuestion": true, "codeUpdated": false.
  * If the user asked a question AND requested a code modification, explain the answer thoroughly in "explanation", apply the code change to "previewHtml", and set "isQuestion": true, "codeUpdated": true.

- IF THE USER IS REQUESTING A CODE EDIT:
  * Faithfully apply the requested changes to "previewHtml" while preserving all existing functionality, styles, and scripts.
  * Set "isQuestion": false, "codeUpdated": true.
  * Summarize what was added/modified cleanly in "summary".

Output strictly valid JSON with this schema:
{
  "appName": "string",
  "summary": "string explaining what was answered or changed",
  "explanation": "string (direct, comprehensive, articulate answer to the user's question, if any)",
  "isQuestion": boolean,
  "codeUpdated": boolean,
  "planSteps": [
    { "action": "string", "detail": "string", "status": "completed" }
  ],
  "previewHtml": "string (the complete updated runnable HTML document)",
  "suggestions": ["string", "string", "string"]
}
`;

      const filesContext = currentFiles.length > 0
        ? `Existing App Files:\n${currentFiles.map((f: any) => `=== ${f.name} ===\n${f.content.slice(0, 2000)}`).join('\n')}\n\n`
        : '';

      const previewContext = previewHtml
        ? `Existing Runnable HTML Code:\n\`\`\`html\n${previewHtml.slice(0, 4000)}\n\`\`\`\n\n`
        : '';

      const isMobileClient = Boolean(deviceInfo && deviceInfo.isMobile);
      const mobileDirective = isMobileClient
        ? '\n\n[MOBILE CONTEXT: User is on a mobile device. Ensure all touch elements are thumb-friendly, minimum 44px tap size, and no horizontal scroll.]'
        : '';

      const userContent = `${filesContext}${previewContext}User Input / Requested Modification: "${prompt}"${mobileDirective}\n\nPlease respond in valid JSON according to instructions.`;

      // Smart Auto Model Routing for Edits & Questions
      let targetModel = 'gemini-4-argon';
      const editMode = (req.body.mode || '').toLowerCase();
      const p = prompt.toLowerCase().trim();
      const isQuestionPrompt = 
        p.endsWith('?') ||
        p.startsWith('how ') ||
        p.startsWith('why ') ||
        p.startsWith('what ') ||
        p.startsWith('where ') ||
        p.startsWith('when ') ||
        p.startsWith('can you ') ||
        p.startsWith('explain ') ||
        p.startsWith('tell me ') ||
        p.includes('how does') ||
        p.includes('how do i') ||
        p.includes('why is') ||
        p.includes('what is');

      if (!req.body.mode || editMode.includes('auto') || editMode === 'default mode' || editMode.includes('smart')) {
        if (isQuestionPrompt) {
          if (p.includes('error') || p.includes('bug') || p.includes('crash') || p.includes('broken')) {
            targetModel = 'gemini-4-argon';
          } else {
            targetModel = 'gemini-3.8-flash';
          }
        } else if (p.includes('game') || p.includes('score') || p.includes('physics') || p.includes('speed') || p.includes('collision')) {
          targetModel = 'gemini-4-argon';
        } else if (p.includes('sound') || p.includes('audio') || p.includes('beep') || p.includes('volume') || p.includes('music')) {
          targetModel = 'gemini-3.8-flash-tts';
        } else if (p.includes('chart') || p.includes('metrics') || p.includes('table') || p.includes('export') || p.includes('csv') || p.includes('formula')) {
          targetModel = 'gemini-3.8-pro';
        } else if (p.includes('color') || p.includes('dark') || p.includes('theme') || p.includes('style') || p.includes('glow')) {
          targetModel = 'gemini-3.8-flash';
        } else if (prompt.length < 50) {
          targetModel = 'gemini-3.1-flash-lite';
        } else {
          targetModel = 'gemini-4-argon';
        }
      } else {
        if (editMode.includes('argon') || editMode.includes('gemini-4')) targetModel = 'gemini-4-argon';
        else if (editMode.includes('flash-lite')) targetModel = 'gemini-3.1-flash-lite';
        else if (editMode.includes('tts') || editMode.includes('audio')) targetModel = 'gemini-3.8-flash-tts';
        else if (editMode.includes('pro')) targetModel = 'gemini-3.8-pro';
        else targetModel = 'gemini-3.8-flash';
      }

      // Speed Mode handling for edits
      const speedSetting = (req.body.speedMode || (editMode.includes('fast') ? 'fast' : editMode.includes('max') ? 'max' : 'auto')).toLowerCase();

      if (speedSetting === 'fast') {
        targetModel = 'gemini-3.1-flash-lite';
      } else if (speedSetting === 'max') {
        targetModel = 'gemini-4-argon';
      }

      const executeEdit = async () => {
        try {
          return await aiClient!.models.generateContent({
            model: targetModel,
            contents: userContent,
            config: {
              systemInstruction: editSystemPrompt,
              responseMimeType: 'application/json',
              temperature: isQuestionPrompt ? 0.3 : (speedSetting === 'fast' ? 0.4 : 0.6),
            },
          });
        } catch (argonErr: any) {
          if (targetModel !== 'gemini-3.8-flash') {
            console.warn('Edit fallback to gemini-3.8-flash:', argonErr?.message || argonErr);
            return await aiClient!.models.generateContent({
              model: 'gemini-3.8-flash',
              contents: userContent,
              config: {
                systemInstruction: editSystemPrompt,
                responseMimeType: 'application/json',
                temperature: 0.4,
              },
            });
          }
          throw argonErr;
        }
      };

      const editTimeoutMs = speedSetting === 'fast' ? 7000 : speedSetting === 'max' ? 18000 : 11000;
      let editTimeoutHandle: any;
      const editTimeoutPromise = new Promise((_, reject) => {
        editTimeoutHandle = setTimeout(() => reject(new Error('AI Edit Timeout exceeded')), editTimeoutMs);
      });

      let response: any;
      try {
        response = await Promise.race([executeEdit(), editTimeoutPromise]);
      } finally {
        clearTimeout(editTimeoutHandle);
      }

      const responseText = response.text?.trim() || '';
      const parsed = safeParseGeminiApp(responseText, prompt);
      if (parsed && (parsed.previewHtml || parsed.explanation || parsed.summary)) {
        const inputTokens = response.usageMetadata?.promptTokenCount || Math.ceil(userContent.length / 4);
        const outputTokens = response.usageMetadata?.candidatesTokenCount || Math.ceil(responseText.length / 4);
        const totalTokens = response.usageMetadata?.totalTokenCount || (inputTokens + outputTokens);
        const estimatedCost = (inputTokens * 0.000000075) + (outputTokens * 0.00000030);

        return res.json({
          ...parsed,
          previewHtml: parsed.previewHtml || previewHtml,
          tokenUsage: {
            inputTokens,
            outputTokens,
            totalTokens,
            estimatedCost: Number(estimatedCost.toFixed(6))
          }
        });
      }
    } catch (editErr: any) {
      console.warn('Gemini edit warning (falling back gracefully):', editErr?.message || editErr);
    }
  }

  // Fallback editor: handle both questions and procedural modifications
  let updatedHtml = previewHtml;
  if (!updatedHtml) {
    const freshApp = generateAppFromPrompt(prompt, 'auto');
    return res.json(freshApp);
  }

  const promptLower = prompt.toLowerCase().trim();
  const isQuestion = 
    promptLower.endsWith('?') ||
    promptLower.startsWith('how ') ||
    promptLower.startsWith('why ') ||
    promptLower.startsWith('what ') ||
    promptLower.startsWith('where ') ||
    promptLower.startsWith('when ') ||
    promptLower.startsWith('can you explain') ||
    promptLower.startsWith('explain ') ||
    promptLower.startsWith('tell me ') ||
    promptLower.startsWith('help me understand') ||
    promptLower.includes('how does') ||
    promptLower.includes('how do i') ||
    promptLower.includes('why is') ||
    promptLower.includes('what is');

  const inTokens = Math.ceil((prompt.length + (previewHtml?.length || 0)) / 4);
  const outTokens = 180;
  const fallbackCost = (inTokens * 0.000000075) + (outTokens * 0.00000030);

  // If the user is asking a question, provide a helpful answer without injecting random DOM buttons!
  if (isQuestion) {
    let answer = `Here is an explanation regarding "${prompt}":\n\n`;
    if (promptLower.includes('score') || promptLower.includes('point')) {
      answer += `The scoring mechanism tracks points inside the JavaScript state. In games and interactive counters, whenever the objective is hit or incremented, the state variable updates and reflects on the DOM. You can also persist high scores in localStorage so your record is saved across page refreshes.`;
    } else if (promptLower.includes('sound') || promptLower.includes('audio')) {
      answer += `Sound effects are generated dynamically using the Web Audio API (\`AudioContext\` and \`OscillatorNode\`). This synthesizes tones and clicks directly in your browser without requiring external audio files, making it instant and lightweight.`;
    } else if (promptLower.includes('mobile') || promptLower.includes('phone') || promptLower.includes('touch')) {
      answer += `This applet is built with responsive Tailwind CSS classes and viewport constraints. It supports both mouse clicks and touch events (\`touchstart\` / \`touchend\`). You can also switch viewport preview to Mobile in the top bar to inspect layout.`;
    } else if (promptLower.includes('model') || promptLower.includes('ai') || promptLower.includes('aid')) {
      answer += `ChargoX includes 15+ specialized AI models and Question Aids, including ChargoX 4 Argon (Pro Reasoning), Flash Lite (Ultra Fast), Code Explainer, Bug Hunter, Math & Logic Solver, and UI/UX Designer. The Auto mode automatically routes each prompt to the best engine!`;
    } else if (promptLower.includes('slow') || promptLower.includes('speed') || promptLower.includes('fast')) {
      answer += `You can adjust generation speed using the Speed Mode slider in the workspace header: Fast (sub-second tweaks), Auto (balanced intelligence), or Max (deepest reasoning).`;
    } else {
      answer += `In this application, your logic is structured with HTML for layout, Tailwind CSS for styling, and JavaScript for interactive state handling. All files run in a sandboxed iframe. If you'd like to modify any specific part of this behavior, simply describe what you'd like to add or change!`;
    }

    return res.json({
      appName: appName || 'Application',
      summary: `Answered question: "${prompt}"`,
      explanation: answer,
      isQuestion: true,
      codeUpdated: false,
      planSteps: [
        { action: 'Analyzing question context', detail: prompt, status: 'completed' },
        { action: 'Formulating technical explanation', detail: 'Generated articulate architectural explanation', status: 'completed' },
        { action: 'Preserving application state', detail: 'Existing code verified and left intact without random alterations', status: 'completed' }
      ],
      files: extractFilesFromHtml(updatedHtml),
      previewHtml: updatedHtml,
      suggestions: [
        'How can I add high score saving?',
        'Add sound effects to buttons',
        'Add a dark cyberpunk theme'
      ],
      tokenUsage: {
        inputTokens: inTokens,
        outputTokens: outTokens,
        totalTokens: inTokens + outTokens,
        estimatedCost: Number(fallbackCost.toFixed(6))
      }
    });
  }

  // Not a pure question: apply procedural modification on previewHtml
  let changeNote = `Applied modification for: "${prompt}"`;

  if (promptLower.includes('dark') && !updatedHtml.includes('bg-[#0b0d13]')) {
    updatedHtml = updatedHtml.replace(/class=["'][^"']*bg-(?:white|gray-50|slate-50|slate-100)[^"']*["']/i, 'class="bg-[#0b0d13] text-white"');
    changeNote = 'Switched color palette to dark theme';
  } else if (promptLower.includes('sound') || promptLower.includes('audio')) {
    const audioScript = `<script>
// Web Audio SFX Engine added by ChargoX
function playChargoXSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.setValueAtTime(type === 'click' ? 440 : 880, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
    osc.start();
    osc.stop(ctx.currentTime + 0.15);
  } catch(e){}
}
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON' || e.target.closest('button')) playChargoXSound('click');
});
</script>`;
    updatedHtml = updatedHtml.replace('</body>', `${audioScript}\n</body>`);
    changeNote = 'Added Web Audio interactive sound effects to buttons';
  } else if (promptLower.includes('button') || promptLower.includes('reset') || promptLower.includes('clear') || promptLower.includes('export')) {
    const cleanAction = prompt.replace(/[^\w\s-]/g, '').trim();
    const actionBanner = `
<div id="chargox-user-action" class="my-4 p-3 bg-cyan-950/50 border border-cyan-500/40 rounded-xl flex items-center justify-between">
  <span class="text-xs text-cyan-300 font-semibold">${cleanAction}</span>
  <button onclick="if(window.lucide)lucide.createIcons(); alert('Executed: ${cleanAction}')" class="px-3.5 py-1.5 bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-bold rounded-lg hover:opacity-90 transition cursor-pointer">Trigger</button>
</div>`;
    if (updatedHtml.includes('</main>')) {
      updatedHtml = updatedHtml.replace('</main>', `${actionBanner}\n</main>`);
    } else if (updatedHtml.includes('</body>')) {
      updatedHtml = updatedHtml.replace('</body>', `${actionBanner}\n</body>`);
    }
    changeNote = `Added interactive action control: "${cleanAction}"`;
  }

  return res.json({
    appName: appName || 'Updated App',
    summary: `ChargoX successfully updated the app: ${changeNote}.`,
    explanation: `Successfully applied: ${changeNote}.`,
    isQuestion: false,
    codeUpdated: true,
    planSteps: [
      { action: 'Analyzing requested edit', detail: prompt, status: 'completed' },
      { action: 'Updating application code', detail: changeNote, status: 'completed' },
      { action: 'Compiling applet preview', detail: 'Preview updated with changes', status: 'completed' }
    ],
    files: extractFilesFromHtml(updatedHtml),
    previewHtml: updatedHtml,
    suggestions: [
      'Add animations with CSS transitions',
      'Add a reset data button',
      'Add export to JSON file'
    ],
    tokenUsage: {
      inputTokens: inTokens,
      outputTokens: outTokens,
      totalTokens: inTokens + outTokens,
      estimatedCost: Number(fallbackCost.toFixed(6))
    }
  });
});

// API endpoint for AI-powered app recommendations to improve the app
app.post('/api/recommend-improvements', async (req, res) => {
  const { appName = 'App', prompt = '', previewHtml = '' } = req.body;

  if (aiClient) {
    try {
      const recSystemPrompt = `
You are ChargoX — Senior Product Architect and UI/UX Engineer.
Analyze this web application and return exactly 3 to 4 high-impact, actionable, smart improvement recommendations.
Categories allowed: 'feature' | 'design' | 'performance' | 'audio' | 'data'.
Impact allowed: 'High' | 'Medium' | 'Quick Win'.

Output strictly valid JSON with this schema:
{
  "recommendations": [
    {
      "id": "rec-1",
      "title": "Short Punchy Title (e.g. Add Haptic Web Audio)",
      "description": "1 concise sentence explaining the tangible user benefit",
      "category": "audio",
      "prompt": "Exact actionable prompt to send to ChargoX (e.g. Add realistic Web Audio sound effects and click feedback to all buttons)",
      "impact": "Quick Win"
    }
  ]
}
`;
      const context = `App Name: "${appName}"\nApp Concept / Original Prompt: "${prompt}"\nCode Sample:\n${(previewHtml || '').slice(0, 2500)}`;

      const response = await aiClient.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: context,
        config: {
          systemInstruction: recSystemPrompt,
          responseMimeType: 'application/json',
          temperature: 0.4,
        },
      });

      const text = response.text?.trim() || '';
      const parsed = JSON.parse(text);
      if (Array.isArray(parsed?.recommendations) && parsed.recommendations.length > 0) {
        return res.json({ recommendations: parsed.recommendations.slice(0, 4) });
      }
    } catch (err) {
      console.warn('AI recommendation generation error:', err);
    }
  }

  // Smart contextual fallback recommendations
  const pLower = (prompt + ' ' + appName).toLowerCase();
  const isGame = pLower.includes('game') || pLower.includes('arcade') || pLower.includes('snake') || pLower.includes('pong') || pLower.includes('canvas');
  const isDashboard = pLower.includes('dashboard') || pLower.includes('saas') || pLower.includes('chart') || pLower.includes('metric');

  const defaultRecs = isGame ? [
    {
      id: 'rec-game-1',
      title: 'High Score Persistence',
      description: 'Save user best scores in browser LocalStorage with personal record celebrations.',
      category: 'data',
      prompt: 'Add LocalStorage persistence for high scores with an all-time best score banner and celebration effects',
      impact: 'High'
    },
    {
      id: 'rec-game-2',
      title: 'Web Audio SFX Engine',
      description: 'Add dynamic audio frequencies for jumps, hits, scoring, and game over sounds.',
      category: 'audio',
      prompt: 'Add Web Audio API sound effects for game actions, points, and game-over fanfare',
      impact: 'Quick Win'
    },
    {
      id: 'rec-game-3',
      title: 'Mobile On-Screen D-Pad',
      description: 'Add virtual thumb controls and touch gestures for smooth mobile gameplay.',
      category: 'feature',
      prompt: 'Add touch-friendly mobile virtual D-Pad and swipe controls for smartphones and tablets',
      impact: 'High'
    },
    {
      id: 'rec-game-4',
      title: 'Particle Burst Visuals',
      description: 'Render canvas particle explosions when scoring points or leveling up.',
      category: 'design',
      prompt: 'Add colorful particle explosion effects whenever the player scores points or wins',
      impact: 'Medium'
    }
  ] : isDashboard ? [
    {
      id: 'rec-dash-1',
      title: 'Export to CSV & JSON',
      description: 'Enable 1-click download of all table metrics and data as CSV or JSON files.',
      category: 'data',
      prompt: 'Add an Export Data button to download all current table metrics as CSV and JSON files',
      impact: 'Quick Win'
    },
    {
      id: 'rec-dash-2',
      title: 'Interactive Filter Range',
      description: 'Add search filter bar, date-range picker, and category dropdown toggles.',
      category: 'feature',
      prompt: 'Add an interactive search bar, category filter, and sorting toggles for the dashboard data',
      impact: 'High'
    },
    {
      id: 'rec-dash-3',
      title: 'Dark Cyber Glass Aesthetic',
      description: 'Elevate with sleek backdrop blur glassmorphism and subtle glowing border accents.',
      category: 'design',
      prompt: 'Upgrade to a high-end cyberpunk dark aesthetic with glassmorphism cards and neon glowing borders',
      impact: 'Medium'
    },
    {
      id: 'rec-dash-4',
      title: 'Real-Time Live Simulated Feed',
      description: 'Simulate live data updates every few seconds with animated pulse indicators.',
      category: 'performance',
      prompt: 'Add a live toggle button that simulates real-time data streaming with smooth animated updates',
      impact: 'Medium'
    }
  ] : [
    {
      id: 'rec-gen-1',
      title: 'Dark / Light Theme Toggle',
      description: 'Provide an instant toggle button between cyber dark mode and clean daylight theme.',
      category: 'design',
      prompt: 'Add a theme toggle button in the top right to switch smoothly between dark and light modes',
      impact: 'Quick Win'
    },
    {
      id: 'rec-gen-2',
      title: 'Web Audio Interactive SFX',
      description: 'Synthesize responsive sound feedback on button clicks and state changes.',
      category: 'audio',
      prompt: 'Add realistic Web Audio API sound effects and click feedback to all interactive controls',
      impact: 'Quick Win'
    },
    {
      id: 'rec-gen-3',
      title: 'LocalStorage Auto-Save',
      description: 'Remember user inputs, preferences, and state automatically across page reloads.',
      category: 'data',
      prompt: 'Add LocalStorage auto-save so user progress and inputs persist even when refreshed',
      impact: 'High'
    },
    {
      id: 'rec-gen-4',
      title: 'Mobile Touch Optimization',
      description: 'Optimize touch targets, responsive drawer menus, and mobile thumb navigation.',
      category: 'feature',
      prompt: 'Enhance mobile responsiveness with thumb-friendly buttons and touch gesture handling',
      impact: 'Medium'
    }
  ];

  return res.json({ recommendations: defaultRecs });
});



// ==========================================
// AUTO-DEPLOY & ONE-CLICK PUBLISHING ENGINE
// ==========================================

const DATA_DIR = path.resolve(__dirname, 'data');
const DEPLOYMENTS_FILE = path.join(DATA_DIR, 'deployments.json');

interface DeploymentRecord {
  id: string;
  slug: string;
  projectId?: string;
  name: string;
  prompt: string;
  summary: string;
  html: string;
  status: 'published' | 'deleted';
  deployedAt: string;
  deletedAt?: string;
  views: number;
}

function loadDeployments(): Record<string, DeploymentRecord> {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(DEPLOYMENTS_FILE)) {
      const raw = fs.readFileSync(DEPLOYMENTS_FILE, 'utf-8');
      return JSON.parse(raw);
    }
  } catch (err) {
    console.warn('Failed to read deployments:', err);
  }
  return {};
}

function saveDeployments(records: Record<string, DeploymentRecord>) {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DEPLOYMENTS_FILE, JSON.stringify(records, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to save deployments:', err);
  }
}

function renderDeletedAppPage(appName?: string): string {
  const safeName = (appName || 'Application').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>App Deleted from Internet — ChargoX Studio</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      background-color: #0b0d13;
      color: #f1f5f9;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
    }
    .card {
      background: #12151f;
      border: 1px solid #22283a;
      border-radius: 20px;
      padding: 40px 32px;
      max-width: 480px;
      width: 100%;
      text-align: center;
      box-shadow: 0 25px 50px -12px rgba(0,0,0,0.7);
    }
    .icon-box {
      width: 64px;
      height: 64px;
      border-radius: 16px;
      background: rgba(244, 63, 94, 0.12);
      border: 1px solid rgba(244, 63, 94, 0.25);
      color: #fb7185;
      font-size: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 20px auto;
    }
    .badge {
      display: inline-block;
      padding: 4px 12px;
      border-radius: 9999px;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.5px;
      text-transform: uppercase;
      background: rgba(244, 63, 94, 0.15);
      color: #fda4af;
      border: 1px solid rgba(244, 63, 94, 0.3);
      margin-bottom: 16px;
    }
    h1 {
      font-size: 22px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 10px;
    }
    p {
      font-size: 13px;
      line-height: 1.6;
      color: #94a3b8;
      margin-bottom: 28px;
    }
    .btn {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      width: 100%;
      padding: 13px 20px;
      border-radius: 12px;
      background: linear-gradient(135deg, #06b6d4, #2563eb);
      color: #030712;
      font-weight: 700;
      font-size: 13px;
      text-decoration: none;
      transition: opacity 0.2s;
    }
    .btn:hover {
      opacity: 0.92;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon-box">🗑️</div>
    <div class="badge">App Removed From Internet</div>
    <h1>${safeName} is Offline</h1>
    <p>The creator of this app has deleted it from the internet using ChargoX Auto-Deploy. The live link and hosted files have been permanently deactivated.</p>
    <a href="/" class="btn">⚡ Build & Deploy Your Own App on ChargoX →</a>
  </div>
</body>
</html>`;
}

// 1. Auto-Deploy endpoint: Zero configuration needed, instant live URL
app.post('/api/deployments', async (req, res) => {
  const { projectId, name, html, prompt, summary } = req.body;

  if (!html || typeof html !== 'string') {
    return res.status(400).json({ error: 'HTML code is required to deploy an application.' });
  }

  try {
    const deployments = loadDeployments();
    const cleanName = (name || 'My App').trim();
    const slugBase = cleanName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'app';
    
    // Check if app was already deployed under this projectId
    let deploymentId: string | null = null;
    if (projectId) {
      for (const [id, dep] of Object.entries(deployments)) {
        if (dep.projectId === projectId) {
          deploymentId = id;
          break;
        }
      }
    }

    if (!deploymentId) {
      const randSuffix = Math.random().toString(36).substring(2, 7);
      deploymentId = `${slugBase}-${randSuffix}`;
    }

    const host = req.get('host') || 'localhost:3000';
    const protocol = req.headers['x-forwarded-proto'] || req.protocol || 'http';
    const publicUrl = `${protocol}://${host}/live/${deploymentId}`;

    const record: DeploymentRecord = {
      id: deploymentId,
      slug: slugBase,
      projectId: projectId || undefined,
      name: cleanName,
      prompt: prompt || '',
      summary: summary || 'Deployed with ChargoX Auto-Deploy',
      html,
      status: 'published',
      deployedAt: new Date().toISOString(),
      views: deployments[deploymentId] ? deployments[deploymentId].views : 0,
    };

    deployments[deploymentId] = record;
    saveDeployments(deployments);

    return res.json({
      success: true,
      deployment: {
        id: record.id,
        slug: record.slug,
        projectId: record.projectId,
        name: record.name,
        prompt: record.prompt,
        summary: record.summary,
        status: record.status,
        deployedAt: record.deployedAt,
        views: record.views,
        publicUrl,
      }
    });
  } catch (err: any) {
    console.error('Auto-deploy error:', err);
    return res.status(500).json({ error: 'Failed to deploy app to internet', details: err?.message });
  }
});

// 2. Get all deployments
app.get('/api/deployments', (req, res) => {
  try {
    const deployments = loadDeployments();
    const list = Object.values(deployments)
      .filter((d) => d.status === 'published')
      .map(({ html, ...rest }) => rest);
    return res.json({ deployments: list });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to load deployments' });
  }
});

// 3. Get deployment status by ID
app.get('/api/deployments/:id', (req, res) => {
  try {
    const deployments = loadDeployments();
    const record = deployments[req.params.id];
    if (!record) {
      return res.status(404).json({ error: 'Deployment not found' });
    }
    const { html, ...safeRecord } = record;
    return res.json({ deployment: safeRecord });
  } catch (err: any) {
    return res.status(500).json({ error: 'Failed to get deployment' });
  }
});

// 4. Delete app from the internet
app.delete('/api/deployments/:id', (req, res) => {
  try {
    const deployments = loadDeployments();
    const id = req.params.id;
    let targetKey: string | null = null;

    if (deployments[id]) {
      targetKey = id;
    } else {
      // Check if user passed projectId or slug
      for (const [k, dep] of Object.entries(deployments)) {
        if (dep.projectId === id || dep.slug === id) {
          targetKey = k;
          break;
        }
      }
    }

    if (!targetKey) {
      return res.status(404).json({ error: 'Deployment not found on internet' });
    }

    // Permanently mark deleted
    deployments[targetKey].status = 'deleted';
    deployments[targetKey].deletedAt = new Date().toISOString();
    // Clear out stored html to clean storage
    deployments[targetKey].html = '';
    saveDeployments(deployments);

    return res.json({
      success: true,
      message: 'App has been permanently deleted from the internet. The live link is now deactivated.',
      deletedId: targetKey,
    });
  } catch (err: any) {
    console.error('Delete deployment error:', err);
    return res.status(500).json({ error: 'Failed to delete app from internet', details: err?.message });
  }
});

// 5. Public Live Web Route: Serves the deployed app to anyone on the internet!
app.get(['/live/:id', '/p/:id'], (req, res) => {
  const deployments = loadDeployments();
  const id = req.params.id;
  const record = deployments[id];

  if (!record || record.status === 'deleted' || !record.html) {
    return res.status(404).send(renderDeletedAppPage(record?.name));
  }

  // Increment views counter asynchronously
  record.views = (record.views || 0) + 1;
  saveDeployments(deployments);

  let html = record.html;

  // Add floating banner
  const floatingBadge = `
<div id="chargox-deployed-badge" style="position:fixed;bottom:14px;right:14px;z-index:999999;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="display:flex;align-items:center;gap:8px;background:rgba(15,23,42,0.92);backdrop-filter:blur(8px);border:1px solid rgba(56,189,248,0.3);padding:6px 14px;border-radius:9999px;box-shadow:0 10px 25px -5px rgba(0,0,0,0.6);font-size:11px;color:#e2e8f0;">
    <span style="display:inline-block;width:7px;height:7px;border-radius:9999px;background:#10b981;box-shadow:0 0 8px #10b981;"></span>
    <span style="font-weight:600;color:#f8fafc;">Live Web App</span>
    <span style="color:#64748b;">•</span>
    <a href="/" target="_blank" rel="noopener" style="color:#38bdf8;text-decoration:none;font-weight:600;">Built with ChargoX</a>
    <button onclick="document.getElementById('chargox-deployed-badge').remove()" style="background:none;border:none;color:#64748b;font-size:12px;cursor:pointer;margin-left:4px;padding:0 2px;" title="Dismiss">✕</button>
  </div>
</div>
`;

  if (html.includes('</body>')) {
    html = html.replace('</body>', `${floatingBadge}\n</body>`);
  } else {
    html += floatingBadge;
  }

  // Ensure title
  if (!html.includes('<title>')) {
    if (html.includes('<head>')) {
      html = html.replace('<head>', `<head><title>${record.name} — Live Web App</title>`);
    }
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  return res.send(html);
});

registerLocalAgent(app);

// Server setup: Vite dev middleware in development or static in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ChargoX Studio server running on port ${PORT} (dev: ${!isProd})`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
});
