import React from "react";
import {
  ArrowDownToLine,
  ArrowLeftRight,
  ArrowUpFromLine,
  Cpu,
  Filter,
  HardDrive,
  Lock,
  ShieldAlert,
  Trash2,
} from "lucide-react";
import { MirrorDirection, VfsCacheMode } from "../../lib/ipc";
import { useStrataStore } from "../../stores/useStrataStore";

const MIRROR_DIRECTIONS: {
  id: MirrorDirection;
  label: string;
  desc: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "bidirectional",
    label: "Bi-Directional (Local ↔ Cloud)",
    desc: "Real-time 2-way sync via notify watcher + rclone bisync",
    icon: <ArrowLeftRight className="w-3.5 h-3.5 text-indigo-400" />,
  },
  {
    id: "upload_backup",
    label: "Backup Mirror (Local → Cloud)",
    desc: "Local disk is source of truth; mirrors changes to cloud",
    icon: <ArrowUpFromLine className="w-3.5 h-3.5 text-emerald-400" />,
  },
  {
    id: "download_mirror",
    label: "Download Mirror (Cloud → Local)",
    desc: "Cloud is source of truth; keeps local backup disk updated",
    icon: <ArrowDownToLine className="w-3.5 h-3.5 text-sky-400" />,
  },
];

const VFS_MODES: { id: VfsCacheMode; label: string; desc: string }[] = [
  {
    id: "full",
    label: "Smart Balanced (full)",
    desc: "Sparse file read/write cache with max-size quota",
  },
  {
    id: "writes",
    label: "Ultra Lightweight (writes)",
    desc: "Only buffers modified files during upload; streams reads",
  },
  {
    id: "minimal",
    label: "Zero-Disk Stream (minimal)",
    desc: "Direct streaming without local disk read caching",
  },
];

export const InspectorDrawer: React.FC = () => {
  const {
    remotes,
    selectedRemoteId,
    setMirrorDirection,
    setSoftDeleteArchive,
    setVfsCacheMode,
    setVfsCacheLimitGb,
    toggleZeroKnowledge,
    purgeVfsCache,
  } = useStrataStore();

  const activeRemote =
    remotes.find((r) => r.id === selectedRemoteId) ?? remotes[0];

  const cachePercent = Math.min(
    100,
    Math.round(
      (activeRemote.vfsCacheUsedGb / activeRemote.vfsCacheLimitGb) * 100,
    ),
  );

  return (
    <aside className="w-80 shrink-0 bg-strata-surface border-l border-strata-border p-4 overflow-y-auto space-y-5">
      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
          Policy & Engine Inspector
        </h2>
        <p className="text-[11px] text-slate-500">
          Configure sync direction, VFS cache & encryption for{" "}
          <span className="text-slate-300 font-medium">
            {activeRemote.name}
          </span>
        </p>
      </div>

      {/* 1. Mirror Direction Selector */}
      <div className="p-3 rounded-xl bg-strata-card border border-strata-border space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200">
            Mirror Direction
          </span>
          <span className="text-[10px] font-mono text-indigo-300 bg-indigo-500/15 px-1.5 py-0.5 rounded">
            {activeRemote.mode === "stream" ? "When Pinned" : "Active"}
          </span>
        </div>

        <div className="space-y-1.5">
          {MIRROR_DIRECTIONS.map((dir) => {
            const active = activeRemote.mirrorDirection === dir.id;
            return (
              <button
                key={dir.id}
                onClick={() => setMirrorDirection(activeRemote.id, dir.id)}
                className={`w-full text-left p-2 rounded-lg border transition-all ${
                  active
                    ? "bg-indigo-500/15 border-indigo-500/50"
                    : "bg-strata-surface/60 border-transparent hover:border-strata-border"
                }`}
              >
                <div className="flex items-center gap-2 text-xs font-medium text-slate-100">
                  {dir.icon}
                  <span>{dir.label}</span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5 pl-5">
                  {dir.desc}
                </p>
              </button>
            );
          })}
        </div>

        {/* Soft Delete / Ransomware Archive Guard */}
        <label className="flex items-start gap-2.5 pt-2 border-t border-strata-border cursor-pointer">
          <input
            type="checkbox"
            checked={activeRemote.softDeleteArchive}
            onChange={(e) =>
              setSoftDeleteArchive(activeRemote.id, e.target.checked)
            }
            className="mt-0.5 w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-indigo-500"
          />
          <div>
            <span className="text-xs font-medium text-slate-200 flex items-center gap-1">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              Soft-Delete Archive Guard
            </span>
            <p className="text-[10px] text-slate-400">
              Move deleted files to <code className="text-slate-300">.strata-archive/</code> instead of permanent deletion.
            </p>
          </div>
        </label>
      </div>

      {/* 2. VFS Cache Controller */}
      <div className="p-3 rounded-xl bg-strata-card border border-strata-border space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            VFS Cache Engine
          </span>
          <span className="font-mono text-[10px] text-slate-400">
            {activeRemote.vfsCacheUsedGb.toFixed(1)} /{" "}
            {activeRemote.vfsCacheLimitGb} GB
          </span>
        </div>

        <div className="space-y-1">
          {VFS_MODES.map((vm) => (
            <button
              key={vm.id}
              onClick={() => setVfsCacheMode(activeRemote.id, vm.id)}
              className={`w-full text-left px-2.5 py-1.5 rounded-lg border text-xs transition-all ${
                activeRemote.vfsCacheMode === vm.id
                  ? "bg-sky-500/15 border-sky-500/40 text-sky-200"
                  : "border-transparent text-slate-400 hover:bg-strata-surface"
              }`}
            >
              <div className="font-medium">{vm.label}</div>
              <div className="text-[10px] text-slate-400">{vm.desc}</div>
            </button>
          ))}
        </div>

        <div>
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span>Max VFS Disk Quota</span>
            <span className="font-mono text-slate-200">
              {activeRemote.vfsCacheLimitGb} GB
            </span>
          </div>
          <input
            type="range"
            min={5}
            max={100}
            step={5}
            value={activeRemote.vfsCacheLimitGb}
            onChange={(e) =>
              setVfsCacheLimitGb(activeRemote.id, Number(e.target.value))
            }
            className="w-full accent-indigo-500 cursor-pointer"
          />
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mt-1.5">
            <div
              className="h-full bg-sky-400 rounded-full transition-all"
              style={{ width: `${cachePercent}%` }}
            />
          </div>
        </div>

        <button
          onClick={() => purgeVfsCache(activeRemote.id)}
          className="w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5 text-slate-400" />
          <span>Purge Local VFS Cache ({activeRemote.vfsCacheUsedGb.toFixed(1)} GB)</span>
        </button>
      </div>

      {/* 3. 1-Click Zero-Knowledge Vault (rclone crypt) */}
      <div className="p-3 rounded-xl bg-strata-card border border-strata-border space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5 text-emerald-400" />
            <span className="text-xs font-semibold text-slate-200">
              Zero-Knowledge Vault
            </span>
          </div>
          <button
            onClick={() => toggleZeroKnowledge(activeRemote.id)}
            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wide transition-colors ${
              activeRemote.zeroKnowledgeEncrypted
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                : "bg-slate-800 text-slate-400"
            }`}
          >
            {activeRemote.zeroKnowledgeEncrypted ? "Active" : "Disabled"}
          </button>
        </div>
        <p className="text-[11px] text-slate-400 leading-relaxed">
          Client-side <code className="text-slate-300">rclone crypt</code>{" "}
          (XSalsa20 + Poly1305 + EME filename encryption). Keys are sealed in
          your native OS Keyring.
        </p>
      </div>

      {/* 4. Ignore Filter Rules (.strataignore) */}
      <div className="p-3 rounded-xl bg-strata-card border border-strata-border space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-200 flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-indigo-400" />
            .strataignore Rules
          </span>
          <HardDrive className="w-3.5 h-3.5 text-slate-500" />
        </div>
        <div className="flex flex-wrap gap-1">
          {activeRemote.ignorePatterns.map((pat) => (
            <span
              key={pat}
              className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px]"
            >
              {pat}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
};
