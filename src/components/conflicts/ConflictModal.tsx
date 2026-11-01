import React from "react";
import { AlertTriangle, Check, Copy, X } from "lucide-react";
import { formatBytes, useStrataStore } from "../../stores/useStrataStore";

export const ConflictModal: React.FC = () => {
  const {
    conflicts,
    conflictModalOpen,
    setConflictModalOpen,
    resolveConflict,
  } = useStrataStore();

  if (!conflictModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-strata-surface border border-strata-border shadow-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-strata-border flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="text-sm font-semibold text-slate-100">
                Side-by-Side Conflict Resolution
              </h3>
              <p className="text-xs text-slate-400">
                Strata never overwrites concurrent edits silently. Choose which
                revision to keep.
              </p>
            </div>
          </div>
          <button
            onClick={() => setConflictModalOpen(false)}
            className="p-1 rounded-lg hover:bg-strata-card text-slate-400"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {conflicts.length === 0 ? (
            <p className="text-xs text-slate-400 text-center py-6">
              All synchronization conflicts have been resolved.
            </p>
          ) : (
            conflicts.map((conf) => (
              <div
                key={conf.id}
                className="p-4 rounded-xl bg-strata-card border border-strata-border space-y-3"
              >
                <div className="font-mono text-xs text-amber-300">
                  {conf.relativePath}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg bg-strata-surface border border-strata-border">
                    <div className="text-xs font-semibold text-slate-200 mb-1">
                      Local Workstation Version
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Modified: {conf.localModifiedIso}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Size: {formatBytes(conf.localSizeBytes)}
                    </div>
                    <button
                      onClick={() => resolveConflict(conf.id, "keep_local")}
                      className="mt-3 w-full py-1.5 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-indigo-200 text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Keep Local Version
                    </button>
                  </div>

                  <div className="p-3 rounded-lg bg-strata-surface border border-strata-border">
                    <div className="text-xs font-semibold text-slate-200 mb-1">
                      Cloud Remote Version
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Modified: {conf.remoteModifiedIso}
                    </div>
                    <div className="text-[11px] font-mono text-slate-400">
                      Size: {formatBytes(conf.remoteSizeBytes)}
                    </div>
                    <button
                      onClick={() => resolveConflict(conf.id, "keep_remote")}
                      className="mt-3 w-full py-1.5 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-200 text-xs font-medium flex items-center justify-center gap-1.5"
                    >
                      <Check className="w-3.5 h-3.5" />
                      Keep Cloud Version
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => resolveConflict(conf.id, "keep_both")}
                  className="w-full py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium flex items-center justify-center gap-1.5"
                >
                  <Copy className="w-3.5 h-3.5" />
                  Keep Both (Rename Local with .conflict-copy)
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
