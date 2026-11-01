# 🤖 AGENTS.md – AI Engineering Manual & Governance für Strata

> **VERBINDLICHE DIREKTIVE FÜR ALLE KI-AGENTEN (Antigravity, Claude Code, Cursor, Windsurf, Copilot, Codex):**  
> Dieses Repository (`SolidStateNetwork/Strata`) ist ein **öffentliches Open-Source-Softwareprojekt (GPL-3.0)** und nutzt ein zentrales **Architektur-Lexikon & Langzeitgedächtnis (`memory/`)**.  
> **Keine Code- oder Architektur-Änderung ohne vorheriges Lesen und anschließendes Aktualisieren dieses Lexikons!**

---

## 1. Das 5-Schritte-Pflichtprotokoll für jede KI-Session

### Schritt 1: Kontext laden (Read First)
Bevor du neuen Code schreibst oder bestehende Module änderst, lies **zwingend**:
1. [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md) – Welche Module existieren bereits und wie ist ihr aktueller Status?
2. [`memory/BLACKBOX.md`](./memory/BLACKBOX.md) – Was waren die letzten Entwicklungs-Schritte (`[BB-XXX]`) und welche Architecture Decision Records (`ADR-XXX`) gelten?
3. [`memory/MILESTONES.md`](./memory/MILESTONES.md) – An welchem Meilenstein (`M1.x`–`M5.x`) arbeiten wir aktuell?

### Schritt 2: Architektur-Konformität prüfen (Check Standards)
Jede Implementierung muss exakt den Spezifikationen unter [`architecture/`](./architecture/) folgen:
- [`architecture/00-product-vision.md`](./architecture/00-product-vision.md) – Das 3-Schichten-Modell und die Kern-Prinzipien von Strata.
- [`architecture/01-tech-stack-and-monorepo.md`](./architecture/01-tech-stack-and-monorepo.md) – Tauri v2 (Rust) + React 19 / TypeScript + Tailwind CSS + shadcn/ui.
- [`architecture/02-rclone-engine-and-vfs-architecture.md`](./architecture/02-rclone-engine-and-vfs-architecture.md) – Steuerung über `rclone rcd` JSON-RPC, VFS-Caching, `FUSE3` (Linux) & `WinFsp` (Windows).
- [`architecture/03-sync-and-mirror-modes.md`](./architecture/03-sync-and-mirror-modes.md) – Die 3 Modi (`Virtual Stream`, `Full Offline Mirror` [`2-Way`, `Lokal→Cloud`, `Cloud→Lokal`], `Hybrid Smart Pinning`) & Rust `notify` Echtzeit-Watcher.
- [`architecture/04-security-and-zero-knowledge.md`](./architecture/04-security-and-zero-knowledge.md) – OS-Keyring-Verschlüsselung & 1-Click `rclone crypt`.

### Schritt 3: Saubere Cross-Platform-Implementierung (Build & Verify)
- Schreibe plattformunabhängigen Code für **Linux** und **Windows** (keine hartcodierten Pfadtrenner, saubere `#[cfg(target_os = "...")]`-Kapselung in Rust).
- Prüfe nach jeder Code-Änderung, dass Backend (`cargo check` / `cargo test`) und Frontend (`npm run build`) fehlerfrei durchlaufen.

### Schritt 4: Public-Repository Sicherheits-Guardrails (Clean-Room Policy)
Da dieses Repository **öffentlich (Public)** auf GitHub zugänglich ist, gilt ausnahmslos:
- **Zero-Secret-Policy:** NIEMALS echte OAuth-Secrets, `rclone.conf`-Dateien, API-Tokens, Private Keys oder `.env`-Dateien ins Git schreiben!
- **Zero-Personal-Data-Policy:** NIEMALS lokale Benutzerpfade (wie `/home/<username>/...`), private Server-IPs aus anderen Projekten oder private E-Mail-Adressen in Code, Kommentaren oder Dokumentation hinterlassen!

### Schritt 5: Dokumentation & Blackbox-Update (Write Back & Push)
Nach **jedem** abgeschlossenen Feature oder Meilenstein musst du **im selben Arbeitsgang**:
1. Den Modul-Status in [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md) aktualisieren.
2. Erledigte Aufgaben in [`memory/MILESTONES.md`](./memory/MILESTONES.md) abhaken (`[x]`).
3. Einen neuen, datierten Log-Eintrag `[BB-XXX]` ganz oben in [`memory/BLACKBOX.md`](./memory/BLACKBOX.md) einfügen.
4. Die Änderungen sauber committen und per `git push origin main` nach GitHub pushen.

---

## 2. Sprach-Regelung für dieses Repository

- **Öffentliche Außendarstellung (`README.md`, `CONTRIBUTING.md`, `SECURITY.md`, `.github/`, Code-Kommentare & UI-Texte/i18n-Basis):** **Englisch** (für die internationale Open-Source-Community).
- **Internes Architektur- & KI-Lexikon (`AGENTS.md`, `memory/*`, `architecture/*`, `playbooks/*`):** **Deutsch**.
