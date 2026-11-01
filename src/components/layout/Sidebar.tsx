import React from "react";
import {
  Cloud,
  Database,
  HardDrive,
  Lock,
  Plus,
  Server,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { CloudProvider } from "../../lib/ipc";
import { formatBytes, useStrataStore } from "../../stores/useStrataStore";

function ProviderIcon({ provider }: { provider: CloudProvider }) {
  switch (provider) {
    case "gdrive":
      return <Cloud className="w-4 h-4 text-sky-400" />;
    case "s3":
      return <Database className="w-4 h-4 text-amber-400" />;
    case "protondrive":
      return <ShieldCheck className="w-4 h-4 text-purple-400" />;
    case "nextcloud":
      return <Server className="w-4 h-4 text-cyan-400" />;
    default:
      return <HardDrive className="w-4 h-4 text-indigo-400" />;
  }
}

export const Sidebar: React.FC = () => {
  const {
    remotes,
    selectedRemoteId,
    selectRemote,
    setOnboardingOpen,
    capabilities,
  } = useStrataStore();

  return (
    <aside className="w-72 shrink-0 bg-strata-surface border-r border-strata-border flex flex-col justify-between select-none">
      {/* Top Brand Header */}
      <div>
        <div className="h-14 px-4 flex items-center justify-between border-b border-strata-border">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold tracking-tight text-slate-100 text-sm">
                  Strata
                </span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
                  v0.1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Multi-Cloud VFS & Sync
              </p>
            </div>
          </div>
        </div>

        {/* Remotes Section */}
        <div className="p-3">
          <div className="flex items-center justify-between px-2 mb-2">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Connected Clouds ({remotes.length})
            </span>
            <button
              onClick={() => setOnboardingOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-400 hover:text-indigo-300 transition-colors"
              title="Connect new Cloud Remote"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add</span>
            </button>
          </div>

          <div className="space-y-1.5">
            {remotes.map((remote) => {
              const isSelected = remote.id === selectedRemoteId;
              const usagePercent = Math.min(
                100,
                Math.round((remote.usedBytes / remote.totalBytes) * 100),
              );

              return (
                <button
                  key={remote.id}
                  onClick={() => selectRemote(remote.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                    isSelected
                      ? "bg-strata-card border-indigo-500/50 shadow-sm"
                      : "bg-transparent border-transparent hover:bg-strata-card/60 hover:border-strata-border"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2 min-w-0">
                      <ProviderIcon provider={remote.provider} />
                      <span className="text-xs font-medium text-slate-100 truncate">
                        {remote.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      {remote.zeroKnowledgeEncrypted && (
                        <span
                          title="rclone crypt Zero-Knowledge Vault active"
                          className="p-0.5 rounded bg-emerald-500/15 text-emerald-400"
                        >
                          <Lock className="w-3 h-3" />
                        </span>
                      )}
                      <span
                        className={`w-2 h-2 rounded-full ${
                          remote.status === "syncing"
                            ? "bg-amber-400 animate-pulse"
                            : remote.status === "mounted"
                              ? "bg-emerald-400"
                              : "bg-sky-400"
                        }`}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1.5">
                    <span className="truncate">{remote.accountLabel}</span>
                    <span className="uppercase font-mono text-[10px] px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                      {remote.mode}
                    </span>
                  </div>

                  {/* Storage Bar */}
                  <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-1">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-sky-400 rounded-full"
                      style={{ width: `${usagePercent}%` }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
                    <span>
                      {formatBytes(remote.usedBytes)} /{" "}
                      {formatBytes(remote.totalBytes)}
                    </span>
                    <span>{usagePercent}%</span>
                  </div>
                </button>
              );
            })}
          </div>

          <button
            onClick={() => setOnboardingOpen(true)}
            className="mt-3 w-full py-2 px-3 rounded-xl border border-dashed border-strata-border hover:border-indigo-500/50 hover:bg-indigo-500/5 text-xs font-medium text-slate-300 flex items-center justify-center gap-2 transition-all"
          >
            <Plus className="w-4 h-4 text-indigo-400" />
            <span>Connect Cloud Provider</span>
          </button>
        </div>
      </div>

      {/* Bottom Engine & Security Telemetry Pill */}
      <div className="p-3 border-t border-strata-border bg-strata-bg/40 space-y-2 text-[11px]">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Engine Bridge</span>
          <span className="font-mono text-[10px] text-emerald-400 flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            rclone rcd RPC
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Mount Driver</span>
          <span className="font-mono text-[10px] text-slate-200 truncate max-w-[140px]">
            {capabilities?.mountDriverName ?? "FUSE3 / WinFsp"}
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">Config Vault</span>
          <span className="font-mono text-[10px] text-indigo-300 truncate max-w-[140px]">
            OS Keyring AES-256
          </span>
        </div>
      </div>
    </aside>
  );
};
