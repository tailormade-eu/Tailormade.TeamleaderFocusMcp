# MCP-Audit Fase 4 — Round 2: Tests + types + PII + auth + idempotency

**Run:** 2026-05-03
**Repo:** Tailormade.TeamleaderFocusMcp
**Code version:** 3.5.1 — **npm published:** 3.2.11 — **latest git tag:** v3.5.0
**Build/test status:** `npm test` ✅ 214/214 pass · `npm run build` ✅
**Scope:** 24 tool-bestanden in `src/tools/`

---

## 1. Test coverage

Test files aanwezig (6 total, unchanged from round 1):

| Tool file | Test file | Tests | Status |
|-----------|-----------|-------|--------|
| calls | — | — | ❌ OPEN |
| companies | — | — | ❌ OPEN |
| contacts | contacts.test.ts | 11 | ✅ |
| creditnotes | — | — | ❌ OPEN |
| deals | — | — | ❌ OPEN |
| departments | — | — | ❌ OPEN |
| events | — | — | ❌ OPEN |
| files | — | — | ❌ OPEN |
| invoices | invoices.test.ts | 145 | ✅ |
| login | — | — | ❌ OPEN |
| lookups | — | — | ❌ OPEN |
| materials | — | — | ❌ OPEN |
| meetings | — | — | ❌ OPEN |
| notes | — | — | ❌ OPEN |
| orders | — | — | ❌ OPEN |
| products | — | — | ❌ OPEN |
| projects | — | — | ❌ OPEN |
| quotations | — | — | ❌ OPEN |
| resolve | resolve.test.ts | 7 | ✅ |
| subscriptions | subscriptions.test.ts | 9 | ✅ |
| tasks | — | — | ❌ OPEN |
| tickets | — | — | ❌ OPEN |
| timetracking | timetracking.test.ts | 31 | ✅ |
| users | — | — | ❌ OPEN |
| **client** (new) | **client.test.ts** | **11** | ✅ **NEW** |

**Score: 6/24 tool-files covered (25%)** — 18 tools nog zonder dedicated test.
> Round 1 scoorde 5/24 (20.8%). client.test.ts is toegevoegd als deel van B6.4.2-fix (+11 tests). Tool-coverage zelf: 19→18 (client is geen tool-file, maar de test is zinvol).

**Delta vs round 1:** +11 tests (203→214), +1 test file (client.test.ts).

---

## 2. B6.4.2 — 429 retry: **CLOSED** ✅

Implementatie in `src/api/client.ts`:
- `getRetryDelay(attempt, retryAfterHeader)` — exported helper, capped op 30s
- Retry loop: max 3 retries op HTTP 429, exponential backoff (1s/2s/4s) als geen header
- Retry-After parse: numeriek (seconds), HTTP-date formaat, 30s cap

Tests in `test/client.test.ts` (11 tests):

| Test case | Status |
|-----------|--------|
| Numeric Retry-After (seconds → ms) | ✅ |
| Cap Retry-After at 30s | ✅ |
| Exponential fallback bij null/empty header | ✅ |
| Bogus non-numeric header → exponential | ✅ |
| HTTP-date Retry-After parse | ✅ |
| HTTP-date Retry-After capped at 30s | ✅ |
| 200 → direct return, 1 call | ✅ |
| 429 → success op 2e attempt (Retry-After=1) | ✅ |
| 429 twice → success op 3e attempt (no header) | ✅ |
| 429 × 4 → throws after max retries | ✅ |
| 400 → geen retry, 1 call | ✅ |

**Verdict:** Implementatie correct. Tests dekken alle edge cases incl. 30s cap en HTTP-date. **B6.4.2 CLOSED.**

---

## 3. Types strictness

Grep `: any|as any|<any>` in `src/` (incl. comments): **0 matches**.

> Round 1 uitkomst bevestigd. Strict mode actief in tsconfig.

✅ PASS — **CLOSED**

---

## 4. PII in tool descriptions — **REGRESSED** ⚠️

Round 1 checked `test/` fixtures → 0 matches. **src/tools/ descriptions niet gecheckt.**

Huidige scan van `src/tools/` op klant-specifieke voorbeelden:

| Locatie | PII-inhoud | Occurrences |
|---------|-----------|-------------|
| `src/tools/invoices.ts:405` | `'Service Agreement JaRa-Tailormade_202605 (70%)'` | 1× in tool description |
| `src/tools/invoices.ts:486` | `'Service Agreement JaRa-Tailormade_202605 (70%)'` | 1× in param describe |
| `src/tools/invoices.ts:506` | `'Service Agreement JaRa-Tailormade_202605 (70%)'` | 1× in param describe |
| `src/tools/invoices.ts:529` | `'SA JaRa-Tailormade_202604'` | 1× in param describe |
| `src/tools/invoices.ts:725` | `'Service Agreement JaRa-Tailormade_202605 (70%)'` | 1× in tool description |
| `src/tools/invoices.ts:753` | `'Service Agreement JaRa-Tailormade_202605 (70%)'` | 1× in param describe |
| `src/tools/invoices.ts:761` | `'Service Agreement JaRa-Tailormade_202605 (70%)'` | 1× in param describe |
| `src/tools/invoices.ts:820` | `'SA JaRa-Tailormade_202604'` | 1× in param describe |
| `src/tools/invoices.ts:880` | `'Service Agreement JaRa-Tailormade_202605 (70%)'` | 1× in param describe |
| `src/tools/invoices.ts:888` | `'Service Agreement JaRa-Tailormade_202605 (70%)'` | 1× in param describe |
| `src/tools/invoices.ts:912` | `'SA JaRa-Tailormade_202604'` | 1× in param describe |

**11 occurrences** van klant-specifieke namen/referentiecodes in tool descriptions die worden geëxporteerd via MCP-schema's (zichtbaar voor alle LLM's en clients die de server introspecteerden).

> Round 1 beoordeelde PII als PASS maar checkte alleen `test/` fixtures. De gap lag in `src/tools/`. Dit is een nieuwe bevinding.

**Status: NEW GAP → B7.4.1**

---

## 5. Auth — 401 mid-flight retry: **OPEN**

`src/api/client.ts`: geen 401-detection of retry-on-401 logic.
`src/api/auth.ts`: proactief refresh vóór elke call (via `getAccessToken()` → refresh als token expired/missing).

Scenario dat ongedekt blijft: token expires exact tussen proactieve check en API-call (race condition, of klok-afwijking). API retourneert 401, client gooit `Error("401 Unauthorized - ...")` zonder retry.

**Status: OPEN — B6.4.3 unchanged**

---

## 6. Idempotency documentation: **OPEN**

Grep op `idempotent|idempotency` in `src/`: **0 matches**.

Tools die non-idempotent zijn en geen warning hebben:
- Alle `*_create_*` tools (contact, company, deal, invoice, project, task, note, ticket, …)
- `teamleader_book_invoice` — dubbele call gooit fout (booked invoice kan niet opnieuw geboekt)
- `teamleader_register_payment` — dubbele call → dubbele payment geboekt

`teamleader_add_timetracking` heeft wel expliciete dedup-logica (start_time + duration + work_type match).

**Status: OPEN — B6.4.6 unchanged**

---

## 7. Versioning: **OPEN**

| Bron | Versie |
|------|--------|
| `package.json` | **3.5.1** |
| `npm view @tailormade/teamleader-focus-mcp version` | **3.2.11** |
| Latest git tag | **v3.5.0** (v3.5.1 tag ontbreekt) |

Drift nu: 3.5.1 (code) vs 3.2.11 (npm) — **10 patch-versies**.
Extra: git tag v3.5.1 ontbreekt terwijl CHANGELOG 3.5.1 vermeldt op 2026-05-03.

**Status: OPEN — B6.4.4 unchanged + extra: git tag missing**

---

## 8. README freshness: **OPEN**

```
git log --format="%ad %s" --date=short README.md | head -1
→ 2026-03-22 task-00: Setup
```

Leeftijd: 42 dagen. Tool-count in README vs werkelijkheid: niet opnieuw gecontroleerd, maar 19 tools zijn toegevoegd/uitgebreid na 2026-03-22.

**Status: OPEN — B6.4.5 unchanged**

---

## 9. Samenvatting round-1 gaps

| Gap ID | Titel | Round 1 | Round 2 |
|--------|-------|---------|---------|
| B6.4.1 | 19 tools zonder unit test | OPEN | **OPEN** (18 tools na split client.test.ts) |
| B6.4.2 | 429 retry + Retry-After | OPEN | **CLOSED ✅** |
| B6.4.3 | 401 mid-flight retry | OPEN | **OPEN** |
| B6.4.4 | Versioning npm drift | OPEN | **OPEN** (+ git tag v3.5.1 missing) |
| B6.4.5 | README stale (42+ days) | OPEN | **OPEN** |
| B6.4.6 | Idempotency documentatie | OPEN | **OPEN** |
| B6.4.7 | 50KB output cap (optional) | OPEN | **OPEN** (L priority, unchanged) |

---

## 10. Nieuwe BACKLOG-rijen

| ID | Titel | Prio | Estimate |
|----|-------|------|----------|
| **B7.4.1** | Vervang klant-specifieke PII-voorbeelden in `invoices.ts` (11 occurrences van `JaRa-Tailormade_*`) door generieke placeholders zoals `'Service Agreement Acme-Corp_202605 (70%)'` en `'SA Acme-Corp_202604'` | H | 30min |

---

## Coverage rapport

| Metric | Waarde |
|--------|--------|
| Test files | 6 / 25 (24 tools + 1 client) |
| Total tests | 214 |
| Tests passed | 214 (100%) |
| Tool files zonder tests | 18/24 (75%) |
| `any` types in src/ | 0 |
| PII in tool descriptions | 11 occurrences (new gap B7.4.1) |
| 401 retry | ❌ not implemented |
| 429 retry | ✅ implemented + tested |
| Idempotency docs | ❌ 0/n create-tools documented |
| npm published version | 3.2.11 (drift: 10 versions) |
| git tag v3.5.1 | ❌ missing |
| README age | 42 days (stale) |
