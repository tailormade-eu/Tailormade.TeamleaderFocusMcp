# Audit 01 — API download round 2 (MCP-audit Q2-2026 Fase 1)

**Datum:** 2026-05-03 (round 2, na fix-cyclus round 1 — codebase v3.5.1)
**Bron:** https://developer.focus.teamleader.eu/
**Methode:** `npm run scrape-api:diff` (Playwright BFS, zie `docs/api/.method.md`)

## Resultaat

| Metric | Waarde |
|---|---|
| Endpoints ontdekt (BFS) | **358** |
| Files in `docs/api/` (incl. INDEX.md) | 359 |
| Nieuwe endpoints | 0 |
| Verwijderde endpoints | 0 |
| Inhoudelijk gewijzigd | 0 |
| Scrape-fouten | 0 |

## Diff vs round 1 (2026-05-03 07:12)

| Categorie | Aantal | Lijst |
|---|---|---|
| Toegevoegd | 0 | — |
| Verwijderd | 0 | — |
| Inhoudelijk gewijzigd | 0 | — |
| Metadata gewijzigd | 1 | `docs/api/.last-scrape.md` (alleen run-timestamp) |

`INDEX.md` ongewijzigd (358 endpoints, identiek aan round 1).

## Interpretatie

Teamleader Focus public API documentatie is **stabiel** — geen wijzigingen sinds round 1 (eerder vandaag). De fix-cyclus van round 1 (B6.2 drift fixes, B6.3 quality-pass) heeft geen API-gerelateerde drift geïntroduceerd. Basis voor Fase 2 (tool coverage check) is ongewijzigd.

## Acceptance criteria

| # | Test | Status |
|---|---|---|
| 1 | `npm run scrape-api:diff` slaagt zonder errors | ✅ exit 0 |
| 2 | `docs/api/*.md` bevat ≥350 endpoints | ✅ 358 |
| 3 | `docs/audit-01-api-download-round2.md` bestaat met diff-rapport | ✅ dit bestand |
| 4 | Geen nieuwe/verwijderde endpoints vs round 1 | ✅ 0 wijzigingen |

## Conclusie

**API stable since round 1.** Geen nieuwe endpoints of verwijderde endpoints. Fase 2 kan starten op dezelfde INDEX.md als round 1.
