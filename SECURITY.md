# 🛡️ Security Policy

## 🔒 Core Security Principles of Strata

Because **Strata** manages access to your personal and enterprise cloud storage accounts, security is a first-class architectural requirement (see [`architecture/04-security-and-zero-knowledge.md`](./architecture/04-security-and-zero-knowledge.md)):

1. **OS Keyring Credential Storage:** OAuth tokens, S3 keys, and configuration passwords are never stored in plaintext on disk. Strata uses the native operating system credential vault (`org.freedesktop.secrets` / SecretService / KWallet on Linux, and **Windows Credential Manager** on Windows).
2. **Authenticated Local Loopback IPC:** Communication between the Rust Core Daemon and the embedded `rclone rcd` engine uses authenticated local Unix domain sockets (Linux) or loopback IPC with per-session ephemeral credentials.
3. **Zero-Knowledge Encryption (`rclone crypt`):** Client-side filename and content encryption is performed locally before any byte leaves your machine.
4. **Zero Telemetry:** Strata does not phones home, track usage, or transmit analytics.

---

## 🚨 Reporting a Vulnerability

If you discover a security vulnerability in Strata:
1. **Please do NOT open a public GitHub issue** if the bug could put users' credentials or data at risk.
2. Instead, please use **GitHub Private Vulnerability Reporting** (`Security` tab $\rightarrow$ `Report a vulnerability`) on the [`SolidStateNetwork/Strata`](https://github.com/SolidStateNetwork/Strata/security) repository.
3. Include steps to reproduce, affected OS (Linux / Windows), and potential impact. We will acknowledge receipt within 48 hours.
