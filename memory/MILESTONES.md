# 🎯 MILESTONES – End-to-End Entwicklungs-Fahrplan für Strata

Dieses Dokument steuert den kompletten Aufbau von **Strata** vom Architektur-Fundament bis zum ersten stabilen Cross-Platform-Release (`v1.0.0`).

---

## ✅ Phase 0: Repository-Fundament, Architektur-Lexikon & Public Guardrails
*Referenz: [`architecture/`](../architecture/) & [`AGENTS.md`](../AGENTS.md)*
- [x] **M0.1:** Öffentliche Repository-Struktur (`README.md`, `LICENSE` GPL-3.0, `CONTRIBUTING.md`, `SECURITY.md`, `.gitignore`) erstellen.
- [x] **M0.2:** Verbindliche Architektur-Spezifikationen (`00-product-vision.md` bis `04-security-and-zero-knowledge.md`) und Playbooks ausarbeiten.
- [x] **M0.3:** Multi-Agent KI-Governance (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.agents/hooks.json`) und den technischen Public-Secret-Blocker (`.githooks/pre-commit`) aktivieren.
- [x] **M0.4:** Clean-Slate Initial-Commit & Push nach `git@github.com:SolidStateNetwork/Strata.git`.

---

## 🎨 Phase 1: Core Workspace & Modern UI Prototype (Tauri v2 + React/Tailwind)
*Referenz: [`architecture/01-tech-stack-and-monorepo.md`](../architecture/01-tech-stack-and-monorepo.md)*
- [ ] **M1.1:** Tauri v2 Monorepo (`src/` React 19 + TypeScript + Tailwind CSS + Vite & `src-tauri/` Rust Core) initialisieren.
- [ ] **M1.2:** Modernes 3-Spalten-Cockpit („Linear / Raycast“-Look) bauen:
  - [ ] Linke Sidebar mit Cloud-Remote-Liste, Anbieter-Icons und Speicherplatz-Anzeige.
  - [ ] Oberer **3-Modi-Segmented-Switch** (`☁️ Stream Mount` | `📌 Hybrid Smart Pinning` | `💾 Full Offline Mirror`).
  - [ ] Interaktiver, schneller Ordnerbaum mit Selektiv-Sync-Checkboxen, Pin-Icons und Status-Badges.
- [ ] **M1.3:** Rechter Inspector-Drawer (Spiegel-Richtung `Lokal ↔ Cloud`, `Lokal → Cloud`, `Cloud → Lokal`, VFS-Cache-Limit Slider, Zero-Knowledge Encryption Toggle) und ausklappbarer **Live-Transfer- & Activity-Hub** mit Echtzeit-Speed-Graph.

---

## ⚙️ Phase 2: Rclone Engine Bridge, OS-Keyring & Provider-Onboarding
*Referenz: [`architecture/02-rclone-engine-and-vfs-architecture.md`](../architecture/02-rclone-engine-and-vfs-architecture.md) & [`architecture/04-security-and-zero-knowledge.md`](../architecture/04-security-and-zero-knowledge.md)*
- [ ] **M2.1:** Rust Engine-Controller für `rclone rcd` implementieren (Automatischer Start/Stopp, Authentifizierung via Unix Socket / Ephemeral Token, Healthcheck & `core/stats` Telemetrie-Stream ans UI).
- [ ] **M2.2:** Automatische Verschlüsselung der `rclone.conf` über den nativen Betriebssystem-Keyring (`keyring` Crate für Linux SecretService & Windows Credential Manager).
- [ ] **M2.3:** Visueller Cloud-Onboarding-Assistent im UI (1-Klick OAuth-Flow für Google Drive, OneDrive, Dropbox sowie S3/WebDAV/ProtonDrive/Nextcloud/SFTP).
- [ ] **M2.4:** **1-Click Zero-Knowledge Vault (`rclone crypt`):** Grafischer Assistent zum Erstellen und Entsperren Ende-zu-Ende-verschlüsselter Cloud-Ordner.

---

## ☁️ Phase 3: Virtual Drive – Lightweight Stream Mode (Linux & Windows)
*Referenz: [`architecture/02-rclone-engine-and-vfs-architecture.md`](../architecture/02-rclone-engine-and-vfs-architecture.md)*
- [ ] **M3.1:** Cross-Platform Mount-Orchestrator über `mount/mount` JSON-RPC:
  - [ ] **Linux:** Einbindung als FUSE3-Mount-Ordner (z. B. `~/Cloud/<Remote>`) inkl. `fusermount3`-Prüfung.
  - [ ] **Windows:** Einbindung als freier Laufwerksbuchstabe (`Z:`, `X:`) oder Ordnerpfad über `WinFsp`.
- [ ] **M3.2:** VFS-Cache-Profile (`Smart Balanced / full`, `Ultra Lightweight / writes`, `Zero-Disk / minimal`), Live-Cache-Füllstandsanzeige und 1-Klick „Cache bereinigen“-Funktion.
- [ ] **M3.3:** Automatisches Wiederherstellen aktiver Mounts beim Systemstart und sauberes Unmounten beim Herunterfahren.

---

## 🔄 Phase 4: Echtzeit-Spiegelung (Full Offline Mirror) & Hybrid Smart Pinning
*Referenz: [`architecture/03-sync-and-mirror-modes.md`](../architecture/03-sync-and-mirror-modes.md)*
- [ ] **M4.1:** Nativer Echtzeit-Dateisystem-Watcher (`notify` in Rust) mit konfigurierbarem `.strataignore`-Filter und intelligentem Debouncer (`1.5s` Ruhefenster).
- [ ] **M4.2:** Implementierung aller 3 Spiegel-Modi für beliebige lokale Ordner und Festplatten:
  - [ ] 🔄 **Bi-Direktional (`Lokal ↔ Cloud`)** via `bisync` + Echtzeit-Delta-Queue.
  - [ ] ⬆️ **Backup-Spiegel (`Lokal → Cloud`)** inkl. optionalem „Soft-Delete / `.strata-archive`“-Schutz.
  - [ ] ⬇️ **Download-Spiegel (`Cloud → Lokal`)** für lokale Backup-Platten/NAS.
- [ ] **M4.3:** **📌 Hybrid Smart Pinning:** Einzelne Unterordner innerhalb eines großen Virtual-Stream-Mounts per Klick als „Immer offline verfügbar“ pinnen und lokal synchron halten.
- [ ] **M4.4:** Visueller **Konflikt-Manager** (Side-by-Side Vergleich bei gleichzeitigen Änderungen lokal & in der Cloud).

---

## 📦 Phase 5: Desktop-Integration, System-Tray & Cross-Platform Release (`v1.0`)
*Referenz: [`playbooks/02-cross-platform-release-sop.md`](../playbooks/02-cross-platform-release-sop.md)*
- [ ] **M5.1:** System-Tray-Integration mit Quick-Status-Popover, Pause/Resume-Schalter und nativen OS-Benachrichtigungen.
- [ ] **M5.2:** Dateimanager-Integration („In Explorer / Dateimanager öffnen“, Kontextmenü-Aktionen für „Mit Strata synchronisieren“ / „Offline pinnen“).
- [ ] **M5.3:** Automatisierte GitHub Actions CI/CD-Pipeline für Linux (`.deb`, `.rpm`, `AppImage`) und Windows (`.msi`, `NSIS .exe`).
