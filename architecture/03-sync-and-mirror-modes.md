# 🔄 03 — Sync, Mirror & Hybrid Smart Pinning Architecture

## 1. Overview of the 3 Storage Modes

Strata supports three clearly defined operating modes for every connected cloud remote, which can be switched at any time or combined per subfolder:

| Mode | Local Disk Footprint | Mechanism | Primary Use Case |
| :--- | :--- | :--- | :--- |
| **1. ☁️ Virtual Stream (Mount)** | **0 GB** *(+ optional VFS cache)* | Mounts the cloud remote as a drive letter (`Z:`) or mount directory (`~/Cloud/...`). Files stream on demand when opened. | Multi-terabyte cloud storage (1–20 TB) on laptops with smaller SSDs. |
| **2. 💾 Full Offline Mirror** | **100%** of selected folders | Physical folder on a local disk or partition synchronized in real time with the cloud remote. | Full offline work, maximum local I/O speed, local disk backups. |
| **3. 📌 Hybrid Smart Pinning** | **Pinned folders only (100%)**, remainder **0 GB** | The entire cloud is visible as a virtual mount, while pinned folders are additionally mirrored physically on disk for offline access. | Best of both worlds: browse everything, keep active projects offline. |

---

## 2. Mirror Directions in "Full Offline Mirror" & "Hybrid" Modes

Unlike conventional cloud clients, Strata provides **three selectable mirror directions** per folder mapping:

### A. 🔄 Bi-Directional (`Local ↔ Cloud` / 2-Way Sync)
- **Behavior:** Edits, new files, renames, and deletions propagate in both directions (similar to Insync and Dropbox).
- **Mechanism:** Orchestrated by the Rust daemon combining:
  1. **Real-Time Delta Sync** triggered immediately on local file changes via the native Rust `notify` file watcher.
  2. **Periodic Remote Change Polling / Change-Notify** (`rclone bisync` / provider change feeds) to pull remote updates.
- **Conflict Protection:** If a file is modified concurrently both locally and in the cloud, Strata **never** overwrites data silently. Instead, it preserves both versions and surfaces the conflict in the **Side-by-Side Conflict Resolution Modal** (`Keep Local`, `Keep Cloud`, or `Keep Both`).

### B. ⬆️ Backup Mirror (`Local → Cloud` / 1-Way Upload Mirror)
- **Behavior:** The local directory or disk partition acts as the single source of truth; all local changes are mirrored to the cloud.
- **Safety Option — "Soft-Delete Archive Guard":**
  - *Strict Mirror (`sync`):* Locally deleted files are also removed from the cloud.
  - *Protected Backup Mirror (`sync --backup-dir`):* Locally deleted or overwritten files are never permanently erased in the cloud; instead, they are moved with a timestamp into `.strata-archive/YYYY-MM-DD/` (protecting against accidental deletion or ransomware).
  - *Additive Copy (`copy`):* New and modified files are uploaded while local deletions are ignored on the remote.

### C. ⬇️ Download Mirror (`Cloud → Local` / 1-Way Download Mirror)
- **Behavior:** The cloud remote is the source of truth and is mirrored 1:1 onto a local folder, external backup drive, or NAS share.
- **Primary Use Case:** Automated local offline backup of cloud accounts (e.g., mirroring Google Drive or Nextcloud onto a local NVMe/HDD array).

---

## 3. Real-Time File Watcher & Debouncing Pipeline (Rust `notify`)

To ensure local edits reach the cloud rapidly without flooding provider APIs on every keystroke, the Rust backend runs a multi-stage event pipeline:

```mermaid
flowchart LR
    FS["💻 Local Filesystem\n(Save / Rename / Delete)"] -->|"inotify (Linux)\nReadDirectoryChangesW (Win)"| Watcher["🦀 Rust notify Watcher"]
    Watcher --> Filter["🧹 Ignore Filter\n(.strataignore / Temp Files)"]
    Filter --> Debounce["⏱️ Smart Debouncer\n(1.5s quiet window)"]
    Debounce --> Queue["📥 Prioritized Sync Queue\n(rclone rcd JSON-RPC)"]
```

1. **Pre-Filter Ignore Rules:** Temporary editor swap files (`*.swp`, `~$*.docx`, `.DS_Store`, `Thumbs.db`, `node_modules/`, `.git/`) are filtered out immediately inside the Rust watcher using configurable `.strataignore` glob rules.
2. **Smart Debouncing:** When an IDE or media tool writes dozens of files within 500 ms, the debouncer waits for a short quiet window (default `1500 ms`, maximum batch delay `10 s`) before dispatching a consolidated batch job to `rclone rcd`.

---

## 4. How "Hybrid Smart Pinning" Works

How does Strata combine a **0 GB virtual cloud mount** with **100% offline folders**?
1. The cloud remote is mounted via the VFS layer.
2. When the user clicks **📌 Pin ("Pinned Offline")** on a subfolder in Strata's Folder Tree, the Strata daemon maintains that subtree in a synchronized local mirror path / VFS pin job and keeps changes bidirectionally synchronized.
3. Even when offline on a plane or train, all pinned folders remain 100% readable and writable on the local disk; once connectivity returns, the daemon automatically reconciles all deltas with the cloud remote.
