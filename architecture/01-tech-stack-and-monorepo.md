# 🛠️ 01 – Tech-Stack, Monorepo & UI-Design-Standard

## 1. Verbindlicher Technologie-Stack

Um maximale Performance auf **Linux** und **Windows** mit einer erstklassigen Benutzeroberfläche zu verbinden, setzt **Strata** auf folgenden Stack:

| Schicht | Technologie | Begründung |
| :--- | :--- | :--- |
| **App-Framework** | **Tauri v2** | Nutzt native System-Webviews (`WebKitGTK` auf Linux, `WebView2` auf Windows) statt eines 200 MB schweren Chromium-Bündels (Electron). Wenn das UI-Fenster geschlossen wird, läuft nur der winzige Rust-Daemon im System-Tray weiter (~15–30 MB RAM). |
| **Backend / Core Daemon** | **Rust (Stable, Edition 2024)** | Speichersicher, extrem schnell, erstklassige Crates für Dateisystem-Watching (`notify`), Async-Runtime (`tokio`), OS-Keyring (`keyring`) und HTTP/Socket-IPC (`reqwest` / `hyper`). |
| **Storage-Engine** | **`rclone` (`rcd` JSON-RPC)** | Bewährte Multi-Cloud-Engine für 70+ Provider, `mount` (VFS), `bisync`, `sync`, `copy` und `crypt`. |
| **Frontend-Framework** | **React 19 + TypeScript (Vite)** | Strikte Typsicherheit, komponentenbasierte Architektur für komplexe Datei-Bäume und Live-Telemetrie. |
| **Styling & Komponenten** | **Tailwind CSS + shadcn/ui + Radix UI** | Barrierefreie, hochmoderne UI-Primitiven im „Linear / Raycast“-Design. |
| **Animationen & Icons** | **Framer Motion + Lucide Icons** | Butterweiche Übergänge beim Wechsel zwischen Stream-, Hybrid- und Mirror-Modus. |
| **State Management** | **Zustand + TanStack Query** | Schlankes, reaktives State-Management für Live-Events aus dem Rust-Backend. |

---

## 2. Geplante Monorepo-Struktur (ab Phase 1)

```text
Strata/
├── src/                                # 🎨 Frontend (React + TypeScript + Tailwind)
│   ├── components/
│   │   ├── layout/                     # Sidebar, Header, Statusbar, System-Tray-Popup
│   │   ├── explorer/                   # Visueller Ordnerbaum, Checkbox-Sync, Pin-Badges
│   │   ├── modes/                      # 3-Mode-Switcher (Stream | Hybrid | Mirror) & Mirror-Regeln
│   │   ├── transfers/                  # Live-Transfer-Drawer, Speed-Graph, Activity-Feed
│   │   ├── conflicts/                  # Side-by-Side Konfliktlösungs-Dialog
│   │   └── onboarding/                 # Cloud-Provider OAuth-Wizard & 1-Click Crypt-Setup
│   ├── stores/                         # Zustand Stores (Remotes, ActiveJobs, Telemetry)
│   ├── lib/                            # Typisierte Tauri IPC-Wrapper (invoke / listen)
│   └── styles/                         # Design-Tokens, Dark/Light Theme
│
├── src-tauri/                          # 🦀 Backend & Core Daemon (Rust)
│   ├── src/
│   │   ├── main.rs / lib.rs            # Tauri Setup, System-Tray, Lifecycle-Management
│   │   ├── engine/                     # rclone rcd Prozess-Manager & JSON-RPC Client
│   │   ├── mount/                      # VFS Mount Orchestrator (FUSE3 / WinFsp)
│   │   ├── sync/                       # Mirror-Scheduler, Bisync-Runner & Conflict-Detector
│   │   ├── watcher/                    # Echtzeit-Dateisystem-Watcher (notify + Debouncer)
│   │   ├── security/                   # OS-Keyring Integration & rclone.conf Verschlüsselung
│   │   └── ipc/                        # Tauri Commands & Echtzeit-Event-Emitter ans UI
│   ├── Cargo.toml
│   └── tauri.conf.json
│
├── architecture/                       # 🏛️ Verbindliche Architektur-Standards (00-04)
├── memory/                             # 🧠 Projektstatus, Meilensteine & Blackbox
└── playbooks/                          # 📋 Entwicklungs- & Release-Checklisten
```

---

## 3. UI/UX-Design-Richtlinien („Anti-Insync-Look“)

1. **Drei-Spalten-Cockpit ohne Popup-Chaos:**
   - **Linke Spalte (Navigation & Remotes):** Verbundene Cloud-Konten mit Anbieter-Icon, Speicherplatz-Balken und schnellem „+ Cloud verbinden“-Button.
   - **Mittlere Hauptfläche (Workspace & Baumansicht):** Oben der **3-Modi-Umschalter** (`☁️ Stream Mount` | `📌 Hybrid Pinning` | `💾 Full Offline Mirror`), darunter der schnelle, virtualisierte Ordnerbaum mit Echtzeit-Status-Badges (`Lokal gespiegelt`, `Nur Stream`, `Verschlüsselt`, `Synchronisiert gerade...`).
   - **Rechtes / Unteres Panel (Inspector & Transfer-Hub):** Kontext-Einstellungen für den ausgewählten Ordner (Spiegel-Richtung, Ignore-Regeln, Cache-Limit) sowie der ausklappbare Live-Transfer-Monitor.
2. **Hintergrund-First (Tray-Modus):**
   - Das Schließen des Hauptfensters (`X`) beendet **nicht** die Synchronisation oder bestehende Mounts, sondern minimiert Strata lautlos in den System-Tray.
   - Ein Klick auf das Tray-Icon öffnet ein kompaktes **Quick-Popover** (aktuelle Übertragungsrate, Pause/Resume-Button, Direktlink zum gemounteten Laufwerk im Explorer/Dateimanager).
