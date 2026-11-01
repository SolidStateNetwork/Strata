//! Typed Tauri IPC Command Handlers exposed to the React Frontend.
//!
//! Architecture reference: `architecture/01-tech-stack-and-monorepo.md`.

use crate::engine::probe_rclone_binary;
use crate::mount::detect_mount_driver;
use crate::security::detect_keyring_backend;
use crate::sync::{MirrorDirection, StorageMode, SyncMappingPolicy};
use crate::watcher::WatcherConfig;
use serde::{Deserialize, Serialize};

/// System capabilities snapshot returned to the React UI on startup.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct SystemCapabilities {
    pub platform: String,
    pub rclone_available: bool,
    pub rclone_version: String,
    pub mount_driver_name: String,
    pub mount_driver_ready: bool,
    pub keyring_backend: String,
    pub rc_endpoint_type: String,
}

#[tauri::command]
pub fn get_system_capabilities() -> SystemCapabilities {
    let engine = probe_rclone_binary();
    let mount_driver = detect_mount_driver();
    let vault = detect_keyring_backend();

    SystemCapabilities {
        platform: std::env::consts::OS.to_string(),
        rclone_available: engine.rclone_available,
        rclone_version: engine.rclone_version,
        mount_driver_name: mount_driver.driver_name,
        mount_driver_ready: mount_driver.ready,
        keyring_backend: vault.keyring_backend,
        rc_endpoint_type: engine.rc_endpoint_type,
    }
}

#[tauri::command]
pub fn get_default_watcher_config() -> WatcherConfig {
    WatcherConfig::default()
}

#[tauri::command]
pub fn build_sync_policy(
    remote_id: String,
    mode: StorageMode,
    direction: MirrorDirection,
    soft_delete_archive: bool,
) -> SyncMappingPolicy {
    SyncMappingPolicy {
        remote_id,
        mode,
        direction,
        soft_delete_archive,
        archive_folder_name: ".strata-archive".to_string(),
    }
}
