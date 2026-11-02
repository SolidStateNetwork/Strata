# 📐 Design & UI/UX Architecture (`SolidStateNetwork/Strata`)

- **Aktives Standard-Template:** `synapse-canvas`
- **Rolle im Ökosystem:** Financial Intelligence & Cashflow Analytics Platform
- **Template-Quelle:** [`../templates/design-tokens.json`](../templates/design-tokens.json) & [`../templates/theme-bridge.css`](../templates/theme-bridge.css)

## Cross-Repo Design-Harmonie
Alle Repositories unter `SolidStateNetwork` führen einen eigenen `templates/`- und `design/`-Ordner. Dadurch kann jedes Programm sein eigenes Fach-Layout pflegen oder über `data-ssn-template` nahtlos das gemeinsame Design (z. B. `synapse-canvas` zwischen `Synapse` und `Command-HQ`) teilen, ohne Laufzeit-Abhängigkeiten zwischen den Repositories zu erzeugen.
