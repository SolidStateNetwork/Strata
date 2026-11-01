import React, { useState } from "react";
import { Cloud, Lock, PlusCircle, X } from "lucide-react";
import { CloudProvider, StorageMode } from "../../lib/ipc";
import { useStrataStore } from "../../stores/useStrataStore";

export const OnboardingModal: React.FC = () => {
  const { onboardingOpen, setOnboardingOpen, addRemote } = useStrataStore();
  const [name, setName] = useState("Nextcloud Enterprise");
  const [provider, setProvider] = useState<CloudProvider>("nextcloud");
  const [accountLabel, setAccountLabel] = useState("cloud.example.org");
  const [mode, setMode] = useState<StorageMode>("hybrid");
  const [zeroKnowledgeEncrypted, setZeroKnowledgeEncrypted] = useState(true);

  if (!onboardingOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addRemote({
      name: name.trim(),
      provider,
      accountLabel: accountLabel.trim() || "connected-account",
      mode,
      zeroKnowledgeEncrypted,
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl bg-strata-surface border border-strata-border shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-strata-border flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cloud className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Connect Cloud Provider (70+ rclone Backends)
              </h3>
              <p className="text-xs text-slate-400">
                Credentials are encrypted automatically via your OS Keyring.
              </p>
            </div>
          </div>
          <button
            onClick={() => setOnboardingOpen(false)}
            className="p-1 rounded-lg hover:bg-strata-card text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Provider Family
              </label>
              <select
                value={provider}
                onChange={(e) => setProvider(e.target.value as CloudProvider)}
                className="w-full bg-strata-card border border-strata-border rounded-lg px-3 py-2 text-xs text-slate-100"
              >
                <option value="gdrive">Google Drive (OAuth2)</option>
                <option value="onedrive">Microsoft OneDrive</option>
                <option value="dropbox">Dropbox</option>
                <option value="protondrive">Proton Drive</option>
                <option value="nextcloud">Nextcloud / WebDAV</option>
                <option value="s3">AWS S3 / Hetzner / Backblaze B2</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Initial Storage Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as StorageMode)}
                className="w-full bg-strata-card border border-strata-border rounded-lg px-3 py-2 text-xs text-slate-100"
              >
                <option value="stream">☁️ Stream Mount (0 GB Local)</option>
                <option value="hybrid">📌 Hybrid Smart Pinning</option>
                <option value="mirror">💾 Full Offline Mirror</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-strata-card border border-strata-border rounded-lg px-3 py-2 text-xs text-slate-100"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Account / Endpoint Label
              </label>
              <input
                type="text"
                value={accountLabel}
                onChange={(e) => setAccountLabel(e.target.value)}
                className="w-full bg-strata-card border border-strata-border rounded-lg px-3 py-2 text-xs text-slate-100"
              />
            </div>
          </div>

          <label className="flex items-start gap-2.5 p-3 rounded-xl bg-strata-card border border-strata-border cursor-pointer">
            <input
              type="checkbox"
              checked={zeroKnowledgeEncrypted}
              onChange={(e) => setZeroKnowledgeEncrypted(e.target.checked)}
              className="mt-0.5 w-4 h-4 rounded border-slate-600 bg-slate-800 text-emerald-500"
            />
            <div>
              <span className="text-xs font-semibold text-emerald-300 flex items-center gap-1.5">
                <Lock className="w-3.5 h-3.5" />
                Enable 1-Click Zero-Knowledge Vault (rclone crypt)
              </span>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Wraps this remote in an end-to-end encrypted layer before any
                file leaves your machine.
              </p>
            </div>
          </label>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setOnboardingOpen(false)}
              className="px-4 py-2 rounded-xl bg-slate-800 text-xs text-slate-300 hover:bg-slate-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-semibold text-white inline-flex items-center gap-1.5"
            >
              <PlusCircle className="w-4 h-4" />
              Authorize & Connect Remote
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
