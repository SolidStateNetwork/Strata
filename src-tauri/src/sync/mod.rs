//! Storage Modes, Mirror Directions (`2-Way`, `Local->Cloud`, `Cloud->Local`) & Hybrid Pinning.
//!
//! Architecture reference: `architecture/03-sync-and-mirror-modes.md`.

use serde::{Deserialize, Serialize};

/// The 3 core storage modes defined in ADR-003.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum StorageMode {
    Stream,
    Hybrid,
    Mirror,
}

/// Mirror synchronization directions for Full Offline Mirror & Hybrid pinned folders.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum MirrorDirection {
    Bidirectional,
    UploadBackup,
    DownloadMirror,
}

/// Configuration for a synchronized or mounted remote mapping.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SyncMappingPolicy {
    pub remote_id: String,
    pub mode: StorageMode,
    pub direction: MirrorDirection,
    pub soft_delete_archive: bool,
    pub archive_folder_name: String,
}
