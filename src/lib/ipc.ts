import { invoke } from "@tauri-apps/api/core";

/**
 * Core Storage Modes supported by Strata (ADR-003).
 */
export type StorageMode = "stream" | "hybrid" | "mirror";

/**
 * Mirror Synchronization Directions (architecture/03-sync-and-mirror-modes.md).
 */
export type MirrorDirection =
  | "bidirectional"
  | "upload_backup"
  | "download_mirror";

/**
 * VFS Cache Profiles for Stream & Hybrid Mounts (architecture/02-rclone-engine-and-vfs-architecture.md).
 */
export type VfsCacheMode = "full" | "writes" | "minimal";

/**
 * Supported Cloud Provider Families.
 */
export type CloudProvider =
  | "gdrive"
  | "onedrive"
  | "dropbox"
  | "protondrive"
  | "nextcloud"
  | "s3";

export interface FolderNode {
  id: string;
  name: string;
  path: string;
  sizeBytes: number;
  selectedForSync: boolean;
  pinnedOffline: boolean;
  encrypted: boolean;
  syncState: "synced" | "streaming" | "syncing" | "conflict";
  children?: FolderNode[];
}

export interface CloudRemote {
  id: string;
  name: string;
  provider: CloudProvider;
  accountLabel: string;
  mode: StorageMode;
  mountTarget: string;
  localMirrorPath: string;
  mirrorDirection: MirrorDirection;
  softDeleteArchive: boolean;
  vfsCacheMode: VfsCacheMode;
  vfsCacheLimitGb: number;
  vfsCacheUsedGb: number;
  zeroKnowledgeEncrypted: boolean;
  usedBytes: number;
  totalBytes: number;
  status: "online" | "syncing" | "mounted" | "paused" | "conflict";
  ignorePatterns: string[];
  rootFolders: FolderNode[];
}

export interface TransferItem {
  id: string;
  remoteId: string;
  fileName: string;
  direction: "upload" | "download";
  progressPercent: number;
  speedBytesPerSec: number;
  sizeBytes: number;
  status: "active" | "completed" | "queued";
}

export interface ConflictItem {
  id: string;
  remoteId: string;
  relativePath: string;
  localModifiedIso: string;
  localSizeBytes: number;
  remoteModifiedIso: string;
  remoteSizeBytes: number;
}

export interface SystemCapabilities {
  platform: string;
  rcloneAvailable: boolean;
  rcloneVersion: string;
  mountDriverName: string;
  mountDriverReady: boolean;
  keyringBackend: string;
  rcEndpointType: string;
}

/**
 * Checks whether the frontend is executing inside a Tauri v2 WebView.
 */
export function isTauriRuntime(): boolean {
  return (
    typeof window !== "undefined" &&
    ("__TAURI_INTERNALS__" in window || "__TAURI__" in window)
  );
}

/**
 * Typed IPC wrapper around `get_system_capabilities` in `src-tauri/src/ipc/mod.rs`.
 */
export async function fetchSystemCapabilities(): Promise<SystemCapabilities> {
  if (isTauriRuntime()) {
    try {
      return await invoke<SystemCapabilities>("get_system_capabilities");
    } catch {
      // Fallback below if command fails during early prototype load
    }
  }
  return {
    platform: navigator.platform.toLowerCase().includes("win")
      ? "windows"
      : "linux",
    rcloneAvailable: true,
    rcloneVersion: "rclone v1.68.2 (rcd JSON-RPC ready)",
    mountDriverName: navigator.platform.toLowerCase().includes("win")
      ? "WinFsp (Drive Letter Mount)"
      : "FUSE3 (fusermount3)",
    mountDriverReady: true,
    keyringBackend: navigator.platform.toLowerCase().includes("win")
      ? "Windows Credential Manager (DPAPI)"
      : "Freedesktop SecretService (OS Keyring)",
    rcEndpointType: navigator.platform.toLowerCase().includes("win")
      ? "Authenticated Loopback (127.0.0.1)"
      : "Unix Domain Socket ($XDG_RUNTIME_DIR/strata/rc.sock)",
  };
}
