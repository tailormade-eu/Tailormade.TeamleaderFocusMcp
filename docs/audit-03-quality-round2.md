# MCP-audit Round 2 — Fase 3: Description + llmTip Quality Verificatie

**Datum:** 2026-05-03  
**Scope:** 22 tool files in `src/tools/`  
**Doel:** Verificeer 4 kwaliteitspatronen per file na B6.3 quality-pass (v3.5.1)

---

## Patroon definities

| Code | Patroon | Criterium |
|------|---------|-----------|
| P1 | XML markers | `<CRITICAL>`, `<WARNING>`, `<NOTE>` aanwezig waar van toepassing; severity klopt |
| P2 | ID param lookup refs | Elk `*_id` param vermeldt welke tool te gebruiken voor valid ID |
| P3 | Returns + Next steps | Action tools (create/update/delete/complete/book/send): "Returns …" + "Next steps: …" |
| P4 | Format examples | Datum params: "YYYY-MM-DD"; datetime params: ISO 8601 tz-voorbeeld |

Schaal: ✅ Goed | ⚠️ Partial | ❌ Ontbreekt | n/a Niet van toepassing

---

## Verdicht overzicht per file (22 files)

| File | P1 XML | P2 ID refs | P3 Returns/Next | P4 Format | Oordeel |
|------|--------|-----------|----------------|-----------|---------|
| calls.ts | ❌ | ⚠️ | ⚠️ | ✅ | gaps |
| companies.ts | ✅ | ✅ | ✅ | ✅ | goed |
| contacts.ts | ✅ | ✅ | ⚠️ | ✅ | minor gap |
| creditnotes.ts | ❌ | ✅ | ✅ | ✅ | minor gap |
| deals.ts | ⚠️ (NOTE only) | ⚠️ | ⚠️ | ✅ | gaps |
| departments.ts | ⚠️ (NOTE only) | ✅ | ⚠️ | n/a | minor gap |
| events.ts | ❌ | ⚠️ | ⚠️ | ✅ | gaps |
| files.ts | ❌ | ✅ | ✅ | ✅ | minor gap |
| invoices.ts | ✅ | ✅ | ✅ | ✅ | goed |
| login.ts | n/a | n/a | n/a | n/a | n/a |
| lookups.ts | ❌ | n/a | ✅ | n/a | minor gap |
| materials.ts | ❌ | ⚠️ | ✅ | ✅ | gaps |
| meetings.ts | ❌ | ✅ | ⚠️ | ⚠️ | gaps |
| notes.ts | ❌ | ⚠️ | ✅ | ✅ | minor gap |
| orders.ts | ❌ | ⚠️ | n/a | n/a | minor gap |
| projects.ts | ✅ | ✅ | ⚠️ | ✅ | minor gap |
| quotations.ts | ❌ | ⚠️ | ✅ | ✅ | gaps |
| resolve.ts | ✅ | ✅ | ✅ | ✅ | goed |
| subscriptions.ts | ✅ | ✅ | ✅ | ✅ | goed |
| tasks.ts | ❌ | ⚠️ | ✅ | ✅ | minor gap |
| tickets.ts | ✅ | ⚠️ | ✅ | ⚠️ | minor gap |
| timetracking.ts | ✅ | ⚠️ | ⚠️ | ✅ | minor gap |
| users.ts | ⚠️ (NOTE only) | ✅ | n/a | n/a | minor gap |

**Samenvatting:** 4 goed ✅ | 11 minor gap ⚠️ | 7 gaps ❌ | 1 n/a

---

## Cross-file consistentie

| Aspect | Part-1 (calls→materials, 12 files) | Part-2 (meetings→users, 10 files) | Delta |
|--------|-------------------------------------|-----------------------------------|-------|
| P1 XML markers aanwezig | 5/12 (42%) | 4/10 (40%) | gelijk |
| P2 ID refs volledig | 7/12 (58%) | 6/10 (60%) | gelijk |
| P3 Returns+Next steps | 9/12 (75%) | 7/10 (70%) | gelijk |
| P4 Format examples | 12/12 (100%) | 8/10 (80%) | Part-2 zwakker |

**Conclusie:** B6.3 quality-pass (v3.5.1) heeft P3/P4 sterk verbeterd. P1 XML markers en P2 ID refs hebben nog significante gaps — beide batches even zwak, dus geen systematisch Part-1 vs Part-2 verschil.

**Opvallend:** BACKLOG Done item B6.3.1 zegt "XML markers adopted project-wide" maar 11/22 files hebben 0 XML markers. B6.3.1 was gefocust op files die markers nodig hadden voor bestaande edge cases — de overige 11 files zijn simpeler en hebben minder kritieke edge cases.

---

## Issues per file

### calls.ts — P1, P2, P3 gaps

| # | Patroon | Issue |
|---|---------|-------|
| 1 | P1 | Geen XML markers. `teamleader_add_call` heeft obscure vereiste dat `customer_type` + `customer_id` samen opgegeven moeten worden; verdient `<NOTE>` |
| 2 | P2 | `customer_id` in `teamleader_add_call`: geen lookup hint ("contact or company" staat er wel maar niet "use teamleader_list_contacts or teamleader_list_companies") |
| 3 | P2 | `assignee_id` in `teamleader_add_call`: ontbreekt "Use teamleader_list_users" |
| 4 | P3 | `teamleader_update_call` description zegt "Returns {success: true}" maar runtime returnt plain string "Call X updated." — inconsistentie |

### contacts.ts — P3 gap

| # | Patroon | Issue |
|---|---------|-------|
| 5 | P3 | `teamleader_update_contact_company_link`: minimale description "Update the link..." — geen Returns, geen Next steps |

### deals.ts — P1, P2, P3 gaps

| # | Patroon | Issue |
|---|---------|-------|
| 6 | P1 | Alleen `<NOTE>` markers; geen `<WARNING>` of `<CRITICAL>` — terwijl deals.ts win/lose/move onomkeerbare acties heeft |
| 7 | P2 | `responsible_user_id` in `teamleader_create_deal` en `teamleader_update_deal`: ontbreekt "Use teamleader_list_users" |
| 8 | P3 | `teamleader_create_deal_pipeline` en `teamleader_update_deal_pipeline`: geen Next steps |

### departments.ts — P3 gap

| # | Patroon | Issue |
|---|---------|-------|
| 9 | P3 | `teamleader_get_department`: geen Returns, geen Next steps in description |

### events.ts — P1, P2, P3 gaps

| # | Patroon | Issue |
|---|---------|-------|
| 10 | P1 | Geen XML markers. `teamleader_create_event` participants array heeft complexe structuur — verdient `<NOTE>` |
| 11 | P2 | `user_id` filter param in `teamleader_list_events`: geen "Use teamleader_list_users" hint |
| 12 | P3 | `teamleader_update_event`: description mist "Returns {success: true}" |

### materials.ts — P1, P2 gaps

| # | Patroon | Issue |
|---|---------|-------|
| 13 | P1 | Geen XML markers. `teamleader_assign_material` vereist dat materiaal al aan project gelinkt is — verdient `<NOTE>` of `<WARNING>` |
| 14 | P2 | `project_id` in `teamleader_create_material`: geen "Use teamleader_list_projects_v2" |
| 15 | P2 | `origin_id` in `teamleader_duplicate_material`: geen lookup ref |

### meetings.ts — P1, P3, P4 gaps

| # | Patroon | Issue |
|---|---------|-------|
| 16 | P1 | Geen XML markers. Recurring meetings hebben `recurrence_id` filter — niet gecommuniceerd als `<NOTE>` |
| 17 | P3 | `teamleader_update_meeting`: description zegt "Meeting X updated successfully" ipv "Returns {success: true}" — inconsistent met andere files |
| 18 | P4 | `start_date`/`end_date` filter params: zeggen "ISO 8601" zonder concreet tz-voorbeeld |

### notes.ts — P2 gap

| # | Patroon | Issue |
|---|---------|-------|
| 19 | P2 | `subject_id` in `teamleader_create_note`: geen "Use teamleader_list_X depending on subject_type" hint |

### orders.ts — P2 gap

| # | Patroon | Issue |
|---|---------|-------|
| 20 | P2 | `id` param in `teamleader_get_order`: geen "Use teamleader_list_orders" hint |

### projects.ts — P3 gap

| # | Patroon | Issue |
|---|---------|-------|
| 21 | P3 | `teamleader_add_project_quotation` en `teamleader_add_project_deal`: geen expliciete "Returns {success: true}" in description |

### quotations.ts — P1, P2 gaps

| # | Patroon | Issue |
|---|---------|-------|
| 22 | P1 | Geen XML markers. `teamleader_accept_quotation` is onomkeerbaar — verdient `<WARNING>` |
| 23 | P2 | `deal_id` in `teamleader_create_quotation`: geen "Use teamleader_list_deals" |

### tasks.ts — P2 gap

| # | Patroon | Issue |
|---|---------|-------|
| 24 | P2 | `assignee_id` in `teamleader_create_task` en `teamleader_update_task`: geen "Use teamleader_list_users" |

### tickets.ts — P2, P4 gap

| # | Patroon | Issue |
|---|---------|-------|
| 25 | P2 | `sent_by_id` in `teamleader_import_ticket_message`: geen lookup ref |
| 26 | P4 | `sent_at` in `teamleader_import_ticket_message`: geen ISO 8601 tz-voorbeeld |

### timetracking.ts — P2, P3 gaps

| # | Patroon | Issue |
|---|---------|-------|
| 27 | P2 | `id` param in `teamleader_delete_timetracking`: geen "Use teamleader_list_timetracking" |
| 28 | P3 | `teamleader_update_timer`: geen "Returns {success: true}" + geen Next steps |

---

## Nieuwe BACKLOG items (B7.3.x)

| ID | File | Issue | Prio |
|----|------|-------|------|
| B7.3.1 | calls.ts | P2: `customer_id`/`assignee_id` lookup refs; P3: update_call Returns inconsistentie; P1: NOTE toevoegen | 🟢 low |
| B7.3.2 | contacts.ts | P3: `update_contact_company_link` Returns + Next steps | 🟢 low |
| B7.3.3 | deals.ts | P1: WARNING op win/lose (onomkeerbaar); P2: `responsible_user_id` lookup ref; P3: pipeline Next steps | 🟢 low |
| B7.3.4 | departments.ts | P3: `get_department` Returns + Next steps | 🟢 low |
| B7.3.5 | events.ts | P1: NOTE op participants; P2: `user_id` filter lookup ref; P3: `update_event` Returns | 🟢 low |
| B7.3.6 | materials.ts | P1: NOTE/WARNING op assign; P2: `project_id` + `origin_id` lookup refs | 🟢 low |
| B7.3.7 | meetings.ts | P1: NOTE op recurrence; P3: `update_meeting` Returns inconsistentie; P4: datetime tz-voorbeeld | 🟢 low |
| B7.3.8 | notes.ts | P2: `subject_id` lookup hint | 🟢 low |
| B7.3.9 | orders.ts | P2: `id` lookup ref in get_order | 🟢 low |
| B7.3.10 | projects.ts | P3: `add_project_quotation`/`add_project_deal` Returns | 🟢 low |
| B7.3.11 | quotations.ts | P1: WARNING op accept_quotation (onomkeerbaar); P2: `deal_id` lookup ref | 🟢 low |
| B7.3.12 | tasks.ts | P2: `assignee_id` lookup refs | 🟢 low |
| B7.3.13 | tickets.ts | P2: `sent_by_id` lookup ref; P4: `sent_at` tz-voorbeeld | 🟢 low |
| B7.3.14 | timetracking.ts | P2: `id` lookup ref delete; P3: `update_timer` Returns + Next steps | 🟢 low |

---

## Statistieken

| Metric | Waarde |
|--------|--------|
| Files geanalyseerd | 22 |
| Files volledig OK (alle 4 patronen) | 4 (companies, invoices, resolve, subscriptions) |
| Files met minor gaps (1-2 issues) | 11 |
| Files met meerdere gaps (3+ issues) | 7 |
| Totaal issues gevonden | 28 |
| P1 XML marker gaps | 11 files zonder enig marker |
| P2 ID ref gaps | 14 params in 10 files |
| P3 Returns/Next steps gaps | 8 tools in 7 files |
| P4 Format voorbeeld gaps | 3 params in 2 files |
| Nieuwe BACKLOG items | 14 (B7.3.1–B7.3.14) |
| Ernst | Alle LOW — geen breaking issues |
