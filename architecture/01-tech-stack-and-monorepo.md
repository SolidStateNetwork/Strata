# 🛠️ 01 — Tech Stack, Monorepo & UI Design Standard

## 1. Mandatory Technology Stack

To deliver maximum performance on **Linux** and **Windows** alongside a first-class user interface, **Strata** uses the following stack:

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **App Framework** | **Tauri v2** | Uses native OS webviews (`WebKitGTK` on Linux, `WebView2` on Windows) instead of bundling a 200+ MB Chromium binary (Electron). When the UI window is closed, only the tiny Rust daemon continues running in the system tray (~15–30 MB RAM). |
| **Backend / Core Daemon** | **Rust (Stable, Edition 2024)** | Memory-safe, fast, with first-class crates for filesystem watching (`notify`), async runtime (`tokio`), OS Keyring (`keyring`), and local HTTP/Socket IPC. |
| **Storage Engine** | **`rclone` (`rcd` JSON-RPC)** | Battle-tested multi-cloud engine supporting 70+ providers, `mount` (VFS), `bisync`, `sync`, `copy`, and `crypt`. |
| **Frontend Framework** | **React 19 + TypeScript (Vite)** | Strict type safety and component-driven architecture for interactive folder trees and live telemetry. |
| **Styling & Components** | **Tailwind CSS** | Accessible, modern UI primitives following a clean "Linear / Raycast" design aesthetic. |
| **Icons** | **Lucide Icons (`lucide-react`)** | Crisp, consistent iconography across storage modes, providers, and status badges. |
| **State Management** | **Zustand** | Lightweight, reactive state management for real-time events emitted by the Rust backend. |

---

## 2. Monorepo Structure

```text
Strata/
├── src/                                # 🎨 Frontend (React 19 + TypeScript + Tailwind CSS)
│   ├── components/
│   │   ├── layout/                     # Sidebar, Header, InspectorDrawer
│   │   ├── explorer/                   # Visual FolderTree, selective sync checkboxes, pin badges
│   │   ├── modes/                      # 3-Mode Switcher (Stream | Hybrid | Mirror)
│   │   ├── transfers/                  # Live TransferHub, bandwidth sparkline, activity feed
│   │   ├── conflicts/                  # Side-by-side ConflictModal resolution dialog
│   │   └── onboarding/                 # Cloud provider OAuth wizard & 1-click Crypt setup
│   ├── stores/                         # Zustand stores (remotes, transfers, conflicts, capabilities)
│   ├── lib/                            # Typed Tauri IPC wrappers (invoke)
│   └── styles/                         # Global Tailwind styles & scrollbar tokens
│
├── src-tauri/                          # 🦀 Backend & Core Daemon (Rust)
│   ├── src/
│   │   ├── main.rs / lib.rs            # Tauri setup, IPC registration, unit tests
│   │   ├── engine/                     # rclone rcd process manager & JSON-RPC transport metadata
│   │   ├── mount/                      # VFS Mount orchestrator (FUSE3 / WinFsp)
│   │   ├── sync/                       # Mirror policies, storage modes & direction models
│   │   ├── watcher/                    # Real-time filesystem watcher config (notify + debouncer)
│   │   ├── security/                   # OS Keyring integration & rclone.conf encryption status
│   │   └── ipc/                        # Typed Tauri command handlers
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── architecture/                       # 🏛️ Mandatory Architectural Specifications (00-04)
├── memory/                             # 🧠 Project State, Milestones & Blackbox Log
└── playbooks/                          # 📋 Engineering SOPs & Lexicon Verification Script
```

---

## 3. UI/UX Design Guidelines ("Anti-Insync Look")

1. **Three-Column Cockpit Without Popup Clutter:**
   - **Left Column (Navigation & Remotes):** Connected cloud accounts with provider icon, storage usage bar, and quick "+ Connect Cloud Provider" button.
   - **Center Workspace (Mode Switcher & Folder Tree):** Top **3-Mode Segmented Switch** (`☁️ Stream Mount` | `📌 Hybrid Smart Pinning` | `💾 Full Offline Mirror`), followed by the responsive folder tree with real-time status badges (`Local Mirror`, `On-Demand Stream`, `crypt`, `Syncing...`, `Conflict`).
   - **Right / Bottom Panels (Inspector & Transfer Hub):** Context-aware policy controls for the active remote (mirror direction, soft-delete archive guard, VFS cache quota, `.strataignore` rules) and the expandable live transfer drawer.
2. **Background-First (System Tray Operation):**
   - Closing the main window (`X`) does **not** terminate active synchronization jobs or mounted drives; instead, Strata minimizes cleanly to the system tray.
   - Clicking the tray icon opens a compact quick-status popover with live transfer speed, pause/resume controls, and direct links to open mounted drives in the native file manager.
