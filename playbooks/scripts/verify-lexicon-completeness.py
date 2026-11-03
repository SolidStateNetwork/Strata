#!/usr/bin/env python3
"""
verify-lexicon-completeness.py — Standalone Clean-Room & Lexicon Verifier for Strata
Ensures:
1. All mandatory governance, memory, architecture, and playbook files exist.
2. Deleted cross-repo bloat directories/files (bridge/, design/, templates/, README.de.md) do not exist.
3. Zero leaked infrastructure IPs, internal mesh domains, cross-repo references, or local workstation paths in tracked files.
"""
from __future__ import annotations

import re
import subprocess
import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    sys.stdout.reconfigure(encoding="utf-8", errors="replace")
if hasattr(sys.stderr, "reconfigure"):
    sys.stderr.reconfigure(encoding="utf-8", errors="replace")

ROOT = Path(__file__).resolve().parents[2]

REQUIRED_FILES = [
    "README.md",
    "AGENTS.md",
    "CLAUDE.md",
    "GEMINI.md",
    "CONTRIBUTING.md",
    "SECURITY.md",
    ".githooks/pre-commit",
    "memory/PROJECT_STATE.md",
    "memory/MILESTONES.md",
    "memory/BLACKBOX.md",
    "architecture/00-product-vision.md",
    "architecture/01-tech-stack-and-monorepo.md",
    "architecture/02-rclone-engine-and-vfs-architecture.md",
    "architecture/03-sync-and-mirror-modes.md",
    "architecture/04-security-and-zero-knowledge.md",
    "playbooks/01-feature-development-sop.md",
    "playbooks/02-cross-platform-release-sop.md",
    "playbooks/scripts/verify-lexicon-completeness.py",
]

FORBIDDEN_PATHS = [
    "bridge",
    "design",
    "templates",
    "README.de.md",
    ".cursorrules",
    ".windsurfrules",
    ".cursor",
    ".agents",
    ".github/copilot-instructions.md",
]

FORBIDDEN_PATTERNS = [
    (re.compile(r"\b10\.[2]0\.20\.\d+\b"), "Internal WireGuard IP"),
    (re.compile(r"\b10\.1[0]\.\d+\.\d+\b"), "Internal LXC Subnet IP"),
    (re.compile(r"\b217\.1[56][04]\.\d+\.\d+\b"), "Public Server IP (217.x)"),
    (re.compile(r"\b212\.227\.\d+\.\d+\b"), "Public Server IP (212.x)"),
    (re.compile(r"\b82\.165\.\d+\.\d+\b"), "Public Server IP (82.x)"),
    (re.compile(r"\.[s]sn\b"), "Internal Mesh Domain"),
    (re.compile(r"/home/[a-zA-Z0-9_-]+/"), "Local Workstation Path (/home/<user>/)"),
    (re.compile(r"-----BEGIN (?:RSA |OPENSSH |EC )?PRIVATE KEY-----"), "Private Key Material"),
    (
        re.compile(
            r"\b(?:Gateway|Infrastructure|Synapse|Werkblick|Anvil|Odoo|Template_Signal)\b",
            re.IGNORECASE,
        ),
        "Cross-Repository Reference",
    ),
]


def main() -> int:
    errors: list[str] = []

    for rel in REQUIRED_FILES:
        if not (ROOT / rel).exists():
            errors.append(f"Missing required file: {rel}")

    for rel in FORBIDDEN_PATHS:
        if (ROOT / rel).exists():
            errors.append(f"Forbidden bloat path present: {rel}")

    if (ROOT / ".git").exists():
        res = subprocess.run(
            ["git", "-C", str(ROOT), "ls-files"],
            capture_output=True,
            text=True,
            check=False,
        )
        tracked = [line.strip() for line in res.stdout.splitlines() if line.strip()]
        for rel in tracked:
            if rel in {
                "playbooks/scripts/verify-lexicon-completeness.py",
                ".githooks/pre-commit",
            }:
                continue
            fpath = ROOT / rel
            if not fpath.is_file():
                continue
            try:
                content = fpath.read_text(encoding="utf-8")
            except UnicodeDecodeError:
                continue
            for pat, label in FORBIDDEN_PATTERNS:
                if pat.search(content):
                    errors.append(f"Clean-room violation ({label}) in {rel}")

    if errors:
        print("❌ [STRATA VERIFICATION FAILED]")
        for err in errors:
            print(f"  - {err}")
        return 1

    print(
        f"✅ [STRATA LEXICON & CLEAN-ROOM OK] All {len(REQUIRED_FILES)} mandatory artifacts verified. "
        "0 cross-repo/infrastructure/workstation leaks."
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
