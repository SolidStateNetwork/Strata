# 🎯 MILESTONES — End-to-End Engineering Roadmap for Strata

This document governs the full development lifecycle of **Strata** from its architectural foundation through the first stable cross-platform release (`v1.0.0`).

---

## ✅ Phase 0: Repository Foundation, Architecture Lexicon & Public Guardrails
*Reference: [`architecture/`](../architecture/) & [`AGENTS.md`](../AGENTS.md)*
- [x] **M0.1:** Initialize public open-source repository structure (`README.md`, `LICENSE` GPL-3.0, `CONTRIBUTING.md`, `SECURITY.md`, `.gitignore`).
- [x] **M0.2:** Author mandatory architectural specifications (`00-product-vision.md` through `04-security-and-zero-knowledge.md`) and engineering playbooks.
- [x] **M0.3:** Establish standalone AI governance (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`), automated lexicon verification (`playbooks/scripts/verify-lexicon-completeness.py`), and pre-commit secret guardrails (`.githooks/pre-commit`).
- [x] **M0.4:** Clean-slate commit, 100% English repository standardization, and GitHub Actions CI pipeline verification on `SolidStateNetwork/Strata`.

---

## ✅ Phase 1: Core Workspace & Modern UI Prototype (Tauri v2 + React/Tailwind)
*Reference: [`architecture/01-tech-stack-and-monorepo.md`](../architecture/01-tech-stack-and-monorepo.md)*
- [x] **M1.1:** Initialize Tauri v2 monorepo (`src/` React 19 + TypeScript + Tailwind CSS + Vite & `src-tauri/` Rust Core).
- [x] **M1.2:** Build modern 3-column desktop cockpit ("Linear / Raycast" aesthetic):
  - [x] Left sidebar with connected cloud remotes, provider icons, and storage usage bars.
  - [x] Top **3-Mode Segmented Switch** (`☁️ Stream Mount` | `📌 Hybrid Smart Pinning` | `💾 Full Offline Mirror`).
  - [x] Interactive, fast folder tree with selective sync checkboxes, offline pin toggles, and status badges.
- [x] **M1.3:** Build right Inspector Drawer (mirror direction `Local ↔ Cloud`, `Local → Cloud`, `Cloud → Local`, VFS cache quota slider, zero-knowledge encryption toggle) and expandable **Live Transfer & Activity Hub** with real-time bandwidth sparkline.

---

## ⚙️ Phase 2: Rclone Engine Bridge, OS Keyring & Provider Onboarding
*Reference: [`architecture/02-rclone-engine-and-vfs-architecture.md`](../architecture/02-rclone-engine-and-vfs-architecture.md) & [`architecture/04-security-and-zero-knowledge.md`](../architecture/04-security-and-zero-knowledge.md)*
- [ ] **M2.1:** Implement Rust engine controller for `rclone rcd` (automated lifecycle management, authentication via Unix socket / ephemeral token, healthcheck, and `core/stats` telemetry stream to the UI).
- [ ] **M2.2:** Implement automatic encryption of `rclone.conf` via the native operating system keyring (`keyring` crate for Linux SecretService & Windows Credential Manager).
- [ ] **M2.3:** Connect visual cloud onboarding wizard in the UI (1-click OAuth flow for Google Drive, OneDrive, Dropbox, plus S3/WebDAV/ProtonDrive/Nextcloud/SFTP).
- [ ] **M2.4:** **1-Click Zero-Knowledge Vault (`rclone crypt`):** Interactive wizard for creating and unlocking end-to-end encrypted cloud folders.

---

## ☁️ Phase 3: Virtual Drive — Lightweight Stream Mode (Linux & Windows)
*Reference: [`architecture/02-rclone-engine-and-vfs-architecture.md`](../architecture/02-rclone-engine-and-vfs-architecture.md)*
- [ ] **M3.1:** Cross-platform mount orchestrator via `mount/mount` JSON-RPC:
  - [ ] **Linux:** Mount as a FUSE3 directory (e.g., `~/Cloud/<Remote>`) with `fusermount3` preflight check.
  - [ ] **Windows:** Mount as an available drive letter (`Z:`, `X:`) or folder path via `WinFsp`.
- [ ] **M3.2:** VFS cache profiles (`Smart Balanced / full`, `Ultra Lightweight / writes`, `Zero-Disk / minimal`), live cache occupancy meter, and 1-click "Purge Local VFS Cache" action.
- [ ] **M3.3:** Automatic restoration of active mounts on login and graceful unmount on system shutdown.

---

## 🔄 Phase 4: Real-Time Mirroring (Full Offline Mirror) & Hybrid Smart Pinning
*Reference: [`architecture/03-sync-and-mirror-modes.md`](../architecture/03-sync-and-mirror-modes.md)*
- [ ] **M4.1:** Native real-time filesystem watcher (`notify` in Rust) with configurable `.strataignore` filter and smart debouncer (`1.5s` quiet window).
- [ ] **M4.2:** Implement all 3 mirror directions for arbitrary local folders and drives:
  - [ ] 🔄 **Bi-Directional (`Local ↔ Cloud`)** via `bisync` + real-time delta queue.
  - [ ] ⬆️ **Backup Mirror (`Local → Cloud`)** including optional soft-delete `.strata-archive` protection.
  - [ ] ⬇️ **Download Mirror (`Cloud → Local`)** for local backup drives and NAS storage.
- [ ] **M4.3:** **📌 Hybrid Smart Pinning:** Pin individual subfolders inside a virtual stream mount as "Always Available Offline" and keep them locally synchronized.
- [ ] **M4.4:** Visual **Conflict Resolution Manager** (side-by-side comparison for concurrent local and remote edits).

---

## 📦 Phase 5: Desktop Integration, System Tray & Cross-Platform Release (`v1.0`)
*Reference: [`playbooks/02-cross-platform-release-sop.md`](../playbooks/02-cross-platform-release-sop.md)*
- [ ] **M5.1:** System tray integration with quick-status popover, pause/resume toggle, and native OS notifications.
- [ ] **M5.2:** File manager integration ("Open in Explorer / File Manager", context-menu actions for "Sync with Strata" / "Pin Offline").
- [ ] **M5.3:** Automated GitHub Actions release pipeline for Linux (`.deb`, `.rpm`, `AppImage`) and Windows (`.msi`, `NSIS .exe`).
