# 🛡️ 04 — Security, OS Keyring & Zero-Knowledge Architecture

## 1. Credential Protection (Zero Plaintext Tokens on Disk)

A common security risk in standard `rclone` setups is `~/.config/rclone/rclone.conf`, where OAuth refresh tokens and S3 secret keys are stored in plaintext unless the user manually manages a configuration password on every invocation.

**Strata eliminates this risk automatically via the native OS credential vault:**
1. On first launch, the Strata Rust daemon generates a cryptographically secure **256-bit master configuration key**.
2. This key is **never** written to a file; instead, it is stored directly inside the operating system's native password vault via the `keyring` crate:
   - **Linux:** `org.freedesktop.secrets` (*GNOME Keyring* / *KDE KWallet* / *KeePassXC Secret Service*).
   - **Windows:** *Windows Credential Manager* (`CredWriteW` / DPAPI-protected).
3. The configuration file managed by Strata remains permanently encrypted on disk with **AES-256 (`RCLONE_CONFIG_PASS`)**. When spawning `rclone rcd`, the Rust daemon passes the decryption secret strictly in memory.

---

## 2. 1-Click Zero-Knowledge Encryption (`rclone crypt`)

Many users want to leverage Google Drive, OneDrive, Dropbox, or S3 storage without allowing the cloud provider to inspect their personal documents, photos, or business files.

Strata integrates **`rclone crypt`** as a first-class UI capability ("Zero-Knowledge Vault"):
1. **Simple Toggle During Remote or Folder Setup:**
   - Users can enable **🔒 "Zero-Knowledge Vault (`rclone crypt`)"** with a single click in the Onboarding Wizard or Inspector Drawer.
2. **Automated Layer Wrapping:**
   - The user supplies a vault passphrase (plus optional salt / recovery phrase sealed in the OS Keyring).
   - Behind the scenes, Strata provisions a nested `crypt` remote over the target folder (`NaCl SecretBox` / `XSalsa20` + `Poly1305` for file payloads, `EME` AES encryption for filenames and directory names).
3. **Transparent Local Access:**
   - Locally in the file manager (whether accessed via a virtual drive `Z:` or a local mirror directory), the user works with normal plaintext files.
   - In the cloud (e.g., viewing Google Drive in a web browser), only opaque encrypted ciphertext blocks are stored.

---

## 3. Local IPC Hardening (Daemon $\leftrightarrow$ Engine)

Because `rclone rcd` exposes privileged filesystem operations, no external process or untrusted browser tab (SSRF) may access the local RC daemon:
- **Never Unauthenticated:** `rclone rcd` is never launched with `--rc-no-auth`.
- **Ephemeral Credentials:** On every startup, the Rust daemon generates a random one-time 256-bit token for authenticating requests to `rclone rcd`.
- **Unix Domain Socket (Linux):** On Linux, communication defaults to a restricted socket inside the user runtime directory (`$XDG_RUNTIME_DIR/strata/rc.sock` with mode `0600`), avoiding opening a TCP port altogether.

---

## 4. Public Repository Clean-Room & Zero-Secret Policy

Because `SolidStateNetwork/Strata` is a **public open-source repository**, strict security guardrails apply to all contributors and AI agents:
1. **Zero Real Tokens or Configs in Git:** Test fixtures may only contain synthetic placeholder values (`<REDACTED>`, `mock-token-xxx`).
2. **Zero Local Workstation Paths:** Source code, tests, and documentation must never contain personal local user paths (e.g., `/home/<real-user>/...`), private server IPs, or personal email addresses.
3. **Automated Pre-Commit & CI Enforcement:** Both [`.githooks/pre-commit`](../.githooks/pre-commit) and [`playbooks/scripts/verify-lexicon-completeness.py`](../playbooks/scripts/verify-lexicon-completeness.py) scan tracked files for private keys, OAuth secrets, local workstation paths, and forbidden cross-repository artifacts.
