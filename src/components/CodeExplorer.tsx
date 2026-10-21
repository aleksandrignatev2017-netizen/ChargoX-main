import React, { useState, useEffect } from 'react';
import { 
  FileCode, 
  Copy, 
  Check, 
  Download, 
  FileText, 
  FolderOpen,
  Edit3,
  Play,
  RotateCcw,
  Sparkles,
  Save
} from 'lucide-react';
import JSZip from 'jszip';
import { FileItem } from '../types';

interface CodeExplorerProps {
  files: FileItem[];
  previewHtml: string;
  appName: string;
  onUpdateFile?: (fileName: string, newContent: string) => void;
}

export const CodeExplorer: React.FC<CodeExplorerProps> = ({
  files,
  previewHtml,
  appName,
  onUpdateFile,
}) => {
  // Ensure we have at least index.html if files array is minimal
  const allFiles: FileItem[] = files.length > 0 ? files : [
    { name: 'index.html', path: '/index.html', type: 'html', content: previewHtml }
  ];

  const [activeFile, setActiveFile] = useState<FileItem>(allFiles[0]);
  const [copied, setCopied] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(activeFile.content);
  const [savedSuccess, setSavedSuccess] = useState(false);

  // Sync editedContent when activeFile changes
  useEffect(() => {
    setEditedContent(activeFile.content);
    setIsEditing(false);
  }, [activeFile.name, activeFile.content]);

  const handleCopy = () => {
    navigator.clipboard.writeText(isEditing ? editedContent : activeFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveAndRun = () => {
    if (onUpdateFile) {
      onUpdateFile(activeFile.name, editedContent);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 2500);
    }
  };

  const handleDownloadZip = async () => {
    const zip = new JSZip();
    allFiles.forEach((file) => {
      const content = file.name === activeFile.name && isEditing ? editedContent : file.content;
      zip.file(file.name, content);
    });
    if (!allFiles.some(f => f.name === 'index.html')) {
      zip.file('index.html', previewHtml);
    }
    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${appName.toLowerCase().replace(/[^a-z0-9]/g, '-')}-chargox.zip`;
    a.click();
  };

  const lines = (isEditing ? editedContent : activeFile.content).split('\n');

  return (
    <div className="flex h-full w-full bg-[#0d0f12] text-slate-200 select-none overflow-hidden">
      {/* File Tree Sidebar */}
      <div className="w-56 border-r border-[#1e222c] bg-[#11141a] flex flex-col shrink-0">
        <div className="p-3 border-b border-[#1e222c] flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white uppercase tracking-wider">
            <FolderOpen className="w-4 h-4 text-cyan-400" />
            <span>Files ({allFiles.length})</span>
          </div>
          <button 
            onClick={handleDownloadZip}
            className="p-1 rounded text-[#888d9a] hover:text-white hover:bg-[#1a1e28] transition"
            title="Download ZIP"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          <div className="px-2 py-1 text-[11px] font-semibold text-[#666a74] uppercase tracking-wider">
            Project Files
          </div>
          {allFiles.map((file) => (
            <button
              key={file.name}
              onClick={() => {
                const target = allFiles.find(f => f.name === file.name) || file;
                setActiveFile(target);
              }}
              className={`w-full flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-mono transition text-left cursor-pointer ${
                activeFile.name === file.name
                  ? 'bg-[#1e2330] text-cyan-300 font-semibold border border-cyan-500/20'
                  : 'text-[#9ea4b4] hover:text-white hover:bg-[#161a22]'
              }`}
            >
              <FileCode className={`w-3.5 h-3.5 shrink-0 ${
                file.name.endsWith('.html') ? 'text-amber-400' :
                file.name.endsWith('.css') ? 'text-sky-400' :
                file.name.endsWith('.json') ? 'text-purple-400' : 'text-emerald-400'
              }`} />
              <span className="truncate">{file.name}</span>
            </button>
          ))}
        </div>

        <div className="p-3 border-t border-[#1e222c] space-y-2">
          <button
            onClick={handleDownloadZip}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#1c212e] hover:bg-[#252b3c] text-cyan-300 font-bold text-xs border border-cyan-500/30 transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export ZIP</span>
          </button>
        </div>
      </div>

      {/* Code Viewer / Editor */}
      <div className="flex-1 flex flex-col min-w-0 bg-[#0a0c10]">
        {/* File Header */}
        <div className="h-11 border-b border-[#1e222c] bg-[#12151c] px-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-xs font-mono text-[#c2c7d4]">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span className="font-bold text-white">{activeFile.name}</span>
            <span className="text-[#686d77] text-[11px]">({lines.length} lines)</span>
            {isEditing && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-950 text-amber-300 border border-amber-800/40 font-sans font-semibold">
                Editing
              </span>
            )}
            {savedSuccess && (
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40 font-sans font-semibold flex items-center gap-1">
                <Check className="w-3 h-3 text-emerald-400" /> Applied to Live Preview
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={() => {
                    setEditedContent(activeFile.content);
                    setIsEditing(false);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#1a1e28] hover:bg-[#222836] text-xs text-[#a0a5b2] hover:text-white transition"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Cancel</span>
                </button>
                <button
                  onClick={handleSaveAndRun}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 hover:opacity-90 text-slate-950 font-bold text-xs shadow-md shadow-cyan-500/20 transition cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Save & Apply</span>
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1e28] hover:bg-[#222836] text-xs text-cyan-300 hover:text-white border border-cyan-500/30 transition cursor-pointer"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit Code</span>
              </button>
            )}

            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#1a1e28] hover:bg-[#222836] text-xs text-[#a0a5b2] hover:text-white border border-[#262c3b] transition cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Code Content */}
        {isEditing ? (
          <div className="flex-1 flex overflow-hidden">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-full p-4 font-mono text-xs leading-relaxed text-[#e2e8f0] bg-[#0d0f14] resize-none focus:outline-none selection:bg-cyan-500/30"
              spellCheck={false}
            />
          </div>
        ) : (
          <div className="flex-1 overflow-auto p-4 font-mono text-xs leading-relaxed text-[#d1d5db]">
            <table className="w-full border-collapse">
              <tbody>
                {lines.map((line, idx) => (
                  <tr key={idx} className="hover:bg-[#121620]/60">
                    <td className="w-12 text-right pr-4 text-[#4b5262] select-none text-[11px] align-top">
                      {idx + 1}
                    </td>
                    <td className="whitespace-pre overflow-x-visible text-[#e2e8f0]">
                      {line || '\n'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
