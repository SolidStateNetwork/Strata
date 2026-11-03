# 🤖 AGENTS.md — Mandatory AI Engineering Directive for Strata

> **MANDATORY ENFORCEMENT FOR ALL AI AGENTS (Antigravity, Gemini, Claude Code, GitHub Copilot, Cursor, Windsurf, Codex):**
>
> - **Read these rules BEFORE taking any action.**
> - **Follow them at ALL times with ZERO exceptions.**
> - **Commit and push after EVERY change in the exact same turn.**
> - **No batching. No postponing. No skipping steps.**

---

## 1. Core Operating Rules (Zero Exceptions)

### 1.1 Read First — Act Second
- Before creating, modifying, or deleting any file, **always** read this `AGENTS.md` directive and the relevant project documentation (`README.md`, `architecture/`, `memory/`).
- Never guess architectural conventions or skip verification steps.

### 1.2 Strict Single-Repository Isolation (CWD Only)
- Operate **100% exclusively** inside the currently open repository working directory (`CWD`).
- **Never** read, modify, execute git commands, or run builds/scripts in any parent or sibling directory (`../`).
- Keep **Strata (`SolidStateNetwork/Strata`)** a 100% self-contained, standalone open-source project (GPL-3.0) with zero references to external repositories or private network environments.

### 1.3 Language Policy (Chat: German | Repository: 100% English)
- **Chat Communication:** Always communicate with the user in the chat in **German**.
- **Repository Content:** Write **100% of all repository files** (`README.md`, `AGENTS.md`, `GEMINI.md`, `CLAUDE.md`, `.github/copilot-instructions.md`, `architecture/*`, `memory/*`, `playbooks/*`, source code, comments, tests, and Git commit messages) in **idiomatic English**.
- Only dedicated end-user i18n locale dictionaries (when added) may contain non-English translations.

### 1.4 Mandatory Same-Turn Post-Change Protocol
- After **every** modification to the repository (code, configuration, documentation, or scripts), you **must** verify, stage, commit, and push the changes to `origin main` **in the exact same turn**.
- **No batching. No postponing. No skipping steps.**
- Never leave uncommitted changes at the end of a turn, and never defer commits with phrases like *"I will commit this later"*.

---

## 2. Project Context & Architecture Standards (Strata)

**Strata** is a cross-platform open-source cloud sync and virtual drive client for **Linux** and **Windows**, built with:
- **Backend / Core Daemon:** **Tauri v2 (Rust)** (`src-tauri/`) managing `rclone rcd` via authenticated local JSON-RPC, OS Keyring credential encryption, `FUSE3` (Linux) / `WinFsp` (Windows) virtual mounts, and native `notify` real-time filesystem watching.
- **Frontend UI:** **React 19 + TypeScript + Tailwind CSS + Zustand + Vite** (`src/`) implementing a 3-column desktop cockpit (`Stream Mount`, `Hybrid Smart Pinning`, `Full Offline Mirror`).
- **Architecture Specifications:** Stored in [`architecture/00-product-vision.md`](./architecture/00-product-vision.md) through [`architecture/04-security-and-zero-knowledge.md`](./architecture/04-security-and-zero-knowledge.md).
- **Project State & Roadmap:** Tracked in [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md), [`memory/MILESTONES.md`](./memory/MILESTONES.md), and [`memory/BLACKBOX.md`](./memory/BLACKBOX.md).
- **Public Clean-Room Security Policy:**
  - **Zero Secrets:** Never commit real OAuth tokens, `rclone.conf` files, API keys, private keys, or `.env` files.
  - **Zero Workstation Paths:** Never commit local user paths (e.g., `/home/<username>/...`), private IP addresses, or personal email addresses.

---

## 3. Mandatory Post-Change Checklist (Execute Before Ending Every Turn)

Whenever you modify any file in this repository, execute this checklist **in full and in order** within the same turn:

- [ ] **1. Scope & Clean-Room Check:** Confirm all changes are strictly inside `CWD`, written in 100% English, and free of secrets or local user paths.
- [ ] **2. Project Documentation Sync:** If a feature, module, or milestone changed, update [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md), [`memory/MILESTONES.md`](./memory/MILESTONES.md), and [`memory/BLACKBOX.md`](./memory/BLACKBOX.md).
- [ ] **3. Build & Verification Check:**
  - Run `python playbooks/scripts/verify-lexicon-completeness.py` (must exit `0`).
  - When frontend (`src/`) changed: run `npm run typecheck` and `npm run build`.
  - When Rust backend (`src-tauri/`) changed: run `cargo check --manifest-path src-tauri/Cargo.toml` / `cargo test --manifest-path src-tauri/Cargo.toml`.
- [ ] **4. Same-Turn Git Commit & Push:**
  - Stage all changes: `git add -A`
  - Commit with a clear English Conventional Commit message: `git commit -m "<type>(<scope>): <summary>"`
  - Push immediately: `git push origin main`
  - Verify clean state: `git status -sb` must report a clean working tree synced with `origin/main`.

> **REMEMBER:** **No batching. No postponing. No skipping steps.** Every turn that modifies the repository must end with a verified commit and push to `origin main`.
