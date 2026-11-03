# 🤖 AGENTS.md — AI Engineering Manual & Governance for Strata

> **MANDATORY DIRECTIVE FOR ALL AI AGENTS (Antigravity, Claude Code, Cursor, Windsurf, Copilot, Codex):**  
> This repository (`SolidStateNetwork/Strata`) is a **standalone, public open-source software project (GPL-3.0)** governed by a central **Architecture Lexicon & Long-Term Memory (`memory/`)**.  
> **Never modify code or architecture without reading and updating this lexicon!**

---

## 1. Strict Single-Repository Isolation & Language Policy

1. **Strict Single-Repository Boundary (Zero Repo-Hopping):**
   - Operate **100% exclusively** inside the currently open repository working directory (`CWD`).
   - **Never** read, modify, run git commands, or execute scripts in any sibling directory (`../`) or on external servers. Every file outside `CWD` is strictly out of scope.
   - Keep **Strata** a 100% self-contained, standalone product with zero references to other repositories or internal network domains.
2. **100% English Repository Standard:**
   - All repository files (`README.md`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `memory/*`, `architecture/*`, `playbooks/*`, scripts, source code, comments, tests, and commit messages) must be written in **100% idiomatic English**.
   - Only explicit i18n locale dictionaries (when added in the future) may contain non-English strings.
   - Communicate with the user in the chat in **German** while keeping 100% of repository files in English.

---

## 2. The Mandatory 5-Step Engineering Protocol

### Step 1: Load Context (Read First)
Before writing new code or modifying existing modules, **always** read:
1. [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md) — Which modules exist and what is their current status?
2. [`memory/BLACKBOX.md`](./memory/BLACKBOX.md) — What were the most recent engineering steps (`[BB-XXX]`) and which Architecture Decision Records (`ADR-XXX`) apply?
3. [`memory/MILESTONES.md`](./memory/MILESTONES.md) — Which milestone (`M0.x`–`M5.x`) is currently in progress?

### Step 2: Verify Architectural Compliance (Check Standards)
Every implementation must strictly follow the specifications in [`architecture/`](./architecture/):
- [`architecture/00-product-vision.md`](./architecture/00-product-vision.md) — The 3-layer storage model and core principles of Strata.
- [`architecture/01-tech-stack-and-monorepo.md`](./architecture/01-tech-stack-and-monorepo.md) — Tauri v2 (Rust) + React 19 / TypeScript + Tailwind CSS.
- [`architecture/02-rclone-engine-and-vfs-architecture.md`](./architecture/02-rclone-engine-and-vfs-architecture.md) — Control via `rclone rcd` JSON-RPC, VFS caching, `FUSE3` (Linux) & `WinFsp` (Windows).
- [`architecture/03-sync-and-mirror-modes.md`](./architecture/03-sync-and-mirror-modes.md) — The 3 storage modes (`Virtual Stream`, `Full Offline Mirror` [`2-Way`, `Local→Cloud`, `Cloud→Local`], `Hybrid Smart Pinning`) & native Rust `notify` real-time watcher.
- [`architecture/04-security-and-zero-knowledge.md`](./architecture/04-security-and-zero-knowledge.md) — OS Keyring encryption & 1-click `rclone crypt`.

### Step 3: Clean Cross-Platform Implementation (Build & Verify)
- Write platform-independent code for **Linux** and **Windows** (no hardcoded path separators; use clean `#[cfg(target_os = "...")]` encapsulation in Rust).
- After every code change, verify that the backend (`cargo check` / `cargo test`), frontend (`npm run typecheck` / `npm run build`), and lexicon verifier (`python playbooks/scripts/verify-lexicon-completeness.py`) pass with 0 errors.

### Step 4: Public Repository Security Guardrails (Clean-Room Policy)
Because this repository is **public** on GitHub, the following rules apply without exception:
- **Zero-Secret Policy:** NEVER commit real OAuth secrets, `rclone.conf` files, API tokens, private keys, or `.env` files to Git.
- **Zero-Personal-Data Policy:** NEVER leave local workstation paths (such as `/home/<username>/...`), private server IPs, or personal email addresses in code, comments, or documentation.

### Step 5: Documentation & Blackbox Write-Back (Write Back & Push)
After completing **any** feature or milestone, you must **in the same turn**:
1. Update the module status in [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md).
2. Check off completed tasks (`[x]`) in [`memory/MILESTONES.md`](./memory/MILESTONES.md).
3. Prepend a new dated log entry `[BB-XXX]` at the top of [`memory/BLACKBOX.md`](./memory/BLACKBOX.md).
4. Commit the changes cleanly and push to GitHub via `git push origin main`.
