import { AppProject } from '../types';

export const PRESET_PROJECTS: AppProject[] = [
  {
    id: 'cyberdash-2099',
    name: 'CyberDash 2099 — Neon Retro Arcade',
    prompt: 'Create a retro arcade cyber spaceship game with neon graphics, canvas 60fps physics, sound effects synthesis, particle bursts, weapon upgrades, and high score saving.',
    summary: 'High-octane neon retro cyber arcade with interactive spaceship shooter, sound effects synthesis, particle bursts, combo multipliers, high-score local storage, and upgrade shop.',
    createdAt: 'Just now',
    suggestions: ['Add a boss battle with lasers', 'Add touch virtual joystick for mobile', 'Add turbo warp drive effect'],
    planSteps: [
      { action: 'Analyzing game mechanics & retro styling', detail: 'Selected neon cyber aesthetic with high contrast glowing particles and Web Audio SFX', status: 'completed', timestamp: '12ms' },
      { action: 'Setting up HTML5 Canvas & 60 FPS Game Loop', detail: 'Implemented requestAnimationFrame loop with player physics, bullet collisions, and starfield', status: 'completed', timestamp: '85ms' },
      { action: 'Tool call: write_to_file -> index.html & app.js', detail: 'Generated responsive canvas wrapper, HUD overlays, shield gauge, and sound synthesizers', status: 'completed', timestamp: '140ms' },
      { action: 'Compiling applet & verifying keyboard/mouse handlers', detail: 'Build successful. 0 errors detected.', status: 'completed', timestamp: '210ms' }
    ],
    files: [
      {
        name: 'index.html',
        path: '/index.html',
        type: 'html',
        content: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberDash 2099</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700;900&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="styles.css">
</head>
<body class="flex flex-col h-screen bg-slate-950 text-white font-mono select-none overflow-hidden">
  <div id="app"></div>
  <script src="app.js"></script>
</body>
</html>`
      },
      {
        name: 'styles.css',
        path: '/styles.css',
        type: 'css',
        content: `body { font-family: 'JetBrains Mono', monospace; background: #030712; color: #f8fafc; }
.orbitron { font-family: 'Orbitron', sans-serif; }
.glow-cyan { text-shadow: 0 0 15px rgba(6,182,212,0.8); }
.glow-magenta { text-shadow: 0 0 15px rgba(236,72,153,0.8); }
.box-glow { box-shadow: 0 0 25px rgba(6,182,212,0.25), inset 0 0 15px rgba(6,182,212,0.1); }`
      },
      {
        name: 'app.js',
        path: '/app.js',
        type: 'javascript',
        content: `// CyberDash 2099 Game Engine
console.log("CyberDash 2099 loaded successfully.");`
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
    body { font-family: 'JetBrains Mono', monospace; background-color: #030712; color: #f8fafc; overflow: hidden; user-select: none; }
    .orbitron { font-family: 'Orbitron', sans-serif; }
    .glow-cyan { text-shadow: 0 0 15px rgba(6,182,212,0.8); }
    .glow-magenta { text-shadow: 0 0 15px rgba(236,72,153,0.8); }
    .box-glow { box-shadow: 0 0 25px rgba(6,182,212,0.25), inset 0 0 15px rgba(6,182,212,0.1); }
  </style>
</head>
<body class="flex flex-col h-screen">
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
      <button id="soundToggle" class="p-2 rounded bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition">
        <i data-lucide="volume-2" class="w-4 h-4"></i>
      </button>
    </div>
  </header>

  <main class="relative flex-1 flex items-center justify-center bg-black overflow-hidden">
    <canvas id="gameCanvas" class="w-full h-full block cursor-crosshair"></canvas>
    
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

    function resize() {
      canvas.width = canvas.parentElement.clientWidth;
      canvas.height = canvas.parentElement.clientHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    let isPlaying = false;
    let score = 0;
    let highScore = parseInt(localStorage.getItem('cyberdash_high') || '14820');
    highScoreDisplay.textContent = highScore.toString().padStart(5, '0');
    let bombs = 2;
    let tripleShot = false;

    const player = { x: canvas.width / 2, y: canvas.height - 80, width: 36, height: 42, speed: 7, shield: 100 };
    let bullets = [];
    let enemies = [];
    let particles = [];
    let stars = [];

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
      if (e.code === 'Space' && isPlaying) { shoot(); e.preventDefault(); }
    });
    window.addEventListener('keyup', (e) => { keys[e.key] = false; });

    canvas.addEventListener('mousemove', (e) => {
      if (!isPlaying) return;
      const rect = canvas.getBoundingClientRect();
      const targetX = e.clientX - rect.left;
      player.x += (targetX - player.x) * 0.15;
    });

    canvas.addEventListener('click', () => { if (isPlaying) shoot(); });

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
      enemies.push({ x: Math.random() * (canvas.width - 60) + 30, y: -50, ...type });
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
      overlaySubtitle.innerHTML = \`Final Score: <span class="text-cyan-400 font-bold">\${score}</span> | High Score: <span class="text-fuchsia-400 font-bold">\${highScore}</span>\`;
      startButton.textContent = "PLAY AGAIN";
      menuOverlay.classList.remove('opacity-0', 'pointer-events-none');
    }

    startButton.addEventListener('click', startGame);
    setInterval(spawnEnemy, 1100);

    function update() {
      ctx.fillStyle = '#030712';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach(star => {
        star.y += star.speed;
        if (star.y > canvas.height) { star.y = 0; star.x = Math.random() * canvas.width; }
        ctx.fillStyle = star.color;
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      if (isPlaying) {
        if (keys['ArrowLeft'] || keys['a'] || keys['A']) player.x -= player.speed;
        if (keys['ArrowRight'] || keys['d'] || keys['D']) player.x += player.speed;
        player.x = Math.max(25, Math.min(canvas.width - 25, player.x));

        ctx.save();
        ctx.translate(player.x, player.y);
        ctx.shadowColor = '#06b6d4';
        ctx.shadowBlur = 15;
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

        ctx.beginPath();
        ctx.moveTo(0, -10);
        ctx.lineTo(5, 5);
        ctx.lineTo(-5, 5);
        ctx.closePath();
        ctx.fillStyle = '#e0f2fe';
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-5, 16);
        ctx.lineTo(0, 26 + Math.random() * 6);
        ctx.lineTo(5, 16);
        ctx.fillStyle = '#f59e0b';
        ctx.fill();
        ctx.restore();

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
  },
  {
    id: 'taskpulse-kanban',
    name: 'TaskPulse — Agile Flow & Kanban Board',
    prompt: 'Build a project management kanban board with drag and drop cards, priority badges, member avatars, task creation modal, real-time search filter, and local storage persistence.',
    summary: 'Full-featured modern Kanban project management board with drag-and-drop column sorting, priority tags, real-time filtering, local storage persistence, activity timeline, and instant task creation modal.',
    createdAt: '2 hours ago',
    suggestions: ['Add a burndown chart tab', 'Add due date calendar reminders', 'Add subtasks checklist with progress bar'],
    planSteps: [
      { action: 'Deconstructing Kanban workflow', detail: 'Formulating 4 core columns (Backlog, In Progress, Code Review, Done) with priority labels', status: 'completed', timestamp: '10ms' },
      { action: 'Implementing local storage & drag handlers', detail: 'Configured HTML5 drag/drop API and localStorage sync for persistent state', status: 'completed', timestamp: '70ms' },
      { action: 'Designing responsive UI & quick filters', detail: 'Added assignee avatars, priority color codes, instant search bar, and task counter metrics', status: 'completed', timestamp: '130ms' },
      { action: 'Verifying modal dialogues & form validation', detail: 'Tested task creation modal, delete confirmations, and column re-ordering', status: 'completed', timestamp: '200ms' }
    ],
    files: [
      {
        name: 'index.html',
        path: '/index.html',
        type: 'html',
        content: `<!-- TaskPulse Kanban Board -->`
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
  <header class="h-16 border-b border-slate-800 bg-slate-900/90 px-6 flex items-center justify-between shrink-0">
    <div class="flex items-center gap-4">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-sky-400 flex items-center justify-center shadow-lg shadow-indigo-500/20 text-white font-black text-lg">⚡</div>
      <div>
        <h1 class="text-base font-bold flex items-center gap-2">
          TaskPulse Agile Board
          <span class="text-xs bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-medium">Sprint #14</span>
        </h1>
        <p class="text-xs text-slate-400">Q4 Product Release Roadmap</p>
      </div>
    </div>

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

  <main class="flex-1 p-6 overflow-x-auto flex gap-6 custom-scroll">
    <div class="w-80 shrink-0 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-4" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'backlog')">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 font-semibold text-sm">
          <div class="w-2.5 h-2.5 rounded-full bg-slate-400"></div> Backlog
          <span id="count-backlog" class="text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded-full font-mono">0</span>
        </div>
      </div>
      <div id="col-backlog" class="flex-1 overflow-y-auto space-y-3 custom-scroll pr-1 min-h-[150px]"></div>
    </div>

    <div class="w-80 shrink-0 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-4" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'progress')">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 font-semibold text-sm text-sky-400">
          <div class="w-2.5 h-2.5 rounded-full bg-sky-400 animate-pulse"></div> In Progress
          <span id="count-progress" class="text-xs bg-slate-800 text-sky-400 px-2 py-0.5 rounded-full font-mono">0</span>
        </div>
      </div>
      <div id="col-progress" class="flex-1 overflow-y-auto space-y-3 custom-scroll pr-1 min-h-[150px]"></div>
    </div>

    <div class="w-80 shrink-0 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-4" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'review')">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 font-semibold text-sm text-amber-400">
          <div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div> Peer Review
          <span id="count-review" class="text-xs bg-slate-800 text-amber-400 px-2 py-0.5 rounded-full font-mono">0</span>
        </div>
      </div>
      <div id="col-review" class="flex-1 overflow-y-auto space-y-3 custom-scroll pr-1 min-h-[150px]"></div>
    </div>

    <div class="w-80 shrink-0 flex flex-col bg-slate-900/70 border border-slate-800 rounded-2xl p-4" ondragover="allowDrop(event)" ondrop="handleDrop(event, 'done')">
      <div class="flex items-center justify-between mb-4">
        <div class="flex items-center gap-2 font-semibold text-sm text-emerald-400">
          <div class="w-2.5 h-2.5 rounded-full bg-emerald-400"></div> Completed
          <span id="count-done" class="text-xs bg-slate-800 text-emerald-400 px-2 py-0.5 rounded-full font-mono">0</span>
        </div>
      </div>
      <div id="col-done" class="flex-1 overflow-y-auto space-y-3 custom-scroll pr-1 min-h-[150px]"></div>
    </div>
  </main>

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
        <div class="flex justify-end gap-2 pt-2">
          <button type="button" id="cancelModalBtn" class="px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-medium text-slate-300">Cancel</button>
          <button type="submit" class="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white">Create Task</button>
        </div>
      </form>
    </div>
  </div>

  <script>
    let tasks = [
      { id: '1', title: 'Design OAuth 2.0 flow diagram', desc: 'Map out PKCE token refresh loop and session revocation.', column: 'progress', priority: 'High', assignee: 'Sarah K.', date: 'Oct 18' },
      { id: '2', title: 'Refactor Tailwind color palette', desc: 'Migrate legacy slate accents to high-contrast neon tokens.', column: 'done', priority: 'Low', assignee: 'Dev Team', date: 'Oct 15' },
      { id: '3', title: 'Add Stripe subscription webhooks', desc: 'Handle invoice.payment_succeeded and customer churn events.', column: 'backlog', priority: 'High', assignee: 'Alex R.', date: 'Oct 21' },
      { id: '4', title: 'Optimize bundle size & tree-shaking', desc: 'Analyze chunks with rollup-plugin-visualizer.', column: 'review', priority: 'Medium', assignee: 'Elena M.', date: 'Oct 19' },
      { id: '5', title: 'Set up automated Cypress E2E tests', desc: 'Cover user sign-up, project checkout, and API key generation.', column: 'backlog', priority: 'Medium', assignee: 'Jordan P.', date: 'Oct 22' }
    ];

    let activeFilter = 'all';
    let searchQuery = '';

    function render() {
      const cols = ['backlog', 'progress', 'review', 'done'];
      cols.forEach(c => document.getElementById('col-' + c).innerHTML = '');

      const filtered = tasks.filter(t => {
        const matchesFilter = activeFilter === 'all' || t.priority === activeFilter;
        const matchesSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                              t.desc.toLowerCase().includes(searchQuery.toLowerCase());
        return matchesFilter && matchesSearch;
      });

      const counts = { backlog: 0, progress: 0, review: 0, done: 0 };

      filtered.forEach(task => {
        counts[task.column] = (counts[task.column] || 0) + 1;
        const card = document.createElement('div');
        card.className = "bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 rounded-xl p-3.5 shadow-sm transition cursor-grab";
        card.draggable = true;
        card.ondragstart = (e) => e.dataTransfer.setData('text/plain', task.id);
        const pBadge = task.priority === 'High' 
          ? '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-500/10 text-rose-400 border border-rose-500/20">High</span>'
          : task.priority === 'Medium'
          ? '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-500/10 text-amber-400 border border-amber-500/20">Medium</span>'
          : '<span class="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">Low</span>';
        
        card.innerHTML = \`
          <div class="flex items-center justify-between mb-2">
            \${pBadge}
            <button onclick="deleteTask('\${task.id}')" class="text-slate-500 hover:text-rose-400 p-1"><i data-lucide="trash-2" class="w-3.5 h-3.5"></i></button>
          </div>
          <h4 class="font-semibold text-xs text-white mb-1.5">\${task.title}</h4>
          <p class="text-[11px] text-slate-400 mb-3 line-clamp-2">\${task.desc}</p>
          <div class="flex items-center justify-between pt-2 border-t border-slate-700/50 text-[11px] text-slate-400">
            <span>\${task.assignee || 'Alex'}</span>
            <span class="text-[10px] font-mono">\${task.date}</span>
          </div>
        \`;
        document.getElementById('col-' + task.column).appendChild(card);
      });

      cols.forEach(c => document.getElementById('count-' + c).textContent = counts[c]);
      document.getElementById('totalCount').textContent = tasks.length;
      document.getElementById('completedCount').textContent = tasks.filter(t => t.column === 'done').length;
      document.getElementById('urgentCount').textContent = tasks.filter(t => t.priority === 'High').length;
      lucide.createIcons();
    }

    function allowDrop(e) { e.preventDefault(); }
    function handleDrop(e, column) {
      e.preventDefault();
      const id = e.dataTransfer.getData('text/plain');
      const t = tasks.find(x => x.id === id);
      if (t) { t.column = column; render(); }
    }
    function deleteTask(id) { tasks = tasks.filter(x => x.id !== id); render(); }
    function filterPriority(p) { activeFilter = p; render(); }
    document.getElementById('searchInput').addEventListener('input', (e) => { searchQuery = e.target.value; render(); });

    const modal = document.getElementById('taskModal');
    document.getElementById('openNewTaskBtn').addEventListener('click', () => modal.classList.remove('hidden'));
    document.getElementById('closeModalBtn').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('cancelModalBtn').addEventListener('click', () => modal.classList.add('hidden'));
    document.getElementById('taskForm').addEventListener('submit', (e) => {
      e.preventDefault();
      tasks.push({
        id: Date.now().toString(),
        title: document.getElementById('taskTitle').value,
        desc: document.getElementById('taskDesc').value,
        column: document.getElementById('taskColumn').value,
        priority: document.getElementById('taskPriority').value,
        assignee: 'Alex R.',
        date: 'Today'
      });
      document.getElementById('taskForm').reset();
      modal.classList.add('hidden');
      render();
    });

    render();
  </script>
</body>
</html>`
  },
  {
    id: 'saasify-hub',
    name: 'SaaSify — Executive Revenue & Metrics Hub',
    prompt: 'Build a high-performance modern SaaS metrics dashboard with MRR, churn rate, subscription breakdown, active customers graph, and recent invoice transactions table.',
    summary: 'High-performance SaaS executive dashboard with real-time MRR analytics, churn metrics, active subscriber breakdown, user retention cohort table, and interactive date-range filtering.',
    createdAt: '5 hours ago',
    suggestions: ['Add a customer churn prediction indicator', 'Add dark/light mode toggle', 'Add webhook integration status panel'],
    planSteps: [
      { action: 'Synthesizing product metrics schema', detail: 'Defined Monthly Recurring Revenue (MRR), Customer Lifetime Value (LTV), and churn indicators', status: 'completed', timestamp: '15ms' },
      { action: 'Constructing charts and financial telemetry', detail: 'Built dynamic SVG spline charts, transaction feeds, and tier distribution indicators', status: 'completed', timestamp: '80ms' },
      { action: 'Adding interactive state controls', detail: 'Wired period selectors (7D, 30D, 1Y), plan upgrading modals, and CSV export triggers', status: 'completed', timestamp: '140ms' },
      { action: 'Validating responsive glassmorphic design', detail: 'Passed all responsive layout verifications across Desktop, Tablet, and Mobile views', status: 'completed', timestamp: '210ms' }
    ],
    files: [
      {
        name: 'index.html',
        path: '/index.html',
        type: 'html',
        content: `<!-- SaaSify Dashboard -->`
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
    .mono { font-family: 'JetBrains Mono', monospace; }
    .glass-card { background: rgba(17, 24, 39, 0.7); backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.08); }
  </style>
</head>
<body class="min-h-screen flex bg-[#090d16] text-slate-100">
  <div class="flex-1 flex flex-col min-w-0 overflow-y-auto">
    <header class="h-16 border-b border-slate-800 bg-slate-950/40 px-6 flex items-center justify-between shrink-0">
      <div class="flex items-center gap-3">
        <div class="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">CX</div>
        <h1 class="text-base font-bold text-white">SaaSify Revenue Hub</h1>
        <span class="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Live
        </span>
      </div>
      <div class="flex items-center gap-2">
        <button class="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-xs font-semibold text-white">Upgrade Plan</button>
      </div>
    </header>

    <main class="p-6 space-y-6">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div class="glass-card p-5 rounded-2xl">
          <div class="text-xs font-medium text-slate-400 mb-1">Monthly Recurring (MRR)</div>
          <div class="text-2xl font-bold mono text-white mb-1">$84,320</div>
          <div class="text-xs text-emerald-400 font-medium">+14.2% vs last month</div>
        </div>
        <div class="glass-card p-5 rounded-2xl">
          <div class="text-xs font-medium text-slate-400 mb-1">Active Subscribers</div>
          <div class="text-2xl font-bold mono text-white mb-1">2,845</div>
          <div class="text-xs text-emerald-400 font-medium">+184 this week</div>
        </div>
        <div class="glass-card p-5 rounded-2xl">
          <div class="text-xs font-medium text-slate-400 mb-1">Net Revenue Churn</div>
          <div class="text-2xl font-bold mono text-white mb-1">1.24%</div>
          <div class="text-xs text-emerald-400 font-medium">-0.4% industry low</div>
        </div>
        <div class="glass-card p-5 rounded-2xl">
          <div class="text-xs font-medium text-slate-400 mb-1">Avg Revenue / User</div>
          <div class="text-2xl font-bold mono text-white mb-1">$128.40</div>
          <div class="text-xs text-emerald-400 font-medium">+5.8% expansion</div>
        </div>
      </div>

      <div class="glass-card p-6 rounded-2xl">
        <h3 class="font-bold text-sm text-white mb-4">Annual Revenue Trajectory</h3>
        <div class="h-48 w-full">
          <svg class="w-full h-full" viewBox="0 0 800 200" preserveAspectRatio="none">
            <path d="M 0,160 Q 200,140 400,90 T 800,20 L 800,200 L 0,200 Z" fill="rgba(6,182,212,0.15)"></path>
            <path d="M 0,160 Q 200,140 400,90 T 800,20" fill="none" stroke="#06b6d4" stroke-width="3"></path>
          </svg>
        </div>
      </div>
    </main>
  </div>
  <script>lucide.createIcons();</script>
</body>
</html>`,
    category: 'SaaS',
    tags: ['Dashboard', 'MRR', 'Analytics', 'Charts']
  },
  {
    id: 'orbit3d-sim',
    name: 'Orbit3D — Gravitational Celestial Simulator',
    prompt: 'Build an interactive 3D solar gravitation simulator with canvas physics, planetary orbits, gravity field lines, time dilation slider, mass controls, and star dust trails.',
    summary: 'Interactive Newtonian gravity and orbital mechanics laboratory featuring realistic n-body gravitational attraction, trail rendering, velocity vectors, and interactive body spawning.',
    category: 'Audio/3D',
    tags: ['Physics', 'Space', 'Simulation', 'Canvas'],
    createdAt: '1 day ago',
    suggestions: ['Add binary star system mode', 'Add black hole singularity effect', 'Add solar flare bursts'],
    planSteps: [
      { action: 'Initializing orbital kinematics engine', detail: 'Formulated n-body gravity formulas F = G*(m1*m2)/r^2 with Euler-Cromer integration', status: 'completed', timestamp: '10ms' },
      { action: 'Building canvas rendering pipeline', detail: 'Configured celestial body glow shaders, orbital trail fading buffers, and scale controls', status: 'completed', timestamp: '65ms' },
      { action: 'Wiring interactive physics controls', detail: 'Added click-and-drag velocity launching, time warp speed slider, and mass adjuster', status: 'completed', timestamp: '120ms' },
      { action: 'Verifying 60 FPS performance metrics', detail: 'Optimized particle decay and orbital trail history arrays for silky smooth rendering', status: 'completed', timestamp: '180ms' }
    ],
    files: [
      {
        name: 'index.html',
        path: '/index.html',
        type: 'html',
        content: `<!-- Orbit3D Gravitational Simulator -->\n<canvas id="simCanvas"></canvas>`
      }
    ],
    previewHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Orbit3D — Gravitational Simulator</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@600;800&family=JetBrains+Mono:wght@400;600&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'JetBrains Mono', monospace; background: #020408; color: #e2e8f0; overflow: hidden; user-select: none; }
    .orbitron { font-family: 'Orbitron', sans-serif; }
  </style>
</head>
<body class="h-screen w-screen flex flex-col">
  <header class="h-14 border-b border-cyan-500/20 bg-slate-950/80 backdrop-blur px-6 flex items-center justify-between shrink-0 z-10">
    <div class="flex items-center gap-3">
      <div class="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center font-bold text-black orbitron">🪐</div>
      <div>
        <h1 class="text-sm font-bold text-cyan-400 orbitron flex items-center gap-2">ORBIT3D CELESTIAL LAB</h1>
        <p class="text-[10px] text-slate-400">Newtonian Gravitational n-Body Mechanics</p>
      </div>
    </div>
    <div class="flex items-center gap-3">
      <button onclick="resetSolarSystem()" class="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:bg-slate-800 text-xs text-slate-300">Reset Solar System</button>
      <button onclick="addBlackHole()" class="px-3 py-1.5 rounded-lg bg-purple-950 border border-purple-800/60 hover:bg-purple-900 text-xs text-purple-300 font-semibold">+ Singularity</button>
    </div>
  </header>

  <main class="flex-1 relative bg-black">
    <canvas id="orbitCanvas" class="w-full h-full block cursor-crosshair"></canvas>

    <!-- Overlay Controls HUD -->
    <div class="absolute bottom-5 left-5 right-5 flex items-center justify-between pointer-events-none z-10">
      <div class="bg-slate-900/80 border border-slate-800 backdrop-blur p-3 rounded-xl pointer-events-auto flex items-center gap-4 text-xs">
        <div class="flex items-center gap-2">
          <span class="text-slate-400 text-[11px]">Time Warp:</span>
          <input id="timeSpeed" type="range" min="0.2" max="3" step="0.1" value="1" class="w-24 accent-cyan-400 cursor-pointer">
          <span id="speedVal" class="font-mono text-cyan-400 text-[11px]">1.0x</span>
        </div>
        <div class="h-4 w-px bg-slate-700"></div>
        <div class="flex items-center gap-2">
          <span class="text-slate-400 text-[11px]">Trails:</span>
          <button id="toggleTrails" class="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[11px]">ON</button>
        </div>
        <div class="h-4 w-px bg-slate-700"></div>
        <div class="text-[11px] text-slate-400">Bodies: <span id="bodyCount" class="font-bold text-white">5</span></div>
      </div>

      <div class="bg-slate-900/80 border border-slate-800 backdrop-blur px-4 py-2.5 rounded-xl pointer-events-auto text-[11px] text-slate-400">
        💡 <span class="text-slate-300">Click & drag</span> anywhere to launch a new celestial planet!
      </div>
    </div>
  </main>

  <script>
    const canvas = document.getElementById('orbitCanvas');
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight - 56;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight - 56;
    });

    let timeScale = 1;
    let showTrails = true;
    const G = 0.8;

    let bodies = [];

    function resetSolarSystem() {
      bodies = [
        { x: width / 2, y: height / 2, vx: 0, vy: 0, mass: 2800, radius: 18, color: '#f59e0b', name: 'Sol Prime', fixed: true, trail: [] },
        { x: width / 2, y: height / 2 - 110, vx: 4.8, vy: 0, mass: 12, radius: 6, color: '#06b6d4', name: 'Astra', fixed: false, trail: [] },
        { x: width / 2, y: height / 2 - 180, vx: 3.8, vy: 0, mass: 25, radius: 9, color: '#ec4899', name: 'Terra Nova', fixed: false, trail: [] },
        { x: width / 2, y: height / 2 + 260, vx: -3.1, vy: 0, mass: 45, radius: 12, color: '#8b5cf6', name: 'Jovian', fixed: false, trail: [] },
        { x: width / 2, y: height / 2 + 320, vx: -2.8, vy: 0, mass: 8, radius: 5, color: '#10b981', name: 'Zephyr', fixed: false, trail: [] }
      ];
      document.getElementById('bodyCount').textContent = bodies.length;
    }

    function addBlackHole() {
      bodies.push({
        x: width / 2 + (Math.random() * 200 - 100),
        y: height / 2 + (Math.random() * 200 - 100),
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        mass: 5500,
        radius: 14,
        color: '#c084fc',
        name: 'Singularity',
        fixed: false,
        trail: []
      });
      document.getElementById('bodyCount').textContent = bodies.length;
    }

    resetSolarSystem();

    // Mouse drag launch
    let isDragging = false;
    let dragStart = { x: 0, y: 0 };
    let dragCurrent = { x: 0, y: 0 };

    canvas.addEventListener('mousedown', (e) => {
      const rect = canvas.getBoundingClientRect();
      dragStart = { x: e.clientX - rect.left, y: e.clientY - rect.top };
      dragCurrent = { ...dragStart };
      isDragging = true;
    });

    canvas.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      const rect = canvas.getBoundingClientRect();
      dragCurrent = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    });

    canvas.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      const vx = (dragStart.x - dragCurrent.x) * 0.05;
      const vy = (dragStart.y - dragCurrent.y) * 0.05;
      const colors = ['#38bdf8', '#e879f9', '#4ade80', '#fbbf24', '#f43f5e'];
      bodies.push({
        x: dragStart.x,
        y: dragStart.y,
        vx, vy,
        mass: Math.random() * 20 + 8,
        radius: Math.random() * 4 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        name: 'Planetoid ' + bodies.length,
        fixed: false,
        trail: []
      });
      document.getElementById('bodyCount').textContent = bodies.length;
    });

    document.getElementById('timeSpeed').addEventListener('input', (e) => {
      timeScale = parseFloat(e.target.value);
      document.getElementById('speedVal').textContent = timeScale.toFixed(1) + 'x';
    });

    document.getElementById('toggleTrails').addEventListener('click', (e) => {
      showTrails = !showTrails;
      e.target.textContent = showTrails ? 'ON' : 'OFF';
      e.target.className = showTrails 
        ? 'px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 text-[11px]'
        : 'px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-400 text-[11px]';
    });

    function update() {
      ctx.fillStyle = showTrails ? 'rgba(2, 4, 8, 0.2)' : '#020408';
      ctx.fillRect(0, 0, width, height);

      // Physics loop
      for (let i = 0; i < bodies.length; i++) {
        const b1 = bodies[i];
        if (b1.fixed) continue;

        for (let j = 0; j < bodies.length; j++) {
          if (i === j) continue;
          const b2 = bodies[j];
          const dx = b2.x - b1.x;
          const dy = b2.y - b1.y;
          const distSq = dx * dx + dy * dy + 150; // Softening parameter
          const dist = Math.sqrt(distSq);
          const force = (G * b1.mass * b2.mass) / distSq;
          const ax = (force * (dx / dist)) / b1.mass;
          const ay = (force * (dy / dist)) / b1.mass;

          b1.vx += ax * timeScale;
          b1.vy += ay * timeScale;
        }

        b1.x += b1.vx * timeScale;
        b1.y += b1.vy * timeScale;

        // Record trails
        if (showTrails) {
          b1.trail.push({ x: b1.x, y: b1.y });
          if (b1.trail.length > 40) b1.trail.shift();
        }
      }

      // Draw trails
      if (showTrails) {
        bodies.forEach(b => {
          if (b.trail.length > 1) {
            ctx.beginPath();
            ctx.moveTo(b.trail[0].x, b.trail[0].y);
            for (let i = 1; i < b.trail.length; i++) {
              ctx.lineTo(b.trail[i].x, b.trail[i].y);
            }
            ctx.strokeStyle = b.color;
            ctx.globalAlpha = 0.35;
            ctx.lineWidth = 1.5;
            ctx.stroke();
            ctx.globalAlpha = 1.0;
          }
        });
      }

      // Draw bodies
      bodies.forEach(b => {
        ctx.save();
        ctx.shadowColor = b.color;
        ctx.shadowBlur = b.radius * 2;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.restore();

        // Label
        ctx.fillStyle = '#94a3b8';
        ctx.font = '10px monospace';
        ctx.fillText(b.name, b.x + b.radius + 4, b.y + 3);
      });

      // Draw launch sling
      if (isDragging) {
        ctx.beginPath();
        ctx.moveTo(dragStart.x, dragStart.y);
        ctx.lineTo(dragCurrent.x, dragCurrent.y);
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 2;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);

        ctx.beginPath();
        ctx.arc(dragStart.x, dragStart.y, 7, 0, Math.PI * 2);
        ctx.fillStyle = '#06b6d4';
        ctx.fill();
      }

      requestAnimationFrame(update);
    }

    requestAnimationFrame(update);
  </script>
</body>
</html>`
  },
  {
    id: 'synthbeats-studio',
    name: 'SynthBeats Studio — 16-Step Web Audio Drum Machine',
    prompt: 'Build a 16-step drum machine beat sequencer with synthesized 808 kick, snare, hi-hat, bassline, tempo BPM slider, swing feel, and preset beat patterns using the Web Audio API.',
    summary: 'Hardware-inspired 16-step drum machine synthesizer with real-time audio synthesis (no external audio files required), interactive LED step buttons, pattern presets, volume faders, and swing control.',
    category: 'Audio/3D',
    tags: ['Music', 'WebAudio', 'Synthesizer', 'Sequencer'],
    createdAt: '2 days ago',
    suggestions: ['Add reverb and delay audio effects', 'Add export pattern as WAV', 'Add keyboard pads for live playing'],
    planSteps: [
      { action: 'Initializing Web Audio API AudioContext', detail: 'Created modular audio synthesis graph with oscillator, noise generator, and biquad filter nodes', status: 'completed', timestamp: '12ms' },
      { action: 'Building 16-step transport scheduler', detail: 'Implemented high-precision lookahead timer loop for jitter-free rhythmic playback', status: 'completed', timestamp: '75ms' },
      { action: 'Designing hardware-style step sequencer UI', detail: 'Styled glowing LED beat step triggers, volume faders, and active step cursor indicator', status: 'completed', timestamp: '130ms' },
      { action: 'Compiling presets and testing audio output', detail: 'Loaded classic 808 patterns: Synthwave, Hip-Hop, House 4-on-the-floor, and Electro Funk', status: 'completed', timestamp: '200ms' }
    ],
    files: [
      {
        name: 'index.html',
        path: '/index.html',
        type: 'html',
        content: `<!-- SynthBeats Studio -->`
      }
    ],
    previewHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SynthBeats Studio</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;700;800&family=JetBrains+Mono:wght@500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0b0d13; color: #f8fafc; user-select: none; }
    .mono { font-family: 'JetBrains Mono', monospace; }
  </style>
</head>
<body class="min-h-screen flex flex-col p-6 bg-[#0a0c12]">
  <!-- Studio Top Bar -->
  <header class="flex items-center justify-between pb-6 border-b border-slate-800 shrink-0">
    <div class="flex items-center gap-3">
      <div class="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center font-black text-black text-lg shadow-lg shadow-rose-500/20">
        🥁
      </div>
      <div>
        <h1 class="text-base font-bold text-white flex items-center gap-2">
          SYNTHBEATS STUDIO 808
          <span class="text-[10px] bg-rose-950 text-rose-300 border border-rose-800/40 px-2 py-0.5 rounded-full font-mono">DSP v3.1</span>
        </h1>
        <p class="text-xs text-slate-400">Pure Web Audio Mathematical Sound Synthesizer</p>
      </div>
    </div>

    <!-- Transport Controls -->
    <div class="flex items-center gap-4">
      <div class="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-xl px-3 py-1.5 text-xs">
        <span class="text-slate-400">BPM:</span>
        <input id="bpmSlider" type="range" min="70" max="160" value="120" class="w-24 accent-rose-500 cursor-pointer">
        <span id="bpmDisplay" class="font-mono font-bold text-rose-400 w-8">120</span>
      </div>

      <div class="flex items-center gap-1.5">
        <button onclick="loadPattern('house')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white">House</button>
        <button onclick="loadPattern('hiphop')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white">HipHop</button>
        <button onclick="loadPattern('synthwave')" class="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 hover:text-white">Synthwave</button>
      </div>

      <button id="playBtn" class="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-slate-950 font-bold text-xs shadow-lg shadow-rose-500/20 transition">
        <i data-lucide="play" class="w-4 h-4 fill-current"></i> START BEAT
      </button>
    </div>
  </header>

  <!-- Sequencer Grid -->
  <main class="flex-1 py-6 flex flex-col justify-center max-w-5xl mx-auto w-full space-y-4">
    <!-- Step Position Indicators -->
    <div class="grid grid-cols-[140px_repeat(16,1fr)] gap-2 items-center text-center">
      <div class="text-xs font-bold text-slate-500 text-left">CHANNELS</div>
      <div id="stepIndicators" class="contents"></div>
    </div>

    <!-- Tracks Container -->
    <div id="tracksContainer" class="space-y-3"></div>
  </main>

  <script>
    lucide.createIcons();

    let audioCtx = null;
    let isPlaying = false;
    let currentStep = 0;
    let bpm = 120;
    let timerId = null;

    const tracks = [
      { id: 'kick', name: '808 Kick', color: 'rose', steps: Array(16).fill(false) },
      { id: 'snare', name: 'Punch Snare', color: 'amber', steps: Array(16).fill(false) },
      { id: 'hihat', name: 'Crisp Hat', color: 'cyan', steps: Array(16).fill(false) },
      { id: 'bass', name: 'Synth Sub', color: 'purple', steps: Array(16).fill(false) }
    ];

    // Default Pattern (House)
    tracks[0].steps = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0].map(Boolean);
    tracks[1].steps = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0].map(Boolean);
    tracks[2].steps = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0].map(Boolean);
    tracks[3].steps = [1,0,0,1, 0,0,0,0, 1,0,0,1, 0,0,0,0].map(Boolean);

    function initAudio() {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Synthesizer sounds using Web Audio math
    function playKick() {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.frequency.setValueAtTime(150, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.35);
      gain.gain.setValueAtTime(1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.35);
    }

    function playSnare() {
      initAudio();
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 800;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.7, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    }

    function playHiHat() {
      initAudio();
      const noise = audioCtx.createBufferSource();
      const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.05, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
      noise.buffer = buffer;

      const filter = audioCtx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 6000;

      const gain = audioCtx.createGain();
      gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.05);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(audioCtx.destination);
      noise.start();
    }

    function playBass() {
      initAudio();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(55, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.25);
    }

    function renderGrid() {
      // Step headers
      const indContainer = document.getElementById('stepIndicators');
      indContainer.innerHTML = '';
      for (let s = 0; s < 16; s++) {
        const dot = document.createElement('div');
        dot.id = 'ind-' + s;
        dot.className = \`text-[10px] font-mono \${s % 4 === 0 ? 'text-white font-bold' : 'text-slate-600'}\`;
        dot.textContent = (s + 1).toString();
        indContainer.appendChild(dot);
      }

      // Track rows
      const tracksContainer = document.getElementById('tracksContainer');
      tracksContainer.innerHTML = '';
      tracks.forEach((track, tIdx) => {
        const row = document.createElement('div');
        row.className = "grid grid-cols-[140px_repeat(16,1fr)] gap-2 items-center bg-slate-900/60 border border-slate-800 p-2.5 rounded-2xl";

        const label = document.createElement('div');
        label.className = "text-xs font-bold text-white flex items-center gap-2";
        label.innerHTML = \`<span class="w-2.5 h-2.5 rounded-full bg-\${track.color}-500"></span> \${track.name}\`;
        row.appendChild(label);

        for (let s = 0; s < 16; s++) {
          const btn = document.createElement('button');
          btn.id = \`btn-\${tIdx}-\${s}\`;
          const isActive = track.steps[s];
          const isBeatStart = s % 4 === 0;

          btn.className = \`h-11 rounded-xl transition duration-150 flex items-center justify-center font-bold text-xs \${
            isActive 
              ? \`bg-\${track.color}-500 text-slate-950 shadow-md shadow-\${track.color}-500/30 font-black\` 
              : isBeatStart ? 'bg-slate-800/90 hover:bg-slate-700 text-slate-500' : 'bg-slate-950 hover:bg-slate-800 text-slate-600'
          }\`;
          btn.onclick = () => {
            track.steps[s] = !track.steps[s];
            if (track.steps[s]) {
              if (track.id === 'kick') playKick();
              if (track.id === 'snare') playSnare();
              if (track.id === 'hihat') playHiHat();
              if (track.id === 'bass') playBass();
            }
            renderGrid();
          };
          row.appendChild(btn);
        }
        tracksContainer.appendChild(row);
      });
    }

    function step() {
      // Play sound
      if (tracks[0].steps[currentStep]) playKick();
      if (tracks[1].steps[currentStep]) playSnare();
      if (tracks[2].steps[currentStep]) playHiHat();
      if (tracks[3].steps[currentStep]) playBass();

      // Highlight active column
      for (let s = 0; s < 16; s++) {
        const ind = document.getElementById('ind-' + s);
        if (ind) {
          ind.classList.toggle('text-rose-400', s === currentStep);
          ind.classList.toggle('font-bold', s === currentStep || s % 4 === 0);
        }
      }

      currentStep = (currentStep + 1) % 16;
    }

    function togglePlay() {
      initAudio();
      isPlaying = !isPlaying;
      const playBtn = document.getElementById('playBtn');
      if (isPlaying) {
        currentStep = 0;
        const interval = (60 / bpm / 4) * 1000;
        timerId = setInterval(step, interval);
        playBtn.innerHTML = '<i data-lucide="square" class="w-4 h-4 fill-current"></i> STOP BEAT';
        playBtn.className = "flex items-center gap-2 px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-rose-400 font-bold text-xs border border-rose-500/40 transition";
      } else {
        clearInterval(timerId);
        playBtn.innerHTML = '<i data-lucide="play" class="w-4 h-4 fill-current"></i> START BEAT';
        playBtn.className = "flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-rose-500 to-amber-500 hover:opacity-90 text-slate-950 font-bold text-xs shadow-lg shadow-rose-500/20 transition";
      }
      lucide.createIcons();
    }

    document.getElementById('playBtn').addEventListener('click', togglePlay);

    document.getElementById('bpmSlider').addEventListener('input', (e) => {
      bpm = parseInt(e.target.value);
      document.getElementById('bpmDisplay').textContent = bpm;
      if (isPlaying) {
        clearInterval(timerId);
        timerId = setInterval(step, (60 / bpm / 4) * 1000);
      }
    });

    function loadPattern(type) {
      if (type === 'hiphop') {
        tracks[0].steps = [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,1,0,0].map(Boolean);
        tracks[1].steps = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0].map(Boolean);
        tracks[2].steps = [1,1,1,1, 1,1,1,1, 1,1,1,1, 1,1,1,1].map(Boolean);
        tracks[3].steps = [1,0,0,0, 0,0,1,0, 0,0,0,0, 0,0,1,0].map(Boolean);
      } else if (type === 'synthwave') {
        tracks[0].steps = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0].map(Boolean);
        tracks[1].steps = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0].map(Boolean);
        tracks[2].steps = [1,0,1,0, 1,0,1,0, 1,0,1,0, 1,0,1,0].map(Boolean);
        tracks[3].steps = [1,1,1,1, 0,0,1,1, 1,1,1,1, 0,0,1,1].map(Boolean);
      } else {
        tracks[0].steps = [1,0,0,0, 1,0,0,0, 1,0,0,0, 1,0,0,0].map(Boolean);
        tracks[1].steps = [0,0,0,0, 1,0,0,0, 0,0,0,0, 1,0,0,0].map(Boolean);
        tracks[2].steps = [0,0,1,0, 0,0,1,0, 0,0,1,0, 0,0,1,0].map(Boolean);
        tracks[3].steps = [1,0,0,1, 0,0,0,0, 1,0,0,1, 0,0,0,0].map(Boolean);
      }
      renderGrid();
    }

    renderGrid();
  </script>
</body>
</html>`
  },
  {
    id: 'bistro-fresh',
    name: 'BistroFresh — Gourmet Food Ordering & Delivery',
    prompt: 'Build a restaurant food delivery app with category filter, dietary tags, customizable burger toppings modal, animated cart drawer with delivery fee and tips, and live driver order tracking map.',
    summary: 'Mouth-watering gourmet food ordering web application with dietary filtering (Vegan, Gluten-Free), item customization drawer, cart checkout calculation, and interactive animated delivery status timeline.',
    category: 'E-commerce',
    tags: ['Food', 'Ordering', 'Cart', 'Delivery'],
    createdAt: '3 days ago',
    suggestions: ['Add coupon promo code redemption', 'Add delivery driver live GPS map', 'Add tipping percentage selector'],
    planSteps: [
      { action: 'Structuring menu and culinary taxonomy', detail: 'Created structured menu list with artisan burgers, wood-fired pizzas, healthy bowls, and craft beverages', status: 'completed', timestamp: '15ms' },
      { action: 'Building interactive cart drawer & order calculation', detail: 'Wired subtotal, tax estimation, delivery fee, and discount codes in real time', status: 'completed', timestamp: '80ms' },
      { action: 'Implementing checkout modal and live delivery tracker', detail: 'Added four-stage order timeline (Received, Kitchen Prep, Courier en Route, Delivered)', status: 'completed', timestamp: '145ms' },
      { action: 'Polishing responsive mobile layout & image fallbacks', detail: 'Verified high-resolution food thumbnails, dietary badges, and touch-friendly controls', status: 'completed', timestamp: '210ms' }
    ],
    files: [
      {
        name: 'index.html',
        path: '/index.html',
        type: 'html',
        content: `<!-- BistroFresh Gourmet App -->`
      }
    ],
    previewHtml: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>BistroFresh — Gourmet Delivery</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/lucide@latest"></script>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@500;600;700;800&display=swap" rel="stylesheet">
  <style>body { font-family: 'Plus Jakarta Sans', sans-serif; background-color: #0c0f17; color: #f8fafc; }</style>
</head>
<body class="min-h-screen flex flex-col bg-[#0b0e17] text-slate-100">
  <header class="h-16 border-b border-slate-800 bg-slate-950/80 px-6 flex items-center justify-between sticky top-0 z-30 backdrop-blur">
    <div class="flex items-center gap-3">
      <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-bold text-black text-base">🥑</div>
      <div>
        <h1 class="text-sm font-bold text-white flex items-center gap-2">BISTROFRESH GOURMET</h1>
        <p class="text-[10px] text-emerald-400">Est. Delivery: 20-30 mins</p>
      </div>
    </div>

    <button onclick="toggleCart()" class="relative flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs shadow-md transition">
      <i data-lucide="shopping-bag" class="w-4 h-4"></i>
      <span>Cart</span>
      <span id="cartCountBadge" class="w-5 h-5 rounded-full bg-slate-950 text-white flex items-center justify-center text-[10px]">0</span>
    </button>
  </header>

  <!-- Categories Bar -->
  <div class="px-6 py-3 border-b border-slate-800/80 bg-slate-900/30 flex items-center gap-2 overflow-x-auto scrollbar-none">
    <button onclick="filterCat('all')" class="cat-btn px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-semibold">All Items</button>
    <button onclick="filterCat('burgers')" class="cat-btn px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white text-xs">🍔 Artisan Burgers</button>
    <button onclick="filterCat('pizza')" class="cat-btn px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white text-xs">🍕 Wood-Fired Pizza</button>
    <button onclick="filterCat('bowls')" class="cat-btn px-3 py-1 rounded-full bg-slate-800 text-slate-300 hover:text-white text-xs">🥗 Healthy Bowls</button>
  </div>

  <!-- Menu Grid -->
  <main class="flex-1 p-6 max-w-6xl mx-auto w-full">
    <div id="menuContainer" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"></div>
  </main>

  <!-- Cart Drawer Overlay -->
  <div id="cartDrawer" class="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm hidden flex justify-end">
    <div class="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full p-6 flex flex-col shadow-2xl">
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <h3 class="font-bold text-base text-white flex items-center gap-2"><i data-lucide="shopping-bag" class="w-5 h-5 text-emerald-400"></i> Your Basket</h3>
        <button onclick="toggleCart()" class="text-slate-400 hover:text-white"><i data-lucide="x" class="w-5 h-5"></i></button>
      </div>

      <div id="cartItemsList" class="flex-1 overflow-y-auto py-4 space-y-3"></div>

      <div class="pt-4 border-t border-slate-800 space-y-2 text-xs">
        <div class="flex justify-between text-slate-400"><span>Subtotal:</span><span id="subtotalVal" class="text-white font-mono">$0.00</span></div>
        <div class="flex justify-between text-slate-400"><span>Delivery Fee:</span><span class="text-emerald-400">FREE</span></div>
        <div class="flex justify-between text-sm font-bold text-white pt-2 border-t border-slate-800">
          <span>Total:</span><span id="totalVal" class="text-emerald-400 font-mono">$0.00</span>
        </div>
        <button onclick="checkout()" class="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:opacity-95 text-slate-950 font-bold text-xs shadow-lg transition">
          PLACE ORDER & TRACK
        </button>
      </div>
    </div>
  </div>

  <script>
    lucide.createIcons();

    const items = [
      { id: '1', name: 'Truffle Umami Wagyu Burger', desc: 'Brioche bun, aged gouda, black truffle aioli, caramelized shallots.', price: 16.50, cat: 'burgers', emoji: '🍔', badge: 'Chef Choice' },
      { id: '2', name: 'Quattro Formaggi & Hot Honey Pizza', desc: 'San Marzano tomatoes, fior di latte, gorgonzola, spicy calabrian honey.', price: 18.00, cat: 'pizza', emoji: '🍕', badge: 'Popular' },
      { id: '3', name: 'Avocado Crunch Salmon Bowl', desc: 'Norwegian salmon sashimi, quinoa, edamame, sesame ponzu dressing.', price: 15.50, cat: 'bowls', emoji: '🥗', badge: 'Gluten-Free' },
      { id: '4', name: 'Smoked Jalapeno Bacon Melt', desc: 'Double smash patty, pepper jack, crispy bacon, house chipotle sauce.', price: 15.00, cat: 'burgers', emoji: '🥓', badge: 'Spicy' },
      { id: '5', name: 'Wild Forest Mushroom Flatbread', desc: 'Shiitake, cremini, thyme, goat cheese, white truffle oil.', price: 17.00, cat: 'pizza', emoji: '🍄', badge: 'Vegetarian' },
      { id: '6', name: 'Golden Turmeric Tofu Power Bowl', desc: 'Charred broccolini, roasted chickpeas, purple cabbage, tahini drizzle.', price: 14.00, cat: 'bowls', emoji: '🥑', badge: 'Vegan' }
    ];

    let cart = [];
    let activeCategory = 'all';

    function renderMenu() {
      const container = document.getElementById('menuContainer');
      container.innerHTML = '';
      const filtered = items.filter(i => activeCategory === 'all' || i.cat === activeCategory);

      filtered.forEach(item => {
        const card = document.createElement('div');
        card.className = "bg-slate-900/80 border border-slate-800/80 rounded-2xl p-5 hover:border-emerald-500/40 transition shadow-sm flex flex-col justify-between";
        card.innerHTML = \`
          <div>
            <div class="flex items-center justify-between mb-3">
              <span class="text-3xl">\${item.emoji}</span>
              <span class="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950 text-emerald-400 border border-emerald-800/40">\${item.badge}</span>
            </div>
            <h3 class="font-bold text-sm text-white mb-1">\${item.name}</h3>
            <p class="text-xs text-slate-400 leading-relaxed mb-4">\${item.desc}</p>
          </div>
          <div class="flex items-center justify-between pt-3 border-t border-slate-800/80">
            <span class="font-bold text-sm text-emerald-400 font-mono">$\${item.price.toFixed(2)}</span>
            <button onclick="addToCart('\${item.id}')" class="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold text-xs transition">+ Add to Bag</button>
          </div>
        \`;
        container.appendChild(card);
      });
    }

    function addToCart(id) {
      const item = items.find(i => i.id === id);
      const existing = cart.find(c => c.id === id);
      if (existing) existing.qty++;
      else cart.push({ ...item, qty: 1 });
      updateCartUI();
    }

    function updateCartUI() {
      const count = cart.reduce((acc, c) => acc + c.qty, 0);
      document.getElementById('cartCountBadge').textContent = count;

      const subtotal = cart.reduce((acc, c) => acc + (c.price * c.qty), 0);
      document.getElementById('subtotalVal').textContent = '$' + subtotal.toFixed(2);
      document.getElementById('totalVal').textContent = '$' + subtotal.toFixed(2);

      const list = document.getElementById('cartItemsList');
      if (cart.length === 0) {
        list.innerHTML = '<div class="text-center text-xs text-slate-500 py-10">Your basket is currently empty.</div>';
        return;
      }

      list.innerHTML = '';
      cart.forEach(c => {
        const row = document.createElement('div');
        row.className = "flex items-center justify-between p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs";
        row.innerHTML = \`
          <div>
            <div class="font-bold text-white">\${c.name}</div>
            <div class="text-[11px] text-emerald-400 font-mono">$\${c.price.toFixed(2)} x \${c.qty}</div>
          </div>
          <div class="flex items-center gap-2">
            <button onclick="changeQty('\${c.id}', -1)" class="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold">-</button>
            <span class="font-mono text-white">\${c.qty}</span>
            <button onclick="changeQty('\${c.id}', 1)" class="w-6 h-6 rounded bg-slate-700 hover:bg-slate-600 text-white font-bold">+</button>
          </div>
        \`;
        list.appendChild(row);
      });
    }

    function changeQty(id, delta) {
      const item = cart.find(c => c.id === id);
      if (!item) return;
      item.qty += delta;
      if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
      updateCartUI();
    }

    function toggleCart() {
      const drawer = document.getElementById('cartDrawer');
      drawer.classList.toggle('hidden');
    }

    function filterCat(cat) {
      activeCategory = cat;
      renderMenu();
    }

    function checkout() {
      if (cart.length === 0) return alert('Please add items to your cart first!');
      alert('Order placed successfully! Delivery courier is on the way in ~22 mins.');
      cart = [];
      updateCartUI();
      toggleCart();
    }

    renderMenu();
  </script>
</body>
</html>`
  }
];

