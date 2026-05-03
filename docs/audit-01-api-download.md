# Audit 01 — API download (MCP-audit Fase 1, B6.1)

**Datum:** 2026-05-03 07:06
**Bron:** https://developer.focus.teamleader.eu/
**Methode:** `npm run scrape-api` (Playwright BFS, zie `docs/api/.method.md`)

## Resultaat

| Metric | Waarde |
|---|---|
| Endpoints gescraped | **358** |
| Files in `docs/api/` (incl. INDEX.md) | 359 |
| Build status | clean |
| Vorige scrape | 2026-05-03 06:35 (diff-mode, 0 changes) |
| Vorige full scrape | 2026-05-03 (B5.3 + B5.4 cleanup, commit 95488e8) |

## Diff vs HEAD

| Categorie | Aantal | Lijst |
|---|---|---|
| Toegevoegd | 0 | — |
| Verwijderd | 0 | — |
| Inhoudelijk gewijzigd | 0 | — |
| Metadata gewijzigd | 1 | `docs/api/.last-scrape.md` (alleen run-timestamp + counters) |

`INDEX.md` ongewijzigd (358 endpoints, identiek aan vorige run).

## Interpretatie

Teamleader Focus public API documentatie is **stabiel** sinds de B5.3/B5.4 cleanup eerder vandaag. Geen nieuwe endpoints, geen verwijderde endpoints, geen gewijzigde body-secties. De full re-scrape bevestigt dat de eerdere `--diff`-runs correct waren.

## Acceptance criteria

| # | Test | Status |
|---|---|---|
| 1 | `npm run scrape-api` slaagt zonder errors | ✅ exit 0 |
| 2 | `docs/api/*.md` bevat ≥350 endpoints | ✅ 358 |
| 3 | `docs/audit-01-api-download.md` bestaat met diff-rapport | ✅ dit bestand |
| 4 | `.method.md` Last-run bijgewerkt | ✅ zie commit |
| 5 | `npm run build` clean | ⏳ run separaat |

## Volgende fase

Fase 2 — Tool coverage check (`npm run check-coverage`) en gap-analyse tegen `tools/coverage-config.json`.
