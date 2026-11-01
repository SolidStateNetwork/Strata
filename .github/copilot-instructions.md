# GitHub Copilot Instructions – SolidStateNetwork/Strata

This repository (`SolidStateNetwork/Strata`) is a public open-source project (GPL-3.0) governed by the **Architecture Lexicon & AI Memory System** (`architecture/` & `memory/`).

## Mandatory 5-Step Protocol (see `AGENTS.md`):
1. **Read First:** Before writing or modifying code, read `AGENTS.md`, `memory/PROJECT_STATE.md`, `memory/BLACKBOX.md`, and `memory/MILESTONES.md`.
2. **Check Standards:** Follow all architectural specifications under `architecture/` (`00` through `04`).
3. **Cross-Platform Quality:** Target both **Linux** and **Windows** using Tauri v2 (Rust), React 19, TypeScript, Tailwind CSS, and `rclone rcd`.
4. **Public Repo Clean-Room Guardrails:**
   - Never commit secrets, OAuth tokens, `rclone.conf`, private keys, or `.env` files.
   - Never commit hardcoded local user paths (`/home/<user>/...`), private IPs, or personal email addresses.
5. **Write Back & Push:** After completing any feature or milestone, update `memory/PROJECT_STATE.md`, `memory/MILESTONES.md`, and `memory/BLACKBOX.md` (prepend `[BB-XXX]`), then commit and push to `origin main`.
