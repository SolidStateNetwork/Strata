# ⬛ GLOBAL MEMORY BLACKBOX – Chronologisches Entwicklungs-Logbuch & ADRs

> **ZWECK DIESER DATEI:**  
> Die `BLACKBOX.md` ist das zentrale, unveränderliche Langzeitgedächtnis (Append-Only Engineering Log & Architecture Decision Record) von **Strata (`SolidStateNetwork/Strata`)**.  
> **Jeder KI-Agent und Entwickler**, der Features implementiert, die Architektur erweitert oder Bugs behebt, **muss** hier einen strukturierten Eintrag hinterlassen (neueste Einträge immer **oben**).

---

## 📝 Vorlage für neue Blackbox-Einträge

```markdown
### [BB-XXX] YYYY-MM-DD HH:MM (TZ) – [MODUL] Kurztitel der Änderung
- **Akteur:** <KI-Modell / Agent / Entwickler>
- **Typ:** `ARCHITECTURE` | `FEATURE` | `UI` | `ENGINE` | `SECURITY` | `FIX` | `RELEASE`
- **Betroffene Module:** `ARCH-LEXICON` | `UI-SHELL` | `UI-EXPLORER` | `CORE-RCD` | `MODE-STREAM` | `MODE-MIRROR` | `MODE-HYBRID`
- **Ziel / Hintergrund:** Warum wurde die Änderung durchgeführt?
- **Durchgeführte Schritte:** Welche Dateien, Komponenten oder Rust-Module wurden erstellt/angepasst?
- **Verifikation:** Wie wurde geprüft, dass alles fehlerfrei kompiliert und funktioniert?
```

---

## 🏛️ Architecture Decision Records (ADRs)

| ADR-ID | Entscheidung | Begründung |
| :--- | :--- | :--- |
| **ADR-001** | **Tauri v2 (Rust) + React/TypeScript + Tailwind CSS als App-Stack** | Ein Sync- & Mount-Client läuft 24/7 im System-Tray. Tauri v2 ermöglicht ein hochmodernes Web-UI (Linear/Raycast-Ästhetik) bei minimalem RAM-Verbrauch im Hintergrund (~15–30 MB statt 400+ MB bei Electron). |
| **ADR-002** | **Entkoppelte `rclone rcd` JSON-RPC Engine statt hartem Go-Code-Import** | Durch die Steuerung von `rclone` über dessen offizielle JSON-RPC-API (`rclone rcd` über lokalen Unix-Socket bzw. authentifizierten Loopback) profitieren wir sofort von jedem neuen `rclone`-Release und 70+ Cloud-Providern ohne Go-Dependency-Konflikte. |
| **ADR-003** | **Drei-Modi-Speicherarchitektur (`Stream Mount`, `Full Offline Mirror`, `Hybrid Smart Pinning`)** | Vereint die Vorteile von *Google Drive for Desktop* (0 GB virtuelles Laufwerk) und *Insync* (echter lokaler Ordner-Spiegel in beide oder eine Richtung) und erlaubt das gezielte Offline-Pinnen einzelner Ordner innerhalb eines großen Cloud-Mounts. |
| **ADR-004** | **Echtzeit-Synchronisation via nativem Rust `notify`-Watcher + Smart Debouncer** | Überwindet die größte Schwäche von reinem `rclone bisync` (starre Cron-Intervalle), indem lokale Dateiänderungen sofort über `inotify` (Linux) bzw. `ReadDirectoryChangesW` (Windows) erkannt, gefiltert und gebündelt synchronisiert werden. |
| **ADR-005** | **OS-Keyring-Verschlüsselung & GPL-3.0 Lizenzierung** | Alle Cloud-Tokens werden über den nativen Betriebssystem-Keyring (`SecretService` / `Windows Credential Manager`) verschlüsselt gespeichert. Die Lizenz **GPL-3.0** garantiert, dass Strata und alle Derivate dauerhaft freies Open Source bleiben. |

---

## 📜 Chronologisches Logbuch (Neueste zuerst)

### [BB-001] 2026-11-01 01:02 (CET) – [ARCH-LEXICON] Phase 0: Aufbau des Public Open-Source Repository-Fundaments & Architektur-Lexikons
- **Akteur:** Antigravity AI & Project Lead
- **Typ:** `ARCHITECTURE` | `SECURITY`
- **Betroffene Module:** `ARCH-LEXICON` (`README.md`, `LICENSE`, `AGENTS.md`, `architecture/00`–`04`, `memory/*`, `playbooks/*`, `.githooks/pre-commit`)
- **Ziel / Hintergrund:** Sauberer, hochstrukturierter Projektstart für **Strata (`SolidStateNetwork/Strata`)** nach dem Vorbild des Enterprise-Lexikons, vollständig adaptiert und gehärtet für ein **öffentliches Open-Source-Repository**.
- **Durchgeführte Schritte:**
  1. Englische Public-Facing-Dokumentation (`README.md` mit System-Architektur-Diagramm, 3-Modi-Erklärung und Vergleichsmatrix, `LICENSE` GPL-3.0, `CONTRIBUTING.md`, `SECURITY.md`, `.github/ISSUE_TEMPLATE/`) angelegt.
  2. Technische Architektur-Standards (`architecture/00-product-vision.md` bis `04-security-and-zero-knowledge.md`) und Entwicklungs-Playbooks (`playbooks/01` & `02`) erstellt.
  3. Persistentes KI-Gedächtnis (`memory/PROJECT_STATE.md`, `memory/MILESTONES.md`, `memory/BLACKBOX.md` inkl. `ADR-001` bis `ADR-005`) eingerichtet.
  4. Multi-IDE KI-Governance (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.cursorrules`, `.windsurfrules`, `.github/copilot-instructions.md`, `.agents/hooks.json`) und den automatischen Public-Secret- & Pfad-Blocker (`.githooks/pre-commit`) aktiviert.
- **Verifikation:** Pre-Commit-Hook verifiziert, keine internen Daten oder lokalen Pfade im Repository, Phase 0 (`M0.1`–`M0.4`) vollständig abgeschlossen.
