//! Rclone RC Daemon (`rclone rcd`) Process Manager & JSON-RPC Transport Metadata.
//!
//! Architecture reference: `architecture/02-rclone-engine-and-vfs-architecture.md`.

use serde::{Deserialize, Serialize};
use std::path::PathBuf;
use std::process::Command;

/// Describes how the local Rust daemon communicates with `rclone rcd`.
#[derive(Debug, Clone, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct RcloneEngineInfo {
    pub rclone_available: bool,
    pub rclone_version: String,
    pub rc_endpoint_type: String,
    pub socket_or_loopback_path: PathBuf,
}

/// Resolves the cross-platform IPC endpoint path for `rclone rcd`.
pub fn resolve_rc_endpoint_path() -> PathBuf {
    #[cfg(target_os = "linux")]
    {
        if let Ok(runtime_dir) = std::env::var("XDG_RUNTIME_DIR") {
            let mut p = PathBuf::from(runtime_dir);
            p.push("strata");
            p.push("rc.sock");
            return p;
        }
        let mut fallback = std::env::temp_dir();
        fallback.push("strata-rc.sock");
        fallback
    }

    #[cfg(target_os = "windows")]
    {
        PathBuf::from("127.0.0.1:5572")
    }

    #[cfg(not(any(target_os = "linux", target_os = "windows")))]
    {
        let mut fallback = std::env::temp_dir();
        fallback.push("strata-rc.sock");
        fallback
    }
}

/// Returns human-readable transport description for the current OS.
pub fn describe_rc_transport() -> &'static str {
    #[cfg(target_os = "linux")]
    {
        "Unix Domain Socket ($XDG_RUNTIME_DIR/strata/rc.sock, chmod 0600)"
    }

    #[cfg(target_os = "windows")]
    {
        "Authenticated Loopback (127.0.0.1 + Ephemeral 256-bit Bearer Token)"
    }

    #[cfg(not(any(target_os = "linux", target_os = "windows")))]
    {
        "Local IPC Socket"
    }
}

/// Probes whether `rclone` is installed on the host system and reads its version line.
pub fn probe_rclone_binary() -> RcloneEngineInfo {
    let output = Command::new("rclone").arg("--version").output();
    let (available, version) = match output {
        Ok(out) if out.status.success() => {
            let text = String::from_utf8_lossy(&out.stdout);
            let first_line = text
                .lines()
                .next()
                .unwrap_or("rclone (detected)")
                .trim()
                .to_string();
            (true, first_line)
        }
        _ => (false, "rclone sidecar / not found in PATH".to_string()),
    };

    RcloneEngineInfo {
        rclone_available: available,
        rclone_version: version,
        rc_endpoint_type: describe_rc_transport().to_string(),
        socket_or_loopback_path: resolve_rc_endpoint_path(),
    }
}
