import { create } from "zustand";
import {
  CloudProvider,
  CloudRemote,
  ConflictItem,
  FolderNode,
  MirrorDirection,
  StorageMode,
  SystemCapabilities,
  TransferItem,
  VfsCacheMode,
} from "../lib/ipc";

interface StrataState {
  remotes: CloudRemote[];
  selectedRemoteId: string;
  selectedFolderId: string | null;
  transfers: TransferItem[];
  conflicts: ConflictItem[];
  bandwidthHistory: number[];
  transferHubExpanded: boolean;
  onboardingOpen: boolean;
  conflictModalOpen: boolean;
  searchQuery: string;
  capabilities: SystemCapabilities | null;

  selectRemote: (id: string) => void;
  selectFolder: (id: string | null) => void;
  setRemoteMode: (remoteId: string, mode: StorageMode) => void;
  setMirrorDirection: (remoteId: string, direction: MirrorDirection) => void;
  setSoftDeleteArchive: (remoteId: string, enabled: boolean) => void;
  setVfsCacheMode: (remoteId: string, mode: VfsCacheMode) => void;
  setVfsCacheLimitGb: (remoteId: string, limitGb: number) => void;
  toggleZeroKnowledge: (remoteId: string) => void;
  purgeVfsCache: (remoteId: string) => void;
  toggleFolderSync: (remoteId: string, folderId: string) => void;
  toggleFolderPin: (remoteId: string, folderId: string) => void;
  setTransferHubExpanded: (expanded: boolean) => void;
  setOnboardingOpen: (open: boolean) => void;
  setConflictModalOpen: (open: boolean) => void;
  setSearchQuery: (query: string) => void;
  setCapabilities: (caps: SystemCapabilities) => void;
  resolveConflict: (
    conflictId: string,
    resolution: "keep_local" | "keep_remote" | "keep_both",
  ) => void;
  addRemote: (params: {
    name: string;
    provider: CloudProvider;
    accountLabel: string;
    mode: StorageMode;
    zeroKnowledgeEncrypted: boolean;
  }) => void;
}

const INITIAL_REMOTES: CloudRemote[] = [
  {
    id: "gdrive-work",
    name: "Google Drive Workspace",
    provider: "gdrive",
    accountLabel: "workspace@example.org",
    mode: "hybrid",
    mountTarget: "~/Cloud/GoogleDrive (or Z:)",
    localMirrorPath: "~/Strata/GoogleDrive-Pinned",
    mirrorDirection: "bidirectional",
    softDeleteArchive: true,
    vfsCacheMode: "full",
    vfsCacheLimitGb: 25,
    vfsCacheUsedGb: 4.2,
    zeroKnowledgeEncrypted: false,
    usedBytes: 1_420_000_000_000,
    totalBytes: 2_000_000_000_000,
    status: "mounted",
    ignorePatterns: [".DS_Store", "Thumbs.db", "node_modules/", "*.tmp", "~$*"],
    rootFolders: [
      {
        id: "f-projects",
        name: "01_Active_Projects",
        path: "/01_Active_Projects",
        sizeBytes: 18_400_000_000,
        selectedForSync: true,
        pinnedOffline: true,
        encrypted: false,
        syncState: "synced",
        children: [
          {
            id: "f-projects-arch",
            name: "Strata_Architecture_Specs",
            path: "/01_Active_Projects/Strata_Architecture_Specs",
            sizeBytes: 420_000_000,
            selectedForSync: true,
            pinnedOffline: true,
            encrypted: false,
            syncState: "synced",
          },
          {
            id: "f-projects-assets",
            name: "Design_System_Assets",
            path: "/01_Active_Projects/Design_System_Assets",
            sizeBytes: 3_800_000_000,
            selectedForSync: true,
            pinnedOffline: true,
            encrypted: false,
            syncState: "syncing",
          },
        ],
      },
      {
        id: "f-vault",
        name: "02_ZeroKnowledge_Vault",
        path: "/02_ZeroKnowledge_Vault",
        sizeBytes: 6_200_000_000,
        selectedForSync: true,
        pinnedOffline: true,
        encrypted: true,
        syncState: "synced",
      },
      {
        id: "f-raw-video",
        name: "03_Raw_Media_Archive_4K",
        path: "/03_Raw_Media_Archive_4K",
        sizeBytes: 1_280_000_000_000,
        selectedForSync: true,
        pinnedOffline: false,
        encrypted: false,
        syncState: "streaming",
      },
      {
        id: "f-finance",
        name: "04_Contracts_&_Invoices",
        path: "/04_Contracts_&_Invoices",
        sizeBytes: 1_950_000_000,
        selectedForSync: true,
        pinnedOffline: true,
        encrypted: true,
        syncState: "conflict",
      },
    ],
  },
  {
    id: "hetzner-s3-vault",
    name: "S3 Encrypted Offsite Backup",
    provider: "s3",
    accountLabel: "s3-eu-central (rclone crypt)",
    mode: "mirror",
    mountTarget: "~/Cloud/S3Vault",
    localMirrorPath: "/mnt/workstation-nvme/Backups",
    mirrorDirection: "upload_backup",
    softDeleteArchive: true,
    vfsCacheMode: "writes",
    vfsCacheLimitGb: 10,
    vfsCacheUsedGb: 0.8,
    zeroKnowledgeEncrypted: true,
    usedBytes: 410_000_000_000,
    totalBytes: 1_000_000_000_000,
    status: "syncing",
    ignorePatterns: ["*.iso", "target/", "node_modules/", ".git/"],
    rootFolders: [
      {
        id: "s3-repos",
        name: "Workstation_Repositories",
        path: "/Workstation_Repositories",
        sizeBytes: 48_000_000_000,
        selectedForSync: true,
        pinnedOffline: true,
        encrypted: true,
        syncState: "syncing",
      },
      {
        id: "s3-photos",
        name: "Photography_RAW_Catalog",
        path: "/Photography_RAW_Catalog",
        sizeBytes: 362_000_000_000,
        selectedForSync: true,
        pinnedOffline: true,
        encrypted: true,
        syncState: "synced",
      },
    ],
  },
  {
    id: "proton-cloud",
    name: "Proton Drive Cloud Stream",
    provider: "protondrive",
    accountLabel: "privacy@proton.me",
    mode: "stream",
    mountTarget: "~/Cloud/ProtonDrive (or X:)",
    localMirrorPath: "~/Strata/ProtonDrive",
    mirrorDirection: "bidirectional",
    softDeleteArchive: true,
    vfsCacheMode: "full",
    vfsCacheLimitGb: 15,
    vfsCacheUsedGb: 1.4,
    zeroKnowledgeEncrypted: true,
    usedBytes: 85_000_000_000,
    totalBytes: 500_000_000_000,
    status: "online",
    ignorePatterns: [".DS_Store", "*.swp"],
    rootFolders: [
      {
        id: "p-docs",
        name: "Personal_Documents",
        path: "/Personal_Documents",
        sizeBytes: 4_500_000_000,
        selectedForSync: true,
        pinnedOffline: false,
        encrypted: true,
        syncState: "streaming",
      },
      {
        id: "p-backups",
        name: "Encrypted_Key_Archives",
        path: "/Encrypted_Key_Archives",
        sizeBytes: 80_500_000_000,
        selectedForSync: true,
        pinnedOffline: false,
        encrypted: true,
        syncState: "streaming",
      },
    ],
  },
];

function updateFolderRecursive(
  nodes: FolderNode[],
  targetId: string,
  updater: (node: FolderNode) => FolderNode,
): FolderNode[] {
  return nodes.map((node) => {
    if (node.id === targetId) {
      return updater(node);
    }
    if (node.children) {
      return {
        ...node,
        children: updateFolderRecursive(node.children, targetId, updater),
      };
    }
    return node;
  });
}

export const useStrataStore = create<StrataState>((set) => ({
  remotes: INITIAL_REMOTES,
  selectedRemoteId: INITIAL_REMOTES[0].id,
  selectedFolderId: "f-projects",
  transfers: [
    {
      id: "tx-1",
      remoteId: "gdrive-work",
      fileName: "Design_System_Assets/UI_Cockpit_Mockup_v4.fig",
      direction: "upload",
      progressPercent: 74,
      speedBytesPerSec: 28_400_000,
      sizeBytes: 148_000_000,
      status: "active",
    },
    {
      id: "tx-2",
      remoteId: "hetzner-s3-vault",
      fileName: "Workstation_Repositories/strata-engine-snapshot.tar.zst",
      direction: "upload",
      progressPercent: 42,
      speedBytesPerSec: 41_200_000,
      sizeBytes: 620_000_000,
      status: "active",
    },
    {
      id: "tx-3",
      remoteId: "gdrive-work",
      fileName: "01_Active_Projects/Strata_Architecture_Specs/03-sync-modes.md",
      direction: "download",
      progressPercent: 100,
      speedBytesPerSec: 0,
      sizeBytes: 64_000,
      status: "completed",
    },
  ],
  conflicts: [
    {
      id: "conf-1",
      remoteId: "gdrive-work",
      relativePath: "04_Contracts_&_Invoices/Q4_Roadmap_Budget.xlsx",
      localModifiedIso: "2026-11-01 00:54 CET",
      localSizeBytes: 2_480_120,
      remoteModifiedIso: "2026-11-01 00:56 CET",
      remoteSizeBytes: 2_512_890,
    },
  ],
  bandwidthHistory: [12, 18, 25, 42, 38, 54, 68, 62, 71, 69, 64, 70],
  transferHubExpanded: false,
  onboardingOpen: false,
  conflictModalOpen: false,
  searchQuery: "",
  capabilities: null,

  selectRemote: (id) =>
    set((state) => {
      const remote = state.remotes.find((r) => r.id === id);
      return {
        selectedRemoteId: id,
        selectedFolderId: remote?.rootFolders[0]?.id ?? null,
      };
    }),

  selectFolder: (id) => set({ selectedFolderId: id }),

  setRemoteMode: (remoteId, mode) =>
    set((state) => ({
      remotes: state.remotes.map((r) =>
        r.id === remoteId
          ? {
              ...r,
              mode,
              rootFolders: r.rootFolders.map((f) => ({
                ...f,
                pinnedOffline:
                  mode === "mirror"
                    ? true
                    : mode === "stream"
                      ? false
                      : f.pinnedOffline,
                syncState:
                  mode === "stream"
                    ? "streaming"
                    : mode === "mirror"
                      ? "synced"
                      : f.pinnedOffline
                        ? "synced"
                        : "streaming",
              })),
            }
          : r,
      ),
    })),

  setMirrorDirection: (remoteId, mirrorDirection) =>
    set((state) => ({
      remotes: state.remotes.map((r) =>
        r.id === remoteId ? { ...r, mirrorDirection } : r,
      ),
    })),

  setSoftDeleteArchive: (remoteId, softDeleteArchive) =>
    set((state) => ({
      remotes: state.remotes.map((r) =>
        r.id === remoteId ? { ...r, softDeleteArchive } : r,
      ),
    })),

  setVfsCacheMode: (remoteId, vfsCacheMode) =>
    set((state) => ({
      remotes: state.remotes.map((r) =>
        r.id === remoteId ? { ...r, vfsCacheMode } : r,
      ),
    })),

  setVfsCacheLimitGb: (remoteId, vfsCacheLimitGb) =>
    set((state) => ({
      remotes: state.remotes.map((r) =>
        r.id === remoteId ? { ...r, vfsCacheLimitGb } : r,
      ),
    })),

  toggleZeroKnowledge: (remoteId) =>
    set((state) => ({
      remotes: state.remotes.map((r) =>
        r.id === remoteId
          ? { ...r, zeroKnowledgeEncrypted: !r.zeroKnowledgeEncrypted }
          : r,
      ),
    })),

  purgeVfsCache: (remoteId) =>
    set((state) => ({
      remotes: state.remotes.map((r) =>
        r.id === remoteId ? { ...r, vfsCacheUsedGb: 0 } : r,
      ),
    })),

  toggleFolderSync: (remoteId, folderId) =>
    set((state) => ({
      remotes: state.remotes.map((r) =>
        r.id === remoteId
          ? {
              ...r,
              rootFolders: updateFolderRecursive(
                r.rootFolders,
                folderId,
                (node) => ({
                  ...node,
                  selectedForSync: !node.selectedForSync,
                }),
              ),
            }
          : r,
      ),
    })),

  toggleFolderPin: (remoteId, folderId) =>
    set((state) => ({
      remotes: state.remotes.map((r) =>
        r.id === remoteId
          ? {
              ...r,
              rootFolders: updateFolderRecursive(
                r.rootFolders,
                folderId,
                (node) => {
                  const nextPinned = !node.pinnedOffline;
                  return {
                    ...node,
                    pinnedOffline: nextPinned,
                    syncState: nextPinned ? "synced" : "streaming",
                  };
                },
              ),
            }
          : r,
      ),
    })),

  setTransferHubExpanded: (transferHubExpanded) =>
    set({ transferHubExpanded }),

  setOnboardingOpen: (onboardingOpen) => set({ onboardingOpen }),

  setConflictModalOpen: (conflictModalOpen) => set({ conflictModalOpen }),

  setSearchQuery: (searchQuery) => set({ searchQuery }),

  setCapabilities: (capabilities) => set({ capabilities }),

  resolveConflict: (conflictId, _resolution) =>
    set((state) => ({
      conflicts: state.conflicts.filter((c) => c.id !== conflictId),
      remotes: state.remotes.map((r) => ({
        ...r,
        rootFolders: r.rootFolders.map((f) =>
          f.syncState === "conflict" ? { ...f, syncState: "synced" } : f,
        ),
      })),
    })),

  addRemote: ({ name, provider, accountLabel, mode, zeroKnowledgeEncrypted }) =>
    set((state) => {
      const id = `${provider}-${Date.now()}`;
      const newRemote: CloudRemote = {
        id,
        name,
        provider,
        accountLabel,
        mode,
        mountTarget: `~/Cloud/${name.replace(/\s+/g, "")}`,
        localMirrorPath: `~/Strata/${name.replace(/\s+/g, "")}`,
        mirrorDirection: "bidirectional",
        softDeleteArchive: true,
        vfsCacheMode: "full",
        vfsCacheLimitGb: 20,
        vfsCacheUsedGb: 0,
        zeroKnowledgeEncrypted,
        usedBytes: 12_000_000_000,
        totalBytes: 1_000_000_000_000,
        status: mode === "stream" ? "mounted" : "online",
        ignorePatterns: [".DS_Store", "Thumbs.db", "node_modules/"],
        rootFolders: [
          {
            id: `${id}-root-1`,
            name: "Documents",
            path: "/Documents",
            sizeBytes: 4_000_000_000,
            selectedForSync: true,
            pinnedOffline: mode !== "stream",
            encrypted: zeroKnowledgeEncrypted,
            syncState: mode === "stream" ? "streaming" : "synced",
          },
          {
            id: `${id}-root-2`,
            name: "Media_Archive",
            path: "/Media_Archive",
            sizeBytes: 8_000_000_000,
            selectedForSync: true,
            pinnedOffline: mode === "mirror",
            encrypted: zeroKnowledgeEncrypted,
            syncState: mode === "mirror" ? "synced" : "streaming",
          },
        ],
      };
      return {
        remotes: [...state.remotes, newRemote],
        selectedRemoteId: id,
        selectedFolderId: newRemote.rootFolders[0].id,
        onboardingOpen: false,
      };
    }),
}));

export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const idx = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1000)),
    units.length - 1,
  );
  const val = bytes / Math.pow(1000, idx);
  return `${val >= 100 ? val.toFixed(0) : val.toFixed(1)} ${units[idx]}`;
}
