import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Rocket, 
  Check, 
  Copy, 
  ExternalLink, 
  Trash2, 
  X, 
  ShieldCheck, 
  Sparkles, 
  AlertTriangle,
  QrCode,
  Share2,
  RefreshCw,
  Eye,
  CheckCircle2
} from 'lucide-react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { AppProject, AppDeployment } from '../types';

interface AutoDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: AppProject;
  onUpdateDeployment: (deployment?: AppDeployment) => void;
}

export const AutoDeployModal: React.FC<AutoDeployModalProps> = ({
  isOpen,
  onClose,
  project,
  onUpdateDeployment,
}) => {
  const [isDeploying, setIsDeploying] = useState(false);
  const [deployStep, setDeployStep] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [copied, setCopied] = useState(false);
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [showQr, setShowQr] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);

  const deployment = project.deployment;
  const isPublished = deployment && deployment.status === 'published';

  // Generate QR code when published
  useEffect(() => {
    if (isPublished && deployment?.publicUrl) {
      QRCode.toDataURL(deployment.publicUrl, {
        width: 240,
        margin: 2,
        color: {
          dark: '#0284c7',
          light: '#0b0f19',
        },
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.warn('QR code generation warning:', err));
    }
  }, [isPublished, deployment?.publicUrl]);

  if (!isOpen) return null;

  const handleDeploy = async () => {
    setIsDeploying(true);
    setDeployStep(1);
    setErrorMessage(null);
    setSuccessNotice(null);

    // Visual deployment pipeline
    const timer1 = setTimeout(() => setDeployStep(2), 500);
    const timer2 = setTimeout(() => setDeployStep(3), 1100);

    try {
      const response = await fetch('/api/deployments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          projectId: project.id,
          name: project.name,
          html: project.previewHtml,
          prompt: project.prompt,
          summary: project.summary,
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to deploy: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.deployment) {
        // Construct full URL with current origin if needed
        const fullUrl = data.deployment.publicUrl.startsWith('http')
          ? data.deployment.publicUrl
          : `${window.location.origin}${data.deployment.publicUrl}`;

        const deployedRecord: AppDeployment = {
          ...data.deployment,
          publicUrl: fullUrl,
        };

        onUpdateDeployment(deployedRecord);
        setSuccessNotice('Your app is now live on the internet! Zero setup was required.');

        try {
          confetti({
            particleCount: 50,
            spread: 70,
            origin: { y: 0.6 }
          });
        } catch(e){}
      }
    } catch (err: any) {
      setErrorMessage(err?.message || 'Deployment encountered an error. Please try again.');
    } finally {
      clearTimeout(timer1);
      clearTimeout(timer2);
      setIsDeploying(false);
      setDeployStep(0);
    }
  };

  const handleDelete = async () => {
    if (!deployment) return;
    setIsDeleting(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const response = await fetch(`/api/deployments/${deployment.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete app from internet');
      }

      onUpdateDeployment(undefined);
      setShowDeleteConfirm(false);
      setSuccessNotice('App has been permanently deleted from the internet. The live URL is now inactive.');
    } catch (err: any) {
      setErrorMessage(err?.message || 'Failed to delete app from internet');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCopy = () => {
    if (!deployment?.publicUrl) return;
    navigator.clipboard.writeText(deployment.publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl bg-[#11141c] border border-[#23293a] rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#1f2433] bg-[#0c0e15] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 text-cyan-400 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                Auto-Deploy to Internet
                <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/40">
                  Zero Setup
                </span>
              </h2>
              <p className="text-[11px] text-[#7d8495]">1-Click instant publishing with free public hosting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7c8394] hover:text-white hover:bg-[#1a1f2c] transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5 overflow-y-auto max-h-[80vh]">
          {/* Notifications */}
          {errorMessage && (
            <div className="p-3.5 rounded-xl bg-rose-950/50 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />
              <span>{successNotice}</span>
            </div>
          )}

          {/* Current App Summary */}
          <div className="p-3.5 rounded-xl bg-[#0b0d13] border border-[#1d2230] flex items-center justify-between">
            <div className="flex items-center gap-3 truncate">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-blue-600/30 to-cyan-500/20 border border-cyan-500/30 text-cyan-300 font-bold text-xs flex items-center justify-center shrink-0">
                CX
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-white truncate">{project.name}</div>
                <div className="text-[10px] text-[#717788] truncate">{project.summary}</div>
              </div>
            </div>

            <div className="shrink-0">
              {isPublished ? (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  Live on Internet
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#181c26] text-[#868d9e] border border-[#282f42]">
                  <span className="w-2 h-2 rounded-full bg-[#525968]"></span>
                  Not Published
                </span>
              )}
            </div>
          </div>

          {/* If Published: Show Live URL, QR Code, and Delete Button */}
          {isPublished && deployment ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-gradient-to-b from-[#131722] to-[#0e111a] border border-cyan-500/30 shadow-lg space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-cyan-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Public Live Link
                  </span>
                  <span className="text-[10px] text-[#788094] flex items-center gap-1">
                    <Eye className="w-3 h-3 text-cyan-400" />
                    {deployment.views} {deployment.views === 1 ? 'visit' : 'visits'}
                  </span>
                </div>

                {/* Shareable Link Input */}
                <div className="flex items-center gap-2">
                  <div className="flex-1 flex items-center px-3 py-2 rounded-lg bg-[#080a0f] border border-[#222838] font-mono text-xs text-white truncate select-all">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 mr-2 shrink-0" />
                    <span className="truncate">{deployment.publicUrl}</span>
                  </div>

                  <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#1c2232] hover:bg-[#252c40] text-xs font-semibold text-white border border-[#2d354a] transition shrink-0"
                    title="Copy Link to Clipboard"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5 text-cyan-400" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  <a
                    href={deployment.publicUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-xs font-bold text-black transition shrink-0 shadow-md shadow-cyan-500/20"
                    title="Open Live App in New Tab"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open</span>
                  </a>
                </div>

                {/* Toggle QR Code */}
                <div className="pt-2 flex items-center justify-between border-t border-[#1a1f2c]">
                  <button
                    type="button"
                    onClick={() => setShowQr(!showQr)}
                    className="text-xs text-cyan-400 hover:text-cyan-300 font-medium flex items-center gap-1.5 transition"
                  >
                    <QrCode className="w-3.5 h-3.5" />
                    <span>{showQr ? 'Hide Mobile QR Code' : 'Scan on Mobile (QR Code)'}</span>
                  </button>
                  <span className="text-[10px] text-[#697082]">
                    Deployed: {new Date(deployment.deployedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* QR Code Preview */}
                {showQr && qrDataUrl && (
                  <div className="p-4 rounded-xl bg-[#090b10] border border-[#1f2434] flex flex-col items-center justify-center text-center animate-in fade-in duration-200">
                    <img src={qrDataUrl} alt="App QR Code" className="w-36 h-36 rounded-lg shadow-md border border-[#2b3348] mb-2" />
                    <p className="text-[11px] text-[#8e95a8]">Point your phone camera to open and use this app instantly.</p>
                  </div>
                )}
              </div>

              {/* Update or Delete from Internet Section */}
              <div className="p-4 rounded-xl bg-[#0e1118] border border-[#222838] space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-xs font-semibold text-white">Manage Live Deployment</div>
                  <button
                    onClick={handleDeploy}
                    disabled={isDeploying}
                    className="text-xs text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition"
                  >
                    <RefreshCw className={`w-3 h-3 ${isDeploying ? 'animate-spin' : ''}`} />
                    <span>Re-deploy Latest Changes</span>
                  </button>
                </div>

                {/* Delete / Unpublish Box */}
                {!showDeleteConfirm ? (
                  <div className="flex items-center justify-between pt-2 border-t border-[#1a1e2a]">
                    <div className="text-[11px] text-[#7f8698]">
                      Want to take your app offline? Deleting it removes it from the internet immediately.
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowDeleteConfirm(true)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/25 text-xs font-semibold transition shrink-0 ml-3"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete from Internet</span>
                    </button>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800/60 space-y-2.5 animate-in fade-in duration-150">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-xs">
                      <AlertTriangle className="w-4 h-4 text-rose-400" />
                      <span>Permanently Delete App from Internet?</span>
                    </div>
                    <p className="text-[11px] text-rose-200/80 leading-relaxed">
                      Anyone opening your public link will immediately get a 404 deactivated page. You can always re-deploy anytime.
                    </p>
                    <div className="flex items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleDelete}
                        disabled={isDeleting}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition flex items-center justify-center gap-1.5 shadow-sm"
                      >
                        {isDeleting ? (
                          <>
                            <RefreshCw className="w-3 h-3 animate-spin" />
                            <span>Deleting from Internet...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-3.5 h-3.5" />
                            <span>Yes, Delete App from Internet</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowDeleteConfirm(false)}
                        className="py-1.5 px-3 rounded-lg bg-[#181c26] hover:bg-[#202534] text-xs text-[#a0a6b5] border border-[#2d3447] transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Not Published Yet: Big One-Click Auto-Deploy Banner */
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-gradient-to-b from-[#141926] to-[#0c0f17] border border-cyan-500/30 text-center space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-inner">
                  <Rocket className="w-6 h-6 animate-pulse" />
                </div>

                <div>
                  <h3 className="text-base font-bold text-white mb-1">
                    Publish Instantly with 1-Click
                  </h3>
                  <p className="text-xs text-[#8c94a8] max-w-sm mx-auto leading-relaxed">
                    No setup, no server configuration, no accounts, and no credit cards needed. Click below and your app is immediately live on the world wide web.
                  </p>
                </div>

                {/* Features Checklist */}
                <div className="grid grid-cols-2 gap-2 text-left max-w-sm mx-auto text-[11px] text-[#9da5b8]">
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Free global public hosting</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Zero config needed</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>Instant shareable link & QR</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-cyan-400" />
                    <span>1-click delete anytime</span>
                  </div>
                </div>

                {/* Progress Animation during deployment */}
                {isDeploying && (
                  <div className="p-3.5 rounded-xl bg-[#090b10] border border-cyan-500/30 text-xs text-cyan-300 space-y-2">
                    <div className="flex items-center justify-between font-mono text-[11px]">
                      <span>
                        {deployStep === 1 && '📦 Bundling application code...'}
                        {deployStep === 2 && '⚡ Publishing live route...'}
                        {deployStep === 3 && '🚀 Provisioning internet access...'}
                      </span>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin text-cyan-400" />
                    </div>
                    <div className="w-full bg-[#161c28] h-1.5 rounded-full overflow-hidden">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full transition-all duration-300"
                        style={{ width: `${deployStep === 1 ? '35%' : deployStep === 2 ? '75%' : '95%'}` }}
                      ></div>
                    </div>
                  </div>
                )}

                {/* Big Action Button */}
                <button
                  type="button"
                  onClick={handleDeploy}
                  disabled={isDeploying}
                  className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-500 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-sm transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Rocket className="w-4 h-4" />
                  <span>{isDeploying ? 'Deploying to Internet...' : 'Auto-Deploy App to Internet (1-Click)'}</span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-[#1f2433] bg-[#0c0e15] flex items-center justify-between text-xs text-[#717788]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            Protected by ChargoX Edge Network
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg text-white hover:bg-[#1a1f2c] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
