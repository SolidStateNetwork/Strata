# 🤖 CLAUDE.md — Mandatory AI Engineering Directive (SolidStateNetwork/Strata)

This standalone open-source repository (`SolidStateNetwork/Strata`, GPL-3.0) is governed by [`AGENTS.md`](./AGENTS.md).
1. **Strict Single-Repository Boundary:** Operate 100% inside the current working directory (`CWD`). Never read, modify, or execute commands in sibling directories (`../`).
2. **100% English Repository Standard:** Keep all repository documentation, architecture specs, memory files, source code, comments, and commit messages in 100% English (chat with the user in German).
3. **Mandatory 5-Step Protocol:** Always read and update [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md), [`memory/MILESTONES.md`](./memory/MILESTONES.md), and [`memory/BLACKBOX.md`](./memory/BLACKBOX.md) (`[BB-XXX]`), verify via `python playbooks/scripts/verify-lexicon-completeness.py`, and follow [`AGENTS.md`](./AGENTS.md).
