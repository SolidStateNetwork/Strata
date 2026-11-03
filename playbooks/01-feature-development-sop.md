# 📋 Playbook 01 — Feature Development & AI Workflow (SOP)

This playbook defines the standard operating procedure for developing new features in **Strata**, ensuring code quality, architectural alignment, and documentation remain continuously synchronized.

---

## Step 1: Load Context & Architecture (Read First)
- [ ] Read [`memory/PROJECT_STATE.md`](../memory/PROJECT_STATE.md) and [`memory/MILESTONES.md`](../memory/MILESTONES.md): Which milestone is next in line?
- [ ] Review [`memory/BLACKBOX.md`](../memory/BLACKBOX.md): Which Architecture Decision Records (`ADR-XXX`) and recent engineering logs (`[BB-XXX]`) apply?
- [ ] Check the relevant specification under [`architecture/`](../architecture/) (`00` through `04`).

## Step 2: Clean Cross-Platform Implementation (Rust & TypeScript)
- [ ] **Strict Separation of Concerns:** Business logic, filesystem access, and `rclone rcd` orchestration belong in the **Rust Core (`src-tauri/`)**, exposed via typed Tauri IPC commands (`src/lib/ipc.ts`).
- [ ] **Cross-Platform Portability (Linux & Windows):**
  - Always resolve paths via `std::path::PathBuf` or `tauri::path` (never hardcode `/` vs. `\`).
  - Encapsulate OS-specific mount drivers (`FUSE3` vs. `WinFsp`) and IPC transports cleanly using Rust `#[cfg(target_os = "...")]` attributes.
- [ ] **Strict Single-Repository Scope:** Keep all code and assets self-contained within this repository (`Strata`). Never import files from sibling directories (`../`).

## Step 3: Quality & Security Verification (Verify)
- [ ] Verify that the Rust backend compiles and passes all unit tests (`cargo check` & `cargo test` in `src-tauri/`).
- [ ] Verify that the TypeScript frontend passes typechecking and production bundling (`npm run typecheck` & `npm run build`).
- [ ] Run `python playbooks/scripts/verify-lexicon-completeness.py` to confirm all required lexicon files exist and zero secrets, local paths, or cross-repo artifacts are present.

## Step 4: Documentation & Blackbox Write-Back
- [ ] Update module status in [`memory/PROJECT_STATE.md`](../memory/PROJECT_STATE.md).
- [ ] Check off completed items (`[x]`) in [`memory/MILESTONES.md`](../memory/MILESTONES.md).
- [ ] Prepend a new `[BB-XXX]` entry at the top of [`memory/BLACKBOX.md`](../memory/BLACKBOX.md).
- [ ] Commit all changes in English and push to `origin main`.
