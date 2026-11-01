import React, { useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Cloud,
  Folder,
  Lock,
  Pin,
  RefreshCw,
} from "lucide-react";
import { FolderNode, StorageMode } from "../../lib/ipc";
import { formatBytes, useStrataStore } from "../../stores/useStrataStore";

interface TreeRowProps {
  node: FolderNode;
  depth: number;
  remoteId: string;
  mode: StorageMode;
  selectedFolderId: string | null;
  onSelect: (id: string) => void;
  onToggleSync: (remoteId: string, folderId: string) => void;
  onTogglePin: (remoteId: string, folderId: string) => void;
}

const TreeRow: React.FC<TreeRowProps> = ({
  node,
  depth,
  remoteId,
  mode,
  selectedFolderId,
  onSelect,
  onToggleSync,
  onTogglePin,
}) => {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = Boolean(node.children && node.children.length > 0);
  const isSelected = selectedFolderId === node.id;

  return (
    <>
      <div
        onClick={() => onSelect(node.id)}
        className={`group flex items-center justify-between py-2 px-3 rounded-xl border transition-all cursor-pointer ${
          isSelected
            ? "bg-indigo-500/10 border-indigo-500/40"
            : "border-transparent hover:bg-strata-card/70"
        }`}
        style={{ paddingLeft: `${depth * 20 + 12}px` }}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          {hasChildren ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
              className="p-0.5 rounded hover:bg-slate-800 text-slate-400"
            >
              {expanded ? (
                <ChevronDown className="w-3.5 h-3.5" />
              ) : (
                <ChevronRight className="w-3.5 h-3.5" />
              )}
            </button>
          ) : (
            <span className="w-4" />
          )}

          {/* Selective Sync Checkbox */}
          <input
            type="checkbox"
            checked={node.selectedForSync}
            onChange={(e) => {
              e.stopPropagation();
              onToggleSync(remoteId, node.id);
            }}
            className="w-3.5 h-3.5 rounded border-slate-600 bg-slate-800 text-indigo-500 focus:ring-indigo-500/40"
            title="Include folder in Selective Sync / Mount visibility"
          />

          <Folder className="w-4 h-4 text-indigo-400 shrink-0" />

          <span className="text-xs font-medium text-slate-100 truncate">
            {node.name}
          </span>

          {node.encrypted && (
            <span
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 text-[10px] font-mono"
              title="Encrypted with rclone crypt"
            >
              <Lock className="w-2.5 h-2.5" />
              crypt
            </span>
          )}
        </div>

        {/* Right Controls: Hybrid Pin Toggle, Sync Badge & Size */}
        <div className="flex items-center gap-3 shrink-0">
          {mode === "hybrid" && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onTogglePin(remoteId, node.id);
              }}
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium border transition-colors ${
                node.pinnedOffline
                  ? "bg-indigo-500/20 text-indigo-200 border-indigo-500/40"
                  : "bg-slate-800/70 text-slate-400 border-slate-700/70 hover:text-slate-200"
              }`}
              title="Toggle Hybrid Smart Pinning (Keep 100% Offline on Local Disk)"
            >
              <Pin className="w-3 h-3" />
              <span>{node.pinnedOffline ? "Pinned Offline" : "Stream Only"}</span>
            </button>
          )}

          {/* Status Pill */}
          {node.syncState === "synced" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Local Mirror</span>
            </span>
          )}
          {node.syncState === "streaming" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-sky-400">
              <Cloud className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">On-Demand Stream</span>
            </span>
          )}
          {node.syncState === "syncing" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-amber-400">
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span className="hidden sm:inline">Syncing...</span>
            </span>
          )}
          {node.syncState === "conflict" && (
            <span className="inline-flex items-center gap-1 text-[11px] text-rose-400 font-medium">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Conflict</span>
            </span>
          )}

          <span className="w-16 text-right font-mono text-[11px] text-slate-400">
            {formatBytes(node.sizeBytes)}
          </span>
        </div>
      </div>

      {hasChildren &&
        expanded &&
        node.children!.map((child) => (
          <TreeRow
            key={child.id}
            node={child}
            depth={depth + 1}
            remoteId={remoteId}
            mode={mode}
            selectedFolderId={selectedFolderId}
            onSelect={onSelect}
            onToggleSync={onToggleSync}
            onTogglePin={onTogglePin}
          />
        ))}
    </>
  );
};

export const FolderTree: React.FC = () => {
  const {
    remotes,
    selectedRemoteId,
    selectedFolderId,
    selectFolder,
    toggleFolderSync,
    toggleFolderPin,
    searchQuery,
  } = useStrataStore();

  const activeRemote =
    remotes.find((r) => r.id === selectedRemoteId) ?? remotes[0];

  const filteredFolders = activeRemote.rootFolders.filter((f) =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const pinnedBytes = activeRemote.rootFolders.reduce(
    (acc, f) => acc + (f.pinnedOffline ? f.sizeBytes : 0),
    0,
  );

  return (
    <div className="flex-1 px-5 py-2 overflow-y-auto">
      <div className="bg-strata-surface border border-strata-border rounded-2xl p-3">
        <div className="flex items-center justify-between px-3 py-2 border-b border-strata-border text-[11px] text-slate-400">
          <div className="flex items-center gap-2">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Selective Folder Tree
            </span>
            <span>•</span>
            <span>
              Local Disk Footprint:{" "}
              <strong className="text-slate-100 font-mono">
                {activeRemote.mode === "stream"
                  ? `${activeRemote.vfsCacheUsedGb.toFixed(1)} GB (VFS Cache)`
                  : formatBytes(pinnedBytes)}
              </strong>
            </span>
          </div>
          <span className="font-mono text-[10px] text-slate-400">
            Real-Time Watcher: notify (1.5s debounce)
          </span>
        </div>

        <div className="mt-2 space-y-1">
          {filteredFolders.map((folder) => (
            <TreeRow
              key={folder.id}
              node={folder}
              depth={0}
              remoteId={activeRemote.id}
              mode={activeRemote.mode}
              selectedFolderId={selectedFolderId}
              onSelect={selectFolder}
              onToggleSync={toggleFolderSync}
              onTogglePin={toggleFolderPin}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
