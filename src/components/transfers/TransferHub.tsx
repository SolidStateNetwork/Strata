import React from "react";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { formatBytes, useStrataStore } from "../../stores/useStrataStore";

export const TransferHub: React.FC = () => {
  const {
    transfers,
    bandwidthHistory,
    transferHubExpanded,
    setTransferHubExpanded,
  } = useStrataStore();

  const activeTransfers = transfers.filter((t) => t.status === "active");
  const totalSpeed = activeTransfers.reduce(
    (sum, t) => sum + t.speedBytesPerSec,
    0,
  );

  return (
    <div className="border-t border-strata-border bg-strata-surface shrink-0">
      {/* Summary Bar */}
      <button
        onClick={() => setTransferHubExpanded(!transferHubExpanded)}
        className="w-full h-11 px-5 flex items-center justify-between hover:bg-strata-card/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-200">
            <Activity className="w-3.5 h-3.5 text-indigo-400" />
            Live Transfer & Activity Hub
          </span>
          <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300">
            {activeTransfers.length} active
          </span>
          <span className="text-xs font-mono text-emerald-400">
            {formatBytes(totalSpeed)}/s
          </span>
        </div>

        {/* Mini Sparkline Bars */}
        <div className="flex items-center gap-4">
          <div className="flex items-end gap-1 h-5">
            {bandwidthHistory.map((val, idx) => (
              <div
                key={idx}
                className="w-1.5 rounded-t bg-indigo-500/70"
                style={{ height: `${Math.max(20, Math.min(100, val))}%` }}
              />
            ))}
          </div>
          {transferHubExpanded ? (
            <ChevronDown className="w-4 h-4 text-slate-400" />
          ) : (
            <ChevronUp className="w-4 h-4 text-slate-400" />
          )}
        </div>
      </button>

      {/* Expanded Drawer */}
      {transferHubExpanded && (
        <div className="px-5 pb-4 pt-1 max-h-48 overflow-y-auto space-y-2 border-t border-strata-border/60">
          {transfers.map((item) => (
            <div
              key={item.id}
              className="p-2.5 rounded-xl bg-strata-card border border-strata-border flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-2.5 min-w-0">
                {item.status === "completed" ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : item.direction === "upload" ? (
                  <ArrowUp className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-sky-400 shrink-0" />
                )}
                <div className="min-w-0">
                  <div className="text-xs font-medium text-slate-200 truncate">
                    {item.fileName}
                  </div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {formatBytes(item.sizeBytes)} •{" "}
                    {item.status === "completed"
                      ? "Completed"
                      : `${formatBytes(item.speedBytesPerSec)}/s`}
                  </div>
                </div>
              </div>

              <div className="w-44 shrink-0">
                <div className="flex justify-between text-[10px] font-mono text-slate-400 mb-1">
                  <span className="uppercase">{item.direction}</span>
                  <span>{item.progressPercent}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.status === "completed"
                        ? "bg-emerald-400"
                        : "bg-indigo-500"
                    }`}
                    style={{ width: `${item.progressPercent}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
