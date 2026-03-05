# Testing Checklist — Teamleader Focus MCP

Status: ✅ Tested | ⚠️ Partial | ❌ Not tested | 🐛 Bug found | 📋 Planned (not yet implemented)

---

## Core Resolution Tools

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_find_task` | Company resolve (cache miss) | ✅ | |
| `teamleader_find_task` | Company resolve (cache hit) | ✅ | |
| `teamleader_find_task` | Group found in 1 project → auto-pick | ✅ | Ontwikkeling → auto-picked Access Application |
| `teamleader_find_task` | Group found in multiple projects → ask project_selection | ✅ | Barucci: 5 projects with "Support" group → project_selection=N |
| `teamleader_find_task` | Group not found → ask confirm_create_group | ✅ | Fixed v1.3.2: projectGroups.create (was projectLines.create → 404) |
| `teamleader_find_task` | Task: 1 exact match → auto-pick | ✅ | Tijdregistratie: Ontwikkeling |
| `teamleader_find_task` | Task: multiple matches → ask task_selection | ✅ | Collection → 4 matches shown |
| `teamleader_find_task` | Task: no match, tasks exist → ask confirm_create_task | ✅ | Shows existing tasks + asks confirm_create_task=true |
| `teamleader_find_task` | No projects for company → ask confirm_create_project | ✅ | Fixed v1.3.2: BV Antwerp Nightlife Center → project + group + task created end-to-end |
| `teamleader_find_task` | Task: no tasks in group → auto-create | ✅ | Confirmed: empty group → task auto-created without confirm_create_task |
| `teamleader_find_task` | only_open=false includes done tasks | ✅ | BRN Support: 2 done tasks shown; default only_open=true → hidden |
| `teamleader_load_tasks` | Full tree load (cache miss) | ✅ | Tested on BV Belgian Recycle Network |
| `teamleader_load_tasks` | Cache hit (30 min TTL) | ✅ | |
| `teamleader_load_tasks` | visual=true ASCII tree | ✅ | |
| `teamleader_load_tasks` | only_open=false includes done | ✅ | Fixed: done=[x] cancelled=[-] icons added |
| `teamleader_load_tasks` | force_refresh=true | ✅ | Tested: bypasses 30min cache, reloads from API |
| `teamleader_load_tasks` | task_selection=N caches task | ✅ | visual=true → task_selection=1 → flat cache hit confirmed |
| `teamleader_load_tasks` | project_filter / group_filter | ✅ | Both filter correctly on partial match |
| `teamleader_load_tasks` | YAML file written correctly | ✅ | ~/.teamleader-tasks-bv-belgian-recycle-network.yaml |
| `teamleader_load_tasks` | on_hold projects included | ✅ | Fixed: was filtering only active |

## Time Logging

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_log_time` | task_name from flat cache | ✅ | Basic flow tested |
| `teamleader_log_time` | task_id shortcut (1st call, tree fresh) | ✅ | Path + entry correct |
| `teamleader_log_time` | task_id shortcut (after tree invalidated) | ✅ | Fixed v1.3.1: verification via timeTracking.info after add |
| `teamleader_log_time` | Tree fallback (scoreTasksInTree) | ✅ | Ambiguous task_name → scored list shown |
| `teamleader_log_time` | confirm_task_match=N | ✅ | Pick from list, full path shown, entry created |
| `teamleader_log_time` | HH:MM time format | ✅ | |
| `teamleader_log_time` | YYYY-MM-DD HH:MM format | ✅ | |
| `teamleader_log_time` | Exact duplicate blocked | ✅ | |
| `teamleader_log_time` | Overlap warning + confirm_overlap | ✅ | |
| `teamleader_log_time` | force=true skips dedup | ✅ | Duplicate blocked without force; second entry created with force=true |
| `teamleader_log_time` | date param (past date with HH:MM times) | ✅ | Entry created on 2026-03-01 via date="2026-03-01" + HH:MM |
| `teamleader_log_time` | work_type_id from task cache | ✅ | Verified: task tree + flat cache both propagate work_type_id |
| `teamleader_log_time` | description stored | ✅ | Verified via list |

## Task Maintenance

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_task_action` | close (task_id) | ✅ | `tasks.update` confirmed working |
| `teamleader_task_action` | close (task_number from tree) | ✅ | Fixed v1.3.1: filter open tasks in resolveTaskFromTree |
| `teamleader_task_action` | create (project_id + group_id) | ✅ | |
| `teamleader_task_action` | create (project_id only, no group) | ✅ | Task created at project level, no group_id needed |
| `teamleader_task_action` | move_time | ✅ | delete + recreate on new task, verified via get_timetracking |
| `teamleader_task_action` | delete_group | ✅ | Fixed v1.3.2: projectGroups.delete + delete_strategy param |
| `teamleader_task_action` | move_to_group | ✅ | New v1.3.3: projectLines.addToGroup — moves task to different group |
| `teamleader_task_action` | tree cache invalidated after close | ✅ | invalidateTaskTree called |
| `teamleader_task_action` | tree cache invalidated after create | ✅ | invalidateTaskTree called |
| `teamleader_task_action` | tree cache invalidated after delete_group | ✅ | invalidateTaskTree called |

## Tasks (Legacy API)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_tasks` | Basic list (no filter) | ❌ | |
| `teamleader_list_tasks` | Filter by customer_id + customer_type | ❌ | |
| `teamleader_list_tasks` | Filter by term | ❌ | |
| `teamleader_create_task` | Create (description only) | ❌ | |
| `teamleader_create_task` | Create with assignee + due_on + work_type | ❌ | |
| `teamleader_create_task` | Create linked to customer | ❌ | |

## Time Tracking (raw)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_timetracking` | Basic list (no filter) | ✅ | Returns oldest-first |
| `teamleader_list_timetracking` | Filter by user_id | ✅ | |
| `teamleader_list_timetracking` | Filter by started_after | ✅ | |
| `teamleader_list_timetracking` | Filter by started_before | ❌ | |
| `teamleader_list_timetracking` | Filter by subject_id | ❌ | |
| `teamleader_get_timetracking` | Get by ID | ✅ | Returns full entry incl. meta.updatable |
| `teamleader_add_timetracking` | Add entry (via log_time) | ✅ | Indirect |
| `teamleader_update_timetracking` | Update description | ✅ | Returns {} (normal for Teamleader updates) |
| `teamleader_update_timetracking` | Update times | ❌ | |
| `teamleader_delete_timetracking` | Delete entry | ✅ | |
| `teamleader_start_timer` | Start running timer | ❌ | |
| `teamleader_stop_timer` | Stop running timer | ❌ | |

## Cache Management

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_cache_stats` | Shows correct counts | ✅ | |
| `teamleader_cache_stats` | company_filter works | ❌ | |
| `teamleader_clear_cache` | Clears all data | ✅ | |
| Auto-prune on save | Expired entries removed | ❌ | |

## Projects

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_projects_v2` | Basic list | ❌ | |
| `teamleader_list_projects_v2` | Filter by status | ❌ | |
| `teamleader_list_projects_v2` | Filter by company_id | ❌ | |
| `teamleader_get_project_v2` | Get by ID | ❌ | |
| `teamleader_create_project_v2` | Create | ❌ | |
| `teamleader_update_project_v2` | Update status | ❌ | |
| `teamleader_list_project_groups` | List groups | ❌ | |
| `teamleader_list_project_tasks_v2` | List tasks | ❌ | |
| `teamleader_create_project_task_v2` | Create task | ❌ | |
| `teamleader_create_project_group` | Create group | ❌ | |

## CRM

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_companies` | Basic list | ❌ | |
| `teamleader_get_company` | Get by ID | ❌ | |
| `teamleader_create_company` | Create | ❌ | |
| `teamleader_list_contacts` | Basic list | ❌ | |
| `teamleader_get_contact` | Get by ID | ❌ | |
| `teamleader_create_contact` | Create | ❌ | |
| `teamleader_update_contact` | Update | ❌ | |
| `teamleader_list_deals` | Basic list | ❌ | |
| `teamleader_get_deal` | Get by ID | ❌ | |
| `teamleader_create_deal` | Create | ❌ | |
| `teamleader_update_deal` | Update | ❌ | |

## Subscriptions

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_subscriptions` | Basic list (no filter) | ✅ | Returns billing_cycle + next_renewal_date + total |
| `teamleader_list_subscriptions` | Filter by status=active | ✅ | Correct results |
| `teamleader_list_subscriptions` | Filter by status=deactivated | ✅ | |
| `teamleader_get_subscription` | Get by ID | ✅ | Returns grouped_lines, payment_term, invoice_generation, document_template |
| `teamleader_create_subscription` | Create (billing_cycle, lines, payment_term) | ⚠️ | Schema correct; test blocked by MCP tool call type coercion (numbers as strings) — works in production |
| `teamleader_update_subscription` | Update note | ✅ | Note updated + verified via get |
| `teamleader_update_subscription` | Clear note (empty string) | 🐛 | API returns 400 "note must not be empty" → fixed: empty string → null |
| `teamleader_deactivate_subscription` | Deactivate already-deactivated | ✅ | Idempotent — no error |

## Invoices & Events

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_invoices` | Filter by customer (company) | ✅ | Returns all 8 invoices for S&D Boetiek in 1 call |
| `teamleader_get_invoice` | Get by ID | ❌ | |
| `teamleader_create_invoice` | Create draft | ❌ | |
| `teamleader_list_events` | Basic list | ❌ | |
| `teamleader_get_event` | Get by ID | ❌ | |
| `teamleader_create_event` | Create | ❌ | |

## Users (task 01 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_users` | Basic list | ❌ | |
| `teamleader_list_users` | Filter by team_id | ❌ | |
| `teamleader_get_user` | Get by ID | ❌ | |

## Tickets (task 02 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_tickets` | Basic list | ❌ | |
| `teamleader_list_tickets` | Filter by status / team / assignee | ❌ | |
| `teamleader_get_ticket` | Get by ID (incl. messages) | ❌ | |
| `teamleader_create_ticket` | Create (subject, customer, team_id) | ❌ | |
| `teamleader_update_ticket` | Update status / assignee | ❌ | |
| `teamleader_reply_ticket` | Reply (external message) | ❌ | |
| `teamleader_internal_ticket` | Add internal note | ❌ | |
| `teamleader_get_ticket_message` | Get single message by ID | ❌ | |

## Invoices — workflow (task 03 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_book_invoice` | Book draft invoice | ❌ | |
| `teamleader_send_invoice` | Send via email | ❌ | |
| `teamleader_delete_invoice` | Delete draft | ❌ | |
| `teamleader_update_invoice` | Update line items / dates | ❌ | |
| `teamleader_add_payment` | Register payment | ❌ | |
| `teamleader_credit_invoice` | Full credit note | ❌ | |
| `teamleader_credit_invoice_partially` | Partial credit note | ❌ | |
| `teamleader_copy_invoice` | Copy to new draft | ❌ | |
| `teamleader_list_mail_templates` | List mail templates | ❌ | |
| `teamleader_list_payment_methods` | List payment methods | ❌ | |

## Meetings (task 04 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_meetings` | Basic list | ❌ | |
| `teamleader_get_meeting` | Get by ID | ❌ | |
| `teamleader_schedule_meeting` | Schedule new meeting | ❌ | |
| `teamleader_complete_meeting` | Mark as completed | ❌ | |
| `teamleader_delete_meeting` | Delete | ❌ | |
| `teamleader_update_meeting` | Update details | ❌ | |
| `teamleader_add_meeting_report` | Add report/notes to meeting | ❌ | |

## Standalone Tasks — complete (task 05 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_get_task` | Get by ID | ❌ | |
| `teamleader_update_task` | Update description / due date | ❌ | |
| `teamleader_delete_task` | Delete | ❌ | |
| `teamleader_complete_task` | Mark as completed | ❌ | |
| `teamleader_reopen_task` | Reopen completed task | ❌ | |
| `teamleader_schedule_task` | Schedule task | ❌ | |

## Deals — workflow (task 06 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_delete_deal` | Delete deal | ❌ | |
| `teamleader_lose_deal` | Mark as lost (reason_id optional) | ❌ | |
| `teamleader_win_deal` | Mark as won | ❌ | |
| `teamleader_move_deal` | Move to different phase | ❌ | |
| `teamleader_list_lost_reasons` | List lost reason IDs | ❌ | |
| `teamleader_list_deal_phases` | List deal phase IDs | ❌ | |
| `teamleader_list_deal_sources` | List deal source IDs | ❌ | |
| `teamleader_list_deal_pipelines` | List deal pipeline IDs | ❌ | |

## Departments (task 07 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_departments` | Basic list | ❌ | |
| `teamleader_get_department` | Get by ID | ❌ | |

## Companies + Contacts — extended CRUD (task 08 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_update_company` | Update company details | ❌ | |
| `teamleader_delete_contact` | Delete contact | ❌ | |
| `teamleader_link_contact_to_company` | Link contact to company | ❌ | |
| `teamleader_unlink_contact_from_company` | Unlink contact from company | ❌ | |
| `teamleader_update_contact_company_link` | Update link (role/position) | ❌ | |
| `teamleader_tag_contact` | Add tag to contact | ❌ | |
| `teamleader_untag_contact` | Remove tag from contact | ❌ | |

## Lookup Lists (task 09 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_activity_types` | List activity types (for events) | ❌ | |
| `teamleader_list_tax_rates` | List tax rates (for invoices) | ❌ | |
| `teamleader_list_payment_terms` | List payment terms | ❌ | |
| `teamleader_list_ticket_statuses` | List ticket statuses | ❌ | |
| `teamleader_list_products` | List products (for invoice line items) | ❌ | |
| `teamleader_list_product_categories` | List product categories | ❌ | |

## Projects — lifecycle (task 10 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_close_project` | Close project | ❌ | |
| `teamleader_reopen_project` | Reopen project | ❌ | |
| `teamleader_delete_project` | Delete project | ❌ | |
| `teamleader_duplicate_project` | Duplicate project | ❌ | |
| `teamleader_add_customer_to_project` | Add customer relationship | ❌ | |
| `teamleader_remove_customer_from_project` | Remove customer relationship | ❌ | |
| `teamleader_add_deal_to_project` | Link deal to project | ❌ | |
| `teamleader_remove_deal_from_project` | Unlink deal from project | ❌ | |
| `teamleader_add_owner_to_project` | Add owner/member | ❌ | |
| `teamleader_remove_owner_from_project` | Remove owner/member | ❌ | |
| `teamleader_update_project_group` | Update group/phase details | ❌ | |
| `teamleader_complete_project_task` | Mark task as done | ❌ | |
| `teamleader_reopen_project_task` | Reopen done task | ❌ | |
| `teamleader_delete_project_task` | Delete task | ❌ | |
| `teamleader_remove_task_from_group` | Move task out of group | ❌ | |

## Timers — complete (task 11 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_current_timer` | Get currently running timer | ❌ | |
| `teamleader_update_timer` | Update running timer description | ❌ | |
| `teamleader_resume_timetracking` | Resume a past time entry | ❌ | |

## Files (task 12 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_files` | List files for subject | ❌ | |
| `teamleader_get_file` | Get file metadata by ID | ❌ | |
| `teamleader_download_file` | Get download URL | ❌ | |
| `teamleader_delete_file` | Delete file | ❌ | |
| `teamleader_upload_file` | Upload file (multipart — needs client.ts extension) | ❌ | |

## Misc Lookups (task 13 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_teams` | List teams (for tickets) | ❌ | |
| `teamleader_list_tags` | List tags (for contacts/companies) | ❌ | |
| `teamleader_list_expenses` | List expense entries | ❌ | |

## Notes (task 14 — not yet implemented)

| Tool | Test | Status | Notes |
|------|------|--------|-------|
| `teamleader_list_notes` | List notes for contact/company/deal | ❌ | |
| `teamleader_create_note` | Create note on subject | ❌ | |

---

## Known API Quirks (documented)

| Endpoint | Quirk |
|----------|-------|
| `projectLines.list` | `project_id` top-level in body, NOT inside `filter` |
| `projectLines.list` | `project_group_id` NOT a server filter — must filter client-side on `l.group?.id` |
| `tasks.list` | status filter is client-side only |
| `tasks.create` | use `group_id` not `project_group_id` |
| `timeTracking.list` | returns `subject.type: "todo"` — ID differs from `nextgenTask` ID |
| `timeTracking.add` | strip milliseconds: `.replace(/\.\d+Z$/, "+00:00")` |
| `projects-v2/projects.create` | Created project has status `"open"` (not `"active"`) |
| `projects-v2/projectLines.create` | Does NOT exist — was wrong endpoint. Use `projectGroups.create` for groups and `tasks.create` for tasks |
| `projects-v2/projectGroups.delete` | Requires `delete_strategy` param: `"ungroup_tasks_and_materials"` or `"delete_tasks_and_materials"` |
| `subscriptions.list` | Uses `billing_cycle.periodicity.{unit,period}` + `days_in_advance` (NOT `renewal_period`) |
| `subscriptions.list` | `next_renewal_date` (not `next_renewal_on`); no customer filter → filter client-side on `invoicee.customer.id` (unlike invoices.list which has filter.customer) |
| `subscriptions.info` | `unit_price.tax: "excluding"` in line_items (string, NOT currency field) — same as invoices.creditPartially |
| `subscriptions.info` | Tax field in line_items = `{type: "taxRate", id: "..."}` (not flat `tax_rate_id`) |
| `subscriptions.update` | `note: ""` (empty string) → 400 "must not be empty" — use `null` to clear |
| `subscriptions.deactivate` | Idempotent — deactivating already-deactivated subscription returns success |
| `invoices.registerPayment` | Uses `paid_at` (not `payment_date`), nested `payment` object (not flat params) |
| `invoices.creditPartially` | `unit_price.tax: "excluding"` (not a currency field) |
| `tickets.list` | Customer filter = `relates_to: {type, id}`, status filter = `exclude.status_ids` array |
| `projects.close` | Requires `closing_strategy` param |
| `projects.delete` | Requires `delete_strategy` param |
| `projects.assign` | Uses `assignee: {type, id}` object |
| `projects.addCustomer` | Uses `customer: {type, id}` object |
| `projectGroups.update` | Uses `start_date`/`end_date` (not `starts_on`/`due_on`) |
| `files.upload` | Two-step: get pre-signed URL via API, then binary POST to that URL (no auth needed) |

---

## Known Bugs

### ✅ BUG-01: log_time task_id after tree invalidation — FIXED (v1.3.1)
**Status:** Fixed (03/03/2026)
**Symptom (old):** After `task_action` invalidates tree → `log_time` with `task_id` returned success but entry was 404.
**Root cause:** Silent API acceptance without verification.
**Fix:** Added `timeTracking.info` verification after `timeTracking.add`. If entry not found → clear error with body sent + force_refresh suggestion.
**Verified:** task_action create → log_time task_id → timeTracking.info ✅ entry exists.

---

## Priority Testing Queue

All high-priority items tested. Remaining ❌ are raw API wrappers (CRM, Invoices, Events, Legacy Tasks) with no custom logic.
