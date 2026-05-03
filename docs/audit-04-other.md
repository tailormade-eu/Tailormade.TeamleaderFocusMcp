# MCP-Audit Fase 4 — Andere quality-checks

**Run:** 2026-05-03
**Repo:** Tailormade.TeamleaderFocusMcp
**Code version:** 3.4.2 — **npm published:** 3.2.11
**Build/test status:** `npm test` ✅ 203/203 pass · `npm run build` ✅
**Scope:** 24 tool-bestanden in `src/tools/`

---

## 1. Test coverage

Per tool-bestand check op `test/<tool>.test.ts`.

| Tool | Test file | Status |
|------|-----------|--------|
| calls | — | ❌ FAIL |
| companies | — | ❌ FAIL |
| contacts | contacts.test.ts | ✅ PASS (11) |
| creditnotes | — | ❌ FAIL |
| deals | — | ❌ FAIL |
| departments | — | ❌ FAIL |
| events | — | ❌ FAIL |
| files | — | ❌ FAIL |
| invoices | invoices.test.ts | ✅ PASS (145) |
| login | — | ❌ FAIL |
| lookups | — | ❌ FAIL |
| materials | — | ❌ FAIL |
| meetings | — | ❌ FAIL |
| notes | — | ❌ FAIL |
| orders | — | ❌ FAIL |
| products | — | ❌ FAIL |
| projects | — | ❌ FAIL |
| quotations | — | ❌ FAIL |
| resolve | resolve.test.ts | ✅ PASS (7) |
| subscriptions | subscriptions.test.ts | ✅ PASS (9) |
| tasks | — | ❌ FAIL |
| tickets | — | ❌ FAIL |
| timetracking | timetracking.test.ts | ✅ PASS (31) |
| users | — | ❌ FAIL |

**Score: 5/24 (20.8%)** — 19 tools zonder dedicated unit test.

> Note: bestaande tests dekken vooral *helpers/body-construction* (zoals `toFilterDate`, dedup-logic, scoring). Veel tools hebben geen pure helpers en zijn dunne wrappers rond `client.request()`, wat lage testwaarde betekent. Dat verklaart het lage cijfer maar rechtvaardigt het niet voor tools mét logica (deals, projects, lookups).

---

## 2. Error handling

Grep `try {`/`catch (` in `src/tools/`: **39 occurrences in 3 files** — `login.ts` (8), `resolve.ts` (22), `timetracking.ts` (9).

| Tool-categorie | Pattern | Status |
|----------------|---------|--------|
| Smart tools (resolve, login, timetracking) | Lokale try/catch + nette fout-respond | ✅ PASS |
| Overige 21 tools | Geen try/catch — fouten bubbelen via `client.request()` `throw new Error(...)` | ⚠ ACCEPT |

**Verdict:** geen unhandled exceptions — `TeamleaderClient.request` gooit gestructureerde Error met endpoint+status+body. MCP-framework vangt en formatteert. Consistent. Geen actie nodig tenzij we per-tool friendly messages willen.

---

## 3. PII / secrets in fixtures

Grep `test/` op `@tailormade|jara@|password|secret|api_key|client_secret|refresh_token|Bearer`: **0 matches**.

✅ PASS — fixtures bevatten alleen synthetische IDs/UUIDs.

---

## 4. Type strictness

- `tsconfig.json`: `"strict": true`, `"noUnusedLocals": true`, `"noUnusedParameters": true` ✅
- Grep `: any|as any|<any>` in `src/`: **0 matches** ✅

✅ PASS

---

## 5. Output verbosity

| Risk | Tool | Mitigatie |
|------|------|-----------|
| Volledige task-trees per project | `teamleader_load_tasks` | Schrijft naar `~/.teamleader-tasks-{slug}.yaml` ipv response (CLAUDE.md regel 7) ✅ |
| `list_*` calls met grote pages | alle list tools | Default `page.size` server-side; geen lokale truncate, maar paging is API-managed. ⚠ |
| `get_mail_mime_content`-achtig | n.v.t. (Teamleader API) | — |

⚠ ACCEPT — geen formele 50KB-cap in code. Praktijk: `respond()` returns zijn samenvattingen; raw payloads zijn niet teruggegeven. Geen incident bekend.

---

## 6. Auth / rate-limit

| Item | Status | Bewijs |
|------|--------|--------|
| OAuth refresh-token rotation | ✅ PASS | `src/api/auth.ts:100-105` persist nieuwe refresh_token |
| Token-revoke detection | ✅ PASS | `src/api/auth.ts:79-87` herlees file + duidelijke fout |
| 429 retry / backoff | ❌ FAIL | `src/api/client.ts` heeft geen retry, geen `Retry-After` parse |
| 401 mid-flight retry | ❌ FAIL | Access token wordt proactief ververst maar geen retry-on-401 |

---

## 7. Versioning

| Bron | Versie |
|------|--------|
| `package.json` | **3.4.2** |
| `npm view @tailormade/teamleader-focus-mcp version` | **3.2.11** |

❌ FAIL — drift van 4 patch-versies. Code is niet gepubliceerd sinds 3.2.11. Mogelijk bewust (interne builds), maar moet expliciet gedocumenteerd worden in CHANGELOG of README.

---

## 8. README / CHANGELOG actueel

| Bestand | mtime | Leeftijd | Status |
|---------|-------|----------|--------|
| `README.md` | 2026-03-22 | 42 dagen | ❌ FAIL (>30d, geen documented reason) |
| `CHANGELOG.md` | 2026-05-03 | 0 dagen | ✅ PASS |

---

## 9. Idempotency

| Tool-class | Idempotent? | Status |
|------------|-------------|--------|
| `*_list_*`, `*_get_*` | Ja (read-only) | ✅ |
| `*_create_*` (contact, company, deal, invoice, project, task, note, file, …) | Nee — duplicates bij retry | ⚠ niet gedocumenteerd |
| `*_update_*`, `*_delete_*` | Effectief idempotent (PUT/DELETE-semantiek) | ✅ |
| `teamleader_add_timetracking` | **Custom dedup** op `(started_at second, duration, work_type)` in `timetracking.ts` | ✅ expliciet |
| `teamleader_log_time` (smart) | Erft dedup van add_timetracking | ✅ |
| `register_payment`, `book_invoice` | Niet idempotent — dubbele call → dubbele payment / 2e book faalt | ⚠ niet gedocumenteerd |

❌ FAIL — geen tool-level documentatie behalve `add_timetracking`. Geen idempotency-keys ondersteund door Teamleader API zelf.

---

## Samenvatting

| Check | Pass | Fail | Accept |
|-------|------|------|--------|
| 1 Test coverage | 5 | 19 | — |
| 2 Error handling | 24 | 0 | — |
| 3 PII | 24 | 0 | — |
| 4 Type strictness | 24 | 0 | — |
| 5 Output verbosity | — | — | 24 |
| 6 Auth (refresh) | ✅ | — | — |
| 6 Rate-limit (429) | — | ❌ | — |
| 7 Versioning | — | ❌ | — |
| 8 README | — | ❌ | — |
| 8 CHANGELOG | ✅ | — | — |
| 9 Idempotency | partial | ❌ | — |

---

## BACKLOG-rijen

| ID | Titel | Prio | Estimate |
|----|-------|------|----------|
| **B6.4.1** | Voeg unit tests toe voor 19 tools zonder dedicated test (focus eerst op tools mét helpers: deals, projects, lookups, meetings, quotations) | M | 8h |
| **B6.4.2** | Implementeer 429-retry met `Retry-After` parse + exponential backoff in `src/api/client.ts` | H | 2h |
| **B6.4.3** | Implementeer 401 mid-flight retry (1×) na proactieve refresh in `src/api/client.ts` | M | 1h |
| **B6.4.4** | Sync npm-publish: `npm publish` voor 3.4.2 OF documenteer waarom code-versie ≠ published in CHANGELOG | H | 30min |
| **B6.4.5** | Refresh `README.md` (laatste edit 2026-03-22) — minimaal tool-count + nieuwe smart tools sinds B5 | M | 1h |
| **B6.4.6** | Documenteer idempotency-status per mutating tool in tool-description (CRITICAL/WARNING llmTip), met name `*_create_*`, `register_payment`, `book_invoice` | M | 3h |
| **B6.4.7** | (Optioneel) Voeg formele 50KB output-cap toe in `respond()` helper met truncate + "wrote to file" fallback | L | 2h |
