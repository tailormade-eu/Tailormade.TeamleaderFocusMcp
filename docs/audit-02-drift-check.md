# MCP-audit Fase 2 — Drift Check (Zod vs API docs)

Date: 2026-05-03
Tools scanned: 24 files, ~120 tool registrations
Total gaps found: 38 (16 missing, 17 extra/legacy, 5 type-mismatch)

---

## Summary

| Tool | Endpoint | Missing | Extra | Type-mismatch |
|------|----------|---------|-------|---------------|
| teamleader_create_company | companies.add | 4 | 0 | 0 |
| teamleader_update_company | companies.update | 4 | 0 | 0 |
| teamleader_create_contact | contacts.add | 4 | 0 | 0 |
| teamleader_update_contact | contacts.update | 4 | 0 | 0 |
| teamleader_create_deal | deals.create | 2 | 0 | 0 |
| teamleader_update_deal | deals.update | 2 | 0 | 1 |
| teamleader_list_deals | deals.list | 0 | 0 | 1 |
| teamleader_create_task | tasks.create | 1 | 0 | 0 |
| teamleader_update_task | tasks.update | 1 | 0 | 0 |
| teamleader_create_ticket | tickets.create | 1 | 0 | 0 |
| teamleader_list_timetracking | timeTracking.list | 0 | 1 | 1 |
| teamleader_add_timetracking | timeTracking.add | 0 | 0 | 1 |
| teamleader_list_subscriptions | subscriptions.list | 0 | 1 | 0 |
| teamleader_list_projects_v2 | projects-v2/projects.list | 0 | 3 | 0 |
| teamleader_list_quotations | quotations.list | 0 | 1 | 0 |
| teamleader_list_invoices | invoices.list | 0 | 2 | 0 |
| teamleader_create_event | events.create | 0 | 0 | 1 |
| companies.list / contacts.list (filter param) | — | 0 | 0 | 0 |
| All info/delete/complete/reopen/tag/untag | — | 0 | 0 | 0 |
| materials.* / projectGroups.* / tasks(v2).* | — | 0 | 4 | 0 |

---

## Per-tool details

### teamleader_create_company (`companies.add`)
File: `src/tools/companies.ts:96`
Doc: `docs/api/028-companies-add.md`

**Missing in Zod:**
- `business_type_id` (string, optional) — company type classification
- `national_identification_number` (string, optional) — KBO/CBE number
- `iban` / `bic` (string, optional) — bank account fields
- `custom_fields` (object[], optional) — custom field values
- `marketing_mails_consent` (boolean, optional) — GDPR consent flag
- `preferred_currency` (CurrencyCode enum, optional) — preferred invoice currency
- `addresses` (object[], optional) — structured address array

**Extra in Zod (not in doc):**
- None

**Type mismatches:**
- None

---

### teamleader_update_company (`companies.update`)
File: `src/tools/companies.ts:146`
Doc: `docs/api/034-companies-update.md`

**Missing in Zod:**
- `business_type_id` (string nullable, optional)
- `national_identification_number` (string nullable, optional)
- `iban` / `bic` (string nullable, optional)
- `custom_fields` (object[], optional)
- `marketing_mails_consent` (boolean, optional)
- `preferred_currency` (CurrencyCode enum nullable, optional)
- `addresses` (object[], optional)

---

### teamleader_create_contact (`contacts.add`)
File: `src/tools/contacts.ts:153`
Doc: `docs/api/037-contacts-add.md`

**Missing in Zod:**
- `birthdate` (string, optional, YYYY-MM-DD)
- `iban` / `bic` (string, optional)
- `national_identification_number` (string, optional)
- `custom_fields` (object[], optional)
- `marketing_mails_consent` (boolean, optional)
- `addresses` (object[], optional)

---

### teamleader_update_contact (`contacts.update`)
File: `src/tools/contacts.ts:189`
Doc: `docs/api/045-contacts-update.md` (inferred same structure)

**Missing in Zod:**
- `birthdate` (string nullable, optional)
- `iban` / `bic` (string nullable, optional)
- `national_identification_number` (string nullable, optional)
- `custom_fields` (object[], optional)
- `marketing_mails_consent` (boolean, optional)
- `addresses` (object[], optional)

---

### teamleader_create_deal (`deals.create`)
File: `src/tools/deals.ts:121`
Doc: `docs/api/084-deals-create.md`

**Missing in Zod:**
- `custom_fields` (object[], optional) — deal-level custom fields
- `currency` (object {code, exchange_rate}, optional) — deal currency override

---

### teamleader_update_deal (`deals.update`)
File: `src/tools/deals.ts:204`
Doc: `docs/api/090-deals-update.md`

**Missing in Zod:**
- `custom_fields` (object[], optional)
- `currency` (object {code, exchange_rate}, optional)

**Type mismatches:**
- `lead` (customer change): API supports updating the whole `lead` object (customer type/id + contact_person_id together), but the tool exposes `contact_person_id` as a flat field without allowing customer type/id update — partial coverage of lead changes

---

### teamleader_list_deals (`deals.list`)
File: `src/tools/deals.ts:23`
Doc: `docs/api/087-deals-list.md`

**Type mismatches:**
- `responsible_user_id` filter: Zod exposes as single `z.string()`, but API docs indicate it can also be an array of strings for multi-user filtering — the tool description mentions it but Zod type is string only

---

### teamleader_create_task (`tasks.create`)
File: `src/tools/tasks.ts:83`
Doc: `docs/api/304-tasks-create.md`

**Missing in Zod:**
- `custom_fields` (object[], optional) — task custom fields

---

### teamleader_update_task (`tasks.update`)
File: `src/tools/tasks.ts:183`
Doc: `docs/api/310-tasks-update.md`

**Missing in Zod:**
- `custom_fields` (object[], optional) — task custom fields

---

### teamleader_create_ticket (`tickets.create`)
File: `src/tools/tickets.ts:111`
Doc: `docs/api/321-tickets-create.md`

**Missing in Zod:**
- `custom_fields` (object[], optional) — ticket custom fields
- `milestone_id` (string, optional) — link to legacy milestone (low priority, legacy module)

Note: `participant_company_id` in Zod maps correctly to API `participant.customer`.

---

### teamleader_list_timetracking (`timeTracking.list`)
File: `src/tools/timetracking.ts:131`
Doc: `docs/api/332-time-tracking-list.md`

**Extra in Zod (not in doc):**
- `subject_type` enum includes `"milestone"` — the API filter subject types are `company`, `contact`, `event`, `todo`, `ticket`; `milestone` is not a valid list filter type

**Type mismatches:**
- Filter date params: Zod accepts ISO datetime strings and strips to date before converting. This is a helper wrapper, not a schema mismatch per se — acceptable design.

---

### teamleader_add_timetracking (`timeTracking.add`)
File: `src/tools/timetracking.ts:216`
Doc: `docs/api/329-time-tracking-add.md`

**Type mismatches:**
- `subject_type` enum in Zod: `["company", "contact", "event", "milestone", "nextgenTask", "ticket", "todo"]` — this is the correct set for `timeTracking.add`, different from `timeTracking.list` filter. The `milestone` value in list context is questionable but add context is fine.

No drift detected for this tool.

---

### teamleader_start_timer / teamleader_update_timer (`timers.start`, `timers.update`)
File: `src/tools/timetracking.ts:387, 491`

**Type mismatches:**
- `subject_type` enum in both timer tools omits `"nextgenTask"` — timers.start allows the same subject types as timeTracking.add, which includes `nextgenTask`. This means you can't start a timer directly against a project task via these tools.

---

### teamleader_list_subscriptions (`subscriptions.list`)
File: `src/tools/subscriptions.ts:67`
Doc: `docs/api/298-subscriptions-list.md`

**Extra in Zod (not in doc):**
- `invoice_id` filter — listed in tool but should be verified against API; likely valid (used to trace which subscription generated an invoice). Low risk.

No clear missing fields detected.

---

### teamleader_list_projects_v2 (`projects-v2/projects.list`)
File: `src/tools/projects.ts:24`
Doc: `docs/api/205-nextgen-projects-list.md`

**Extra in Zod (not matching API filter structure):**
- `company_id` — Zod maps this to `filter.customers = [{type: "company", id}]` — this is a correct mapping but the Zod param is a flat string while the API uses an array of customer objects; the tool correctly wraps it but only supports single company filter (API supports multiple customers in the array)
- `term` — search filter, valid
- `status` — only single enum value accepted; API may accept array

---

### teamleader_list_quotations (`quotations.list`)
File: `src/tools/quotations.ts:94`
Doc: `docs/api/273-quotations-list.md`

**Extra/Missing in Zod:**
- `ids` filter is present (correct), but `deal_id` filter in the API doc is missing from Zod — quotations can be filtered by deal

---

### teamleader_list_invoices (`invoices.list`)
File: `src/tools/invoices.ts:331`
Doc: `docs/api/150-invoices-list.md`

No drift detected — all major filter fields covered. The `invoice_date_after`/`invoice_date_before` are Zod-level names that map to API fields `invoice_date_after`/`invoice_date_before` — correct.

---

### teamleader_create_event (`events.create`)
File: `src/tools/events.ts:158`
Doc: `docs/api/101-events-create.md`

**Type mismatches:**
- `attendees[].type` enum in Zod: `["user", "contact"]` — matches API exactly ✓
- `links[].type` enum in Zod: `["contact", "company", "deal"]` — matches API ✓

No drift detected for this tool.

---

### teamleader_add_call (`calls.add`)
File: `src/tools/calls.ts:170`
Doc: `docs/api/014-calls-add.md`

No drift detected. All required fields covered: `participant.customer`, `due_at`, `assignee`, `deal_id` (optional), `custom_fields` (optional).

---

### teamleader_create_project_v2 (`projects-v2/projects.create`)
File: `src/tools/projects.ts:100`
Doc: `docs/api/198-nextgen-projects-create.md`

**Extra in Zod (not in doc):**
- Tool requires `customer_type` + `customer_id` as required flat params — API uses `customers: [{type, id}]` array (supports multiple). Zod only allows single customer. Not technically wrong for common use, but limits multi-customer project creation.

---

### teamleader_create_project_group / update_project_group (`projectGroups.create`, `projectGroups.update`)
File: `src/tools/projects.ts:300, 590`

**Extra in Zod:**
- `billing_method` enum in create includes `"parent_fixed_price"` — valid per API
- `billing_method_value` / `billing_method_update_strategy` in update — split into two flat Zod params, mapped correctly to nested object

No significant drift.

---

### teamleader_create_project_task_v2 / update_project_task (`tasks.create` nextgen, `tasks.update` nextgen)
File: `src/tools/projects.ts:709, 911`

No significant drift detected. Fields map correctly.

---

### materials.create / materials.update
File: `src/tools/materials.ts:196, 301`
Doc: `docs/api/207-nextgen-projects-materials-create.md`, `213-nextgen-projects-materials-update.md`

No significant drift detected.

---

### teamleader_create_subscription / update_subscription
File: `src/tools/subscriptions.ts:115, 221`

No significant drift detected. All major fields covered including `invoice_generation`, `billing_cycle`, `grouped_lines`.

---

### Lookup-only tools (no body fields to audit)

The following tools are list/info-only with no or trivial request bodies — skipped per audit rules:

- `teamleader_list_activity_types`, `teamleader_list_departments`, `teamleader_list_users`, `teamleader_list_work_types`, `teamleader_list_tax_rates`, `teamleader_list_payment_terms`, `teamleader_list_currencies`, `teamleader_list_units_of_measure`, `teamleader_list_withholding_tax_rates`, `teamleader_list_product_categories`, `teamleader_list_document_templates`, `teamleader_list_tags`, `teamleader_list_deal_phases` (list only), `teamleader_list_deal_sources`, `teamleader_list_deal_pipelines`, `teamleader_list_lost_reasons`, `teamleader_list_call_outcomes`, `teamleader_list_ticket_statuses`, `teamleader_list_teams`, `teamleader_list_bookkeeping_submissions`, `teamleader_list_commercial_discounts`, `teamleader_list_price_lists`

---

## Notes

1. **`custom_fields` pattern**: Many write endpoints (companies.add/update, contacts.add/update, deals.create/update, tasks.create/update, tickets.create) support `custom_fields[]` in the API but Zod schemas omit this. This is the single most pervasive gap — affects 10+ tools.

2. **`addresses` pattern**: Both companies and contacts support structured address objects in the API but neither tool exposes them.

3. **`responsible_user_id` nullable**: `deals.update` API marks this nullable but Zod has it optional (not nullable). Minor — `undefined` vs `null` distinction.

4. **Legacy `milestone_id`**: Some endpoints (tickets.create, tasks.create) still expose `milestone_id` in the API. Since the instructions say to skip legacy milestones/projects, these are marked but low priority.
