# 📋 Playbook 01 – Feature-Entwicklung & KI-Workflow (SOP)

Dieses Playbook definiert den verbindlichen Standard-Ablauf für die Entwicklung jedes neuen Features in **Strata**, damit Code-Qualität, Architektur-Konformität und Dokumentation dauerhaft synchron bleiben.

---

## Schritt 1: Kontext & Architektur prüfen (Read First)
- [ ] [`memory/PROJECT_STATE.md`](../memory/PROJECT_STATE.md) und [`memory/MILESTONES.md`](../memory/MILESTONES.md) lesen: Welcher Meilenstein steht als Nächstes an?
- [ ] [`memory/BLACKBOX.md`](../memory/BLACKBOX.md) prüfen: Welche technischen Entscheidungen (`ADR-XXX`) und letzten Änderungen (`[BB-XXX]`) wurden getroffen?
- [ ] Passende Spezifikation unter [`architecture/`](../architecture/) lesen (`00` bis `04`).

## Schritt 2: Saubere Implementierung (Rust & TypeScript)
- [ ] **Trennung von UI und Logik:** Geschäftslogik, Dateisystem-Zugriffe und `rclone rcd`-Aufrufe gehören immer in den **Rust Core (`src-tauri/`)**, niemals direkt ungeschützt ins Frontend.
- [ ] **Plattformunabhängigkeit (Linux & Windows):**
  - Pfade immer über `std::path::PathBuf` / `tauri::path` auflösen (keine hartcodierten `/` vs. `\`).
  - OS-spezifische Mount-Optionen (`FUSE3` vs. `WinFsp`) sauber über Rust `#[cfg(target_os = "...")]`-Attribute kapseln.
- [ ] **Keine Mock-Sackgassen ohne Kennzeichnung:** Wenn in Phase 1 UI-Prototypen vor der Rclone-Anbindung gebaut werden, müssen deren Datenstrukturen bereits exakt dem späteren Rust-IPC-Vertrag entsprechen.

## Schritt 3: Qualitäts- & Sicherheits-Check (Verify)
- [ ] Kompiliert das Rust-Backend fehler- und warnungsfrei (`cargo check` / `cargo clippy`)?
- [ ] Kompiliert das TypeScript-Frontend fehlerfrei (`npm run typecheck` / `npm run build`)?
- [ ] Sind keinerlei Zugangsdaten, echte `rclone.conf`-Einträge oder persönliche lokale Pfade im Code enthalten?

## Schritt 4: Dokumentation & Blackbox-Write-Back
- [ ] Modul-Status in [`memory/PROJECT_STATE.md`](../memory/PROJECT_STATE.md) aktualisieren.
- [ ] Erledigte Teilaufgaben in [`memory/MILESTONES.md`](../memory/MILESTONES.md) abhaken (`[x]`).
- [ ] Neuen Eintrag `[BB-XXX]` oben in [`memory/BLACKBOX.md`](../memory/BLACKBOX.md) eintragen.
- [ ] Änderungen committen und nach `origin main` pushen.
