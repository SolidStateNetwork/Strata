import React from "react";
import {
  AlertTriangle,
  FolderSync,
  HardDrive,
  Lock,
  Search,
} from "lucide-react";
import { useStrataStore } from "../../stores/useStrataStore";

export const Header: React.FC = () => {
  const {
    remotes,
    selectedRemoteId,
    conflicts,
    setConflictModalOpen,
    searchQuery,
    setSearchQuery,
  } = useStrataStore();

  const activeRemote =
    remotes.find((r) => r.id === selectedRemoteId) ?? remotes[0];

  return (
    <header className="h-14 px-5 border-b border-strata-border bg-strata-surface/70 backdrop-blur-md flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3 min-w-0">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-sm font-semibold text-slate-100 truncate">
              {activeRemote.name}
            </h1>
            {activeRemote.zeroKnowledgeEncrypted && (
              <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <Lock className="w-2.5 h-2.5" />
                Zero-Knowledge Crypt
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono mt-0.5">
            {activeRemote.mode !== "mirror" && (
              <span className="inline-flex items-center gap-1">
                <HardDrive className="w-3 h-3 text-sky-400" />
                Mount: {activeRemote.mountTarget}
              </span>
            )}
            {activeRemote.mode !== "stream" && (
              <span className="inline-flex items-center gap-1">
                <FolderSync className="w-3 h-3 text-indigo-400" />
                Local: {activeRemote.localMirrorPath}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Right Action Bar: Search & Conflict Alert */}
      <div className="flex items-center gap-3">
        {conflicts.length > 0 && (
          <button
            onClick={() => setConflictModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/40 text-amber-300 text-xs font-medium transition-colors"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {conflicts.length} Sync Conflict{conflicts.length > 1 ? "s" : ""}
            </span>
          </button>
        )}

        <div className="relative">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Filter folders..."
            className="w-48 bg-strata-card border border-strata-border rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/60"
          />
        </div>
      </div>
    </header>
  );
};
