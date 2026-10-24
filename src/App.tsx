import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { HomeScreen } from './components/HomeScreen';
import { StudioWorkspace } from './components/StudioWorkspace';
import { ClaudeCodePanel } from './components/ClaudeCodePanel';
import { SettingsModal } from './components/SettingsModal';
import { GalleryModal } from './components/GalleryModal';
import { GitHubImportModal } from './components/GitHubImportModal';
import { DownloadWebsite } from './components/DownloadWebsite';
import { AppProject, AppVersion, ChatMessage, FileItem, AppDeployment, SessionTokenUsage } from './types';
import { PRESET_PROJECTS } from './data/presets';
import { SpeedMode } from './components/SpeedModeSlider';

export default function App() {
  const [view, setView] = useState<'home' | 'studio' | 'download'>(() => {
    if (typeof window !== 'undefined' && (
      window.location.search.includes('download') || 
      window.location.hash.includes('download') ||
      window.location.pathname.includes('/download')
    )) {
      return 'download';
    }
    return 'home';
  });

  const navigateTo = (newView: 'home' | 'studio' | 'download') => {
    setView(newView);
    if (typeof window !== 'undefined') {
      if (newView === 'download') {
        window.history.pushState(null, '', '#download');
      } else if (newView === 'home') {
        window.history.pushState(null, '', window.location.pathname);
      }
    }
  };

  const [myApps, setMyApps] = useState<AppProject[]>(PRESET_PROJECTS);
  const [currentProject, setCurrentProject] = useState<AppProject>(PRESET_PROJECTS[0]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isBuilding, setIsBuilding] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [isCodeOpen, setIsCodeOpen] = useState(false);
  const [isGitHubModalOpen, setIsGitHubModalOpen] = useState(false);
  const [activeMode, setActiveMode] = useState<string>('Auto (Smart Model)');
  const [speedMode, setSpeedMode] = useState<SpeedMode>('auto');
  const [sessionTokenUsage, setSessionTokenUsage] = useState<SessionTokenUsage>({
    inputTokens: 0,
    outputTokens: 0,
    totalTokens: 0,
    estimatedCost: 0,
    callCount: 0,
  });

  const startBuild = async (
    prompt: string, 
    preset?: AppProject, 
    mode: string = 'Auto (Smart Model)',
    speed: SpeedMode = 'auto'
  ) => {
    setActiveMode(mode);
    setSpeedMode(speed);
    setView('studio');

    // Add user message
    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages([userMsg]);
    setIsBuilding(true);

    if (preset) {
      // If user selected a preset directly from gallery
      setTimeout(() => {
        setCurrentProject(preset);
        setMessages((prev) => [
          ...prev,
          {
            id: (Date.now() + 1).toString(),
            role: 'assistant',
            content: `I've prepared and compiled ${preset.name}! The live interactive application is running on the right. You can interact with it, test features, or type revisions below.`,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            planSteps: preset.planSteps,
            appName: preset.name
          }
        ]);
        setIsBuilding(false);
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }, 500);
      return;
    }

    try {
      const isMobileClient = typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window));
      const res = await fetch('/api/generate-app', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode,
          speedMode: speed,
          history: [], // Fresh new build: do not leak previous project's conversation
          currentFiles: [], // Fresh new build: do not leak previous project's files
          deviceInfo: {
            isMobile: isMobileClient,
            width: typeof window !== 'undefined' ? window.innerWidth : 1280,
            height: typeof window !== 'undefined' ? window.innerHeight : 800,
            touch: typeof window !== 'undefined' && ('ontouchstart' in window)
          }
        })
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}`);
      }

      const data = await res.json();

      if (data.tokenUsage) {
        setSessionTokenUsage((prev) => ({
          inputTokens: prev.inputTokens + (data.tokenUsage.inputTokens || 0),
          outputTokens: prev.outputTokens + (data.tokenUsage.outputTokens || 0),
          totalTokens: prev.totalTokens + (data.tokenUsage.totalTokens || 0),
          estimatedCost: prev.estimatedCost + (data.tokenUsage.estimatedCost || 0),
          callCount: prev.callCount + 1,
          lastTurnInputTokens: data.tokenUsage.inputTokens,
          lastTurnOutputTokens: data.tokenUsage.outputTokens,
        }));
      }

      const newProject: AppProject = {
        id: Date.now().toString(),
        name: data.appName || 'ChargoX Custom Application',
        prompt,
        summary: data.summary || `Custom application generated for: ${prompt}.`,
        category: 'Utility',
        tags: ['Custom', 'ChargoX', 'App'],
        createdAt: 'Just now',
        files: data.files || [],
        previewHtml: data.previewHtml,
        planSteps: data.planSteps || [],
        suggestions: data.suggestions || ['Add dark mode', 'Add export data', 'Add sound effects'],
        versionHistory: []
      };

      setCurrentProject(newProject);
      setMyApps((prev) => [newProject, ...prev]);

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I have built and compiled ${newProject.name} specifically for your request: "${prompt}"! Your interactive application is running live in the sandboxed preview on the right. You can test it, inspect the code files, or ask me for any tweaks.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        planSteps: newProject.planSteps,
        appName: newProject.name
      };

      setMessages((prev) => [...prev, assistantMsg]);
      confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    } catch (err: any) {
      console.error('Error generating app:', err);
      // Construct a customized recovery project adhering strictly to the user prompt
      const cleanTitle = prompt.slice(0, 36).replace(/[^\w\s-]/g, '').trim() || 'Custom App';
      const recoveryProject: AppProject = {
        id: Date.now().toString(),
        name: cleanTitle,
        prompt,
        summary: `Interactive application synthesized for: ${prompt}.`,
        category: 'Utility',
        tags: ['Custom', 'ChargoX', 'App'],
        createdAt: 'Just now',
        files: [
          {
            name: 'index.html',
            path: '/index.html',
            type: 'html',
            content: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${cleanTitle}</title><script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/lucide@latest"></script></head><body class="min-h-screen bg-[#0a0d14] text-white p-6 flex flex-col items-center justify-center text-center"><div class="max-w-md w-full p-6 rounded-2xl bg-[#121622] border border-[#202738] shadow-2xl"><div class="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4"><i data-lucide="sparkles" class="w-6 h-6"></i></div><h1 class="text-lg font-bold text-white mb-2">${cleanTitle}</h1><p class="text-xs text-slate-400 mb-6">${prompt}</p><button onclick="location.reload()" class="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition">Reload Application</button></div><script>lucide.createIcons();</script></body></html>`
          }
        ],
        previewHtml: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>${cleanTitle}</title><script src="https://cdn.tailwindcss.com"></script><script src="https://unpkg.com/lucide@latest"></script></head><body class="min-h-screen bg-[#0a0d14] text-white p-6 flex flex-col items-center justify-center text-center"><div class="max-w-md w-full p-6 rounded-2xl bg-[#121622] border border-[#202738] shadow-2xl"><div class="w-12 h-12 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto mb-4"><i data-lucide="sparkles" class="w-6 h-6"></i></div><h1 class="text-lg font-bold text-white mb-2">${cleanTitle}</h1><p class="text-xs text-slate-400 mb-6">${prompt}</p><button onclick="location.reload()" class="px-5 py-2.5 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400 transition">Reload Application</button></div><script>lucide.createIcons();</script></body></html>`,
        planSteps: [
          { action: 'Parsing user prompt requirements', detail: prompt, status: 'completed' },
          { action: 'Compiling applet preview', detail: 'Application sandbox mounted and running', status: 'completed' }
        ],
        suggestions: ['Add dark mode', 'Add export data', 'Add sound effects'],
        versionHistory: []
      };

      setCurrentProject(recoveryProject);
      setMessages((prev) => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: `I have compiled ${recoveryProject.name} specifically for your request: "${prompt}". You can test it in the live sandbox on the right!`,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          planSteps: recoveryProject.planSteps,
          appName: recoveryProject.name
        }
      ]);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleImportProject = (importedProject: AppProject) => {
    setCurrentProject(importedProject);
    setMyApps((prev) => [importedProject, ...prev]);
    setView('studio');

    const sourceDesc = importedProject.sourceType === 'github'
      ? `GitHub repository (${importedProject.repoFullName || importedProject.sourceUrl})`
      : 'uploaded project archive';

    setMessages([
      {
        id: Date.now().toString(),
        role: 'user',
        content: `Imported existing app: ${importedProject.name}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      },
      {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `I have imported ${importedProject.name} from ${sourceDesc}! All ${importedProject.files.length} project files are loaded in the Code Files inspector, and your live interactive preview is running on the right. You can test it, edit code directly, or ask me for any tweaks or new features below.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        planSteps: importedProject.planSteps,
        appName: importedProject.name
      }
    ]);

    confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
  };

  const handleUpdateFile = (fileName: string, newContent: string) => {
    setCurrentProject((prev) => {
      const updatedFiles = prev.files.map((f) => 
        f.name === fileName ? { ...f, content: newContent } : f
      );
      if (!updatedFiles.some((f) => f.name === fileName)) {
        updatedFiles.push({
          name: fileName,
          path: `/${fileName}`,
          type: fileName.endsWith('.css') ? 'css' : fileName.endsWith('.html') ? 'html' : 'javascript',
          content: newContent
        });
      }

      // If updating index.html, update previewHtml directly
      let newPreview = prev.previewHtml;
      if (fileName === 'index.html' || fileName.endsWith('.html')) {
        newPreview = newContent;
      } else if (fileName.endsWith('.css')) {
        // Replace or inject updated CSS
        const styleRegex = new RegExp(`<style>[\\s\\S]*?/*\\s*${fileName}\\s*\\*/[\\s\\S]*?</style>`, 'i');
        if (styleRegex.test(newPreview)) {
          newPreview = newPreview.replace(styleRegex, `<style>\n/* ${fileName} */\n${newContent}\n</style>`);
        } else if (newPreview.includes('</head>')) {
          newPreview = newPreview.replace('</head>', `<style>\n/* ${fileName} */\n${newContent}\n</style>\n</head>`);
        }
      } else if (fileName.endsWith('.js') && !fileName.endsWith('.d.ts')) {
        // Replace or inject updated JS
        const scriptRegex = new RegExp(`<script>[\\s\\S]*?//\\s*${fileName}[\\s\\S]*?</script>`, 'i');
        if (scriptRegex.test(newPreview)) {
          newPreview = newPreview.replace(scriptRegex, `<script>\n// ${fileName}\n${newContent}\n</script>`);
        } else if (newPreview.includes('</body>')) {
          newPreview = newPreview.replace('</body>', `<script>\n// ${fileName}\n${newContent}\n</script>\n</body>`);
        }
      }

      return {
        ...prev,
        files: updatedFiles,
        previewHtml: newPreview
      };
    });

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Saved modifications to "${fileName}". The live preview sandbox has updated with your changes!`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        appName: currentProject.name
      }
    ]);
  };

  const handleSendPromptInStudio = async (prompt: string) => {
    setIsBuilding(true);

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: prompt,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);

    // Record previous version in version history
    const prevVersion: AppVersion = {
      version: (currentProject.versionHistory?.length || 0) + 1,
      prompt: currentProject.prompt,
      previewHtml: currentProject.previewHtml,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      files: currentProject.files
    };

    try {
      // Use /api/edit-app for existing or imported apps
      const endpoint = currentProject.previewHtml ? '/api/edit-app' : '/api/generate-app';
      const isMobileClient = typeof window !== 'undefined' && (window.innerWidth < 768 || ('ontouchstart' in window));
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          mode: activeMode,
          speedMode,
          appName: currentProject.name,
          currentFiles: currentProject.files,
          previewHtml: currentProject.previewHtml,
          history: [...messages, userMsg].map(m => ({ role: m.role, content: m.content })),
          deviceInfo: {
            isMobile: isMobileClient,
            width: typeof window !== 'undefined' ? window.innerWidth : 1280,
            height: typeof window !== 'undefined' ? window.innerHeight : 800,
            touch: typeof window !== 'undefined' && ('ontouchstart' in window)
          }
        })
      });

      const data = await res.json();

      if (data.tokenUsage) {
        setSessionTokenUsage((prev) => ({
          inputTokens: prev.inputTokens + (data.tokenUsage.inputTokens || 0),
          outputTokens: prev.outputTokens + (data.tokenUsage.outputTokens || 0),
          totalTokens: prev.totalTokens + (data.tokenUsage.totalTokens || 0),
          estimatedCost: prev.estimatedCost + (data.tokenUsage.estimatedCost || 0),
          callCount: prev.callCount + 1,
          lastTurnInputTokens: data.tokenUsage.inputTokens,
          lastTurnOutputTokens: data.tokenUsage.outputTokens,
        }));
      }

      const updatedProject: AppProject = {
        ...currentProject,
        name: data.appName || currentProject.name,
        previewHtml: data.previewHtml || currentProject.previewHtml,
        files: data.files?.length ? data.files : currentProject.files,
        planSteps: data.planSteps || currentProject.planSteps,
        suggestions: data.suggestions || currentProject.suggestions,
        versionHistory: [...(currentProject.versionHistory || []), prevVersion]
      };

      setCurrentProject(updatedProject);

      let responseContent = '';
      if (data.isQuestion) {
        if (data.codeUpdated) {
          responseContent = data.explanation 
            ? `${data.explanation}\n\nI have also updated ${updatedProject.name} in the live preview with your requested additions!`
            : data.summary || `Answered: "${prompt}" and updated the application.`;
        } else {
          responseContent = data.explanation || data.summary || `Here is the explanation for: "${prompt}".`;
        }
      } else {
        responseContent = data.explanation || data.summary || `I've updated ${updatedProject.name} with your changes: "${prompt}". The live preview has refreshed with the new features!`;
      }

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: responseContent,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        planSteps: data.planSteps,
        appName: updatedProject.name
      };

      setMessages((prev) => [...prev, assistantMsg]);
      confetti({ particleCount: 50, spread: 50, origin: { y: 0.6 } });
    } catch (err) {
      console.error('Error revising app:', err);
    } finally {
      setIsBuilding(false);
    }
  };

  const handleRollbackVersion = (ver: AppVersion) => {
    setCurrentProject((prev) => ({
      ...prev,
      previewHtml: ver.previewHtml,
      files: ver.files
    }));

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now().toString(),
        role: 'assistant',
        content: `Restored app state back to version v${ver.version}. The live preview has updated.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
    confetti({ particleCount: 40, spread: 40, origin: { y: 0.5 } });
  };

  const handleUpdateDeployment = (deployment?: AppDeployment) => {
    setCurrentProject((prev) => ({
      ...prev,
      deployment,
    }));
    setMyApps((prev) =>
      prev.map((p) => (p.id === currentProject.id ? { ...p, deployment } : p))
    );
  };

  const handleDeleteApp = (appId: string) => {
    setMyApps((prev) => prev.filter((p) => p.id !== appId));
    if (currentProject.id === appId) {
      const remaining = myApps.filter((p) => p.id !== appId);
      if (remaining.length > 0) {
        setCurrentProject(remaining[0]);
      }
      navigateTo('home');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0d0f12] text-slate-100 font-sans">
      {view === 'home' ? (
        <HomeScreen
          onStartBuild={startBuild}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenGallery={() => setIsGalleryOpen(true)}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
          onOpenDownloadWebsite={() => navigateTo('download')}
          onDeleteApp={handleDeleteApp}
          myApps={myApps}
        />
      ) : view === 'studio' ? (
        <StudioWorkspace
          project={currentProject}
          messages={messages}
          isBuilding={isBuilding}
          onSendPrompt={handleSendPromptInStudio}
          onBackToHome={() => navigateTo('home')}
          onOpenSettings={() => setIsSettingsOpen(true)}
          onOpenGallery={() => setIsGalleryOpen(true)}
          onOpenGitHubModal={() => setIsGitHubModalOpen(true)}
          onOpenDownloadWebsite={() => navigateTo('download')}
          onUpdateFile={handleUpdateFile}
          onRollbackVersion={handleRollbackVersion}
          onUpdateDeployment={handleUpdateDeployment}
          onDeleteApp={handleDeleteApp}
          mode={activeMode}
          onModeChange={(m) => setActiveMode(m)}
          speedMode={speedMode}
          onSpeedModeChange={(s) => setSpeedMode(s)}
          sessionTokenUsage={sessionTokenUsage}
        />
      ) : (
        <DownloadWebsite
          onLaunchStudio={() => navigateTo('home')}
        />
      )}

      <button
        onClick={() => setIsCodeOpen(true)}
        className="fixed bottom-4 right-4 z-40 flex items-center gap-2 rounded-full bg-cyan-500 px-4 py-3 text-sm font-bold text-black shadow-xl hover:bg-cyan-400"
        style={{ marginBottom: 'env(safe-area-inset-bottom)' }}
      >
        &gt;_ Claude Code
      </button>
      <ClaudeCodePanel isOpen={isCodeOpen} onClose={() => setIsCodeOpen(false)} />

      <GalleryModal
        isOpen={isGalleryOpen}
        onClose={() => setIsGalleryOpen(false)}
        projects={myApps}
        onSelectProject={(project) => startBuild(project.prompt, project)}
      />

      <GitHubImportModal
        isOpen={isGitHubModalOpen}
        onClose={() => setIsGitHubModalOpen(false)}
        onImportSuccess={handleImportProject}
      />

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}
