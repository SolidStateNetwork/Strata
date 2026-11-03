# 📊 PROJECT_STATE — Real-Time Status Matrix of Strata

> **Single Source of Truth (SSOT) for the current development state of all modules.**  
> Updated immediately after every completed engineering milestone.

---

## 1. Project Profile

| Property | Value |
| :--- | :--- |
| **Project Name** | **Strata** (`SolidStateNetwork/Strata`) |
| **Summary** | Modern Open-Source Cloud Sync & Virtual Drive Client ("Best of rclone & Insync") |
| **Target Platforms** | **Linux** (Wayland / X11) & **Windows** (Windows 10 / 11) |
| **License** | **GNU General Public License v3.0 (GPL-3.0)** |
| **Tech Stack** | **Tauri v2 (Rust)** + **React 19 / TypeScript / Tailwind CSS** + **`rclone rcd` Engine** |
| **Current Phase** | 🟢 **Phase 1 Completed** $\rightarrow$ Ready for **Phase 2 (Rclone Engine Bridge, OS Keyring & Provider Onboarding)** |

---

## 2. Subsystem & Module Status Matrix

| Module ID | Component | Path / Scope | Description | Status |
| :--- | :--- | :--- | :--- | :---: |
| **`ARCH-LEXICON`** | **Architecture & AI Lexicon** | `architecture/`, `memory/`, `AGENTS.md` | Full specifications (`00`–`04`), roadmap, blackbox, 100% English standalone standard & CI guardrails | 🟢 `READY` |
| **`UI-SHELL`** | **Modern Desktop Cockpit** | `src/components/layout/` | 3-column layout, dark theme, sidebar, storage usage bars & policy inspector drawer | 🟢 `READY` |
| **`UI-EXPLORER`** | **Visual Folder Tree & 3-Mode Switch** | `src/components/explorer/`, `modes/` | Selective sync tree, mode switcher (`Stream` \| `Hybrid Pin` \| `Full Mirror`), status badges | 🟢 `READY` |
| **`CORE-RCD`** | **Rclone RC Daemon Controller** | `src-tauri/src/engine/` | Persistent `rclone rcd` JSON-RPC client (Unix socket / authenticated loopback) | ⚪ `PLANNED (M2)` |
| **`CORE-SECURITY`** | **OS Keyring & 1-Click Crypt** | `src-tauri/src/security/` | Encryption of `rclone.conf` via OS Keyring + zero-knowledge `crypt` setup wizard | ⚪ `PLANNED (M2)` |
| **`MODE-STREAM`** | **Virtual Drive (Lightweight Mount)** | `src-tauri/src/mount/` | `FUSE3` (Linux) & `WinFsp` drive mount (`Z:` on Windows) with VFS cache manager | ⚪ `PLANNED (M3)` |
| **`MODE-MIRROR`** | **Real-Time Mirror & File Watcher** | `src-tauri/src/sync/`, `watcher/` | Native Rust `notify` watcher + 3 mirror directions (`2-Way`, `Local→Cloud`, `Cloud→Local`) | ⚪ `PLANNED (M4)` |
| **`MODE-HYBRID`** | **Hybrid Smart Pinning & Conflicts** | `src-tauri/src/sync/` | Pin individual subfolders offline inside a virtual cloud mount + side-by-side conflict UI | ⚪ `PLANNED (M4)` |
| **`OS-PACKAGING`** | **Cross-Platform Installers & Tray** | `src-tauri/`, `.github/workflows/` | System tray, autostart, Linux (`.deb`, `.rpm`, `AppImage`) & Windows (`.msi`, `.exe`) | ⚪ `PLANNED (M5)` |
