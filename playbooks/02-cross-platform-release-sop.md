# 📦 Playbook 02 – Cross-Platform Build & Release Checkliste (Linux & Windows)

Dieses Playbook beschreibt den Standard-Prozess für das Bauen, Testen und Veröffentlichen einer neuen **Strata**-Version für **Linux** und **Windows**.

---

## 1. Vorbereitungen vor dem Release
- [ ] Versionsnummer synchron in `package.json`, `src-tauri/Cargo.toml` und `src-tauri/tauri.conf.json` erhöhen (Semantic Versioning `vX.Y.Z`).
- [ ] Alle automatisierten Tests (`cargo test` & Frontend-Tests) erfolgreich durchlaufen lassen.
- [ ] Lizenz- und Abhängigkeitsprüfung sicherstellen (GPL-3.0 Konformität).

## 2. Linux Build-Matrix
- [ ] **Debian / Ubuntu (`.deb`):** Prüfen, dass `fuse3` (`libfuse3-3`) und `libwebkit2gtk-4.1-0` als Paket-Abhängigkeiten deklariert sind.
- [ ] **Fedora / RHEL / openSUSE (`.rpm`):** Paket-Abhängigkeiten prüfen.
- [ ] **Universal (`AppImage` / `Flatpak`):** Portablen Start inkl. System-Tray (`libayatana-appindicator`) unter Wayland (GNOME/KDE) und X11 verifizieren.

## 3. Windows Build-Matrix
- [ ] **Windows Installer (`.msi` & `NSIS -setup.exe`):**
  - Prüfen, dass WebView2 Runtime (auf Windows 10/11 standardmäßig vorhanden) erkannt wird.
  - Prüfen, dass die **WinFsp**-Erkennung für den Laufwerksbuchstaben-Mount (`Z:`) sauber funktioniert.
  - System-Tray-Icon, Windows Autostart-Registry-Key und Windows Credential Manager Integration testen.

## 4. Veröffentlichung & Blackbox-Abschluss
- [ ] GitHub Release mit Changelog und SHA256-Prüfsummen aller Installer veröffentlichen.
- [ ] Release-Eintrag `[BB-XXX]` in [`memory/BLACKBOX.md`](../memory/BLACKBOX.md) und Status-Update in [`memory/PROJECT_STATE.md`](../memory/PROJECT_STATE.md) dokumentieren.
