# 🤖 GEMINI.md – Mandatory AI Engineering Directive (SolidStateNetwork/Strata)

> **[CRITICAL SYSTEM DIRECTIVE FOR ALL AI AGENTS]**  
> Dieses Repository (`SolidStateNetwork/Strata`) ist ein **öffentliches Open-Source-Projekt (GPL-3.0)** und wird über das zentrale Architektur-Lexikon und Langzeitgedächtnis (`memory/`) gesteuert.  
> **Keine Code- oder Architektur-Änderung ohne vorheriges Lesen und anschließendes Aktualisieren dieses Lexikons!**

---

## Verbindliches 5-Schritte-Pflichtprotokoll (Siehe [`AGENTS.md`](./AGENTS.md))

1. **READ FIRST (Kontext laden):** Lies vor jeder Aufgabe [`AGENTS.md`](./AGENTS.md), [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md), [`memory/BLACKBOX.md`](./memory/BLACKBOX.md) und [`memory/MILESTONES.md`](./memory/MILESTONES.md).
2. **CHECK STANDARDS (Architektur-Konformität):** Halte dich strikt an [`architecture/00-product-vision.md`](./architecture/00-product-vision.md) bis [`architecture/04-security-and-zero-knowledge.md`](./architecture/04-security-and-zero-knowledge.md).
3. **CROSS-PLATFORM QUALITY:** Jedes Feature muss sauber für **Linux** und **Windows** (Tauri v2 + Rust + React/TypeScript + Tailwind CSS + `rclone rcd`) entworfen und getestet werden.
4. **PUBLIC REPO CLEAN-ROOM GUARDRAILS:**
   - **Zero-Secret-Policy:** Niemals OAuth-Tokens, `rclone.conf`, Private Keys oder `.env`-Dateien committen.
   - **Zero-Personal-Data:** Niemals lokale Benutzerpfade (`/home/<user>/...`), private IPs oder private E-Mail-Adressen ins öffentliche Repository schreiben.
5. **WRITE BACK & PUSH:** Aktualisiere nach **jedem** abgeschlossenen Schritt sofort [`memory/PROJECT_STATE.md`](./memory/PROJECT_STATE.md), [`memory/MILESTONES.md`](./memory/MILESTONES.md) und [`memory/BLACKBOX.md`](./memory/BLACKBOX.md) (`[BB-XXX]`) und führe `git commit` & `git push origin main` aus.
