# 🤝 Contributing to Strata

Thank you for your interest in contributing to **Strata**! Our goal is to build the most capable, modern, and user-friendly open-source cloud sync and virtual drive client for Linux and Windows.

---

## 🧭 Architecture-First & AI-Ready Workflow

Strata uses a structured **Architecture & Memory Lexicon** (`architecture/` and `memory/`) so both human engineers and AI coding assistants share a single source of truth:

1. **Read the Architecture Specs:** Before implementing a major feature, check [`architecture/`](./architecture/) to ensure your design aligns with our core standards:
   - [`00-product-vision.md`](./architecture/00-product-vision.md)
   - [`01-tech-stack-and-monorepo.md`](./architecture/01-tech-stack-and-monorepo.md)
   - [`02-rclone-engine-and-vfs-architecture.md`](./architecture/02-rclone-engine-and-vfs-architecture.md)
   - [`03-sync-and-mirror-modes.md`](./architecture/03-sync-and-mirror-modes.md)
   - [`04-security-and-zero-knowledge.md`](./architecture/04-security-and-zero-knowledge.md)
2. **Check Project State & Milestones:** Review [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md) and [`memory/MILESTONES.md`](./memory/MILESTONES.md) to see what is currently in progress.
3. **Zero-Secret Policy:** Never commit OAuth client secrets, `rclone.conf` files, personal tokens, private keys, or hardcoded local user paths. Enable our Git pre-commit guardrail after cloning:
   ```bash
   git config core.hooksPath .githooks
   ```

---

## 🛠️ Tech Stack Requirements

- **Backend / Core Daemon:** Rust (stable toolchain) + Tauri v2
- **Frontend / UI:** React + TypeScript + Tailwind CSS (Vite)
- **Storage Engine:** `rclone` (`v1.68+` recommended for `rcd` JSON-RPC and `bisync`)
- **Virtual Filesystem Drivers (for Mount Mode):**
  - **Linux:** `fuse3` (`libfuse3-dev`)
  - **Windows:** `WinFsp`

---

## 🔄 Pull Request Checklist

- [ ] Code compiles cleanly without warnings (`cargo clippy -- -D warnings` & `npm run typecheck`).
- [ ] Unit/integration tests pass (`cargo test` & frontend tests).
- [ ] No secrets, tokens, or hardcoded local paths are included in the diff.
- [ ] Relevant documentation in `architecture/` or `memory/` is updated if architectural behavior changed.

By contributing to Strata, you agree that your contributions will be licensed under the **[GNU General Public License v3.0 (GPL-3.0)](./LICENSE)**.
