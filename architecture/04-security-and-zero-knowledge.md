# 🛡️ 04 – Security, OS-Keyring & Zero-Knowledge-Architektur

## 1. Schutz von Zugangsdaten (Keine Klartext-Tokens auf der Festplatte)

Ein bekanntes Sicherheitsrisiko bei einer Standard-Installation von `rclone` ist die Datei `~/.config/rclone/rclone.conf`, in der OAuth-Refresh-Tokens und S3-Keys standardmäßig im Klartext liegen, sofern der Nutzer kein manuelles Konfigurationspasswort eingibt.

**Strata löst dieses Problem automatisch und unsichtbar über den Betriebssystem-Tresor:**
1. Beim ersten Start generiert der Rust-Daemon von Strata einen kryptografisch sicheren **256-Bit Master-Konfigurationsschlüssel**.
2. Dieser Schlüssel wird **niemals** in einer Datei gespeichert, sondern über das Rust-Crate `keyring` direkt im nativen Passwort-Tresor des Betriebssystems abgelegt:
   - **Linux:** `org.freedesktop.secrets` (*GNOME Keyring* / *KDE KWallet* / *KeePassXC Secret Service*).
   - **Windows:** *Windows Credential Manager* (`CredWriteW` / DPAPI-geschützt).
3. Die von Strata verwaltete Konfigurationsdatei ist dadurch auf der Festplatte permanent mit **AES-256 (`RCLONE_CONFIG_PASS`)** verschlüsselt. Beim Start von `rclone rcd` übergibt der Rust-Daemon den Schlüssel ausschließlich im Arbeitsspeicher an den Hintergrundprozess.

---

## 2. 1-Click Zero-Knowledge Encryption (`rclone crypt`)

Viele Nutzer möchten Google Drive, OneDrive, Dropbox oder Hetzner StorageBox nutzen, ohne dass der Cloud-Anbieter ihre privaten Dokumente, Fotos oder Firmendaten einsehen kann.

Strata integriert **`rclone crypt`** als erstklassiges UI-Feature („Zero-Knowledge Vault“):
1. **Einfacher Toggle beim Ordner-Mapping:**
   - Beim Anlegen eines neuen Ordners oder Cloud-Laufwerks kann der Nutzer die Option **🔒 „Ende-zu-Ende verschlüsseln (Zero-Knowledge)“** aktivieren.
2. **Automatische Schicht-Kapselung:**
   - Der Nutzer wählt lediglich ein Passwort (plus optionalen Salt / Wiederherstellungsschlüssel, der im OS-Keyring hinterlegt werden kann).
   - Strata legt im Hintergrund automatisch das geschachtelte `crypt`-Remote über dem Ziel-Ordner an (`NaCl SecretBox` / `XSalsa20` + `Poly1305` für Dateiinhalte, `EME` AES-Verschlüsselung für Dateinamen und Ordnerstrukturen).
3. **Transparente Nutzung:**
   - Lokal im Dateimanager (egal ob als gemountetes Laufwerk `Z:` oder als lokal gespiegelter Ordner) sieht der Nutzer seine ganz normalen Klartext-Dateien.
   - In der Cloud (z. B. im Webbrowser auf Google Drive) liegen ausschließlich unlesbare, verschlüsselte Datenblöcke.

---

## 3. Lokale IPC-Sicherheit (Daemon $\leftrightarrow$ Engine)

Da `rclone rcd` mächtige Dateisystem-Befehle ausführen kann, darf kein fremder Prozess oder Browser-Tab (SSRF) auf den lokalen RC-Daemon zugreifen:
- **Keine unauthentifizierten Ports:** `rclone rcd` wird niemals mit `--rc-no-auth` gestartet.
- **Ephemeral Credentials:** Bei jedem Start erzeugt der Rust-Daemon ein zufälliges Einmal-Passwort (`32 Bytes Hex`) für die lokale Verbindung zu `rclone rcd`.
- **Unix Domain Socket (Linux):** Unter Linux erfolgt die Kommunikation bevorzugt über einen geschützten Socket im Benutzer-Laufzeitverzeichnis (`$XDG_RUNTIME_DIR/strata/rc.sock` mit Berechtigung `0600`), sodass gar kein TCP-Port geöffnet werden muss.

---

## 4. Public-Repository Clean-Room & Zero-Secret-Policy

Da `SolidStateNetwork/Strata` ein **öffentliches Open-Source-Repository** ist, gelten für alle Entwickler und KI-Agenten unverhandelbare Sicherheitsregeln:
1. **Keine echten Tokens oder Konfigurationen im Git:** Test-Fixtures dürfen ausschließlich synthetische Dummy-Werte (`<REDACTED>`, `mock-token-xxx`) enthalten.
2. **Keine lokalen Benutzerpfade:** In Quellcode, Tests und Dokumentation dürfen niemals persönliche Systempfade (z. B. `/home/<echter-user>/...`), private Server-IPs oder persönliche E-Mail-Adressen committet werden.
3. **Technischer Pre-Commit-Blocker:** Der Hook [`.githooks/pre-commit`](../.githooks/pre-commit) prüft jeden Commit automatisiert auf Private Keys, OAuth-Secrets, `rclone.conf`-Fragmente und lokale Benutzerpfade.
