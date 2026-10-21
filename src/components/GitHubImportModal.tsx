import React, { useState, useRef } from 'react';
import { 
  X, 
  Github, 
  Upload, 
  FolderArchive, 
  ExternalLink, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Search, 
  Star, 
  Code2, 
  FileCode,
  ArrowRight,
  RefreshCw,
  FolderUp,
  FileUp,
  Lock,
  Globe
} from 'lucide-react';
import JSZip from 'jszip';
import { AppProject, FileItem, GitHubRepo } from '../types';

interface GitHubImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (project: AppProject) => void;
}

export const GitHubImportModal: React.FC<GitHubImportModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'url' | 'user' | 'upload'>('url');
  
  // Tab 1: Repo URL state
  const [repoUrl, setRepoUrl] = useState('');
  const [branch, setBranch] = useState('');
  const [githubToken, setGithubToken] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string>('');
  const [importError, setImportError] = useState<string | null>(null);

  // Tab 2: User Repos state
  const [username, setUsername] = useState('');
  const [userRepos, setUserRepos] = useState<GitHubRepo[]>([]);
  const [isLoadingRepos, setIsLoadingRepos] = useState(false);
  const [repoSearchQuery, setRepoSearchQuery] = useState('');

  // Tab 3: Upload state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Preset sample repositories for quick 1-click test
  const SAMPLE_REPOS = [
    { name: '2048 Game', repo: 'gabrielecirulli/2048', desc: 'Classic sliding puzzle numbers game in HTML/JS' },
    { name: 'TodoMVC VanillaJS', repo: 'tastejs/todomvc/tree/master/examples/vanillajs', desc: 'Clean MVC task management application' },
    { name: 'HackerNews PWA', repo: 'tastejs/hacker-news-pwas', desc: 'Fast, responsive news client with live feed' },
  ];

  const handleImportByUrl = async (targetRepo?: string) => {
    const urlToUse = targetRepo || repoUrl;
    if (!urlToUse.trim()) {
      setImportError('Please enter a GitHub repository URL or "owner/repo"');
      return;
    }

    setImportError(null);
    setIsImporting(true);
    setImportStatus('Connecting to GitHub API...');

    try {
      setImportStatus('Analyzing repository structure and branches...');
      const res = await fetch('/api/github/import-repo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          repoUrl: urlToUse.trim(),
          branch: branch.trim() || undefined,
          token: githubToken.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to import repository');
      }

      setImportStatus('Compiling app preview & files...');
      setTimeout(() => {
        setIsImporting(false);
        onImportSuccess(data.project);
        onClose();
      }, 500);
    } catch (err: any) {
      setIsImporting(false);
      setImportError(err.message || 'An error occurred during GitHub import');
    }
  };

  const handleFetchUserRepos = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!username.trim() && !githubToken.trim()) {
      setImportError('Enter a GitHub username or Personal Access Token');
      return;
    }

    setIsLoadingRepos(true);
    setImportError(null);

    try {
      const params = new URLSearchParams();
      if (username.trim()) params.append('username', username.trim());
      if (githubToken.trim()) params.append('token', githubToken.trim());

      const res = await fetch(`/api/github/user-repos?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to fetch user repositories');
      }

      setUserRepos(data.repos || []);
    } catch (err: any) {
      setImportError(err.message || 'Failed to fetch user repositories');
    } finally {
      setIsLoadingRepos(false);
    }
  };

  // Handle ZIP file upload
  const handleZipUpload = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const zip = await JSZip.loadAsync(file);
      const extractedFiles: FileItem[] = [];

      // Extract text files
      const textExtensions = /\.(html|htm|css|js|jsx|ts|tsx|json|svg|md|txt)$/i;

      const entries = Object.keys(zip.files).filter((path) => {
        return !zip.files[path].dir && !path.startsWith('__MACOSX') && !path.includes('/.git/');
      });

      for (const relativePath of entries) {
        const zipEntry = zip.files[relativePath];
        if (textExtensions.test(relativePath)) {
          const content = await zipEntry.async('string');
          let type: 'html' | 'css' | 'javascript' | 'json' = 'javascript';
          if (/\.(html|htm)$/i.test(relativePath)) type = 'html';
          else if (/\.css$/i.test(relativePath)) type = 'css';
          else if (/\.json$/i.test(relativePath)) type = 'json';

          extractedFiles.push({
            name: relativePath.split('/').pop() || relativePath,
            path: `/${relativePath}`,
            type,
            content,
          });
        }
      }

      if (extractedFiles.length === 0) {
        throw new Error('No valid HTML, CSS, or JavaScript files were found in the uploaded archive.');
      }

      // Synthesize runnable HTML
      let previewHtml = '';
      const htmlFile = extractedFiles.find((f) => f.name.toLowerCase() === 'index.html') || extractedFiles.find((f) => f.type === 'html');
      
      if (htmlFile) {
        previewHtml = htmlFile.content;

        // Inline CSS
        const cssFiles = extractedFiles.filter((f) => f.type === 'css');
        cssFiles.forEach((css) => {
          const linkRegex = new RegExp(`<link[^>]+href=["'][^"']*${css.name}["'][^>]*>`, 'gi');
          if (linkRegex.test(previewHtml)) {
            previewHtml = previewHtml.replace(linkRegex, `<style>\n/* ${css.name} */\n${css.content}\n</style>`);
          } else if (previewHtml.includes('</head>')) {
            previewHtml = previewHtml.replace('</head>', `<style>\n/* ${css.name} */\n${css.content}\n</style>\n</head>`);
          }
        });

        // Inline JS
        const jsFiles = extractedFiles.filter((f) => f.type === 'javascript' && !f.name.endsWith('.d.ts'));
        jsFiles.forEach((js) => {
          const scriptRegex = new RegExp(`<script[^>]+src=["'][^"']*${js.name}["'][^>]*>\\s*<\\/script>`, 'gi');
          if (scriptRegex.test(previewHtml)) {
            previewHtml = previewHtml.replace(scriptRegex, `<script>\n// ${js.name}\n${js.content}\n</script>`);
          } else if (previewHtml.includes('</body>')) {
            previewHtml = previewHtml.replace('</body>', `<script>\n// ${js.name}\n${js.content}\n</script>\n</body>`);
          }
        });
      } else {
        // Create runner wrapper
        const jsCode = extractedFiles.filter((f) => f.type === 'javascript').map((f) => f.content).join('\n\n');
        const cssCode = extractedFiles.filter((f) => f.type === 'css').map((f) => f.content).join('\n\n');

        previewHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${file.name.replace(/\.[^/.]+$/, '')}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <style>${cssCode}</style>
</head>
<body class="bg-[#0b0d13] text-white p-6 font-sans">
  <div class="max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold mb-4 text-cyan-400">${file.name.replace(/\.[^/.]+$/, '')}</h1>
    <div id="app" class="p-4 rounded-xl bg-slate-900 border border-white/10"></div>
  </div>
  <script>${jsCode}</script>
</body>
</html>`;
      }

      const appName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ') || 'Uploaded App';
      const uploadedProject: AppProject = {
        id: `upload-${Date.now()}`,
        name: appName.charAt(0).toUpperCase() + appName.slice(1),
        prompt: `Uploaded project archive: ${file.name}`,
        summary: `Imported application "${file.name}" containing ${extractedFiles.length} files. Fully loaded into ChargoX for editing and enhancement.`,
        category: 'Utility',
        tags: ['Uploaded', 'Custom App'],
        createdAt: 'Just now',
        sourceType: 'upload',
        files: extractedFiles,
        previewHtml,
        planSteps: [
          { action: `Decompressed archive: ${file.name}`, detail: `Extracted ${extractedFiles.length} files`, status: 'completed', timestamp: '20ms' },
          { action: 'Parsing index.html and stylesheets', detail: 'Bundled styles and scripts into sandbox preview', status: 'completed', timestamp: '80ms' },
          { action: 'Compiling applet runtime', detail: 'Preview generated successfully. Ready for ChargoX AI edits!', status: 'completed', timestamp: '120ms' }
        ],
        suggestions: [
          'Redesign UI with modern Tailwind CSS styling',
          'Add dark mode theme toggle',
          'Add mobile responsive layout',
          'Add local storage state persistence'
        ]
      };

      setIsUploading(false);
      onImportSuccess(uploadedProject);
      onClose();
    } catch (err: any) {
      setIsUploading(false);
      setUploadError(err.message || 'Failed to process uploaded file');
    }
  };

  const filteredRepos = userRepos.filter((r) => 
    r.name.toLowerCase().includes(repoSearchQuery.toLowerCase()) ||
    (r.description && r.description.toLowerCase().includes(repoSearchQuery.toLowerCase()))
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-[#12151e] border border-[#272d40] rounded-2xl max-w-2xl w-full p-6 shadow-2xl text-slate-100 relative animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-[#757b8c] hover:text-white p-1 rounded-lg hover:bg-[#1f2434] transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Title */}
        <div className="flex items-center gap-3.5 mb-5 shrink-0">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#24292e] to-[#404654] border border-white/10 flex items-center justify-center text-white shadow-lg">
            <Github className="w-6 h-6 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="font-bold text-lg text-white">Import & Edit Existing App</h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 font-bold border border-cyan-800/40">
                GitHub & ZIP
              </span>
            </div>
            <p className="text-xs text-[#8c92a2]">
              Upload an app you already made from GitHub or your computer and edit it in ChargoX
            </p>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-[#222736] mb-5 shrink-0">
          <button
            onClick={() => { setActiveTab('url'); setImportError(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'url'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-[#7e8596] hover:text-slate-200'
            }`}
          >
            <Github className="w-3.5 h-3.5" />
            <span>GitHub Repository URL</span>
          </button>

          <button
            onClick={() => { setActiveTab('user'); setImportError(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'user'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-[#7e8596] hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>My GitHub Repos</span>
          </button>

          <button
            onClick={() => { setActiveTab('upload'); setImportError(null); }}
            className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold border-b-2 transition ${
              activeTab === 'upload'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-[#7e8596] hover:text-slate-200'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload ZIP or Files</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto pr-1">
          {/* TAB 1: Import via Repo URL */}
          {activeTab === 'url' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-[#c4cad7] mb-1.5">
                  GitHub Repository URL or <code className="text-cyan-300 font-mono text-[11px]">owner/repo</code>
                </label>
                <div className="relative">
                  <Github className="w-4 h-4 text-[#666c7d] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    placeholder="https://github.com/username/my-project or username/repo"
                    className="w-full bg-[#171b26] border border-[#2a3044] focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#5d6373] focus:outline-none transition"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-[#c4cad7] mb-1.5">
                    Branch <span className="text-[#6d7384]">(optional, defaults to main)</span>
                  </label>
                  <input
                    type="text"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    placeholder="main or master"
                    className="w-full bg-[#171b26] border border-[#2a3044] focus:border-cyan-500 rounded-xl px-3 py-2 text-xs text-white placeholder-[#5d6373] focus:outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#c4cad7] mb-1.5">
                    Personal Access Token <span className="text-[#6d7384]">(optional)</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-3.5 h-3.5 text-[#666c7d] absolute left-3 top-2.5" />
                    <input
                      type="password"
                      value={githubToken}
                      onChange={(e) => setGithubToken(e.target.value)}
                      placeholder="ghp_xxx (for private repos)"
                      className="w-full bg-[#171b26] border border-[#2a3044] focus:border-cyan-500 rounded-xl pl-8 pr-3 py-2 text-xs text-white placeholder-[#5d6373] focus:outline-none transition"
                    />
                  </div>
                </div>
              </div>

              {/* Sample Quick Repos */}
              <div className="pt-2">
                <div className="text-[11px] font-semibold text-[#828898] uppercase tracking-wider mb-2">
                  Try Sample Open Source Apps:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {SAMPLE_REPOS.map((sample) => (
                    <button
                      key={sample.name}
                      onClick={() => {
                        setRepoUrl(sample.repo);
                        handleImportByUrl(sample.repo);
                      }}
                      className="p-2.5 rounded-xl bg-[#161a25] hover:bg-[#1d2232] border border-[#272d40] text-left transition group cursor-pointer"
                    >
                      <div className="text-xs font-bold text-white group-hover:text-cyan-300 flex items-center justify-between">
                        <span>{sample.name}</span>
                        <ArrowRight className="w-3 h-3 text-[#646b7c] group-hover:text-cyan-400 group-hover:translate-x-0.5 transition" />
                      </div>
                      <div className="text-[10px] text-[#787f90] line-clamp-1 mt-0.5">
                        {sample.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Error Box */}
              {importError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{importError}</span>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  onClick={() => handleImportByUrl()}
                  disabled={isImporting || !repoUrl.trim()}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-500 to-fuchsia-500 hover:opacity-90 disabled:opacity-40 text-slate-950 font-extrabold text-xs shadow-lg shadow-cyan-500/20 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{importStatus || 'Importing from GitHub...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" />
                      <span>Import App & Edit in ChargoX</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Browse My GitHub Repos */}
          {activeTab === 'user' && (
            <div className="space-y-4">
              <form onSubmit={handleFetchUserRepos} className="flex gap-2">
                <div className="relative flex-1">
                  <Github className="w-4 h-4 text-[#666c7d] absolute left-3 top-3.5" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Enter your GitHub username (e.g. torvalds)"
                    className="w-full bg-[#171b26] border border-[#2a3044] focus:border-cyan-500 rounded-xl pl-9 pr-4 py-2.5 text-xs text-white placeholder-[#5d6373] focus:outline-none transition"
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoadingRepos || !username.trim()}
                  className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 disabled:opacity-40 text-white font-bold text-xs transition flex items-center gap-1.5 shrink-0 cursor-pointer"
                >
                  {isLoadingRepos ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  <span>Fetch Repos</span>
                </button>
              </form>

              {userRepos.length > 0 && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#636979] absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={repoSearchQuery}
                      onChange={(e) => setRepoSearchQuery(e.target.value)}
                      placeholder="Filter your repositories..."
                      className="w-full bg-[#141722] border border-[#252a3b] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder-[#5a6070] focus:outline-none"
                    />
                  </div>

                  <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                    {filteredRepos.map((repo) => (
                      <div
                        key={repo.full_name}
                        className="p-3 rounded-xl bg-[#161a25] hover:bg-[#1c2130] border border-[#272d3f] flex items-center justify-between transition group"
                      >
                        <div className="flex-1 min-w-0 mr-3">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-xs text-white group-hover:text-cyan-300 truncate">
                              {repo.name}
                            </span>
                            {repo.private && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40">
                                Private
                              </span>
                            )}
                            {repo.language && (
                              <span className="text-[9px] px-1.5 py-0.2 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40">
                                {repo.language}
                              </span>
                            )}
                          </div>
                          {repo.description && (
                            <p className="text-[11px] text-[#7d8496] truncate mt-0.5">
                              {repo.description}
                            </p>
                          )}
                        </div>

                        <button
                          onClick={() => handleImportByUrl(repo.full_name)}
                          disabled={isImporting}
                          className="px-3 py-1.5 rounded-lg bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-500/30 text-xs font-semibold transition shrink-0 cursor-pointer"
                        >
                          Import
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {importError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{importError}</span>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: Upload ZIP or Files */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div 
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                    handleZipUpload(e.dataTransfer.files[0]);
                  }
                }}
                className="border-2 border-dashed border-[#2f354a] hover:border-cyan-500/60 rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition bg-[#151823]/60 hover:bg-[#181c2a]"
              >
                <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-3">
                  <FolderArchive className="w-7 h-7" />
                </div>
                <h3 className="font-bold text-sm text-white mb-1">
                  Upload App Archive (.ZIP) or Files
                </h3>
                <p className="text-xs text-[#828898] max-w-sm mb-4">
                  Drag and drop a .zip file of an existing app, or click to browse files from your computer
                </p>

                <div className="flex gap-2">
                  <span className="px-3 py-1.5 rounded-lg bg-[#222838] hover:bg-[#2b3346] text-xs font-semibold text-cyan-300 transition flex items-center gap-1.5">
                    <FileUp className="w-3.5 h-3.5" />
                    <span>Choose .ZIP File</span>
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".zip"
                  className="hidden"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleZipUpload(e.target.files[0]);
                    }
                  }}
                />
              </div>

              {isUploading && (
                <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-800/40 text-cyan-300 text-xs flex items-center gap-3">
                  <Loader2 className="w-4 h-4 animate-spin text-cyan-400 shrink-0" />
                  <span>Extracting project files, parsing HTML & styles...</span>
                </div>
              )}

              {uploadError && (
                <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/40 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                  <span>{uploadError}</span>
                </div>
              )}

              <div className="p-3.5 rounded-xl bg-[#161a25] border border-[#262c3e] text-xs text-[#8c92a4] space-y-1">
                <div className="font-semibold text-white">How it works:</div>
                <p className="text-[11px] leading-relaxed">
                  ChargoX extracts your files, boots the app in the live preview sandbox on the right, and lets you use plain English prompts or the built-in code editor to modify, restyle, and extend your app.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-5 pt-4 border-t border-[#202534] flex items-center justify-between text-xs text-[#717686] shrink-0">
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" /> Seamless ChargoX Engine
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#1f2433] hover:bg-[#282f42] text-white text-xs font-semibold transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
