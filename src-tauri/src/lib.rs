pub mod engine;
pub mod ipc;
pub mod mount;
pub mod security;
pub mod sync;
pub mod watcher;

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            ipc::get_system_capabilities,
            ipc::get_default_watcher_config,
            ipc::build_sync_policy,
        ])
        .run(tauri::generate_context!())
        .expect("error while running Strata Tauri application");
}

#[cfg(test)]
mod tests {
    use super::*;
    use crate::sync::{MirrorDirection, StorageMode};

    #[test]
    fn test_system_capabilities_probe() {
        let caps = ipc::get_system_capabilities();
        assert!(!caps.platform.is_empty());
        assert!(!caps.mount_driver_name.is_empty());
        assert!(!caps.keyring_backend.is_empty());
        assert!(!caps.rc_endpoint_type.is_empty());
    }

    #[test]
    fn test_default_watcher_config() {
        let cfg = ipc::get_default_watcher_config();
        assert_eq!(cfg.debounce_window_ms, 1_500);
        assert!(cfg.ignore_patterns.contains(&"node_modules/".to_string()));
    }

    #[test]
    fn test_build_sync_policy() {
        let policy = ipc::build_sync_policy(
            "gdrive-work".to_string(),
            StorageMode::Hybrid,
            MirrorDirection::Bidirectional,
            true,
        );
        assert_eq!(policy.remote_id, "gdrive-work");
        assert_eq!(policy.mode, StorageMode::Hybrid);
        assert_eq!(policy.direction, MirrorDirection::Bidirectional);
        assert!(policy.soft_delete_archive);
        assert_eq!(policy.archive_folder_name, ".strata-archive");
    }
}

