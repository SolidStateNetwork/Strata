# 🤖 GitHub Copilot Instructions — Mandatory AI Enforcement Directive

> **Primary Governance Reference:** Read and strictly follow [`AGENTS.md`](../AGENTS.md) **BEFORE** taking any action in this repository (`SolidStateNetwork/Strata`).
>
> **Core Mandate:**
> - Read the rules **BEFORE** you do anything.
> - Follow them **ALWAYS** with zero exceptions.
> - Commit and push after **EVERY** change in the **same turn**.
> - **No batching. No postponing. No skipping steps.**

---

## 1. Non-Negotiable Rules

1. **Strict Single-Repository Isolation:** Operate **100% exclusively** inside the current repository working directory (`CWD`). Never read, modify, or execute commands in sibling directories (`../`).
2. **Language Standard:**
   - **Chat with User:** **German**
   - **All Repository Files (Code, Docs, Comments, Commit Messages):** **100% English**
3. **Public Clean-Room Security:** Never commit credentials, `rclone.conf`, `.env`, private keys, or local workstation paths.
4. **Same-Turn Commit & Push:** Every turn that creates, edits, or deletes any repository file **must** finish with `git commit` and `git push origin main` in the exact same turn.

---

## 2. Explicit Post-Change Checklist (Mandatory Every Turn)

Before ending any turn in which files were modified, complete **all** steps below without exception:

- [ ] **Step 1 — Verify Language & Clean-Room Compliance:** Confirm 100% English repository text and zero secrets or local user paths.
- [ ] **Step 2 — Update Project Memory (if applicable):** Sync [`memory/PROJECT_STATE.md`](../memory/PROJECT_STATE.md), [`memory/MILESTONES.md`](../memory/MILESTONES.md), and [`memory/BLACKBOX.md`](../memory/BLACKBOX.md) when architecture, features, or governance change.
- [ ] **Step 3 — Run Verification Checks:**
  - Run `python playbooks/scripts/verify-lexicon-completeness.py`
  - If `src/` changed: `npm run typecheck && npm run build`
  - If `src-tauri/` changed: `cargo check --manifest-path src-tauri/Cargo.toml`
- [ ] **Step 4 — Commit & Push Immediately (Same Turn):**
  - `git add -A`
  - `git commit -m "<type>(<scope>): <english summary>"`
  - `git push origin main`
  - Verify `git status -sb` is clean (`## main...origin/main`).

**No batching. No postponing. No skipping steps.**
