# 📊 PROJECT_STATE – Echtzeit-Statusmatrix von Strata

> **Single Source of Truth (SSOT) für den aktuellen Entwicklungsstand aller Module.**  
> Wird nach jedem abgeschlossenen Entwicklungsschritt aktualisiert.

---

## 1. Projekt-Steckbrief

| Eigenschaft | Wert |
| :--- | :--- |
| **Projektname** | **Strata** (`SolidStateNetwork/Strata`) |
| **Kurzbeschreibung** | Moderner Open-Source Cloud-Sync & Virtual-Drive Client („Best of rclone & Insync“) |
| **Zielplattformen** | **Linux** (Wayland / X11) & **Windows** (Windows 10 / 11) |
| **Lizenz** | **GNU General Public License v3.0 (GPL-3.0)** |
| **Tech-Stack** | **Tauri v2 (Rust)** + **React / TypeScript / Tailwind CSS** + **`rclone rcd` Engine** |
| **Aktuelle Phase** | 🟢 **Phase 0 abgeschlossen** $\rightarrow$ Bereit für **Phase 1 (Core Workspace & Modern UI Prototype)** |

---

## 2. Subsystem- & Modul-Statusmatrix

| Modul-ID | Komponente | Pfad / Bereich | Beschreibung | Status |
| :--- | :--- | :--- | :--- | :---: |
| **`ARCH-LEXICON`** | **Architektur- & KI-Lexikon** | `architecture/`, `memory/`, `AGENTS.md` | Vollständige Spezifikation (`00`–`04`), Roadmap, Blackbox & Public Pre-Commit Guardrails | 🟢 `READY` |
| **`UI-SHELL`** | **Modernes Desktop-Cockpit** | `src/components/layout/` | 3-Spalten-Layout, Dark/Light-Theme, Sidebar, Storage-Cards & System-Tray-Popover | ⚪ `PLANNED (M1)` |
| **`UI-EXPLORER`** | **Visueller Ordnerbaum & 3-Modi-Switch** | `src/components/explorer/` | Selektiver Sync-Baum, Switch (`Stream` \| `Hybrid Pin` \| `Full Mirror`), Status-Badges | ⚪ `PLANNED (M1)` |
| **`CORE-RCD`** | **Rclone RC Daemon Controller** | `src-tauri/src/engine/` | Persistenter `rclone rcd` JSON-RPC Client (Unix Socket / Auth Loopback) | ⚪ `PLANNED (M2)` |
| **`CORE-SECURITY`** | **OS-Keyring & 1-Click Crypt** | `src-tauri/src/security/` | Verschlüsselung der `rclone.conf` via OS-Keyring + Zero-Knowledge `crypt`-Assistent | ⚪ `PLANNED (M2)` |
| **`MODE-STREAM`** | **Virtual Drive (Lightweight Mount)** | `src-tauri/src/mount/` | `FUSE3` (Linux) & `WinFsp` Laufwerks-Mount (`Z:` auf Windows) inkl. VFS-Cache-Manager | ⚪ `PLANNED (M3)` |
| **`MODE-MIRROR`** | **Echtzeit-Spiegel & File-Watcher** | `src-tauri/src/sync/`, `watcher/` | Nativer Rust `notify`-Watcher + 3 Spiegel-Modi (`2-Way`, `Lokal→Cloud`, `Cloud→Lokal`) | ⚪ `PLANNED (M4)` |
| **`MODE-HYBRID`** | **Hybrid Smart Pinning & Conflicts** | `src-tauri/src/sync/` | Einzelne Ordner innerhalb eines Cloud-Mounts lokal offline pinnen + Konflikt-UI | ⚪ `PLANNED (M4)` |
| **`OS-PACKAGING`** | **Cross-Platform Installer & Tray** | `src-tauri/`, `.github/workflows/` | System-Tray, Autostart, Linux (`.deb`, `.rpm`, `AppImage`) & Windows (`.msi`, `.exe`) | ⚪ `PLANNED (M5)` |
