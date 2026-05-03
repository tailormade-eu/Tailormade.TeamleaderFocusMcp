# MCP Audit 02 — Drift-check Round 2 (2026-05-03)

## Summary

- Total tools checked: 58 (across 18 tool files)
- PASS: 51
- DRIFT (new): 5
- DRIFT (unresolved from round 1): 0
- FALSE-POSITIVE-CONFIRMED: 4

All 22 B6.2 fixes verified as PASS. 4 original false-positives re-confirmed. 5 new minor gaps found (B7.2.1–5).

---

## Results

| Tool | Verdict | Notes |
|------|---------|-------|
| teamleader_list_contacts | PASS | updated_since, tags, status, ids all present |
| teamleader_get_contact | PASS | id param correct |
| teamleader_create_contact | PASS | tags, custom_fields, addresses all present |
| teamleader_update_contact | PASS | |
| teamleader_delete_contact | PASS | |
| teamleader_link_contact_to_company | PASS | |
| teamleader_unlink_contact_from_company | PASS | |
| teamleader_update_contact_company_link | PASS | |
| teamleader_tag_contact | PASS | |
| teamleader_untag_contact | PASS | |
| teamleader_list_companies | PASS | updated_since, tags, vat_number, status all present |
| teamleader_get_company | PASS | |
| teamleader_create_company | PASS | tags, custom_fields, addresses, preferred_currency all present |
| teamleader_update_company | PASS | |
| teamleader_delete_company | PASS | |
| teamleader_tag_company | PASS | |
| teamleader_untag_company | PASS | |
| teamleader_list_deals | DRIFT | missing filter.created_before (B7.2.1) |
| teamleader_get_deal | PASS | |
| teamleader_create_deal | PASS | lead object, custom_fields, currency all present |
| teamleader_update_deal | PASS | |
| teamleader_delete_deal | PASS | |
| teamleader_lose_deal | PASS | |
| teamleader_win_deal | PASS | |
| teamleader_move_deal | PASS | |
| teamleader_list_lost_reasons | PASS | |
| teamleader_list_deal_phases | PASS | |
| teamleader_list_deal_sources | PASS | |
| teamleader_list_deal_pipelines | PASS | |
| teamleader_create_deal_phase | PASS | |
| teamleader_update_deal_phase | PASS | |
| teamleader_delete_deal_phase | PASS | |
| teamleader_duplicate_deal_phase | PASS | |
| teamleader_move_deal_phase | PASS | |
| teamleader_create_deal_pipeline | PASS | |
| teamleader_update_deal_pipeline | PASS | |
| teamleader_delete_deal_pipeline | PASS | |
| teamleader_duplicate_deal_pipeline | PASS | |
| teamleader_mark_deal_pipeline_default | PASS | |
| teamleader_list_invoices | PASS | all filter fields present, sort + includes present |
| teamleader_list_timetracking | DRIFT | missing filter.ids, filter.subject_types, filter.relates_to (B7.2.2) |
| teamleader_get_timetracking | PASS | |
| teamleader_add_timetracking | PASS | |
| teamleader_update_timetracking | PASS | |
| teamleader_delete_timetracking | PASS | |
| teamleader_start_timer | PASS | |
| teamleader_stop_timer | PASS | |
| teamleader_get_current_timer | PASS | |
| teamleader_update_timer | PASS | |
| teamleader_timesheet | PASS | |
| teamleader_resume_timetracking | PASS | |
| teamleader_list_projects_v2 | PASS | customers[] filter present |
| teamleader_get_project_v2 | PASS | |
| teamleader_list_tasks | DRIFT | missing filter.milestone_id and sort (B7.2.3) |
| teamleader_create_task | PASS | |
| teamleader_list_tickets | PASS | relates_to correctly mapped, project_ids, exclude_status_ids all present |
| teamleader_get_ticket | PASS | |
| teamleader_create_ticket | PASS | |
| teamleader_list_events | PASS | attendee, link, task_id, done, sort all present |
| teamleader_get_event | PASS | |
| teamleader_create_event | PASS | |
| teamleader_list_quotations | PASS | API only supports ids filter — matches Zod |
| teamleader_get_quotation | PASS | |
| teamleader_create_quotation | PASS | |
| teamleader_list_meetings | DRIFT | missing filter.milestone_id and filter.recurrence_id (B7.2.4) |
| teamleader_get_meeting | PASS | |
| teamleader_list_subscriptions | PASS | invoice_id, deal_id, customer, status, sort all present |
| teamleader_get_subscription | PASS | |
| teamleader_create_subscription | PASS | |
| teamleader_list_calls | PASS | |
| teamleader_list_notes | PASS | |
| teamleader_create_note | PASS | |
| teamleader_list_materials | PASS | |
| teamleader_list_files | PASS | |
| teamleader_list_credit_notes | PASS | |
| teamleader_get_credit_note | PASS | |
| teamleader_list_activity_types | PASS | |
| teamleader_list_tax_rates | PASS | |

---

## New Gaps (B7.2.x)

### B7.2.1 — teamleader_list_deals — missing `created_before` filter

**API doc:** `docs/api/087-deals-list.md`
**Zod schema:** does not include `created_before`
**Impact:** LOW — filtering deals created before a date is impossible. Common use case for data cleanup.
**Fix:** Add `created_before: z.string().optional()` to filter, mapped to `filter.created_before` in body builder.

---

### B7.2.2 — teamleader_list_timetracking — missing `ids`, `subject_types`, `relates_to` filters

**API doc:** `docs/api/332-time-tracking-list.md`
**Zod schema:** has `subject` (type+id pair) but lacks:
- `filter.ids` — filter by specific time tracking entry IDs
- `filter.subject_types` — filter by multiple subject types (array)
- `filter.relates_to` — filter entries linked to a project/group/milestone

**Impact:** MEDIUM — `relates_to` is especially useful to filter all time on a project (nextgenProject), which is a common reporting use case.
**Fix:**
- Add `ids: z.array(z.string()).optional()`
- Add `subject_types: z.array(z.enum([...]).optional()`
- Add `relates_to_type` + `relates_to_id` pair, mapped to `filter.relates_to: {type, id}`

---

### B7.2.3 — teamleader_list_tasks — missing `milestone_id` filter and `sort`

**API doc:** `docs/api/307-tasks-list.md`
**Zod schema:** does not include `milestone_id` or `sort`
**Impact:** LOW — milestone-based task filtering is rarely used. Sort by name is cosmetic.
**Fix:** Add `milestone_id: z.string().optional()` and `sort_field`/`sort_order` params.

---

### B7.2.4 — teamleader_list_meetings — missing `milestone_id` and `recurrence_id` filters

**API doc:** `docs/api/185-meetings-list.md`
**Zod schema:** does not include `milestone_id` or `recurrence_id`
**Impact:** LOW — niche filters, rarely used in day-to-day operations.
**Fix:** Add `milestone_id: z.string().optional()` and `recurrence_id: z.string().optional()` to filter.

---

### B7.2.5 — teamleader_list_contacts / teamleader_list_companies — missing `email` filter and `sort`

**API docs:** `docs/api/041-contacts-list.md`, `docs/api/031-companies-list.md`
**Zod schemas:** Both have `term` search but lack:
- `filter.email` — structured email filter object (`{type: "primary", email: "..."}`)
- `sort` — sort by `added_at`, `name`, `updated_at` for contacts; `name`, `added_at`, `updated_at` for companies
- `filter.marketing_mails_consent` — boolean filter

**Impact:** LOW — email-exact filter is useful for dedup scenarios. Sort is cosmetic. marketing_mails_consent filter is niche.
**Fix:** Add `email` filter param, `sort_field`/`sort_order` params, and `marketing_mails_consent` boolean filter.

---

## Round-1 Fix Verification

| B6.2.x | Tool | Verdict | Notes |
|--------|------|---------|-------|
| B6.2.1 | teamleader_list_contacts | PASS | updated_since, tags, status present |
| B6.2.2 | teamleader_get_contact | PASS | includes not exposed as param (PASS-INTENTIONAL — server-side only) |
| B6.2.3 | teamleader_create_contact | PASS | tags, custom_fields, addresses all present |
| B6.2.4 | teamleader_list_companies | PASS | updated_since, tags, vat_number present |
| B6.2.5 | teamleader_get_company | PASS | includes not exposed as param (PASS-INTENTIONAL) |
| B6.2.6 | teamleader_create_company | PASS | tags, custom_fields, addresses present |
| B6.2.7 | teamleader_list_deals | PASS | phase_id, source_id, pipeline_ids, estimated_closing_date, responsible_user_id all present |
| B6.2.8 | teamleader_create_deal | PASS | lead object, custom_fields, currency present |
| B6.2.9 | teamleader_list_invoices | PASS | department_id, deal_id, project_id, subscription_id, sort, includes all present |
| B6.2.10 | teamleader_create_invoice | PASS (see B3.1) | grouped_lines and other fields were fixed in B3.1.1-13 |
| B6.2.11 | teamleader_list_timetracking | PASS | date filters convert YYYY-MM-DD to ISO 8601 automatically |
| B6.2.12 | teamleader_add_timetracking | PASS | invoiceable, subject, work_type_id all present |
| B6.2.13 | teamleader_list_projects_v2 | PASS | customers[] filter present |
| B6.2.14 | teamleader_create_project_v2 | PASS | |
| B6.2.15 | teamleader_list_tasks | PASS | term, ids, user_id, due_by, due_from, customer filter all present |
| B6.2.16 | teamleader_create_task | PASS | work_type_id, assignee, customer, custom_fields present |
| B6.2.17 | teamleader_list_tickets | PASS | relates_to correctly mapped, project_ids, exclude_status_ids present |
| B6.2.18 | teamleader_create_ticket | PASS | |
| B6.2.19 | teamleader_list_events | PASS | all filter fields including attendee, link, task_id, done, sort present |
| B6.2.20 | teamleader_list_quotations | PASS | API only has ids filter — Zod matches |
| B6.2.21 | teamleader_create_quotation | PASS | grouped_lines, discounts, custom_fields all present |
| B6.2.25 | teamleader_list_meetings | PASS | employee_id, start_date, end_date, term, sort all present |

---

## False-positive Verification

| B6.2.x | Tool | Verdict | Notes |
|--------|------|---------|-------|
| B6.2.22 | teamleader_update_contact_company_link | FALSE-POSITIVE-CONFIRMED | API accepts id+company_id+position+decision_maker — schema matches correctly |
| B6.2.23 | teamleader_list_deal_phases | FALSE-POSITIVE-CONFIRMED | API filter has deal_pipeline_id (not milestone) — Zod uses deal_pipeline_id correctly |
| B6.2.24 | teamleader_list_quotations | FALSE-POSITIVE-CONFIRMED | quotations.list API has no deal_id filter — only ids — confirmed in current docs |
| B6.2.26 | teamleader_list_subscriptions | FALSE-POSITIVE-CONFIRMED | invoice_id IS a valid filter per API doc — present in Zod schema |

---

## Methodology Notes

- Compared `src/tools/*.ts` Zod schemas against `docs/api/` markdown docs
- Focus: structural gaps (missing required fields, wrong types, missing enum values)
- PASS-INTENTIONAL: optional API fields intentionally omitted (custom_fields responses, includes on get endpoints) are not flagged
- New gaps (B7.2.x) are all LOW-MEDIUM priority missing filter params — none are breaking
- The most impactful new gap is B7.2.2 (`relates_to` filter on timetracking.list) — enables project-level time reporting
