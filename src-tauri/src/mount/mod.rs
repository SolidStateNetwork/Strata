//! Cross-Platform VFS Mount Orchestrator (`FUSE3` on Linux, `WinFsp` on Windows).
//!
//! Architecture reference: `architecture/02-rclone-engine-and-vfs-architecture.md`.

use serde::{Deserialize, Serialize};
use std::process::Command;

/// Supported VFS Cache Modes in `rclone mount`.
#[derive(Debug, Clone, Copy, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "lowercase")]
pub enum VfsCacheMode {
    Full,
    Writes,
    Minimal,
}

/// Information about the host's virtual filesystem driver (`FUSE3` or `WinFsp`).
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct MountDriverStatus {
    pub driver_name: String,
    pub ready: bool,
}

/// Detects the native virtual filesystem mount driver for the current platform.
pub fn detect_mount_driver() -> MountDriverStatus {
    #[cfg(target_os = "linux")]
    {
        let fuse3_ready = Command::new("fusermount3")
            .arg("--version")
            .output()
            .map(|o| o.status.success())
            .unwrap_or(false);

        MountDriverStatus {
            driver_name: "FUSE3 (fusermount3)".to_string(),
            ready: fuse3_ready,
        }
    }

    #[cfg(target_os = "windows")]
    {
        MountDriverStatus {
            driver_name: "WinFsp (Drive Letter Z: / Folder Mount)".to_string(),
            ready: true,
        }
    }

    #[cfg(not(any(target_os = "linux", target_os = "windows")))]
    {
        MountDriverStatus {
            driver_name: "FUSE Virtual Mount".to_string(),
            ready: false,
        }
    }
}
