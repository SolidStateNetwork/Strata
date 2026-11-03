# ⬛ GLOBAL MEMORY BLACKBOX — Chronological Engineering Log & ADRs

> **PURPOSE OF THIS FILE:**  
> `BLACKBOX.md` is the central, append-only long-term engineering memory and Architecture Decision Record of **Strata (`SolidStateNetwork/Strata`)**.  
> **Every AI agent and developer** who implements features, updates architecture, or fixes bugs **must** prepend a structured entry at the top of the chronological log.

---

## 📝 Template for New Blackbox Entries

```markdown
### [BB-XXX] YYYY-MM-DD HH:MM (TZ) — [MODULE] Short Summary of Change
- **Actor:** <AI Model / Agent / Developer>
- **Type:** `ARCHITECTURE` | `FEATURE` | `UI` | `ENGINE` | `SECURITY` | `FIX` | `RELEASE`
- **Affected Modules:** `ARCH-LEXICON` | `UI-SHELL` | `UI-EXPLORER` | `CORE-RCD` | `MODE-STREAM` | `MODE-MIRROR` | `MODE-HYBRID`
- **Goal / Context:** Why was this change made?
- **Steps Performed:** Which files, components, or Rust modules were created or modified?
- **Verification:** How was compilation, test execution, and lexicon compliance verified?
```

---

## 🏛️ Architecture Decision Records (ADRs)

| ADR ID | Decision | Rationale |
| :--- | :--- | :--- |
| **ADR-001** | **Tauri v2 (Rust) + React/TypeScript + Tailwind CSS as Application Stack** | A sync and virtual drive client runs 24/7 in the system tray. Tauri v2 enables a modern web UI (Linear/Raycast aesthetic) with a minimal background memory footprint (~15–30 MB vs. 400+ MB in Electron). |
| **ADR-002** | **Decoupled `rclone rcd` JSON-RPC Engine Instead of Hard Go FFI Binding** | Controlling `rclone` through its official JSON-RPC API (`rclone rcd` over local Unix domain socket or authenticated loopback) immediately leverages every upstream `rclone` release and 70+ cloud providers without Go/Rust C-shared linker conflicts. |
| **ADR-003** | **Three-Mode Storage Architecture (`Stream Mount`, `Full Offline Mirror`, `Hybrid Smart Pinning`)** | Unifies the strengths of *Google Drive for Desktop* (0 GB virtual drive) and *Insync* (real local folder mirror in 2-way or 1-way mode) while allowing selective offline pinning of individual folders inside a cloud mount. |
| **ADR-004** | **Real-Time Synchronization via Native Rust `notify` Watcher + Smart Debouncer** | Overcomes the primary limitation of standalone `rclone bisync` (rigid cron intervals) by detecting local file events immediately via `inotify` (Linux) or `ReadDirectoryChangesW` (Windows), filtering temporary files, and batching changes. |
| **ADR-005** | **OS Keyring Encryption & GPL-3.0 Licensing** | All cloud tokens and configuration keys are encrypted via the native OS credential vault (`SecretService` / `Windows Credential Manager`). The **GPL-3.0** license guarantees that Strata and all derivatives remain free and open source. |

---

## 📜 Chronological Engineering Log (Newest First)

### [BB-006] 2026-11-03 22:38 (CET) — [ARCH-LEXICON] Standardized AI Enforcement Directives & Mandatory Same-Turn Post-Change Protocol
- **Actor:** Antigravity AI (Gemini 4 Argon)
- **Type:** `ARCHITECTURE` | `SECURITY`
- **Affected Modules:** `ARCH-LEXICON` (`AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `playbooks/scripts/verify-lexicon-completeness.py`)
- **Goal / Context:** Standardize and enforce strict AI governance across `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, and `.github/copilot-instructions.md` with explicit read-before-act rules, single-repository isolation, language policy (Chat: German, Repository: 100% English), and the mandatory same-turn commit-and-push checklist ("No batching. No postponing. No skipping steps.").
- **Steps Performed:**
  1. Updated `AGENTS.md` with the core mandate, strict CWD isolation, language standard, and explicit same-turn Post-Change Checklist.
  2. Updated `GEMINI.md` and `CLAUDE.md` and created `.github/copilot-instructions.md` referencing `AGENTS.md` with the explicit Post-Change Checklist.
  3. Registered `.github/copilot-instructions.md` in `REQUIRED_FILES` inside `playbooks/scripts/verify-lexicon-completeness.py`.
- **Verification:** Verified `python playbooks/scripts/verify-lexicon-completeness.py` (`EXIT 0`) and pushed to `origin main`.

### [BB-005] 2026-11-03 10:02 (CET) — [ARCH-LEXICON] Single-Repository Decoupling, Structural Consolidation & 100% English Standardization
- **Actor:** Antigravity AI (Gemini 4 Argon)
- **Type:** `ARCHITECTURE` | `SECURITY`
- **Affected Modules:** `ARCH-LEXICON`
- **Goal / Context:** Decouple Strata into a 100% self-contained standalone repository, remove cross-repository bridge/template clutter and duplicate IDE instruction files, translate all architecture, memory, and playbook documents into idiomatic English, and add automated GitHub Actions CI verification.
- **Steps Performed:**
  1. Removed decoupled cross-repository directories (`bridge/`, `design/`, `templates/`) and redundant duplicate agent rule files (`.cursorrules`, `.windsurfrules`, `.cursor/`, `.agents/`, `.github/copilot-instructions.md`).
  2. Rewrote `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `architecture/00`–`04`, `playbooks/01`–`02`, and `memory/{PROJECT_STATE,MILESTONES,BLACKBOX}.md` in 100% idiomatic English enforcing the Strict Single-Repository Boundary.
  3. Updated `playbooks/scripts/verify-lexicon-completeness.py` to enforce the streamlined required file set and fail if forbidden bloat paths or cross-repository references reappear.
  4. Added `.github/workflows/ci.yml` and `package.json` verification scripts (`lint`, `typecheck`, `test`, `build`).
- **Verification:** Verified `python playbooks/scripts/verify-lexicon-completeness.py`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` with 0 errors.

### [BB-004] 2026-11-02 23:35 (CET) — [ARCH-LEXICON] Addition of `playbooks/scripts/verify-lexicon-completeness.py`
- **Actor:** Antigravity AI
- **Type:** `ARCHITECTURE` | `SECURITY`
- **Affected Modules:** `ARCH-LEXICON`
- **Goal / Context:** Provide an automated lexicon and clean-room verification script (`playbooks/scripts/verify-lexicon-completeness.py`) for the repository.
- **Steps Performed:**
  1. Created `playbooks/scripts/verify-lexicon-completeness.py` with mandatory artifact checks and a clean-room IP/path scanner.
- **Verification:** `python3 playbooks/scripts/verify-lexicon-completeness.py` passed with `EXIT 0`.

### [BB-003] 2026-11-02 22:55 (CET) — [ARCH-LEXICON / UI-SHELL] Initial Design Token Exploration (Superseded by BB-005)
- **Actor:** Antigravity AI
- **Type:** `ARCHITECTURE` | `UI`
- **Affected Modules:** `ARCH-LEXICON`, `UI-SHELL`
- **Goal / Context:** Evaluated external theme token files before consolidating all styling tokens directly inside `tailwind.config.js` and `src/styles/globals.css` in `[BB-005]`.
- **Steps Performed:**
  1. Verified standalone Tailwind CSS theme configuration in `tailwind.config.js` and `src/styles/globals.css`.
- **Verification:** Pre-commit and build checks passed.

### [BB-002] 2026-11-01 01:22 (CET) — [UI-SHELL / UI-EXPLORER / CORE-RCD] Phase 1: Initialization of Tauri v2 Monorepo & 3-Column Desktop Cockpit
- **Actor:** Antigravity AI (Gemini 4 Argon)
- **Type:** `ARCHITECTURE` | `FEATURE` | `UI` | `ENGINE`
- **Affected Modules:** `UI-SHELL`, `UI-EXPLORER`, `CORE-RCD`, `MODE-STREAM`, `MODE-MIRROR`, `MODE-HYBRID`
- **Goal / Context:** Complete initialization of the project workspace according to [`architecture/01-tech-stack-and-monorepo.md`](../architecture/01-tech-stack-and-monorepo.md) and delivery of Phase 1 (`M1.1`–`M1.3`).
- **Steps Performed:**
  1. **Frontend (`src/`, Vite + React 19 + TypeScript + Tailwind CSS + Zustand):**
     - Created typed Tauri IPC bridge (`src/lib/ipc.ts`) and central reactive store (`src/stores/useStrataStore.ts`).
     - Implemented 3-column cockpit: `Sidebar.tsx` (cloud remotes, storage usage bars, engine telemetry), `Header.tsx`, `ModeSwitcher.tsx` (`Stream Mount` | `Hybrid Smart Pinning` | `Full Offline Mirror`), `FolderTree.tsx` (selective sync checkboxes, offline pin toggles, `rclone crypt` badges), `InspectorDrawer.tsx` (mirror directions `Local ↔ Cloud`, `Local → Cloud`, `Cloud → Local`, soft-delete `.strata-archive`, VFS cache quotas & `.strataignore` rules), `TransferHub.tsx` (live bandwidth sparkline & transfer queue), `ConflictModal.tsx`, and `OnboardingModal.tsx`.
  2. **Rust Core Daemon (`src-tauri/`, Tauri v2, Rust Edition 2024):**
     - Built modular backend architecture under `src-tauri/src/{engine,mount,sync,watcher,security,ipc}` with cross-platform `PathBuf` resolution and `#[cfg(target_os = "...")]` encapsulation for Linux (`FUSE3`, Unix domain socket, `SecretService`) and Windows (`WinFsp`, loopback auth, `Credential Manager`).
     - Added unit tests for system capabilities, watcher debouncer defaults, and sync policies in `src-tauri/src/lib.rs`.
- **Verification:** Verified `npm run typecheck`, `npm run build` (`vite build`), and `cargo check` / `cargo test` in `src-tauri` with 0 errors.

### [BB-001] 2026-11-01 01:02 (CET) — [ARCH-LEXICON] Phase 0: Public Open-Source Repository Foundation & Architecture Lexicon
- **Actor:** Antigravity AI & Project Lead
- **Type:** `ARCHITECTURE` | `SECURITY`
- **Affected Modules:** `ARCH-LEXICON` (`README.md`, `LICENSE`, `AGENTS.md`, `architecture/00`–`04`, `memory/*`, `playbooks/*`, `.githooks/pre-commit`)
- **Goal / Context:** Establish a clean, well-structured project foundation for **Strata (`SolidStateNetwork/Strata`)** tailored for a public open-source repository.
- **Steps Performed:**
  1. Created public-facing documentation (`README.md` with system architecture diagram, 3-mode explanation, and comparison matrix, `LICENSE` GPL-3.0, `CONTRIBUTING.md`, `SECURITY.md`, `.github/ISSUE_TEMPLATE/`).
  2. Authored technical architecture specifications (`architecture/00-product-vision.md` through `04-security-and-zero-knowledge.md`) and engineering playbooks (`playbooks/01` & `02`).
  3. Initialized persistent AI memory (`memory/PROJECT_STATE.md`, `memory/MILESTONES.md`, `memory/BLACKBOX.md` including `ADR-001` through `ADR-005`).
  4. Enabled AI governance (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`) and the automated pre-commit secret and path blocker (`.githooks/pre-commit`).
- **Verification:** Verified pre-commit hook, confirmed zero internal data or local workstation paths in the repository, and completed Phase 0 (`M0.1`–`M0.4`).
