//! Real-Time Filesystem Watcher & Smart Debouncer Configuration (`notify` pipeline).
//!
//! Architecture reference: `architecture/03-sync-and-mirror-modes.md` (Section 3).

use serde::{Deserialize, Serialize};

/// Configuration for the native OS filesystem event watcher (`inotify` / `ReadDirectoryChangesW`).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct WatcherConfig {
    pub debounce_window_ms: u64,
    pub max_batch_delay_ms: u64,
    pub ignore_patterns: Vec<String>,
}

impl Default for WatcherConfig {
    fn default() -> Self {
        Self {
            debounce_window_ms: 1_500,
            max_batch_delay_ms: 10_000,
            ignore_patterns: vec![
                ".DS_Store".to_string(),
                "Thumbs.db".to_string(),
                "*.swp".to_string(),
                "~$*".to_string(),
                "node_modules/".to_string(),
            ],
        }
    }
}
