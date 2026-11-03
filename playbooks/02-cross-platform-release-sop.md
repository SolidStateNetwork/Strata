# 📦 Playbook 02 — Cross-Platform Build & Release Checklist (Linux & Windows)

This playbook defines the standard procedure for building, testing, and publishing a new **Strata** release for **Linux** and **Windows**.

---

## 1. Pre-Release Verification
- [ ] Bump the semantic version (`vX.Y.Z`) synchronously across `package.json`, `src-tauri/Cargo.toml`, and `src-tauri/tauri.conf.json`.
- [ ] Run all automated checks (`npm run typecheck`, `npm run build`, `cargo test`, and `python playbooks/scripts/verify-lexicon-completeness.py`) with 0 errors.
- [ ] Verify GPL-3.0 license compliance across dependencies.

## 2. Linux Build Matrix
- [ ] **Debian / Ubuntu (`.deb`):** Confirm `fuse3` (`libfuse3-3`) and `libwebkit2gtk-4.1-0` package dependencies are declared.
- [ ] **Fedora / RHEL / openSUSE (`.rpm`):** Verify RPM metadata and runtime dependencies.
- [ ] **Universal (`AppImage` / `Flatpak`):** Verify portable launch and system-tray integration (`libayatana-appindicator`) under both Wayland (GNOME/KDE) and X11.

## 3. Windows Build Matrix
- [ ] **Windows Installer (`.msi` & `NSIS -setup.exe`):**
  - Confirm WebView2 Runtime detection on Windows 10/11.
  - Verify **WinFsp** detection for drive-letter mounting (`Z:`).
  - Test system-tray icon, autostart registry entry, and Windows Credential Manager (`DPAPI`) integration.

## 4. Publication & Blackbox Log
- [ ] Publish the GitHub Release with full release notes and SHA-256 checksums for all installer artifacts.
- [ ] Record a `[BB-XXX]` release entry in [`memory/BLACKBOX.md`](../memory/BLACKBOX.md) and update [`memory/PROJECT_STATE.md`](../memory/PROJECT_STATE.md).
