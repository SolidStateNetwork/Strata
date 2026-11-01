import React from "react";
import { Cloud, HardDriveDownload, Pin } from "lucide-react";
import { StorageMode } from "../../lib/ipc";
import { useStrataStore } from "../../stores/useStrataStore";

const MODES: {
  id: StorageMode;
  title: string;
  subtitle: string;
  badge: string;
  icon: React.ReactNode;
}[] = [
  {
    id: "stream",
    title: "Stream Mount",
    subtitle: "Virtual Drive (FUSE3 / WinFsp Z:) — 0 GB permanent disk use",
    badge: "0 GB Local",
    icon: <Cloud className="w-4 h-4" />,
  },
  {
    id: "hybrid",
    title: "Hybrid Smart Pinning",
    subtitle: "Virtual mount for everything + pin specific folders offline",
    badge: "Best of Both",
    icon: <Pin className="w-4 h-4" />,
  },
  {
    id: "mirror",
    title: "Full Offline Mirror",
    subtitle: "100% physical local folder mirror with real-time notify watcher",
    badge: "100% Offline",
    icon: <HardDriveDownload className="w-4 h-4" />,
  },
];

export const ModeSwitcher: React.FC = () => {
  const { remotes, selectedRemoteId, setRemoteMode } = useStrataStore();
  const activeRemote =
    remotes.find((r) => r.id === selectedRemoteId) ?? remotes[0];

  return (
    <div className="px-5 pt-4 pb-2 shrink-0">
      <div className="grid grid-cols-3 gap-2.5 p-1.5 rounded-2xl bg-strata-surface border border-strata-border">
        {MODES.map((m) => {
          const isActive = activeRemote.mode === m.id;
          return (
            <button
              key={m.id}
              onClick={() => setRemoteMode(activeRemote.id, m.id)}
              className={`text-left p-3 rounded-xl border transition-all ${
                isActive
                  ? "bg-strata-card border-indigo-500/60 shadow-md shadow-indigo-950/40"
                  : "border-transparent hover:bg-strata-card/40 text-slate-400"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span
                    className={`p-1.5 rounded-lg ${
                      isActive
                        ? "bg-indigo-500/20 text-indigo-300"
                        : "bg-slate-800/80 text-slate-400"
                    }`}
                  >
                    {m.icon}
                  </span>
                  <span
                    className={`text-xs font-semibold ${
                      isActive ? "text-slate-100" : "text-slate-300"
                    }`}
                  >
                    {m.title}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                    isActive
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/30"
                      : "bg-slate-800 text-slate-400"
                  }`}
                >
                  {m.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-400 leading-snug line-clamp-1">
                {m.subtitle}
              </p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
