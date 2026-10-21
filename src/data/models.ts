export interface AIModelOption {
  id: string;
  name: string;
  badge: string;
  tag: 'Auto' | 'Pro Reasoning' | 'Ultra Fast' | 'Creative' | 'Voice & Audio' | 'Next-Gen' | 'Specialist';
  color: string;
  bgBadge: string;
  description: string;
  specialty?: string;
  maxInputTokens: number;
  maxInputChars: number;
}

export interface AutoRoutingResult {
  modelId: string;
  modelName: string;
  reason: string;
  badge: string;
}

export const AVAILABLE_MODELS: AIModelOption[] = [
  {
    id: 'auto-smart-select',
    name: 'Auto (Smart Model)',
    badge: 'Auto-Detect',
    tag: 'Auto',
    color: 'text-amber-400',
    bgBadge: 'bg-gradient-to-r from-amber-500/20 to-cyan-500/20 text-amber-300 border-amber-500/40',
    description: 'Intelligently analyzes your prompt or addition and automatically selects the optimal specialized AI engine for peak performance.',
    specialty: 'Dynamic intent-aware routing across all specialized engines',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'gemini-4-argon',
    name: 'ChargoX 4 Argon',
    badge: 'Pro Reasoning',
    tag: 'Pro Reasoning',
    color: 'text-fuchsia-400',
    bgBadge: 'bg-fuchsia-950 text-fuchsia-300 border-fuchsia-800/40',
    description: 'Deep multi-layer reasoning architecture for complex applications, state machines, and algorithmic logic.',
    specialty: 'Full-stack architecture & zero-drift code synthesis',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'gemini-3.8-flash',
    name: 'ChargoX 3.8 Flash',
    badge: 'Ultra Fast',
    tag: 'Ultra Fast',
    color: 'text-cyan-400',
    bgBadge: 'bg-cyan-950 text-cyan-300 border-cyan-800/40',
    description: 'High-speed autonomous coding & application builder with rapid real-time sandbox compilation.',
    specialty: 'Speed & multi-file interactive apps',
    maxInputTokens: 32768,
    maxInputChars: 131072,
  },
  {
    id: 'gemini-3.8-pro',
    name: 'ChargoX 3.8 Pro',
    badge: 'Deep Architect',
    tag: 'Pro Reasoning',
    color: 'text-indigo-400',
    bgBadge: 'bg-indigo-950 text-indigo-300 border-indigo-800/40',
    description: 'Advanced systems design, database schemas, local state persistence, and mathematical computing.',
    specialty: 'Enterprise logic & robust error handling',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'chargox-game-master',
    name: 'ChargoX Game Master',
    badge: '2D/3D Games',
    tag: 'Specialist',
    color: 'text-rose-400',
    bgBadge: 'bg-rose-950 text-rose-300 border-rose-800/40',
    description: 'Engineered specifically for HTML5 Canvas, arcade physics, collision math, particle bursts, and retro audio.',
    specialty: 'Game loops, delta-time physics & keyboard/touch controls',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'chargox-ui-designer',
    name: 'ChargoX UI/UX Designer',
    badge: 'Modern UI/UX',
    tag: 'Creative',
    color: 'text-violet-400',
    bgBadge: 'bg-violet-950 text-violet-300 border-violet-800/40',
    description: 'Specialized in modern cyber palettes, Tailwind CSS, glassmorphism, fluid typography, and micro-animations.',
    specialty: 'Visual hierarchy, accessibility & component aesthetics',
    maxInputTokens: 32768,
    maxInputChars: 131072,
  },
  {
    id: 'chargox-saas-data',
    name: 'ChargoX Data & SaaS',
    badge: 'Analytics & KPIs',
    tag: 'Specialist',
    color: 'text-emerald-400',
    bgBadge: 'bg-emerald-950 text-emerald-300 border-emerald-800/40',
    description: 'Specialized in executive KPI dashboards, charts, spreadsheet calculation tables, and CSV/JSON data export.',
    specialty: 'Financial metrics, charting & data filtering',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'gemini-3.1-flash-lite',
    name: 'ChargoX Flash Lite',
    badge: 'Instant Tweak',
    tag: 'Ultra Fast',
    color: 'text-teal-400',
    bgBadge: 'bg-teal-950 text-teal-300 border-teal-800/40',
    description: 'Sub-second response engine for rapid follow-up edits, color swaps, button additions, and bug fixes.',
    specialty: 'Near-instant iteration on existing apps',
    maxInputTokens: 32768,
    maxInputChars: 131072,
  },
  {
    id: 'gemini-3.8-live-extended-thinking',
    name: 'ChargoX Extended Thinking',
    badge: 'Deep CoT',
    tag: 'Pro Reasoning',
    color: 'text-purple-400',
    bgBadge: 'bg-purple-950 text-purple-300 border-purple-800/40',
    description: 'Multi-step autonomous planner with chain-of-thought verification, edge-case analysis, and self-correction.',
    specialty: 'Complex multi-step task planning',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'gemini-3.8-flash-tts',
    name: 'ChargoX Sound Design & Audio',
    badge: 'Web Audio SFX',
    tag: 'Voice & Audio',
    color: 'text-yellow-400',
    bgBadge: 'bg-yellow-950 text-yellow-300 border-yellow-800/40',
    description: 'Synthesizes interactive Web Audio oscillators, rhythm step sequencers, synthesizers, and click feedback.',
    specialty: 'Web Audio API sounds, chords & haptic feedback',
    maxInputTokens: 32768,
    maxInputChars: 131072,
  },
  {
    id: 'gemini-flash-latest',
    name: 'ChargoX Production Stable',
    badge: 'Zero Drift',
    tag: 'Next-Gen',
    color: 'text-blue-400',
    bgBadge: 'bg-blue-950 text-blue-300 border-blue-800/40',
    description: 'Strict prompt-adherent production checkpoint with zero hallucination and strict constraint enforcement.',
    specialty: 'High-fidelity requirements execution',
    maxInputTokens: 32768,
    maxInputChars: 131072,
  },
  {
    id: 'chargox-code-explainer',
    name: 'ChargoX Code Explainer & Tutor',
    badge: 'Code Explainer',
    tag: 'Specialist',
    color: 'text-amber-400',
    bgBadge: 'bg-amber-950 text-amber-300 border-amber-800/40',
    description: 'Expert tutor and software architect that breaks down code logic, answers architectural questions, and explains how functions work.',
    specialty: 'Explaining code, answering questions & teaching mechanics',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'chargox-ai-qa-aid',
    name: 'ChargoX Question & Knowledge Aid',
    badge: 'Q&A Aid',
    tag: 'Specialist',
    color: 'text-sky-400',
    bgBadge: 'bg-sky-950 text-sky-300 border-sky-800/40',
    description: 'Direct question-answering assistant that provides clear, articulate explanations without modifying or breaking existing code.',
    specialty: 'Accurate Q&A, conceptual clarity & technical advice',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'chargox-bug-hunter',
    name: 'ChargoX Bug Hunter & QA Auditor',
    badge: 'Bug Hunter',
    tag: 'Specialist',
    color: 'text-red-400',
    bgBadge: 'bg-red-950 text-red-300 border-red-800/40',
    description: 'Diagnostics specialist that identifies why errors occur, audits event listeners, fixes edge cases, and prevents crashes.',
    specialty: 'Diagnostics, debugging & runtime error prevention',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'chargox-math-logic',
    name: 'ChargoX Math & Logic Solver',
    badge: 'Math & Logic',
    tag: 'Specialist',
    color: 'text-emerald-400',
    bgBadge: 'bg-emerald-950 text-emerald-300 border-emerald-800/40',
    description: 'Specialized in score calculations, game probability, physics vectors, trigonometric motion, and numerical state logic.',
    specialty: 'Formulas, scoring math & deterministic logic',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'chargox-mobile-expert',
    name: 'ChargoX Mobile & Touch Engineer',
    badge: 'Mobile & Touch',
    tag: 'Specialist',
    color: 'text-cyan-400',
    bgBadge: 'bg-cyan-950 text-cyan-300 border-cyan-800/40',
    description: 'Specialized in responsive mobile viewports, touch controls, virtual on-screen DPads, gestures, and haptic feedback.',
    specialty: 'Mobile-first layout & touch event handling',
    maxInputTokens: 32768,
    maxInputChars: 131072,
  },
  {
    id: 'chargox-db-storage',
    name: 'ChargoX State & Storage Architect',
    badge: 'Storage & DB',
    tag: 'Specialist',
    color: 'text-pink-400',
    bgBadge: 'bg-pink-950 text-pink-300 border-pink-800/40',
    description: 'Specialized in LocalStorage persistence, high scores, JSON import/export, user data management, and data synchronization.',
    specialty: 'State persistence, high scores & data export',
    maxInputTokens: 65536,
    maxInputChars: 262144,
  },
  {
    id: 'chargox-universal-adaptive',
    name: 'ChargoX Universal Adaptive',
    badge: 'Zero-Latency Engine',
    tag: 'Specialist',
    color: 'text-orange-400',
    bgBadge: 'bg-orange-950 text-orange-300 border-orange-800/40',
    description: 'Universal deterministic code synthesizer with immediate compilation and complete offline support.',
    specialty: '100% prompt adherence with 0ms network dependency',
    maxInputTokens: 16384,
    maxInputChars: 65536,
  }
];

export const QUESTION_AIDS = [
  { id: 'auto-smart-select', label: 'Auto Aid', description: 'Auto-select best aid' },
  { id: 'chargox-code-explainer', label: 'Code Explainer', description: 'Explains logic step-by-step' },
  { id: 'chargox-ai-qa-aid', label: 'Direct Q&A Aid', description: 'Direct answer without code changes' },
  { id: 'chargox-bug-hunter', label: 'Bug Hunter', description: 'Finds errors and fixes issues' },
  { id: 'chargox-math-logic', label: 'Math & Logic', description: 'Explains formulas and scoring' },
  { id: 'chargox-mobile-expert', label: 'Mobile Aid', description: 'Mobile and touch optimization' },
];

/**
 * Intelligent Auto Model Router: Analyzes the user's prompt or addition
 * and selects the ideal specialized model for peak execution.
 */
export function resolveAutoModel(prompt: string): AutoRoutingResult {
  const p = (prompt || '').toLowerCase().trim();

  // Check if it is a question or inquiry first!
  const isQuestion = 
    p.endsWith('?') ||
    p.startsWith('how ') ||
    p.startsWith('why ') ||
    p.startsWith('what ') ||
    p.startsWith('where ') ||
    p.startsWith('when ') ||
    p.startsWith('can you explain') ||
    p.startsWith('explain ') ||
    p.startsWith('tell me ') ||
    p.startsWith('help me understand') ||
    p.includes('how does') ||
    p.includes('how do i') ||
    p.includes('why is') ||
    p.includes('what is');

  if (isQuestion) {
    if (p.includes('bug') || p.includes('error') || p.includes('crash') || p.includes('broken') || p.includes('why did it stop') || p.includes('freeze')) {
      return {
        modelId: 'chargox-bug-hunter',
        modelName: 'ChargoX Bug Hunter & QA Auditor',
        reason: 'Detected error inquiry or troubleshooting question; routing to Bug Hunter Aid',
        badge: 'Troubleshooting Aid'
      };
    }
    if (p.includes('score') || p.includes('math') || p.includes('calc') || p.includes('formula') || p.includes('points') || p.includes('physics')) {
      return {
        modelId: 'chargox-math-logic',
        modelName: 'ChargoX Math & Logic Solver',
        reason: 'Detected mathematical, physics or scoring inquiry; routing to Math & Logic Aid',
        badge: 'Math & Logic Aid'
      };
    }
    if (p.includes('code') || p.includes('function') || p.includes('how does') || p.includes('explain') || p.includes('what does')) {
      return {
        modelId: 'chargox-code-explainer',
        modelName: 'ChargoX Code Explainer & Tutor',
        reason: 'Detected code explanation question; routing to Code Explainer Aid',
        badge: 'Code Explainer Aid'
      };
    }
    return {
      modelId: 'chargox-ai-qa-aid',
      modelName: 'ChargoX Question & Knowledge Aid',
      reason: 'Detected user question; routing to dedicated Q&A Knowledge Aid for direct answers',
      badge: 'Q&A Knowledge Aid'
    };
  }

  // 1. Games, arcade, canvas, physics, 2D/3D
  if (
    p.includes('game') ||
    p.includes('arcade') ||
    p.includes('canvas') ||
    p.includes('snake') ||
    p.includes('shooter') ||
    p.includes('pong') ||
    p.includes('tic tac') ||
    p.includes('platformer') ||
    p.includes('physics') ||
    p.includes('gravity') ||
    p.includes('three.js') ||
    p.includes('3d')
  ) {
    return {
      modelId: 'chargox-game-master',
      modelName: 'ChargoX Game Master',
      reason: 'Detected interactive game mechanics, canvas loop, or physics simulation',
      badge: 'Game Physics Specialist'
    };
  }

  // 2. Sound, music, beat, synth, audio, drum
  if (
    p.includes('sound') ||
    p.includes('audio') ||
    p.includes('synth') ||
    p.includes('music') ||
    p.includes('drum') ||
    p.includes('beat') ||
    p.includes('oscillator') ||
    p.includes('piano') ||
    p.includes('frequency')
  ) {
    return {
      modelId: 'gemini-3.8-flash-tts',
      modelName: 'ChargoX Sound Design & Audio',
      reason: 'Detected Web Audio API synthesis, sound effects, or musical instruments',
      badge: 'Audio & SFX Specialist'
    };
  }

  // 3. Storage, localStorage, high scores, persistence, export
  if (
    p.includes('save') ||
    p.includes('store') ||
    p.includes('persist') ||
    p.includes('export') ||
    p.includes('download data') ||
    p.includes('high score') ||
    p.includes('database') ||
    p.includes('json')
  ) {
    return {
      modelId: 'chargox-db-storage',
      modelName: 'ChargoX State & Storage Architect',
      reason: 'Detected local persistence, data export or high score storage',
      badge: 'Storage & DB Specialist'
    };
  }

  // 4. Mobile, touch, swipe, gesture, responsive phone
  if (
    p.includes('mobile') ||
    p.includes('touch') ||
    p.includes('swipe') ||
    p.includes('gesture') ||
    p.includes('dpad') ||
    p.includes('joystick') ||
    p.includes('phone')
  ) {
    return {
      modelId: 'chargox-mobile-expert',
      modelName: 'ChargoX Mobile & Touch Engineer',
      reason: 'Detected mobile-first or touch interaction request',
      badge: 'Mobile & Touch Specialist'
    };
  }

  // 5. Data, metrics, dashboards, finance, charts, table, CSV, tracker, budget
  if (
    p.includes('dashboard') ||
    p.includes('saas') ||
    p.includes('chart') ||
    p.includes('metrics') ||
    p.includes('revenue') ||
    p.includes('analytics') ||
    p.includes('budget') ||
    p.includes('crypto') ||
    p.includes('stock') ||
    p.includes('finance') ||
    p.includes('csv') ||
    p.includes('spreadsheet') ||
    p.includes('calculator') ||
    p.includes('tracker')
  ) {
    return {
      modelId: 'chargox-saas-data',
      modelName: 'ChargoX Data & SaaS',
      reason: 'Detected data tables, charting, financial analytics, or metrics computing',
      badge: 'Data & Analytics Specialist'
    };
  }

  // 6. UI/UX, styling, dark theme, colors, aesthetic, glassmorphism, responsive design
  if (
    p.includes('theme') ||
    p.includes('dark mode') ||
    p.includes('color') ||
    p.includes('glass') ||
    p.includes('cyber') ||
    p.includes('glow') ||
    p.includes('style') ||
    p.includes('font') ||
    p.includes('design') ||
    p.includes('layout') ||
    p.includes('animation') ||
    p.includes('tailwind')
  ) {
    return {
      modelId: 'chargox-ui-designer',
      modelName: 'ChargoX UI/UX Designer',
      reason: 'Detected aesthetic styling, dark/light theme, micro-animations, or layout polish',
      badge: 'UI/UX Aesthetic Specialist'
    };
  }

  // 7. Short follow-up tweaks & quick edits (< 45 chars)
  if (
    p.length > 0 &&
    p.length < 45 &&
    (p.startsWith('add ') ||
      p.startsWith('change ') ||
      p.startsWith('fix ') ||
      p.startsWith('rename ') ||
      p.startsWith('make ') ||
      p.startsWith('remove ') ||
      p.startsWith('delete '))
  ) {
    return {
      modelId: 'gemini-3.1-flash-lite',
      modelName: 'ChargoX Flash Lite',
      reason: 'Detected quick atomic tweak; optimizing for sub-second rapid execution',
      badge: 'Sub-Second Quick Tweak'
    };
  }

  // 8. Deep reasoning, multi-step, algorithms, complex apps
  if (
    p.includes('algorithm') ||
    p.includes('complex') ||
    p.includes('state machine') ||
    p.includes('multi-step') ||
    p.includes('workflow') ||
    p.includes('architecture') ||
    p.includes('reasoning') ||
    p.includes('full-stack')
  ) {
    return {
      modelId: 'gemini-3.8-live-extended-thinking',
      modelName: 'ChargoX Extended Thinking',
      reason: 'Detected multi-step logical complexity and state architecture requirements',
      badge: 'Deep Reasoning Specialist'
    };
  }

  // 9. Default to flagship ChargoX 4 Argon for high reasoning and zero drift
  return {
    modelId: 'gemini-4-argon',
    modelName: 'ChargoX 4 Argon',
    reason: 'Flagship high-reasoning engine selected for balanced architectural fidelity',
    badge: 'Flagship Pro Reasoning'
  };
}

export function getModelById(id: string): AIModelOption {
  return AVAILABLE_MODELS.find((m) => m.id === id) || AVAILABLE_MODELS[0];
}
